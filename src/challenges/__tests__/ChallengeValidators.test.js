/**
 * ChallengeValidators.test.js - Unit tests for ChallengeValidators module
 *
 * Tests that ChallengeValidators properly re-exports all validators
 * from BasicValidators and AdvancedValidators.
 */

import { describe, it, expect } from 'vitest'
import { ChallengeValidators } from '../ChallengeValidators.js'
import { BasicValidators } from '../validators/BasicValidators.js'
import { AdvancedValidators } from '../validators/AdvancedValidators.js'

describe('ChallengeValidators', () => {
  describe('Re-export Aggregation', () => {
    it('should export all validators from BasicValidators', () => {
      const basicKeys = Object.keys(BasicValidators)

      basicKeys.forEach(key => {
        expect(ChallengeValidators[key]).toBe(BasicValidators[key])
      })
    })

    it('should export all validators from AdvancedValidators', () => {
      const advancedKeys = Object.keys(AdvancedValidators)

      advancedKeys.forEach(key => {
        expect(ChallengeValidators[key]).toBe(AdvancedValidators[key])
      })
    })

    it('should have exactly 28 validator functions (15 basic + 13 advanced)', () => {
      const validatorCount = Object.keys(ChallengeValidators).length
      expect(validatorCount).toBe(28)
    })

    it('should export all functions as callable functions', () => {
      Object.values(ChallengeValidators).forEach(validator => {
        expect(validator).toBeInstanceOf(Function)
      })
    })
  })

  describe('Specific Validator Exports', () => {
    it('should export validateFirstLight', () => {
      expect(ChallengeValidators.validateFirstLight).toBeInstanceOf(Function)
    })

    it('should export validatePowerUp', () => {
      expect(ChallengeValidators.validatePowerUp).toBeInstanceOf(Function)
    })

    it('should export validateCurrentControl', () => {
      expect(ChallengeValidators.validateCurrentControl).toBeInstanceOf(Function)
    })

    it('should export validateWarmGlow', () => {
      expect(ChallengeValidators.validateWarmGlow).toBeInstanceOf(Function)
    })

    it('should export validateBatteryBlues', () => {
      expect(ChallengeValidators.validateBatteryBlues).toBeInstanceOf(Function)
    })

    it('should export validateParallelPower', () => {
      expect(ChallengeValidators.validateParallelPower).toBeInstanceOf(Function)
    })

    it('should export validateDoubleBright', () => {
      expect(ChallengeValidators.validateDoubleBright).toBeInstanceOf(Function)
    })

    it('should export validateEnergyBank', () => {
      expect(ChallengeValidators.validateEnergyBank).toBeInstanceOf(Function)
    })

    it('should export validateCapacitorPower', () => {
      expect(ChallengeValidators.validateCapacitorPower).toBeInstanceOf(Function)
    })

    it('should export validateTripleChain', () => {
      expect(ChallengeValidators.validateTripleChain).toBeInstanceOf(Function)
    })

    it('should export validateLEDArray', () => {
      expect(ChallengeValidators.validateLEDArray).toBeInstanceOf(Function)
    })

    it('should export validateVoltageDivide', () => {
      expect(ChallengeValidators.validateVoltageDivide).toBeInstanceOf(Function)
    })

    it('should export validateEndurance', () => {
      expect(ChallengeValidators.validateEndurance).toBeInstanceOf(Function)
    })

    it('should export validateRCTiming', () => {
      expect(ChallengeValidators.validateRCTiming).toBeInstanceOf(Function)
    })

    it('should export validateEfficiency', () => {
      expect(ChallengeValidators.validateEfficiency).toBeInstanceOf(Function)
    })

    it('should export validateMaxBright', () => {
      expect(ChallengeValidators.validateMaxBright).toBeInstanceOf(Function)
    })

    it('should export validateBatteryBank', () => {
      expect(ChallengeValidators.validateBatteryBank).toBeInstanceOf(Function)
    })

    it('should export validateMarathon', () => {
      expect(ChallengeValidators.validateMarathon).toBeInstanceOf(Function)
    })

    it('should export validateDualPower', () => {
      expect(ChallengeValidators.validateDualPower).toBeInstanceOf(Function)
    })

    it('should export validateCapNetwork', () => {
      expect(ChallengeValidators.validateCapNetwork).toBeInstanceOf(Function)
    })

    it('should export validateSeriesCaps', () => {
      expect(ChallengeValidators.validateSeriesCaps).toBeInstanceOf(Function)
    })

    it('should export validateMixedLoad', () => {
      expect(ChallengeValidators.validateMixedLoad).toBeInstanceOf(Function)
    })

    it('should export validateResistorLadder', () => {
      expect(ChallengeValidators.validateResistorLadder).toBeInstanceOf(Function)
    })

    it('should export validatePowerDist', () => {
      expect(ChallengeValidators.validatePowerDist).toBeInstanceOf(Function)
    })

    it('should export validateSustainedFlash', () => {
      expect(ChallengeValidators.validateSustainedFlash).toBeInstanceOf(Function)
    })

    it('should export validateEfficiencyMaster', () => {
      expect(ChallengeValidators.validateEfficiencyMaster).toBeInstanceOf(Function)
    })

    it('should export validateGrandCircuit', () => {
      expect(ChallengeValidators.validateGrandCircuit).toBeInstanceOf(Function)
    })

    it('should export validateMasterInventor', () => {
      expect(ChallengeValidators.validateMasterInventor).toBeInstanceOf(Function)
    })
  })

  describe('Functional Smoke Tests', () => {
    it('validateFirstLight should work when called through re-export', () => {
      const circuit = {
        components: [
          { type: 'battery', voltage: 0.9 },
          { type: 'led', brightness: 0.5 }
        ]
      }

      const result = ChallengeValidators.validateFirstLight(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toBeDefined()
    })

    it('validateMaxBright should work when called through re-export', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.5 },
          { type: 'battery', voltage: 0.9 },
          { type: 'battery', voltage: 0.9 }
        ]
      }

      const result = ChallengeValidators.validateMaxBright(circuit)

      expect(result.success).toBe(true)
      expect(result.message).toBeDefined()
    })

    it('validateMasterInventor should work when called through re-export', () => {
      const circuit = {
        components: [
          { type: 'led', brightness: 0.5 },
          { type: 'led', brightness: 0.5 },
          { type: 'led', brightness: 0.5 },
          { type: 'led', brightness: 0.5 },
          { type: 'led', brightness: 0.5 }
        ]
      }

      const result = ChallengeValidators.validateMasterInventor(circuit)

      expect(result.success).toBe(true)
      expect(result.tracking).toBe(true)
      expect(result.message).toBeDefined()
    })
  })
})
