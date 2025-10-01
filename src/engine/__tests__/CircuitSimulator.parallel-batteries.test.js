import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../CircuitSimulator'

describe('CircuitSimulator - Parallel Batteries', () => {
  it('should handle 3 series batteries draining in 40 seconds', () => {
    const simulator = new CircuitSimulator()

    // 3 batteries in series
    const batteries = [
      { id: 1, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 100 },
      { id: 2, type: 'battery', charge: 1.0, voltage: 0.9, x: 150, y: 100 },
      { id: 3, type: 'battery', charge: 1.0, voltage: 0.9, x: 200, y: 100 }
    ]

    const bulb = {
      id: 4,
      type: 'lightbulb',
      brightness: 0,
      resistance: 0.36,  // Tuned for 40s drain
      x: 250,
      y: 100
    }

    simulator.setComponents([...batteries, bulb])
    simulator.setWires([
      { id: 5, from: 1, to: 2 },  // Battery 1 -> 2
      { id: 6, from: 2, to: 3 },  // Battery 2 -> 3
      { id: 7, from: 3, to: 4 }   // Battery 3 -> Bulb
    ])

    // Simulate for 40 seconds (400 steps at 100ms each, with 10ms physics)
    let totalCharge = 3.0
    const stepsPerSecond = 10  // 100ms interval
    const targetSeconds = 40
    const totalSteps = stepsPerSecond * targetSeconds

    for (let i = 0; i < totalSteps; i++) {
      simulator.simulate(0.01)  // 10ms physics step
    }

    // After 40 seconds, batteries should be nearly depleted
    const finalBatteries = simulator.components.filter(c => c.type === 'battery')
    const finalTotalCharge = finalBatteries.reduce((sum, b) => sum + b.charge, 0)

    // Should have drained most charge (allow some tolerance)
    expect(finalTotalCharge).toBeLessThan(0.3)  // Less than 10% remaining
    expect(finalTotalCharge).toBeGreaterThanOrEqual(0)  // Can't go negative
  })

  it('should have 3x3 batteries (parallel series pairs) last longer than 3 series batteries', () => {
    const simulator1 = new CircuitSimulator()
    const simulator2 = new CircuitSimulator()

    // Circuit 1: 3 batteries in series (baseline)
    const batteries1 = [
      { id: 1, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 100 },
      { id: 2, type: 'battery', charge: 1.0, voltage: 0.9, x: 150, y: 100 },
      { id: 3, type: 'battery', charge: 1.0, voltage: 0.9, x: 200, y: 100 }
    ]
    const bulb1 = { id: 4, type: 'lightbulb', brightness: 0, resistance: 0.36, x: 250, y: 100 }

    simulator1.setComponents([...batteries1, bulb1])
    simulator1.setWires([
      { id: 5, from: 1, to: 2 },
      { id: 6, from: 2, to: 3 },
      { id: 7, from: 3, to: 4 }
    ])

    // Circuit 2: 3x3 batteries (3 parallel pairs of 3 series batteries)
    // This should be modeled as 9 batteries all connected to the bulb
    const batteries2 = []
    for (let i = 0; i < 9; i++) {
      batteries2.push({
        id: i + 1,
        type: 'battery',
        charge: 1.0,
        voltage: 0.9,
        x: 100 + (i % 3) * 50,
        y: 100 + Math.floor(i / 3) * 50
      })
    }
    const bulb2 = { id: 10, type: 'lightbulb', brightness: 0, resistance: 0.36, x: 250, y: 200 }

    // Wire the 3 series chains
    const wires2 = []
    for (let chain = 0; chain < 3; chain++) {
      const base = chain * 3 + 1
      wires2.push({ id: 100 + chain * 2, from: base, to: base + 1 })      // First -> Second
      wires2.push({ id: 100 + chain * 2 + 1, from: base + 1, to: base + 2 }) // Second -> Third
    }

    // Connect all 3 chains to bulb (this simulates parallel connection)
    wires2.push({ id: 200, from: 3, to: 10 })   // Chain 1 end -> Bulb
    wires2.push({ id: 201, from: 6, to: 10 })   // Chain 2 end -> Bulb
    wires2.push({ id: 202, from: 9, to: 10 })   // Chain 3 end -> Bulb

    simulator2.setComponents([...batteries2, bulb2])
    simulator2.setWires(wires2)

    // Run both for 40 seconds
    const totalSteps = 400
    for (let i = 0; i < totalSteps; i++) {
      simulator1.simulate(0.01)
      simulator2.simulate(0.01)
    }

    // Calculate remaining charge
    const charge1 = simulator1.components.filter(c => c.type === 'battery')
      .reduce((sum, b) => sum + b.charge, 0)
    const charge2 = simulator2.components.filter(c => c.type === 'battery')
      .reduce((sum, b) => sum + b.charge, 0)

    // Log drain rates for debugging
    console.log('After 40 seconds:')
    console.log(`  3 series batteries: ${charge1.toFixed(2)} / 3.00 charge remaining (${(charge1/3*100).toFixed(1)}%)`)
    console.log(`  3x3 parallel batteries: ${charge2.toFixed(2)} / 9.00 charge remaining (${(charge2/9*100).toFixed(1)}%)`)

    // Parallel configuration should have MORE charge remaining (3x more capacity)
    // Circuit 1: 3 batteries = 3.0 total charge
    // Circuit 2: 9 batteries = 9.0 total charge
    // After 40s, Circuit 2 should have ~6.0 charge left (Circuit 1 should be near 0)
    expect(charge2).toBeGreaterThan(charge1 * 2)  // At least 2x more charge remaining
  })
})
