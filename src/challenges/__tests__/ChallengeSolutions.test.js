import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../../engine/CircuitSimulator'
import { ChallengeValidators } from '../ChallengeValidators'

describe('Challenge Solutions - Verify all challenges are solvable', () => {
  // Challenge 1: First Light
  it('Challenge 1: First Light - LED + battery', () => {
    const simulator = new CircuitSimulator()

    const battery = { id: 1, type: 'battery', charge: 1.0, voltage: 0.9 }
    const led = { id: 2, type: 'led', brightness: 0 }

    simulator.setComponents([battery, led])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateFirstLight({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(led.brightness).toBeGreaterThan(0)
  })

  // Challenge 2: Power Up
  it('Challenge 2: Power Up - series batteries boost voltage', () => {
    const simulator = new CircuitSimulator()

    const battery1 = { id: 1, type: 'battery', charge: 1.0, voltage: 0.9 }
    const battery2 = { id: 2, type: 'battery', charge: 1.0, voltage: 0.9 }
    const led = { id: 3, type: 'led', brightness: 0 }

    simulator.setComponents([battery1, battery2, led])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 2, to: 3 }
    ])
    simulator.simulate(0.1)

    const result = ChallengeValidators.validatePowerUp({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(led.brightness).toBeGreaterThan(0.5)
  })

  // Challenge 3: Current Control
  it('Challenge 3: Current Control - resistor protects LED', () => {
    const simulator = new CircuitSimulator()

    const battery1 = { id: 1, type: 'battery', charge: 1.0, voltage: 0.9 }
    const battery2 = { id: 2, type: 'battery', charge: 1.0, voltage: 0.9 }
    const battery3 = { id: 3, type: 'battery', charge: 1.0, voltage: 0.9 }
    const resistor = { id: 4, type: 'resistor', resistance: 220 }
    const led = { id: 5, type: 'led', brightness: 0 }

    simulator.setComponents([battery1, battery2, battery3, resistor, led])
    simulator.setWires([
      { id: 6, from: 1, to: 2 },
      { id: 7, from: 2, to: 3 },
      { id: 8, from: 3, to: 4 },
      { id: 9, from: 4, to: 5 }
    ])
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateCurrentControl({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(led.brightness).toBeGreaterThan(0.1)
    expect(led.brightness).toBeLessThan(1.0)
  })

  // Challenge 4: Warm Glow
  it('Challenge 4: Warm Glow - power a light bulb', () => {
    const simulator = new CircuitSimulator()

    // Need 5 batteries (4.5V) to get bulb to 0.2+ brightness
    const batteries = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const bulb = { id: 6, type: 'lightbulb', brightness: 0 }

    simulator.setComponents([...batteries, bulb])
    const wires = batteries.slice(0, -1).map((b, i) => ({
      id: 10 + i,
      from: b.id,
      to: batteries[i + 1].id
    }))
    wires.push({ id: 20, from: batteries[batteries.length - 1].id, to: bulb.id })
    simulator.setWires(wires)
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateWarmGlow({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(bulb.brightness).toBeGreaterThan(0.2)
  })

  // Challenge 7: Double Bright
  it('Challenge 7: Double Bright - parallel LEDs with resistors', () => {
    const simulator = new CircuitSimulator()

    const battery1 = { id: 1, type: 'battery', charge: 1.0, voltage: 0.9 }
    const battery2 = { id: 2, type: 'battery', charge: 1.0, voltage: 0.9 }
    const battery3 = { id: 3, type: 'battery', charge: 1.0, voltage: 0.9 }
    const resistor1 = { id: 4, type: 'resistor', resistance: 220 }
    const led1 = { id: 5, type: 'led', brightness: 0 }
    const resistor2 = { id: 6, type: 'resistor', resistance: 220 }
    const led2 = { id: 7, type: 'led', brightness: 0 }

    simulator.setComponents([battery1, battery2, battery3, resistor1, led1, resistor2, led2])
    simulator.setWires([
      { id: 8, from: 1, to: 2 },
      { id: 9, from: 2, to: 3 },
      { id: 10, from: 3, to: 4 },  // Battery -> R1
      { id: 11, from: 4, to: 5 },  // R1 -> LED1
      { id: 12, from: 3, to: 6 },  // Battery -> R2 (parallel)
      { id: 13, from: 6, to: 7 }   // R2 -> LED2
    ])
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateDoubleBright({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(led1.brightness).toBeGreaterThan(0.1)
    expect(led2.brightness).toBeGreaterThan(0.1)
  })

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


    // Step 2: Connect bulb to discharge capacitor
    // Remove batteries, add bulb connection
    simulator.setComponents([capacitor, bulb])
    simulator.setWires([
      { id: 11, from: 5, to: 6 }  // Capacitor -> Bulb
    ])

    // Capacitor discharges into bulb (flash!)
    simulator.simulate(0.1)


    // Validate
    const result = ChallengeValidators.validateFlashPhoto({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(capacitor.voltage).toBeGreaterThanOrEqual(2.0)
    expect(bulb.brightness).toBeGreaterThanOrEqual(0.05)
  })
})
