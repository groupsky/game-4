import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../CircuitSimulator'

/**
 * Battery Depletion Tests
 *
 * Verifies that batteries properly deplete to 0 and stay at 0:
 * - Battery charge should monotonically decrease (never increase)
 * - Battery charge should clamp at 0 (not go negative or wrap around)
 * - Battery should stop providing voltage when depleted
 */
describe('Battery Depletion', () => {
  it('should deplete battery monotonically and clamp at zero', () => {
    const simulator = new CircuitSimulator()

    // Simple circuit: 1 battery + LED
    const battery = { id: 1, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 100 }
    const led = { id: 2, type: 'led', brightness: 0, x: 200, y: 100 }

    simulator.setComponents([battery, led])
    simulator.setWires([{ id: 10, from: 1, to: 2 }])

    // Run simulation for 1000 steps to verify proper draining
    let previousCharge = battery.charge

    for (let i = 0; i < 1000; i++) {
      const components = simulator.simulate(0.1)
      const updatedBattery = components.find(c => c.id === 1)

      // Battery charge should never increase
      expect(updatedBattery.charge).toBeLessThanOrEqual(previousCharge)

      // Battery charge should not go negative
      expect(updatedBattery.charge).toBeGreaterThanOrEqual(0)

      previousCharge = updatedBattery.charge
    }

    // Battery should have drained (LED drains slowly)
    expect(battery.charge).toBeLessThan(1.0)

    // Now deplete it fully by using 3 batteries + bulb with high drain
    const battery2 = { id: 3, type: 'battery', charge: 1.0, voltage: 0.9, x: 150, y: 100 }
    const battery3 = { id: 4, type: 'battery', charge: 1.0, voltage: 0.9, x: 200, y: 100 }
    const bulb = { id: 5, type: 'lightbulb', brightness: 0, resistance: 0.36, x: 300, y: 100 }
    simulator.setComponents([battery, battery2, battery3, bulb])
    simulator.setWires([
      { id: 10, from: 1, to: 3 },
      { id: 11, from: 3, to: 4 },
      { id: 12, from: 4, to: 5 }
    ])

    // Run until fully depleted (or max 1000 steps)
    for (let i = 0; i < 1000; i++) {
      simulator.simulate(0.1)
      if (battery.charge === 0 && battery2.charge === 0 && battery3.charge === 0) break
    }

    // All batteries should be nearly depleted (within 0.1)
    expect(battery.charge).toBeLessThan(0.1)
    expect(battery2.charge).toBeLessThan(0.1)
    expect(battery3.charge).toBeLessThan(0.1)

    // Continue simulation - batteries should not increase and eventually reach 0
    for (let i = 0; i < 100; i++) {
      const prevCharge1 = battery.charge
      const prevCharge2 = battery2.charge
      const prevCharge3 = battery3.charge

      simulator.simulate(0.1)

      // Charges should decrease or stay at 0
      expect(battery.charge).toBeLessThanOrEqual(prevCharge1)
      expect(battery2.charge).toBeLessThanOrEqual(prevCharge2)
      expect(battery3.charge).toBeLessThanOrEqual(prevCharge3)

      // Should not go negative
      expect(battery.charge).toBeGreaterThanOrEqual(0)
      expect(battery2.charge).toBeGreaterThanOrEqual(0)
      expect(battery3.charge).toBeGreaterThanOrEqual(0)
    }
  })

  it('should stop providing voltage when battery is depleted', () => {
    const simulator = new CircuitSimulator()

    const battery = { id: 1, type: 'battery', charge: 0.0, voltage: 0.9, x: 100, y: 100 }
    const led = { id: 2, type: 'led', brightness: 0, x: 200, y: 100 }

    simulator.setComponents([battery, led])
    simulator.setWires([{ id: 10, from: 1, to: 2 }])

    const components = simulator.simulate(0.1)
    const updatedLed = components.find(c => c.id === 2)

    // LED should not light with depleted battery
    expect(updatedLed.brightness).toBe(0)
  })

  it('should handle multiple batteries depleting at different rates', () => {
    const simulator = new CircuitSimulator()

    // Parallel chains: b1-b2-led, b3-led
    // Chain 1 (higher voltage) should deplete faster
    const battery1 = { id: 1, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 100 }
    const battery2 = { id: 2, type: 'battery', charge: 1.0, voltage: 0.9, x: 150, y: 100 }
    const battery3 = { id: 3, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 200 }
    const led = { id: 4, type: 'led', brightness: 0, x: 200, y: 150 }

    simulator.setComponents([battery1, battery2, battery3, led])
    simulator.setWires([
      { id: 10, from: 1, to: 2 },
      { id: 11, from: 2, to: 4 },
      { id: 12, from: 3, to: 4 }
    ])

    // Run until at least one battery depletes
    let steps = 0
    const MAX_STEPS = 200000 // Allow enough time for battery depletion

    while (battery1.charge > 0 && battery2.charge > 0 && battery3.charge > 0 && steps < MAX_STEPS) {
      simulator.simulate(0.1)

      // All batteries should have non-negative charge
      expect(battery1.charge).toBeGreaterThanOrEqual(0)
      expect(battery2.charge).toBeGreaterThanOrEqual(0)
      expect(battery3.charge).toBeGreaterThanOrEqual(0)

      steps++
    }

    // At least one battery should be depleted
    const anyDepleted = battery1.charge === 0 || battery2.charge === 0 || battery3.charge === 0
    expect(anyDepleted).toBe(true)

    // Continue simulation - depleted batteries should stay at 0
    const depletedBatteries = [
      { battery: battery1, initialCharge: battery1.charge },
      { battery: battery2, initialCharge: battery2.charge },
      { battery: battery3, initialCharge: battery3.charge }
    ].filter(b => b.initialCharge === 0)

    for (let i = 0; i < 100; i++) {
      simulator.simulate(0.1)

      depletedBatteries.forEach(({ battery }) => {
        expect(battery.charge).toBe(0)
      })
    }

    console.log(`At least one battery depleted after ${steps} steps`)
  })

  it('should clamp battery charge at 0 with very high drain rate', () => {
    const simulator = new CircuitSimulator()

    // Use LED with very low initial charge to test rapid depletion
    const battery = { id: 1, type: 'battery', charge: 0.001, voltage: 0.9, x: 100, y: 100 }
    const led = { id: 2, type: 'led', brightness: 0, x: 200, y: 100 }

    simulator.setComponents([battery, led])
    simulator.setWires([{ id: 10, from: 1, to: 2 }])

    // Run simulation for several steps (need more steps due to 0.005 drain factor)
    for (let i = 0; i < 500; i++) {
      const components = simulator.simulate(0.1)
      const updatedBattery = components.find(c => c.id === 1)

      // Battery charge should never go negative
      expect(updatedBattery.charge).toBeGreaterThanOrEqual(0)
      expect(updatedBattery.charge).toBeLessThanOrEqual(0.001)
    }

    // Battery should be at 0
    expect(battery.charge).toBe(0)
  })
})
