import { simulateCapacitors } from './CapacitorSimulation.js'
import {
  getBatteryVisualState,
  getLEDVisualState,
  getResistorVisualState,
  getCapacitorVisualState,
  getLightBulbVisualState
} from './VisualState.js'
import { GraphAnalyzer } from './GraphAnalyzer.js'

export class CircuitSimulator {
  constructor() {
    this.components = []
    this.wires = []
    this.graph = null
  }

  setComponents(components) {
    this.components = components
    this.graph = new GraphAnalyzer(this.components, this.wires)
  }

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
        this.simulateCircuit(circuit)
      } else if (circuit.type === 'lightbulb') {
        this.simulateLightBulb(circuit)
      }
    })

    return this.components
  }

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

  findConnectedComponents(startComponent) {
    return this.graph.findConnectedComponents(startComponent)
  }

  findConnectedBatteries(led) {
    return this.graph.findConnectedBatteries(led)
  }

  findResistorsInPath(led, batteries) {
    return this.graph.findResistorsInPath(led, batteries)
  }

  isCapacitorInSeriesWithLED(capacitor, led, batteries) {
    return this.graph.isCapacitorInSeriesWithLED(capacitor, led, batteries)
  }

  getConnectedComponents(compId) {
    return this.graph.getConnectedComponentIds(compId)
  }

  isConnected(comp1, comp2) {
    return this.graph.isConnected(comp1, comp2)
  }

  simulateCircuit(circuit) {
    const { batteries = [], capacitors = [], led, totalLEDs, isParallel } = circuit

    // Analyze battery topology to find series chains in parallel
    const batteryTopology = this.analyzeBatteryTopology(batteries, led)
    const { seriesChains } = batteryTopology

    // Calculate total voltage - for parallel chains, use the highest voltage
    // (or a weighted combination based on current distribution)
    let batteryVoltage = 0
    let minCharge = 1.0

    if (seriesChains.length === 1) {
      // Simple case: all batteries in series
      seriesChains[0].forEach(battery => {
        batteryVoltage += battery.voltage * (battery.charge > 0 ? 1 : 0)
        minCharge = Math.min(minCharge, battery.charge)
      })
    } else if (seriesChains.length > 1) {
      // Parallel chains: use highest voltage chain (dominant voltage source)
      // In reality, parallel voltage sources with different voltages create complex current flows
      // For simplicity, we'll use the highest voltage and distribute current based on voltage
      seriesChains.forEach(chain => {
        const chainVoltage = chain.reduce((sum, bat) => sum + (bat.charge > 0 ? bat.voltage : 0), 0)
        batteryVoltage = Math.max(batteryVoltage, chainVoltage)
        chain.forEach(bat => {
          minCharge = Math.min(minCharge, bat.charge)
        })
      })
    }

    // Handle capacitors based on their configuration:
    // - Series with LED: oppose battery (blocks DC when charged)
    // - Parallel with LED: add to voltage (smoothing/boost)
    // - No battery: act as voltage source (discharge mode)
    let totalVoltage = batteryVoltage

    if (batteries.length > 0) {
      // Check each capacitor: series or parallel?
      capacitors.forEach(capacitor => {
        const inSeries = this.isCapacitorInSeriesWithLED(capacitor, led, batteries)
        if (inSeries) {
          // Series: capacitor opposes battery voltage as it charges
          totalVoltage -= capacitor.voltage
        } else {
          // Parallel: capacitor adds to voltage (both provide power)
          totalVoltage += capacitor.voltage
        }
      })
    } else {
      // No battery: capacitor acts as voltage source (discharge mode)
      capacitors.forEach(capacitor => {
        totalVoltage += capacitor.voltage
      })
    }

    // Find resistors in THIS LED's branch (not all connected resistors)
    const resistorsInPath = this.findResistorsInPath(led, batteries)

    // Calculate total resistance in THIS LED's branch
    const LED_RESISTANCE = 100  // Ohms
    let totalResistance = LED_RESISTANCE

    resistorsInPath.forEach(resistor => {
      totalResistance += resistor.resistance
    })

    // For series LEDs, each LED adds resistance
    if (!isParallel && totalLEDs > 1) {
      totalResistance += LED_RESISTANCE * (totalLEDs - 1)
    }

    // LED characteristics
    const LED_FORWARD_VOLTAGE = 2.0  // Typical LED forward voltage
    const MAX_LED_CURRENT = 0.020     // 20mA

    // Voltage calculation depends on configuration
    // Parallel: each LED gets full voltage
    // Series: voltage is divided across all components
    let availableVoltage = totalVoltage

    if (!isParallel && totalLEDs > 1) {
      availableVoltage = totalVoltage / totalLEDs
    }

    // Check if voltage is sufficient to light LED (even dimly)
    if (availableVoltage < 0.5) {
      // Not enough voltage at all
      led.brightness = 0
      led.voltage = availableVoltage
      led.current = 0
      return
    }

    // Calculate current using Ohm's law: I = V / R
    let current = totalVoltage / totalResistance

    // Limit current to max LED current
    current = Math.min(current, MAX_LED_CURRENT)

    // Calculate voltage drops in THIS LED's branch
    resistorsInPath.forEach(resistor => {
      resistor.voltageDrop = current * resistor.resistance
      resistor.current = current
    })

    // Calculate voltage across LED (after resistor drops in this branch)
    let ledVoltage = totalVoltage
    resistorsInPath.forEach(resistor => {
      ledVoltage -= resistor.voltageDrop
    })

    // For series LEDs, divide remaining voltage
    if (!isParallel && totalLEDs > 1) {
      ledVoltage = ledVoltage / totalLEDs
    }

    const voltage = ledVoltage

    // Calculate LED brightness (0-1 scale)
    // LED gets brighter as current increases
    let brightness = current / MAX_LED_CURRENT

    // Apply forward voltage threshold (more gradual)
    if (voltage < LED_FORWARD_VOLTAGE) {
      // Scale brightness based on voltage (allows dim glow at low voltage)
      brightness *= (voltage / LED_FORWARD_VOLTAGE) * 0.8
    }

    // Clamp brightness
    brightness = Math.max(0, Math.min(1, brightness))

    // Update LED state
    led.brightness = brightness
    led.voltage = voltage
    led.current = current

    // Drain batteries based on current draw, distributed by series chain voltage
    // For parallel LEDs, each LED draws current, so multiply by number of parallel LEDs
    const parallelMultiplier = isParallel ? totalLEDs : 1
    const totalCurrent = current * parallelMultiplier

    if (batteries.length > 0) {
      // Calculate voltage of each series chain
      const chainVoltages = seriesChains.map(chain =>
        chain.reduce((sum, bat) => sum + (bat.charge > 0 ? bat.voltage : 0), 0)
      )
      const totalChainVoltage = chainVoltages.reduce((sum, v) => sum + v, 0)

      // Distribute current based on each chain's voltage contribution
      // Higher voltage chains supply more current (parallel resistor network behavior)
      seriesChains.forEach((chain, index) => {
        const chainVoltage = chainVoltages[index]
        if (totalChainVoltage === 0) return

        // Current from this chain is proportional to its voltage
        const chainCurrentFraction = chainVoltage / totalChainVoltage
        const chainCurrent = totalCurrent * chainCurrentFraction

        // All batteries in a series chain get the same current
        const drainRate = chainCurrent * 0.001 / (capacitors.length + seriesChains.length)
        chain.forEach(battery => {
          battery.charge = Math.max(0, battery.charge - drainRate)
        })
      })
    }

    // Discharge capacitors when powering LED (only if no battery, or if series with battery)
    if (capacitors.length > 0 && batteries.length === 0) {
      // Only discharge capacitors if they're the sole power source
      // If battery is present, battery charges/powers and capacitor just charges
      capacitors.forEach(capacitor => {
        const capacitance = capacitor.capacitance || 0.001
        const dischargeCurrent = current * parallelMultiplier / capacitors.length
        const voltageDrop = (dischargeCurrent * this.deltaTime) / capacitance
        capacitor.voltage = Math.max(0, capacitor.voltage - voltageDrop)
      })
    }
  }

  // Visual state getters (delegated to VisualState module)
  getBatteryVisualState(battery) {
    return getBatteryVisualState(battery)
  }

  getLEDVisualState(led) {
    return getLEDVisualState(led)
  }

  getResistorVisualState(resistor) {
    return getResistorVisualState(resistor)
  }

  getCapacitorVisualState(capacitor) {
    return getCapacitorVisualState(capacitor)
  }

  getLightBulbVisualState(bulb) {
    return getLightBulbVisualState(bulb)
  }

  // Helper formulas
  voltageDivider(vin, r1, r2) {
    return vin * r2 / (r1 + r2)
  }

  rcCharge(v, r, c, t) {
    return v * (1 - Math.exp(-t / (r * c)))
  }

  power(v, i) {
    return v * i
  }

  simulateLightBulb(circuit) {
    const { batteries = [], capacitors = [], bulb, batteryTopology } = circuit

    // Use battery topology analysis for accurate series/parallel handling
    let totalVoltage = 0
    let parallelCount = 1

    if (batteryTopology) {
      // Use analyzed topology
      totalVoltage = batteryTopology.voltage
      parallelCount = batteryTopology.parallelCount || 1
    } else {
      // Fallback: treat all batteries as series (old behavior)
      batteries.forEach(battery => {
        totalVoltage += battery.voltage * (battery.charge > 0 ? 1 : 0)
      })
    }

    // Add capacitor voltage
    capacitors.forEach(capacitor => {
      totalVoltage += capacitor.voltage
    })

    // Light bulb characteristics
    const BULB_MIN_VOLTAGE = 2.5  // Minimum voltage for visible glow
    const bulbResistance = bulb.resistance || 50  // Ohms (lower than LED)

    // Check if voltage is sufficient
    if (totalVoltage < BULB_MIN_VOLTAGE) {
      bulb.brightness = 0
      bulb.voltage = totalVoltage
      bulb.current = 0
      return
    }

    // Calculate current using Ohm's law: I = V / R
    const current = totalVoltage / bulbResistance

    // Calculate power dissipated (as light and heat)
    const power = current * current * bulbResistance  // P = I²R

    // Brightness is based on power (incandescent: more power = more light)
    // Normalized to 0-1 scale (1W = full brightness)
    let brightness = Math.min(power / 1.0, 1.0)

    // Apply voltage-based scaling for dim operation
    if (totalVoltage < 4.0) {
      brightness *= (totalVoltage / 4.0) * 0.7
    }

    // Update bulb state
    bulb.brightness = Math.max(0, Math.min(1, brightness))
    bulb.voltage = totalVoltage
    bulb.current = current
    bulb.power = power

    // Drain batteries (bulbs draw more current than LEDs)
    // For parallel chains: current is divided, so each battery drains slower
    // For series chains: all batteries in chain drain at same rate
    const totalSources = batteries.length + capacitors.length

    if (batteries.length > 0) {
      // Divide current by number of parallel chains
      const currentPerChain = current / parallelCount
      const drainRate = currentPerChain * 0.001 / totalSources

      batteries.forEach(battery => {
        battery.charge = Math.max(0, battery.charge - drainRate)
      })
    }

    // Discharge capacitors when powering bulb
    if (capacitors.length > 0) {
      capacitors.forEach(capacitor => {
        const capacitance = capacitor.capacitance || 0.001
        const dischargeCurrent = current / totalSources
        const voltageDrop = (dischargeCurrent * this.deltaTime) / capacitance
        capacitor.voltage = Math.max(0, capacitor.voltage - voltageDrop)
      })
    }
  }
}
