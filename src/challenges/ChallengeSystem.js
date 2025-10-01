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
      {
        id: 'light-led',
        act: 1,
        title: 'Light an LED',
        description: 'Connect an LED to a potato battery and make it light up. The LED needs enough voltage to glow.',
        unlocked: true,
        completed: false,
        validator: (circuit) => this.validateLightLED(circuit)
      },
      {
        id: 'power-bulb-1min',
        act: 1,
        title: 'Power a Light Bulb',
        description: 'Keep a light bulb powered for at least 1 minute using potato batteries.',
        unlocked: false,
        completed: false,
        requiresTime: true,
        goalTime: 60,
        validator: (circuit) => this.validatePowerBulb(circuit)
      },
      {
        id: 'series-batteries',
        act: 1,
        title: 'Series Battery Power',
        description: 'Connect multiple potato batteries in series to increase voltage.',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateSeriesBatteries(circuit)
      },
      {
        id: 'parallel-leds',
        act: 1,
        title: 'Multiple LEDs',
        description: 'Light up multiple LEDs in parallel from the same battery.',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateParallelLEDs(circuit)
      },
      {
        id: 'capacitor-charging',
        act: 1,
        title: 'Energy Storage',
        description: 'Charge a capacitor and use it to power an LED.',
        unlocked: false,
        completed: false,
        validator: (circuit) => this.validateCapacitorCharging(circuit)
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

    if (result.success) {
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

  // Validation functions

  validateLightLED(circuit) {
    const leds = circuit.components.filter(c => c.type === 'led')

    if (leds.length === 0) {
      return { success: false, message: 'Add an LED to the circuit' }
    }

    const brightLED = leds.find(led => led.brightness >= 0.1)

    if (!brightLED) {
      return { success: false, message: 'LED is too dim - add more voltage or check connections' }
    }

    return { success: true, message: 'Success! LED is lit.' }
  }

  validatePowerBulb(circuit) {
    const bulbs = circuit.components.filter(c => c.type === 'lightbulb')

    if (bulbs.length === 0) {
      return { success: false, message: 'Add a light bulb to the circuit' }
    }

    const litBulb = bulbs.find(bulb => bulb.brightness >= 0.1)

    if (!litBulb) {
      return { success: false, message: 'Light bulb needs more power' }
    }

    // Return tracking: true to signal time tracking should continue
    return { success: false, tracking: true, message: 'Light bulb is glowing! Keep it powered...' }
  }

  validateSeriesBatteries(circuit) {
    const batteries = circuit.components.filter(c => c.type === 'battery')

    if (batteries.length < 2) {
      return { success: false, message: 'Connect at least 2 batteries in series' }
    }

    // Check if we have significant voltage (series connection)
    const totalVoltage = batteries.reduce((sum, b) => sum + (b.voltage || 0), 0)

    if (totalVoltage < 1.5) {
      return { success: false, message: 'Batteries need to be connected in series' }
    }

    return { success: true, message: 'Series batteries working! Higher voltage achieved.' }
  }

  validateParallelLEDs(circuit) {
    const leds = circuit.components.filter(c => c.type === 'led')

    if (leds.length < 2) {
      return { success: false, message: 'Add at least 2 LEDs to the circuit' }
    }

    const litLEDs = leds.filter(led => led.brightness >= 0.1)

    if (litLEDs.length < 2) {
      return { success: false, message: 'Light up at least 2 LEDs' }
    }

    return { success: true, message: 'Multiple LEDs lit in parallel!' }
  }

  validateCapacitorCharging(circuit) {
    const capacitors = circuit.components.filter(c => c.type === 'capacitor')

    if (capacitors.length === 0) {
      return { success: false, message: 'Add a capacitor to the circuit' }
    }

    const chargedCapacitor = capacitors.find(cap => cap.voltage >= 1.0)

    if (!chargedCapacitor) {
      return { success: false, message: 'Capacitor needs more charge' }
    }

    return { success: true, message: 'Capacitor charged! Energy storage working.' }
  }
}
