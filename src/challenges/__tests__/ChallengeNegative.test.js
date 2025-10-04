import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../../engine/CircuitSimulator'
import { ChallengeValidators } from '../ChallengeValidators'
import { ComponentFactory } from '../../utils/ComponentFactory'

describe('Challenge Negative Tests - Ensure challenges cannot be cheesed', () => {
  // Challenge 2: Power Up - should require multiple batteries
  it('Challenge 2: Should FAIL with only 1 battery (not bright enough)', () => {
    const simulator = new CircuitSimulator()

    const battery = ComponentFactory.createBattery(1)
    const led = { id: 2, type: 'led', brightness: 0 }

    simulator.setComponents([battery, led])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])
    simulator.simulate(0.1)

    const result = ChallengeValidators.validatePowerUp({
      components: simulator.components
    })

    expect(result.success).toBe(false)
    expect(result.message).toContain('at least 2 batteries')
  })

  // Challenge 3: Current Control - should require resistor
  it('Challenge 3: Should FAIL without resistor (LED too bright)', () => {
    const simulator = new CircuitSimulator()

    const battery1 = ComponentFactory.createBattery(1)
    const battery2 = ComponentFactory.createBattery(2)
    const battery3 = ComponentFactory.createBattery(3)
    const led = { id: 4, type: 'led', brightness: 0 }

    simulator.setComponents([battery1, battery2, battery3, led])
    simulator.setWires([
      { id: 5, from: 1, to: 2 },
      { id: 6, from: 2, to: 3 },
      { id: 7, from: 3, to: 4 }
    ])
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateCurrentControl({
      components: simulator.components
    })

    expect(result.success).toBe(false)
    expect(result.message).toContain('resistor')
  })

  it('Challenge 3: Should FAIL with resistor but LED still too bright', () => {
    const simulator = new CircuitSimulator()

    // Too many batteries with small resistor = LED still overdriven
    const batteries = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const resistor = { id: 10, type: 'resistor', resistance: 100 } // Too small
    const led = { id: 11, type: 'led', brightness: 0 }

    simulator.setComponents([...batteries, resistor, led])
    const wires = batteries.slice(0, -1).map((b, i) => ({
      id: 20 + i,
      from: b.id,
      to: batteries[i + 1].id
    }))
    wires.push({ id: 30, from: batteries[batteries.length - 1].id, to: resistor.id })
    wires.push({ id: 31, from: resistor.id, to: led.id })
    simulator.setWires(wires)
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateCurrentControl({
      components: simulator.components
    })

    expect(result.success).toBe(false)
    expect(result.message).toContain('still too bright')
  })

  // Challenge 4: Warm Glow - should require enough voltage for bulb
  it('Challenge 4: Should FAIL with only 1 battery (not enough voltage)', () => {
    const simulator = new CircuitSimulator()

    const battery = ComponentFactory.createBattery(1)
    const bulb = { id: 2, type: 'lightbulb', brightness: 0 }

    simulator.setComponents([battery, bulb])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateWarmGlow({
      components: simulator.components
    })

    expect(result.success).toBe(false)
    expect(result.message).toContain('at least 2 batteries')
  })

  it('Challenge 4: Should FAIL with 3 batteries (still too dim)', () => {
    const simulator = new CircuitSimulator()

    const batteries = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const bulb = { id: 10, type: 'lightbulb', brightness: 0 }

    simulator.setComponents([...batteries, bulb])
    const wires = batteries.slice(0, -1).map((b, i) => ({
      id: 20 + i,
      from: b.id,
      to: batteries[i + 1].id
    }))
    wires.push({ id: 30, from: batteries[batteries.length - 1].id, to: bulb.id })
    simulator.setWires(wires)
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateWarmGlow({
      components: simulator.components
    })

    expect(result.success).toBe(false)
    expect(result.message).toContain('more voltage')
  })

  // Challenge 7: Double Bright - should require 2 resistors (one per LED)
  it('Challenge 7: Should FAIL with only 1 resistor for 2 LEDs', () => {
    const simulator = new CircuitSimulator()

    const battery1 = ComponentFactory.createBattery(1)
    const battery2 = ComponentFactory.createBattery(2)
    const battery3 = ComponentFactory.createBattery(3)
    const resistor = { id: 4, type: 'resistor', resistance: 220 }
    const led1 = { id: 5, type: 'led', brightness: 0 }
    const led2 = { id: 6, type: 'led', brightness: 0 }

    simulator.setComponents([battery1, battery2, battery3, resistor, led1, led2])
    simulator.setWires([
      { id: 7, from: 1, to: 2 },
      { id: 8, from: 2, to: 3 },
      { id: 9, from: 3, to: 4 },  // Battery -> R1
      { id: 10, from: 4, to: 5 }, // R1 -> LED1
      { id: 11, from: 3, to: 6 }  // Battery -> LED2 (no resistor!)
    ])
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateDoubleBright({
      components: simulator.components
    })

    expect(result.success).toBe(false)
    expect(result.message).toContain('Each LED needs its own resistor')
  })

  it('Challenge 7: Should FAIL if only 1 LED is lit', () => {
    const simulator = new CircuitSimulator()

    const battery = ComponentFactory.createBattery(1)
    const resistor1 = { id: 2, type: 'resistor', resistance: 220 }
    const led1 = { id: 3, type: 'led', brightness: 0 }
    const resistor2 = { id: 4, type: 'resistor', resistance: 220 }
    const led2 = { id: 5, type: 'led', brightness: 0 }

    // Only wire up LED1, leave LED2 disconnected
    simulator.setComponents([battery, resistor1, led1, resistor2, led2])
    simulator.setWires([
      { id: 6, from: 1, to: 2 },
      { id: 7, from: 2, to: 3 }
      // LED2 not connected
    ])
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateDoubleBright({
      components: simulator.components
    })

    expect(result.success).toBe(false)
    expect(result.message).toContain('Both LEDs need to light up')
  })

  // Challenge 8: Energy Bank - should require capacitor
  it('Challenge 8: Should FAIL without capacitor', () => {
    const simulator = new CircuitSimulator()

    const battery1 = ComponentFactory.createBattery(1)
    const battery2 = ComponentFactory.createBattery(2)
    const led = { id: 3, type: 'led', brightness: 0 }

    simulator.setComponents([battery1, battery2, led])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 2, to: 3 }
    ])
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateEnergyBank({
      components: simulator.components
    })

    expect(result.success).toBe(false)
    expect(result.message).toContain('Add a capacitor')
  })

  it('Challenge 8: Should FAIL if capacitor not sufficiently charged', () => {
    const simulator = new CircuitSimulator()

    const battery = ComponentFactory.createBattery(1)
    const capacitor = { id: 2, type: 'capacitor', capacitance: 0.001, voltage: 0 }
    const led = { id: 3, type: 'led', brightness: 0 }

    simulator.setComponents([battery, capacitor, led])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 1, to: 3 }
    ])

    // Only 1 short simulation step - capacitor won't charge to 1.5V
    simulator.simulate(0.01)

    const result = ChallengeValidators.validateEnergyBank({
      components: simulator.components
    })

    expect(result.success).toBe(false)
    expect(result.message).toContain('Charge your capacitor to at least 1.5V')
  })

  // Challenge 9: Capacitor Power - should require capacitor, battery, and LED in parallel
  it('Challenge 9: Should FAIL without capacitor', () => {
    const simulator = new CircuitSimulator()

    const battery = ComponentFactory.createBattery(1)
    const led = { id: 2, type: 'led', brightness: 0 }

    simulator.setComponents([battery, led])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateCapacitorPower({
      components: simulator.components
    })

    expect(result.success).toBe(false)
    expect(result.message).toContain('Add a capacitor')
  })

  it('Challenge 9: Should FAIL without battery', () => {
    const simulator = new CircuitSimulator()

    const capacitor = { id: 1, type: 'capacitor', capacitance: 0.1, voltage: 0 }
    const led = { id: 2, type: 'led', brightness: 0 }

    simulator.setComponents([capacitor, led])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateCapacitorPower({
      components: simulator.components
    })

    expect(result.success).toBe(false)
    expect(result.message).toContain('Add a battery')
  })

  it('Challenge 9: Should FAIL if capacitor not charging (wrong topology)', () => {
    const simulator = new CircuitSimulator()

    const battery = ComponentFactory.createBattery(1)
    const capacitor = { id: 2, type: 'capacitor', capacitance: 0.1, voltage: 0 }
    const led = { id: 3, type: 'led', brightness: 0 }

    // Series topology instead of parallel - capacitor won't charge properly
    simulator.setComponents([battery, capacitor, led])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 2, to: 3 }
    ])
    simulator.simulate(0.01) // Very short time - won't charge enough

    const result = ChallengeValidators.validateCapacitorPower({
      components: simulator.components
    })

    expect(result.success).toBe(false)
    expect(result.message).toContain('Connect capacitor in parallel')
  })
})
