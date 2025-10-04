import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../CircuitSimulator'

describe('CircuitSimulator - Series-Parallel Mixed Battery Configurations', () => {
  it('should discharge series batteries faster than parallel battery at lower voltage', () => {
    const simulator = new CircuitSimulator()

    // Branch A: 2 batteries in series (1.8V) -> LED
    // Branch B: 1 battery in parallel (0.9V) -> same LED
    // Branch A should dominate and discharge faster
    const battery1 = { id: 1, type: 'battery', charge: 1.0, voltage: 0.9 }
    const battery2 = { id: 2, type: 'battery', charge: 1.0, voltage: 0.9 }
    const battery3 = { id: 3, type: 'battery', charge: 1.0, voltage: 0.9 }
    const led = { id: 4, type: 'led', brightness: 0 }

    simulator.setComponents([battery1, battery2, battery3, led])
    simulator.setWires([
      { id: 5, from: 1, to: 2 },  // Battery 1-2 in series
      { id: 6, from: 2, to: 4 },  // Series chain -> LED
      { id: 7, from: 3, to: 4 }   // Battery 3 in parallel -> same LED
    ])

    // Simulate for several steps
    for (let i = 0; i < 50; i++) {
      simulator.simulate(0.1)
    }

    const b1 = simulator.components.find(c => c.id === 1)
    const b2 = simulator.components.find(c => c.id === 2)
    const b3 = simulator.components.find(c => c.id === 3)

    // Series batteries (1+2) should discharge faster than parallel battery (3)
    // because they provide higher voltage and thus supply most of the current
    const seriesAvgCharge = (b1.charge + b2.charge) / 2

    console.log('Series battery 1 charge:', b1.charge)
    console.log('Series battery 2 charge:', b2.charge)
    console.log('Parallel battery 3 charge:', b3.charge)

    // The higher voltage branch (series) should have discharged more
    expect(seriesAvgCharge).toBeLessThan(b3.charge)

    // Battery 3 (at lower voltage) should discharge very slowly or not at all
    // since the 1.8V from branch A dominates over its 0.9V
    expect(b3.charge).toBeGreaterThan(0.9)
  })

  it('should discharge batteries in series at the same rate', () => {
    const simulator = new CircuitSimulator()

    const battery1 = { id: 1, type: 'battery', charge: 1.0, voltage: 0.9 }
    const battery2 = { id: 2, type: 'battery', charge: 1.0, voltage: 0.9 }
    const led = { id: 3, type: 'led', brightness: 0 }

    simulator.setComponents([battery1, battery2, led])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 2, to: 3 }
    ])

    // Simulate
    for (let i = 0; i < 20; i++) {
      simulator.simulate(0.1)
    }

    const b1 = simulator.components.find(c => c.id === 1)
    const b2 = simulator.components.find(c => c.id === 2)

    // Same current flows through both batteries in series
    expect(Math.abs(b1.charge - b2.charge)).toBeLessThan(0.01)
  })

  it('should handle 3-way parallel paths with different voltages', () => {
    const simulator = new CircuitSimulator()

    // Path A: 3 batteries in series (2.7V)
    // Path B: 2 batteries in series (1.8V)
    // Path C: 1 battery (0.9V)
    // All paths -> same LED
    const batteries = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const led = { id: 10, type: 'led', brightness: 0 }

    simulator.setComponents([...batteries, led])
    simulator.setWires([
      // Path A: batteries 1-2-3 in series
      { id: 20, from: 1, to: 2 },
      { id: 21, from: 2, to: 3 },
      { id: 22, from: 3, to: 10 },  // -> LED

      // Path B: batteries 4-5 in series
      { id: 23, from: 4, to: 5 },
      { id: 24, from: 5, to: 10 },  // -> LED

      // Path C: battery 6 alone
      { id: 25, from: 6, to: 10 }   // -> LED
    ])

    // Simulate
    for (let i = 0; i < 30; i++) {
      simulator.simulate(0.1)
    }

    // Calculate average charge per path
    const pathA = (batteries[0].charge + batteries[1].charge + batteries[2].charge) / 3
    const pathB = (batteries[3].charge + batteries[4].charge) / 2
    const pathC = batteries[5].charge

    console.log('Path A (3 series) avg charge:', pathA)
    console.log('Path B (2 series) avg charge:', pathB)
    console.log('Path C (1 battery) charge:', pathC)

    // Higher voltage paths should discharge faster
    // Path A (2.7V) should discharge fastest
    // Path B (1.8V) should discharge medium
    // Path C (0.9V) should discharge slowest
    expect(pathA).toBeLessThan(pathB)
    expect(pathB).toBeLessThan(pathC)
  })
})
