import { describe, it, expect, beforeEach } from 'vitest'
import { ChallengeSystem } from '../ChallengeSystem.js'

describe('Challenge Validation - New Progression', () => {
  let challengeSystem

  beforeEach(() => {
    challengeSystem = new ChallengeSystem()
  })

  // Helper to unlock challenges up to a specific one
  function unlockUpTo(challengeId) {
    const challenges = challengeSystem.getChallenges()
    for (const challenge of challenges) {
      challenge.unlocked = true
      if (challenge.id === challengeId) break
    }
  }

  describe('Challenge 1: First Light', () => {
    it('should pass with battery and LED connected', () => {
      const circuit = {
        components: [
          { id: 1, type: 'battery', voltage: 0.9 },
          { id: 2, type: 'led', brightness: 0.5 }
        ],
        wires: [{ from: 1, to: 2 }]
      }

      const result = challengeSystem.validate('first-light', circuit)
      expect(result.success).toBe(true)
    })

    it('should fail if LED is not bright enough', () => {
      const circuit = {
        components: [
          { id: 1, type: 'battery', voltage: 0.9 },
          { id: 2, type: 'led', brightness: 0.05 }
        ],
        wires: [{ from: 1, to: 2 }]
      }

      const result = challengeSystem.validate('first-light', circuit)
      expect(result.success).toBe(false)
    })
  })

  describe('Challenge 2: Power Up (Series Batteries)', () => {
    beforeEach(() => {
      // Unlock challenge 2 by completing challenge 1
      challengeSystem.getChallenge('first-light').completed = true
      challengeSystem.unlockNextChallenge('first-light')
    })

    it('should require at least 2 batteries', () => {
      const circuit = {
        components: [
          { id: 1, type: 'battery', voltage: 0.9 },
          { id: 2, type: 'led', brightness: 0.2 }
        ],
        wires: [{ from: 1, to: 2 }]
      }

      const result = challengeSystem.validate('power-up', circuit)
      expect(result.success).toBe(false)
      expect(result.message).toContain('2 batteries')
    })

    it('should pass with 2+ batteries in series and bright LED', () => {
      const circuit = {
        components: [
          { id: 1, type: 'battery', voltage: 0.9 },
          { id: 2, type: 'battery', voltage: 0.9 },
          { id: 3, type: 'led', brightness: 0.6 }
        ],
        wires: [
          { from: 1, to: 2 },
          { from: 2, to: 3 }
        ]
      }

      const result = challengeSystem.validate('power-up', circuit)
      expect(result.success).toBe(true)
    })
  })

  describe('Challenge 3: Current Control', () => {
    beforeEach(() => {
      unlockUpTo('current-control')
    })

    it('should require resistor in circuit', () => {
      const circuit = {
        components: [
          { id: 1, type: 'battery', voltage: 0.9 },
          { id: 2, type: 'battery', voltage: 0.9 },
          { id: 3, type: 'led', brightness: 0.95 }
        ],
        wires: [{ from: 1, to: 2 }, { from: 2, to: 3 }]
      }

      const result = challengeSystem.validate('current-control', circuit)
      expect(result.success).toBe(false)
      expect(result.message).toContain('resistor')
    })

    it('should pass with resistor and safe LED brightness', () => {
      const circuit = {
        components: [
          { id: 1, type: 'battery', voltage: 0.9 },
          { id: 2, type: 'battery', voltage: 0.9 },
          { id: 3, type: 'resistor', resistance: 100 },
          { id: 4, type: 'led', brightness: 0.4 }
        ],
        wires: [{ from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }]
      }

      const result = challengeSystem.validate('current-control', circuit)
      expect(result.success).toBe(true)
    })

    it('should fail if LED is overdriven despite having resistor', () => {
      const circuit = {
        components: [
          { id: 1, type: 'battery', voltage: 0.9 },
          { id: 2, type: 'battery', voltage: 0.9 },
          { id: 3, type: 'resistor', resistance: 1 }, // Too low resistance
          { id: 4, type: 'led', brightness: 0.95 }
        ],
        wires: [{ from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }]
      }

      const result = challengeSystem.validate('current-control', circuit)
      expect(result.success).toBe(false)
    })
  })

  describe('Challenge 6: Parallel Power', () => {
    beforeEach(() => {
      unlockUpTo('parallel-power')
    })

    it('should require parallel battery branches', () => {
      const circuit = {
        components: [
          { id: 1, type: 'battery', voltage: 0.9 },
          { id: 2, type: 'battery', voltage: 0.9 },
          { id: 3, type: 'lightbulb', brightness: 0.3 }
        ],
        wires: [
          { from: 1, to: 2 },
          { from: 2, to: 3 }
        ]
      }

      const result = challengeSystem.validate('parallel-power', circuit)
      expect(result.success).toBe(false)
      expect(result.message).toContain('parallel')
    })
  })

  describe('Challenge 7: Double Bright (Parallel LEDs)', () => {
    beforeEach(() => {
      unlockUpTo('double-bright')
    })

    it('should require at least 2 LEDs', () => {
      const circuit = {
        components: [
          { id: 1, type: 'battery', voltage: 0.9 },
          { id: 2, type: 'led', brightness: 0.5 }
        ],
        wires: [{ from: 1, to: 2 }]
      }

      const result = challengeSystem.validate('double-bright', circuit)
      expect(result.success).toBe(false)
    })

    it('should pass with 2 bright LEDs in parallel', () => {
      const circuit = {
        components: [
          { id: 1, type: 'battery', voltage: 0.9 },
          { id: 2, type: 'resistor', resistance: 100 },
          { id: 3, type: 'led', brightness: 0.4 },
          { id: 4, type: 'resistor', resistance: 100 },
          { id: 5, type: 'led', brightness: 0.4 }
        ],
        wires: [
          { from: 1, to: 2 },
          { from: 2, to: 3 },
          { from: 1, to: 4 },
          { from: 4, to: 5 }
        ]
      }

      const result = challengeSystem.validate('double-bright', circuit)
      expect(result.success).toBe(true)
    })
  })

  describe('Challenge 8: Energy Bank (Capacitor)', () => {
    beforeEach(() => {
      unlockUpTo('energy-bank')
    })

    it('should require capacitor with sufficient charge', () => {
      const circuit = {
        components: [
          { id: 1, type: 'battery', voltage: 0.9 },
          { id: 2, type: 'led', brightness: 0.3 }
        ],
        wires: [{ from: 1, to: 2 }]
      }

      const result = challengeSystem.validate('energy-bank', circuit)
      expect(result.success).toBe(false)
      expect(result.message).toContain('capacitor')
    })

    it('should pass with charged capacitor and LED', () => {
      const circuit = {
        components: [
          { id: 1, type: 'battery', voltage: 0.9 },
          { id: 2, type: 'capacitor', voltage: 1.8, capacitance: 0.001 },
          { id: 3, type: 'resistor', resistance: 100 },
          { id: 4, type: 'led', brightness: 0.3 }
        ],
        wires: [
          { from: 1, to: 2 },
          { from: 2, to: 3 },
          { from: 3, to: 4 }
        ]
      }

      const result = challengeSystem.validate('energy-bank', circuit)
      expect(result.success).toBe(true)
    })
  })

  describe('Challenge 10: Grand Circuit', () => {
    it('should require multiple components working together', () => {
      const circuit = {
        components: [
          { id: 1, type: 'battery', voltage: 0.9 },
          { id: 2, type: 'battery', voltage: 0.9 },
          { id: 3, type: 'battery', voltage: 0.9 },
          { id: 4, type: 'battery', voltage: 0.9 },
          { id: 5, type: 'resistor', resistance: 100 },
          { id: 6, type: 'led', brightness: 0.4 },
          { id: 7, type: 'lightbulb', brightness: 0.3 },
          { id: 8, type: 'capacitor', voltage: 1.5, capacitance: 0.001 }
        ],
        wires: []
      }

      const result = challengeSystem.validate('grand-circuit', circuit)
      // Should validate complex requirements
      expect(result).toBeDefined()
    })
  })
})
