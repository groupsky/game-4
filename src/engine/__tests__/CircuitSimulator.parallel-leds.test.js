import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../CircuitSimulator'

describe('CircuitSimulator - Parallel LEDs', () => {
  it('should light two parallel LEDs with equal brightness from single potato', () => {
    const simulator = new CircuitSimulator()

    const potato = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const led1 = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 50
    }

    const led2 = {
      id: 3,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 150
    }

    // Both LEDs connected to the same battery (parallel)
    simulator.setComponents([potato, led1, led2])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 1, to: 3 }
    ])

    const result = simulator.simulate()
    const updatedLed1 = result.find(c => c.id === 2)
    const updatedLed2 = result.find(c => c.id === 3)

    // Both LEDs should get full 0.9V (parallel connection)
    expect(updatedLed1.voltage).toBeCloseTo(0.9, 0.1)
    expect(updatedLed2.voltage).toBeCloseTo(0.9, 0.1)

    // Both should have equal, dim brightness
    expect(updatedLed1.brightness).toBeGreaterThan(0)
    expect(updatedLed1.brightness).toBeLessThan(0.2)
    expect(updatedLed2.brightness).toBeCloseTo(updatedLed1.brightness, 0.05)
  })

  it('should light three parallel LEDs with equal brightness from single potato', () => {
    const simulator = new CircuitSimulator()

    const potato = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const led1 = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 50
    }

    const led2 = {
      id: 3,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 100
    }

    const led3 = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 150
    }

    simulator.setComponents([potato, led1, led2, led3])
    simulator.setWires([
      { id: 5, from: 1, to: 2 },
      { id: 6, from: 1, to: 3 },
      { id: 7, from: 1, to: 4 }
    ])

    const result = simulator.simulate()
    const updatedLed1 = result.find(c => c.id === 2)
    const updatedLed2 = result.find(c => c.id === 3)
    const updatedLed3 = result.find(c => c.id === 4)

    // All LEDs should get full 0.9V
    expect(updatedLed1.voltage).toBeCloseTo(0.9, 0.1)
    expect(updatedLed2.voltage).toBeCloseTo(0.9, 0.1)
    expect(updatedLed3.voltage).toBeCloseTo(0.9, 0.1)

    // All should have equal, dim brightness
    expect(updatedLed1.brightness).toBeGreaterThan(0)
    expect(updatedLed1.brightness).toBeLessThan(0.2)
    expect(updatedLed2.brightness).toBeCloseTo(updatedLed1.brightness, 0.05)
    expect(updatedLed3.brightness).toBeCloseTo(updatedLed1.brightness, 0.05)
  })

  it('should light parallel LEDs with brighter light from series potatoes', () => {
    const simulator = new CircuitSimulator()

    const potato1 = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const potato2 = {
      id: 2,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 150,
      y: 100
    }

    const potato3 = {
      id: 3,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 200,
      y: 100
    }

    const led1 = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 250,
      y: 50
    }

    const led2 = {
      id: 5,
      type: 'led',
      brightness: 0,
      x: 250,
      y: 150
    }

    // Three potatoes in series, then two LEDs in parallel
    simulator.setComponents([potato1, potato2, potato3, led1, led2])
    simulator.setWires([
      { id: 6, from: 1, to: 2 },  // potato1 to potato2
      { id: 7, from: 2, to: 3 },  // potato2 to potato3
      { id: 8, from: 3, to: 4 },  // potato3 to led1
      { id: 9, from: 3, to: 5 }   // potato3 to led2
    ])

    const result = simulator.simulate()
    const updatedLed1 = result.find(c => c.id === 4)
    const updatedLed2 = result.find(c => c.id === 5)

    // Both LEDs get full 2.7V (3 * 0.9V)
    expect(updatedLed1.voltage).toBeCloseTo(2.7, 0.5)
    expect(updatedLed2.voltage).toBeCloseTo(2.7, 0.5)

    // Both should be reasonably bright (more than dim single potato)
    expect(updatedLed1.brightness).toBeGreaterThan(0.4)
    expect(updatedLed1.brightness).toBeLessThanOrEqual(1.0)
    expect(updatedLed2.brightness).toBeCloseTo(updatedLed1.brightness, 0.05)
  })

  it('should drain battery faster with multiple parallel LEDs', () => {
    const simulator = new CircuitSimulator()

    const potato = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const led1 = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 50
    }

    const led2 = {
      id: 3,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 150
    }

    simulator.setComponents([potato, led1, led2])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 1, to: 3 }
    ])

    const initialCharge = potato.charge
    simulator.simulate()
    const chargeAfterParallel = potato.charge

    // Reset for single LED test
    potato.charge = 1.0
    simulator.setComponents([potato, led1])
    simulator.setWires([{ id: 4, from: 1, to: 2 }])
    simulator.simulate()
    const chargeAfterSingle = potato.charge

    // Parallel configuration should drain faster (more current draw)
    const parallelDrain = initialCharge - chargeAfterParallel
    const singleDrain = initialCharge - chargeAfterSingle

    expect(parallelDrain).toBeGreaterThan(singleDrain)
  })

  it('should verify parallel LED battery drain uses parallelMultiplier correctly', () => {
    const simulator = new CircuitSimulator()

    // Test 1: Single LED
    const battery1 = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const led1 = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 100
    }

    simulator.setComponents([battery1, led1])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])

    simulator.simulate()
    const drainSingle = 1.0 - battery1.charge

    // Test 2: Two parallel LEDs
    const battery2 = {
      id: 4,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const led2 = {
      id: 5,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 50
    }

    const led3 = {
      id: 6,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 150
    }

    simulator.setComponents([battery2, led2, led3])
    simulator.setWires([
      { id: 7, from: 4, to: 5 },
      { id: 8, from: 4, to: 6 }
    ])

    simulator.simulate()
    const drainParallel = 1.0 - battery2.charge

    // Parallel LEDs should drain ~2x as fast (2 LEDs drawing current)
    // Allow some tolerance for calculation differences
    expect(drainParallel).toBeCloseTo(drainSingle * 2, 0.001)
  })
})
