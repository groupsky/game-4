/**
 * ChallengeSystem - Manages gameplay challenges and progression
 *
 * Validates circuit configurations against challenge requirements
 * Tracks completion state and unlocks next challenges
 */

import { TimeTracker } from './TimeTracker.js'

export class ChallengeSystem {
  constructor() {
    this.challenges = this.loadChallenges()
    this.timeTracker = new TimeTracker()
    this.lastActiveId = null
  }

  loadChallenges() {
    return [
      // 1. Tutorial - Basic Connection
      {
        id: 'first-light',
        act: 1,
        title: '1. First Light',
        description: 'Connect an LED to a potato battery. Watch it glow! This is your first circuit.',
        unlocked: true,
        completed: false,
        validator: (circuit) => this.validateFirstLight(circuit)
      },
      // 2. Series Batteries (Introduce voltage boost)
      {
        id: 'power-up',
        act: 1,
        title: '2. Power Up',
        description: 'One battery is too weak. Connect 2 or more batteries in series (end-to-end) to increase voltage and make your LED brighter!',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validatePowerUp(circuit)
      },
      // 3. Introduce Resistor (After seeing over-bright LED)
      {
        id: 'current-control',
        act: 1,
        title: '3. Current Control',
        description: 'Your LED is TOO bright now! Add a resistor to control the current and protect your LED from burning out.',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateCurrentControl(circuit)
      },
      // 4. Introduce Light Bulb
      {
        id: 'warm-glow',
        act: 1,
        title: '4. The Warm Glow',
        description: 'Light bulbs need more power than LEDs. Use series batteries to power a light bulb.',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateWarmGlow(circuit)
      },
      // 5. Battery Drain (30s)
      {
        id: 'battery-blues',
        act: 1,
        title: '5. Battery Blues',
        description: 'Light bulbs drain batteries fast! Keep one lit for 30 seconds. You\'ll need enough batteries to last.',
        unlocked: false,
        completed: false,
        requiresTime: true,
        goalTime: 30,
        validator: (circuit) => this.validateBatteryBlues(circuit)
      },
      // 6. Parallel Batteries
      {
        id: 'parallel-power',
        act: 1,
        title: '6. Parallel Power',
        description: 'To last longer, connect battery pairs in parallel (side-by-side). This increases capacity, not voltage. Keep the bulb lit for 60 seconds!',
        unlocked: false,
        completed: false,
        requiresTime: true,
        goalTime: 60,
        validator: (circuit) => this.validateParallelPower(circuit)
      },
      // 7. Parallel LEDs
      {
        id: 'double-bright',
        act: 1,
        title: '7. Double Bright',
        description: 'Light up 2 LEDs at once using parallel connections. Each LED needs its own resistor!',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateDoubleBright(circuit)
      },
      // 8. Capacitor Smoothing
      {
        id: 'energy-bank',
        act: 1,
        title: '8. Energy Bank',
        description: 'Add a capacitor to store energy. Charge it up with batteries and watch it power your LED smoothly!',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateEnergyBank(circuit)
      },
      // 9. Capacitor Burst
      {
        id: 'flash-photo',
        act: 1,
        title: '9. Flash Photography',
        description: 'Charge a large capacitor to high voltage. Use its burst of energy to make a light bulb flash bright!',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateFlashPhoto(circuit)
      },
      // 10. Final Challenge
      {
        id: 'grand-circuit',
        act: 1,
        title: '10. The Grand Circuit',
        description: 'Build the ultimate circuit: series batteries for voltage, parallel banks for capacity, power both LED and bulb, use resistors for control, add a capacitor for smoothing. Keep it running for 45 seconds!',
        unlocked: false,
        completed: false,
        requiresTime: true,
        requiresManualStart: true,  // Must validate setup before timer starts
        goalTime: 45,
        validator: (circuit) => this.validateGrandCircuit(circuit)
      }
    ]
  }

  getChallenges() {
    return this.challenges
  }

  getChallenge(id) {
    return this.challenges.find(c => c.id === id)
  }

  getActiveChallenge() {
    // Return first unlocked, incomplete challenge
    const active = this.challenges.find(c => c.unlocked && !c.completed)

    // Reset time tracker if we switched to a new challenge
    if (active && this.lastActiveId !== active.id) {
      this.timeTracker.reset()
      this.lastActiveId = active.id
    }

    return active
  }

