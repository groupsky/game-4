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

  simulate() {
    // Reset all component states
    this.components.forEach(comp => {
      if (comp.type === 'led') {
        comp.brightness = 0
        comp.voltage = 0
        comp.current = 0
      }
    })

    // Find all circuits (battery connected to LED via wires)
    const circuits = this.findCircuits()

    circuits.forEach(circuit => {
      this.simulateCircuit(circuit)
    })

    return this.components
  }

  findCircuits() {
    const circuits = []
    const leds = this.components.filter(c => c.type === 'led')

    // For each LED, find all batteries and other LEDs in the same circuit
    leds.forEach(led => {
      const connectedComponents = this.findConnectedComponents(led)
      const batteries = connectedComponents.filter(c => c.type === 'battery')
      const ledsInCircuit = connectedComponents.filter(c => c.type === 'led')

      if (batteries.length > 0) {
        // Determine if this LED is in series or parallel with other LEDs
        const isParallel = this.isParallelConfiguration(led, batteries)
        circuits.push({ batteries, led, totalLEDs: ledsInCircuit.length, isParallel })
      }
    })

    return circuits
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
    const { batteries, led, totalLEDs, isParallel } = circuit

    // Calculate total voltage from series batteries
    let totalVoltage = 0
    let minCharge = 1.0

    batteries.forEach(battery => {
      // Voltage adds in series, regardless of charge level
      // A battery maintains its voltage until nearly depleted
      totalVoltage += battery.voltage * (battery.charge > 0 ? 1 : 0)

      // Track minimum charge (circuit is limited by weakest battery)
      minCharge = Math.min(minCharge, battery.charge)
    })

    // Voltage calculation depends on configuration
    // Parallel: each LED gets full voltage
    // Series: voltage is divided across all LEDs
    const voltage = isParallel ? totalVoltage : totalVoltage / totalLEDs

    // LED characteristics
    const LED_FORWARD_VOLTAGE = 2.0  // Typical LED forward voltage
    const LED_RESISTANCE = 100        // Ohms
    const MAX_LED_CURRENT = 0.020     // 20mA

    // Check if voltage is sufficient to light LED (even dimly)
    if (voltage < 0.5) {
      // Not enough voltage at all
      led.brightness = 0
      led.voltage = voltage
      led.current = 0
      return
    }

    // Calculate current using Ohm's law
    // For simplicity, assume series circuit with LED
    let current = voltage / LED_RESISTANCE

    // Limit current to max LED current
    current = Math.min(current, MAX_LED_CURRENT)

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
    const drainRate = current * 0.001 * parallelMultiplier / batteries.length // Distribute drain across batteries
    batteries.forEach(battery => {
      battery.charge = Math.max(0, battery.charge - drainRate)
    })
  }

  // Voltage divider formula
  voltageDivider(vin, r1, r2) {
    return vin * r2 / (r1 + r2)
  }

  // RC charge formula
  rcCharge(v, r, c, t) {
    return v * (1 - Math.exp(-t / (r * c)))
  }

  // Power calculation
  power(v, i) {
    return v * i
  }
}
