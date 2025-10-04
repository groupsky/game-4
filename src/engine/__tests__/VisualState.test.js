/**
 * VisualState.test.js - Unit tests for component visual state calculations
 *
 * Tests non-anthropomorphic visual feedback:
 * - Battery charge bars and glow intensity
 * - LED brightness states and glow radius
 * - Resistor heat dissipation (P = I²R)
 * - Capacitor charge fill indicators
 * - Light bulb filament heat and brightness
 */

import { describe, it, expect } from 'vitest'
import {
  getBatteryVisualState,
  getLEDVisualState,
  getResistorVisualState,
  getCapacitorVisualState,
  getLightBulbVisualState
} from '../VisualState.js'

describe('VisualState', () => {
  describe('getBatteryVisualState', () => {
    it('should return "full" state for >75% charge', () => {
      const battery = { charge: 1.0 }
      const visual = getBatteryVisualState(battery)

      expect(visual.state).toBe('full')
      expect(visual.chargePercent).toBe(100)
      expect(visual.chargeBarFill).toBe(1.0)
      expect(visual.glowIntensity).toBe(0.5)
    })

    it('should return "medium" state for 50-75% charge', () => {
      const battery = { charge: 0.6 }
      const visual = getBatteryVisualState(battery)

      expect(visual.state).toBe('medium')
      expect(visual.chargePercent).toBe(60)
      expect(visual.chargeBarFill).toBe(0.6)
    })

    it('should return "low" state for 25-50% charge', () => {
      const battery = { charge: 0.3 }
      const visual = getBatteryVisualState(battery)

      expect(visual.state).toBe('low')
      expect(visual.chargePercent).toBe(30)
    })

    it('should return "depleted" state for 0-25% charge', () => {
      const battery = { charge: 0.1 }
      const visual = getBatteryVisualState(battery)

      expect(visual.state).toBe('depleted')
      expect(visual.chargePercent).toBe(10)
    })

    it('should return "dead" state for 0% charge', () => {
      const battery = { charge: 0 }
      const visual = getBatteryVisualState(battery)

      expect(visual.state).toBe('dead')
      expect(visual.chargePercent).toBe(0)
      expect(visual.glowIntensity).toBe(0)
    })

    it('should calculate glow intensity as 50% of charge', () => {
      const battery = { charge: 0.8 }
      const visual = getBatteryVisualState(battery)

      expect(visual.glowIntensity).toBeCloseTo(0.4, 2)
    })

    it('should round charge percent to nearest integer', () => {
      const battery = { charge: 0.567 }
      const visual = getBatteryVisualState(battery)

      expect(visual.chargePercent).toBe(57)
    })

    it('should handle boundary at 75% (full vs medium)', () => {
      const batteryJustFull = { charge: 0.76 }
      const batteryJustMedium = { charge: 0.75 }

      expect(getBatteryVisualState(batteryJustFull).state).toBe('full')
      expect(getBatteryVisualState(batteryJustMedium).state).toBe('medium')
    })
  })

  describe('getLEDVisualState', () => {
    it('should return "off" state when brightness is 0', () => {
      const led = { brightness: 0 }
      const visual = getLEDVisualState(led)

      expect(visual.state).toBe('off')
      expect(visual.brightnessPercent).toBe(0)
      expect(visual.glowIntensity).toBe(0)
      expect(visual.glowRadius).toBe(5) // Base radius
    })

    it('should return "dim" state for brightness < 0.4', () => {
      const led = { brightness: 0.3 }
      const visual = getLEDVisualState(led)

      expect(visual.state).toBe('dim')
      expect(visual.brightnessPercent).toBe(30)
    })

    it('should return "medium" state for brightness 0.4-0.8', () => {
      const led = { brightness: 0.6 }
      const visual = getLEDVisualState(led)

      expect(visual.state).toBe('medium')
      expect(visual.brightnessPercent).toBe(60)
    })

    it('should return "bright" state for brightness >= 0.8', () => {
      const led = { brightness: 0.9 }
      const visual = getLEDVisualState(led)

      expect(visual.state).toBe('bright')
      expect(visual.brightnessPercent).toBe(90)
    })

    it('should calculate glow radius (5px base + brightness * 15px)', () => {
      const led1 = { brightness: 0 }
      const led2 = { brightness: 0.5 }
      const led3 = { brightness: 1.0 }

      expect(getLEDVisualState(led1).glowRadius).toBe(5)
      expect(getLEDVisualState(led2).glowRadius).toBe(12.5)
      expect(getLEDVisualState(led3).glowRadius).toBe(20)
    })

    it('should handle undefined brightness as 0', () => {
      const led = {}
      const visual = getLEDVisualState(led)

      expect(visual.brightness).toBe(0)
      expect(visual.state).toBe('off')
    })

    it('should set glowIntensity equal to brightness', () => {
      const led = { brightness: 0.7 }
      const visual = getLEDVisualState(led)

      expect(visual.glowIntensity).toBe(0.7)
    })
  })

  describe('getResistorVisualState', () => {
    it('should calculate power dissipation using P = I²R', () => {
      const resistor = { current: 0.1, resistance: 100 }
      const visual = getResistorVisualState(resistor)

      // P = (0.1)² × 100 = 0.01 × 100 = 1.0W
      expect(visual.powerDissipated).toBeCloseTo(1.0, 2)
    })

    it('should return "cool" state for low power (<0.25 heat level)', () => {
      const resistor = { current: 0.05, resistance: 100 }
      // P = 0.05² × 100 = 0.25W → heat = 0.25/2.0 = 0.125
      const visual = getResistorVisualState(resistor)

      expect(visual.state).toBe('cool')
      expect(visual.heatLevel).toBeLessThan(0.25)
    })

    it('should return "warm" state for medium power (0.25-0.6 heat level)', () => {
      const resistor = { current: 0.1, resistance: 100 }
      // P = 0.1² × 100 = 1.0W → heat = 1.0/2.0 = 0.5
      const visual = getResistorVisualState(resistor)

      expect(visual.state).toBe('warm')
      expect(visual.heatLevel).toBeCloseTo(0.5, 2)
    })

    it('should return "hot" state for high power (0.6-0.9 heat level)', () => {
      const resistor = { current: 0.13, resistance: 100 }
      // P = 0.13² × 100 = 1.69W → heat = 1.69/2.0 = 0.845
      const visual = getResistorVisualState(resistor)

      expect(visual.state).toBe('hot')
      expect(visual.heatLevel).toBeGreaterThan(0.6)
      expect(visual.heatLevel).toBeLessThan(0.9)
    })

    it('should return "overheating" state for very high power (>= 0.9 heat level)', () => {
      const resistor = { current: 0.15, resistance: 100 }
      // P = 0.15² × 100 = 2.25W → heat = 2.25/2.0 = 1.125 → clamped to 1.0
      const visual = getResistorVisualState(resistor)

      expect(visual.state).toBe('overheating')
      expect(visual.heatLevel).toBeGreaterThanOrEqual(0.9)
    })

    it('should clamp heat level to maximum of 1.0', () => {
      const resistor = { current: 1.0, resistance: 100 }
      // P = 1² × 100 = 100W → heat = 100/2.0 = 50 → clamped to 1.0
      const visual = getResistorVisualState(resistor)

      expect(visual.heatLevel).toBe(1.0)
    })

    it('should handle undefined current and resistance as 0', () => {
      const resistor = {}
      const visual = getResistorVisualState(resistor)

      expect(visual.powerDissipated).toBe(0)
      expect(visual.heatLevel).toBe(0)
      expect(visual.state).toBe('cool')
    })

    it('should include voltage drop and current in output', () => {
      const resistor = { current: 0.1, resistance: 100, voltageDrop: 10.0 }
      const visual = getResistorVisualState(resistor)

      expect(visual.voltageDrop).toBe(10.0)
      expect(visual.current).toBe(0.1)
    })

    it('should handle zero resistance gracefully', () => {
      const resistor = { current: 0.1, resistance: 0 }
      const visual = getResistorVisualState(resistor)

      expect(visual.powerDissipated).toBe(0)
      expect(visual.state).toBe('cool')
    })
  })

  describe('getCapacitorVisualState', () => {
    it('should return "empty" state for <10% charge', () => {
      const capacitor = { voltage: 0.4, maxVoltage: 5.0 }
      // 0.4/5.0 = 0.08 = 8%
      const visual = getCapacitorVisualState(capacitor)

      expect(visual.state).toBe('empty')
      expect(visual.chargePercent).toBe(8)
      expect(visual.chargeFill).toBeCloseTo(0.08, 2)
    })

    it('should return "charging" state for 10-50% charge', () => {
      const capacitor = { voltage: 1.5, maxVoltage: 5.0 }
      // 1.5/5.0 = 0.3 = 30%
      const visual = getCapacitorVisualState(capacitor)

      expect(visual.state).toBe('charging')
      expect(visual.chargePercent).toBe(30)
    })

    it('should return "charged" state for 50-90% charge', () => {
      const capacitor = { voltage: 3.5, maxVoltage: 5.0 }
      // 3.5/5.0 = 0.7 = 70%
      const visual = getCapacitorVisualState(capacitor)

      expect(visual.state).toBe('charged')
      expect(visual.chargePercent).toBe(70)
    })

    it('should return "full" state for >= 90% charge', () => {
      const capacitor = { voltage: 4.8, maxVoltage: 5.0 }
      // 4.8/5.0 = 0.96 = 96%
      const visual = getCapacitorVisualState(capacitor)

      expect(visual.state).toBe('full')
      expect(visual.chargePercent).toBe(96)
    })

    it('should use default maxVoltage of 5.0V if not specified', () => {
      const capacitor = { voltage: 2.5 }
      const visual = getCapacitorVisualState(capacitor)

      expect(visual.maxVoltage).toBe(5.0)
      expect(visual.chargeFill).toBe(0.5)
    })

    it('should handle 0 voltage', () => {
      const capacitor = { voltage: 0, maxVoltage: 10.0 }
      const visual = getCapacitorVisualState(capacitor)

      expect(visual.state).toBe('empty')
      expect(visual.chargePercent).toBe(0)
      expect(visual.chargeFill).toBe(0)
    })

    it('should handle undefined voltage as 0', () => {
      const capacitor = { maxVoltage: 10.0 }
      const visual = getCapacitorVisualState(capacitor)

      expect(visual.voltage).toBe(0)
      expect(visual.chargePercent).toBe(0)
    })

    it('should round charge percent to nearest integer', () => {
      const capacitor = { voltage: 3.33, maxVoltage: 5.0 }
      // 3.33/5.0 = 0.666 = 66.6% → rounds to 67%
      const visual = getCapacitorVisualState(capacitor)

      expect(visual.chargePercent).toBe(67)
    })

    it('should calculate chargeFill as voltage/maxVoltage ratio', () => {
      const capacitor = { voltage: 7.5, maxVoltage: 10.0 }
      const visual = getCapacitorVisualState(capacitor)

      expect(visual.chargeFill).toBe(0.75)
    })
  })

  describe('getLightBulbVisualState', () => {
    it('should return "off" state when brightness is 0', () => {
      const bulb = { brightness: 0, power: 0 }
      const visual = getLightBulbVisualState(bulb)

      expect(visual.state).toBe('off')
      expect(visual.brightnessPercent).toBe(0)
      expect(visual.glowIntensity).toBe(0)
      expect(visual.filamentHeat).toBe(0)
    })

    it('should return "dim" state for brightness < 0.3', () => {
      const bulb = { brightness: 0.2, power: 0.1 }
      const visual = getLightBulbVisualState(bulb)

      expect(visual.state).toBe('dim')
      expect(visual.brightnessPercent).toBe(20)
    })

    it('should return "warm" state for brightness 0.3-0.7', () => {
      const bulb = { brightness: 0.5, power: 0.5 }
      const visual = getLightBulbVisualState(bulb)

      expect(visual.state).toBe('warm')
      expect(visual.brightnessPercent).toBe(50)
    })

    it('should return "bright" state for brightness >= 0.7', () => {
      const bulb = { brightness: 0.9, power: 1.2 }
      const visual = getLightBulbVisualState(bulb)

      expect(visual.state).toBe('bright')
      expect(visual.brightnessPercent).toBe(90)
    })

    it('should calculate filament heat based on power dissipation', () => {
      const bulb1 = { brightness: 0.5, power: 0.5 }
      const bulb2 = { brightness: 0.8, power: 1.0 }

      // Heat = power / 1.0, clamped to 1.0
      expect(getLightBulbVisualState(bulb1).filamentHeat).toBe(0.5)
      expect(getLightBulbVisualState(bulb2).filamentHeat).toBe(1.0)
    })

    it('should clamp filament heat to maximum of 1.0', () => {
      const bulb = { brightness: 1.0, power: 5.0 }
      const visual = getLightBulbVisualState(bulb)

      expect(visual.filamentHeat).toBe(1.0)
    })

    it('should handle undefined brightness and power as 0', () => {
      const bulb = {}
      const visual = getLightBulbVisualState(bulb)

      expect(visual.brightness).toBe(0)
      expect(visual.power).toBe(0)
      expect(visual.state).toBe('off')
      expect(visual.filamentHeat).toBe(0)
    })

    it('should set glowIntensity equal to brightness', () => {
      const bulb = { brightness: 0.6, power: 0.8 }
      const visual = getLightBulbVisualState(bulb)

      expect(visual.glowIntensity).toBe(0.6)
    })

    it('should round brightness percent to nearest integer', () => {
      const bulb = { brightness: 0.847, power: 1.0 }
      const visual = getLightBulbVisualState(bulb)

      expect(visual.brightnessPercent).toBe(85)
    })

    it('should include power in output', () => {
      const bulb = { brightness: 0.5, power: 0.75 }
      const visual = getLightBulbVisualState(bulb)

      expect(visual.power).toBe(0.75)
    })
  })

  describe('Boundary Conditions', () => {
    it('should handle maximum values correctly', () => {
      const battery = { charge: 1.0 }
      const led = { brightness: 1.0 }
      const resistor = { current: 10.0, resistance: 1000 }
      const capacitor = { voltage: 10.0, maxVoltage: 10.0 }
      const bulb = { brightness: 1.0, power: 10.0 }

      expect(getBatteryVisualState(battery).state).toBe('full')
      expect(getLEDVisualState(led).state).toBe('bright')
      expect(getResistorVisualState(resistor).heatLevel).toBe(1.0)
      expect(getCapacitorVisualState(capacitor).state).toBe('full')
      expect(getLightBulbVisualState(bulb).filamentHeat).toBe(1.0)
    })

    it('should handle minimum values correctly', () => {
      const battery = { charge: 0 }
      const led = { brightness: 0 }
      const resistor = { current: 0, resistance: 0 }
      const capacitor = { voltage: 0, maxVoltage: 10.0 }
      const bulb = { brightness: 0, power: 0 }

      expect(getBatteryVisualState(battery).state).toBe('dead')
      expect(getLEDVisualState(led).state).toBe('off')
      expect(getResistorVisualState(resistor).state).toBe('cool')
      expect(getCapacitorVisualState(capacitor).state).toBe('empty')
      expect(getLightBulbVisualState(bulb).state).toBe('off')
    })

    it('should handle state boundaries precisely', () => {
      // LED dim/medium boundary at 0.4
      const ledJustDim = { brightness: 0.39 }
      const ledJustMedium = { brightness: 0.4 }
      expect(getLEDVisualState(ledJustDim).state).toBe('dim')
      expect(getLEDVisualState(ledJustMedium).state).toBe('medium')

      // Capacitor charging/charged boundary at 0.5
      const capCharging = { voltage: 2.4, maxVoltage: 5.0 } // 0.48
      const capCharged = { voltage: 2.5, maxVoltage: 5.0 }  // 0.5
      expect(getCapacitorVisualState(capCharging).state).toBe('charging')
      expect(getCapacitorVisualState(capCharged).state).toBe('charged')
    })
  })

  describe('Integration with Component Properties', () => {
    it('should work with realistic battery charge levels', () => {
      const freshBattery = { charge: 1.0 }
      const usedBattery = { charge: 0.65 }
      const dyingBattery = { charge: 0.15 }

      expect(getBatteryVisualState(freshBattery).state).toBe('full')
      expect(getBatteryVisualState(usedBattery).state).toBe('medium')
      expect(getBatteryVisualState(dyingBattery).state).toBe('depleted')
    })

    it('should work with realistic LED brightness values', () => {
      const offLED = { brightness: 0 }
      const dimLED = { brightness: 0.25 }
      const normalLED = { brightness: 0.6 }
      const brightLED = { brightness: 0.95 }

      expect(getLEDVisualState(offLED).state).toBe('off')
      expect(getLEDVisualState(dimLED).state).toBe('dim')
      expect(getLEDVisualState(normalLED).state).toBe('medium')
      expect(getLEDVisualState(brightLED).state).toBe('bright')
    })

    it('should work with realistic resistor power levels', () => {
      const lowPower = { current: 0.01, resistance: 100 }   // 0.01W
      const medPower = { current: 0.1, resistance: 100 }    // 1W
      const highPower = { current: 0.15, resistance: 100 }  // 2.25W

      expect(getResistorVisualState(lowPower).state).toBe('cool')
      expect(getResistorVisualState(medPower).state).toBe('warm')
      expect(getResistorVisualState(highPower).state).toBe('overheating')
    })
  })
})
