import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../CircuitSimulator'

describe('CircuitSimulator - Capacitor in Parallel with LED', () => {
  it('should power LED when capacitor and LED are in parallel with battery', () => {
    const simulator = new CircuitSimulator()

    // Battery with two branches:
    // - Branch 1: Battery -> LED
    // - Branch 2: Battery -> Capacitor
    // Both share the same power source (parallel)
    const battery = { id: 1, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 100 }
    const led = { id: 2, type: 'led', brightness: 0, x: 200, y: 100 }
    const capacitor = { id: 3, type: 'capacitor', capacitance: 0.001, voltage: 0, x: 200, y: 150 }

    simulator.setComponents([battery, led, capacitor])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },  // Battery -> LED
      { id: 5, from: 1, to: 3 }   // Battery -> Capacitor (parallel branch)
    ])

    // Run simulation multiple times
    for (let i = 0; i < 5; i++) {
      simulator.simulate(0.1)
    }

    console.log('LED brightness:', led.brightness)
    console.log('Capacitor voltage:', capacitor.voltage)

    // LED should be lit (parallel with capacitor, not series)
    expect(led.brightness).toBeGreaterThan(0.3)

    // Capacitor should also be charging
    expect(capacitor.voltage).toBeGreaterThan(0)
  })

  it('should have capacitor smooth LED power (parallel for filtering)', () => {
    const simulator = new CircuitSimulator()

    // This is the classic "smoothing capacitor" configuration
    // Battery -> (LED + Capacitor in parallel)
    const battery = { id: 1, type: 'battery', charge: 1.0, voltage: 2.5, x: 100, y: 100 }
    const led = { id: 2, type: 'led', brightness: 0, x: 200, y: 100 }
    const capacitor = { id: 3, type: 'capacitor', capacitance: 0.01, voltage: 0, x: 200, y: 150 }

    simulator.setComponents([battery, led, capacitor])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },  // Battery -> LED
      { id: 5, from: 1, to: 3 }   // Battery -> Capacitor
    ])

    // Run simulation for several steps
    for (let i = 0; i < 5; i++) {
      simulator.simulate(0.1)
    }

    console.log('LED brightness:', led.brightness)
    console.log('Capacitor voltage:', capacitor.voltage)

    // Both should be powered
    expect(led.brightness).toBeGreaterThan(0.3)
    expect(capacitor.voltage).toBeGreaterThan(1.0)
  })
})
