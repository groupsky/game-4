import { simulateCapacitors } from './CapacitorSimulation.js'
import {
  getBatteryVisualState,
  getLEDVisualState,
  getResistorVisualState,
  getCapacitorVisualState,
  getLightBulbVisualState
} from './VisualState.js'
import { GraphAnalyzer } from './GraphAnalyzer.js'
import { simulateCircuit, simulateLightBulb } from './CircuitSolver.js'

export class CircuitSimulator {
  constructor() {
    this.components = []
    this.wires = []
    this.graph = null
  }

  /**
   * Set circuit components and rebuild graph
   * @param {Array} components - Array of component objects with {id, type, ...}
   */
  setComponents(components) {
    this.components = components
    this.graph = new GraphAnalyzer(this.components, this.wires)
  }

  /**
   * Set circuit wires and rebuild graph
   * @param {Array} wires - Array of wire objects with {id, from, to}
   */
  setWires(wires) {
    this.wires = wires
    this.graph = new GraphAnalyzer(this.components, this.wires)
  }

  /**
   * Reset circuit to initial state
   * - Batteries: full charge (1.0)
   * - Capacitors: empty (voltage = 0)
   * - Resistors: cold (current = 0)
   * - LEDs: off (brightness = 0)
   * - Light bulbs: off (brightness = 0, current = 0, power = 0)
   * @param {Array} components - Components to reset
   * @returns {Array} Reset components
   */
  resetCircuit(components) {
    return components.map(comp => {
      const reset = { ...comp }

      if (comp.type === 'battery') {
        reset.charge = 1.0 // Full charge
      } else if (comp.type === 'capacitor') {
        reset.voltage = 0 // Empty
      } else if (comp.type === 'resistor') {
        reset.current = 0 // Cold
        reset.voltageDrop = 0
      } else if (comp.type === 'led') {
        reset.brightness = 0 // Off
        reset.voltage = 0
        reset.current = 0
      } else if (comp.type === 'lightbulb') {
        reset.brightness = 0 // Off
        reset.current = 0
        reset.power = 0
        reset.voltage = 0
      }

      return reset
    })
  }

  /**
   * Simulate circuit for one time step
   * Updates all component states based on electrical laws
   * @param {number} deltaTime - Time step in seconds (default 0.1s = 100ms)
   * @returns {Array} Updated components array
   */
  simulate(deltaTime = 0.1) {
    // deltaTime in seconds (default 100ms)
    this.deltaTime = deltaTime  // Store for use in other methods

    // Reset all component states
    this.components.forEach(comp => {
      if (comp.type === 'led') {
        comp.brightness = 0
        comp.voltage = 0
        comp.current = 0
      } else if (comp.type === 'resistor') {
        comp.voltageDrop = 0
        comp.current = 0
      } else if (comp.type === 'lightbulb') {
        comp.brightness = 0
        comp.voltage = 0
        comp.current = 0
        comp.power = 0
      }
    })

    // Update capacitors (charge/discharge based on connected circuits)
    simulateCapacitors(this.components, this.wires, deltaTime, (comp) => this.findConnectedComponents(comp))

    // Find all circuits (battery connected to components via wires)
    const circuits = this.findCircuits()

    circuits.forEach(circuit => {
      if (circuit.type === 'led') {
        simulateCircuit(circuit, {
          analyzeBatteryTopology: this.analyzeBatteryTopology.bind(this),
          isCapacitorInSeriesWithLED: this.isCapacitorInSeriesWithLED.bind(this),
          findResistorsInPath: this.findResistorsInPath.bind(this),
          deltaTime: this.deltaTime
        })
      } else if (circuit.type === 'lightbulb') {
        simulateLightBulb(circuit, {
          deltaTime: this.deltaTime
        })
      }
    })

    return this.components
  }

