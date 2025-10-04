/**
 * ComponentFactory - Creates components with same parameters as UI
 *
 * IMPORTANT: These are the ONLY valid component parameters.
 * Tests SHOULD use these factory functions to match UI behavior.
 *
 * NOTE: LED and LightBulb created by factory include extra properties (x, y, resistance, current, power)
 * that can interfere with circuit simulation physics in complex multi-component circuits.
 * For simple tests or when exact physics behavior is critical, use minimal inline objects instead:
 *   { id: X, type: 'led', brightness: 0 }
 *   { id: X, type: 'lightbulb', brightness: 0 }
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
