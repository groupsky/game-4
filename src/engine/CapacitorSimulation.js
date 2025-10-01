// Capacitor simulation with RC time constants

export function simulateCapacitors(components, wires, deltaTime, findConnectedComponents) {
  const capacitors = components.filter(c => c.type === 'capacitor')

  capacitors.forEach(capacitor => {
    // Initialize voltage if not set
    if (capacitor.voltage === undefined) {
      capacitor.voltage = 0
    }

    // Find connected components
    const connected = findConnectedComponents(capacitor)
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
