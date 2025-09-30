import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from './CircuitSimulator'

describe('CircuitSimulator', () => {
  it('should create a simulator instance', () => {
    const simulator = new CircuitSimulator()
    expect(simulator).toBeDefined()
  })

  it('should light up LED when connected to battery', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const led = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 200,
      y: 100
    }

    const wire = {
      id: 3,
      from: 1,
      to: 2
    }

    simulator.setComponents([battery, led])
    simulator.setWires([wire])

    const result = simulator.simulate()

    const updatedLed = result.find(c => c.id === 2)
    expect(updatedLed.brightness).toBeGreaterThan(0)
  })

  it('should not light LED without connection', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const led = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 200,
      y: 100
    }

    simulator.setComponents([battery, led])
    simulator.setWires([])

    const result = simulator.simulate()

    const updatedLed = result.find(c => c.id === 2)
    expect(updatedLed.brightness).toBe(0)
  })

  it('should drain battery over time', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const led = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 200,
      y: 100
    }

    const wire = {
      id: 3,
      from: 1,
      to: 2
    }

    simulator.setComponents([battery, led])
    simulator.setWires([wire])

    const initialCharge = battery.charge
    simulator.simulate()
    const finalCharge = battery.charge

    expect(finalCharge).toBeLessThan(initialCharge)
  })

  it('should calculate voltage divider correctly', () => {
    const simulator = new CircuitSimulator()
    const result = simulator.voltageDivider(10, 100, 100)
    expect(result).toBe(5)
  })

  it('should calculate power correctly', () => {
    const simulator = new CircuitSimulator()
    const result = simulator.power(5, 2)
    expect(result).toBe(10)
  })
})
