/**
 * ChallengeSystem - Manages gameplay challenges and progression
 *
 * Validates circuit configurations against challenge requirements
 * Tracks completion state and unlocks next challenges
 */

import { TimeTracker } from './TimeTracker.js'
import { ChallengeValidators } from './ChallengeValidators.js'

export class ChallengeSystem {
  constructor() {
    this.challenges = this.loadChallenges()
    this.timeTracker = new TimeTracker()
    this.lastActiveId = null
    this.loadProgress() // Load saved progress
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
        validator: (circuit) => ChallengeValidators.validateFirstLight(circuit),
        stars: { optimalComponents: 2 }
      },
      // 2. Series Batteries (Introduce voltage boost)
      {
        id: 'power-up',
        act: 1,
        title: '2. Power Up',
        description: 'One battery is too weak. Connect 2 or more batteries in series (end-to-end) to increase voltage and make your LED brighter!',
        unlocked: false,
        completed: false,
        validator: (circuit) => ChallengeValidators.validatePowerUp(circuit),
        stars: { optimalComponents: 3 }
      },
      // 3. Introduce Resistor (After seeing over-bright LED)
      {
        id: 'current-control',
        act: 1,
        title: '3. Current Control',
        description: 'Your LED is TOO bright now! Add a resistor to control the current and protect your LED from burning out.',
        unlocked: false,
        completed: false,
        validator: (circuit) => ChallengeValidators.validateCurrentControl(circuit),
        stars: { optimalComponents: 4 }
      },
      // 4. Introduce Light Bulb
      {
        id: 'warm-glow',
        act: 1,
        title: '4. The Warm Glow',
        description: 'Light bulbs need more power than LEDs. Use series batteries to power a light bulb.',
        unlocked: false,
        completed: false,
        validator: (circuit) => ChallengeValidators.validateWarmGlow(circuit)
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
        validator: (circuit) => ChallengeValidators.validateBatteryBlues(circuit)
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
        validator: (circuit) => ChallengeValidators.validateParallelPower(circuit)
      },
      // 7. Parallel LEDs
      {
        id: 'double-bright',
        act: 1,
        title: '7. Double Bright',
        description: 'Light up 2 LEDs at once using parallel connections. Each LED needs its own resistor!',
        unlocked: false,
        completed: false,
        validator: (circuit) => ChallengeValidators.validateDoubleBright(circuit)
      },
      // 8. Capacitor Smoothing
      {
        id: 'energy-bank',
        act: 1,
        title: '8. Energy Bank',
        description: 'Add a capacitor to store energy. Charge it up with batteries and watch it power your LED smoothly!',
        unlocked: false,
        completed: false,
        validator: (circuit) => ChallengeValidators.validateEnergyBank(circuit)
      },
      // 9. Capacitor Burst
      {
        id: 'flash-photo',
        act: 1,
        title: '9. Flash Photography',
        description: 'Charge a large capacitor to high voltage. Use its burst of energy to make a light bulb flash bright!',
        unlocked: false,
        completed: false,
        validator: (circuit) => ChallengeValidators.validateFlashPhoto(circuit)
      },
      // 10. Parallel Capacitors
      {
        id: 'cap-bank',
        act: 1,
        title: '10. Capacitor Bank',
        description: 'Connect 2 capacitors in parallel to double your energy storage! Charge them up and power an LED.',
        unlocked: false,
        completed: false,
        validator: (circuit) => ChallengeValidators.validateCapNetwork(circuit)
      },

