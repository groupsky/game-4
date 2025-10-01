import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../CircuitSimulator'

describe('CircuitSimulator - Reset Functionality', () => {
  it('should reset drained batteries to full charge', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 0.3, // Partially drained
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const components = simulator.resetCircuit([battery])
    const resetBattery = components.find(c => c.id === 1)

    expect(resetBattery.charge).toBe(1.0) // Full charge
  })

  it('should reset charged capacitors to empty', () => {
    const simulator = new CircuitSimulator()

    const capacitor = {
      id: 1,
      type: 'capacitor',
      capacitance: 0.1,
      voltage: 2.5, // Charged
      maxVoltage: 5.0,
      x: 100,
      y: 100
    }

    const components = simulator.resetCircuit([capacitor])
    const resetCapacitor = components.find(c => c.id === 1)

    expect(resetCapacitor.voltage).toBe(0) // Empty
  })

  it('should reset hot resistors to cold', () => {
    const simulator = new CircuitSimulator()

    const resistor = {
      id: 1,
      type: 'resistor',
      resistance: 100,
      current: 0.05, // Hot from current
      x: 100,
      y: 100
    }

    const components = simulator.resetCircuit([resistor])
    const resetResistor = components.find(c => c.id === 1)

    expect(resetResistor.current).toBe(0) // Cold
  })

  it('should reset LEDs to off', () => {
    const simulator = new CircuitSimulator()

    const led = {
      id: 1,
      type: 'led',
      brightness: 0.8, // Glowing
      x: 100,
      y: 100
    }

    const components = simulator.resetCircuit([led])
    const resetLed = components.find(c => c.id === 1)

    expect(resetLed.brightness).toBe(0) // Off
  })

  it('should reset light bulbs to off', () => {
    const simulator = new CircuitSimulator()

    const bulb = {
      id: 1,
      type: 'lightbulb',
      brightness: 0.9, // Glowing
      resistance: 0.36,
      current: 0.05,
      power: 0.002,
      x: 100,
      y: 100
    }

    const components = simulator.resetCircuit([bulb])
    const resetBulb = components.find(c => c.id === 1)

    expect(resetBulb.brightness).toBe(0) // Off
    expect(resetBulb.current).toBe(0) // No current
    expect(resetBulb.power).toBe(0) // No power
  })

  it('should reset entire circuit at once', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 0.2,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const led = {
      id: 2,
      type: 'led',
      brightness: 0.7,
      x: 200,
      y: 100
    }

    const capacitor = {
      id: 3,
      type: 'capacitor',
      capacitance: 0.1,
      voltage: 3.0,
      maxVoltage: 5.0,
      x: 300,
      y: 100
    }

    const resistor = {
      id: 4,
      type: 'resistor',
      resistance: 100,
      current: 0.03,
      x: 400,
      y: 100
    }

    const components = simulator.resetCircuit([battery, led, capacitor, resistor])

    expect(components.find(c => c.id === 1).charge).toBe(1.0)
    expect(components.find(c => c.id === 2).brightness).toBe(0)
    expect(components.find(c => c.id === 3).voltage).toBe(0)
    expect(components.find(c => c.id === 4).current).toBe(0)
  })
})