  /**
   * Find all circuits (load components connected to voltage sources)
   * Analyzes topology to determine series/parallel configurations
   * @returns {Array} Array of circuit objects with batteries, capacitors, and loads
   */
  findCircuits() {
    const circuits = []
    const leds = this.components.filter(c => c.type === 'led')
    const bulbs = this.components.filter(c => c.type === 'lightbulb')

    // For each LED, find all voltage sources (batteries + charged capacitors) and other LEDs in the same circuit
    leds.forEach(led => {
      const connectedComponents = this.findConnectedComponents(led)
      const batteries = connectedComponents.filter(c => c.type === 'battery')
      const capacitors = connectedComponents.filter(c => c.type === 'capacitor' && c.voltage > 0.1) // Treat charged capacitors as voltage sources
      const ledsInCircuit = connectedComponents.filter(c => c.type === 'led')

      if (batteries.length > 0 || capacitors.length > 0) {
        // Determine if this LED is in series or parallel with other LEDs
        const isParallel = this.isParallelConfiguration(led, batteries)
        circuits.push({ batteries, capacitors, led, totalLEDs: ledsInCircuit.length, isParallel, type: 'led' })
      }
    })

    // For each light bulb, find voltage sources (batteries + charged capacitors)
    bulbs.forEach(bulb => {
      const connectedComponents = this.findConnectedComponents(bulb)
      const batteries = connectedComponents.filter(c => c.type === 'battery')
      const capacitors = connectedComponents.filter(c => c.type === 'capacitor' && c.voltage > 0.1)

      if (batteries.length > 0 || capacitors.length > 0) {
        // Analyze battery topology (series/parallel chains)
        const batteryTopology = this.analyzeBatteryTopology(batteries, bulb)
        circuits.push({ batteries, capacitors, bulb, batteryTopology, type: 'lightbulb' })
      }
    })

    return circuits
  }

  /**
   * Analyze battery topology (series chains in parallel)
   * Detects how batteries are connected and calculates effective voltage
   * @param {Array} batteries - Array of battery components
   * @param {Object} load - Load component (LED or bulb)
   * @returns {Object} { seriesChains: Array, voltage: number, parallelCount: number }
   */
  analyzeBatteryTopology(batteries, load) {
    // Detect series/parallel battery configurations
    // Returns: { seriesChains: [[bat1, bat2], [bat3, bat4]], voltage: V, parallelCount: N }

    if (batteries.length === 0) {
      return { seriesChains: [], voltage: 0, parallelCount: 0 }
    }

    // Find series chains: batteries connected to each other
    const visited = new Set()
    const seriesChains = []

    batteries.forEach(startBattery => {
      if (visited.has(startBattery.id)) return

      // Build a chain starting from this battery
      const chain = [startBattery]
      visited.add(startBattery.id)

      // Follow the chain in both directions
      let current = startBattery
      let foundNext = true

      while (foundNext) {
        foundNext = false
        const neighbors = this.getConnectedComponents(current.id)

        for (const neighborId of neighbors) {
          const neighbor = batteries.find(b => b.id === neighborId)
          if (neighbor && !visited.has(neighbor.id)) {
            chain.push(neighbor)
            visited.add(neighbor.id)
            current = neighbor
            foundNext = true
            break
          }
        }
      }

      seriesChains.push(chain)
    })

    // Calculate voltage per chain (series batteries add voltage)
    const voltagePerChain = seriesChains.length > 0
      ? seriesChains[0].reduce((sum, bat) => sum + (bat.charge > 0 ? bat.voltage : 0), 0)
      : 0

    // Parallel chains all connect to the same load
    // Count how many chains reach the load
    const chainsConnectedToLoad = seriesChains.filter(chain => {
      // Check if any battery in this chain is directly connected to the load
      return chain.some(battery => {
        const neighbors = this.getConnectedComponents(battery.id)
        return neighbors.includes(load.id)
      })
    }).length

    return {
      seriesChains,
      voltage: voltagePerChain,
      parallelCount: chainsConnectedToLoad
    }
  }

  /**
   * Determine if LED is in parallel configuration
   * Uses heuristic: LED with no LED neighbors = parallel, with LED neighbors = series
   * @param {Object} led - LED component to check
   * @param {Array} batteries - Connected batteries (unused, kept for API compatibility)
   * @returns {boolean} True if parallel configuration
   */
  isParallelConfiguration(led, batteries) {
    // Simplified parallel detection heuristic for basic circuits:
    // - If LED has NO direct LED neighbors → parallel (gets full voltage)
    // - If LED has LED neighbors → series (voltage divided among LEDs)
    //
    // This heuristic works for Act 1 scope (potato + LEDs):
    // ✓ Battery → LED (single, parallel)
    // ✓ Battery → [LED1, LED2, LED3] (all parallel)
    // ✓ Battery → LED1 → LED2 → LED3 (all series)
    // ✓ Battery → LED1 → [LED2, LED3] (LED1 series, LED2/LED3 treated as series too)
    //
    // Limitation: Complex mixed topologies need proper circuit analysis
    // (nodal/mesh) which is out of scope until Act 2+ (relays, logic gates)

    const neighbors = this.getConnectedComponents(led.id)
    const connectedLEDs = neighbors.filter(id => {
      const comp = this.components.find(c => c.id === id)
      return comp && comp.type === 'led'
    })

    // If this LED is connected to other LEDs, it's part of a series chain
    // Return false (not parallel)
    return connectedLEDs.length === 0
  }