  validate(challengeId, circuit) {
    const challenge = this.getChallenge(challengeId)

    if (!challenge) {
      return { success: false, message: 'Challenge not found' }
    }

    if (!challenge.unlocked) {
      return { success: false, message: 'Challenge is locked' }
    }

    const result = challenge.validator(circuit)

    // For manual-start time challenges, success means "ready to start timer", not "completed"
    if (result.success && !challenge.requiresManualStart) {
      challenge.completed = true
      this.unlockNextChallenge(challengeId)
    }

    return result
  }

  unlockNextChallenge(completedChallengeId) {
    const index = this.challenges.findIndex(c => c.id === completedChallengeId)
    if (index >= 0 && index < this.challenges.length - 1) {
      this.challenges[index + 1].unlocked = true
    }
  }

  // Time tracking methods

  updateTimeTracking(circuit) {
    const activeChallenge = this.getActiveChallenge()

    if (!activeChallenge || !activeChallenge.requiresTime) {
      return
    }

    // For challenges requiring manual start, don't auto-start timer
    if (activeChallenge.requiresManualStart && !this.timeTracker.running) {
      return
    }

    // Check if condition is met for time-based challenge
    const validationResult = activeChallenge.validator(circuit)
    const conditionMet = validationResult.success || validationResult.tracking

    if (!this.timeTracker.running && conditionMet) {
      this.timeTracker.start()
    } else if (!conditionMet) {
      this.timeTracker.reset()
    }

    this.timeTracker.update(() => conditionMet)

    // Check if goal time reached
    if (this.timeTracker.hasReachedGoal(activeChallenge.goalTime)) {
      activeChallenge.completed = true
      this.unlockNextChallenge(activeChallenge.id)
      this.timeTracker.stop()
    }
  }

  getTimeTracker() {
    return this.timeTracker
  }

  resetTimeTracker() {
    this.timeTracker.reset()
  }

  // Validation functions for 10 progressive challenges

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
  }

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

    // Check if LED is overdriven (too bright = bad)
    const overdriven = leds.find(led => led.brightness > 0.7)
    if (overdriven) {
      return { success: false, message: 'LED is still too bright! Use a higher resistance resistor (220Ω or 1kΩ).' }
    }

    return { success: true, message: '⚡ Perfect! LED is bright but safe. Current is controlled!' }
  }

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
  }

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
  }

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

    // Return tracking: true for time-based challenge
    return { success: false, tracking: true, message: 'Keep it lit! Batteries draining...' }
  }

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

    // Return tracking: true for time-based challenge
    return { success: false, tracking: true, message: 'Parallel banks give more capacity! Keep going...' }
  }

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
  }

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
  }

  // 9. Flash Photography - Capacitor burst for bulb
  validateFlashPhoto(circuit) {
    const capacitors = circuit.components.filter(c => c.type === 'capacitor')
    const bulbs = circuit.components.filter(c => c.type === 'lightbulb')

    if (capacitors.length === 0) {
      return { success: false, message: 'Add a capacitor for the energy burst!' }
    }

    if (bulbs.length === 0) {
      return { success: false, message: 'Add a light bulb to see the flash!' }
    }

    const chargedCap = capacitors.find(cap => cap.voltage >= 2.5)
    if (!chargedCap) {
      return { success: false, message: 'Charge capacitor to at least 2.5V for a bright flash!' }
    }

    const brightBulb = bulbs.find(bulb => bulb.brightness >= 0.4)
    if (!brightBulb) {
      return { success: false, message: 'Bulb needs to flash bright! More capacitor charge needed.' }
    }

    return { success: true, message: '📸 Flash! That\'s a capacitor discharge!' }
  }

  // 10. Grand Circuit - Everything combined, 45 second challenge
  validateGrandCircuit(circuit) {
    const batteries = circuit.components.filter(c => c.type === 'battery')
    const leds = circuit.components.filter(c => c.type === 'led')
    const bulbs = circuit.components.filter(c => c.type === 'lightbulb')
    const resistors = circuit.components.filter(c => c.type === 'resistor')
    const capacitors = circuit.components.filter(c => c.type === 'capacitor')

    // Check all components present
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

    // Check components are working
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

    // For manual-start time challenge: return success to indicate ready to start timer
    // After timer starts, tracking continues via updateTimeTracking
    return { success: true, tracking: true, message: '🎯 Grand Circuit validated! Timer starting...' }
  }
}
