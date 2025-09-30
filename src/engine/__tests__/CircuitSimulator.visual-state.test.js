import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../CircuitSimulator'

describe('CircuitSimulator - Visual State Feedback', () => {
  it('should provide battery visual state (charge level)', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 0.75,  // 75%
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const visualState = simulator.getBatteryVisualState(battery)

    expect(visualState.chargePercent).toBe(75)
    expect(visualState.state).toBe('medium')  // 50-75% = medium
    expect(visualState.chargeBarFill).toBeCloseTo(0.75, 0.01)
  })

  it('should provide LED visual state (brightness levels)', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 100,
      y: 100
    }

    const led = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 100
    }

    simulator.setComponents([battery, led])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])
    simulator.simulate()

    const updatedLed = simulator.components.find(c => c.id === 2)
    const visualState = simulator.getLEDVisualState(updatedLed)

    expect(visualState.brightnessPercent).toBeGreaterThan(80)  // Bright
    expect(visualState.state).toBe('bright')
    expect(visualState.glowIntensity).toBeGreaterThan(0.8)
    expect(visualState.glowRadius).toBeGreaterThan(15)  // 5 + brightness * 15
  })

  it('should classify LED brightness into states', () => {
    const simulator = new CircuitSimulator()

    const testCases = [
      { brightness: 0, expectedState: 'off' },
      { brightness: 0.2, expectedState: 'dim' },
      { brightness: 0.6, expectedState: 'medium' },
      { brightness: 0.95, expectedState: 'bright' }
    ]

    testCases.forEach(({ brightness, expectedState }) => {
      const led = { id: 1, type: 'led', brightness, x: 0, y: 0 }
      const visualState = simulator.getLEDVisualState(led)
      expect(visualState.state).toBe(expectedState)
    })
  })

  it('should provide resistor visual state (heat dissipation)', () => {
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

    simulator.simulate()

    const updatedResistor = simulator.components.find(c => c.id === 2)
    const visualState = simulator.getResistorVisualState(updatedResistor)

    // P = I² × R (power dissipated as heat)
    expect(visualState.powerDissipated).toBeGreaterThan(0)
    expect(visualState.heatLevel).toBeGreaterThan(0)  // 0-1 scale
    expect(visualState.state).toBeDefined()  // 'cool', 'warm', 'hot'
  })
})
