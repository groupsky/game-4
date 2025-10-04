/**
 * AdvancedValidators - Validation functions for challenges 18-30
 *
 * Includes complex multi-component circuits: battery banks, capacitor networks,
 * mixed loads, efficiency challenges, and the grand finale.
 *
 * Each validator receives a circuit object and returns:
 * { success: boolean, message: string, tracking?: boolean }
 */

export const AdvancedValidators = {
  validateMaxBright(circuit) {
    const leds = circuit.components.filter(c => c.type === 'led')
    const batteries = circuit.components.filter(c => c.type === 'battery')

    if (leds.length !== 1) {
      return { success: false, message: 'Use exactly 1 LED for this challenge!' }
    }

    if (batteries.length < 2) {
      return { success: false, message: 'Need more batteries for maximum brightness!' }
    }

    const led = leds[0]
    // Adjusted for 100Ω resistor (UI value): 3 batteries + 100Ω gives ~0.36 brightness
    if (led.brightness < 0.3) {
      return { success: false, message: 'LED can be brighter! Add more voltage!' }
    }

    if (led.brightness > 0.95) {
      return { success: false, message: '⚠️ Too bright! LED is burning out. Add protection!' }
    }

    return { success: true, message: '⭐ Maximum safe brightness achieved!' }
  },

  // 19. Battery Bank - 3x3 bank
  validateBatteryBank(circuit) {
    const batteries = circuit.components.filter(c => c.type === 'battery')

    if (batteries.length < 9) {
      return { success: false, message: 'Need 9 batteries for a 3x3 bank (3 series chains in parallel)!' }
    }

    const leds = circuit.components.filter(c => c.type === 'led')
    if (leds.length === 0) {
      return { success: false, message: 'Add an LED to test your battery bank!' }
    }

    const brightLED = leds.find(led => led.brightness >= 0.1)
    if (!brightLED) {
      return { success: false, message: 'Wire the bank correctly to power the LED!' }
    }

    return { success: true, message: '🔋 Massive battery bank! This will last forever!' }
  },

  // 20. Marathon - 2 minutes
  validateMarathon(circuit) {
    const bulbs = circuit.components.filter(c => c.type === 'lightbulb')
    const batteries = circuit.components.filter(c => c.type === 'battery')

    if (bulbs.length === 0) {
      return { success: false, message: 'Add a light bulb' }
    }

    if (batteries.length < 6) {
      return { success: false, message: 'Need at least 6 batteries to last 2 minutes!' }
    }

    const litBulb = bulbs.find(bulb => bulb.brightness >= 0.2)
    if (!litBulb) {
      return { success: false, message: 'Bulb must stay lit!' }
    }

    return { success: false, tracking: true, message: 'Marathon running... batteries draining...' }
  },

  // 21. Dual Power
  validateDualPower(circuit) {
    const leds = circuit.components.filter(c => c.type === 'led')
    const bulbs = circuit.components.filter(c => c.type === 'lightbulb')

    if (leds.length === 0) {
      return { success: false, message: 'Add an LED!' }
    }

    if (bulbs.length === 0) {
      return { success: false, message: 'Add a light bulb!' }
    }

    const brightLED = leds.find(led => led.brightness >= 0.1)
    const litBulb = bulbs.find(bulb => bulb.brightness >= 0.2)

    if (!brightLED || !litBulb) {
      return { success: false, message: 'Both LED and bulb must be lit from same source!' }
    }

    return { success: true, message: '⚡ Dual power! Balanced loads working together!' }
  },

  // 22. Capacitor Network
  validateCapNetwork(circuit) {
    const capacitors = circuit.components.filter(c => c.type === 'capacitor')

    if (capacitors.length < 2) {
      return { success: false, message: 'Need 2 capacitors in parallel!' }
    }

    const chargedCaps = capacitors.filter(cap => cap.voltage >= 1.5)
    if (chargedCaps.length < 2) {
      return { success: false, message: 'Charge both capacitors!' }
    }

    return { success: true, message: '🔋 Parallel capacitors = more energy storage!' }
  },

  // 23. Series Capacitors
  validateSeriesCaps(circuit) {
    const capacitors = circuit.components.filter(c => c.type === 'capacitor')

    if (capacitors.length < 2) {
      return { success: false, message: 'Need 2 capacitors in series!' }
    }

    const chargedCaps = capacitors.filter(cap => cap.voltage >= 0.5)
    if (chargedCaps.length < 2) {
      return { success: false, message: 'Charge the series capacitors!' }
    }

    return { success: true, message: '🔗 Series caps: voltage splits, capacity decreases!' }
  },

  // 24. Mixed Load
  validateMixedLoad(circuit) {
    const leds = circuit.components.filter(c => c.type === 'led')

    if (leds.length < 3) {
      return { success: false, message: 'Need 3 LEDs (2 series + 1 parallel)!' }
    }

    const litLEDs = leds.filter(led => led.brightness >= 0.05)
    if (litLEDs.length < 3) {
      return { success: false, message: 'All 3 LEDs must light!' }
    }

    return { success: true, message: '🔀 Mixed topology! Series AND parallel working!' }
  },

  // 25. Resistor Ladder
  validateResistorLadder(circuit) {
    const resistors = circuit.components.filter(c => c.type === 'resistor')

    if (resistors.length < 3) {
      return { success: false, message: 'Need 3 resistors in series!' }
    }

    const activeResistors = resistors.filter(r => r.current > 0.001)
    if (activeResistors.length < 3) {
      return { success: false, message: 'All 3 resistors must be in the circuit!' }
    }

    return { success: true, message: '🪜 Resistor ladder! Total R = R1 + R2 + R3' }
  },

  // 26. Power Distribution
  validatePowerDist(circuit) {
    const leds = circuit.components.filter(c => c.type === 'led')

    if (leds.length < 3) {
      return { success: false, message: 'Need 3 LEDs in 3 parallel branches!' }
    }

    const litLEDs = leds.filter(led => led.brightness >= 0.1)
    if (litLEDs.length < 3) {
      return { success: false, message: 'All 3 parallel branches must be lit!' }
    }

    return { success: true, message: '🌟 Power distribution hub! Equal power to all branches!' }
  },

  // 27. Sustained Flash
  validateSustainedFlash(circuit) {
    const bulbs = circuit.components.filter(c => c.type === 'lightbulb')
    const batteries = circuit.components.filter(c => c.type === 'battery')
    const capacitors = circuit.components.filter(c => c.type === 'capacitor')

    if (bulbs.length === 0) {
      return { success: false, message: 'Add a light bulb' }
    }

    if (batteries.length === 0) {
      return { success: false, message: 'Need batteries!' }
    }

    if (capacitors.length === 0) {
      return { success: false, message: 'Need capacitors for energy storage!' }
    }

    const litBulb = bulbs.find(bulb => bulb.brightness >= 0.2)
    if (!litBulb) {
      return { success: false, message: 'Bulb must stay lit!' }
    }

    return { success: false, tracking: true, message: 'Batteries + caps working together...' }
  },

  // 28. Efficiency Master
  validateEfficiencyMaster(circuit) {
    const leds = circuit.components.filter(c => c.type === 'led')
    const batteries = circuit.components.filter(c => c.type === 'battery')

    if (leds.length < 3) {
      return { success: false, message: 'Need 3 LEDs!' }
    }

    if (batteries.length !== 3) {
      return { success: false, message: 'Use EXACTLY 3 batteries - no more, no less!' }
    }

    const litLEDs = leds.filter(led => led.brightness >= 0.1)
    if (litLEDs.length < 3) {
      return { success: false, message: 'All 3 LEDs must stay lit!' }
    }

    return { success: false, tracking: true, message: 'Efficiency challenge running...' }
  },

  // 29. Grand Circuit - Everything combined, 60 seconds
  validateGrandCircuit(circuit) {
    const batteries = circuit.components.filter(c => c.type === 'battery')
    const leds = circuit.components.filter(c => c.type === 'led')
    const bulbs = circuit.components.filter(c => c.type === 'lightbulb')
    const resistors = circuit.components.filter(c => c.type === 'resistor')
    const capacitors = circuit.components.filter(c => c.type === 'capacitor')

    if (batteries.length < 4) {
      return { success: false, message: 'Need at least 4 batteries (series + parallel)!' }
    }

    if (leds.length === 0) {
      return { success: false, message: 'Add an LED!' }
    }

    if (bulbs.length === 0) {
      return { success: false, message: 'Add a light bulb!' }
    }

    if (resistors.length === 0) {
      return { success: false, message: 'Use resistors for current control!' }
    }

    if (capacitors.length === 0) {
      return { success: false, message: 'Add a capacitor for power smoothing!' }
    }

    const brightLED = leds.find(led => led.brightness >= 0.1)
    if (!brightLED) {
      return { success: false, message: 'LED must be lit!' }
    }

    const litBulb = bulbs.find(bulb => bulb.brightness >= 0.2)
    if (!litBulb) {
      return { success: false, message: 'Light bulb must be lit!' }
    }

    const chargedCap = capacitors.find(cap => cap.voltage >= 1.0)
    if (!chargedCap) {
      return { success: false, message: 'Capacitor should be charged!' }
    }

    return { success: true, tracking: true, message: '🎯 Grand Circuit validated! Timer starting...' }
  },

  // 30. Master Inventor - Final challenge
  validateMasterInventor(circuit) {
    const components = circuit.components
    const leds = components.filter(c => c.type === 'led')
    const bulbs = components.filter(c => c.type === 'lightbulb')
    const litLEDs = leds.filter(led => led.brightness >= 0.1)
    const litBulbs = bulbs.filter(bulb => bulb.brightness >= 0.2)
    const totalLit = litLEDs.length + litBulbs.length

    if (totalLit < 5) {
      return { success: false, message: `Need 5+ lit components! Currently: ${totalLit}` }
    }

    return { success: true, tracking: true, message: `🏆 Master circuit! ${totalLit} components shining!` }
  }
}