      // === INTERMEDIATE: Component Mastery (11-20) ===
      // 11. Energy Storage Advanced
      {
        id: 'energy-bank-advanced',
        act: 1,
        title: '11. Energy Storage Mastery',
        description: 'Master capacitor energy storage! Charge a capacitor and keep an LED lit as it slowly discharges.',
        unlocked: false,
        completed: false,
        validator: (circuit) => ChallengeValidators.validateEnergyBank(circuit)
      },
      // 12. Triple LED Chain
      {
        id: 'triple-chain',
        act: 1,
        title: '12. Triple Chain',
        description: 'Connect 3 LEDs in series. Notice how the voltage divides and they glow dimmer!',
        unlocked: false,
        completed: false,
        validator: (circuit) => ChallengeValidators.validateTripleChain(circuit)
      },
      // 13. LED Array
      {
        id: 'led-array',
        act: 1,
        title: '13. LED Array',
        description: 'Create a 3x3 grid: 3 parallel branches, each with 3 LEDs in series. Light up all 9 LEDs!',
        unlocked: false,
        completed: false,
        validator: (circuit) => ChallengeValidators.validateLEDArray(circuit)
      },
      // 14. Voltage Divider
      {
        id: 'voltage-divide',
        act: 1,
        title: '14. Voltage Divider',
        description: 'Use 2 resistors in series to divide voltage. Power an LED from the middle point!',
        unlocked: false,
        completed: false,
        validator: (circuit) => ChallengeValidators.validateVoltageDivide(circuit)
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
        validator: (circuit) => ChallengeValidators.validateEndurance(circuit)
      },
      // 16. RC Timing
      {
        id: 'rc-timing',
        act: 1,
        title: '16. RC Timing',
        description: 'Use a resistor and capacitor to create a delay. Watch the LED fade slowly!',
        unlocked: false,
        completed: false,
        validator: (circuit) => ChallengeValidators.validateRCTiming(circuit)
      },
      // 17. Power Efficiency
      {
        id: 'efficiency',
        act: 1,
        title: '17. Power Efficiency',
        description: 'Light an LED using only 1 battery. Use minimal current (high resistance)!',
        unlocked: false,
        completed: false,
        validator: (circuit) => ChallengeValidators.validateEfficiency(circuit)
      },
      // 18. Maximum Brightness
      {
        id: 'max-bright',
        act: 1,
        title: '18. Maximum Brightness',
        description: 'Make a single LED as bright as possible without burning it out!',
        unlocked: false,
        completed: false,
        validator: (circuit) => ChallengeValidators.validateMaxBright(circuit)
      },
      // 19. Battery Bank
      {
        id: 'battery-bank',
        act: 1,
        title: '19. Battery Bank',
        description: 'Build a massive 3x3 battery bank (3 series chains in parallel). Feel the power!',
        unlocked: false,
        completed: false,
        validator: (circuit) => ChallengeValidators.validateBatteryBank(circuit)
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
        validator: (circuit) => ChallengeValidators.validateMarathon(circuit)
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
        validator: (circuit) => ChallengeValidators.validateDualPower(circuit)
      },
      // 22. Advanced Capacitor Network
      {
        id: 'cap-network-advanced',
        act: 1,
        title: '22. Advanced Capacitor Network',
        description: 'Build a capacitor network with batteries and use it to power multiple components!',
        unlocked: false,
        completed: false,
        validator: (circuit) => ChallengeValidators.validateCapNetwork(circuit)
      },
      // 23. Series Capacitors
      {
        id: 'series-caps',
        act: 1,
        title: '23. Series Capacitors',
        description: 'Connect 2 capacitors in series. Notice the voltage splits but capacity decreases!',
        unlocked: false,
        completed: false,
        validator: (circuit) => ChallengeValidators.validateSeriesCaps(circuit)
      },
      // 24. Mixed Load
      {
        id: 'mixed-load',
        act: 1,
        title: '24. Mixed Load',
        description: 'Run 2 LEDs in series AND 1 LED in parallel, all from one battery source!',
        unlocked: false,
        completed: false,
        validator: (circuit) => ChallengeValidators.validateMixedLoad(circuit)
      },
      // 25. Resistor Ladder
      {
        id: 'resistor-ladder',
        act: 1,
        title: '25. Resistor Ladder',
        description: 'Create a resistor chain with 3 different resistances. Study the current flow!',
        unlocked: false,
        completed: false,
        validator: (circuit) => ChallengeValidators.validateResistorLadder(circuit)
      },
      // 26. Power Distribution
      {
        id: 'power-dist',
        act: 1,
        title: '26. Power Distribution',
        description: 'Build a hub: 1 battery bank powers 3 separate LED branches in parallel!',
        unlocked: false,
        completed: false,
        validator: (circuit) => ChallengeValidators.validatePowerDist(circuit)
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
        validator: (circuit) => ChallengeValidators.validateSustainedFlash(circuit)
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
        validator: (circuit) => ChallengeValidators.validateEfficiencyMaster(circuit)
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
        validator: (circuit) => ChallengeValidators.validateGrandCircuit(circuit)
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
        validator: (circuit) => ChallengeValidators.validateMasterInventor(circuit)
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
    // If a specific challenge is selected, return that (if unlocked)
    if (this.lastActiveId) {
      const selected = this.challenges.find(c => c.id === this.lastActiveId)
      if (selected && selected.unlocked) {
        return selected
      }
    }

    // Otherwise, return first unlocked, incomplete challenge
    const active = this.challenges.find(c => c.unlocked && !c.completed)

    // Reset time tracker if we switched to a new challenge
    if (active && this.lastActiveId !== active.id) {
      this.timeTracker.reset()
      this.lastActiveId = active.id
    }

    return active
  }

