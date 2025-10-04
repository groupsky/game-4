/**
 * ComponentFactory - Creates components with EXACT same parameters as UI
 *
 * CRITICAL: These are the ONLY component values available to players in the UI.
 * Tests MUST use ComponentFactory to ensure challenges are actually solvable by players.
 *
 * USAGE RULES:
 *
 * ✅ ALWAYS use ComponentFactory.createX() for:
 *   - Battery (0.9V potato battery) - ALWAYS use factory
 *   - Resistor (100Ω) - ALWAYS use factory, this is the ONLY resistor value in UI
 *   - Capacitor (100mF) - ALWAYS use factory, this is the ONLY capacitor value in UI
 *
 * ⚠️  USE WITH CAUTION (physics simulation issues):
 *   - LED: Factory adds x/y/extra properties that interfere with physics in complex multi-component circuits
 *     → Use minimal { id, type: 'led', brightness: 0 } for critical physics tests
 *   - LightBulb: Same issue as LED
 *     → Use minimal { id, type: 'lightbulb', brightness: 0 } for critical physics tests
 *
 * ❌ NEVER create custom resistor/capacitor values:
 *   - If a test needs 220Ω resistor → challenge is unsolvable by players
 *   - If a test needs 10mF capacitor → challenge is unsolvable by players
 *   - Fix the challenge validator or design, not the test
 */

export class ComponentFactory {
  static createBattery(id = Date.now()) {
    return {
      id,
      type: 'battery',
      x: 100 + Math.random() * 100,
      y: 100 + Math.random() * 100,
      charge: 1.0,
      voltage: 0.9  // Single potato battery
    }
  }

  static createLED(id = Date.now()) {
    return {
      id,
      type: 'led',
      x: 250 + Math.random() * 100,
      y: 100 + Math.random() * 100,
      brightness: 0
    }
  }

  static createResistor(id = Date.now()) {
    return {
      id,
      type: 'resistor',
      x: 400 + Math.random() * 100,
      y: 100 + Math.random() * 100,
      resistance: 100,
      current: 0
    }
  }

  static createCapacitor(id = Date.now()) {
    return {
      id,
      type: 'capacitor',
      x: 550 + Math.random() * 100,
      y: 100 + Math.random() * 100,
      capacitance: 0.1,  // 100mF capacitor
      voltage: 0,
      maxVoltage: 5.0
    }
  }

  static createLightBulb(id = Date.now()) {
    return {
      id,
      type: 'lightbulb',
      x: 700 + Math.random() * 100,
      y: 100 + Math.random() * 100,
      brightness: 0,
      resistance: 0.36,  // Tuned to drain 3 batteries in ~40 seconds
      current: 0,
      power: 0
    }
  }
}
