/**
 * ChallengeValidators - Validation functions for all Act 1 challenges
 *
 * Each validator receives a circuit object and returns:
 * { success: boolean, message: string, tracking?: boolean }
 */

export const ChallengeValidators = {
  // 1. First Light - Basic LED + Battery
  validateFirstLight(circuit) {
    const leds = circuit.components.filter(c => c.type === 'led')
    const batteries = circuit.components.filter(c => c.type === 'battery')

    if (batteries.length === 0) {
      return { success: false, message: 'Add a potato battery to the circuit' }
    }

    if (leds.length === 0) {
      return { success: false, message: 'Add an LED to the circuit' }
    }

    const brightLED = leds.find(led => led.brightness >= 0.1)
    if (!brightLED) {
      return { success: false, message: 'LED is too dim. Check your connections!' }
    }

    return { success: true, message: '✨ Success! Your first circuit works!' }
  },

  // 2. Power Up - Series Batteries (Allow over-bright LED)
  validatePowerUp(circuit) {
    const batteries = circuit.components.filter(c => c.type === 'battery')
    const leds = circuit.components.filter(c => c.type === 'led')

    if (batteries.length < 2) {
      return { success: false, message: 'Add at least 2 batteries and connect them in series (end-to-end)!' }
    }

    if (leds.length === 0) {
      return { success: false, message: 'Add an LED to see the power boost!' }
    }

    const brightLED = leds.find(led => led.brightness >= 0.5)
    if (!brightLED) {
      return { success: false, message: 'LED should be much brighter with series batteries!' }
    }

    return { success: true, message: '🔋 Whoa! That LED is VERY bright now!' }
  },

  // 3. Current Control - Add Resistor (After seeing over-bright LED)
  validateCurrentControl(circuit) {
    const batteries = circuit.components.filter(c => c.type === 'battery')
    const leds = circuit.components.filter(c => c.type === 'led')
    const resistors = circuit.components.filter(c => c.type === 'resistor')

    if (batteries.length < 2) {
      return { success: false, message: 'Keep your 2 series batteries from the last challenge!' }
    }

    if (resistors.length === 0) {
      return { success: false, message: 'Add a resistor to protect your LED from burning out!' }
    }

    if (leds.length === 0) {
      return { success: false, message: 'Add an LED to see the resistor in action' }
    }

    const brightLED = leds.find(led => led.brightness >= 0.1)
    if (!brightLED) {
      return { success: false, message: 'LED needs to light up. Check connections!' }
    }

    const overdriven = leds.find(led => led.brightness > 0.7)
    if (overdriven) {
      return { success: false, message: 'LED is still too bright! Use a higher resistance resistor (220Ω or 1kΩ).' }
    }

    return { success: true, message: '⚡ Perfect! LED is bright but safe. Current is controlled!' }
  },

  // 4. The Warm Glow - Introduce Light Bulb
  validateWarmGlow(circuit) {
    const bulbs = circuit.components.filter(c => c.type === 'lightbulb')
    const batteries = circuit.components.filter(c => c.type === 'battery')

    if (bulbs.length === 0) {
      return { success: false, message: 'Add a light bulb to the circuit' }
    }

    if (batteries.length < 2) {
      return { success: false, message: 'Light bulbs need more power. Use at least 2 batteries in series!' }
    }

    const litBulb = bulbs.find(bulb => bulb.brightness >= 0.2)
    if (!litBulb) {
      return { success: false, message: 'Light bulb needs more voltage. Add more batteries!' }
    }

    return { success: true, message: '💡 The warm glow of incandescent!' }
  },

  // 5. Battery Blues - 30 second timed challenge
  validateBatteryBlues(circuit) {
    const bulbs = circuit.components.filter(c => c.type === 'lightbulb')

    if (bulbs.length === 0) {
      return { success: false, message: 'Add a light bulb' }
    }

    const litBulb = bulbs.find(bulb => bulb.brightness >= 0.2)
    if (!litBulb) {
      return { success: false, message: 'Light bulb is too dim. Add more batteries!' }
    }

    return { success: false, tracking: true, message: 'Keep it lit! Batteries draining...' }
  },

  // 6. Parallel Power - 60 second challenge with parallel batteries
  validateParallelPower(circuit) {
    const bulbs = circuit.components.filter(c => c.type === 'lightbulb')
    const batteries = circuit.components.filter(c => c.type === 'battery')

    if (bulbs.length === 0) {
      return { success: false, message: 'Add a light bulb' }
    }

    if (batteries.length < 4) {
      return { success: false, message: 'You need at least 4 batteries (2 series pairs in parallel) to last 60 seconds!' }
    }

    const litBulb = bulbs.find(bulb => bulb.brightness >= 0.2)
    if (!litBulb) {
      return { success: false, message: 'Light bulb needs power!' }
    }

    return { success: false, tracking: true, message: 'Parallel banks give more capacity! Keep going...' }
  },

  // 7. Double Bright - Parallel LEDs
  validateDoubleBright(circuit) {
    const leds = circuit.components.filter(c => c.type === 'led')
    const resistors = circuit.components.filter(c => c.type === 'resistor')

    if (leds.length < 2) {
      return { success: false, message: 'Add at least 2 LEDs to the circuit' }
    }

    if (resistors.length < 2) {
      return { success: false, message: 'Each LED needs its own resistor for current control!' }
    }

    const litLEDs = leds.filter(led => led.brightness >= 0.1)
    if (litLEDs.length < 2) {
      return { success: false, message: 'Both LEDs need to light up! Check parallel connections.' }
    }

    return { success: true, message: '✨ Double the light! Parallel circuits rock.' }
  },

  // 8. Energy Bank - Capacitor with LED
  validateEnergyBank(circuit) {
    const capacitors = circuit.components.filter(c => c.type === 'capacitor')
    const leds = circuit.components.filter(c => c.type === 'led')

    if (capacitors.length === 0) {
      return { success: false, message: 'Add a capacitor to store energy!' }
    }

    if (leds.length === 0) {
      return { success: false, message: 'Add an LED to see the capacitor work!' }
    }

    const chargedCap = capacitors.find(cap => cap.voltage >= 1.5)
    if (!chargedCap) {
      return { success: false, message: 'Charge your capacitor to at least 1.5V!' }
    }

    const brightLED = leds.find(led => led.brightness >= 0.1)
    if (!brightLED) {
      return { success: false, message: 'LED should be lit by the capacitor!' }
    }

    return { success: true, message: '🔋 Capacitor is storing energy!' }
  },

  // 9. Capacitor Power - Capacitor in parallel with LED and battery
  validateCapacitorPower(circuit) {
    const capacitors = circuit.components.filter(c => c.type === 'capacitor')
    const leds = circuit.components.filter(c => c.type === 'led')
    const batteries = circuit.components.filter(c => c.type === 'battery')

    if (capacitors.length === 0) {
      return { success: false, message: 'Add a capacitor to smooth the power!' }
    }

    if (leds.length === 0) {
      return { success: false, message: 'Add an LED to light up!' }
    }

    if (batteries.length === 0) {
      return { success: false, message: 'Add a battery as the power source!' }
    }

    // Capacitor should be charging (voltage > 0)
    const chargingCap = capacitors.find(cap => cap.voltage > 0.5)
    if (!chargingCap) {
      return { success: false, message: 'Connect capacitor in parallel with LED and battery!' }
    }

    // LED should be lit
    const litLed = leds.find(led => led.brightness > 0.3)
    if (!litLed) {
      return { success: false, message: 'LED should be lit! Check your parallel connections.' }
    }

    return { success: true, message: '⚡ Perfect! Capacitor stabilizes the power delivery!' }
  },

  // 12. Triple Chain - 3 LEDs in series
  validateTripleChain(circuit) {
    const leds = circuit.components.filter(c => c.type === 'led')
    const batteries = circuit.components.filter(c => c.type === 'battery')

    if (leds.length < 3) {
      return { success: false, message: 'Add 3 LEDs to the circuit' }
    }

    if (batteries.length < 3) {
      return { success: false, message: 'Need at least 3 batteries to power 3 series LEDs!' }
    }

    const litLEDs = leds.filter(led => led.brightness >= 0.05)
    if (litLEDs.length < 3) {
      return { success: false, message: 'All 3 LEDs need to glow! Check series wiring.' }
    }

    return { success: true, message: '🔗 Series chain complete! Notice the voltage division?' }
  },

  // 13. LED Array - 3x3 grid
  validateLEDArray(circuit) {
    const leds = circuit.components.filter(c => c.type === 'led')

    if (leds.length < 9) {
      return { success: false, message: 'Need 9 LEDs for a 3x3 array!' }
    }

    const litLEDs = leds.filter(led => led.brightness >= 0.05)
    if (litLEDs.length < 9) {
      return { success: false, message: 'All 9 LEDs must light! Check parallel and series connections.' }
    }

    return { success: true, message: '✨ LED array complete! Beautiful matrix!' }
  },

  // 14. Voltage Divider
  validateVoltageDivide(circuit) {
    const resistors = circuit.components.filter(c => c.type === 'resistor')
    const leds = circuit.components.filter(c => c.type === 'led')

    if (resistors.length < 2) {
      return { success: false, message: 'Need 2 resistors in series for voltage division!' }
    }

    if (leds.length === 0) {
      return { success: false, message: 'Add an LED to power from the divided voltage!' }
    }

    const brightLED = leds.find(led => led.brightness >= 0.05)
    if (!brightLED) {
      return { success: false, message: 'LED should glow from the divided voltage!' }
    }

    return { success: true, message: '⚡ Voltage divider works! V_out = V_in * R2/(R1+R2)' }
  },

  // 15. Endurance - 2 LEDs for 90s
  validateEndurance(circuit) {
    const leds = circuit.components.filter(c => c.type === 'led')

    if (leds.length < 2) {
      return { success: false, message: 'Need 2 LEDs' }
    }

    const litLEDs = leds.filter(led => led.brightness >= 0.1)
    if (litLEDs.length < 2) {
      return { success: false, message: 'Both LEDs must stay lit!' }
    }

    return { success: false, tracking: true, message: 'Endurance test running...' }
  },

  // 16. RC Timing
  validateRCTiming(circuit) {
    const capacitors = circuit.components.filter(c => c.type === 'capacitor')
    const resistors = circuit.components.filter(c => c.type === 'resistor')
    const leds = circuit.components.filter(c => c.type === 'led')

    if (capacitors.length === 0) {
      return { success: false, message: 'Add a capacitor!' }
    }

    if (resistors.length === 0) {
      return { success: false, message: 'Add a resistor to create RC timing!' }
    }

    if (leds.length === 0) {
      return { success: false, message: 'Add an LED to see the timing effect!' }
    }

    const chargedCap = capacitors.find(cap => cap.voltage >= 1.0)
    if (!chargedCap) {
      return { success: false, message: 'Charge the capacitor first!' }
    }

    return { success: true, message: '⏱️ RC time constant = R × C. Watch it fade!' }
  },

  // 17. Efficiency - 1 battery only
  validateEfficiency(circuit) {
    const batteries = circuit.components.filter(c => c.type === 'battery')
    const leds = circuit.components.filter(c => c.type === 'led')
    const resistors = circuit.components.filter(c => c.type === 'resistor')

    if (batteries.length !== 1) {
      return { success: false, message: 'Use ONLY 1 battery for this challenge!' }
    }

    if (leds.length === 0) {
      return { success: false, message: 'Add an LED!' }
    }

    if (resistors.length === 0) {
      return { success: false, message: 'Use a resistor to limit current!' }
    }

    const brightLED = leds.find(led => led.brightness >= 0.1)
    if (!brightLED) {
      return { success: false, message: 'LED should glow with minimal power!' }
    }

    return { success: true, message: '💚 Efficiency achieved! Minimal power, maximum light!' }
  },

  // 18. Max Brightness
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
    if (led.brightness < 0.6) {
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