  setActiveChallenge(challengeId) {
    const challenge = this.challenges.find(c => c.id === challengeId)
    if (challenge && challenge.unlocked) {
      this.lastActiveId = challengeId
      this.timeTracker.reset() // Reset timer for new challenge
      this.saveProgress() // Save selected challenge
    }
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
      // Clear saved circuit for completed challenge
      if (this.circuits && this.circuits[challengeId]) {
        delete this.circuits[challengeId]
      }
      this.saveProgress() // Save to localStorage
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
      // Clear saved circuit for completed challenge
      if (this.circuits && this.circuits[activeChallenge.id]) {
        delete this.circuits[activeChallenge.id]
      }
      this.saveProgress() // Save to localStorage
    }
  }

  getTimeTracker() {
    return this.timeTracker
  }

  resetTimeTracker() {
    this.timeTracker.reset()
  }

  // LocalStorage persistence
  saveProgress() {
    const progress = {
      challenges: this.challenges.map(c => ({
        id: c.id,
        completed: c.completed,
        unlocked: c.unlocked
      })),
      lastActiveId: this.lastActiveId,
      circuits: this.circuits || {}
    }
    localStorage.setItem('circuitQuestProgress', JSON.stringify(progress))
  }

  saveCircuit(challengeId, circuit) {
    if (!this.circuits) {
      this.circuits = {}
    }
    this.circuits[challengeId] = circuit
    this.saveProgress()
  }

  loadCircuit(challengeId) {
    if (!this.circuits || !this.circuits[challengeId]) {
      return null
    }
    return this.circuits[challengeId]
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem('circuitQuestProgress')
      if (!saved) return

      const progress = JSON.parse(saved)

      // Restore challenge state
      progress.challenges.forEach(savedChallenge => {
        const challenge = this.challenges.find(c => c.id === savedChallenge.id)
        if (challenge) {
          challenge.completed = savedChallenge.completed
          challenge.unlocked = savedChallenge.unlocked
        }
      })

      this.lastActiveId = progress.lastActiveId
      this.circuits = progress.circuits || {}
    } catch (error) {
      console.error('Failed to load progress:', error)
    }
  }

  clearProgress() {
    localStorage.removeItem('circuitQuestProgress')
    // Reset all challenges
    this.challenges.forEach((c, i) => {
      c.completed = false
      c.unlocked = i === 0 // Only first unlocked
    })
    this.lastActiveId = null
  }

}
