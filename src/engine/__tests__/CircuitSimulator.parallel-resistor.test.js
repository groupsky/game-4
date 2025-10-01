import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../CircuitSimulator'

describe('CircuitSimulator - Parallel LEDs with Resistor', () => {
  it('should have LED with resistor dimmer than LED without resistor', () => {
    const simulator = new CircuitSimulator()

    // Use 3 series batteries (2.7V) to have enough voltage for LED
    // Battery powering two parallel LEDs:
    // - LED1: direct connection (bright)
    // - LED2: through resistor (should be dimmer)
    const battery1 = { id: 1, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 100 }
    const battery2 = { id: 2, type: 'battery', charge: 1.0, voltage: 0.9, x: 150, y: 100 }
    const battery3 = { id: 3, type: 'battery', charge: 1.0, voltage: 0.9, x: 200, y: 100 }
    const led1 = { id: 4, type: 'led', brightness: 0, x: 300, y: 100 }
    const resistor = { id: 5, type: 'resistor', resistance: 220, current: 0, x: 250, y: 150 }
    const led2 = { id: 6, type: 'led', brightness: 0, x: 350, y: 150 }

    simulator.setComponents([battery1, battery2, battery3, led1, resistor, led2])
    simulator.setWires([
      { id: 7, from: 1, to: 2 },  // Battery1 -> Battery2
      { id: 8, from: 2, to: 3 },  // Battery2 -> Battery3
      { id: 9, from: 3, to: 4 },  // Battery3 -> LED1 (direct)
      { id: 10, from: 3, to: 5 }, // Battery3 -> Resistor
      { id: 11, from: 5, to: 6 }  // Resistor -> LED2
    ])

    simulator.simulate(0.1)

    // LED1 (no resistor) should be brighter than LED2 (with resistor)
    expect(led1.brightness).toBeGreaterThan(led2.brightness)

    // LED2 should still be lit (not completely dark)
    expect(led2.brightness).toBeGreaterThan(0.1)

    // LED1 should be significantly brighter (at least 50% more)
    expect(led1.brightness).toBeGreaterThan(led2.brightness * 1.5)
  })

  it('should calculate different currents for parallel branches with different resistances', () => {
    const simulator = new CircuitSimulator()

    const battery = { id: 1, type: 'battery', charge: 1.0, voltage: 0.9, x: 100, y: 100 }
    const led1 = { id: 2, type: 'led', brightness: 0, current: 0, x: 200, y: 100 }
    const resistor = { id: 3, type: 'resistor', resistance: 220, current: 0, x: 250, y: 150 }
    const led2 = { id: 4, type: 'led', brightness: 0, current: 0, x: 300, y: 150 }

    simulator.setComponents([battery, led1, resistor, led2])
    simulator.setWires([
      { id: 5, from: 1, to: 2 },
      { id: 6, from: 1, to: 3 },
      { id: 7, from: 3, to: 4 }
    ])

    simulator.simulate(0.1)

    // Branch with resistor should have lower current
    expect(led1.current).toBeGreaterThan(led2.current)

    // Resistor should have current flowing through it
    expect(resistor.current).toBeGreaterThan(0)
    expect(resistor.current).toBe(led2.current)  // Same current as LED2
  })
})
