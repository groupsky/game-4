/**
 * ComponentFactory - Creates components with same parameters as UI
 *
 * USAGE GUIDELINES:
 *
 * ✅ ALWAYS use factory for:
 *   - Battery (standard 0.9V potato battery)
 *   - Resistor (when using standard 100Ω value)
 *
 * ⚠️  USE WITH CAUTION:
 *   - LED: Factory adds x/y/extra properties that can interfere with physics in complex circuits
 *     → Use minimal { id, type, brightness } for critical physics tests
 *   - LightBulb: Same issue as LED
 *     → Use minimal { id, type, brightness } for critical physics tests
 *   - Capacitor: Factory creates 100mF, but many tests need custom values (10mF, 50mF)
 *     → Only use factory if you specifically need 100mF
 *
 * ❌ NEVER use factory when you need custom component values:
 *   - Custom resistor values (22Ω, 47Ω, 220Ω, etc.)
 *   - Custom capacitor values (10mF, 50mF, etc.)
 *   - Use inline objects with exact values needed by the test
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
