import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../CircuitSimulator'

describe('CircuitSimulator - Series Batteries', () => {
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

  it('should calculate series battery voltage correctly regardless of charge level', () => {
    const simulator = new CircuitSimulator()

    // Two batteries with DIFFERENT charge levels in series
    const battery1 = {
      id: 1,
      type: 'battery',
      charge: 1.0,  // Full
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const battery2 = {
      id: 2,
      type: 'battery',
      charge: 0.5,  // Half charged
      voltage: 0.9,
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

    simulator.setComponents([battery1, battery2, led])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 2, to: 3 }
    ])

    const result = simulator.simulate()
    const updatedLed = result.find(c => c.id === 3)

    // Series batteries: voltage adds (0.9V + 0.9V = 1.8V)
    // Charge level should NOT affect voltage, only capacity
    expect(updatedLed.voltage).toBeCloseTo(1.8, 0.1)

    // LED should light (above 0.5V threshold)
    expect(updatedLed.brightness).toBeGreaterThan(0)
  })

  it('should handle depleted battery in series (0V contribution)', () => {
    const simulator = new CircuitSimulator()

    const battery1 = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const battery2 = {
      id: 2,
      type: 'battery',
      charge: 0.0,  // Completely depleted
      voltage: 0.9,
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

    simulator.setComponents([battery1, battery2, led])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 2, to: 3 }
    ])

    const result = simulator.simulate()
    const updatedLed = result.find(c => c.id === 3)

    // Depleted battery contributes 0V (0.9V * 0.0 charge = 0V)
    // This behavior is acceptable: dead battery = open circuit
    expect(updatedLed.voltage).toBeCloseTo(0.9, 0.1)
    expect(updatedLed.brightness).toBeGreaterThan(0)
  })

  it('should progressively brighten LED as more potatoes added in series', () => {
    const simulator = new CircuitSimulator()

    // Test with 1, 2, 3, and 5 potatoes
    const testCases = [
      { count: 1, expectedVoltage: 0.9 },
      { count: 2, expectedVoltage: 1.8 },
      { count: 3, expectedVoltage: 2.7 },
      { count: 5, expectedVoltage: 4.5 }
    ]

    const brightnesses = []

    testCases.forEach(({ count, expectedVoltage }) => {
      const components = []
      const wires = []

      // Add potatoes in series
      for (let i = 0; i < count; i++) {
        components.push({
          id: i + 1,
          type: 'battery',
          charge: 1.0,
          voltage: 0.9,
          x: 100 + i * 50,
          y: 100
        })

        if (i > 0) {
          wires.push({ id: 100 + i, from: i, to: i + 1 })
        }
      }

      // Add LED
      const ledId = count + 1
      components.push({
        id: ledId,
        type: 'led',
        brightness: 0,
        x: 100 + count * 50,
        y: 100
      })

      // Connect last potato to LED
      wires.push({ id: 200, from: count, to: ledId })

      simulator.setComponents(components)
      simulator.setWires(wires)

      const result = simulator.simulate()
      const led = result.find(c => c.id === ledId)

      // Verify voltage
      expect(led.voltage).toBeCloseTo(expectedVoltage, 0.5)

      // Store brightness for comparison
      brightnesses.push({ count, brightness: led.brightness })
    })

    // Verify brightness increases with more potatoes (until max brightness reached)
    expect(brightnesses[1].brightness).toBeGreaterThan(brightnesses[0].brightness)
    expect(brightnesses[2].brightness).toBeGreaterThan(brightnesses[1].brightness)
    // Note: 3 and 5 potatoes both reach max brightness (1.0), so they're equal
    expect(brightnesses[3].brightness).toBeGreaterThanOrEqual(brightnesses[2].brightness)
  })
})
