/**
 * CircuitSolver.test.js - Unit tests for LED and light bulb circuit simulation
 *
 * Tests the physics calculations for powering LEDs and bulbs:
 * - Ohm's law: I = V/R
 * - Power dissipation: P = I²R
 * - LED forward voltage threshold and brightness scaling
 * - Battery topology (series/parallel chains)
 * - Capacitor behavior (series vs parallel with LED)
 * - Battery and capacitor discharge rates
 */

import { describe, it, expect, vi } from 'vitest'
import { simulateCircuit, simulateLightBulb } from '../CircuitSolver.js'

describe('CircuitSolver - LED Simulation', () => {
  // Mock helper functions
  const createMockContext = (overrides = {}) => ({
    analyzeBatteryTopology: vi.fn(() => ({ seriesChains: [] })),
    isCapacitorInSeriesWithLED: vi.fn(() => false),
    findResistorsInPath: vi.fn(() => []),
    deltaTime: 1.0,
    ...overrides
  })

  describe('Basic LED Lighting', () => {
    it('should light LED with sufficient battery voltage', () => {
      const battery = { voltage: 3.0, charge: 1.0 }
      const led = { brightness: 0 }
      const circuit = { batteries: [battery], capacitors: [], led, totalLEDs: 1, isParallel: false }
      const context = createMockContext({
        analyzeBatteryTopology: vi.fn(() => ({
          seriesChains: [[battery]]
        }))
      })

      simulateCircuit(circuit, context)

      expect(led.brightness).toBeGreaterThan(0)
      expect(led.voltage).toBeGreaterThan(0)
      expect(led.current).toBeGreaterThan(0)
    })

    it('should not light LED with insufficient voltage (<0.5V)', () => {
      const battery = { voltage: 0.3, charge: 1.0 }
      const led = { brightness: 0 }
      const circuit = { batteries: [battery], capacitors: [], led, totalLEDs: 1, isParallel: false }
      const context = createMockContext({
        analyzeBatteryTopology: vi.fn(() => ({
          seriesChains: [[battery]]
        }))
      })

      simulateCircuit(circuit, context)

      expect(led.brightness).toBe(0)
      expect(led.voltage).toBeLessThan(0.5)
    })

    it('should not power LED from depleted battery', () => {
      const battery = { voltage: 3.0, charge: 0 }  // Depleted
      const led = { brightness: 0 }
      const circuit = { batteries: [battery], capacitors: [], led, totalLEDs: 1, isParallel: false }
      const context = createMockContext({
        analyzeBatteryTopology: vi.fn(() => ({
          seriesChains: [[battery]]
        }))
      })

      simulateCircuit(circuit, context)

      expect(led.brightness).toBe(0)
    })

    it('should calculate current using Ohms law (I = V/R)', () => {
      const battery = { voltage: 3.0, charge: 1.0 }
      const led = { brightness: 0 }
      const circuit = { batteries: [battery], capacitors: [], led, totalLEDs: 1, isParallel: false }
      const context = createMockContext({
        analyzeBatteryTopology: vi.fn(() => ({
          seriesChains: [[battery]]
        }))
      })

      simulateCircuit(circuit, context)

      // I = V/R = 3.0V / 100Ω = 0.03A, clamped to 0.02A (MAX_LED_CURRENT)
      expect(led.current).toBeCloseTo(0.02, 3)
    })

    it('should clamp current to MAX_LED_CURRENT (20mA)', () => {
      const battery = { voltage: 10.0, charge: 1.0 }
      const led = { brightness: 0 }
      const circuit = { batteries: [battery], capacitors: [], led, totalLEDs: 1, isParallel: false }
      const context = createMockContext({
        analyzeBatteryTopology: vi.fn(() => ({
          seriesChains: [[battery]]
        }))
      })

      simulateCircuit(circuit, context)

      expect(led.current).toBeLessThanOrEqual(0.02)
    })
  })

  describe('LED Forward Voltage Threshold', () => {
    it('should reduce brightness below LED forward voltage (2.0V)', () => {
      const battery1 = { voltage: 2.5, charge: 1.0 }
      const led1 = { brightness: 0 }
      const circuit1 = { batteries: [battery1], capacitors: [], led: led1, totalLEDs: 1, isParallel: false }

      const battery2 = { voltage: 1.5, charge: 1.0 }
      const led2 = { brightness: 0 }
      const circuit2 = { batteries: [battery2], capacitors: [], led: led2, totalLEDs: 1, isParallel: false }

      const context1 = createMockContext({
        analyzeBatteryTopology: vi.fn(() => ({ seriesChains: [[battery1]] }))
      })
      const context2 = createMockContext({
        analyzeBatteryTopology: vi.fn(() => ({ seriesChains: [[battery2]] }))
      })

      simulateCircuit(circuit1, context1)
      simulateCircuit(circuit2, context2)

      // LED2 with lower voltage should be dimmer
      expect(led2.brightness).toBeLessThan(led1.brightness)
    })

    it('should allow dim glow at low voltage', () => {
      const battery = { voltage: 1.0, charge: 1.0 }
      const led = { brightness: 0 }
      const circuit = { batteries: [battery], capacitors: [], led, totalLEDs: 1, isParallel: false }
      const context = createMockContext({
        analyzeBatteryTopology: vi.fn(() => ({ seriesChains: [[battery]] }))
      })

      simulateCircuit(circuit, context)

      expect(led.brightness).toBeGreaterThan(0)  // Dim glow
      expect(led.brightness).toBeLessThan(0.5)   // But not bright
    })
  })

  describe('Series Battery Configurations', () => {
    it('should sum voltage from series batteries', () => {
      const battery1 = { voltage: 1.5, charge: 1.0 }
      const battery2 = { voltage: 1.5, charge: 1.0 }
      const led = { brightness: 0 }
      const circuit = { batteries: [battery1, battery2], capacitors: [], led, totalLEDs: 1, isParallel: false }
      const context = createMockContext({
        analyzeBatteryTopology: vi.fn(() => ({
          seriesChains: [[battery1, battery2]]
        }))
      })

      simulateCircuit(circuit, context)

      // Total voltage = 1.5V + 1.5V = 3.0V
      expect(led.voltage).toBeGreaterThan(2.0)
    })

    it('should drain all series batteries at same rate', () => {
      const battery1 = { voltage: 1.5, charge: 1.0 }
      const battery2 = { voltage: 1.5, charge: 1.0 }
      const led = { brightness: 0 }
      const circuit = { batteries: [battery1, battery2], capacitors: [], led, totalLEDs: 1, isParallel: false }
      const context = createMockContext({
        analyzeBatteryTopology: vi.fn(() => ({
          seriesChains: [[battery1, battery2]]
        }))
      })

      simulateCircuit(circuit, context)

      // Both batteries should drain equally in series
      expect(battery1.charge).toBeLessThan(1.0)
      expect(battery2.charge).toBeLessThan(1.0)
    })
  })

  describe('Parallel Battery Configurations', () => {
    it('should use highest voltage chain for parallel batteries', () => {
      const battery1 = { voltage: 1.5, charge: 1.0 }  // Chain 1
      const battery2 = { voltage: 3.0, charge: 1.0 }  // Chain 2 (higher)
      const led = { brightness: 0 }
      const circuit = { batteries: [battery1, battery2], capacitors: [], led, totalLEDs: 1, isParallel: false }
      const context = createMockContext({
        analyzeBatteryTopology: vi.fn(() => ({
          seriesChains: [[battery1], [battery2]]
        }))
      })

      simulateCircuit(circuit, context)

      // Should use higher voltage (3.0V) for LED
      expect(led.voltage).toBeGreaterThan(2.0)
    })

    it('should distribute current based on chain voltage contribution', () => {
      const battery1 = { voltage: 1.5, charge: 1.0 }
      const battery2 = { voltage: 3.0, charge: 1.0 }
      const led = { brightness: 0 }
      const circuit = { batteries: [battery1, battery2], capacitors: [], led, totalLEDs: 1, isParallel: false }
      const context = createMockContext({
        analyzeBatteryTopology: vi.fn(() => ({
          seriesChains: [[battery1], [battery2]]
        }))
      })

      const initialCharge1 = battery1.charge
      const initialCharge2 = battery2.charge

      simulateCircuit(circuit, context)

      // Both should drain, but battery2 (higher voltage) drains more
      const drain1 = initialCharge1 - battery1.charge
      const drain2 = initialCharge2 - battery2.charge

      expect(drain2).toBeGreaterThan(drain1)
    })
  })

  describe('Capacitor Behavior', () => {
    it('should subtract series capacitor voltage from total', () => {
      const battery = { voltage: 5.0, charge: 1.0 }
      const capacitor = { voltage: 2.0, capacitance: 0.001 }
      const led = { brightness: 0 }
      const circuit = { batteries: [battery], capacitors: [capacitor], led, totalLEDs: 1, isParallel: false }
      const context = createMockContext({
        analyzeBatteryTopology: vi.fn(() => ({ seriesChains: [[battery]] })),
        isCapacitorInSeriesWithLED: vi.fn(() => true)  // Series
      })

      simulateCircuit(circuit, context)

      // Total voltage = 5.0V - 2.0V = 3.0V (series cap opposes battery)
      expect(led.voltage).toBeLessThan(5.0)
    })

    it('should add parallel capacitor voltage to total', () => {
      const battery = { voltage: 3.0, charge: 1.0 }
      const capacitor = { voltage: 1.0, capacitance: 0.001 }
      const led = { brightness: 0 }
      const circuit = { batteries: [battery], capacitors: [capacitor], led, totalLEDs: 1, isParallel: false }
      const context = createMockContext({
        analyzeBatteryTopology: vi.fn(() => ({ seriesChains: [[battery]] })),
        isCapacitorInSeriesWithLED: vi.fn(() => false)  // Parallel
      })

      simulateCircuit(circuit, context)

      // Total voltage = 3.0V + 1.0V = 4.0V (parallel cap adds)
      expect(led.voltage).toBeGreaterThan(3.0)
    })

    it('should power LED from capacitor alone (no battery)', () => {
      const capacitor = { voltage: 3.0, capacitance: 0.001 }
      const led = { brightness: 0 }
      const circuit = { batteries: [], capacitors: [capacitor], led, totalLEDs: 1, isParallel: false }
      const context = createMockContext()

      simulateCircuit(circuit, context)

      expect(led.brightness).toBeGreaterThan(0)
      expect(capacitor.voltage).toBeLessThan(3.0)  // Should discharge
    })

    it('should discharge capacitor when powering LED', () => {
      const capacitor = { voltage: 3.0, capacitance: 0.001 }
      const led = { brightness: 0 }
      const circuit = { batteries: [], capacitors: [capacitor], led, totalLEDs: 1, isParallel: false }
      const context = createMockContext({ deltaTime: 1.0 })

      const initialVoltage = capacitor.voltage
      simulateCircuit(circuit, context)

      expect(capacitor.voltage).toBeLessThan(initialVoltage)
    })
  })

  describe('Resistor Effects', () => {
    it('should reduce LED voltage when resistor in path', () => {
      const battery = { voltage: 5.0, charge: 1.0 }
      const resistor = { resistance: 200, voltageDrop: 0, current: 0 }
      const led = { brightness: 0 }
      const circuit = { batteries: [battery], capacitors: [], led, totalLEDs: 1, isParallel: false }
      const context = createMockContext({
        analyzeBatteryTopology: vi.fn(() => ({ seriesChains: [[battery]] })),
        findResistorsInPath: vi.fn(() => [resistor])
      })

      simulateCircuit(circuit, context)

      // Resistor should drop some voltage
      expect(resistor.voltageDrop).toBeGreaterThan(0)
      expect(led.voltage).toBeLessThan(battery.voltage)
    })

    it('should calculate resistor voltage drop (V = IR)', () => {
      const battery = { voltage: 5.0, charge: 1.0 }
      const resistor = { resistance: 200, voltageDrop: 0, current: 0 }
      const led = { brightness: 0 }
      const circuit = { batteries: [battery], capacitors: [], led, totalLEDs: 1, isParallel: false }
      const context = createMockContext({
        analyzeBatteryTopology: vi.fn(() => ({ seriesChains: [[battery]] })),
        findResistorsInPath: vi.fn(() => [resistor])
      })

      simulateCircuit(circuit, context)

      // V = I × R
      expect(resistor.voltageDrop).toBeCloseTo(resistor.current * resistor.resistance, 2)
    })
  })

  describe('Series vs Parallel LEDs', () => {
    it('should divide voltage across series LEDs', () => {
      const battery = { voltage: 6.0, charge: 1.0 }
      const led = { brightness: 0 }
      const circuit = { batteries: [battery], capacitors: [], led, totalLEDs: 3, isParallel: false }
      const context = createMockContext({
        analyzeBatteryTopology: vi.fn(() => ({ seriesChains: [[battery]] }))
      })

      simulateCircuit(circuit, context)

      // Voltage divided by 3 LEDs
      expect(led.voltage).toBeLessThan(battery.voltage / 2)
    })

    it('should multiply current for parallel LEDs', () => {
      const battery = { voltage: 3.0, charge: 1.0 }
      const led = { brightness: 0 }
      const circuit = { batteries: [battery], capacitors: [], led, totalLEDs: 3, isParallel: true }
      const context = createMockContext({
        analyzeBatteryTopology: vi.fn(() => ({ seriesChains: [[battery]] }))
      })

      const initialCharge = battery.charge
      simulateCircuit(circuit, context)

      // Parallel LEDs draw more current (3x), so battery drains faster
      const drain = initialCharge - battery.charge
      expect(drain).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty batteries array', () => {
      const led = { brightness: 0 }
      const circuit = { batteries: [], capacitors: [], led, totalLEDs: 1, isParallel: false }
      const context = createMockContext()

      expect(() => simulateCircuit(circuit, context)).not.toThrow()
      expect(led.brightness).toBe(0)
    })

    it('should handle empty capacitors array', () => {
      const battery = { voltage: 3.0, charge: 1.0 }
      const led = { brightness: 0 }
      const circuit = { batteries: [battery], capacitors: [], led, totalLEDs: 1, isParallel: false }
      const context = createMockContext({
        analyzeBatteryTopology: vi.fn(() => ({ seriesChains: [[battery]] }))
      })

      expect(() => simulateCircuit(circuit, context)).not.toThrow()
      expect(led.brightness).toBeGreaterThan(0)
    })

    it('should clamp brightness to 0-1 range', () => {
      const battery = { voltage: 20.0, charge: 1.0 }
      const led = { brightness: 0 }
      const circuit = { batteries: [battery], capacitors: [], led, totalLEDs: 1, isParallel: false }
      const context = createMockContext({
        analyzeBatteryTopology: vi.fn(() => ({ seriesChains: [[battery]] }))
      })

      simulateCircuit(circuit, context)

      expect(led.brightness).toBeLessThanOrEqual(1.0)
      expect(led.brightness).toBeGreaterThanOrEqual(0)
    })
  })
})