  /**
   * Find all components connected to a starting component
   * @param {Object} startComponent - Component to start search from
   * @returns {Array} Array of connected components
   */
  findConnectedComponents(startComponent) {
    return this.graph.findConnectedComponents(startComponent)
  }

  /**
   * Find all batteries connected to an LED
   * @param {Object} led - LED component
   * @returns {Array} Array of connected battery components
   */
  findConnectedBatteries(led) {
    return this.graph.findConnectedBatteries(led)
  }

  /**
   * Find resistors in the path between LED and batteries
   * @param {Object} led - LED component
   * @param {Array} batteries - Array of battery components
   * @returns {Array} Array of resistor components in path
   */
  findResistorsInPath(led, batteries) {
    return this.graph.findResistorsInPath(led, batteries)
  }

  /**
   * Check if capacitor is in series with LED
   * @param {Object} capacitor - Capacitor component
   * @param {Object} led - LED component
   * @param {Array} batteries - Array of battery components
   * @returns {boolean} True if capacitor is in series with LED
   */
  isCapacitorInSeriesWithLED(capacitor, led, batteries) {
    return this.graph.isCapacitorInSeriesWithLED(capacitor, led, batteries)
  }

  /**
   * Get IDs of components directly connected to a component
   * @param {number} compId - Component ID
   * @returns {Array} Array of connected component IDs
   */
  getConnectedComponents(compId) {
    return this.graph.getConnectedComponentIds(compId)
  }

  /**
   * Check if two components are connected
   * @param {Object} comp1 - First component
   * @param {Object} comp2 - Second component
   * @returns {boolean} True if components are connected
   */
  isConnected(comp1, comp2) {
    return this.graph.isConnected(comp1, comp2)
  }


  // Visual state getters (delegated to VisualState module)
  /**
   * Get visual rendering state for battery
   * @param {Object} battery - Battery component
   * @returns {Object} Visual state (charge level, color, etc.)
   */
  getBatteryVisualState(battery) {
    return getBatteryVisualState(battery)
  }

  /**
   * Get visual rendering state for LED
   * @param {Object} led - LED component
   * @returns {Object} Visual state (brightness, glow, color, etc.)
   */
  getLEDVisualState(led) {
    return getLEDVisualState(led)
  }

  /**
   * Get visual rendering state for resistor
   * @param {Object} resistor - Resistor component
   * @returns {Object} Visual state (heat, color, etc.)
   */
  getResistorVisualState(resistor) {
    return getResistorVisualState(resistor)
  }

  /**
   * Get visual rendering state for capacitor
   * @param {Object} capacitor - Capacitor component
   * @returns {Object} Visual state (charge level, voltage, etc.)
   */
  getCapacitorVisualState(capacitor) {
    return getCapacitorVisualState(capacitor)
  }

  /**
   * Get visual rendering state for light bulb
   * @param {Object} bulb - Light bulb component
   * @returns {Object} Visual state (brightness, glow, temperature, etc.)
   */
  getLightBulbVisualState(bulb) {
    return getLightBulbVisualState(bulb)
  }

  // Helper formulas
  /**
   * Calculate voltage divider output
   * @param {number} vin - Input voltage
   * @param {number} r1 - First resistor value
   * @param {number} r2 - Second resistor value
   * @returns {number} Output voltage (V_out = V_in × R2/(R1+R2))
   */
  voltageDivider(vin, r1, r2) {
    return vin * r2 / (r1 + r2)
  }

  /**
   * Calculate RC charging voltage
   * @param {number} v - Source voltage
   * @param {number} r - Resistance in ohms
   * @param {number} c - Capacitance in farads
   * @param {number} t - Time in seconds
   * @returns {number} Voltage at time t (V(t) = V × (1 - e^(-t/RC)))
   */
  rcCharge(v, r, c, t) {
    return v * (1 - Math.exp(-t / (r * c)))
  }

  /**
   * Calculate electrical power
   * @param {number} v - Voltage in volts
   * @param {number} i - Current in amperes
   * @returns {number} Power in watts (P = V × I)
   */
  power(v, i) {
    return v * i
  }

}
