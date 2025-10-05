import { describe, it, expect } from 'vitest'
import { CircuitSimulator } from '../../engine/CircuitSimulator'
import { ChallengeValidators } from '../ChallengeValidators'
import { ComponentFactory } from '../../utils/ComponentFactory'

describe('Challenge Solutions - Verify all challenges are solvable', () => {
  // Challenge 1: First Light
  it('Challenge 1: First Light - LED + battery', () => {
    const simulator = new CircuitSimulator()

    const battery = ComponentFactory.createBattery(1)
    const led = ComponentFactory.createLED(2)

    simulator.setComponents([battery, led])
    simulator.setWires([{ id: 3, from: 1, to: 2 }])
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateFirstLight({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(led.brightness).toBeGreaterThan(0)
  })

  // Challenge 2: Power Up
  it('Challenge 2: Power Up - series batteries boost voltage', () => {
    const simulator = new CircuitSimulator()

    const battery1 = ComponentFactory.createBattery(1)
    const battery2 = ComponentFactory.createBattery(2)
    const led = ComponentFactory.createLED(3)

    simulator.setComponents([battery1, battery2, led])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 2, to: 3 }
    ])
    simulator.simulate(0.1)

    const result = ChallengeValidators.validatePowerUp({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(led.brightness).toBeGreaterThan(0.5)
  })

  // Challenge 3: Current Control
  it('Challenge 3: Current Control - resistor protects LED', () => {
    const simulator = new CircuitSimulator()

    const battery1 = ComponentFactory.createBattery(1)
    const battery2 = ComponentFactory.createBattery(2)
    const battery3 = ComponentFactory.createBattery(3)
    const resistor = ComponentFactory.createResistor(4)
    const led = ComponentFactory.createLED(5)

    simulator.setComponents([battery1, battery2, battery3, resistor, led])
    simulator.setWires([
      { id: 6, from: 1, to: 2 },
      { id: 7, from: 2, to: 3 },
      { id: 8, from: 3, to: 4 },
      { id: 9, from: 4, to: 5 }
    ])
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateCurrentControl({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(led.brightness).toBeGreaterThan(0.1)
    expect(led.brightness).toBeLessThan(1.0)
  })

  // Challenge 4: Warm Glow
  it('Challenge 4: Warm Glow - power a light bulb', () => {
    const simulator = new CircuitSimulator()

    // Need 3 batteries (2.7V) minimum to exceed 2.5V threshold
    const batteries = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const bulb = ComponentFactory.createLightBulb(4)

    simulator.setComponents([...batteries, bulb])
    const wires = batteries.slice(0, -1).map((b, i) => ({
      id: 10 + i,
      from: b.id,
      to: batteries[i + 1].id
    }))
    wires.push({ id: 20, from: batteries[batteries.length - 1].id, to: bulb.id })
    simulator.setWires(wires)
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateWarmGlow({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(bulb.brightness).toBeGreaterThan(0.2)
  })

  // Challenge 7: Double Bright
  it('Challenge 7: Double Bright - parallel LEDs with resistors', () => {
    const simulator = new CircuitSimulator()

    const battery1 = ComponentFactory.createBattery(1)
    const battery2 = ComponentFactory.createBattery(2)
    const battery3 = ComponentFactory.createBattery(3)
    const resistor1 = ComponentFactory.createResistor(4)
    const led1 = ComponentFactory.createLED(5)
    const resistor2 = ComponentFactory.createResistor(6)
    const led2 = ComponentFactory.createLED(7)

    simulator.setComponents([battery1, battery2, battery3, resistor1, led1, resistor2, led2])
    simulator.setWires([
      { id: 8, from: 1, to: 2 },
      { id: 9, from: 2, to: 3 },
      { id: 10, from: 3, to: 4 },  // Battery -> R1
      { id: 11, from: 4, to: 5 },  // R1 -> LED1
      { id: 12, from: 3, to: 6 },  // Battery -> R2 (parallel)
      { id: 13, from: 6, to: 7 }   // R2 -> LED2
    ])
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateDoubleBright({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(led1.brightness).toBeGreaterThan(0.1)
    expect(led2.brightness).toBeGreaterThan(0.1)
  })

  // Challenge 8: Energy Bank
  it('Challenge 8: Energy Bank - capacitor powers LED', () => {
    const simulator = new CircuitSimulator()

    // Solution: Battery charges capacitor in parallel with LED
    // Capacitor stores energy and helps power the LED smoothly
    const battery1 = ComponentFactory.createBattery(1)
    const battery2 = ComponentFactory.createBattery(2)
    const capacitor = ComponentFactory.createCapacitor(3)  // 100mF cap
    const led = ComponentFactory.createLED(4)

    simulator.setComponents([battery1, battery2, capacitor, led])
    simulator.setWires([
      { id: 5, from: 1, to: 2 },  // Battery series
      { id: 6, from: 2, to: 3 },  // Battery -> Capacitor
      { id: 7, from: 2, to: 4 }   // Battery -> LED (parallel with capacitor)
    ])

    // Run simulation to charge capacitor and light LED
    for (let i = 0; i < 50; i++) {
      simulator.simulate(0.1)
    }

    // Validate
    const result = ChallengeValidators.validateEnergyBank({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(capacitor.voltage).toBeGreaterThanOrEqual(1.5)
    expect(led.brightness).toBeGreaterThanOrEqual(0.1)
  })

  // Challenge 9: Capacitor Power
  it('Challenge 9: Capacitor Power - capacitor in parallel with LED and battery', () => {
    const simulator = new CircuitSimulator()

    const battery = ComponentFactory.createBattery(1)
    const capacitor = ComponentFactory.createCapacitor(2)
    const led = ComponentFactory.createLED(3)

    // Parallel topology: battery connects to both capacitor and LED
    simulator.setComponents([battery, capacitor, led])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },  // Battery -> Capacitor
      { id: 5, from: 1, to: 3 }   // Battery -> LED (parallel)
    ])

    // Simulate to charge capacitor and light LED
    for (let i = 0; i < 10; i++) {
      simulator.simulate(0.1)
    }

    const result = ChallengeValidators.validateCapacitorPower({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(capacitor.voltage).toBeGreaterThan(0.5)
    expect(led.brightness).toBeGreaterThan(0.3)
  })

  // Challenge 10: Capacitor Bank
  it('Challenge 10: Capacitor Bank - parallel capacitors', () => {
    const simulator = new CircuitSimulator()

    const battery1 = ComponentFactory.createBattery(1)
    const battery2 = ComponentFactory.createBattery(2)
    const cap1 = ComponentFactory.createCapacitor(3)
    const cap2 = ComponentFactory.createCapacitor(4)
    const led = ComponentFactory.createLED(5)

    simulator.setComponents([battery1, battery2, cap1, cap2, led])
    simulator.setWires([
      { id: 6, from: 1, to: 2 },
      { id: 7, from: 2, to: 3 },  // Battery -> Cap1
      { id: 8, from: 2, to: 4 },  // Battery -> Cap2 (parallel)
      { id: 9, from: 2, to: 5 }   // Battery -> LED
    ])

    for (let i = 0; i < 50; i++) {
      simulator.simulate(0.1)
    }

    const result = ChallengeValidators.validateCapNetwork({
      components: simulator.components
    })

    expect(result.success).toBe(true)
  })

  // Challenge 11: Energy Storage Mastery
  it('Challenge 11: Energy Storage Mastery - capacitor powers LED', () => {
    const simulator = new CircuitSimulator()

    // Same as Challenge 8, but demonstrates mastery
    const battery1 = ComponentFactory.createBattery(1)
    const battery2 = ComponentFactory.createBattery(2)
    const capacitor = ComponentFactory.createCapacitor(3)  // 100mF
    const led = { id: 4, type: 'led', brightness: 0 }

    simulator.setComponents([battery1, battery2, capacitor, led])
    simulator.setWires([
      { id: 5, from: 1, to: 2 },  // Battery series
      { id: 6, from: 2, to: 3 },  // Battery -> Capacitor
      { id: 7, from: 2, to: 4 }   // Battery -> LED (parallel with capacitor)
    ])

    // Run simulation to charge capacitor and light LED
    for (let i = 0; i < 50; i++) {
      simulator.simulate(0.1)
    }

    const result = ChallengeValidators.validateEnergyBank({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(capacitor.voltage).toBeGreaterThanOrEqual(1.5)
    expect(led.brightness).toBeGreaterThanOrEqual(0.1)
  })

  // Challenge 12: Triple Chain
  it('Challenge 12: Triple Chain - 3 LEDs in series', () => {
    const simulator = new CircuitSimulator()

    const batteries = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const led1 = ComponentFactory.createLED(10)
    const led2 = ComponentFactory.createLED(11)
    const led3 = ComponentFactory.createLED(12)

    simulator.setComponents([...batteries, led1, led2, led3])
    const wires = batteries.slice(0, -1).map((b, i) => ({
      id: 20 + i,
      from: b.id,
      to: batteries[i + 1].id
    }))
    wires.push({ id: 30, from: batteries[batteries.length - 1].id, to: led1.id })
    wires.push({ id: 31, from: led1.id, to: led2.id })
    wires.push({ id: 32, from: led2.id, to: led3.id })
    simulator.setWires(wires)
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateTripleChain({
      components: simulator.components
    })

    expect(result.success).toBe(true)
  })

  // Challenge 17: Power Efficiency
  it('Challenge 17: Power Efficiency - 1 battery with optimal resistance', () => {
    const simulator = new CircuitSimulator()

    const battery = ComponentFactory.createBattery(1)
    const resistor = ComponentFactory.createResistor(2) // 100Ω resistor
    const led = ComponentFactory.createLED(3)

    simulator.setComponents([battery, resistor, led])
    simulator.setWires([
      { id: 4, from: 1, to: 2 },
      { id: 5, from: 2, to: 3 }
    ])
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateEfficiency({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    // With 100Ω resistor, 1 battery achieves ~0.04 brightness
    expect(led.brightness).toBeGreaterThan(0.03)
  })

  // Challenge 18: Maximum Brightness
  it('Challenge 18: Maximum Brightness - optimal LED power', () => {
    const simulator = new CircuitSimulator()

    // Optimal: 3 batteries + 100Ω resistor
    const batteries = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const resistor = ComponentFactory.createResistor(10) // 100Ω resistor
    const led = ComponentFactory.createLED(11)

    simulator.setComponents([...batteries, resistor, led])
    const wires = batteries.slice(0, -1).map((b, i) => ({
      id: 20 + i,
      from: b.id,
      to: batteries[i + 1].id
    }))
    wires.push({ id: 30, from: batteries[batteries.length - 1].id, to: resistor.id })
    wires.push({ id: 31, from: resistor.id, to: led.id })
    simulator.setWires(wires)
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateMaxBright({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    // With 100Ω resistor, 3 batteries achieve ~0.36 brightness
    expect(led.brightness).toBeGreaterThan(0.3)
    expect(led.brightness).toBeLessThan(0.95)
  })

  // Challenge 5: Battery Blues - bulb lit for 30s (timed challenge)
  it('Challenge 5: Battery Blues - bulb bright enough', () => {
    const simulator = new CircuitSimulator()

    const batteries = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const bulb = ComponentFactory.createLightBulb(10)

    simulator.setComponents([...batteries, bulb])
    const wires = batteries.slice(0, -1).map((b, i) => ({
      id: 20 + i,
      from: b.id,
      to: batteries[i + 1].id
    }))
    wires.push({ id: 30, from: batteries[batteries.length - 1].id, to: bulb.id })
    simulator.setWires(wires)
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateBatteryBlues({
      components: simulator.components
    })

    // Returns tracking: true for timed challenges
    expect(result.tracking).toBe(true)
    expect(bulb.brightness).toBeGreaterThan(0.2)
  })

  // Challenge 6: Parallel Power - 4+ batteries with bulb (60s timed)
  it('Challenge 6: Parallel Power - series batteries for bulb', () => {
    const simulator = new CircuitSimulator()

    // 6 batteries in series to power bulb for 60s challenge
    const batteries = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const bulb = ComponentFactory.createLightBulb(10)

    simulator.setComponents([...batteries, bulb])
    const wires = batteries.slice(0, -1).map((b, i) => ({
      id: 20 + i,
      from: b.id,
      to: batteries[i + 1].id
    }))
    wires.push({ id: 30, from: batteries[batteries.length - 1].id, to: bulb.id })
    simulator.setWires(wires)
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateParallelPower({
      components: simulator.components
    })

    expect(result.tracking).toBe(true)
    expect(bulb.brightness).toBeGreaterThan(0.2)
  })

  // Challenge 13: LED Array - 3x3 grid of 9 LEDs
  it('Challenge 13: LED Array - 3x3 grid of 9 LEDs', () => {
    const simulator = new CircuitSimulator()

    // Need lots of batteries (9+ for 9 LEDs)
    const batteries = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const leds = Array.from({ length: 9 }, (_, i) => ({
      id: 20 + i,
      type: 'led',
      brightness: 0
    }))

    simulator.setComponents([...batteries, ...leds])

    // Wire batteries in series
    const wires = batteries.slice(0, -1).map((b, i) => ({
      id: 50 + i,
      from: b.id,
      to: batteries[i + 1].id
    }))

    // Wire LEDs in parallel from last battery
    leds.forEach((led, i) => {
      wires.push({ id: 100 + i, from: batteries[batteries.length - 1].id, to: led.id })
    })

    simulator.setWires(wires)
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateLEDArray({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    const litLEDs = leds.filter(led => led.brightness >= 0.05)
    expect(litLEDs.length).toBeGreaterThanOrEqual(9)
  })

  // Challenge 14: Voltage Divider - 2 resistors in series with LED
  it('Challenge 14: Voltage Divider - resistor voltage division', () => {
    const simulator = new CircuitSimulator()

    // Need 3+ batteries for LED brightness >= 0.05
    const batteries = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const resistor1 = ComponentFactory.createResistor(10)
    const resistor2 = ComponentFactory.createResistor(11)
    const led = ComponentFactory.createLED(12)

    simulator.setComponents([...batteries, resistor1, resistor2, led])
    const wires = batteries.slice(0, -1).map((b, i) => ({
      id: 20 + i,
      from: b.id,
      to: batteries[i + 1].id
    }))
    wires.push({ id: 30, from: batteries[batteries.length - 1].id, to: resistor1.id })
    wires.push({ id: 31, from: resistor1.id, to: resistor2.id })
    wires.push({ id: 32, from: resistor2.id, to: led.id })
    simulator.setWires(wires)
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateVoltageDivide({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(led.brightness).toBeGreaterThanOrEqual(0.05)
  })

  // Challenge 16: RC Timing - capacitor + resistor + LED
  it('Challenge 16: RC Timing - capacitor discharge timing', () => {
    const simulator = new CircuitSimulator()

    // Need 4+ batteries for capacitor voltage >= 1.0
    const batteries = Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const capacitor = ComponentFactory.createCapacitor(10)
    const resistor = ComponentFactory.createResistor(11)
    const led = ComponentFactory.createLED(12)

    simulator.setComponents([...batteries, capacitor, resistor, led])
    const wires = batteries.slice(0, -1).map((b, i) => ({
      id: 20 + i,
      from: b.id,
      to: batteries[i + 1].id
    }))
    wires.push({ id: 30, from: batteries[batteries.length - 1].id, to: capacitor.id })
    wires.push({ id: 31, from: batteries[batteries.length - 1].id, to: resistor.id })
    wires.push({ id: 32, from: resistor.id, to: led.id })
    simulator.setWires(wires)

    // Charge capacitor - 100mF caps need more time to charge
    for (let i = 0; i < 100; i++) {
      simulator.simulate(0.1)
    }

    const result = ChallengeValidators.validateRCTiming({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(capacitor.voltage).toBeGreaterThan(1.0)
  })

  // Challenge 19: Battery Bank - 3x3 battery bank (9 batteries)
  it('Challenge 19: Battery Bank - 3x3 battery bank powers LED', () => {
    const simulator = new CircuitSimulator()

    // 3 series chains of 3 batteries each, in parallel
    const batteries = Array.from({ length: 9 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const led = ComponentFactory.createLED(20)

    simulator.setComponents([...batteries, led])

    // Wire 3 chains of 3 batteries
    const wires = [
      // Chain 1: batteries 1,2,3
      { id: 30, from: 1, to: 2 },
      { id: 31, from: 2, to: 3 },
      // Chain 2: batteries 4,5,6
      { id: 32, from: 4, to: 5 },
      { id: 33, from: 5, to: 6 },
      // Chain 3: batteries 7,8,9
      { id: 34, from: 7, to: 8 },
      { id: 35, from: 8, to: 9 },
      // Connect all chains to LED in parallel
      { id: 40, from: 3, to: 20 },
      { id: 41, from: 6, to: 20 },
      { id: 42, from: 9, to: 20 }
    ]

    simulator.setWires(wires)
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateBatteryBank({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(led.brightness).toBeGreaterThan(0.1)
  })

  // Challenge 15: Endurance - 2 LEDs lit for 90s (timed)
  it('Challenge 15: Endurance - 2 LEDs stay lit', () => {
    const simulator = new CircuitSimulator()

    const batteries = Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const led1 = ComponentFactory.createLED(10)
    const led2 = ComponentFactory.createLED(11)

    simulator.setComponents([...batteries, led1, led2])
    const wires = batteries.slice(0, -1).map((b, i) => ({
      id: 20 + i,
      from: b.id,
      to: batteries[i + 1].id
    }))
    wires.push({ id: 30, from: batteries[batteries.length - 1].id, to: led1.id })
    wires.push({ id: 31, from: batteries[batteries.length - 1].id, to: led2.id })
    simulator.setWires(wires)
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateEndurance({
      components: simulator.components
    })

    expect(result.tracking).toBe(true)
    expect(led1.brightness).toBeGreaterThan(0.1)
    expect(led2.brightness).toBeGreaterThan(0.1)
  })

  // Challenge 20: Marathon - bulb lit for 2 minutes (6+ batteries)
  it('Challenge 20: Marathon - bulb with 6+ batteries', () => {
    const simulator = new CircuitSimulator()

    const batteries = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const bulb = ComponentFactory.createLightBulb(10)

    simulator.setComponents([...batteries, bulb])
    const wires = batteries.slice(0, -1).map((b, i) => ({
      id: 20 + i,
      from: b.id,
      to: batteries[i + 1].id
    }))
    wires.push({ id: 30, from: batteries[batteries.length - 1].id, to: bulb.id })
    simulator.setWires(wires)
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateMarathon({
      components: simulator.components
    })

    expect(result.tracking).toBe(true)
    expect(bulb.brightness).toBeGreaterThan(0.2)
  })

  // Challenge 21: Dual Power - LED + bulb both lit
  it('Challenge 21: Dual Power - LED and bulb from same source', () => {
    const simulator = new CircuitSimulator()

    const batteries = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const led = ComponentFactory.createLED(10)
    const bulb = ComponentFactory.createLightBulb(11)

    simulator.setComponents([...batteries, led, bulb])
    const wires = batteries.slice(0, -1).map((b, i) => ({
      id: 20 + i,
      from: b.id,
      to: batteries[i + 1].id
    }))
    wires.push({ id: 30, from: batteries[batteries.length - 1].id, to: led.id })
    wires.push({ id: 31, from: batteries[batteries.length - 1].id, to: bulb.id })
    simulator.setWires(wires)
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateDualPower({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(led.brightness).toBeGreaterThan(0.1)
    expect(bulb.brightness).toBeGreaterThan(0.2)
  })

  // Challenge 22: Capacitor Network - 2 parallel capacitors (same as Challenge 10)
  it('Challenge 22: Capacitor Network - parallel capacitors', () => {
    const simulator = new CircuitSimulator()

    const battery1 = ComponentFactory.createBattery(1)
    const battery2 = ComponentFactory.createBattery(2)
    const cap1 = ComponentFactory.createCapacitor(3)
    const cap2 = ComponentFactory.createCapacitor(4)

    simulator.setComponents([battery1, battery2, cap1, cap2])
    simulator.setWires([
      { id: 6, from: 1, to: 2 },
      { id: 7, from: 2, to: 3 },  // Battery -> Cap1
      { id: 8, from: 2, to: 4 }   // Battery -> Cap2 (parallel)
    ])

    for (let i = 0; i < 50; i++) {
      simulator.simulate(0.1)
    }

    const result = ChallengeValidators.validateCapNetwork({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(cap1.voltage).toBeGreaterThan(1.5)
    expect(cap2.voltage).toBeGreaterThan(1.5)
  })

  // Challenge 23: Series Capacitors - 2 caps in series
  it('Challenge 23: Series Capacitors - capacitors in series', () => {
    const simulator = new CircuitSimulator()

    const battery1 = ComponentFactory.createBattery(1)
    const battery2 = ComponentFactory.createBattery(2)
    const cap1 = ComponentFactory.createCapacitor(3)
    const cap2 = ComponentFactory.createCapacitor(4)

    simulator.setComponents([battery1, battery2, cap1, cap2])
    simulator.setWires([
      { id: 6, from: 1, to: 2 },
      { id: 7, from: 2, to: 3 },  // Battery -> Cap1
      { id: 8, from: 3, to: 4 }   // Cap1 -> Cap2 (series)
    ])

    for (let i = 0; i < 10; i++) {
      simulator.simulate(0.1)
    }

    const result = ChallengeValidators.validateSeriesCaps({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(cap1.voltage).toBeGreaterThan(0.5)
    expect(cap2.voltage).toBeGreaterThan(0.5)
  })

  // Challenge 24: Mixed Load - 3 LEDs (2 series + 1 parallel)
  it('Challenge 24: Mixed Load - series and parallel LEDs', () => {
    const simulator = new CircuitSimulator()

    const batteries = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const led1 = ComponentFactory.createLED(10)
    const led2 = ComponentFactory.createLED(11)
    const led3 = ComponentFactory.createLED(12)

    simulator.setComponents([...batteries, led1, led2, led3])
    const wires = batteries.slice(0, -1).map((b, i) => ({
      id: 20 + i,
      from: b.id,
      to: batteries[i + 1].id
    }))
    // Series chain: LED1 -> LED2
    wires.push({ id: 30, from: batteries[batteries.length - 1].id, to: led1.id })
    wires.push({ id: 31, from: led1.id, to: led2.id })
    // Parallel: LED3
    wires.push({ id: 32, from: batteries[batteries.length - 1].id, to: led3.id })
    simulator.setWires(wires)
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateMixedLoad({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(led1.brightness).toBeGreaterThan(0.05)
    expect(led2.brightness).toBeGreaterThan(0.05)
    expect(led3.brightness).toBeGreaterThan(0.05)
  })

  // Challenge 25: Resistor Ladder - 3 resistors in series
  it('Challenge 25: Resistor Ladder - 3 series resistors with LED', () => {
    const simulator = new CircuitSimulator()

    const battery1 = ComponentFactory.createBattery(1)
    const battery2 = ComponentFactory.createBattery(2)
    const battery3 = ComponentFactory.createBattery(3)
    const resistor1 = ComponentFactory.createResistor(4)
    const resistor2 = ComponentFactory.createResistor(5)
    const resistor3 = ComponentFactory.createResistor(6)
    const led = ComponentFactory.createLED(7)

    simulator.setComponents([battery1, battery2, battery3, resistor1, resistor2, resistor3, led])
    simulator.setWires([
      { id: 10, from: 1, to: 2 },
      { id: 11, from: 2, to: 3 },
      { id: 12, from: 3, to: 4 },
      { id: 13, from: 4, to: 5 },
      { id: 14, from: 5, to: 6 },
      { id: 15, from: 6, to: 7 }
    ])
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateResistorLadder({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(resistor1.current).toBeGreaterThan(0.001)
    expect(resistor2.current).toBeGreaterThan(0.001)
    expect(resistor3.current).toBeGreaterThan(0.001)
  })

  // Challenge 26: Power Distribution - 3 parallel LEDs
  it('Challenge 26: Power Distribution - 3 parallel LED branches', () => {
    const simulator = new CircuitSimulator()

    const batteries = Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const led1 = ComponentFactory.createLED(10)
    const led2 = ComponentFactory.createLED(11)
    const led3 = ComponentFactory.createLED(12)

    simulator.setComponents([...batteries, led1, led2, led3])
    const wires = batteries.slice(0, -1).map((b, i) => ({
      id: 20 + i,
      from: b.id,
      to: batteries[i + 1].id
    }))
    wires.push({ id: 30, from: batteries[batteries.length - 1].id, to: led1.id })
    wires.push({ id: 31, from: batteries[batteries.length - 1].id, to: led2.id })
    wires.push({ id: 32, from: batteries[batteries.length - 1].id, to: led3.id })
    simulator.setWires(wires)
    simulator.simulate(0.1)

    const result = ChallengeValidators.validatePowerDist({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    expect(led1.brightness).toBeGreaterThan(0.1)
    expect(led2.brightness).toBeGreaterThan(0.1)
    expect(led3.brightness).toBeGreaterThan(0.1)
  })

  // Challenge 27: Sustained Flash - batteries + capacitors + bulb (timed)
  it('Challenge 27: Sustained Flash - batteries and capacitors power bulb', () => {
    const simulator = new CircuitSimulator()

    const batteries = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const cap1 = ComponentFactory.createCapacitor(10)
    const cap2 = ComponentFactory.createCapacitor(11)
    const bulb = ComponentFactory.createLightBulb(12)

    simulator.setComponents([...batteries, cap1, cap2, bulb])
    const wires = batteries.slice(0, -1).map((b, i) => ({
      id: 20 + i,
      from: b.id,
      to: batteries[i + 1].id
    }))
    wires.push({ id: 30, from: batteries[batteries.length - 1].id, to: cap1.id })
    wires.push({ id: 31, from: batteries[batteries.length - 1].id, to: cap2.id })
    wires.push({ id: 32, from: batteries[batteries.length - 1].id, to: bulb.id })
    simulator.setWires(wires)

    for (let i = 0; i < 10; i++) {
      simulator.simulate(0.1)
    }

    const result = ChallengeValidators.validateSustainedFlash({
      components: simulator.components
    })

    expect(result.tracking).toBe(true)
    expect(bulb.brightness).toBeGreaterThan(0.2)
  })

  // Challenge 28: Efficiency Master - 3 LEDs with EXACTLY 3 batteries (timed)
  it('Challenge 28: Efficiency Master - 3 LEDs on 3 batteries', () => {
    const simulator = new CircuitSimulator()

    const batteries = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const led1 = ComponentFactory.createLED(10)
    const led2 = ComponentFactory.createLED(11)
    const led3 = ComponentFactory.createLED(12)

    simulator.setComponents([...batteries, led1, led2, led3])
    const wires = batteries.slice(0, -1).map((b, i) => ({
      id: 20 + i,
      from: b.id,
      to: batteries[i + 1].id
    }))
    wires.push({ id: 30, from: batteries[batteries.length - 1].id, to: led1.id })
    wires.push({ id: 31, from: batteries[batteries.length - 1].id, to: led2.id })
    wires.push({ id: 32, from: batteries[batteries.length - 1].id, to: led3.id })
    simulator.setWires(wires)
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateEfficiencyMaster({
      components: simulator.components
    })

    expect(result.tracking).toBe(true)
    expect(led1.brightness).toBeGreaterThan(0.1)
    expect(led2.brightness).toBeGreaterThan(0.1)
    expect(led3.brightness).toBeGreaterThan(0.1)
  })

  // Challenge 29: Grand Circuit - everything combined (60s timed)
  it('Challenge 29: Grand Circuit - LED + bulb + resistor + capacitor', () => {
    const simulator = new CircuitSimulator()

    const batteries = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const led = { id: 10, type: 'led', brightness: 0 }
    const bulb = { id: 11, type: 'lightbulb', brightness: 0 }
    const resistor = ComponentFactory.createResistor(12)
    const capacitor = ComponentFactory.createCapacitor(13)

    simulator.setComponents([...batteries, led, bulb, resistor, capacitor])
    const wires = batteries.slice(0, -1).map((b, i) => ({
      id: 20 + i,
      from: b.id,
      to: batteries[i + 1].id
    }))
    wires.push({ id: 30, from: batteries[batteries.length - 1].id, to: resistor.id })
    wires.push({ id: 31, from: resistor.id, to: led.id })
    wires.push({ id: 32, from: batteries[batteries.length - 1].id, to: bulb.id })
    wires.push({ id: 33, from: batteries[batteries.length - 1].id, to: capacitor.id })
    simulator.setWires(wires)

    for (let i = 0; i < 50; i++) {
      simulator.simulate(0.1)
    }

    const result = ChallengeValidators.validateGrandCircuit({
      components: simulator.components
    })

    // Challenge 29 is timed - validator returns tracking: true when circuit is ready
    expect(result.tracking).toBe(true)
    expect(led.brightness).toBeGreaterThan(0.1)
    expect(bulb.brightness).toBeGreaterThan(0.2)
    expect(capacitor.voltage).toBeGreaterThan(1.0)
  })

  // Challenge 30: Master Inventor - 5+ lit components
  it('Challenge 30: Master Inventor - 5+ lit LEDs and bulbs', () => {
    const simulator = new CircuitSimulator()

    const batteries = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      type: 'battery',
      charge: 1.0,
      voltage: 0.9
    }))
    const leds = Array.from({ length: 3 }, (_, i) => ({
      id: 20 + i,
      type: 'led',
      brightness: 0
    }))
    const bulbs = Array.from({ length: 2 }, (_, i) => ({
      id: 30 + i,
      type: 'lightbulb',
      brightness: 0
    }))

    simulator.setComponents([...batteries, ...leds, ...bulbs])
    const wires = batteries.slice(0, -1).map((b, i) => ({
      id: 50 + i,
      from: b.id,
      to: batteries[i + 1].id
    }))
    // Wire all LEDs and bulbs in parallel
    leds.forEach((led, i) => {
      wires.push({ id: 100 + i, from: batteries[batteries.length - 1].id, to: led.id })
    })
    bulbs.forEach((bulb, i) => {
      wires.push({ id: 110 + i, from: batteries[batteries.length - 1].id, to: bulb.id })
    })
    simulator.setWires(wires)
    simulator.simulate(0.1)

    const result = ChallengeValidators.validateMasterInventor({
      components: simulator.components
    })

    expect(result.success).toBe(true)
    const litLEDs = leds.filter(led => led.brightness >= 0.1)
    const litBulbs = bulbs.filter(bulb => bulb.brightness >= 0.2)
    expect(litLEDs.length + litBulbs.length).toBeGreaterThanOrEqual(5)
  })
})
