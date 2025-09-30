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

    // For each LED, find all batteries connected to it (directly or through other batteries)
    leds.forEach(led => {
      const batteries = this.findConnectedBatteries(led)
      if (batteries.length > 0) {
        circuits.push({ batteries, led })
      }
    })

    return circuits
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
    const { batteries, led } = circuit

    // Calculate total voltage from series batteries
    let totalVoltage = 0
    let totalCharge = 0

    batteries.forEach(battery => {
      totalVoltage += battery.voltage * battery.charge
      totalCharge += battery.charge
    })

    // Average charge for drain calculation
    const avgCharge = batteries.length > 0 ? totalCharge / batteries.length : 0
    const voltage = totalVoltage

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
    const drainRate = current * 0.001 / batteries.length // Distribute drain across batteries
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
