import { describe, it, expect } from 'vitest'
import { getChallengeDefinitions } from '../ChallengeDefinitions'
import { CircuitSimulator } from '../../engine/CircuitSimulator'
import { ComponentFactory } from '../../utils/ComponentFactory'

/**
 * Challenge Uniqueness Tests
 *
 * Verifies that challenges require different solutions - a solution for
 * Challenge N should NOT pass validation for Challenge N+1.
 *
 * This ensures challenges build on previous concepts and aren't trivially
 * solvable with copy-paste solutions.
 */
describe('Challenge Uniqueness - Solutions should not carry forward', () => {
  // Helper to create Challenge 8 solution (Energy Bank)
  const createChallenge8Solution = () => {
    const simulator = new CircuitSimulator()
    const b1 = ComponentFactory.createBattery(1)
    const b2 = ComponentFactory.createBattery(2)
    const capacitor = ComponentFactory.createCapacitor(3)
    const led = ComponentFactory.createLED(4)
    simulator.setComponents([b1, b2, capacitor, led])
    simulator.setWires([
      { id: 10, from: 1, to: 2 },   // b1 -> b2 (series)
      { id: 11, from: 2, to: 3 },   // b2 -> capacitor
      { id: 12, from: 2, to: 4 }    // b2 -> LED (parallel with capacitor)
    ])
    // Charge capacitor for ~2 seconds to reach 1.5V
    for (let i = 0; i < 20; i++) {
      simulator.simulate(0.1)
    }
    return simulator
  }

  it('Challenge 8 solution should NOT pass Challenge 9 validation', () => {
    const challenges = getChallengeDefinitions()
    const challenge8 = challenges.find(c => c.id === 'energy-bank')
    const challenge9 = challenges.find(c => c.id === 'capacitor-power')

    const circuit8 = createChallenge8Solution()

    // Should pass Challenge 8
    const result8 = challenge8.validator({
      components: circuit8.components,
      wires: circuit8.wires
    })
    expect(result8.success, 'Challenge 8 solution should pass Challenge 8').toBe(true)

    // Should FAIL Challenge 9 (Challenge 9 requires exactly 1 battery, Challenge 8 uses 2)
    const result9 = challenge9.validator({
      components: circuit8.components,
      wires: circuit8.wires
    })
    expect(result9.success, 'Challenge 8 solution should NOT pass Challenge 9 - too many batteries').toBe(false)
  })

  it('Challenge 1 solution should NOT pass Challenge 2 validation', () => {
    const challenges = getChallengeDefinitions()
    const challenge1 = challenges.find(c => c.id === 'first-light')
    const challenge2 = challenges.find(c => c.id === 'power-up')

    // Challenge 1: 1 battery + 1 LED
    const simulator = new CircuitSimulator()
    const battery = ComponentFactory.createBattery(1)
    const led = ComponentFactory.createLED(2)
    simulator.setComponents([battery, led])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])
    simulator.simulate(0.1)

    // Should pass Challenge 1
    const result1 = challenge1.validator({
      components: simulator.components,
      wires: simulator.wires
    })
    expect(result1.success, 'Challenge 1 solution should pass Challenge 1').toBe(true)

    // Should FAIL Challenge 2 (Challenge 2 requires 2+ batteries in series)
    const result2 = challenge2.validator({
      components: simulator.components,
      wires: simulator.wires
    })
    expect(result2.success, 'Challenge 1 solution should NOT pass Challenge 2 - needs more voltage').toBe(false)
  })

  it('Challenge 2 solution should NOT pass Challenge 3 validation', () => {
    const challenges = getChallengeDefinitions()
    const challenge2 = challenges.find(c => c.id === 'power-up')
    const challenge3 = challenges.find(c => c.id === 'current-control')

    // Challenge 2: 2 batteries + 1 LED (no resistor)
    const simulator = new CircuitSimulator()
    const b1 = ComponentFactory.createBattery(1)
    const b2 = ComponentFactory.createBattery(2)
    const led = ComponentFactory.createLED(3)
    simulator.setComponents([b1, b2, led])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 2, to: 3 }
    ])
    simulator.simulate(0.1)

    // Should pass Challenge 2
    const result2 = challenge2.validator({
      components: simulator.components,
      wires: simulator.wires
    })
    expect(result2.success, 'Challenge 2 solution should pass Challenge 2').toBe(true)

    // Should FAIL Challenge 3 (Challenge 3 requires resistor)
    const result3 = challenge3.validator({
      components: simulator.components,
      wires: simulator.wires
    })
    expect(result3.success, 'Challenge 2 solution should NOT pass Challenge 3 - needs resistor').toBe(false)
  })

  // Note: Challenge 3 -> Challenge 4 is allowed to carry forward because
  // Challenge 4 tests bulbs, but a solution with LED+resistor+batteries might work
  // depending on validator logic. This is acceptable pedagogical overlap.
})
