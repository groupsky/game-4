import { simulateCapacitors } from './CapacitorSimulation.js'
import {
  getBatteryVisualState,
  getLEDVisualState,
  getResistorVisualState,
  getCapacitorVisualState,
  getLightBulbVisualState
} from './VisualState.js'

export class CircuitSimulator {
  constructor() {
    this.components = []
    this.wires = []
  }

  setComponents(components) {
    this.components = components
  }

  setWires(wires) {
    this.wires = wires
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
    // BFS to find all components connected to this one
    const visited = new Set()
    const queue = [startComponent.id]
    const connected = []

    visited.add(startComponent.id)

    while (queue.length > 0) {
      const currentId = queue.shift()
      const current = this.components.find(c => c.id === currentId)

      if (!current) continue

      connected.push(current)

      // Find all connected components
      const neighbors = this.getConnectedComponents(currentId)
      for (const connId of neighbors) {
        if (!visited.has(connId)) {
          visited.add(connId)
          queue.push(connId)
        }
      }
    }

    return connected
  }

  findConnectedBatteries(led) {
    // BFS to find all batteries connected to this LED
    const visited = new Set()
    const queue = [led.id]
    const batteries = []

    visited.add(led.id)

    while (queue.length > 0) {
      const currentId = queue.shift()
      const current = this.components.find(c => c.id === currentId)

      if (!current) continue

      // If it's a battery, add it to the list
      if (current.type === 'battery') {
        batteries.push(current)
      }

      // Find all connected components
      const connected = this.getConnectedComponents(currentId)
      for (const connId of connected) {
        if (!visited.has(connId)) {
          visited.add(connId)
          queue.push(connId)
        }
      }
    }

    return batteries
  }

  findResistorsInPath(led, batteries) {
    // Find resistors that are in the direct path between LED and batteries
    // This handles parallel branches correctly
    if (batteries.length === 0) return []

    const resistors = []
    const visited = new Set()

    // BFS from LED towards batteries, stopping when we hit them
    const queue = [led.id]
    visited.add(led.id)

    while (queue.length > 0) {
      const currentId = queue.shift()
      const current = this.components.find(c => c.id === currentId)

      if (!current) continue

      // If we hit a battery, we've found a complete path
      if (current.type === 'battery') {
        continue // Don't traverse beyond batteries
      }

      // If it's a resistor, add it to the path
      if (current.type === 'resistor') {
        resistors.push(current)
      }

      // Continue traversing
      const connected = this.getConnectedComponents(currentId)
      for (const connId of connected) {
        if (!visited.has(connId)) {
          visited.add(connId)
          queue.push(connId)
        }
      }
    }

    return resistors
  }

  getConnectedComponents(compId) {
    const connected = []
    for (const wire of this.wires) {
      if (wire.from === compId) {
        connected.push(wire.to)
      } else if (wire.to === compId) {
        connected.push(wire.from)
      }
    }
    return connected
  }

  isConnected(comp1, comp2) {
    // Check if two components are connected via wires
    for (const wire of this.wires) {
      if (
        (wire.from === comp1.id && wire.to === comp2.id) ||
        (wire.from === comp2.id && wire.to === comp1.id)
      ) {
        return true
      }
    }
    return false
  }

  simulateCircuit(circuit) {
    const { batteries = [], capacitors = [], led, totalLEDs, isParallel } = circuit

    // Calculate total voltage from series batteries
    let batteryVoltage = 0
    let minCharge = 1.0

    batteries.forEach(battery => {
      // Voltage adds in series, regardless of charge level
      // A battery maintains its voltage until nearly depleted
      batteryVoltage += battery.voltage * (battery.charge > 0 ? 1 : 0)

      // Track minimum charge (circuit is limited by weakest battery)
      minCharge = Math.min(minCharge, battery.charge)
    })

    // Handle capacitors:
    // - If battery present: capacitor opposes battery (blocks DC when fully charged)
    //   totalVoltage = batteryVoltage - capacitorVoltage
    // - If no battery: capacitor acts as voltage source (discharging mode)
    //   totalVoltage = capacitorVoltage
    let totalVoltage
    if (batteries.length > 0) {
      // Capacitors in series with battery: oppose the battery voltage as they charge
      totalVoltage = batteryVoltage
      capacitors.forEach(capacitor => {
        totalVoltage -= capacitor.voltage
      })
    } else {
      // Capacitor-only circuit: capacitor acts as voltage source (discharge mode)
      totalVoltage = 0
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

    // Drain all batteries based on current draw
    // For parallel LEDs, each LED draws current, so multiply by number of parallel LEDs
    const parallelMultiplier = isParallel ? totalLEDs : 1
    const totalSources = batteries.length + capacitors.length

    if (batteries.length > 0) {
      const drainRate = current * 0.001 * parallelMultiplier / totalSources // Distribute drain across all sources
      batteries.forEach(battery => {
        battery.charge = Math.max(0, battery.charge - drainRate)
      })
    }

    // Discharge capacitors when powering LED
    if (capacitors.length > 0) {
      // Calculate energy drawn from capacitors: E = V * I * t
      // Voltage drop: dV = I * dt / C
      capacitors.forEach(capacitor => {
        const capacitance = capacitor.capacitance || 0.001
        const dischargeCurrent = current * parallelMultiplier / totalSources
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
