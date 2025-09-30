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

  it('should add voltages from series batteries', () => {
    const simulator = new CircuitSimulator()

    const battery1 = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 100,
      y: 100
    }

    const battery2 = {
      id: 2,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 150,
      y: 100
    }

    const led = {
      id: 3,
      type: 'led',
      brightness: 0,
      x: 200,
      y: 100
    }

    const wire1 = {
      id: 4,
      from: 1,
      to: 2
    }

    const wire2 = {
      id: 5,
      from: 2,
      to: 3
    }

    simulator.setComponents([battery1, battery2, led])
    simulator.setWires([wire1, wire2])

    const result = simulator.simulate()

    const updatedLed = result.find(c => c.id === 3)
    // With 9V total, LED should be brighter than with just 4.5V
    expect(updatedLed.brightness).toBeGreaterThan(0.3)
    expect(updatedLed.voltage).toBeCloseTo(9.0, 0.5)
  })

  it('should divide voltage across series LEDs', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 9.0,
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

    const led2 = {
      id: 3,
      type: 'led',
      brightness: 0,
      x: 200,
      y: 100
    }

    const led3 = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 250,
      y: 100
    }

    simulator.setComponents([battery, led1, led2, led3])
    simulator.setWires([
      { id: 5, from: 1, to: 2 },
      { id: 6, from: 2, to: 3 },
      { id: 7, from: 3, to: 4 }
    ])

    const result = simulator.simulate()

    const updatedLed1 = result.find(c => c.id === 2)
    const updatedLed2 = result.find(c => c.id === 3)
    const updatedLed3 = result.find(c => c.id === 4)

    // With 9V across 3 LEDs, each gets 3V
    expect(updatedLed1.voltage).toBeCloseTo(3.0, 0.5)
    expect(updatedLed2.voltage).toBeCloseTo(3.0, 0.5)
    expect(updatedLed3.voltage).toBeCloseTo(3.0, 0.5)

    // All LEDs should have same brightness (high due to good voltage per LED)
    expect(updatedLed1.brightness).toBeGreaterThan(0.5)
    expect(updatedLed1.brightness).toBeLessThanOrEqual(1.0)
    expect(updatedLed2.brightness).toBeCloseTo(updatedLed1.brightness, 0.1)
    expect(updatedLed3.brightness).toBeCloseTo(updatedLed1.brightness, 0.1)
  })

  it('should handle one battery powering multiple series LEDs with dim brightness', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
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

    const led2 = {
      id: 3,
      type: 'led',
      brightness: 0,
      x: 200,
      y: 100
    }

    const led3 = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 250,
      y: 100
    }

    const led4 = {
      id: 5,
      type: 'led',
      brightness: 0,
      x: 300,
      y: 100
    }

    simulator.setComponents([battery, led1, led2, led3, led4])
    simulator.setWires([
      { id: 6, from: 1, to: 2 },
      { id: 7, from: 2, to: 3 },
      { id: 8, from: 3, to: 4 },
      { id: 9, from: 4, to: 5 }
    ])

    const result = simulator.simulate()

    const updatedLed1 = result.find(c => c.id === 2)
    const updatedLed2 = result.find(c => c.id === 3)
    const updatedLed3 = result.find(c => c.id === 4)
    const updatedLed4 = result.find(c => c.id === 5)

    // With 4.5V across 4 LEDs, each gets 1.125V (dim)
    expect(updatedLed1.voltage).toBeCloseTo(1.125, 0.1)
    expect(updatedLed2.voltage).toBeCloseTo(1.125, 0.1)
    expect(updatedLed3.voltage).toBeCloseTo(1.125, 0.1)
    expect(updatedLed4.voltage).toBeCloseTo(1.125, 0.1)

    // All LEDs should be dim but still lit
    expect(updatedLed1.brightness).toBeGreaterThan(0)
    expect(updatedLed1.brightness).toBeLessThan(0.35)
    expect(updatedLed2.brightness).toBeCloseTo(updatedLed1.brightness, 0.05)
    expect(updatedLed3.brightness).toBeCloseTo(updatedLed1.brightness, 0.05)
    expect(updatedLed4.brightness).toBeCloseTo(updatedLed1.brightness, 0.05)
  })

  it('should make LED brighter with multiple batteries vs single battery', () => {
    const simulator = new CircuitSimulator()

    // Test 1: Single battery with one LED
    const singleBattery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 100,
      y: 100
    }

    const singleLed = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 100
    }

    simulator.setComponents([singleBattery, singleLed])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])

    const singleResult = simulator.simulate()
    const singleBrightness = singleResult.find(c => c.id === 2).brightness

    // Test 2: Three batteries with one LED
    const battery1 = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 100,
      y: 100
    }

    const battery2 = {
      id: 2,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 150,
      y: 100
    }

    const battery3 = {
      id: 3,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 200,
      y: 100
    }

    const tripleLed = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 250,
      y: 100
    }

    simulator.setComponents([battery1, battery2, battery3, tripleLed])
    simulator.setWires([
      { id: 5, from: 1, to: 2 },
      { id: 6, from: 2, to: 3 },
      { id: 7, from: 3, to: 4 }
    ])

    const tripleResult = simulator.simulate()
    const tripleBrightness = tripleResult.find(c => c.id === 4).brightness

    // Three batteries (13.5V) should make LED at max brightness (1.0)
    // Single battery (4.5V) should also make LED at max brightness (1.0)
    // Both are capped at max, so they should be equal
    expect(tripleBrightness).toBeCloseTo(1.0, 0.1)
    expect(singleBrightness).toBeCloseTo(1.0, 0.1)
    expect(tripleBrightness).toBeCloseTo(singleBrightness, 0.1)
  })
})
