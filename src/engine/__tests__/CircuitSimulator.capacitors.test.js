import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../CircuitSimulator'

describe('CircuitSimulator - Capacitors', () => {
  it('should charge capacitor from battery over time', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 100,
      y: 100
    }

    const capacitor = {
      id: 2,
      type: 'capacitor',
      capacitance: 0.001,  // 1mF (foil capacitor)
      voltage: 0,  // Uncharged
      x: 150,
      y: 100
    }

    simulator.setComponents([battery, capacitor])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])

    // Initially capacitor is uncharged (but one simulate() call will charge it slightly)
    // So we check that it starts at 0 before any simulation
    expect(capacitor.voltage).toBe(0)

    // After multiple simulation steps, capacitor should charge
    let result
    for (let i = 0; i < 10; i++) {
      result = simulator.simulate()
    }

    const updatedCap = result.find(c => c.id === 2)
    expect(updatedCap.voltage).toBeGreaterThan(0)
    expect(updatedCap.voltage).toBeLessThanOrEqual(4.5)  // Charged or nearly fully charged
  })

  it('should discharge capacitor through resistor', () => {
    const simulator = new CircuitSimulator()

    // Pre-charged capacitor
    const capacitor = {
      id: 1,
      type: 'capacitor',
      capacitance: 0.001,
      voltage: 4.5,  // Fully charged
      x: 100,
      y: 100
    }

    const resistor = {
      id: 2,
      type: 'resistor',
      resistance: 1000,  // 1kΩ
      x: 150,
      y: 100
    }

    simulator.setComponents([capacitor, resistor])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])

    // After multiple steps, capacitor should discharge
    for (let i = 0; i < 10; i++) {
      simulator.simulate()
    }

    const updatedCap = simulator.components.find(c => c.id === 1)
    expect(updatedCap.voltage).toBeLessThan(4.5)
    expect(updatedCap.voltage).toBeGreaterThan(0)  // Not fully discharged yet
  })

  it('should calculate charging time constant (RC)', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 100,
      y: 100
    }

    const resistor = {
      id: 2,
      type: 'resistor',
      resistance: 1000,  // 1kΩ
      x: 150,
      y: 100
    }

    const capacitor = {
      id: 3,
      type: 'capacitor',
      capacitance: 0.001,  // 1mF
      voltage: 0,
      x: 200,
      y: 100
    }

    // RC circuit: battery -> resistor -> capacitor
    simulator.setComponents([battery, resistor, capacitor])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 2, to: 3 }
    ])

    // Time constant τ = R × C = 1000Ω × 0.001F = 1 second
    // After 1 time constant, capacitor should reach ~63.2% of battery voltage
    // Assuming 100ms simulation steps, need 10 steps for 1 second

    for (let i = 0; i < 10; i++) {
      simulator.simulate()
    }

    const updatedCap = simulator.components.find(c => c.id === 3)
    const expectedVoltage = 4.5 * 0.632  // 63.2% of 4.5V
    expect(updatedCap.voltage).toBeCloseTo(expectedVoltage, 0.5)
  })

  it('should provide capacitor visual state (charge level)', () => {
    const simulator = new CircuitSimulator()

    const capacitor = {
      id: 1,
      type: 'capacitor',
      capacitance: 0.001,
      voltage: 2.5,
      maxVoltage: 5.0,  // Rated voltage
      x: 100,
      y: 100
    }

    const visualState = simulator.getCapacitorVisualState(capacitor)

    expect(visualState.chargePercent).toBe(50)  // 2.5V / 5.0V = 50%
    expect(visualState.chargeFill).toBeCloseTo(0.5, 0.01)
    expect(visualState.state).toBe('charged')  // 50% = charged state (0.5 >= 0.5 threshold)
  })

  it('should handle capacitor in LED circuit for smoothing', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 100,
      y: 100
    }

    const capacitor = {
      id: 2,
      type: 'capacitor',
      capacitance: 0.001,
      voltage: 0,
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

    // Battery charges capacitor, capacitor powers LED
    simulator.setComponents([battery, capacitor, led])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 2, to: 3 }
    ])

    // LED should light as capacitor charges
    for (let i = 0; i < 5; i++) {
      simulator.simulate()
    }

    const updatedLed = simulator.components.find(c => c.id === 3)
    const updatedCap = simulator.components.find(c => c.id === 2)

    expect(updatedCap.voltage).toBeGreaterThan(0)
    expect(updatedLed.brightness).toBeGreaterThan(0)
  })
})
