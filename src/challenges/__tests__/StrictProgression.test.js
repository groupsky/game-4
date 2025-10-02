import { describe, it, expect, beforeEach } from 'vitest'
import { ChallengeSystem } from '../ChallengeSystem'

describe('Challenge System - Strict Progression', () => {
  let challengeSystem

  beforeEach(() => {
    challengeSystem = new ChallengeSystem()
  })

  it('should only have first challenge unlocked initially', () => {
    const challenges = challengeSystem.getChallenges()

    expect(challenges[0].unlocked).toBe(true) // First challenge unlocked

    // All others should be locked
    for (let i = 1; i < challenges.length; i++) {
      expect(challenges[i].unlocked).toBe(false)
    }
  })

  it('should unlock second challenge only when first is completed', () => {
    const challenges = challengeSystem.getChallenges()

    // Initially, second challenge is locked
    expect(challenges[1].unlocked).toBe(false)

    // Complete first challenge (simulate with basic LED + battery)
    const circuit = {
      components: [
        { id: 1, type: 'battery', voltage: 0.9, charge: 1.0 },
        { id: 2, type: 'led', brightness: 0.7 }
      ],
      wires: [{ from: 1, to: 2 }]
    }

    const result = challengeSystem.validate('first-light', circuit)
    expect(result.success).toBe(true)

    // Now second challenge should be unlocked
    const updatedChallenges = challengeSystem.getChallenges()
    expect(updatedChallenges[1].unlocked).toBe(true)

    // Third challenge still locked
    expect(updatedChallenges[2].unlocked).toBe(false)
  })

  it('should not allow skipping challenges', () => {
    const challenges = challengeSystem.getChallenges()

    // Verify third challenge is locked
    expect(challenges[2].unlocked).toBe(false)

    // Try to validate third challenge without completing first two
    const circuit = {
      components: [
        { id: 1, type: 'battery', voltage: 0.9 },
        { id: 2, type: 'led', brightness: 0.5 },
        { id: 3, type: 'resistor', current: 0.005 }
      ],
      wires: [
        { from: 1, to: 3 },
        { from: 3, to: 2 }
      ]
    }

    // Challenge should still be locked - can't validate locked challenges
    expect(challenges[2].unlocked).toBe(false)
  })

  it('should unlock challenges in strict sequence', () => {
    const circuit1 = {
      components: [
        { id: 1, type: 'battery', voltage: 0.9, charge: 1.0 },
        { id: 2, type: 'led', brightness: 0.7 }
      ],
      wires: [{ from: 1, to: 2 }]
    }

    // Complete challenge 1
    challengeSystem.validate('first-light', circuit1)
    let challenges = challengeSystem.getChallenges()
    expect(challenges[0].completed).toBe(true)
    expect(challenges[1].unlocked).toBe(true)
    expect(challenges[2].unlocked).toBe(false)

    // Complete challenge 2
    const circuit2 = {
      components: [
        { id: 1, type: 'battery', voltage: 0.9, charge: 1.0 },
        { id: 2, type: 'battery', voltage: 0.9, charge: 1.0 },
        { id: 3, type: 'led', brightness: 0.9 }
      ],
      wires: [
        { from: 1, to: 2 },
        { from: 2, to: 3 }
      ]
    }

    challengeSystem.validate('power-up', circuit2)
    challenges = challengeSystem.getChallenges()
    expect(challenges[1].completed).toBe(true)
    expect(challenges[2].unlocked).toBe(true)
    expect(challenges[3].unlocked).toBe(false)
  })

  it('should show active challenge as first incomplete unlocked challenge', () => {
    const activeChallenge = challengeSystem.getActiveChallenge()

    expect(activeChallenge).toBeDefined()
    expect(activeChallenge.id).toBe('first-light')
    expect(activeChallenge.unlocked).toBe(true)
    expect(activeChallenge.completed).toBe(false)
  })

  it('should progress to next challenge after completion', () => {
    // Initially on first challenge
    let activeChallenge = challengeSystem.getActiveChallenge()
    expect(activeChallenge.id).toBe('first-light')

    // Complete first challenge
    const circuit = {
      components: [
        { id: 1, type: 'battery', voltage: 0.9, charge: 1.0 },
        { id: 2, type: 'led', brightness: 0.7 }
      ],
      wires: [{ from: 1, to: 2 }]
    }

    challengeSystem.validate('first-light', circuit)

    // Active challenge should now be second
    activeChallenge = challengeSystem.getActiveChallenge()
    expect(activeChallenge.id).toBe('power-up')
    expect(activeChallenge.unlocked).toBe(true)
    expect(activeChallenge.completed).toBe(false)
  })
})
