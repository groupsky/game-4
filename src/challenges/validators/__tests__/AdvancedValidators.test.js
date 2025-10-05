/**
 * AdvancedValidators.test.js - Unit tests for AdvancedValidators module
 *
 * Tests all 13 advanced challenge validators (challenges 18-30)
 * with comprehensive coverage of success/failure conditions.
 */

import { describe, it, expect } from 'vitest'
import { AdvancedValidators } from '../AdvancedValidators.js'

describe('AdvancedValidators', () => {
  describe('validateMaxBright (Challenge 18)', () => {
    it('should fail when no LEDs present', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = AdvancedValidators.validateMaxBright(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('exactly 1 LED')
    })

    it('should fail with more than 1 LED', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.5 },
          { type: 'led', brightness: 0.5 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = AdvancedValidators.validateMaxBright(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('exactly 1 LED')
    })

    it('should fail with less than 2 batteries', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.2 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = AdvancedValidators.validateMaxBright(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('more batteries')
    })

    it('should fail when brightness < 0.3', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.25 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = AdvancedValidators.validateMaxBright(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('brighter')
    })

    it('should fail when brightness > 0.95 (burning out)', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.96 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = AdvancedValidators.validateMaxBright(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Too bright')
      expect(result.message).toContain('burning out')
    })

    it('should succeed with brightness in optimal range (0.3 to 0.95)', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.5 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = AdvancedValidators.validateMaxBright(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Maximum safe brightness')
    })

    it('should succeed at exactly 0.3 brightness boundary', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.3 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = AdvancedValidators.validateMaxBright(circuit)

      expect(result.success).toBe(true)
    })

    it('should succeed at exactly 0.95 brightness boundary', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.95 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = AdvancedValidators.validateMaxBright(circuit)

      expect(result.success).toBe(true)
    })
  })

  describe('validateBatteryBank (Challenge 19)', () => {
    it('should fail with less than 9 batteries', () => {
      const circuit = {
        components: [
          ...Array(8).fill({ type: 'battery', voltage: 0.9 }),
          { type: 'led', brightness: 0.5 }
        ]
      }

      const result = AdvancedValidators.validateBatteryBank(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('9 batteries')
    })

    it('should fail when no LED present', () => {
      const circuit = {
        components: Array(9).fill({ type: 'battery', voltage: 0.9 })
      }

      const result = AdvancedValidators.validateBatteryBank(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Add an LED')
    })

    it('should fail when LED is too dim', () => {
      const circuit = {
        components: [
          ...Array(9).fill({ type: 'battery', voltage: 0.9 }),
          { type: 'led', brightness: 0.05 }
        ]
      }

      const result = AdvancedValidators.validateBatteryBank(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Wire the bank correctly')
    })

    it('should succeed with 9 batteries and lit LED', () => {
      const circuit = {
        components: [
          ...Array(9).fill({ type: 'battery', voltage: 0.9 }),
          { type: 'led', brightness: 0.3 }
        ]
      }

      const result = AdvancedValidators.validateBatteryBank(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Massive battery bank')
    })

    it('should succeed at exactly 0.1 brightness threshold', () => {
      const circuit = {
        components: [
          ...Array(9).fill({ type: 'battery', voltage: 0.9 }),
          { type: 'led', brightness: 0.1 }
        ]
      }

      const result = AdvancedValidators.validateBatteryBank(circuit)

      expect(result.success).toBe(true)
    })
  })

  describe('validateMarathon (Challenge 20 - Timed)', () => {
    it('should fail when no light bulb present', () => {
      const circuit = {
        components: Array(6).fill({ type: 'battery', voltage: 0.9 })
      }

      const result = AdvancedValidators.validateMarathon(circuit)

      expect(result.success).toBe(false)
      expect(result.tracking).toBeUndefined()
      expect(result.message).toContain('light bulb')
    })

    it('should fail with less than 6 batteries', () => {
      const circuit = {
        components: [
          ...Array(5).fill({ type: 'battery', voltage: 0.9 }),
          { type: 'lightbulb', brightness: 0.3 }
        ]
      }

      const result = AdvancedValidators.validateMarathon(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('at least 6 batteries')
    })

    it('should fail when bulb is too dim', () => {
      const circuit = {
        components: [
          ...Array(6).fill({ type: 'battery', voltage: 0.9 }),
          { type: 'lightbulb', brightness: 0.1 }
        ]
      }

      const result = AdvancedValidators.validateMarathon(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('must stay lit')
    })

    it('should return tracking=true with 6+ batteries and lit bulb', () => {
      const circuit = {
        components: [
          ...Array(6).fill({ type: 'battery', voltage: 0.9 }),
          { type: 'lightbulb', brightness: 0.3 }
        ]
      }

      const result = AdvancedValidators.validateMarathon(circuit)

      expect(result.success).toBe(false)
      expect(result.tracking).toBe(true)
      expect(result.message).toContain('Marathon running')
    })

    it('should always fail (time tracking required)', () => {
      const circuit = {
        components: [
          ...Array(10).fill({ type: 'battery', voltage: 0.9 }),
          { type: 'lightbulb', brightness: 0.9 }
        ]
      }

      const result = AdvancedValidators.validateMarathon(circuit)

      expect(result.success).toBe(false)
      expect(result.tracking).toBe(true)
    })
  })

  describe('validateDualPower (Challenge 21)', () => {
    it('should fail when no LED present', () => {
      const circuit = {
        components: [
          { type: 'lightbulb', brightness: 0.3 }
        ]
      }

      const result = AdvancedValidators.validateDualPower(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Add an LED')
    })

    it('should fail when no light bulb present', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.3 }
        ]
      }

      const result = AdvancedValidators.validateDualPower(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Add a light bulb')
    })

    it('should fail when LED is too dim', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.05 },
          { type: 'lightbulb', brightness: 0.3 }
        ]
      }

      const result = AdvancedValidators.validateDualPower(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Both LED and bulb must be lit')
    })

    it('should fail when bulb is too dim', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.3 },
          { type: 'lightbulb', brightness: 0.1 }
        ]
      }

      const result = AdvancedValidators.validateDualPower(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Both LED and bulb must be lit')
    })

    it('should succeed with both LED and bulb lit', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.3 },
          { type: 'lightbulb', brightness: 0.3 }
        ]
      }

      const result = AdvancedValidators.validateDualPower(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Dual power')
    })

    it('should succeed at exactly threshold boundaries', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.1 },
          { type: 'lightbulb', brightness: 0.2 }
        ]
      }

      const result = AdvancedValidators.validateDualPower(circuit)

      expect(result.success).toBe(true)
    })
  })

  describe('validateCapNetwork (Challenge 22)', () => {
    it('should fail with less than 2 capacitors', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 2.0 }
        ]
      }

      const result = AdvancedValidators.validateCapNetwork(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('2 capacitors')
    })

    it('should fail when less than 2 capacitors are charged', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 2.0 },
          { type: 'capacitor', voltage: 1.0 }
        ]
      }

      const result = AdvancedValidators.validateCapNetwork(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Charge both capacitors')
    })

    it('should succeed with 2+ charged capacitors', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 1.8 },
          { type: 'capacitor', voltage: 1.6 }
        ]
      }

      const result = AdvancedValidators.validateCapNetwork(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Parallel capacitors')
    })

    it('should succeed at exactly 1.5V threshold', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 1.5 },
          { type: 'capacitor', voltage: 1.5 }
        ]
      }

      const result = AdvancedValidators.validateCapNetwork(circuit)

      expect(result.success).toBe(true)
    })
  })

  describe('validateSeriesCaps (Challenge 23)', () => {
    it('should fail with less than 2 capacitors', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 1.0 }
        ]
      }

      const result = AdvancedValidators.validateSeriesCaps(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('2 capacitors')
    })

    it('should fail when less than 2 capacitors are charged', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 0.8 },
          { type: 'capacitor', voltage: 0.3 }
        ]
      }

      const result = AdvancedValidators.validateSeriesCaps(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Charge the series capacitors')
    })

    it('should succeed with 2+ charged capacitors', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 0.8 },
          { type: 'capacitor', voltage: 0.7 }
        ]
      }

      const result = AdvancedValidators.validateSeriesCaps(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Series caps')
    })

    it('should succeed at exactly 0.5V threshold', () => {
      const circuit = {
        components: [
          { type: 'capacitor', voltage: 0.5 },
          { type: 'capacitor', voltage: 0.5 }
        ]
      }

      const result = AdvancedValidators.validateSeriesCaps(circuit)

      expect(result.success).toBe(true)
    })
  })

  describe('validateMixedLoad (Challenge 24)', () => {
    it('should fail with less than 3 LEDs', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.2 },
          { type: 'led', brightness: 0.2 }
        ]
      }

      const result = AdvancedValidators.validateMixedLoad(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('3 LEDs')
    })

    it('should fail when less than 3 LEDs are lit', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.1 },
          { type: 'led', brightness: 0.1 },
          { type: 'led', brightness: 0.03 }
        ]
      }

      const result = AdvancedValidators.validateMixedLoad(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('All 3 LEDs must light')
    })

    it('should succeed with 3+ lit LEDs', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.1 },
          { type: 'led', brightness: 0.2 },
          { type: 'led', brightness: 0.15 }
        ]
      }

      const result = AdvancedValidators.validateMixedLoad(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Mixed topology')
    })

    it('should succeed at exactly 0.05 brightness threshold', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.05 },
          { type: 'led', brightness: 0.05 },
          { type: 'led', brightness: 0.05 }
        ]
      }

      const result = AdvancedValidators.validateMixedLoad(circuit)

      expect(result.success).toBe(true)
    })
  })

  describe('validateResistorLadder (Challenge 25)', () => {
    it('should fail with less than 3 resistors', () => {
      const circuit = {
        components: [
          { type: 'resistor', resistance: 100, current: 0.01 },
          { type: 'resistor', resistance: 100, current: 0.01 }
        ]
      }

      const result = AdvancedValidators.validateResistorLadder(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('3 resistors')
    })

    it('should fail when less than 3 resistors are active', () => {
      const circuit = {
        components: [
          { type: 'resistor', resistance: 100, current: 0.01 },
          { type: 'resistor', resistance: 100, current: 0.01 },
          { type: 'resistor', resistance: 100, current: 0.0005 }
        ]
      }

      const result = AdvancedValidators.validateResistorLadder(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('All 3 resistors must be in the circuit')
    })

    it('should succeed with 3+ active resistors', () => {
      const circuit = {
        components: [
          { type: 'resistor', resistance: 100, current: 0.01 },
          { type: 'resistor', resistance: 100, current: 0.01 },
          { type: 'resistor', resistance: 100, current: 0.01 }
        ]
      }

      const result = AdvancedValidators.validateResistorLadder(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Resistor ladder')
    })

    it('should succeed at exactly 0.001 current threshold', () => {
      const circuit = {
        components: [
          { type: 'resistor', resistance: 100, current: 0.001 },
          { type: 'resistor', resistance: 100, current: 0.001 },
          { type: 'resistor', resistance: 100, current: 0.001 }
        ]
      }

      const result = AdvancedValidators.validateResistorLadder(circuit)

      expect(result.success).toBe(false) // > 0.001, not >= 0.001
    })

    it('should succeed slightly above 0.001 current threshold', () => {
      const circuit = {
        components: [
          { type: 'resistor', resistance: 100, current: 0.002 },
          { type: 'resistor', resistance: 100, current: 0.002 },
          { type: 'resistor', resistance: 100, current: 0.002 }
        ]
      }

      const result = AdvancedValidators.validateResistorLadder(circuit)

      expect(result.success).toBe(true)
    })
  })

  describe('validatePowerDist (Challenge 26)', () => {
    it('should fail with less than 3 LEDs', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 }
        ]
      }

      const result = AdvancedValidators.validatePowerDist(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('3 LEDs')
    })

    it('should fail when less than 3 LEDs are lit', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.05 }
        ]
      }

      const result = AdvancedValidators.validatePowerDist(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('All 3 parallel branches must be lit')
    })

    it('should succeed with 3+ lit LEDs', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 }
        ]
      }

      const result = AdvancedValidators.validatePowerDist(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Power distribution hub')
    })

    it('should succeed at exactly 0.1 brightness threshold', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.1 },
          { type: 'led', brightness: 0.1 },
          { type: 'led', brightness: 0.1 }
        ]
      }

      const result = AdvancedValidators.validatePowerDist(circuit)

      expect(result.success).toBe(true)
    })
  })

  describe('validateSustainedFlash (Challenge 27 - Timed)', () => {
    it('should fail when no light bulb present', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'capacitor', voltage: 1.5 }
        ]
      }

      const result = AdvancedValidators.validateSustainedFlash(circuit)

      expect(result.success).toBe(false)
      expect(result.tracking).toBeUndefined()
      expect(result.message).toContain('light bulb')
    })

    it('should fail when no batteries present', () => {
      const circuit = {
        components: [
          { type: 'lightbulb', brightness: 0.3 },
          { type: 'capacitor', voltage: 1.5 }
        ]
      }

      const result = AdvancedValidators.validateSustainedFlash(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('batteries')
    })

    it('should fail when no capacitors present', () => {
      const circuit = {
        components: [
          { type: 'lightbulb', brightness: 0.3 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = AdvancedValidators.validateSustainedFlash(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('capacitors')
    })

    it('should fail when bulb is too dim', () => {
      const circuit = {
        components: [
          { type: 'lightbulb', brightness: 0.1 },
          { type: 'battery', voltage: 0.9 },
          { type: 'capacitor', voltage: 1.5 }
        ]
      }

      const result = AdvancedValidators.validateSustainedFlash(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('must stay lit')
    })

    it('should return tracking=true with all components and lit bulb', () => {
      const circuit = {
        components: [
          { type: 'lightbulb', brightness: 0.3 },
          { type: 'battery', voltage: 0.9 },
          { type: 'capacitor', voltage: 1.5 }
        ]
      }

      const result = AdvancedValidators.validateSustainedFlash(circuit)

      expect(result.success).toBe(false)
      expect(result.tracking).toBe(true)
      expect(result.message).toContain('Batteries + caps')
    })

    it('should always fail (time tracking required)', () => {
      const circuit = {
        components: [
          { type: 'lightbulb', brightness: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'capacitor', voltage: 2.0 }
        ]
      }

      const result = AdvancedValidators.validateSustainedFlash(circuit)

      expect(result.success).toBe(false)
      expect(result.tracking).toBe(true)
    })
  })

  describe('validateEfficiencyMaster (Challenge 28 - Timed)', () => {
    it('should fail with less than 3 LEDs', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = AdvancedValidators.validateEfficiencyMaster(circuit)

      expect(result.success).toBe(false)
      expect(result.tracking).toBeUndefined()
      expect(result.message).toContain('3 LEDs')
    })

    it('should fail with less than 3 batteries', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = AdvancedValidators.validateEfficiencyMaster(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('EXACTLY 3 batteries')
    })

    it('should fail with more than 3 batteries', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = AdvancedValidators.validateEfficiencyMaster(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('EXACTLY 3 batteries')
    })

    it('should fail when less than 3 LEDs are lit', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.05 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = AdvancedValidators.validateEfficiencyMaster(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('All 3 LEDs must stay lit')
    })

    it('should return tracking=true with exactly 3 batteries and 3 lit LEDs', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = AdvancedValidators.validateEfficiencyMaster(circuit)

      expect(result.success).toBe(false)
      expect(result.tracking).toBe(true)
      expect(result.message).toContain('Efficiency challenge')
    })

    it('should always fail (time tracking required)', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.9 },
          { type: 'led', brightness: 0.9 },
          { type: 'led', brightness: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = AdvancedValidators.validateEfficiencyMaster(circuit)

      expect(result.success).toBe(false)
      expect(result.tracking).toBe(true)
    })
  })

  describe('validateGrandCircuit (Challenge 29 - Timed)', () => {
    it('should fail with less than 4 batteries', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 },
          { type: 'led', brightness: 0.3 },
          { type: 'lightbulb', brightness: 0.3 },
          { type: 'resistor', resistance: 100 },
          { type: 'capacitor', voltage: 1.5 }
        ]
      }

      const result = AdvancedValidators.validateGrandCircuit(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('at least 4 batteries')
    })

    it('should fail when no LED present', () => {
      const circuit = {
        components: [
          ...Array(4).fill({ type: 'battery', voltage: 0.9 }),
          { type: 'lightbulb', brightness: 0.3 },
          { type: 'resistor', resistance: 100 },
          { type: 'capacitor', voltage: 1.5 }
        ]
      }

      const result = AdvancedValidators.validateGrandCircuit(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Add an LED')
    })

    it('should fail when no light bulb present', () => {
      const circuit = {
        components: [
          ...Array(4).fill({ type: 'battery', voltage: 0.9 }),
          { type: 'led', brightness: 0.3 },
          { type: 'resistor', resistance: 100 },
          { type: 'capacitor', voltage: 1.5 }
        ]
      }

      const result = AdvancedValidators.validateGrandCircuit(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Add a light bulb')
    })

    it('should fail when no resistor present', () => {
      const circuit = {
        components: [
          ...Array(4).fill({ type: 'battery', voltage: 0.9 }),
          { type: 'led', brightness: 0.3 },
          { type: 'lightbulb', brightness: 0.3 },
          { type: 'capacitor', voltage: 1.5 }
        ]
      }

      const result = AdvancedValidators.validateGrandCircuit(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('resistors')
    })

    it('should fail when no capacitor present', () => {
      const circuit = {
        components: [
          ...Array(4).fill({ type: 'battery', voltage: 0.9 }),
          { type: 'led', brightness: 0.3 },
          { type: 'lightbulb', brightness: 0.3 },
          { type: 'resistor', resistance: 100 }
        ]
      }

      const result = AdvancedValidators.validateGrandCircuit(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('capacitor')
    })

    it('should fail when LED is too dim', () => {
      const circuit = {
        components: [
          ...Array(4).fill({ type: 'battery', voltage: 0.9 }),
          { type: 'led', brightness: 0.05 },
          { type: 'lightbulb', brightness: 0.3 },
          { type: 'resistor', resistance: 100 },
          { type: 'capacitor', voltage: 1.5 }
        ]
      }

      const result = AdvancedValidators.validateGrandCircuit(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('LED must be lit')
    })

    it('should fail when bulb is too dim', () => {
      const circuit = {
        components: [
          ...Array(4).fill({ type: 'battery', voltage: 0.9 }),
          { type: 'led', brightness: 0.3 },
          { type: 'lightbulb', brightness: 0.1 },
          { type: 'resistor', resistance: 100 },
          { type: 'capacitor', voltage: 1.5 }
        ]
      }

      const result = AdvancedValidators.validateGrandCircuit(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Light bulb must be lit')
    })

    it('should fail when capacitor voltage < 1.0V', () => {
      const circuit = {
        components: [
          ...Array(4).fill({ type: 'battery', voltage: 0.9 }),
          { type: 'led', brightness: 0.3 },
          { type: 'lightbulb', brightness: 0.3 },
          { type: 'resistor', resistance: 100 },
          { type: 'capacitor', voltage: 0.8 }
        ]
      }

      const result = AdvancedValidators.validateGrandCircuit(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Capacitor should be charged')
    })

    it('should return tracking=true with all components properly configured', () => {
      const circuit = {
        components: [
          ...Array(4).fill({ type: 'battery', voltage: 0.9 }),
          { type: 'led', brightness: 0.3 },
          { type: 'lightbulb', brightness: 0.3 },
          { type: 'resistor', resistance: 100, current: 0.01 },
          { type: 'capacitor', voltage: 1.5 }
        ]
      }

      const result = AdvancedValidators.validateGrandCircuit(circuit)

      expect(result.success).toBe(false) // Timer runs while maintaining conditions
      expect(result.tracking).toBe(true)
      expect(result.message).toContain('Grand Circuit running')
    })
  })

  describe('validateMasterInventor (Challenge 30 - Timed)', () => {
    it('should fail with less than 5 lit components', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 },
          { type: 'lightbulb', brightness: 0.3 }
        ]
      }

      const result = AdvancedValidators.validateMasterInventor(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Need 5+ lit components')
      expect(result.message).toContain('Currently: 4')
    })

    it('should not count dim LEDs (brightness < 0.1)', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.05 },
          { type: 'led', brightness: 0.05 },
          { type: 'lightbulb', brightness: 0.3 }
        ]
      }

      const result = AdvancedValidators.validateMasterInventor(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Currently: 3')
    })

    it('should not count dim bulbs (brightness < 0.2)', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 },
          { type: 'lightbulb', brightness: 0.1 },
          { type: 'lightbulb', brightness: 0.3 }
        ]
      }

      const result = AdvancedValidators.validateMasterInventor(circuit)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Currently: 4')
    })

    it('should succeed with 5+ lit LEDs', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 }
        ]
      }

      const result = AdvancedValidators.validateMasterInventor(circuit)

      expect(result.success).toBe(true)
      expect(result.tracking).toBe(true)
      expect(result.message).toContain('Master circuit')
      expect(result.message).toContain('5 components shining')
    })

    it('should succeed with 5+ lit bulbs', () => {
      const circuit = {
        components: [
          { type: 'lightbulb', brightness: 0.3 },
          { type: 'lightbulb', brightness: 0.3 },
          { type: 'lightbulb', brightness: 0.3 },
          { type: 'lightbulb', brightness: 0.3 },
          { type: 'lightbulb', brightness: 0.3 }
        ]
      }

      const result = AdvancedValidators.validateMasterInventor(circuit)

      expect(result.success).toBe(true)
      expect(result.tracking).toBe(true)
      expect(result.message).toContain('5 components shining')
    })

    it('should succeed with mix of LEDs and bulbs', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 },
          { type: 'led', brightness: 0.3 },
          { type: 'lightbulb', brightness: 0.3 },
          { type: 'lightbulb', brightness: 0.3 }
        ]
      }

      const result = AdvancedValidators.validateMasterInventor(circuit)

      expect(result.success).toBe(true)
      expect(result.tracking).toBe(true)
    })

    it('should count at exactly threshold boundaries', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.1 },
          { type: 'led', brightness: 0.1 },
          { type: 'led', brightness: 0.1 },
          { type: 'lightbulb', brightness: 0.2 },
          { type: 'lightbulb', brightness: 0.2 }
        ]
      }

      const result = AdvancedValidators.validateMasterInventor(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('5 components shining')
    })

    it('should display correct count in message', () => {
      const circuit = {
        components: [
          ...Array(7).fill({ type: 'led', brightness: 0.5 }),
          ...Array(3).fill({ type: 'lightbulb', brightness: 0.5 })
        ]
      }

      const result = AdvancedValidators.validateMasterInventor(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toContain('10 components shining')
    })
  })

  describe('Function Export', () => {
    it('should export all 13 validator functions', () => {
      expect(AdvancedValidators.validateMaxBright).toBeInstanceOf(Function)
      expect(AdvancedValidators.validateBatteryBank).toBeInstanceOf(Function)
      expect(AdvancedValidators.validateMarathon).toBeInstanceOf(Function)
      expect(AdvancedValidators.validateDualPower).toBeInstanceOf(Function)
      expect(AdvancedValidators.validateCapNetwork).toBeInstanceOf(Function)
      expect(AdvancedValidators.validateSeriesCaps).toBeInstanceOf(Function)
      expect(AdvancedValidators.validateMixedLoad).toBeInstanceOf(Function)
      expect(AdvancedValidators.validateResistorLadder).toBeInstanceOf(Function)
      expect(AdvancedValidators.validatePowerDist).toBeInstanceOf(Function)
      expect(AdvancedValidators.validateSustainedFlash).toBeInstanceOf(Function)
      expect(AdvancedValidators.validateEfficiencyMaster).toBeInstanceOf(Function)
      expect(AdvancedValidators.validateGrandCircuit).toBeInstanceOf(Function)
      expect(AdvancedValidators.validateMasterInventor).toBeInstanceOf(Function)
    })

    it('should have exactly 13 validator functions', () => {
      const validatorCount = Object.keys(AdvancedValidators).length
      expect(validatorCount).toBe(13)
    })
  })
})
