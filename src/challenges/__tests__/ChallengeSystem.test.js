import { describe, it, expect, beforeEach } from 'vitest'
import { ChallengeSystem } from '../ChallengeSystem.js'

describe('ChallengeSystem', () => {
  let challengeSystem

  beforeEach(() => {
    // Clear localStorage to start fresh
    localStorage.clear()
    challengeSystem = new ChallengeSystem()
  })

  describe('Challenge Loading', () => {
    it('should load Act 1 challenges on initialization', () => {
      const challenges = challengeSystem.getChallenges()

      expect(challenges.length).toBeGreaterThan(0)
      expect(challenges[0].act).toBe(1)
    })

    it('should have "First Light" as first challenge', () => {
      const challenges = challengeSystem.getChallenges()
      const firstChallenge = challenges[0]

      expect(firstChallenge.id).toBe('first-light')
      expect(firstChallenge.title).toContain('First Light')
      expect(firstChallenge.description).toContain('potato battery')
    })

    it('should mark first challenge as unlocked', () => {
      const challenges = challengeSystem.getChallenges()
      const firstChallenge = challenges[0]

      expect(firstChallenge.unlocked).toBe(true)
      expect(firstChallenge.completed).toBe(false)
    })
  })

  describe('Challenge Validation', () => {
    it('should validate LED lighting with battery', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9, charge: 1.0 },
          { type: 'led', brightness: 0.8 }
        ],
        wires: []
      }

      const result = challengeSystem.validate('first-light', circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Success')
    })

    it('should fail validation if LED is not bright enough', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9, charge: 1.0 },
          { type: 'led', brightness: 0.05 }
        ],
        wires: []
      }

      const result = challengeSystem.validate('first-light', circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('dim')
    })

    it('should fail validation if no LED present', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9, charge: 1.0 }
        ],
        wires: []
      }

      const result = challengeSystem.validate('first-light', circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('LED')
    })
  })

  describe('Challenge Completion', () => {
    it('should mark challenge as completed when validated', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9, charge: 1.0 },
          { type: 'led', brightness: 0.8 }
        ],
        wires: []
      }

      challengeSystem.validate('first-light', circuit)
      const challenge = challengeSystem.getChallenge('first-light')

      expect(challenge.completed).toBe(true)
    })

    it('should unlock next challenge after completion', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9, charge: 1.0 },
          { type: 'led', brightness: 0.8 }
        ],
        wires: []
      }

      challengeSystem.validate('first-light', circuit)
      const challenges = challengeSystem.getChallenges()
      const secondChallenge = challenges[1]

      expect(secondChallenge.unlocked).toBe(true)
    })
  })

  describe('Active Challenge', () => {
    it('should return first unlocked challenge as active', () => {
      const active = challengeSystem.getActiveChallenge()

      expect(active.id).toBe('first-light')
      expect(active.unlocked).toBe(true)
    })

    it('should update active challenge after completion', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9, charge: 1.0 },
          { type: 'led', brightness: 0.8 }
        ],
        wires: []
      }

      challengeSystem.validate('first-light', circuit)
      const active = challengeSystem.getActiveChallenge()

      expect(active.id).not.toBe('first-light')
    })
  })
})
