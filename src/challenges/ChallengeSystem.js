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
      // === BASICS: Getting Started (1-5) ===
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
      // 10. Capacitor Smoothing
      {
        id: 'energy-bank',
        act: 1,
        title: '10. Energy Bank',
        description: 'Add a capacitor to store energy. Charge it up with batteries and watch it power your LED smoothly!',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateEnergyBank(circuit)
      },

      // === INTERMEDIATE: Component Mastery (11-20) ===
      // 11. Flash Photography
      {
        id: 'flash-photo',
        act: 1,
        title: '11. Flash Photography',
        description: 'Charge a large capacitor to high voltage. Use its burst of energy to make a light bulb flash bright!',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateFlashPhoto(circuit)
      },
      // 12. Triple LED Chain
      {
        id: 'triple-chain',
        act: 1,
        title: '12. Triple Chain',
        description: 'Connect 3 LEDs in series. Notice how the voltage divides and they glow dimmer!',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateTripleChain(circuit)
      },
      // 13. LED Array
      {
        id: 'led-array',
        act: 1,
        title: '13. LED Array',
        description: 'Create a 3x3 grid: 3 parallel branches, each with 3 LEDs in series. Light up all 9 LEDs!',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateLEDArray(circuit)
      },
      // 14. Voltage Divider
      {
        id: 'voltage-divide',
        act: 1,
        title: '14. Voltage Divider',
        description: 'Use 2 resistors in series to divide voltage. Power an LED from the middle point!',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateVoltageDivide(circuit)
      },
      // 15. Endurance Test
      {
        id: 'endurance',
        act: 1,
        title: '15. Endurance Test',
        description: 'Build a circuit that keeps 2 LEDs lit for 90 seconds. Efficiency matters!',
        unlocked: false,
        completed: false,
        requiresTime: true,
        goalTime: 90,
        validator: (circuit) => this.validateEndurance(circuit)
      },
      // 16. RC Timing
      {
        id: 'rc-timing',
        act: 1,
        title: '16. RC Timing',
        description: 'Use a resistor and capacitor to create a delay. Watch the LED fade slowly!',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateRCTiming(circuit)
      },
      // 17. Power Efficiency
      {
        id: 'efficiency',
        act: 1,
        title: '17. Power Efficiency',
        description: 'Light an LED using only 1 battery. Use minimal current (high resistance)!',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateEfficiency(circuit)
      },
      // 18. Maximum Brightness
      {
        id: 'max-bright',
        act: 1,
        title: '18. Maximum Brightness',
        description: 'Make a single LED as bright as possible without burning it out!',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateMaxBright(circuit)
      },
      // 19. Battery Bank
      {
        id: 'battery-bank',
        act: 1,
        title: '19. Battery Bank',
        description: 'Build a massive 3x3 battery bank (3 series chains in parallel). Feel the power!',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateBatteryBank(circuit)
      },
      // 20. Marathon Run
      {
        id: 'marathon',
        act: 1,
        title: '20. Marathon Run',
        description: 'Power a light bulb for 2 full minutes! You\'ll need serious battery capacity.',
        unlocked: false,
        completed: false,
        requiresTime: true,
        goalTime: 120,
        validator: (circuit) => this.validateMarathon(circuit)
      },

      // === ADVANCED: Circuit Design (21-30) ===
      // 21. Dual Power
      {
        id: 'dual-power',
        act: 1,
        title: '21. Dual Power',
        description: 'Power an LED and a light bulb from the same battery bank. Balance the loads!',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateDualPower(circuit)
      },
      // 22. Capacitor Network
      {
        id: 'cap-network',
        act: 1,
        title: '22. Capacitor Network',
        description: 'Connect 2 capacitors in parallel to double energy storage capacity!',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateCapNetwork(circuit)
      },
      // 23. Series Capacitors
      {
        id: 'series-caps',
        act: 1,
        title: '23. Series Capacitors',
        description: 'Connect 2 capacitors in series. Notice the voltage splits but capacity decreases!',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateSeriesCaps(circuit)
      },
      // 24. Mixed Load
      {
        id: 'mixed-load',
        act: 1,
        title: '24. Mixed Load',
        description: 'Run 2 LEDs in series AND 1 LED in parallel, all from one battery source!',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateMixedLoad(circuit)
      },
      // 25. Resistor Ladder
      {
        id: 'resistor-ladder',
        act: 1,
        title: '25. Resistor Ladder',
        description: 'Create a resistor chain with 3 different resistances. Study the current flow!',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateResistorLadder(circuit)
      },
      // 26. Power Distribution
      {
        id: 'power-dist',
        act: 1,
        title: '26. Power Distribution',
        description: 'Build a hub: 1 battery bank powers 3 separate LED branches in parallel!',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validatePowerDist(circuit)
      },
      // 27. Sustained Flash
      {
        id: 'sustained-flash',
        act: 1,
        title: '27. Sustained Flash',
        description: 'Use batteries and capacitors together to power a bulb for 45 seconds!',
        unlocked: false,
        completed: false,
        requiresTime: true,
        goalTime: 45,
        validator: (circuit) => this.validateSustainedFlash(circuit)
      },
      // 28. Efficiency Challenge
      {
        id: 'efficiency-master',
        act: 1,
        title: '28. Efficiency Master',
        description: 'Light 3 LEDs for 60 seconds using only 3 batteries. No waste!',
        unlocked: false,
        completed: false,
        requiresTime: true,
        goalTime: 60,
        validator: (circuit) => this.validateEfficiencyMaster(circuit)
      },
      // 29. The Grand Circuit
      {
        id: 'grand-circuit',
        act: 1,
        title: '29. The Grand Circuit',
        description: 'Build the ultimate circuit: series batteries for voltage, parallel banks for capacity, power both LED and bulb, use resistors for control, add a capacitor for smoothing. Keep it running for 60 seconds!',
        unlocked: false,
        completed: false,
        requiresTime: true,
        requiresManualStart: true,
        goalTime: 60,
        validator: (circuit) => this.validateGrandCircuit(circuit)
      },
      // 30. Master Inventor
      {
        id: 'master-inventor',
        act: 1,
        title: '30. Master Inventor',
        description: 'The final test: Build ANY circuit that lights 5+ components and runs for 90 seconds. Show your mastery!',
        unlocked: false,
        completed: false,
        requiresTime: true,
        requiresManualStart: true,
        goalTime: 90,
        validator: (circuit) => this.validateMasterInventor(circuit)
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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

  // 25. Resistor Ladder
  validateResistorLadder(circuit) {
    const resistors = circuit.components.filter(c => c.type === 'resistor')

    if (resistors.length < 3) {
      return { success: false, message: 'Need 3 resistors in series!' }
    }

    // Check that resistors have current flowing (are being used)
    const activeResistors = resistors.filter(r => r.current > 0.001)
    if (activeResistors.length < 3) {
      return { success: false, message: 'All 3 resistors must be in the circuit!' }
    }

    return { success: true, message: '🪜 Resistor ladder! Total R = R1 + R2 + R3' }
  }

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
  }

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
  }

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
  }

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
  }

  // 30. Master Inventor - Final challenge
  validateMasterInventor(circuit) {
    const components = circuit.components

    // Count lit components (LEDs + bulbs)
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
