import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../CircuitSimulator'

describe('CircuitSimulator - Light Bulbs', () => {
  it('should light incandescent bulb with sufficient voltage', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 100,
      y: 100
    }

    const bulb = {
      id: 2,
      type: 'lightbulb',
      brightness: 0,
      resistance: 50,  // Lower resistance than LED (draws more current)
      x: 150,
      y: 100
    }

    simulator.setComponents([battery, bulb])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])

    const result = simulator.simulate()
    const updatedBulb = result.find(c => c.id === 2)

    expect(updatedBulb.brightness).toBeGreaterThan(0)
    expect(updatedBulb.voltage).toBeCloseTo(4.5, 0.5)
    expect(updatedBulb.current).toBeGreaterThan(0)
  })

  it('should not light bulb with insufficient voltage', () => {
    const simulator = new CircuitSimulator()

    const potato = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,  // Single potato (too weak for bulb)
      x: 100,
      y: 100
    }

    const bulb = {
      id: 2,
      type: 'lightbulb',
      brightness: 0,
      resistance: 50,
      x: 150,
      y: 100
    }

    simulator.setComponents([potato, bulb])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])

    const result = simulator.simulate()
    const updatedBulb = result.find(c => c.id === 2)

    // Too weak to light (needs ~2.5V minimum for visible glow)
    expect(updatedBulb.brightness).toBe(0)
  })

  it('should draw more current than LED at same voltage', () => {
    const simulator = new CircuitSimulator()

    // Test 1: Light bulb circuit
    const battery1 = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 100,
      y: 100
    }

    const bulb = {
      id: 2,
      type: 'lightbulb',
      brightness: 0,
      resistance: 50,
      x: 150,
      y: 100
    }

    simulator.setComponents([battery1, bulb])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])
    simulator.simulate()
    const bulbCurrent = bulb.current

    // Test 2: LED circuit
    const battery2 = {
      id: 4,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 100,
      y: 100
    }

    const led = {
      id: 5,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 100
    }

    simulator.setComponents([battery2, led])
    simulator.setWires([{ id: 6, from: 4, to: 5 }])
    simulator.simulate()
    const ledCurrent = led.current

    // Bulb draws more current (lower resistance)
    expect(bulbCurrent).toBeGreaterThan(ledCurrent)
  })

  it('should drain battery faster than LED', () => {
    const simulator = new CircuitSimulator()

    // Test bulb drain
    const battery1 = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 100,
      y: 100
    }

    const bulb = {
      id: 2,
      type: 'lightbulb',
      brightness: 0,
      resistance: 50,
      x: 150,
      y: 100
    }

    simulator.setComponents([battery1, bulb])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])
    simulator.simulate()
    const bulbDrain = 1.0 - battery1.charge

    // Test LED drain
    const battery2 = {
      id: 4,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 100,
      y: 100
    }

    const led = {
      id: 5,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 100
    }

    simulator.setComponents([battery2, led])
    simulator.setWires([{ id: 6, from: 4, to: 5 }])
    simulator.simulate()
    const ledDrain = 1.0 - battery2.charge

    // Bulb drains faster (higher current draw)
    expect(bulbDrain).toBeGreaterThan(ledDrain)
  })

  it('should provide light bulb visual state (brightness and filament heat)', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 100,
      y: 100
    }

    const bulb = {
      id: 2,
      type: 'lightbulb',
      brightness: 0,
      resistance: 50,
      x: 150,
      y: 100
    }

    simulator.setComponents([battery, bulb])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])
    simulator.simulate()

    const updatedBulb = simulator.components.find(c => c.id === 2)
    const visualState = simulator.getLightBulbVisualState(updatedBulb)

    expect(visualState.brightnessPercent).toBeGreaterThan(0)
    expect(visualState.glowIntensity).toBeGreaterThan(0)
    expect(visualState.filamentHeat).toBeGreaterThan(0)  // Temperature-based glow
    expect(visualState.state).toBeDefined()
  })

  it('should light bulb with series potatoes (5+ potatoes)', () => {
    const simulator = new CircuitSimulator()

    // Five potatoes in series = 4.5V
    const components = []
    const wires = []

    for (let i = 0; i < 5; i++) {
      components.push({
        id: i + 1,
        type: 'battery',
        charge: 1.0,
        voltage: 0.9,
        x: 100 + i * 50,
        y: 100
      })

      if (i > 0) {
        wires.push({ id: 100 + i, from: i, to: i + 1 })
      }
    }

    // Add bulb
    components.push({
      id: 6,
      type: 'lightbulb',
      brightness: 0,
      resistance: 50,
      x: 350,
      y: 100
    })

    wires.push({ id: 200, from: 5, to: 6 })

    simulator.setComponents(components)
    simulator.setWires(wires)

    const result = simulator.simulate()
    const bulb = result.find(c => c.id === 6)

    // 5 potatoes (4.5V) should light the bulb
    expect(bulb.voltage).toBeCloseTo(4.5, 0.5)
    expect(bulb.brightness).toBeGreaterThan(0)
  })
})
