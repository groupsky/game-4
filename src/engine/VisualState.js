// Visual state getters for component rendering
// Provides non-anthropomorphic visual feedback

export function getBatteryVisualState(battery) {
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

export function getLEDVisualState(led) {
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

export function getResistorVisualState(resistor) {
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

export function getCapacitorVisualState(capacitor) {
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

export function getLightBulbVisualState(bulb) {
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
