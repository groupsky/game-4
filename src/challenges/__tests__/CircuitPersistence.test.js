import { describe, it, expect, beforeEach } from 'vitest'
import { ChallengeSystem } from '../ChallengeSystem.js'

describe('ChallengeSystem - Circuit Persistence', () => {
  let challengeSystem

  beforeEach(() => {
    localStorage.clear()
    challengeSystem = new ChallengeSystem()
  })

  it('should save circuit when challenge is selected', () => {
    const circuit = {
      components: [
        { id: 1, type: 'battery', x: 100, y: 100 },
        { id: 2, type: 'led', x: 200, y: 100 }
      ],
      wires: [{ from: 1, to: 2 }]
    }

    challengeSystem.saveCircuit('first-light', circuit)

    const saved = localStorage.getItem('circuitQuestProgress')
    const progress = JSON.parse(saved)

    expect(progress.circuits).toBeDefined()
    expect(progress.circuits['first-light']).toBeDefined()
    expect(progress.circuits['first-light'].components.length).toBe(2)
  })

  it('should load saved circuit for challenge', () => {
    const circuit = {
      components: [
        { id: 1, type: 'battery', x: 100, y: 100 },
        { id: 2, type: 'led', x: 200, y: 100 }
      ],
      wires: [{ from: 1, to: 2 }]
    }

    challengeSystem.saveCircuit('first-light', circuit)
    const loaded = challengeSystem.loadCircuit('first-light')

    expect(loaded).toBeDefined()
    expect(loaded.components.length).toBe(2)
    expect(loaded.components[0].type).toBe('battery')
    expect(loaded.wires.length).toBe(1)
  })

  it('should return null if no circuit saved for challenge', () => {
    const loaded = challengeSystem.loadCircuit('first-light')
    expect(loaded).toBeNull()
  })

  it('should save different circuits for different challenges', () => {
    const circuit1 = {
      components: [{ id: 1, type: 'battery', x: 100, y: 100 }],
      wires: []
    }

    const circuit2 = {
      components: [{ id: 2, type: 'led', x: 200, y: 200 }],
      wires: []
    }

    challengeSystem.saveCircuit('first-light', circuit1)
    challengeSystem.saveCircuit('power-up', circuit2)

    const loaded1 = challengeSystem.loadCircuit('first-light')
    const loaded2 = challengeSystem.loadCircuit('power-up')

    expect(loaded1.components[0].type).toBe('battery')
    expect(loaded2.components[0].type).toBe('led')
  })

  it('should clear circuit when challenge is completed', () => {
    const circuit = {
      components: [
        { id: 1, type: 'battery', voltage: 0.9, charge: 1.0 },
        { id: 2, type: 'led', brightness: 0.8 }
      ],
      wires: [{ from: 1, to: 2 }]
    }

    // Save circuit first
    challengeSystem.saveCircuit('first-light', circuit)
    expect(challengeSystem.loadCircuit('first-light')).toBeDefined()

    // Complete challenge
    challengeSystem.validate('first-light', circuit)

    // Circuit should be cleared
    expect(challengeSystem.loadCircuit('first-light')).toBeNull()
  })
})
