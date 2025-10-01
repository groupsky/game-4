import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../../engine/CircuitSimulator'
import { ChallengeValidators } from '../ChallengeValidators'

describe('Challenge Solutions - Verify all challenges are solvable', () => {
  // Challenge 8: Energy Bank
  it('Challenge 8: Energy Bank - capacitor powers LED', () => {
    const simulator = new CircuitSimulator()

    // Solution: Battery charges capacitor in parallel with LED
    // Capacitor stores energy and helps power the LED smoothly
    const battery1 = { id: 1, type: 'battery', charge: 1.0, voltage: 0.9 }
    const battery2 = { id: 2, type: 'battery', charge: 1.0, voltage: 0.9 }
    const capacitor = { id: 3, type: 'capacitor', capacitance: 0.01, voltage: 0 }  // 10mF large cap
    const led = { id: 4, type: 'led', brightness: 0 }

    simulator.setComponents([battery1, battery2, capacitor, led])
    simulator.setWires([
      { id: 5, from: 1, to: 2 },  // Battery series
      { id: 6, from: 2, to: 3 },  // Battery -> Capacitor
      { id: 7, from: 2, to: 4 }   // Battery -> LED (parallel with capacitor)
    ])

    // Run simulation to charge capacitor and light LED
    for (let i = 0; i < 10; i++) {
      simulator.simulate(0.1)
    }

    console.log('Challenge 8:')
    console.log('  Capacitor voltage:', capacitor.voltage)
    console.log('  LED brightness:', led.brightness)

    // Validate
    const result = ChallengeValidators.validateEnergyBank({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(capacitor.voltage).toBeGreaterThanOrEqual(1.5)
    expect(led.brightness).toBeGreaterThanOrEqual(0.1)
  })

  // Challenge 9: Flash Photography
  it('Challenge 9: Flash Photography - capacitor discharges into bulb', () => {
    const simulator = new CircuitSimulator()

    // Step 1: Charge capacitor with batteries
    const battery1 = { id: 1, type: 'battery', charge: 1.0, voltage: 0.9 }
    const battery2 = { id: 2, type: 'battery', charge: 1.0, voltage: 0.9 }
    const battery3 = { id: 3, type: 'battery', charge: 1.0, voltage: 0.9 }
    const capacitor = { id: 5, type: 'capacitor', capacitance: 0.05, voltage: 0 }  // 50mF large cap
    const bulb = { id: 6, type: 'lightbulb', brightness: 0 }

    simulator.setComponents([battery1, battery2, battery3, capacitor, bulb])
    simulator.setWires([
      { id: 7, from: 1, to: 2 },  // Battery series
      { id: 8, from: 2, to: 3 },
      { id: 10, from: 3, to: 5 }  // Batteries -> Capacitor
    ])

    // Charge capacitor (without bulb)
    for (let i = 0; i < 20; i++) {
      simulator.simulate(0.1)
    }

    console.log('Challenge 9 (charging):')
    console.log('  Capacitor voltage:', capacitor.voltage)

    // Step 2: Connect bulb to discharge capacitor
    // Remove batteries, add bulb connection
    simulator.setComponents([capacitor, bulb])
    simulator.setWires([
      { id: 11, from: 5, to: 6 }  // Capacitor -> Bulb
    ])

    // Capacitor discharges into bulb (flash!)
    simulator.simulate(0.1)

    console.log('Challenge 9 (flash):')
    console.log('  Capacitor voltage:', capacitor.voltage)
    console.log('  Bulb brightness:', bulb.brightness)

    // Validate
    const result = ChallengeValidators.validateFlashPhoto({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(capacitor.voltage).toBeGreaterThanOrEqual(2.0)
    expect(bulb.brightness).toBeGreaterThanOrEqual(0.05)
  })
})
