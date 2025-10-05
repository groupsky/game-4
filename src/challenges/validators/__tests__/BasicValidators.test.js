/**
 * BasicValidators.test.js - Unit tests for BasicValidators module
 *
 * Tests all 17 basic challenge validators (challenges 1-17)
 * with comprehensive coverage of success/failure conditions.
 */

import { describe, it, expect } from 'vitest'
import { BasicValidators } from '../BasicValidators.js'

describe('BasicValidators', () => {
  describe('validateFirstLight (Challenge 1)', () => {
    it('should fail when no batteries present', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.5 }
        ]
      }

      const result = BasicValidators.validateFirstLight(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('potato battery')
    })

    it('should fail when no LEDs present', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = BasicValidators.validateFirstLight(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Add an LED')
    })

    it('should fail when LED is too dim', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'led', brightness: 0.05 }
        ]
      }

      const result = BasicValidators.validateFirstLight(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('too dim')
    })

    it('should succeed when LED brightness >= 0.1', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'led', brightness: 0.1 }
        ]
      }

      const result = BasicValidators.validateFirstLight(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Success')
    })

    it('should succeed with multiple LEDs if any is bright', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'led', brightness: 0.05 },
          { type: 'led', brightness: 0.3 }
        ]
      }

      const result = BasicValidators.validateFirstLight(circuit)

      expect(result.success).toBe(true)
    })
  })

  describe('validatePowerUp (Challenge 2)', () => {
    it('should fail with less than 2 batteries', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'led', brightness: 0.6 }
        ]
      }

      const result = BasicValidators.validatePowerUp(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('at least 2 batteries')
    })

    it('should fail when no LEDs present', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = BasicValidators.validatePowerUp(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Add an LED')
    })

    it('should fail when LED brightness < 0.5', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'led', brightness: 0.3 }
        ]
      }

      const result = BasicValidators.validatePowerUp(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('much brighter')
    })

    it('should succeed with 2+ batteries and bright LED', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'led', brightness: 0.5 }
        ]
      }

      const result = BasicValidators.validatePowerUp(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('VERY bright')
    })

    it('should succeed with exactly 0.5 brightness threshold', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'led', brightness: 0.5 }
        ]
      }

      const result = BasicValidators.validatePowerUp(circuit)

      expect(result.success).toBe(true)
    })
  })

  describe('validateCurrentControl (Challenge 3)', () => {
    it('should fail with less than 2 batteries', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'resistor', resistance: 100 },
          { type: 'led', brightness: 0.3 }
        ]
      }

      const result = BasicValidators.validateCurrentControl(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('2 series batteries')
    })

    it('should fail when no resistor present', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'led', brightness: 0.3 }
        ]
      }

      const result = BasicValidators.validateCurrentControl(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Add a resistor')
    })

    it('should fail when no LED present', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'resistor', resistance: 100 }
        ]
      }

      const result = BasicValidators.validateCurrentControl(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Add an LED')
    })

    it('should fail when LED is too dim', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'resistor', resistance: 100 },
          { type: 'led', brightness: 0.05 }
        ]
      }

      const result = BasicValidators.validateCurrentControl(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('light up')
    })

    it('should fail when LED is overdriven (brightness > 0.7)', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'resistor', resistance: 100 },
          { type: 'led', brightness: 0.8 }
        ]
      }

      const result = BasicValidators.validateCurrentControl(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('too bright')
    })

    it('should succeed with proper current limiting (0.1 <= brightness <= 0.7)', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'resistor', resistance: 100 },
          { type: 'led', brightness: 0.4 }
        ]
      }

      const result = BasicValidators.validateCurrentControl(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Current is controlled')
    })

    it('should succeed at exactly 0.7 brightness boundary', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'resistor', resistance: 100 },
          { type: 'led', brightness: 0.7 }
        ]
      }

      const result = BasicValidators.validateCurrentControl(circuit)

      expect(result.success).toBe(true)
    })
  })

  describe('validateWarmGlow (Challenge 4)', () => {
    it('should fail when no light bulb present', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = BasicValidators.validateWarmGlow(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('light bulb')
    })

    it('should fail with less than 2 batteries', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'lightbulb', brightness: 0.3 }
        ]
      }

      const result = BasicValidators.validateWarmGlow(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('at least 2 batteries')
    })

    it('should fail when bulb brightness < 0.2', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'lightbulb', brightness: 0.1 }
        ]
      }

      const result = BasicValidators.validateWarmGlow(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('more voltage')
    })

    it('should succeed with 2+ batteries and bright bulb', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'lightbulb', brightness: 0.3 }
        ]
      }

      const result = BasicValidators.validateWarmGlow(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('incandescent')
    })

    it('should succeed at exactly 0.2 brightness boundary', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'lightbulb', brightness: 0.2 }
        ]
      }

      const result = BasicValidators.validateWarmGlow(circuit)

      expect(result.success).toBe(true)
    })
  })

  describe('validateBatteryBlues (Challenge 5 - Timed)', () => {
    it('should fail when no light bulb present', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = BasicValidators.validateBatteryBlues(circuit)

      expect(result.success).toBe(false)
      expect(result.tracking).toBeUndefined()
      expect(result.message).toContain('light bulb')
    })

    it('should fail when bulb is too dim', () => {
      const circuit = {
        components: [
          { type: 'lightbulb', brightness: 0.1 }
        ]
      }

      const result = BasicValidators.validateBatteryBlues(circuit)

      expect(result.success).toBe(false)
      expect(result.tracking).toBeUndefined()
      expect(result.message).toContain('too dim')
    })

    it('should return tracking=true when bulb is lit', () => {
      const circuit = {
        components: [
          { type: 'lightbulb', brightness: 0.3 }
        ]
      }

      const result = BasicValidators.validateBatteryBlues(circuit)

      expect(result.success).toBe(false)
      expect(result.tracking).toBe(true)
      expect(result.message).toContain('Keep it lit')
    })

    it('should always fail (time tracking required for completion)', () => {
      const circuit = {
        components: [
          { type: 'lightbulb', brightness: 0.9 }
        ]
      }

      const result = BasicValidators.validateBatteryBlues(circuit)

      expect(result.success).toBe(false)
      expect(result.tracking).toBe(true)
    })
  })

  describe('validateParallelPower (Challenge 6 - Timed)', () => {
    it('should fail when no light bulb present', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = BasicValidators.validateParallelPower(circuit)

      expect(result.success).toBe(false)
      expect(result.tracking).toBeUndefined()
    })

    it('should fail with less than 4 batteries', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'lightbulb', brightness: 0.3 }
        ]
      }

      const result = BasicValidators.validateParallelPower(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('at least 4 batteries')
    })

    it('should fail when bulb is too dim', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'lightbulb', brightness: 0.1 }
        ]
      }

      const result = BasicValidators.validateParallelPower(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('needs power')
    })

    it('should return tracking=true with 4+ batteries and lit bulb', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'lightbulb', brightness: 0.3 }
        ]
      }

      const result = BasicValidators.validateParallelPower(circuit)

      expect(result.success).toBe(false)
      expect(result.tracking).toBe(true)
      expect(result.message).toContain('Parallel banks')
    })
  })

  describe('validateDoubleBright (Challenge 7)', () => {
    it('should fail with less than 2 LEDs', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.5 },
          { type: 'resistor', resistance: 100 }
        ]
      }

      const result = BasicValidators.validateDoubleBright(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('at least 2 LEDs')
    })

    it('should fail with less than 2 resistors', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.5 },
          { type: 'led', brightness: 0.5 },
          { type: 'resistor', resistance: 100 }
        ]
      }

      const result = BasicValidators.validateDoubleBright(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Each LED needs its own resistor')
    })

    it('should fail when less than 2 LEDs are lit', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.5 },
          { type: 'led', brightness: 0.05 },
          { type: 'resistor', resistance: 100 },
          { type: 'resistor', resistance: 100 }
        ]
      }

      const result = BasicValidators.validateDoubleBright(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Both LEDs need to light up')
    })

    it('should succeed with 2+ LEDs and resistors, both lit', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.4 },
          { type: 'resistor', resistance: 100 },
          { type: 'resistor', resistance: 100 }
        ]
      }

      const result = BasicValidators.validateDoubleBright(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Double the light')
    })

    it('should succeed at exactly 0.1 brightness threshold', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.1 },
          { type: 'led', brightness: 0.1 },
          { type: 'resistor', resistance: 100 },
          { type: 'resistor', resistance: 100 }
        ]
      }

      const result = BasicValidators.validateDoubleBright(circuit)

      expect(result.success).toBe(true)
    })
  })

  describe('validateEnergyBank (Challenge 8)', () => {
    it('should fail when no capacitor present', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.3 }
        ]
      }

      const result = BasicValidators.validateEnergyBank(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('capacitor')
    })

    it('should fail when no LED present', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 2.0 }
        ]
      }

      const result = BasicValidators.validateEnergyBank(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Add an LED')
    })

    it('should fail when capacitor voltage < 1.5V', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 1.0 },
          { type: 'led', brightness: 0.3 }
        ]
      }

      const result = BasicValidators.validateEnergyBank(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('at least 1.5V')
    })

    it('should fail when LED is too dim', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 2.0 },
          { type: 'led', brightness: 0.05 }
        ]
      }

      const result = BasicValidators.validateEnergyBank(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('should be lit')
    })

    it('should succeed with charged capacitor and lit LED', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 1.5 },
          { type: 'led', brightness: 0.2 }
        ]
      }

      const result = BasicValidators.validateEnergyBank(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('storing energy')
    })

    it('should succeed at exactly 1.5V threshold', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 1.5 },
          { type: 'led', brightness: 0.1 }
        ]
      }

      const result = BasicValidators.validateEnergyBank(circuit)

      expect(result.success).toBe(true)
    })
  })

  describe('validateCapacitorPower (Challenge 9)', () => {
    it('should fail when no capacitor present', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.5 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = BasicValidators.validateCapacitorPower(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('capacitor')
    })

    it('should fail when no LED present', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 1.0 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = BasicValidators.validateCapacitorPower(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Add an LED')
    })

    it('should fail when no battery present', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 1.0 },
          { type: 'led', brightness: 0.5 }
        ]
      }

      const result = BasicValidators.validateCapacitorPower(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('battery')
    })

    it('should fail when capacitor voltage <= 0.5V', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 0.3 },
          { type: 'led', brightness: 0.5 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = BasicValidators.validateCapacitorPower(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('parallel')
    })

    it('should fail when LED brightness <= 0.3', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 1.0 },
          { type: 'led', brightness: 0.2 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = BasicValidators.validateCapacitorPower(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('should be lit')
    })

    it('should succeed with all components and proper conditions', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 1.0 },
          { type: 'led', brightness: 0.4 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = BasicValidators.validateCapacitorPower(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('stabilizes')
    })
  })

  describe('validateTripleChain (Challenge 12)', () => {
    it('should fail with less than 3 LEDs', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.1 },
          { type: 'led', brightness: 0.1 }
        ]
      }

      const result = BasicValidators.validateTripleChain(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('3 LEDs')
    })

    it('should fail with less than 3 batteries', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.1 },
          { type: 'led', brightness: 0.1 },
          { type: 'led', brightness: 0.1 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = BasicValidators.validateTripleChain(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('at least 3 batteries')
    })

    it('should fail when less than 3 LEDs are lit', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.1 },
          { type: 'led', brightness: 0.04 },
          { type: 'led', brightness: 0.1 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = BasicValidators.validateTripleChain(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('All 3 LEDs need to glow')
    })

    it('should succeed with 3 LEDs, 3 batteries, all lit', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.1 },
          { type: 'led', brightness: 0.1 },
          { type: 'led', brightness: 0.1 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = BasicValidators.validateTripleChain(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('voltage division')
    })

    it('should succeed at exactly 0.05 brightness threshold', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.05 },
          { type: 'led', brightness: 0.05 },
          { type: 'led', brightness: 0.05 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = BasicValidators.validateTripleChain(circuit)

      expect(result.success).toBe(true)
    })
  })

  describe('validateLEDArray (Challenge 13)', () => {
    it('should fail with less than 9 LEDs', () => {
      const circuit = {
        components: Array(8).fill({ type: 'led', brightness: 0.1 })
      }

      const result = BasicValidators.validateLEDArray(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('9 LEDs')
    })

    it('should fail when less than 9 LEDs are lit', () => {
      const circuit = {
        components: [
          ...Array(8).fill({ type: 'led', brightness: 0.1 }),
          { type: 'led', brightness: 0.03 }
        ]
      }

      const result = BasicValidators.validateLEDArray(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('All 9 LEDs must light')
    })

    it('should succeed with 9 LEDs all lit', () => {
      const circuit = {
        components: Array(9).fill({ type: 'led', brightness: 0.1 })
      }

      const result = BasicValidators.validateLEDArray(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('LED array complete')
    })

    it('should succeed at exactly 0.05 brightness threshold', () => {
      const circuit = {
        components: Array(9).fill({ type: 'led', brightness: 0.05 })
      }

      const result = BasicValidators.validateLEDArray(circuit)

      expect(result.success).toBe(true)
    })
  })

  describe('validateVoltageDivide (Challenge 14)', () => {
    it('should fail with less than 2 resistors', () => {
      const circuit = {
        components: [
          { type: 'resistor', resistance: 100 },
          { type: 'led', brightness: 0.1 }
        ]
      }

      const result = BasicValidators.validateVoltageDivide(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('2 resistors')
    })

    it('should fail when no LED present', () => {
      const circuit = {
        components: [
          { type: 'resistor', resistance: 100 },
          { type: 'resistor', resistance: 100 }
        ]
      }

      const result = BasicValidators.validateVoltageDivide(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Add an LED')
    })

    it('should fail when LED is too dim', () => {
      const circuit = {
        components: [
          { type: 'resistor', resistance: 100 },
          { type: 'resistor', resistance: 100 },
          { type: 'led', brightness: 0.03 }
        ]
      }

      const result = BasicValidators.validateVoltageDivide(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('should glow')
    })

    it('should succeed with 2 resistors and lit LED', () => {
      const circuit = {
        components: [
          { type: 'resistor', resistance: 100 },
          { type: 'resistor', resistance: 100 },
          { type: 'led', brightness: 0.1 }
        ]
      }

      const result = BasicValidators.validateVoltageDivide(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Resistor chain complete')
    })

    it('should succeed at exactly 0.05 brightness threshold', () => {
      const circuit = {
        components: [
          { type: 'resistor', resistance: 100 },
          { type: 'resistor', resistance: 100 },
          { type: 'led', brightness: 0.05 }
        ]
      }

      const result = BasicValidators.validateVoltageDivide(circuit)

      expect(result.success).toBe(true)
    })
  })

  describe('validateEndurance (Challenge 15 - Timed)', () => {
    it('should fail with less than 2 LEDs', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.5 }
        ]
      }

      const result = BasicValidators.validateEndurance(circuit)

      expect(result.success).toBe(false)
      expect(result.tracking).toBeUndefined()
      expect(result.message).toContain('2 LEDs')
    })

    it('should fail when less than 2 LEDs are lit', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.5 },
          { type: 'led', brightness: 0.05 }
        ]
      }

      const result = BasicValidators.validateEndurance(circuit)

      expect(result.success).toBe(false)
      expect(result.tracking).toBeUndefined()
      expect(result.message).toContain('Both LEDs must stay lit')
    })

    it('should return tracking=true when 2+ LEDs are lit', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.4 }
        ]
      }

      const result = BasicValidators.validateEndurance(circuit)

      expect(result.success).toBe(false)
      expect(result.tracking).toBe(true)
      expect(result.message).toContain('Endurance test running')
    })

    it('should always fail (time tracking required)', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.9 },
          { type: 'led', brightness: 0.9 }
        ]
      }

      const result = BasicValidators.validateEndurance(circuit)

      expect(result.success).toBe(false)
      expect(result.tracking).toBe(true)
    })
  })

  describe('validateRCTiming (Challenge 16)', () => {
    it('should fail when no capacitor present', () => {
      const circuit = {
        components: [
          { type: 'resistor', resistance: 100 },
          { type: 'led', brightness: 0.3 }
        ]
      }

      const result = BasicValidators.validateRCTiming(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Add a capacitor')
    })

    it('should fail when no resistor present', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 1.5 },
          { type: 'led', brightness: 0.3 }
        ]
      }

      const result = BasicValidators.validateRCTiming(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Add a resistor')
    })

    it('should fail when no LED present', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 1.5 },
          { type: 'resistor', resistance: 100 }
        ]
      }

      const result = BasicValidators.validateRCTiming(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Add an LED')
    })

    it('should fail when capacitor voltage < 1.0V', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 0.8 },
          { type: 'resistor', resistance: 100 },
          { type: 'led', brightness: 0.3 }
        ]
      }

      const result = BasicValidators.validateRCTiming(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Charge the capacitor first')
    })

    it('should succeed with RC circuit properly configured', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 1.5 },
          { type: 'resistor', resistance: 100 },
          { type: 'led', brightness: 0.3 }
        ]
      }

      const result = BasicValidators.validateRCTiming(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('RC time constant')
    })

    it('should succeed at exactly 1.0V threshold', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 1.0 },
          { type: 'resistor', resistance: 100 },
          { type: 'led', brightness: 0.1 }
        ]
      }

      const result = BasicValidators.validateRCTiming(circuit)

      expect(result.success).toBe(true)
    })
  })

  describe('validateEfficiency (Challenge 17)', () => {
    it('should fail with 0 batteries', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.05 },
          { type: 'resistor', resistance: 100 }
        ]
      }

      const result = BasicValidators.validateEfficiency(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('ONLY 1 battery')
    })

    it('should fail with more than 1 battery', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'led', brightness: 0.05 },
          { type: 'resistor', resistance: 100 }
        ]
      }

      const result = BasicValidators.validateEfficiency(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('ONLY 1 battery')
    })

    it('should fail when no LED present', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'resistor', resistance: 100 }
        ]
      }

      const result = BasicValidators.validateEfficiency(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Add an LED')
    })

    it('should fail when no resistor present', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'led', brightness: 0.05 }
        ]
      }

      const result = BasicValidators.validateEfficiency(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Use a resistor')
    })

    it('should fail when LED brightness < 0.03', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'led', brightness: 0.02 },
          { type: 'resistor', resistance: 100 }
        ]
      }

      const result = BasicValidators.validateEfficiency(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('should glow')
    })

    it('should succeed with 1 battery and minimal brightness', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'led', brightness: 0.04 },
          { type: 'resistor', resistance: 100 }
        ]
      }

      const result = BasicValidators.validateEfficiency(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Efficiency achieved')
    })

    it('should succeed at exactly 0.03 brightness threshold', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'led', brightness: 0.03 },
          { type: 'resistor', resistance: 100 }
        ]
      }

      const result = BasicValidators.validateEfficiency(circuit)

      expect(result.success).toBe(true)
    })
  })

  describe('Function Export', () => {
    it('should export all 17 validator functions', () => {
      expect(BasicValidators.validateFirstLight).toBeInstanceOf(Function)
      expect(BasicValidators.validatePowerUp).toBeInstanceOf(Function)
      expect(BasicValidators.validateCurrentControl).toBeInstanceOf(Function)
      expect(BasicValidators.validateWarmGlow).toBeInstanceOf(Function)
      expect(BasicValidators.validateBatteryBlues).toBeInstanceOf(Function)
      expect(BasicValidators.validateParallelPower).toBeInstanceOf(Function)
      expect(BasicValidators.validateDoubleBright).toBeInstanceOf(Function)
      expect(BasicValidators.validateEnergyBank).toBeInstanceOf(Function)
      expect(BasicValidators.validateCapacitorPower).toBeInstanceOf(Function)
      expect(BasicValidators.validateTripleChain).toBeInstanceOf(Function)
      expect(BasicValidators.validateLEDArray).toBeInstanceOf(Function)
      expect(BasicValidators.validateVoltageDivide).toBeInstanceOf(Function)
      expect(BasicValidators.validateEndurance).toBeInstanceOf(Function)
      expect(BasicValidators.validateRCTiming).toBeInstanceOf(Function)
      expect(BasicValidators.validateEfficiency).toBeInstanceOf(Function)
    })

    it('should have exactly 15 validator functions', () => {
      const validatorCount = Object.keys(BasicValidators).length
      expect(validatorCount).toBe(15)
    })
  })
})
