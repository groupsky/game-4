/**
 * BasicValidators - Validation functions for challenges 1-17
 *
 * Includes basic circuit challenges: LEDs, batteries, resistors,
 * capacitors, and simple combinations.
 *
 * Each validator receives a circuit object and returns:
 * { success: boolean, message: string, tracking?: boolean }
 */

export const BasicValidators = {
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

  // 14. Resistor Chain
  validateVoltageDivide(circuit) {
    const resistors = circuit.components.filter(c => c.type === 'resistor')
    const leds = circuit.components.filter(c => c.type === 'led')

    if (resistors.length < 2) {
      return { success: false, message: 'Need 2 resistors in your circuit!' }
    }

    if (leds.length === 0) {
      return { success: false, message: 'Add an LED!' }
    }

    const brightLED = leds.find(led => led.brightness >= 0.05)
    if (!brightLED) {
      return { success: false, message: 'LED should glow! Check your connections.' }
    }

    return { success: true, message: '⚡ Resistor chain complete! Total R = R1 + R2 + ...' }
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

    // Adjusted for 100Ω resistor (UI value): 1 battery + 100Ω gives ~0.04 brightness
    const brightLED = leds.find(led => led.brightness >= 0.03)
    if (!brightLED) {
      return { success: false, message: 'LED should glow with minimal power!' }
    }

    return { success: true, message: '💚 Efficiency achieved! Minimal power, maximum light!' }
  },

}
