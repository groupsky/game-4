import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../CircuitSimulator'

describe('CircuitSimulator - Resistors', () => {
  it('should limit current through LED with series resistor', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 9.0,
      x: 100,
      y: 100
    }

    const resistor = {
      id: 2,
      type: 'resistor',
      resistance: 470,  // 470 ohm resistor (common for LEDs)
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

    // Battery -> Resistor -> LED
    simulator.setComponents([battery, resistor, led])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 2, to: 3 }
    ])

    const result = simulator.simulate()
    const updatedLed = result.find(c => c.id === 3)

    // With 470Ω resistor and 9V battery:
    // Current = V / R_total = 9V / (470Ω + 100Ω_LED) ≈ 15.8mA
    // This is safe for LED (< 20mA max)
    expect(updatedLed.current).toBeGreaterThan(0.010)  // > 10mA
    expect(updatedLed.current).toBeLessThan(0.020)     // < 20mA
    expect(updatedLed.brightness).toBeGreaterThan(0.4)  // Bright (close to 50%)
  })

  it('should drop voltage across resistor correctly', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 5.0,
      x: 100,
      y: 100
    }

    const resistor = {
      id: 2,
      type: 'resistor',
      resistance: 100,
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

    simulator.setComponents([battery, resistor, led])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 2, to: 3 }
    ])

    const result = simulator.simulate()
    const updatedResistor = result.find(c => c.id === 2)
    const updatedLed = result.find(c => c.id === 3)

    // Total resistance: 100Ω + 100Ω = 200Ω
    // Current: 5V / 200Ω = 25mA (capped at 20mA by LED)
    // Voltage drop across resistor: 20mA * 100Ω = 2V
    // Voltage across LED: 5V - 2V = 3V
    expect(updatedResistor.voltageDrop).toBeCloseTo(2.0, 0.5)
    expect(updatedLed.voltage).toBeCloseTo(3.0, 0.5)
  })

  it('should handle multiple resistors in series (voltage divider)', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 9.0,
      x: 100,
      y: 100
    }

    const resistor1 = {
      id: 2,
      type: 'resistor',
      resistance: 1000,
      x: 150,
      y: 100
    }

    const resistor2 = {
      id: 3,
      type: 'resistor',
      resistance: 1000,
      x: 200,
      y: 100
    }

    const led = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 250,
      y: 100
    }

    // Battery -> R1 -> R2 -> LED
    simulator.setComponents([battery, resistor1, resistor2, led])
    simulator.setWires([
      { id: 5, from: 1, to: 2 },
      { id: 6, from: 2, to: 3 },
      { id: 7, from: 3, to: 4 }
    ])

    const result = simulator.simulate()
    const updatedLed = result.find(c => c.id === 4)

    // Total R = 2100Ω (1000 + 1000 + 100 for LED)
    // I = 9V / 2100Ω ≈ 4.3mA (low current, dim LED)
    expect(updatedLed.current).toBeLessThan(0.005)
    expect(updatedLed.brightness).toBeLessThan(0.3)  // Dim
  })

  it('should protect LED from overcurrent without resistor vs with resistor', () => {
    const simulator = new CircuitSimulator()

    // Test 1: High voltage without resistor (bad!)
    const battery1 = {
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

    simulator.setComponents([battery1, led1])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])

    const result1 = simulator.simulate()
    const led1After = result1.find(c => c.id === 2)

    // Without resistor: current maxed at 20mA (LED protection)
    expect(led1After.current).toBeCloseTo(0.020, 0.001)

    // Test 2: Same voltage with resistor (good!)
    const battery2 = {
      id: 4,
      type: 'battery',
      charge: 1.0,
      voltage: 9.0,
      x: 100,
      y: 100
    }

    const resistor = {
      id: 5,
      type: 'resistor',
      resistance: 470,
      x: 150,
      y: 100
    }

    const led2 = {
      id: 6,
      type: 'led',
      brightness: 0,
      x: 200,
      y: 100
    }

    simulator.setComponents([battery2, resistor, led2])
    simulator.setWires([
      { id: 7, from: 4, to: 5 },
      { id: 8, from: 5, to: 6 }
    ])

    const result2 = simulator.simulate()
    const led2After = result2.find(c => c.id === 6)

    // With resistor: current limited by resistance, safer
    expect(led2After.current).toBeLessThan(0.020)
    expect(led2After.current).toBeGreaterThan(0.010)
  })
})
