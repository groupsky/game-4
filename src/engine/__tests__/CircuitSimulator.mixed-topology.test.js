import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../CircuitSimulator'

describe('CircuitSimulator - Mixed Topologies', () => {
  it('should handle series LEDs with one LED having a parallel branch', () => {
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

    // LED1 in series, then LED2 and LED3 in parallel
    const led1 = {
      id: 3,
      type: 'led',
      brightness: 0,
      x: 200,
      y: 100
    }

    const led2 = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 250,
      y: 50
    }

    const led3 = {
      id: 5,
      type: 'led',
      brightness: 0,
      x: 250,
      y: 150
    }

    // potato1 -> potato2 -> led1 -> led2
    //                       led1 -> led3
    simulator.setComponents([potato1, potato2, led1, led2, led3])
    simulator.setWires([
      { id: 6, from: 1, to: 2 },  // potato1 to potato2
      { id: 7, from: 2, to: 3 },  // potato2 to led1
      { id: 8, from: 3, to: 4 },  // led1 to led2
      { id: 9, from: 3, to: 5 }   // led1 to led3
    ])

    const result = simulator.simulate()
    const updatedLed1 = result.find(c => c.id === 3)
    const updatedLed2 = result.find(c => c.id === 4)
    const updatedLed3 = result.find(c => c.id === 5)

    // All LEDs should light
    expect(updatedLed1.brightness).toBeGreaterThan(0)
    expect(updatedLed2.brightness).toBeGreaterThan(0)
    expect(updatedLed3.brightness).toBeGreaterThan(0)

    // LED2 and LED3 are parallel branches, so should have equal brightness
    expect(updatedLed3.brightness).toBeCloseTo(updatedLed2.brightness, 0.05)
  })

  it('should handle two parallel potato branches powering separate LEDs', () => {
    const simulator = new CircuitSimulator()

    // Two separate branches, each with a potato and LED
    const potato1 = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 50
    }

    const led1 = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 50
    }

    const potato2 = {
      id: 3,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 150
    }

    const led2 = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 150
    }

    // Two independent circuits
    simulator.setComponents([potato1, led1, potato2, led2])
    simulator.setWires([
      { id: 5, from: 1, to: 2 },  // potato1 to led1
      { id: 6, from: 3, to: 4 }   // potato2 to led2
    ])

    const result = simulator.simulate()
    const updatedLed1 = result.find(c => c.id === 2)
    const updatedLed2 = result.find(c => c.id === 4)

    // Both LEDs should be independently powered
    expect(updatedLed1.voltage).toBeCloseTo(0.9, 0.1)
    expect(updatedLed2.voltage).toBeCloseTo(0.9, 0.1)
    expect(updatedLed1.brightness).toBeGreaterThan(0)
    expect(updatedLed2.brightness).toBeGreaterThan(0)
    expect(updatedLed2.brightness).toBeCloseTo(updatedLed1.brightness, 0.05)
  })

  it('should handle series potatoes with parallel LED branches at different points', () => {
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

    // Two parallel LEDs after first potato
    const led1 = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 125,
      y: 50
    }

    const led2 = {
      id: 5,
      type: 'led',
      brightness: 0,
      x: 125,
      y: 150
    }

    // Two parallel LEDs after all three potatoes
    const led3 = {
      id: 6,
      type: 'led',
      brightness: 0,
      x: 225,
      y: 50
    }

    const led4 = {
      id: 7,
      type: 'led',
      brightness: 0,
      x: 225,
      y: 150
    }

    // potato1 branches to led1 and led2 (parallel)
    // potato1 -> potato2 -> potato3 branches to led3 and led4 (parallel)
    simulator.setComponents([potato1, potato2, potato3, led1, led2, led3, led4])
    simulator.setWires([
      { id: 8, from: 1, to: 4 },   // potato1 to led1
      { id: 9, from: 1, to: 5 },   // potato1 to led2
      { id: 10, from: 1, to: 2 },  // potato1 to potato2
      { id: 11, from: 2, to: 3 },  // potato2 to potato3
      { id: 12, from: 3, to: 6 },  // potato3 to led3
      { id: 13, from: 3, to: 7 }   // potato3 to led4
    ])

    const result = simulator.simulate()
    const updatedLed1 = result.find(c => c.id === 4)
    const updatedLed2 = result.find(c => c.id === 5)
    const updatedLed3 = result.find(c => c.id === 6)
    const updatedLed4 = result.find(c => c.id === 7)

    // Note: In this complex topology, all components are connected,
    // so LEDs see voltage from all batteries (simple implementation)
    // LED1 and LED2 are parallel and connected to the entire battery chain
    expect(updatedLed1.voltage).toBeCloseTo(2.7, 0.5)
    expect(updatedLed2.voltage).toBeCloseTo(2.7, 0.5)
    expect(updatedLed1.brightness).toBeGreaterThan(0)
    expect(updatedLed2.brightness).toBeCloseTo(updatedLed1.brightness, 0.05)

    // LED3 and LED4 also get full voltage from the battery chain
    expect(updatedLed3.voltage).toBeCloseTo(2.7, 0.5)
    expect(updatedLed4.voltage).toBeCloseTo(2.7, 0.5)
    expect(updatedLed3.brightness).toBeGreaterThan(0)
    expect(updatedLed4.brightness).toBeCloseTo(updatedLed3.brightness, 0.05)
  })

  it('should handle parallel batteries powering series LEDs', () => {
    const simulator = new CircuitSimulator()

    // Note: True parallel batteries would require a common ground/return path
    // This tests two separate battery-LED circuits
    const potato1 = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 50
    }

    const potato2 = {
      id: 2,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 150
    }

    // Two LEDs in series on first branch
    const led1 = {
      id: 3,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 50
    }

    const led2 = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 200,
      y: 50
    }

    // One LED on second branch
    const led3 = {
      id: 5,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 150
    }

    // potato1 -> led1 -> led2
    // potato2 -> led3
    simulator.setComponents([potato1, potato2, led1, led2, led3])
    simulator.setWires([
      { id: 6, from: 1, to: 3 },  // potato1 to led1
      { id: 7, from: 3, to: 4 },  // led1 to led2
      { id: 8, from: 2, to: 5 }   // potato2 to led3
    ])

    const result = simulator.simulate()
    const updatedLed1 = result.find(c => c.id === 3)
    const updatedLed2 = result.find(c => c.id === 4)
    const updatedLed3 = result.find(c => c.id === 5)

    // LED1 and LED2 are in series, sharing 0.9V (0.45V each - too dim to light)
    expect(updatedLed1.voltage).toBeCloseTo(0.45, 0.1)
    expect(updatedLed2.voltage).toBeCloseTo(0.45, 0.1)
    // Below 0.5V threshold, LEDs don't light
    expect(updatedLed1.brightness).toBe(0)
    expect(updatedLed2.brightness).toBe(0)

    // LED3 gets full 0.9V from its battery and should light
    expect(updatedLed3.voltage).toBeCloseTo(0.9, 0.1)
    expect(updatedLed3.brightness).toBeGreaterThan(0)
  })

  it('should detect parallel branches in mixed series-parallel topology', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 100,
      y: 100
    }

    // LED1 in series first
    const led1 = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 100
    }

    // Then LED2 and LED3 branch in parallel
    const led2 = {
      id: 3,
      type: 'led',
      brightness: 0,
      x: 200,
      y: 50
    }

    const led3 = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 200,
      y: 150
    }

    // Battery -> LED1 -> LED2
    //                 -> LED3
    simulator.setComponents([battery, led1, led2, led3])
    simulator.setWires([
      { id: 5, from: 1, to: 2 },  // battery to led1
      { id: 6, from: 2, to: 3 },  // led1 to led2
      { id: 7, from: 2, to: 4 }   // led1 to led3
    ])

    const result = simulator.simulate()
    const updatedLed1 = result.find(c => c.id === 2)
    const updatedLed2 = result.find(c => c.id === 3)
    const updatedLed3 = result.find(c => c.id === 4)

    // All LEDs should light
    expect(updatedLed1.brightness).toBeGreaterThan(0)
    expect(updatedLed2.brightness).toBeGreaterThan(0)
    expect(updatedLed3.brightness).toBeGreaterThan(0)

    // LED2 and LED3 are parallel branches, so should have equal brightness
    expect(updatedLed3.brightness).toBeCloseTo(updatedLed2.brightness, 0.05)
  })
})
