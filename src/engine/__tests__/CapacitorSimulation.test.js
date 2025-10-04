/**
 * CapacitorSimulation.test.js - Unit tests for RC circuit simulation
 *
 * Tests capacitor charging/discharging behavior:
 * - RC time constants (τ = R × C)
 * - Exponential charging: V(t) = Vs × (1 - e^(-t/τ))
 * - Exponential discharge: V(t) = V0 × e^(-t/τ)
 * - Battery drain during charging
 * - Leakage current when disconnected
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { simulateCapacitors } from '../CapacitorSimulation.js'

describe('CapacitorSimulation', () => {
  describe('Initialization', () => {
    it('should initialize capacitor voltage to 0 if undefined', () => {
      const capacitor = { type: 'capacitor', capacitance: 0.001 }
      const components = [capacitor]
      const wires = []
      const findConnectedComponents = () => [capacitor]

      simulateCapacitors(components, wires, 0.1, findConnectedComponents)

      expect(capacitor.voltage).toBe(0)
    })

    it('should not overwrite existing capacitor voltage', () => {
      const capacitor = { type: 'capacitor', capacitance: 0.001, voltage: 5.0 }
      const components = [capacitor]
      const wires = []
      const findConnectedComponents = () => [capacitor]

      simulateCapacitors(components, wires, 0.1, findConnectedComponents)

      expect(capacitor.voltage).toBeGreaterThan(0) // Leakage might reduce it slightly
    })
  })

  describe('Charging Behavior', () => {
    it('should charge capacitor when connected to battery', () => {
      const battery = { type: 'battery', voltage: 3.0, charge: 1.0 }
      const capacitor = { type: 'capacitor', capacitance: 0.001, voltage: 0 }
      const components = [battery, capacitor]
      const wires = [{ from: 1, to: 2 }]
      const findConnectedComponents = () => [battery, capacitor]

      // Simulate charging for 1 second (multiple steps)
      for (let i = 0; i < 10; i++) {
        simulateCapacitors(components, wires, 0.1, findConnectedComponents)
      }

      expect(capacitor.voltage).toBeGreaterThan(0)
      expect(capacitor.voltage).toBeLessThanOrEqual(3.0)
    })

    it('should follow exponential charging curve (RC time constant)', () => {
      const battery = { type: 'battery', voltage: 3.0, charge: 1.0 }
      const resistor = { type: 'resistor', resistance: 100 }
      const capacitor = { type: 'capacitor', capacitance: 0.01, voltage: 0 }
      const components = [battery, resistor, capacitor]
      const wires = []
      const findConnectedComponents = () => [battery, resistor, capacitor]

      // RC time constant: τ = R × C = 100Ω × 0.01F = 1 second
      // After 1τ: V ≈ 63.2% of Vs
      // After 2τ: V ≈ 86.5% of Vs

      // Simulate for 1 time constant (1 second)
      for (let i = 0; i < 10; i++) {
        simulateCapacitors(components, wires, 0.1, findConnectedComponents)
      }

      // Should be around 63% charged
      expect(capacitor.voltage).toBeGreaterThan(1.5) // > 50%
      expect(capacitor.voltage).toBeLessThan(2.4)    // < 80%
    })

    it('should drain battery during charging', () => {
      const battery = { type: 'battery', voltage: 3.0, charge: 1.0 }
      const capacitor = { type: 'capacitor', capacitance: 0.001, voltage: 0 }
      const components = [battery, capacitor]
      const wires = []
      const findConnectedComponents = () => [battery, capacitor]

      // Simulate charging
      for (let i = 0; i < 50; i++) {
        simulateCapacitors(components, wires, 0.1, findConnectedComponents)
      }

      expect(battery.charge).toBeLessThan(1.0)
      expect(battery.charge).toBeGreaterThan(0)
    })

    it('should not charge from depleted battery', () => {
      const battery = { type: 'battery', voltage: 3.0, charge: 0 }  // Depleted
      const capacitor = { type: 'capacitor', capacitance: 0.001, voltage: 0 }
      const components = [battery, capacitor]
      const wires = []
      const findConnectedComponents = () => [battery, capacitor]

      simulateCapacitors(components, wires, 0.1, findConnectedComponents)

      expect(capacitor.voltage).toBe(0)
    })

    it('should sum voltage from multiple batteries', () => {
      const battery1 = { type: 'battery', voltage: 1.5, charge: 1.0 }
      const battery2 = { type: 'battery', voltage: 1.5, charge: 1.0 }
      const capacitor = { type: 'capacitor', capacitance: 0.001, voltage: 0 }
      const components = [battery1, battery2, capacitor]
      const wires = []
      const findConnectedComponents = () => [battery1, battery2, capacitor]

      // Charge for 1 second
      for (let i = 0; i < 10; i++) {
        simulateCapacitors(components, wires, 0.1, findConnectedComponents)
      }

      // Should charge to sum of battery voltages (3.0V)
      expect(capacitor.voltage).toBeGreaterThan(2.0)
    })

    it('should use default 10Ω wire resistance when no resistors present', () => {
      const battery = { type: 'battery', voltage: 3.0, charge: 1.0 }
      const capacitor = { type: 'capacitor', capacitance: 0.001, voltage: 0 }
      const components = [battery, capacitor]
      const wires = []
      const findConnectedComponents = () => [battery, capacitor]

      // With 10Ω resistance and 0.001F capacitance: τ = 0.01s
      simulateCapacitors(components, wires, 0.01, findConnectedComponents)

      // After 1τ, should be ~63% charged
      expect(capacitor.voltage).toBeGreaterThan(1.5)
    })
  })

  describe('Discharging Through Resistor', () => {
    it('should discharge when connected to resistor (no battery)', () => {
      const resistor = { type: 'resistor', resistance: 100 }
      const capacitor = { type: 'capacitor', capacitance: 0.001, voltage: 3.0 }
      const components = [resistor, capacitor]
      const wires = []
      const findConnectedComponents = () => [resistor, capacitor]

      simulateCapacitors(components, wires, 0.1, findConnectedComponents)

      expect(capacitor.voltage).toBeLessThan(3.0)
      expect(capacitor.voltage).toBeGreaterThan(0)
    })

    it('should follow exponential discharge curve', () => {
      const resistor = { type: 'resistor', resistance: 100 }
      const capacitor = { type: 'capacitor', capacitance: 0.01, voltage: 3.0 }
      const components = [resistor, capacitor]
      const wires = []
      const findConnectedComponents = () => [resistor, capacitor]

      // RC time constant: τ = 100Ω × 0.01F = 1s
      // After 1τ: V ≈ 36.8% of V0 (1/e)
      for (let i = 0; i < 10; i++) {
        simulateCapacitors(components, wires, 0.1, findConnectedComponents)
      }

      // Should be around 37% of original (3.0 × 0.368 ≈ 1.1V)
      expect(capacitor.voltage).toBeGreaterThan(0.9)
      expect(capacitor.voltage).toBeLessThan(1.5)
    })

    it('should discharge faster with lower resistance', () => {
      const resistor1 = { type: 'resistor', resistance: 10 }  // Low R
      const capacitor1 = { type: 'capacitor', capacitance: 0.001, voltage: 3.0 }
      const components1 = [resistor1, capacitor1]
      const findConnectedComponents1 = () => [resistor1, capacitor1]

      const resistor2 = { type: 'resistor', resistance: 1000 }  // High R
      const capacitor2 = { type: 'capacitor', capacitance: 0.001, voltage: 3.0 }
      const components2 = [resistor2, capacitor2]
      const findConnectedComponents2 = () => [resistor2, capacitor2]

      // Simulate same time for both
      simulateCapacitors(components1, [], 0.1, findConnectedComponents1)
      simulateCapacitors(components2, [], 0.1, findConnectedComponents2)

      // Lower resistance should discharge faster
      expect(capacitor1.voltage).toBeLessThan(capacitor2.voltage)
    })
  })

  describe('Self-Discharge (Leakage)', () => {
    it('should slowly discharge when disconnected (leakage current)', () => {
      const capacitor = { type: 'capacitor', capacitance: 0.001, voltage: 3.0 }
      const components = [capacitor]
      const wires = []
      const findConnectedComponents = () => [capacitor]

      const initialVoltage = capacitor.voltage
      simulateCapacitors(components, wires, 1.0, findConnectedComponents)

      // Should discharge, but very slowly (10MΩ leakage resistance)
      expect(capacitor.voltage).toBeLessThan(initialVoltage)
      expect(capacitor.voltage).toBeGreaterThan(initialVoltage * 0.99)
    })

    it('should discharge very slowly with high leakage resistance', () => {
      const capacitor = { type: 'capacitor', capacitance: 0.1, voltage: 5.0 }
      const components = [capacitor]
      const wires = []
      const findConnectedComponents = () => [capacitor]

      // Leakage time constant: τ = 10MΩ × 0.1F = 1000 seconds
      // After 1 second, should barely discharge
      simulateCapacitors(components, wires, 1.0, findConnectedComponents)

      expect(capacitor.voltage).toBeGreaterThan(4.99)
    })
  })

  describe('Voltage Clamping', () => {
    it('should clamp voltage to maxVoltage rating', () => {
      const battery = { type: 'battery', voltage: 15.0, charge: 1.0 }
      const capacitor = {
        type: 'capacitor',
        capacitance: 0.001,
        voltage: 0,
        maxVoltage: 10.0
      }
      const components = [battery, capacitor]
      const wires = []
      const findConnectedComponents = () => [battery, capacitor]

      // Charge fully
      for (let i = 0; i < 100; i++) {
        simulateCapacitors(components, wires, 0.1, findConnectedComponents)
      }

      expect(capacitor.voltage).toBeLessThanOrEqual(10.0)
    })

    it('should not allow negative voltage', () => {
      const capacitor = { type: 'capacitor', capacitance: 0.001, voltage: -1.0 }
      const components = [capacitor]
      const wires = []
      const findConnectedComponents = () => [capacitor]

      simulateCapacitors(components, wires, 0.1, findConnectedComponents)

      expect(capacitor.voltage).toBeGreaterThanOrEqual(0)
    })

    it('should use default 10V maxVoltage if not specified', () => {
      const battery = { type: 'battery', voltage: 20.0, charge: 1.0 }
      const capacitor = { type: 'capacitor', capacitance: 0.001, voltage: 0 }
      const components = [battery, capacitor]
      const wires = []
      const findConnectedComponents = () => [battery, capacitor]

      // Charge fully
      for (let i = 0; i < 100; i++) {
        simulateCapacitors(components, wires, 0.1, findConnectedComponents)
      }

      expect(capacitor.voltage).toBeLessThanOrEqual(10.0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle multiple capacitors independently', () => {
      const battery = { type: 'battery', voltage: 3.0, charge: 1.0 }
      const cap1 = { type: 'capacitor', capacitance: 0.001, voltage: 0 }
      const cap2 = { type: 'capacitor', capacitance: 0.001, voltage: 1.5 }
      const components = [battery, cap1, cap2]
      const wires = []

      let callCount = 0
      const findConnectedComponents = (component) => {
        callCount++
        if (component === cap1) return [battery, cap1]
        if (component === cap2) return [battery, cap2]
        return [component]
      }

      simulateCapacitors(components, wires, 0.1, findConnectedComponents)

      expect(cap1.voltage).toBeGreaterThan(0)
      expect(cap2.voltage).toBeGreaterThan(1.5)
      expect(callCount).toBeGreaterThan(0) // Verify callback was used
    })

    it('should handle zero deltaTime gracefully', () => {
      const battery = { type: 'battery', voltage: 3.0, charge: 1.0 }
      const capacitor = { type: 'capacitor', capacitance: 0.001, voltage: 0 }
      const components = [battery, capacitor]
      const wires = []
      const findConnectedComponents = () => [battery, capacitor]

      simulateCapacitors(components, wires, 0, findConnectedComponents)

      // No time passed, no change expected
      expect(capacitor.voltage).toBe(0)
    })

    it('should handle no components gracefully', () => {
      const components = []
      const wires = []
      const findConnectedComponents = () => []

      expect(() => {
        simulateCapacitors(components, wires, 0.1, findConnectedComponents)
      }).not.toThrow()
    })

    it('should use default capacitance if not specified', () => {
      const battery = { type: 'battery', voltage: 3.0, charge: 1.0 }
      const capacitor = { type: 'capacitor', voltage: 0 }  // No capacitance specified
      const components = [battery, capacitor]
      const wires = []
      const findConnectedComponents = () => [battery, capacitor]

      simulateCapacitors(components, wires, 0.1, findConnectedComponents)

      // Should use default 0.001F and charge up
      expect(capacitor.voltage).toBeGreaterThan(0)
    })
  })

  describe('RC Time Constant Physics', () => {
    it('should reach ~95% charge after 3 time constants', () => {
      const battery = { type: 'battery', voltage: 5.0, charge: 1.0 }
      const resistor = { type: 'resistor', resistance: 100 }
      const capacitor = { type: 'capacitor', capacitance: 0.01, voltage: 0 }
      const components = [battery, resistor, capacitor]
      const findConnectedComponents = () => [battery, resistor, capacitor]

      // τ = 100Ω × 0.01F = 1s
      // 3τ = 3 seconds
      for (let i = 0; i < 30; i++) {
        simulateCapacitors(components, [], 0.1, findConnectedComponents)
      }

      // After 3τ: V ≈ 95% of Vs (5.0 × 0.95 = 4.75V)
      expect(capacitor.voltage).toBeGreaterThan(4.5)
      expect(capacitor.voltage).toBeLessThan(5.0)
    })

    it('should discharge to ~5% after 3 time constants', () => {
      const resistor = { type: 'resistor', resistance: 100 }
      const capacitor = { type: 'capacitor', capacitance: 0.01, voltage: 5.0 }
      const components = [resistor, capacitor]
      const findConnectedComponents = () => [resistor, capacitor]

      // τ = 100Ω × 0.01F = 1s
      // 3τ = 3 seconds
      for (let i = 0; i < 30; i++) {
        simulateCapacitors(components, [], 0.1, findConnectedComponents)
      }

      // After 3τ: V ≈ 5% of V0 (5.0 × 0.05 = 0.25V)
      expect(capacitor.voltage).toBeLessThan(0.5)
      expect(capacitor.voltage).toBeGreaterThan(0.1)
    })

    it('should demonstrate RC charging/discharging symmetry', () => {
      const battery = { type: 'battery', voltage: 3.0, charge: 1.0 }
      const resistor = { type: 'resistor', resistance: 100 }
      const capacitor = { type: 'capacitor', capacitance: 0.01, voltage: 0 }
      const components = [battery, resistor, capacitor]
      const findConnectedComponents = () => [battery, resistor, capacitor]

      // Charge for 1τ
      for (let i = 0; i < 10; i++) {
        simulateCapacitors(components, [], 0.1, findConnectedComponents)
      }

      const chargedVoltage = capacitor.voltage
      expect(chargedVoltage).toBeGreaterThan(1.5) // ~63% of 3V

      // Now discharge (remove battery)
      const findConnectedComponents2 = () => [resistor, capacitor]
      for (let i = 0; i < 10; i++) {
        simulateCapacitors([resistor, capacitor], [], 0.1, findConnectedComponents2)
      }

      // After 1τ discharge, should be ~37% of charged voltage
      expect(capacitor.voltage).toBeLessThan(chargedVoltage * 0.5)
      expect(capacitor.voltage).toBeGreaterThan(chargedVoltage * 0.25)
    })
  })
})
