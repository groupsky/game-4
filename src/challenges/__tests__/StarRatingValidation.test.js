import { describe, it, expect } from 'vitest'
import { StarRating } from '../StarRating'
import { getChallengeDefinitions } from '../ChallengeDefinitions'
import { CircuitSimulator } from '../../engine/CircuitSimulator'
import { ComponentFactory } from '../../utils/ComponentFactory'
import { ChallengeValidators } from '../ChallengeValidators'

/**
 * Star Rating Validation Tests
 *
 * Verifies that optimal solutions for each challenge achieve 3 stars:
 * - Solution uses ≤ optimalComponents
 * - Solution passes validator
 * - StarRating.calculate returns 3 stars
 *
 * This ensures optimalComponents values are realistic and achievable.
 */
describe('Star Rating Validation - All Challenges', () => {
  // Helper to create optimal circuits for each challenge
  const createOptimalCircuit = (challengeId) => {
    const simulator = new CircuitSimulator()

    switch (challengeId) {
      case 'first-light': // Challenge 1: 2 components (1 battery + 1 LED)
        {
          const battery = ComponentFactory.createBattery(1)
          const led = ComponentFactory.createLED(2)
          simulator.setComponents([battery, led])
          simulator.setWires([{ id: 3, from: 1, to: 2 }])
        }
        break

      case 'power-up': // Challenge 2: 3 components (2 batteries + 1 LED)
        {
          const b1 = ComponentFactory.createBattery(1)
          const b2 = ComponentFactory.createBattery(2)
          const led = ComponentFactory.createLED(3)
          simulator.setComponents([b1, b2, led])
          simulator.setWires([
            { id: 4, from: 1, to: 2 },
            { id: 5, from: 2, to: 3 }
          ])
        }
        break

      case 'current-control': // Challenge 3: 4 components (2 batteries + 1 resistor + 1 LED)
        {
          const b1 = ComponentFactory.createBattery(1)
          const b2 = ComponentFactory.createBattery(2)
          const resistor = ComponentFactory.createResistor(3)
          const led = ComponentFactory.createLED(4)
          simulator.setComponents([b1, b2, resistor, led])
          simulator.setWires([
            { id: 5, from: 1, to: 2 },
            { id: 6, from: 2, to: 3 },
            { id: 7, from: 3, to: 4 }
          ])
        }
        break

      case 'warm-glow': // Challenge 4: 4 components (3 batteries + 1 bulb)
        {
          const batteries = Array.from({ length: 3 }, (_, i) =>
            ComponentFactory.createBattery(i + 1)
          )
          const bulb = ComponentFactory.createLightBulb(4)
          simulator.setComponents([...batteries, bulb])
          const wires = batteries.slice(0, -1).map((b, i) => ({
            id: 10 + i,
            from: b.id,
            to: batteries[i + 1].id
          }))
          wires.push({ id: 20, from: batteries[batteries.length - 1].id, to: bulb.id })
          simulator.setWires(wires)
        }
        break

      case 'double-bright': // Challenge 7: 6 components (2 batteries + 2 resistors + 2 LEDs)
        {
          // Need 2 batteries in series for enough voltage (1.8V)
          const b1 = ComponentFactory.createBattery(1)
          const b2 = ComponentFactory.createBattery(2)
          const r1 = ComponentFactory.createResistor(3)
          const r2 = ComponentFactory.createResistor(4)
          const led1 = ComponentFactory.createLED(5)
          const led2 = ComponentFactory.createLED(6)
          simulator.setComponents([b1, b2, r1, r2, led1, led2])
          // Series batteries, then parallel branches
          simulator.setWires([
            { id: 10, from: 1, to: 2 },   // b1 -> b2 (series)
            { id: 11, from: 2, to: 3 },   // b2 -> r1
            { id: 12, from: 3, to: 5 },   // r1 -> led1
            { id: 13, from: 2, to: 4 },   // b2 -> r2 (parallel)
            { id: 14, from: 4, to: 6 }    // r2 -> led2
          ])
        }
        break

      case 'energy-bank': // Challenge 8: 4 components (2 batteries + 1 capacitor + 1 LED)
        {
          // Need capacitor charged to 1.5V and LED lit
          const b1 = ComponentFactory.createBattery(1)
          const b2 = ComponentFactory.createBattery(2)
          const capacitor = ComponentFactory.createCapacitor(3)
          const led = ComponentFactory.createLED(4)
          simulator.setComponents([b1, b2, capacitor, led])
          // Series batteries -> capacitor (parallel) -> LED
          simulator.setWires([
            { id: 10, from: 1, to: 2 },   // b1 -> b2 (series)
            { id: 11, from: 2, to: 3 },   // b2 -> capacitor
            { id: 12, from: 2, to: 4 }    // b2 -> LED (parallel with capacitor)
          ])
        }
        break

      case 'capacitor-power': // Challenge 9: 3 components (1 battery + 1 capacitor + 1 LED)
        {
          const battery = ComponentFactory.createBattery(1)
          const capacitor = ComponentFactory.createCapacitor(2)
          const led = ComponentFactory.createLED(3)
          simulator.setComponents([battery, capacitor, led])
          // Parallel topology: battery -> capacitor AND battery -> LED
          simulator.setWires([
            { id: 4, from: 1, to: 2 },   // battery -> capacitor
            { id: 5, from: 1, to: 3 }    // battery -> LED (parallel)
          ])
        }
        break

      case 'capacitor-bank': // Challenge 10: 5 components (2 batteries + 2 capacitors + 1 LED)
        {
          const b1 = ComponentFactory.createBattery(1)
          const b2 = ComponentFactory.createBattery(2)
          const cap1 = ComponentFactory.createCapacitor(3)
          const cap2 = ComponentFactory.createCapacitor(4)
          const led = ComponentFactory.createLED(5)
          simulator.setComponents([b1, b2, cap1, cap2, led])
          simulator.setWires([
            { id: 6, from: 1, to: 2 },   // b1 -> b2 (series)
            { id: 7, from: 2, to: 3 },   // b2 -> cap1
            { id: 8, from: 2, to: 4 },   // b2 -> cap2 (parallel with cap1)
            { id: 9, from: 2, to: 5 }    // b2 -> LED
          ])
        }
        break

      case 'triple-chain': // Challenge 12: 6 components (3 batteries + 3 LEDs)
        {
          const batteries = Array.from({ length: 3 }, (_, i) =>
            ComponentFactory.createBattery(i + 1)
          )
          const leds = Array.from({ length: 3 }, (_, i) =>
            ComponentFactory.createLED(i + 4)
          )
          simulator.setComponents([...batteries, ...leds])
          // Series: b1 -> b2 -> b3 -> led1 -> led2 -> led3
          const wires = []
          for (let i = 0; i < batteries.length - 1; i++) {
            wires.push({ id: 10 + i, from: batteries[i].id, to: batteries[i + 1].id })
          }
          wires.push({ id: 20, from: batteries[2].id, to: leds[0].id })
          for (let i = 0; i < leds.length - 1; i++) {
            wires.push({ id: 21 + i, from: leds[i].id, to: leds[i + 1].id })
          }
          simulator.setWires(wires)
        }
        break

      case 'energy-storage-mastery': // Challenge 11: 4 components (same as Challenge 8)
        {
          const b1 = ComponentFactory.createBattery(1)
          const b2 = ComponentFactory.createBattery(2)
          const capacitor = ComponentFactory.createCapacitor(3)
          const led = ComponentFactory.createLED(4)
          simulator.setComponents([b1, b2, capacitor, led])
          simulator.setWires([
            { id: 5, from: 1, to: 2 },   // b1 -> b2 (series)
            { id: 6, from: 2, to: 3 },   // b2 -> capacitor
            { id: 7, from: 2, to: 4 }    // b2 -> LED (parallel)
          ])
        }
        break

      case 'led-array': // Challenge 13: 12 components (3 batteries + 9 LEDs)
        {
          const batteries = Array.from({ length: 3 }, (_, i) =>
            ComponentFactory.createBattery(i + 1)
          )
          const leds = Array.from({ length: 9 }, (_, i) =>
            ComponentFactory.createLED(i + 4)
          )
          simulator.setComponents([...batteries, ...leds])
          // Wire batteries in series
          const wires = []
          for (let i = 0; i < batteries.length - 1; i++) {
            wires.push({ id: 20 + i, from: batteries[i].id, to: batteries[i + 1].id })
          }
          // Wire all 9 LEDs in parallel from last battery
          leds.forEach((led, i) => {
            wires.push({ id: 30 + i, from: batteries[batteries.length - 1].id, to: led.id })
          })
          simulator.setWires(wires)
        }
        break

      case 'voltage-divider': // Challenge 14: 5 components (3 batteries + 2 resistors + 1 LED)
        {
          const batteries = Array.from({ length: 3 }, (_, i) =>
            ComponentFactory.createBattery(i + 1)
          )
          const r1 = ComponentFactory.createResistor(4)
          const r2 = ComponentFactory.createResistor(5)
          const led = ComponentFactory.createLED(6)
          simulator.setComponents([...batteries, r1, r2, led])
          // Series: b1 -> b2 -> b3 -> r1 -> r2 -> LED
          const wires = []
          for (let i = 0; i < batteries.length - 1; i++) {
            wires.push({ id: 10 + i, from: batteries[i].id, to: batteries[i + 1].id })
          }
          wires.push({ id: 20, from: batteries[batteries.length - 1].id, to: r1.id })
          wires.push({ id: 21, from: r1.id, to: r2.id })
          wires.push({ id: 22, from: r2.id, to: led.id })
          simulator.setWires(wires)
        }
        break

      case 'power-efficiency': // Challenge 17: 3 components (1 battery + 1 resistor + 1 LED)
        {
          const battery = ComponentFactory.createBattery(1)
          const resistor = ComponentFactory.createResistor(2)
          const led = ComponentFactory.createLED(3)
          simulator.setComponents([battery, resistor, led])
          simulator.setWires([
            { id: 4, from: 1, to: 2 },   // battery -> resistor
            { id: 5, from: 2, to: 3 }    // resistor -> LED
          ])
        }
        break

      default:
        return null
    }

    // Most circuits need one step to stabilize, but capacitors need longer to charge
    const capacitorChallenges = ['energy-bank', 'capacitor-power', 'capacitor-bank', 'energy-storage-mastery']
    if (capacitorChallenges.includes(challengeId)) {
      // Capacitors need time to charge to required voltage
      for (let i = 0; i < 20; i++) {
        simulator.simulate(0.1)
      }
    } else {
      simulator.simulate(0.1)
    }

    return simulator
  }

  // Test a subset of challenges to verify star rating system
  // These challenges have verified optimal circuits that achieve 3 stars
  const testCases = [
    { id: 'first-light', name: 'Challenge 1: First Light', optimal: 2 },
    { id: 'power-up', name: 'Challenge 2: Power Up', optimal: 3 },
    { id: 'current-control', name: 'Challenge 3: Current Control', optimal: 4 },
    { id: 'warm-glow', name: 'Challenge 4: The Warm Glow', optimal: 4 },
    { id: 'double-bright', name: 'Challenge 7: Double Bright', optimal: 6 },
    { id: 'energy-bank', name: 'Challenge 8: Energy Bank', optimal: 4 },
    { id: 'capacitor-power', name: 'Challenge 9: Capacitor Power', optimal: 3 },
    { id: 'capacitor-bank', name: 'Challenge 10: Capacitor Bank', optimal: 5 },
    { id: 'energy-storage-mastery', name: 'Challenge 11: Energy Storage Mastery', optimal: 4 },
    { id: 'triple-chain', name: 'Challenge 12: Triple Chain', optimal: 6 },
    { id: 'led-array', name: 'Challenge 13: LED Array', optimal: 12 },
    { id: 'voltage-divider', name: 'Challenge 14: Voltage Divider', optimal: 6 },
    { id: 'power-efficiency', name: 'Challenge 17: Power Efficiency', optimal: 3 }
    // TODO: Add optimal circuits for remaining challenges (16, 18-30)
  ]

  testCases.forEach(({ id, name, optimal }) => {
    it(`${name} - optimal solution achieves 3 stars`, () => {
      const challenges = getChallengeDefinitions()
      const challenge = challenges.flat().find(c => c.id === id)
      expect(challenge, `Challenge ${id} not found`).toBeDefined()

      const circuit = createOptimalCircuit(id)
      if (!circuit) {
        console.warn(`No optimal circuit defined for ${id} - skipping`)
        return
      }

      // Verify solution is actually optimal
      expect(circuit.components.length).toBeLessThanOrEqual(optimal)

      // Verify solution passes validator
      const result = challenge.validator({ components: circuit.components, wires: circuit.wires })
      expect(result.success, `${name} validator should pass with optimal circuit`).toBe(true)

      // Verify 3-star rating
      const stars = StarRating.calculate(challenge, { components: circuit.components })
      expect(stars, `${name} should achieve 3 stars with ${circuit.components.length} components`).toBe(3)

      console.log(`✓ ${name}: ${circuit.components.length} components → 3 stars`)
    })
  })

  it('should give 2 stars for near-optimal solutions', () => {
    const challenges = getChallengeDefinitions()
    const challenge = challenges.flat().find(c => c.id === 'first-light')

    // Optimal is 2, so 3-4 components should give 2 stars
    const stars = StarRating.calculate(challenge, { components: [1, 2, 3, 4] })
    expect(stars).toBe(2)
  })

  it('should give 1 star for inefficient solutions', () => {
    const challenges = getChallengeDefinitions()
    const challenge = challenges.flat().find(c => c.id === 'first-light')

    // Optimal is 2, so 5+ components should give 1 star
    const stars = StarRating.calculate(challenge, { components: [1, 2, 3, 4, 5] })
    expect(stars).toBe(1)
  })

  it('should require both optimal components AND time for 3 stars on timed challenges', () => {
    const challenge = {
      stars: { optimalComponents: 5, optimalTime: 60 }
    }

    // Optimal components but too slow
    let stars = StarRating.calculate(challenge, { components: [1, 2, 3, 4, 5] }, 70)
    expect(stars).toBe(2) // Can't get 3 stars if time exceeded

    // Optimal components and time
    stars = StarRating.calculate(challenge, { components: [1, 2, 3, 4, 5] }, 55)
    expect(stars).toBe(3)

    // Optimal time but too many components
    stars = StarRating.calculate(challenge, { components: [1, 2, 3, 4, 5, 6, 7, 8] }, 55)
    expect(stars).toBe(1)
  })
})
