import { describe, it, expect, beforeEach } from 'vitest'
import { ChallengeSystem } from '../ChallengeSystem.js'
import { StarRating } from '../StarRating.js'

describe('Challenge Star Ratings', () => {
  let challengeSystem

  beforeEach(() => {
    localStorage.clear()
    challengeSystem = new ChallengeSystem()
  })

  describe('Challenge 1: First Light', () => {
    it('should award 3 stars for optimal solution (2 components)', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9, charge: 1.0 },
          { type: 'led', brightness: 0.8 }
        ],
        wires: [{ from: 0, to: 1 }]
      }

      const challenge = challengeSystem.getChallenge('first-light')
      const stars = StarRating.calculate(challenge, circuit)

      expect(stars).toBe(3)
    })

    it('should award 2 stars for suboptimal solution (4 components)', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9, charge: 1.0 },
          { type: 'battery', voltage: 0.9, charge: 1.0 },
          { type: 'resistor', current: 0.01 },
          { type: 'led', brightness: 0.8 }
        ],
        wires: []
      }

      const challenge = challengeSystem.getChallenge('first-light')
      const stars = StarRating.calculate(challenge, circuit)

      expect(stars).toBe(2)
    })

    it('should award 1 star for inefficient solution (7 components)', () => {
      const circuit = {
        components: [
          { type: 'battery' },
          { type: 'battery' },
          { type: 'battery' },
          { type: 'resistor' },
          { type: 'resistor' },
          { type: 'capacitor' },
          { type: 'led', brightness: 0.8 }
        ],
        wires: []
      }

      const challenge = challengeSystem.getChallenge('first-light')
      const stars = StarRating.calculate(challenge, circuit)

      expect(stars).toBe(1)
    })
  })

  describe('Challenge 2: Power Up', () => {
    it('should award 3 stars for optimal solution (3 components)', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9, charge: 1.0 },
          { type: 'battery', voltage: 0.9, charge: 1.0 },
          { type: 'led', brightness: 0.9 }
        ],
        wires: []
      }

      const challenge = challengeSystem.getChallenge('power-up')
      const stars = StarRating.calculate(challenge, circuit)

      expect(stars).toBe(3)
    })

    it('should award 1 star for inefficient solution (6 components)', () => {
      const circuit = {
        components: [
          { type: 'battery' },
          { type: 'battery' },
          { type: 'battery' },
          { type: 'battery' },
          { type: 'resistor' },
          { type: 'led', brightness: 0.9 }
        ],
        wires: []
      }

      const challenge = challengeSystem.getChallenge('power-up')
      const stars = StarRating.calculate(challenge, circuit)

      expect(stars).toBe(1)
    })
  })

  describe('Challenge 3: Current Control', () => {
    it('should award 3 stars for optimal solution (4 components)', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9, charge: 1.0 },
          { type: 'battery', voltage: 0.9, charge: 1.0 },
          { type: 'resistor', current: 0.01 },
          { type: 'led', brightness: 0.6 }
        ],
        wires: []
      }

      const challenge = challengeSystem.getChallenge('current-control')
      const stars = StarRating.calculate(challenge, circuit)

      expect(stars).toBe(3)
    })

    it('should award 2 stars for suboptimal solution (6 components)', () => {
      const circuit = {
        components: [
          { type: 'battery' },
          { type: 'battery' },
          { type: 'battery' },
          { type: 'resistor' },
          { type: 'resistor' },
          { type: 'led', brightness: 0.6 }
        ],
        wires: []
      }

      const challenge = challengeSystem.getChallenge('current-control')
      const stars = StarRating.calculate(challenge, circuit)

      expect(stars).toBe(2)
    })
  })

  describe('Challenge 4: Warm Glow', () => {
    it('should award 3 stars for optimal solution (3 components)', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'lightbulb', brightness: 0.3 }
        ],
        wires: []
      }

      const challenge = challengeSystem.getChallenge('warm-glow')
      const stars = StarRating.calculate(challenge, circuit)

      expect(stars).toBe(3)
    })

    it('should award 2 stars for suboptimal solution (5 components)', () => {
      const circuit = {
        components: [
          { type: 'battery' },
          { type: 'battery' },
          { type: 'battery' },
          { type: 'resistor' },
          { type: 'lightbulb', brightness: 0.3 }
        ],
        wires: []
      }

      const challenge = challengeSystem.getChallenge('warm-glow')
      const stars = StarRating.calculate(challenge, circuit)

      expect(stars).toBe(2)
    })
  })

  describe('Challenge 5: Battery Blues (timed)', () => {
    it('should award 3 stars for optimal solution with fast time', () => {
      const circuit = {
        components: [
          { type: 'battery' },
          { type: 'battery' },
          { type: 'battery' },
          { type: 'lightbulb', brightness: 0.3 }
        ],
        wires: []
      }

      const challenge = challengeSystem.getChallenge('battery-blues')
      const timeElapsed = 30 // Exactly at goal
      const stars = StarRating.calculate(challenge, circuit, timeElapsed)

      expect(stars).toBe(3)
    })

    it('should award 2 stars for suboptimal components but acceptable time', () => {
      const circuit = {
        components: [
          { type: 'battery' },
          { type: 'battery' },
          { type: 'battery' },
          { type: 'battery' },
          { type: 'resistor' },
          { type: 'lightbulb', brightness: 0.3 }
        ],
        wires: []
      }

      const challenge = challengeSystem.getChallenge('battery-blues')
      const timeElapsed = 31
      const stars = StarRating.calculate(challenge, circuit, timeElapsed)

      expect(stars).toBe(2)
    })

    it('should award 1 star for too many components', () => {
      const circuit = {
        components: [
          { type: 'battery' },
          { type: 'battery' },
          { type: 'battery' },
          { type: 'battery' },
          { type: 'battery' },
          { type: 'resistor' },
          { type: 'capacitor' },
          { type: 'lightbulb', brightness: 0.3 }
        ],
        wires: []
      }

      const challenge = challengeSystem.getChallenge('battery-blues')
      const timeElapsed = 35
      const stars = StarRating.calculate(challenge, circuit, timeElapsed)

      expect(stars).toBe(1)
    })
  })
})
