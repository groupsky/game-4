import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../CircuitSimulator'

describe('CircuitSimulator - Parallel Battery Chains with Different Lengths', () => {
  it('should discharge longer chain slower than shorter chain (more voltage = more current)', () => {
    const simulator = new CircuitSimulator()

    // Create circuit: b1-b2-b3-led, b4-b5-led, b6-led
    // Chain 1: 3 batteries (2.7V)
    // Chain 2: 2 batteries (1.8V)
    // Chain 3: 1 battery (0.9V)
    const battery1 = { id: 1, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 100 }
    const battery2 = { id: 2, type: 'battery', charge: 1.0, voltage: 0.9, x: 150, y: 100 }
    const battery3 = { id: 3, type: 'battery', charge: 1.0, voltage: 0.9, x: 200, y: 100 }
    const battery4 = { id: 4, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 200 }
    const battery5 = { id: 5, type: 'battery', charge: 1.0, voltage: 0.9, x: 150, y: 200 }
    const battery6 = { id: 6, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 300 }
    const led = { id: 7, type: 'led', brightness: 0, x: 250, y: 100 }

    const wires = [
      { id: 10, from: 1, to: 2 },      // b1-b2
      { id: 11, from: 2, to: 3 },      // b2-b3
      { id: 12, from: 3, to: 7 },      // b3-led
      { id: 13, from: 4, to: 5 },      // b4-b5
      { id: 14, from: 5, to: 7 },      // b5-led
      { id: 15, from: 6, to: 7 }       // b6-led
    ]

    simulator.setComponents([battery1, battery2, battery3, battery4, battery5, battery6, led])
    simulator.setWires(wires)

    // Run simulation for 10 steps
    let components
    for (let i = 0; i < 10; i++) {
      components = simulator.simulate(0.01)
    }

    const b1 = components.find(c => c.id === 1)
    const b2 = components.find(c => c.id === 2)
    const b3 = components.find(c => c.id === 3)
    const b4 = components.find(c => c.id === 4)
    const b5 = components.find(c => c.id === 5)
    const b6 = components.find(c => c.id === 6)

    // All batteries in same series chain should discharge at same rate
    expect(b1.charge).toBeCloseTo(b2.charge, 5)
    expect(b2.charge).toBeCloseTo(b3.charge, 5)
    expect(b4.charge).toBeCloseTo(b5.charge, 5)

    // Chain with more batteries (higher voltage) supplies more current, so drains faster
    // Chain 1 (3 batteries, 2.7V) should drain fastest
    // Chain 2 (2 batteries, 1.8V) should drain medium
    // Chain 3 (1 battery, 0.9V) should drain slowest
    expect(b1.charge).toBeLessThan(b4.charge)
    expect(b4.charge).toBeLessThan(b6.charge)
  })

  it('should handle equal-length parallel chains equally', () => {
    const simulator = new CircuitSimulator()

    // Two parallel chains, each with 2 batteries
    const battery1 = { id: 1, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 100 }
    const battery2 = { id: 2, type: 'battery', charge: 1.0, voltage: 0.9, x: 150, y: 100 }
    const battery3 = { id: 3, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 200 }
    const battery4 = { id: 4, type: 'battery', charge: 1.0, voltage: 0.9, x: 150, y: 200 }
    const led = { id: 5, type: 'led', brightness: 0, x: 200, y: 150 }

    const wires = [
      { id: 10, from: 1, to: 2 },      // b1-b2
      { id: 11, from: 2, to: 5 },      // b2-led
      { id: 12, from: 3, to: 4 },      // b3-b4
      { id: 13, from: 4, to: 5 }       // b4-led
    ]

    simulator.setComponents([battery1, battery2, battery3, battery4, led])
    simulator.setWires(wires)

    // Run simulation
    let components
    for (let i = 0; i < 10; i++) {
      components = simulator.simulate(0.01)
    }

    const b1 = components.find(c => c.id === 1)
    const b2 = components.find(c => c.id === 2)
    const b3 = components.find(c => c.id === 3)
    const b4 = components.find(c => c.id === 4)

    // All batteries should discharge at approximately same rate (equal parallel chains)
    expect(b1.charge).toBeCloseTo(b3.charge, 2)
    expect(b2.charge).toBeCloseTo(b4.charge, 2)
  })

  it('should light LED with parallel chains of different lengths', () => {
    const simulator = new CircuitSimulator()

    // Circuit: b1-b2-b3-bulb, b4-bulb
    const battery1 = { id: 1, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 100 }
    const battery2 = { id: 2, type: 'battery', charge: 1.0, voltage: 0.9, x: 150, y: 100 }
    const battery3 = { id: 3, type: 'battery', charge: 1.0, voltage: 0.9, x: 200, y: 100 }
    const battery4 = { id: 4, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 200 }
    const bulb = { id: 5, type: 'lightbulb', brightness: 0, resistance: 50, x: 250, y: 150 }

    const wires = [
      { id: 10, from: 1, to: 2 },      // b1-b2
      { id: 11, from: 2, to: 3 },      // b2-b3
      { id: 12, from: 3, to: 5 },      // b3-bulb
      { id: 13, from: 4, to: 5 }       // b4-bulb
    ]

    simulator.setComponents([battery1, battery2, battery3, battery4, bulb])
    simulator.setWires(wires)

    const result = simulator.simulate(0.01)

    const updatedBulb = result.find(c => c.id === 5)
    const b1 = result.find(c => c.id === 1)
    const b4 = result.find(c => c.id === 4)

    // Bulb should light
    expect(updatedBulb.brightness).toBeGreaterThan(0)

    // Bulb voltage should be dominated by the higher-voltage chain (3 batteries = 2.7V)
    expect(updatedBulb.voltage).toBeGreaterThan(1.5)

    // 3-battery chain (higher voltage) should supply more current and drain faster
    expect(b1.charge).toBeLessThan(b4.charge)
  })
})
