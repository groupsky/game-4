/**
 * ChallengeValidators - Re-exports validator functions
 *
 * Aggregates validators from BasicValidators and AdvancedValidators
 * for convenient import. Split into two modules for better organization.
 *
 * Each validator receives a circuit object and returns:
 * { success: boolean, message: string, tracking?: boolean }
 */

import { BasicValidators } from './validators/BasicValidators.js'
import { AdvancedValidators } from './validators/AdvancedValidators.js'

export const ChallengeValidators = {
  ...BasicValidators,
  ...AdvancedValidators
}
