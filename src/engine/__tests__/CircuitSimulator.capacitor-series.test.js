import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../CircuitSimulator'

describe('CircuitSimulator - Capacitor in Series with LED', () => {
  it('should NOT make LED brighter when capacitor is in series', () => {
    const simulator1 = new CircuitSimulator()
    const simulator2 = new CircuitSimulator()

    // Circuit 1: 2 batteries -> LED (direct)
    const battery1a = { id: 1, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 100 }
    const battery1b = { id: 2, type: 'battery', charge: 1.0, voltage: 0.9, x: 150, y: 100 }
    const led1 = { id: 3, type: 'led', brightness: 0, x: 200, y: 100 }

    simulator1.setComponents([battery1a, battery1b, led1])
    simulator1.setWires([
      { id: 4, from: 1, to: 2 },  // Battery1 -> Battery2
      { id: 5, from: 2, to: 3 }   // Battery2 -> LED
    ])

    // Circuit 2: 2 batteries -> Capacitor -> LED
    const battery2a = { id: 10, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 100 }
    const battery2b = { id: 11, type: 'battery', charge: 1.0, voltage: 0.9, x: 150, y: 100 }
    const capacitor = { id: 12, type: 'capacitor', capacitance: 0.001, voltage: 0, x: 200, y: 100 }
    const led2 = { id: 13, type: 'led', brightness: 0, x: 250, y: 100 }

    simulator2.setComponents([battery2a, battery2b, capacitor, led2])
    simulator2.setWires([
      { id: 14, from: 10, to: 11 },  // Battery1 -> Battery2
      { id: 15, from: 11, to: 12 },  // Battery2 -> Capacitor
      { id: 16, from: 12, to: 13 }   // Capacitor -> LED
    ])

    // Run both simulations
    simulator1.simulate(0.1)
    simulator2.simulate(0.1)

    console.log('Circuit 1 (direct): LED brightness =', led1.brightness)
    console.log('Circuit 2 (with capacitor): LED brightness =', led2.brightness)
    console.log('Capacitor voltage:', capacitor.voltage)

    // LED with capacitor should NOT be brighter than direct LED
    // In fact, once capacitor is charged, LED should be dimmer or off (DC blocking)
    expect(led2.brightness).toBeLessThanOrEqual(led1.brightness)
  })

  it('should have LED fade as capacitor charges up (blocking DC)', () => {
    const simulator = new CircuitSimulator()

    const battery1 = { id: 1, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 100 }
    const battery2 = { id: 2, type: 'battery', charge: 1.0, voltage: 0.9, x: 150, y: 100 }
    const capacitor = { id: 3, type: 'capacitor', capacitance: 0.001, voltage: 0, x: 200, y: 100 }
    const led = { id: 4, type: 'led', brightness: 0, x: 250, y: 100 }

    simulator.setComponents([battery1, battery2, capacitor, led])
    simulator.setWires([
      { id: 5, from: 1, to: 2 },
      { id: 6, from: 2, to: 3 },
      { id: 7, from: 3, to: 4 }
    ])

    // Initial state - LED might briefly light during capacitor charging
    simulator.simulate(0.01)
    const initialBrightness = led.brightness

    // After capacitor fully charged, LED should be dim/off (no DC current)
    for (let i = 0; i < 100; i++) {
      simulator.simulate(0.1)
    }

    console.log('Initial brightness:', initialBrightness)
    console.log('Final brightness:', led.brightness)
    console.log('Capacitor voltage:', capacitor.voltage)

    // Once capacitor is charged, LED should be very dim or off
    expect(led.brightness).toBeLessThan(0.3)
  })
})