describe('CircuitSolver - Light Bulb Simulation', () => {
  const createMockContext = (overrides = {}) => ({
    deltaTime: 1.0,
    ...overrides
  })

  describe('Basic Bulb Lighting', () => {
    it('should light bulb with sufficient voltage', () => {
      const battery = { voltage: 3.0, charge: 1.0 }
      const bulb = { brightness: 0, resistance: 50 }
      const circuit = { batteries: [battery], capacitors: [], bulb, batteryTopology: null }
      const context = createMockContext()

      simulateLightBulb(circuit, context)

      expect(bulb.brightness).toBeGreaterThan(0)
      expect(bulb.current).toBeGreaterThan(0)
      expect(bulb.power).toBeGreaterThan(0)
    })

    it('should not light bulb with insufficient voltage (<2.5V)', () => {
      const battery = { voltage: 2.0, charge: 1.0 }
      const bulb = { brightness: 0, resistance: 50 }
      const circuit = { batteries: [battery], capacitors: [], bulb, batteryTopology: null }
      const context = createMockContext()

      simulateLightBulb(circuit, context)

      expect(bulb.brightness).toBe(0)
    })

    it('should calculate current using Ohms law (I = V/R)', () => {
      const battery = { voltage: 5.0, charge: 1.0 }
      const bulb = { brightness: 0, resistance: 50 }
      const circuit = { batteries: [battery], capacitors: [], bulb, batteryTopology: null }
      const context = createMockContext()

      simulateLightBulb(circuit, context)

      // I = V/R = 5.0V / 50Ω = 0.1A
      expect(bulb.current).toBeCloseTo(0.1, 2)
    })

    it('should calculate power dissipation (P = I²R)', () => {
      const battery = { voltage: 5.0, charge: 1.0 }
      const bulb = { brightness: 0, resistance: 50 }
      const circuit = { batteries: [battery], capacitors: [], bulb, batteryTopology: null }
      const context = createMockContext()

      simulateLightBulb(circuit, context)

      // I = 5/50 = 0.1A, P = (0.1)² × 50 = 0.5W
      expect(bulb.power).toBeCloseTo(0.5, 2)
    })
  })

  describe('Brightness Scaling', () => {
    it('should scale brightness based on power (1W = full brightness)', () => {
      const battery1 = { voltage: 5.0, charge: 1.0 }
      const bulb1 = { brightness: 0, resistance: 50 }
      // P = (5/50)² × 50 = 0.5W → 50% brightness

      const battery2 = { voltage: 7.07, charge: 1.0 }
      const bulb2 = { brightness: 0, resistance: 50 }
      // P = (7.07/50)² × 50 ≈ 1.0W → 100% brightness

      simulateLightBulb({ batteries: [battery1], capacitors: [], bulb: bulb1 }, createMockContext())
      simulateLightBulb({ batteries: [battery2], capacitors: [], bulb: bulb2 }, createMockContext())

      expect(bulb1.brightness).toBeLessThan(bulb2.brightness)
      expect(bulb2.brightness).toBeCloseTo(1.0, 1)
    })

    it('should reduce brightness at low voltage (<4V)', () => {
      const battery1 = { voltage: 3.0, charge: 1.0 }
      const bulb1 = { brightness: 0, resistance: 50 }

      const battery2 = { voltage: 5.0, charge: 1.0 }
      const bulb2 = { brightness: 0, resistance: 50 }

      simulateLightBulb({ batteries: [battery1], capacitors: [], bulb: bulb1 }, createMockContext())
      simulateLightBulb({ batteries: [battery2], capacitors: [], bulb: bulb2 }, createMockContext())

      // Lower voltage should result in dimmer bulb
      expect(bulb1.brightness).toBeLessThan(bulb2.brightness)
    })

    it('should clamp brightness to 1.0 maximum', () => {
      const battery = { voltage: 20.0, charge: 1.0 }
      const bulb = { brightness: 0, resistance: 50 }
      const circuit = { batteries: [battery], capacitors: [], bulb, batteryTopology: null }
      const context = createMockContext()

      simulateLightBulb(circuit, context)

      expect(bulb.brightness).toBeLessThanOrEqual(1.0)
    })
  })

  describe('Battery Topology Support', () => {
    it('should use battery topology voltage if provided', () => {
      const battery = { voltage: 3.0, charge: 1.0 }
      const bulb = { brightness: 0, resistance: 50 }
      const batteryTopology = {
        voltage: 6.0,  // Analyzed topology voltage
        parallelCount: 2
      }
      const circuit = { batteries: [battery], capacitors: [], bulb, batteryTopology }
      const context = createMockContext()

      simulateLightBulb(circuit, context)

      expect(bulb.voltage).toBe(6.0)
    })

    it('should distribute current across parallel chains', () => {
      const battery1 = { voltage: 3.0, charge: 1.0 }
      const battery2 = { voltage: 3.0, charge: 1.0 }
      const bulb = { brightness: 0, resistance: 50 }
      const batteryTopology = {
        voltage: 3.0,
        parallelCount: 2  // 2 parallel chains
      }
      const circuit = { batteries: [battery1, battery2], capacitors: [], bulb, batteryTopology }
      const context = createMockContext()

      const initialCharge1 = battery1.charge
      const initialCharge2 = battery2.charge

      simulateLightBulb(circuit, context)

      // With parallel chains, each drains at half rate
      const drain1 = initialCharge1 - battery1.charge
      const drain2 = initialCharge2 - battery2.charge

      // Both should drain equally (parallel)
      expect(drain1).toBeCloseTo(drain2, 4)
    })
  })

  describe('Capacitor Support', () => {
    it('should add capacitor voltage to total', () => {
      const battery = { voltage: 3.0, charge: 1.0 }
      const capacitor = { voltage: 2.0, capacitance: 0.001 }
      const bulb = { brightness: 0, resistance: 50 }
      const circuit = { batteries: [battery], capacitors: [capacitor], bulb, batteryTopology: null }
      const context = createMockContext()

      simulateLightBulb(circuit, context)

      // Total voltage = 3.0 + 2.0 = 5.0V
      expect(bulb.voltage).toBe(5.0)
    })

    it('should discharge capacitor when powering bulb', () => {
      const capacitor = { voltage: 5.0, capacitance: 0.001 }
      const bulb = { brightness: 0, resistance: 50 }
      const circuit = { batteries: [], capacitors: [capacitor], bulb, batteryTopology: null }
      const context = createMockContext({ deltaTime: 1.0 })

      const initialVoltage = capacitor.voltage
      simulateLightBulb(circuit, context)

      expect(capacitor.voltage).toBeLessThan(initialVoltage)
    })
  })

  describe('Battery Drain', () => {
    it('should drain batteries when powering bulb', () => {
      const battery = { voltage: 5.0, charge: 1.0 }
      const bulb = { brightness: 0, resistance: 50 }
      const circuit = { batteries: [battery], capacitors: [], bulb, batteryTopology: null }
      const context = createMockContext()

      simulateLightBulb(circuit, context)

      expect(battery.charge).toBeLessThan(1.0)
    })

    it('should drain faster with higher current', () => {
      const battery1 = { voltage: 3.0, charge: 1.0 }
      const bulb1 = { brightness: 0, resistance: 50 }

      const battery2 = { voltage: 6.0, charge: 1.0 }
      const bulb2 = { brightness: 0, resistance: 50 }

      simulateLightBulb({ batteries: [battery1], capacitors: [], bulb: bulb1 }, createMockContext())
      simulateLightBulb({ batteries: [battery2], capacitors: [], bulb: bulb2 }, createMockContext())

      const drain1 = 1.0 - battery1.charge
      const drain2 = 1.0 - battery2.charge

      // Higher voltage → higher current → faster drain
      expect(drain2).toBeGreaterThan(drain1)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty batteries and capacitors', () => {
      const bulb = { brightness: 0, resistance: 50 }
      const circuit = { batteries: [], capacitors: [], bulb, batteryTopology: null }
      const context = createMockContext()

      expect(() => simulateLightBulb(circuit, context)).not.toThrow()
      expect(bulb.brightness).toBe(0)
    })

    it('should handle missing resistance (use default 50Ω)', () => {
      const battery = { voltage: 5.0, charge: 1.0 }
      const bulb = { brightness: 0 }  // No resistance specified
      const circuit = { batteries: [battery], capacitors: [], bulb, batteryTopology: null }
      const context = createMockContext()

      simulateLightBulb(circuit, context)

      expect(bulb.brightness).toBeGreaterThan(0)
    })

    it('should handle depleted battery', () => {
      const battery = { voltage: 5.0, charge: 0 }
      const bulb = { brightness: 0, resistance: 50 }
      const circuit = { batteries: [battery], capacitors: [], bulb, batteryTopology: null }
      const context = createMockContext()

      simulateLightBulb(circuit, context)

      expect(bulb.brightness).toBe(0)
    })

    it('should clamp brightness to 0-1 range', () => {
      const battery = { voltage: 20.0, charge: 1.0 }
      const bulb = { brightness: 0, resistance: 10 }  // Low resistance → high power
      const circuit = { batteries: [battery], capacitors: [], bulb, batteryTopology: null }
      const context = createMockContext()

      simulateLightBulb(circuit, context)

      expect(bulb.brightness).toBeLessThanOrEqual(1.0)
      expect(bulb.brightness).toBeGreaterThanOrEqual(0)
    })
  })
})
