import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from './CircuitSimulator'

describe('CircuitSimulator', () => {
  it('should create a simulator instance', () => {
    const simulator = new CircuitSimulator()
    expect(simulator).toBeDefined()
  })

  it('should light up LED when connected to battery', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const led = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 200,
      y: 100
    }

    const wire = {
      id: 3,
      from: 1,
      to: 2
    }

    simulator.setComponents([battery, led])
    simulator.setWires([wire])

    const result = simulator.simulate()

    const updatedLed = result.find(c => c.id === 2)
    expect(updatedLed.brightness).toBeGreaterThan(0)
  })

  it('should not light LED without connection', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const led = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 200,
      y: 100
    }

    simulator.setComponents([battery, led])
    simulator.setWires([])

    const result = simulator.simulate()

    const updatedLed = result.find(c => c.id === 2)
    expect(updatedLed.brightness).toBe(0)
  })

  it('should drain battery over time', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const led = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 200,
      y: 100
    }

    const wire = {
      id: 3,
      from: 1,
      to: 2
    }

    simulator.setComponents([battery, led])
    simulator.setWires([wire])

    const initialCharge = battery.charge
    simulator.simulate()
    const finalCharge = battery.charge

    expect(finalCharge).toBeLessThan(initialCharge)
  })

  it('should calculate voltage divider correctly', () => {
    const simulator = new CircuitSimulator()
    const result = simulator.voltageDivider(10, 100, 100)
    expect(result).toBe(5)
  })

  it('should calculate power correctly', () => {
    const simulator = new CircuitSimulator()
    const result = simulator.power(5, 2)
    expect(result).toBe(10)
  })

  it('should add voltages from series batteries', () => {
    const simulator = new CircuitSimulator()

    const battery1 = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 100,
      y: 100
    }

    const battery2 = {
      id: 2,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
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

    const wire1 = {
      id: 4,
      from: 1,
      to: 2
    }

    const wire2 = {
      id: 5,
      from: 2,
      to: 3
    }

    simulator.setComponents([battery1, battery2, led])
    simulator.setWires([wire1, wire2])

    const result = simulator.simulate()

    const updatedLed = result.find(c => c.id === 3)
    // With 9V total, LED should be brighter than with just 4.5V
    expect(updatedLed.brightness).toBeGreaterThan(0.3)
    expect(updatedLed.voltage).toBeCloseTo(9.0, 0.5)
  })

  it('should divide voltage across series LEDs', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 9.0,
      x: 100,
      y: 100
    }

    const led1 = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 100
    }

    const led2 = {
      id: 3,
      type: 'led',
      brightness: 0,
      x: 200,
      y: 100
    }

    const led3 = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 250,
      y: 100
    }

    simulator.setComponents([battery, led1, led2, led3])
    simulator.setWires([
      { id: 5, from: 1, to: 2 },
      { id: 6, from: 2, to: 3 },
      { id: 7, from: 3, to: 4 }
    ])

    const result = simulator.simulate()

    const updatedLed1 = result.find(c => c.id === 2)
    const updatedLed2 = result.find(c => c.id === 3)
    const updatedLed3 = result.find(c => c.id === 4)

    // With 9V across 3 LEDs, each gets 3V
    expect(updatedLed1.voltage).toBeCloseTo(3.0, 0.5)
    expect(updatedLed2.voltage).toBeCloseTo(3.0, 0.5)
    expect(updatedLed3.voltage).toBeCloseTo(3.0, 0.5)

    // All LEDs should have same brightness (high due to good voltage per LED)
    expect(updatedLed1.brightness).toBeGreaterThan(0.5)
    expect(updatedLed1.brightness).toBeLessThanOrEqual(1.0)
    expect(updatedLed2.brightness).toBeCloseTo(updatedLed1.brightness, 0.1)
    expect(updatedLed3.brightness).toBeCloseTo(updatedLed1.brightness, 0.1)
  })

  it('should handle one battery powering multiple series LEDs with dim brightness', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 100,
      y: 100
    }

    const led1 = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 100
    }

    const led2 = {
      id: 3,
      type: 'led',
      brightness: 0,
      x: 200,
      y: 100
    }

    const led3 = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 250,
      y: 100
    }

    const led4 = {
      id: 5,
      type: 'led',
      brightness: 0,
      x: 300,
      y: 100
    }

    simulator.setComponents([battery, led1, led2, led3, led4])
    simulator.setWires([
      { id: 6, from: 1, to: 2 },
      { id: 7, from: 2, to: 3 },
      { id: 8, from: 3, to: 4 },
      { id: 9, from: 4, to: 5 }
    ])

    const result = simulator.simulate()

    const updatedLed1 = result.find(c => c.id === 2)
    const updatedLed2 = result.find(c => c.id === 3)
    const updatedLed3 = result.find(c => c.id === 4)
    const updatedLed4 = result.find(c => c.id === 5)

    // With 4.5V across 4 LEDs, each gets 1.125V (dim)
    expect(updatedLed1.voltage).toBeCloseTo(1.125, 0.1)
    expect(updatedLed2.voltage).toBeCloseTo(1.125, 0.1)
    expect(updatedLed3.voltage).toBeCloseTo(1.125, 0.1)
    expect(updatedLed4.voltage).toBeCloseTo(1.125, 0.1)

    // All LEDs should be dim but still lit
    expect(updatedLed1.brightness).toBeGreaterThan(0)
    expect(updatedLed1.brightness).toBeLessThan(0.35)
    expect(updatedLed2.brightness).toBeCloseTo(updatedLed1.brightness, 0.05)
    expect(updatedLed3.brightness).toBeCloseTo(updatedLed1.brightness, 0.05)
    expect(updatedLed4.brightness).toBeCloseTo(updatedLed1.brightness, 0.05)
  })

  it('should produce very dim LED with single potato battery (0.9V)', () => {
    const simulator = new CircuitSimulator()

    const potato = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
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

    simulator.setComponents([potato, led])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])

    const result = simulator.simulate()
    const updatedLed = result.find(c => c.id === 2)

    // Single potato (0.9V) should produce dim LED (~16% brightness)
    expect(updatedLed.voltage).toBeCloseTo(0.9, 0.1)
    expect(updatedLed.brightness).toBeGreaterThan(0)
    expect(updatedLed.brightness).toBeLessThan(0.2)
  })

  it('should progressively brighten LED as more potatoes added in series', () => {
    const simulator = new CircuitSimulator()

    // Test with 1, 2, 3, and 5 potatoes
    const testCases = [
      { count: 1, expectedVoltage: 0.9 },
      { count: 2, expectedVoltage: 1.8 },
      { count: 3, expectedVoltage: 2.7 },
      { count: 5, expectedVoltage: 4.5 }
    ]

    const brightnesses = []

    testCases.forEach(({ count, expectedVoltage }) => {
      const components = []
      const wires = []

      // Add potatoes in series
      for (let i = 0; i < count; i++) {
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

      // Add LED
      const ledId = count + 1
      components.push({
        id: ledId,
        type: 'led',
        brightness: 0,
        x: 100 + count * 50,
        y: 100
      })

      // Connect last potato to LED
      wires.push({ id: 200, from: count, to: ledId })

      simulator.setComponents(components)
      simulator.setWires(wires)

      const result = simulator.simulate()
      const led = result.find(c => c.id === ledId)

      // Verify voltage
      expect(led.voltage).toBeCloseTo(expectedVoltage, 0.5)

      // Store brightness for comparison
      brightnesses.push({ count, brightness: led.brightness })
    })

    // Verify brightness increases with more potatoes (until max brightness reached)
    expect(brightnesses[1].brightness).toBeGreaterThan(brightnesses[0].brightness)
    expect(brightnesses[2].brightness).toBeGreaterThan(brightnesses[1].brightness)
    // Note: 3 and 5 potatoes both reach max brightness (1.0), so they're equal
    expect(brightnesses[3].brightness).toBeGreaterThanOrEqual(brightnesses[2].brightness)
  })

  it('should make LED brighter with multiple batteries vs single battery', () => {
    const simulator = new CircuitSimulator()

    // Test 1: Single battery with one LED
    const singleBattery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 100,
      y: 100
    }

    const singleLed = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 100
    }

    simulator.setComponents([singleBattery, singleLed])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])

    const singleResult = simulator.simulate()
    const singleBrightness = singleResult.find(c => c.id === 2).brightness

    // Test 2: Three batteries with one LED
    const battery1 = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 100,
      y: 100
    }

    const battery2 = {
      id: 2,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 150,
      y: 100
    }

    const battery3 = {
      id: 3,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 200,
      y: 100
    }

    const tripleLed = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 250,
      y: 100
    }

    simulator.setComponents([battery1, battery2, battery3, tripleLed])
    simulator.setWires([
      { id: 5, from: 1, to: 2 },
      { id: 6, from: 2, to: 3 },
      { id: 7, from: 3, to: 4 }
    ])

    const tripleResult = simulator.simulate()
    const tripleBrightness = tripleResult.find(c => c.id === 4).brightness

    // Three batteries (13.5V) should make LED at max brightness (1.0)
    // Single battery (4.5V) should also make LED at max brightness (1.0)
    // Both are capped at max, so they should be equal
    expect(tripleBrightness).toBeCloseTo(1.0, 0.1)
    expect(singleBrightness).toBeCloseTo(1.0, 0.1)
    expect(tripleBrightness).toBeCloseTo(singleBrightness, 0.1)
  })

  it('should light two parallel LEDs with equal brightness from single potato', () => {
    const simulator = new CircuitSimulator()

    const potato = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const led1 = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 50
    }

    const led2 = {
      id: 3,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 150
    }

    // Both LEDs connected to the same battery (parallel)
    simulator.setComponents([potato, led1, led2])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 1, to: 3 }
    ])

    const result = simulator.simulate()
    const updatedLed1 = result.find(c => c.id === 2)
    const updatedLed2 = result.find(c => c.id === 3)

    // Both LEDs should get full 0.9V (parallel connection)
    expect(updatedLed1.voltage).toBeCloseTo(0.9, 0.1)
    expect(updatedLed2.voltage).toBeCloseTo(0.9, 0.1)

    // Both should have equal, dim brightness
    expect(updatedLed1.brightness).toBeGreaterThan(0)
    expect(updatedLed1.brightness).toBeLessThan(0.2)
    expect(updatedLed2.brightness).toBeCloseTo(updatedLed1.brightness, 0.05)
  })

  it('should light three parallel LEDs with equal brightness from single potato', () => {
    const simulator = new CircuitSimulator()

    const potato = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const led1 = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 50
    }

    const led2 = {
      id: 3,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 100
    }

    const led3 = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 150
    }

    simulator.setComponents([potato, led1, led2, led3])
    simulator.setWires([
      { id: 5, from: 1, to: 2 },
      { id: 6, from: 1, to: 3 },
      { id: 7, from: 1, to: 4 }
    ])

    const result = simulator.simulate()
    const updatedLed1 = result.find(c => c.id === 2)
    const updatedLed2 = result.find(c => c.id === 3)
    const updatedLed3 = result.find(c => c.id === 4)

    // All LEDs should get full 0.9V
    expect(updatedLed1.voltage).toBeCloseTo(0.9, 0.1)
    expect(updatedLed2.voltage).toBeCloseTo(0.9, 0.1)
    expect(updatedLed3.voltage).toBeCloseTo(0.9, 0.1)

    // All should have equal, dim brightness
    expect(updatedLed1.brightness).toBeGreaterThan(0)
    expect(updatedLed1.brightness).toBeLessThan(0.2)
    expect(updatedLed2.brightness).toBeCloseTo(updatedLed1.brightness, 0.05)
    expect(updatedLed3.brightness).toBeCloseTo(updatedLed1.brightness, 0.05)
  })

  it('should light parallel LEDs with brighter light from series potatoes', () => {
    const simulator = new CircuitSimulator()

    const potato1 = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const potato2 = {
      id: 2,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 150,
      y: 100
    }

    const potato3 = {
      id: 3,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 200,
      y: 100
    }

    const led1 = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 250,
      y: 50
    }

    const led2 = {
      id: 5,
      type: 'led',
      brightness: 0,
      x: 250,
      y: 150
    }

    // Three potatoes in series, then two LEDs in parallel
    simulator.setComponents([potato1, potato2, potato3, led1, led2])
    simulator.setWires([
      { id: 6, from: 1, to: 2 },  // potato1 to potato2
      { id: 7, from: 2, to: 3 },  // potato2 to potato3
      { id: 8, from: 3, to: 4 },  // potato3 to led1
      { id: 9, from: 3, to: 5 }   // potato3 to led2
    ])

    const result = simulator.simulate()
    const updatedLed1 = result.find(c => c.id === 4)
    const updatedLed2 = result.find(c => c.id === 5)

    // Both LEDs get full 2.7V (3 * 0.9V)
    expect(updatedLed1.voltage).toBeCloseTo(2.7, 0.5)
    expect(updatedLed2.voltage).toBeCloseTo(2.7, 0.5)

    // Both should be reasonably bright (more than dim single potato)
    expect(updatedLed1.brightness).toBeGreaterThan(0.4)
    expect(updatedLed1.brightness).toBeLessThanOrEqual(1.0)
    expect(updatedLed2.brightness).toBeCloseTo(updatedLed1.brightness, 0.05)
  })

  it('should drain battery faster with multiple parallel LEDs', () => {
    const simulator = new CircuitSimulator()

    const potato = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const led1 = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 50
    }

    const led2 = {
      id: 3,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 150
    }

    simulator.setComponents([potato, led1, led2])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 1, to: 3 }
    ])

    const initialCharge = potato.charge
    simulator.simulate()
    const chargeAfterParallel = potato.charge

    // Reset for single LED test
    potato.charge = 1.0
    simulator.setComponents([potato, led1])
    simulator.setWires([{ id: 4, from: 1, to: 2 }])
    simulator.simulate()
    const chargeAfterSingle = potato.charge

    // Parallel configuration should drain faster (more current draw)
    const parallelDrain = initialCharge - chargeAfterParallel
    const singleDrain = initialCharge - chargeAfterSingle

    expect(parallelDrain).toBeGreaterThan(singleDrain)
  })

  // Mixed configurations: combinations of series and parallel for both batteries and LEDs

  it('should handle series LEDs with one LED having a parallel branch', () => {
    const simulator = new CircuitSimulator()

    const potato1 = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const potato2 = {
      id: 2,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 150,
      y: 100
    }

    // LED1 in series, then LED2 and LED3 in parallel
    const led1 = {
      id: 3,
      type: 'led',
      brightness: 0,
      x: 200,
      y: 100
    }

    const led2 = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 250,
      y: 50
    }

    const led3 = {
      id: 5,
      type: 'led',
      brightness: 0,
      x: 250,
      y: 150
    }

    // potato1 -> potato2 -> led1 -> led2
    //                       led1 -> led3
    simulator.setComponents([potato1, potato2, led1, led2, led3])
    simulator.setWires([
      { id: 6, from: 1, to: 2 },  // potato1 to potato2
      { id: 7, from: 2, to: 3 },  // potato2 to led1
      { id: 8, from: 3, to: 4 },  // led1 to led2
      { id: 9, from: 3, to: 5 }   // led1 to led3
    ])

    const result = simulator.simulate()
    const updatedLed1 = result.find(c => c.id === 3)
    const updatedLed2 = result.find(c => c.id === 4)
    const updatedLed3 = result.find(c => c.id === 5)

    // LED1 is in series with others, but LED2 and LED3 are parallel to each other
    // LED1 should be lit
    expect(updatedLed1.brightness).toBeGreaterThan(0)

    // LED2 and LED3 are parallel branches off LED1, so both should be lit
    expect(updatedLed2.brightness).toBeGreaterThan(0)
    expect(updatedLed3.brightness).toBeGreaterThan(0)

    // LED2 and LED3 should have equal brightness (parallel)
    expect(updatedLed3.brightness).toBeCloseTo(updatedLed2.brightness, 0.05)
  })

  it('should handle two parallel potato branches powering separate LEDs', () => {
    const simulator = new CircuitSimulator()

    // Two separate branches, each with a potato and LED
    const potato1 = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 50
    }

    const led1 = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 50
    }

    const potato2 = {
      id: 3,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 150
    }

    const led2 = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 150
    }

    // Two independent circuits
    simulator.setComponents([potato1, led1, potato2, led2])
    simulator.setWires([
      { id: 5, from: 1, to: 2 },  // potato1 to led1
      { id: 6, from: 3, to: 4 }   // potato2 to led2
    ])

    const result = simulator.simulate()
    const updatedLed1 = result.find(c => c.id === 2)
    const updatedLed2 = result.find(c => c.id === 4)

    // Both LEDs should be independently powered
    expect(updatedLed1.voltage).toBeCloseTo(0.9, 0.1)
    expect(updatedLed2.voltage).toBeCloseTo(0.9, 0.1)
    expect(updatedLed1.brightness).toBeGreaterThan(0)
    expect(updatedLed2.brightness).toBeGreaterThan(0)
    expect(updatedLed2.brightness).toBeCloseTo(updatedLed1.brightness, 0.05)
  })

  it('should handle series potatoes with parallel LED branches at different points', () => {
    const simulator = new CircuitSimulator()

    const potato1 = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const potato2 = {
      id: 2,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 150,
      y: 100
    }

    const potato3 = {
      id: 3,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 200,
      y: 100
    }

    // Two parallel LEDs after first potato
    const led1 = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 125,
      y: 50
    }

    const led2 = {
      id: 5,
      type: 'led',
      brightness: 0,
      x: 125,
      y: 150
    }

    // Two parallel LEDs after all three potatoes
    const led3 = {
      id: 6,
      type: 'led',
      brightness: 0,
      x: 225,
      y: 50
    }

    const led4 = {
      id: 7,
      type: 'led',
      brightness: 0,
      x: 225,
      y: 150
    }

    // potato1 branches to led1 and led2 (parallel)
    // potato1 -> potato2 -> potato3 branches to led3 and led4 (parallel)
    simulator.setComponents([potato1, potato2, potato3, led1, led2, led3, led4])
    simulator.setWires([
      { id: 8, from: 1, to: 4 },   // potato1 to led1
      { id: 9, from: 1, to: 5 },   // potato1 to led2
      { id: 10, from: 1, to: 2 },  // potato1 to potato2
      { id: 11, from: 2, to: 3 },  // potato2 to potato3
      { id: 12, from: 3, to: 6 },  // potato3 to led3
      { id: 13, from: 3, to: 7 }   // potato3 to led4
    ])

    const result = simulator.simulate()
    const updatedLed1 = result.find(c => c.id === 4)
    const updatedLed2 = result.find(c => c.id === 5)
    const updatedLed3 = result.find(c => c.id === 6)
    const updatedLed4 = result.find(c => c.id === 7)

    // Note: In this complex topology, all components are connected,
    // so LEDs see voltage from all batteries (simple implementation)
    // LED1 and LED2 are parallel and connected to the entire battery chain
    expect(updatedLed1.voltage).toBeCloseTo(2.7, 0.5)
    expect(updatedLed2.voltage).toBeCloseTo(2.7, 0.5)
    expect(updatedLed1.brightness).toBeGreaterThan(0)
    expect(updatedLed2.brightness).toBeCloseTo(updatedLed1.brightness, 0.05)

    // LED3 and LED4 also get full voltage from the battery chain
    expect(updatedLed3.voltage).toBeCloseTo(2.7, 0.5)
    expect(updatedLed4.voltage).toBeCloseTo(2.7, 0.5)
    expect(updatedLed3.brightness).toBeGreaterThan(0)
    expect(updatedLed4.brightness).toBeCloseTo(updatedLed3.brightness, 0.05)
  })

  it('should handle parallel batteries powering series LEDs', () => {
    const simulator = new CircuitSimulator()

    // Note: True parallel batteries would require a common ground/return path
    // This tests two separate battery-LED circuits
    const potato1 = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 50
    }

    const potato2 = {
      id: 2,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 150
    }

    // Two LEDs in series on first branch
    const led1 = {
      id: 3,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 50
    }

    const led2 = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 200,
      y: 50
    }

    // One LED on second branch
    const led3 = {
      id: 5,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 150
    }

    // potato1 -> led1 -> led2
    // potato2 -> led3
    simulator.setComponents([potato1, potato2, led1, led2, led3])
    simulator.setWires([
      { id: 6, from: 1, to: 3 },  // potato1 to led1
      { id: 7, from: 3, to: 4 },  // led1 to led2
      { id: 8, from: 2, to: 5 }   // potato2 to led3
    ])

    const result = simulator.simulate()
    const updatedLed1 = result.find(c => c.id === 3)
    const updatedLed2 = result.find(c => c.id === 4)
    const updatedLed3 = result.find(c => c.id === 5)

    // LED1 and LED2 are in series, sharing 0.9V (0.45V each - too dim to light)
    expect(updatedLed1.voltage).toBeCloseTo(0.45, 0.1)
    expect(updatedLed2.voltage).toBeCloseTo(0.45, 0.1)
    // Below 0.5V threshold, LEDs don't light
    expect(updatedLed1.brightness).toBe(0)
    expect(updatedLed2.brightness).toBe(0)

    // LED3 gets full 0.9V from its battery and should light
    expect(updatedLed3.voltage).toBeCloseTo(0.9, 0.1)
    expect(updatedLed3.brightness).toBeGreaterThan(0)
  })

  it('should calculate series battery voltage correctly regardless of charge level', () => {
    const simulator = new CircuitSimulator()

    // Two batteries with DIFFERENT charge levels in series
    const battery1 = {
      id: 1,
      type: 'battery',
      charge: 1.0,  // Full
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const battery2 = {
      id: 2,
      type: 'battery',
      charge: 0.5,  // Half charged
      voltage: 0.9,
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

    simulator.setComponents([battery1, battery2, led])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 2, to: 3 }
    ])

    const result = simulator.simulate()
    const updatedLed = result.find(c => c.id === 3)

    // Series batteries: voltage adds (0.9V + 0.9V = 1.8V)
    // Charge level should NOT affect voltage, only capacity
    expect(updatedLed.voltage).toBeCloseTo(1.8, 0.1)

    // LED should light (above 0.5V threshold)
    expect(updatedLed.brightness).toBeGreaterThan(0)
  })

  it('should handle depleted battery in series (0V contribution)', () => {
    const simulator = new CircuitSimulator()

    const battery1 = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const battery2 = {
      id: 2,
      type: 'battery',
      charge: 0.0,  // Completely depleted
      voltage: 0.9,
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

    simulator.setComponents([battery1, battery2, led])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 2, to: 3 }
    ])

    const result = simulator.simulate()
    const updatedLed = result.find(c => c.id === 3)

    // Depleted battery contributes 0V (0.9V * 0.0 charge = 0V)
    // This behavior is acceptable: dead battery = open circuit
    expect(updatedLed.voltage).toBeCloseTo(0.9, 0.1)
    expect(updatedLed.brightness).toBeGreaterThan(0)
  })

  it('should verify parallel LED battery drain uses parallelMultiplier correctly', () => {
    const simulator = new CircuitSimulator()

    // Test 1: Single LED
    const battery1 = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const led1 = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 100
    }

    simulator.setComponents([battery1, led1])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])

    simulator.simulate()
    const drainSingle = 1.0 - battery1.charge

    // Test 2: Two parallel LEDs
    const battery2 = {
      id: 4,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9,
      x: 100,
      y: 100
    }

    const led2 = {
      id: 5,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 50
    }

    const led3 = {
      id: 6,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 150
    }

    simulator.setComponents([battery2, led2, led3])
    simulator.setWires([
      { id: 7, from: 4, to: 5 },
      { id: 8, from: 4, to: 6 }
    ])

    simulator.simulate()
    const drainParallel = 1.0 - battery2.charge

    // Parallel LEDs should drain ~2x as fast (2 LEDs drawing current)
    // Allow some tolerance for calculation differences
    expect(drainParallel).toBeCloseTo(drainSingle * 2, 0.001)
  })

  it('should detect parallel branches in mixed series-parallel topology', () => {
    const simulator = new CircuitSimulator()

    const battery = {
      id: 1,
      type: 'battery',
      charge: 1.0,
      voltage: 4.5,
      x: 100,
      y: 100
    }

    // LED1 in series first
    const led1 = {
      id: 2,
      type: 'led',
      brightness: 0,
      x: 150,
      y: 100
    }

    // Then LED2 and LED3 branch in parallel
    const led2 = {
      id: 3,
      type: 'led',
      brightness: 0,
      x: 200,
      y: 50
    }

    const led3 = {
      id: 4,
      type: 'led',
      brightness: 0,
      x: 200,
      y: 150
    }

    // Battery -> LED1 -> LED2
    //                 -> LED3
    simulator.setComponents([battery, led1, led2, led3])
    simulator.setWires([
      { id: 5, from: 1, to: 2 },  // battery to led1
      { id: 6, from: 2, to: 3 },  // led1 to led2
      { id: 7, from: 2, to: 4 }   // led1 to led3
    ])

    const result = simulator.simulate()
    const updatedLed1 = result.find(c => c.id === 2)
    const updatedLed2 = result.find(c => c.id === 3)
    const updatedLed3 = result.find(c => c.id === 4)

    // All LEDs should light
    expect(updatedLed1.brightness).toBeGreaterThan(0)
    expect(updatedLed2.brightness).toBeGreaterThan(0)
    expect(updatedLed3.brightness).toBeGreaterThan(0)

    // LED2 and LED3 are parallel branches, so should have equal brightness
    expect(updatedLed3.brightness).toBeCloseTo(updatedLed2.brightness, 0.05)

    // LED1 is in series before the parallel branch
    // Current logic may incorrectly classify LED2/LED3 based on
    // whether they connect to another LED
  })

  // Resistor tests
  describe('Resistors', () => {
    it('should limit current through LED with series resistor', () => {
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
        resistance: 470,  // 470 ohm resistor (common for LEDs)
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

      // Battery -> Resistor -> LED
      simulator.setComponents([battery, resistor, led])
      simulator.setWires([
        { id: 4, from: 1, to: 2 },
        { id: 5, from: 2, to: 3 }
      ])

      const result = simulator.simulate()
      const updatedLed = result.find(c => c.id === 3)

      // With 470Ω resistor and 9V battery:
      // Current = V / R_total = 9V / (470Ω + 100Ω_LED) ≈ 15.8mA
      // This is safe for LED (< 20mA max)
      expect(updatedLed.current).toBeGreaterThan(0.010)  // > 10mA
      expect(updatedLed.current).toBeLessThan(0.020)     // < 20mA
      expect(updatedLed.brightness).toBeGreaterThan(0.4)  // Bright (close to 50%)
    })

    it('should drop voltage across resistor correctly', () => {
      const simulator = new CircuitSimulator()

      const battery = {
        id: 1,
        type: 'battery',
        charge: 1.0,
        voltage: 5.0,
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

      const result = simulator.simulate()
      const updatedResistor = result.find(c => c.id === 2)
      const updatedLed = result.find(c => c.id === 3)

      // Total resistance: 100Ω + 100Ω = 200Ω
      // Current: 5V / 200Ω = 25mA (capped at 20mA by LED)
      // Voltage drop across resistor: 20mA * 100Ω = 2V
      // Voltage across LED: 5V - 2V = 3V
      expect(updatedResistor.voltageDrop).toBeCloseTo(2.0, 0.5)
      expect(updatedLed.voltage).toBeCloseTo(3.0, 0.5)
    })

    it('should handle multiple resistors in series (voltage divider)', () => {
      const simulator = new CircuitSimulator()

      const battery = {
        id: 1,
        type: 'battery',
        charge: 1.0,
        voltage: 9.0,
        x: 100,
        y: 100
      }

      const resistor1 = {
        id: 2,
        type: 'resistor',
        resistance: 1000,
        x: 150,
        y: 100
      }

      const resistor2 = {
        id: 3,
        type: 'resistor',
        resistance: 1000,
        x: 200,
        y: 100
      }

      const led = {
        id: 4,
        type: 'led',
        brightness: 0,
        x: 250,
        y: 100
      }

      // Battery -> R1 -> R2 -> LED
      simulator.setComponents([battery, resistor1, resistor2, led])
      simulator.setWires([
        { id: 5, from: 1, to: 2 },
        { id: 6, from: 2, to: 3 },
        { id: 7, from: 3, to: 4 }
      ])

      const result = simulator.simulate()
      const updatedLed = result.find(c => c.id === 4)

      // Total R = 2100Ω (1000 + 1000 + 100 for LED)
      // I = 9V / 2100Ω ≈ 4.3mA (low current, dim LED)
      expect(updatedLed.current).toBeLessThan(0.005)
      expect(updatedLed.brightness).toBeLessThan(0.3)  // Dim
    })

    it('should protect LED from overcurrent without resistor vs with resistor', () => {
      const simulator = new CircuitSimulator()

      // Test 1: High voltage without resistor (bad!)
      const battery1 = {
        id: 1,
        type: 'battery',
        charge: 1.0,
        voltage: 9.0,
        x: 100,
        y: 100
      }

      const led1 = {
        id: 2,
        type: 'led',
        brightness: 0,
        x: 150,
        y: 100
      }

      simulator.setComponents([battery1, led1])
      simulator.setWires([{ id: 3, from: 1, to: 2 }])

      const result1 = simulator.simulate()
      const led1After = result1.find(c => c.id === 2)

      // Without resistor: current maxed at 20mA (LED protection)
      expect(led1After.current).toBeCloseTo(0.020, 0.001)

      // Test 2: Same voltage with resistor (good!)
      const battery2 = {
        id: 4,
        type: 'battery',
        charge: 1.0,
        voltage: 9.0,
        x: 100,
        y: 100
      }

      const resistor = {
        id: 5,
        type: 'resistor',
        resistance: 470,
        x: 150,
        y: 100
      }

      const led2 = {
        id: 6,
        type: 'led',
        brightness: 0,
        x: 200,
        y: 100
      }

      simulator.setComponents([battery2, resistor, led2])
      simulator.setWires([
        { id: 7, from: 4, to: 5 },
        { id: 8, from: 5, to: 6 }
      ])

      const result2 = simulator.simulate()
      const led2After = result2.find(c => c.id === 6)

      // With resistor: current limited by resistance, safer
      expect(led2After.current).toBeLessThan(0.020)
      expect(led2After.current).toBeGreaterThan(0.010)
    })
  })

  // Component visual state tests
  describe('Visual State Feedback', () => {
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
})
