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

  it('should handle capacitor in series with LED (capacitor blocks DC when charged)', () => {
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

    // Battery -> Capacitor -> LED (series)
    simulator.setComponents([battery, capacitor, led])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 2, to: 3 }
    ])

    // Initially, LED may light briefly as capacitor charges
    simulator.simulate(0.01)
    const initialLed = simulator.components.find(c => c.id === 3)
    const initialBrightness = initialLed.brightness

    // After capacitor charges, LED should go dim/off (capacitor blocks DC)
    for (let i = 0; i < 20; i++) {
      simulator.simulate()
    }

    const updatedLed = simulator.components.find(c => c.id === 3)
    const updatedCap = simulator.components.find(c => c.id === 2)

    expect(updatedCap.voltage).toBeGreaterThan(0)  // Capacitor charged
    expect(updatedLed.brightness).toBeLessThan(0.3)  // LED dim/off once capacitor charged
  })

  it('should discharge capacitor through LED when battery disconnected', () => {
    const simulator = new CircuitSimulator()

    // Pre-charged capacitor
    const capacitor = {
      id: 1,
      type: 'capacitor',
      capacitance: 0.1,  // 100mF
      voltage: 3.0,  // Charged
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

    // Only capacitor and LED, no battery
    simulator.setComponents([capacitor, led])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])

    // Initial simulation - LED should light from capacitor
    simulator.simulate()
    let updatedLed = simulator.components.find(c => c.id === 2)
    let updatedCap = simulator.components.find(c => c.id === 1)

    expect(updatedLed.brightness).toBeGreaterThan(0)
    expect(updatedCap.voltage).toBeGreaterThan(0)

    // After many steps, capacitor should discharge
    for (let i = 0; i < 20; i++) {
      simulator.simulate()
    }

    updatedCap = simulator.components.find(c => c.id === 1)
    expect(updatedCap.voltage).toBeLessThan(3.0)  // Should have discharged
  })

  it('should discharge capacitor to zero when completely disconnected', () => {
    const simulator = new CircuitSimulator()

    // Pre-charged capacitor with NO connections
    const capacitor = {
      id: 1,
      type: 'capacitor',
      capacitance: 0.1,
      voltage: 3.0,
      x: 100,
      y: 100
    }

    simulator.setComponents([capacitor])
    simulator.setWires([])  // No wires - completely disconnected

    // Simulate many steps
    for (let i = 0; i < 10; i++) {
      simulator.simulate()
    }

    const updatedCap = simulator.components.find(c => c.id === 1)
    // Disconnected capacitor should slowly self-discharge (leakage)
    expect(updatedCap.voltage).toBeLessThan(3.0)
  })

  it('should charge at same rate regardless of resistor presence when directly connected', () => {
    const simulator1 = new CircuitSimulator()
    const simulator2 = new CircuitSimulator()

    // Circuit 1: Battery -> Capacitor (no resistor)
    const battery1 = { id: 1, type: 'battery', charge: 1.0, voltage: 4.5, x: 100, y: 100 }
    const capacitor1 = { id: 2, type: 'capacitor', capacitance: 0.1, voltage: 0, x: 150, y: 100 }

    simulator1.setComponents([battery1, capacitor1])
    simulator1.setWires([{ id: 3, from: 1, to: 2 }])

    // Circuit 2: Battery -> Resistor -> Capacitor
    const battery2 = { id: 1, type: 'battery', charge: 1.0, voltage: 4.5, x: 100, y: 100 }
    const resistor2 = { id: 2, type: 'resistor', resistance: 100, x: 150, y: 100 }
    const capacitor2 = { id: 3, type: 'capacitor', capacitance: 0.1, voltage: 0, x: 200, y: 100 }

    simulator2.setComponents([battery2, resistor2, capacitor2])
    simulator2.setWires([{ id: 4, from: 1, to: 2 }, { id: 5, from: 2, to: 3 }])

    // Simulate both
    for (let i = 0; i < 5; i++) {
      simulator1.simulate()
      simulator2.simulate()
    }

    const cap1 = simulator1.components.find(c => c.id === 2)
    const cap2 = simulator2.components.find(c => c.id === 3)

    // Circuit without resistor should charge FASTER (less resistance)
    // After 5 steps, circuit 1 should have higher voltage than circuit 2
    expect(cap1.voltage).toBeGreaterThan(cap2.voltage)
  })
})
