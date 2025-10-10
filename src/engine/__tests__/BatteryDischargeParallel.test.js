import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../CircuitSimulator'

/**
 * Battery Discharge in Parallel Configuration Tests
 *
 * Verifies that batteries in parallel chains discharge correctly:
 * - Batteries in same series chain drain at same rate
 * - Different parallel chains share current proportionally
 * - Longer chains (more batteries) don't incorrectly drain slower
 */
describe('Battery Discharge - Parallel Chain Configuration', () => {
  it('should drain batteries in parallel chains at same rate per chain', () => {
    const simulator = new CircuitSimulator()

    // Create the circuit: b0-b1-b2-bulb1, b3-b4-bulb1, b5-bulb1
    // Three parallel paths to same bulb with different chain lengths
    const b0 = { id: 1, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 100 }
    const b1 = { id: 2, type: 'battery', charge: 1.0, voltage: 0.9, x: 150, y: 100 }
    const b2 = { id: 3, type: 'battery', charge: 1.0, voltage: 0.9, x: 200, y: 100 }
    const b3 = { id: 4, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 200 }
    const b4 = { id: 5, type: 'battery', charge: 1.0, voltage: 0.9, x: 150, y: 200 }
    const b5 = { id: 6, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 300 }
    const bulb1 = { id: 7, type: 'lightbulb', brightness: 0, resistance: 0.36, x: 300, y: 200 }

    simulator.setComponents([b0, b1, b2, b3, b4, b5, bulb1])

    // Wire up three parallel chains:
    // Chain 1: b0 -> b1 -> b2 -> bulb1
    // Chain 2: b3 -> b4 -> bulb1
    // Chain 3: b5 -> bulb1
    simulator.setWires([
      { id: 10, from: 1, to: 2 },   // b0 -> b1
      { id: 11, from: 2, to: 3 },   // b1 -> b2
      { id: 12, from: 3, to: 7 },   // b2 -> bulb1
      { id: 13, from: 4, to: 5 },   // b3 -> b4
      { id: 14, from: 5, to: 7 },   // b4 -> bulb1
      { id: 15, from: 6, to: 7 }    // b5 -> bulb1
    ])

    // Simulate for 1 second
    for (let i = 0; i < 10; i++) {
      simulator.simulate(0.1)
    }

    // All batteries in chain 1 (b0, b1, b2) should drain at same rate
    expect(b0.charge).toBeCloseTo(b1.charge, 3)
    expect(b1.charge).toBeCloseTo(b2.charge, 3)

    // All batteries in chain 2 (b3, b4) should drain at same rate
    expect(b3.charge).toBeCloseTo(b4.charge, 3)

    // Parallel chains with different voltages carry different currents
    // Higher voltage chains (more batteries) supply MORE current, so drain FASTER
    // Chain 1 (3 batteries, 2.7V) drains fastest
    // Chain 2 (2 batteries, 1.8V) drains medium
    // Chain 3 (1 battery, 0.9V) drains slowest
    expect(b0.charge).toBeLessThan(b3.charge) // Chain 1 < Chain 2
    expect(b3.charge).toBeLessThan(b5.charge) // Chain 2 < Chain 3

    // Bulb should be lit
    expect(bulb1.brightness).toBeGreaterThan(0.2)

    // All batteries should have drained some
    expect(b0.charge).toBeLessThan(1.0)
    expect(b3.charge).toBeLessThan(1.0)
    expect(b5.charge).toBeLessThan(1.0)
  })

  it('should drain series batteries in same chain at identical rates', () => {
    const simulator = new CircuitSimulator()

    // Simple test: Two 3-battery series chains in parallel to bulb
    const chain1 = [
      { id: 1, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 100 },
      { id: 2, type: 'battery', charge: 1.0, voltage: 0.9, x: 150, y: 100 },
      { id: 3, type: 'battery', charge: 1.0, voltage: 0.9, x: 200, y: 100 }
    ]
    const chain2 = [
      { id: 4, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 200 },
      { id: 5, type: 'battery', charge: 1.0, voltage: 0.9, x: 150, y: 200 },
      { id: 6, type: 'battery', charge: 1.0, voltage: 0.9, x: 200, y: 200 }
    ]
    const bulb = { id: 7, type: 'lightbulb', brightness: 0, resistance: 0.36, x: 300, y: 150 }

    simulator.setComponents([...chain1, ...chain2, bulb])
    simulator.setWires([
      { id: 10, from: 1, to: 2 },   // chain1: b1 -> b2
      { id: 11, from: 2, to: 3 },   // chain1: b2 -> b3
      { id: 12, from: 3, to: 7 },   // chain1 -> bulb
      { id: 13, from: 4, to: 5 },   // chain2: b4 -> b5
      { id: 14, from: 5, to: 6 },   // chain2: b5 -> b6
      { id: 15, from: 6, to: 7 }    // chain2 -> bulb
    ])

    // Simulate for 1 second
    for (let i = 0; i < 10; i++) {
      simulator.simulate(0.1)
    }

    // Within chain 1: all batteries drain at exactly same rate
    expect(chain1[0].charge).toBeCloseTo(chain1[1].charge, 5)
    expect(chain1[1].charge).toBeCloseTo(chain1[2].charge, 5)

    // Within chain 2: all batteries drain at exactly same rate
    expect(chain2[0].charge).toBeCloseTo(chain2[1].charge, 5)
    expect(chain2[1].charge).toBeCloseTo(chain2[2].charge, 5)

    // Between chains: should drain at roughly same rate (2 parallel chains)
    expect(chain1[0].charge).toBeCloseTo(chain2[0].charge, 3)
  })
})
