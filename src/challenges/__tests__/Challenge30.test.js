import { describe, it, expect } from 'vitest'
import { ChallengeSystem } from '../ChallengeSystem'

describe('ChallengeSystem - 30 Challenges', () => {
  it('should load all 30 Act 1 challenges', () => {
    const system = new ChallengeSystem()
    const challenges = system.getChallenges()

    expect(challenges.length).toBe(30)
  })

  it('should have challenge 1 unlocked by default', () => {
    const system = new ChallengeSystem()
    const firstChallenge = system.getChallenge('first-light')

    expect(firstChallenge).toBeDefined()
    expect(firstChallenge.unlocked).toBe(true)
    expect(firstChallenge.completed).toBe(false)
  })

  it('should have all challenges 2-30 locked initially', () => {
    const system = new ChallengeSystem()
    const challenges = system.getChallenges()

    for (let i = 1; i < 30; i++) {
      expect(challenges[i].unlocked).toBe(false)
    }
  })

  it('should return first-light as the active challenge initially', () => {
    const system = new ChallengeSystem()
    const active = system.getActiveChallenge()

    expect(active).toBeDefined()
    expect(active.id).toBe('first-light')
  })

  it('should have valid validators for all challenges', () => {
    const system = new ChallengeSystem()
    const challenges = system.getChallenges()

    challenges.forEach(challenge => {
      expect(challenge.validator).toBeDefined()
      expect(typeof challenge.validator).toBe('function')
    })
  })

  it('should have timed challenges spread throughout', () => {
    const system = new ChallengeSystem()
    const challenges = system.getChallenges()
    const timedChallenges = challenges.filter(c => c.requiresTime)

    // Expect at least 8 timed challenges
    expect(timedChallenges.length).toBeGreaterThanOrEqual(8)
  })

  it('should progress through challenges correctly', () => {
    const system = new ChallengeSystem()

    // Complete first challenge
    const circuit1 = {
      components: [
        { type: 'battery', charge: 1.0, voltage: 0.9 },
        { type: 'led', brightness: 0.5 }
      ],
      wires: []
    }

    const result = system.validate('first-light', circuit1)
    expect(result.success).toBe(true)

    // Check second challenge is now unlocked
    const powerUp = system.getChallenge('power-up')
    expect(powerUp.unlocked).toBe(true)

    // Active challenge should now be power-up
    const active = system.getActiveChallenge()
    expect(active.id).toBe('power-up')
  })

  it('should validate challenge 30 (master-inventor) correctly when unlocked', () => {
    const system = new ChallengeSystem()

    // Unlock challenge 30
    const masterInventor = system.getChallenge('master-inventor')
    masterInventor.unlocked = true

    // Create circuit with 5+ lit components
    const circuit = {
      components: [
        { type: 'battery', charge: 1.0, voltage: 0.9 },
        { type: 'battery', charge: 1.0, voltage: 0.9 },
        { type: 'battery', charge: 1.0, voltage: 0.9 },
        { type: 'led', brightness: 0.5 },
        { type: 'led', brightness: 0.5 },
        { type: 'led', brightness: 0.5 },
        { type: 'lightbulb', brightness: 0.5 },
        { type: 'lightbulb', brightness: 0.5 }
      ],
      wires: []
    }

    const result = system.validate('master-inventor', circuit)
    expect(result.message).toContain('5 components shining')
  })
})
