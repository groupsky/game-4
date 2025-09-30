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
    this.simulateCapacitors(deltaTime)

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

    // For each LED, find all batteries and other LEDs in the same circuit
    leds.forEach(led => {
      const connectedComponents = this.findConnectedComponents(led)
      const batteries = connectedComponents.filter(c => c.type === 'battery')
      const ledsInCircuit = connectedComponents.filter(c => c.type === 'led')

      if (batteries.length > 0) {
        // Determine if this LED is in series or parallel with other LEDs
        const isParallel = this.isParallelConfiguration(led, batteries)
        circuits.push({ batteries, led, totalLEDs: ledsInCircuit.length, isParallel, type: 'led' })
      }
    })

    // For each light bulb, find batteries
    bulbs.forEach(bulb => {
      const connectedComponents = this.findConnectedComponents(bulb)
      const batteries = connectedComponents.filter(c => c.type === 'battery')

      if (batteries.length > 0) {
        circuits.push({ batteries, bulb, type: 'lightbulb' })
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

    // Find all resistors in the circuit
    const connectedComponents = this.findConnectedComponents(led)
    const resistors = connectedComponents.filter(c => c.type === 'resistor')

    // Calculate total resistance in the circuit
    const LED_RESISTANCE = 100  // Ohms
    let totalResistance = LED_RESISTANCE

    resistors.forEach(resistor => {
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

    // Calculate voltage drops
    resistors.forEach(resistor => {
      resistor.voltageDrop = current * resistor.resistance
      resistor.current = current
    })

    // Calculate voltage across LED (after resistor drops)
    let ledVoltage = totalVoltage
    resistors.forEach(resistor => {
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

  // Visual state getters for rendering
  getBatteryVisualState(battery) {
    const chargePercent = Math.round(battery.charge * 100)
    const chargeBarFill = battery.charge

    let state
    if (battery.charge > 0.75) state = 'full'
    else if (battery.charge > 0.5) state = 'medium'
    else if (battery.charge > 0.25) state = 'low'
    else if (battery.charge > 0) state = 'depleted'
    else state = 'dead'

    return {
      chargePercent,
      chargeBarFill,
      state,
      glowIntensity: battery.charge * 0.5  // Dim glow based on charge
    }
  }

  getLEDVisualState(led) {
    const brightness = led.brightness || 0
    const brightnessPercent = Math.round(brightness * 100)
    const glowIntensity = brightness
    const glowRadius = 5 + brightness * 15  // 5px base + up to 15px

    let state
    if (brightness === 0) state = 'off'
    else if (brightness < 0.4) state = 'dim'
    else if (brightness < 0.8) state = 'medium'
    else state = 'bright'

    return {
      brightness,
      brightnessPercent,
      glowIntensity,
      glowRadius,
      state
    }
  }

  getResistorVisualState(resistor) {
    const current = resistor.current || 0
    const resistance = resistor.resistance || 0

    // P = I² × R (power dissipated as heat)
    const powerDissipated = current * current * resistance

    // Heat level (0-1 scale)
    // 0.5W = warm, 1W = hot, 2W+ = very hot
    let heatLevel = Math.min(powerDissipated / 2.0, 1.0)

    let state
    if (heatLevel < 0.25) state = 'cool'
    else if (heatLevel < 0.6) state = 'warm'
    else if (heatLevel < 0.9) state = 'hot'
    else state = 'overheating'

    return {
      powerDissipated,
      heatLevel,
      state,
      voltageDrop: resistor.voltageDrop || 0,
      current
    }
  }

  getCapacitorVisualState(capacitor) {
    const voltage = capacitor.voltage || 0
    const maxVoltage = capacitor.maxVoltage || 5.0
    const chargePercent = Math.round((voltage / maxVoltage) * 100)
    const chargeFill = voltage / maxVoltage

    let state
    if (chargeFill < 0.1) state = 'empty'
    else if (chargeFill < 0.5) state = 'charging'
    else if (chargeFill < 0.9) state = 'charged'
    else state = 'full'

    return {
      chargePercent,
      chargeFill,
      state,
      voltage,
      maxVoltage
    }
  }

  simulateCapacitors(deltaTime) {
    const capacitors = this.components.filter(c => c.type === 'capacitor')

    capacitors.forEach(capacitor => {
      // Initialize voltage if not set
      if (capacitor.voltage === undefined) {
        capacitor.voltage = 0
      }

      // Find connected components
      const connected = this.findConnectedComponents(capacitor)
      const batteries = connected.filter(c => c.type === 'battery')
      const resistors = connected.filter(c => c.type === 'resistor')

      // Calculate total resistance in circuit (for RC time constant)
      let totalResistance = 10  // Default 10Ω (wire resistance)
      resistors.forEach(r => {
        totalResistance += r.resistance
      })

      if (batteries.length > 0) {
        // Charging: battery connected to capacitor
        let sourceVoltage = 0
        batteries.forEach(battery => {
          sourceVoltage += battery.voltage * (battery.charge > 0 ? 1 : 0)
        })

        // RC charging: V(t) = Vs × (1 - e^(-t/RC))
        const capacitance = capacitor.capacitance || 0.001  // 1mF default
        const timeConstant = totalResistance * capacitance
        const voltageDiff = sourceVoltage - capacitor.voltage

        // Calculate voltage change for this time step
        const deltaV = voltageDiff * (1 - Math.exp(-deltaTime / timeConstant))
        capacitor.voltage += deltaV

        // Drain battery based on charging current
        const chargingCurrent = deltaV / totalResistance / deltaTime
        const drainRate = chargingCurrent * deltaTime * 0.001 / batteries.length
        batteries.forEach(battery => {
          battery.charge = Math.max(0, battery.charge - drainRate)
        })

      } else {
        // Discharging: capacitor through resistor (no battery)
        if (resistors.length > 0 && capacitor.voltage > 0) {
          const capacitance = capacitor.capacitance || 0.001
          const timeConstant = totalResistance * capacitance

          // RC discharge: V(t) = V0 × e^(-t/RC)
          const dischargeFactor = Math.exp(-deltaTime / timeConstant)
          capacitor.voltage *= dischargeFactor
        }
      }

      // Clamp voltage to max rating
      const maxVoltage = capacitor.maxVoltage || 10.0
      capacitor.voltage = Math.max(0, Math.min(capacitor.voltage, maxVoltage))
    })
  }

  simulateLightBulb(circuit) {
    const { batteries, bulb } = circuit

    // Calculate total voltage from series batteries
    let totalVoltage = 0
    let minCharge = 1.0

    batteries.forEach(battery => {
      totalVoltage += battery.voltage * (battery.charge > 0 ? 1 : 0)
      minCharge = Math.min(minCharge, battery.charge)
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
    const drainRate = current * 0.001 / batteries.length
    batteries.forEach(battery => {
      battery.charge = Math.max(0, battery.charge - drainRate)
    })
  }

  getLightBulbVisualState(bulb) {
    const brightness = bulb.brightness || 0
    const brightnessPercent = Math.round(brightness * 100)
    const glowIntensity = brightness
    const power = bulb.power || 0

    // Filament heat based on power dissipation (incandescent heats up)
    const filamentHeat = Math.min(power / 1.0, 1.0)

    let state
    if (brightness === 0) state = 'off'
    else if (brightness < 0.3) state = 'dim'
    else if (brightness < 0.7) state = 'warm'
    else state = 'bright'

    return {
      brightness,
      brightnessPercent,
      glowIntensity,
      filamentHeat,
      state,
      power
    }
  }
}
