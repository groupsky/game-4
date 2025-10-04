/**
 * ChallengeSystem - Manages gameplay challenges and progression
 *
 * Validates circuit configurations against challenge requirements
 * Tracks completion state and unlocks next challenges
 */

import { TimeTracker } from './TimeTracker.js'
import { getChallengeDefinitions } from './ChallengeDefinitions.js'

export class ChallengeSystem {
  constructor() {
    this.challenges = getChallengeDefinitions()
    this.timeTracker = new TimeTracker()
    this.lastActiveId = null
    this.loadProgress() // Load saved progress
  }

  loadChallenges() {
    return getChallengeDefinitions()
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

    const wasRunning = this.timeTracker.running

    if (!this.timeTracker.running && conditionMet) {
      this.timeTracker.start()
    } else if (!conditionMet && this.timeTracker.running) {
      // Challenge failed - condition was met but is no longer met
      this.timeTracker.failed = true
      this.timeTracker.stop()
      return
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
