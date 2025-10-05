/**
 * ComponentFactory.test.js - Unit tests for component creation utilities
 *
 * Tests the factory that creates components with exact player-available values:
 * - Battery: 0.9V potato battery
 * - Resistor: 100Ω (only value in UI)
 * - Capacitor: 100mF (only value in UI)
 * - LED: Basic LED with brightness tracking
 * - Light Bulb: Incandescent bulb with 0.36Ω resistance
 *
 * IMPORTANT: These are the ONLY component values players can use.
 * Tests using ComponentFactory ensure challenges are actually solvable.
 */

import { describe, it, expect } from 'vitest'
import { ComponentFactory } from '../ComponentFactory.js'

describe('ComponentFactory', () => {
  describe('createBattery', () => {
    it('should create potato battery with 0.9V', () => {
      const battery = ComponentFactory.createBattery(1)

      expect(battery.type).toBe('battery')
      expect(battery.voltage).toBe(0.9)
    })

    it('should initialize with full charge (1.0)', () => {
      const battery = ComponentFactory.createBattery(1)

      expect(battery.charge).toBe(1.0)
    })

    it('should set provided ID', () => {
      const battery = ComponentFactory.createBattery(42)

      expect(battery.id).toBe(42)
    })

    it('should generate timestamp ID if not provided', () => {
      const before = Date.now()
      const battery = ComponentFactory.createBattery()
      const after = Date.now()

      expect(battery.id).toBeGreaterThanOrEqual(before)
      expect(battery.id).toBeLessThanOrEqual(after)
    })

    it('should include x/y coordinates for UI placement', () => {
      const battery = ComponentFactory.createBattery(1)

      expect(battery.x).toBeGreaterThan(0)
      expect(battery.y).toBeGreaterThan(0)
    })

    it('should randomize position within range', () => {
      const battery1 = ComponentFactory.createBattery(1)
      const battery2 = ComponentFactory.createBattery(2)

      // Very unlikely to get exact same random position
      const samePosition = battery1.x === battery2.x && battery1.y === battery2.y
      expect(samePosition).toBe(false)
    })

    it('should create batteries with consistent voltage (0.9V always)', () => {
      const batteries = []
      for (let i = 0; i < 10; i++) {
        batteries.push(ComponentFactory.createBattery(i))
      }

      batteries.forEach(battery => {
        expect(battery.voltage).toBe(0.9)
      })
    })
  })

  describe('createLED', () => {
    it('should create LED with type "led"', () => {
      const led = ComponentFactory.createLED(1)

      expect(led.type).toBe('led')
    })

    it('should initialize with brightness 0 (off)', () => {
      const led = ComponentFactory.createLED(1)

      expect(led.brightness).toBe(0)
    })

    it('should set provided ID', () => {
      const led = ComponentFactory.createLED(99)

      expect(led.id).toBe(99)
    })

    it('should generate timestamp ID if not provided', () => {
      const before = Date.now()
      const led = ComponentFactory.createLED()
      const after = Date.now()

      expect(led.id).toBeGreaterThanOrEqual(before)
      expect(led.id).toBeLessThanOrEqual(after)
    })

    it('should include x/y coordinates for UI placement', () => {
      const led = ComponentFactory.createLED(1)

      expect(led.x).toBeGreaterThan(0)
      expect(led.y).toBeGreaterThan(0)
    })

    it('should randomize position', () => {
      const led1 = ComponentFactory.createLED(1)
      const led2 = ComponentFactory.createLED(2)

      const samePosition = led1.x === led2.x && led1.y === led2.y
      expect(samePosition).toBe(false)
    })
  })

  describe('createResistor', () => {
    it('should create resistor with 100Ω resistance', () => {
      const resistor = ComponentFactory.createResistor(1)

      expect(resistor.type).toBe('resistor')
      expect(resistor.resistance).toBe(100)
    })

    it('should initialize with zero current', () => {
      const resistor = ComponentFactory.createResistor(1)

      expect(resistor.current).toBe(0)
    })

    it('should set provided ID', () => {
      const resistor = ComponentFactory.createResistor(123)

      expect(resistor.id).toBe(123)
    })

    it('should generate timestamp ID if not provided', () => {
      const before = Date.now()
      const resistor = ComponentFactory.createResistor()
      const after = Date.now()

      expect(resistor.id).toBeGreaterThanOrEqual(before)
      expect(resistor.id).toBeLessThanOrEqual(after)
    })

    it('should include x/y coordinates for UI placement', () => {
      const resistor = ComponentFactory.createResistor(1)

      expect(resistor.x).toBeGreaterThan(0)
      expect(resistor.y).toBeGreaterThan(0)
    })

    it('should create resistors with consistent 100Ω value', () => {
      const resistors = []
      for (let i = 0; i < 10; i++) {
        resistors.push(ComponentFactory.createResistor(i))
      }

      resistors.forEach(resistor => {
        expect(resistor.resistance).toBe(100)
      })
    })
  })

  describe('createCapacitor', () => {
    it('should create capacitor with 100mF capacitance', () => {
      const capacitor = ComponentFactory.createCapacitor(1)

      expect(capacitor.type).toBe('capacitor')
      expect(capacitor.capacitance).toBe(0.1) // 100mF = 0.1F
    })

    it('should initialize with zero voltage (empty)', () => {
      const capacitor = ComponentFactory.createCapacitor(1)

      expect(capacitor.voltage).toBe(0)
    })

    it('should set max voltage to 5.0V', () => {
      const capacitor = ComponentFactory.createCapacitor(1)

      expect(capacitor.maxVoltage).toBe(5.0)
    })

    it('should set provided ID', () => {
      const capacitor = ComponentFactory.createCapacitor(456)

      expect(capacitor.id).toBe(456)
    })

    it('should generate timestamp ID if not provided', () => {
      const before = Date.now()
      const capacitor = ComponentFactory.createCapacitor()
      const after = Date.now()

      expect(capacitor.id).toBeGreaterThanOrEqual(before)
      expect(capacitor.id).toBeLessThanOrEqual(after)
    })

    it('should include x/y coordinates for UI placement', () => {
      const capacitor = ComponentFactory.createCapacitor(1)

      expect(capacitor.x).toBeGreaterThan(0)
      expect(capacitor.y).toBeGreaterThan(0)
    })

    it('should create capacitors with consistent 100mF value', () => {
      const capacitors = []
      for (let i = 0; i < 10; i++) {
        capacitors.push(ComponentFactory.createCapacitor(i))
      }

      capacitors.forEach(capacitor => {
        expect(capacitor.capacitance).toBe(0.1)
        expect(capacitor.maxVoltage).toBe(5.0)
      })
    })
  })

  describe('createLightBulb', () => {
    it('should create light bulb with type "lightbulb"', () => {
      const bulb = ComponentFactory.createLightBulb(1)

      expect(bulb.type).toBe('lightbulb')
    })

    it('should set resistance to 0.36Ω (tuned for battery drain)', () => {
      const bulb = ComponentFactory.createLightBulb(1)

      expect(bulb.resistance).toBe(0.36)
    })

    it('should initialize with brightness 0 (off)', () => {
      const bulb = ComponentFactory.createLightBulb(1)

      expect(bulb.brightness).toBe(0)
    })

    it('should initialize current and power to 0', () => {
      const bulb = ComponentFactory.createLightBulb(1)

      expect(bulb.current).toBe(0)
      expect(bulb.power).toBe(0)
    })

    it('should set provided ID', () => {
      const bulb = ComponentFactory.createLightBulb(789)

      expect(bulb.id).toBe(789)
    })

    it('should generate timestamp ID if not provided', () => {
      const before = Date.now()
      const bulb = ComponentFactory.createLightBulb()
      const after = Date.now()

      expect(bulb.id).toBeGreaterThanOrEqual(before)
      expect(bulb.id).toBeLessThanOrEqual(after)
    })

    it('should include x/y coordinates for UI placement', () => {
      const bulb = ComponentFactory.createLightBulb(1)

      expect(bulb.x).toBeGreaterThan(0)
      expect(bulb.y).toBeGreaterThan(0)
    })
  })

  describe('Component Type Verification', () => {
    it('should create distinct component types', () => {
      const battery = ComponentFactory.createBattery(1)
      const led = ComponentFactory.createLED(2)
      const resistor = ComponentFactory.createResistor(3)
      const capacitor = ComponentFactory.createCapacitor(4)
      const bulb = ComponentFactory.createLightBulb(5)

      const types = [battery.type, led.type, resistor.type, capacitor.type, bulb.type]
      const uniqueTypes = new Set(types)

      expect(uniqueTypes.size).toBe(5) // All different
    })

    it('should create components with timestamp-based IDs', () => {
      const before = Date.now()
      const components = [
        ComponentFactory.createBattery(),
        ComponentFactory.createLED(),
        ComponentFactory.createResistor(),
        ComponentFactory.createCapacitor(),
        ComponentFactory.createLightBulb()
      ]
      const after = Date.now()

      // All IDs should be within the time range
      components.forEach(component => {
        expect(component.id).toBeGreaterThanOrEqual(before)
        expect(component.id).toBeLessThanOrEqual(after)
      })
    })
  })

  describe('Player-Available Values Enforcement', () => {
    it('battery voltage should always be 0.9V (potato battery)', () => {
      const batteries = Array.from({ length: 100 }, (_, i) => ComponentFactory.createBattery(i))

      batteries.forEach(battery => {
        expect(battery.voltage).toBe(0.9)
      })
    })

    it('resistor resistance should always be 100Ω (only value in UI)', () => {
      const resistors = Array.from({ length: 100 }, (_, i) => ComponentFactory.createResistor(i))

      resistors.forEach(resistor => {
        expect(resistor.resistance).toBe(100)
      })
    })

    it('capacitor capacitance should always be 100mF (only value in UI)', () => {
      const capacitors = Array.from({ length: 100 }, (_, i) => ComponentFactory.createCapacitor(i))

      capacitors.forEach(capacitor => {
        expect(capacitor.capacitance).toBe(0.1)
      })
    })

    it('light bulb resistance should always be 0.36Ω (battery drain tuning)', () => {
      const bulbs = Array.from({ length: 100 }, (_, i) => ComponentFactory.createLightBulb(i))

      bulbs.forEach(bulb => {
        expect(bulb.resistance).toBe(0.36)
      })
    })
  })

  describe('Initial State Consistency', () => {
    it('all batteries should start fully charged', () => {
      const batteries = Array.from({ length: 10 }, (_, i) => ComponentFactory.createBattery(i))

      batteries.forEach(battery => {
        expect(battery.charge).toBe(1.0)
      })
    })

    it('all capacitors should start empty', () => {
      const capacitors = Array.from({ length: 10 }, (_, i) => ComponentFactory.createCapacitor(i))

      capacitors.forEach(capacitor => {
        expect(capacitor.voltage).toBe(0)
      })
    })

    it('all LEDs should start off', () => {
      const leds = Array.from({ length: 10 }, (_, i) => ComponentFactory.createLED(i))

      leds.forEach(led => {
        expect(led.brightness).toBe(0)
      })
    })

    it('all light bulbs should start off', () => {
      const bulbs = Array.from({ length: 10 }, (_, i) => ComponentFactory.createLightBulb(i))

      bulbs.forEach(bulb => {
        expect(bulb.brightness).toBe(0)
        expect(bulb.current).toBe(0)
        expect(bulb.power).toBe(0)
      })
    })

    it('all resistors should start with no current', () => {
      const resistors = Array.from({ length: 10 }, (_, i) => ComponentFactory.createResistor(i))

      resistors.forEach(resistor => {
        expect(resistor.current).toBe(0)
      })
    })
  })

  describe('Position Ranges', () => {
    it('battery positions should be in valid range', () => {
      const batteries = Array.from({ length: 50 }, (_, i) => ComponentFactory.createBattery(i))

      batteries.forEach(battery => {
        expect(battery.x).toBeGreaterThanOrEqual(100)
        expect(battery.x).toBeLessThanOrEqual(200)
        expect(battery.y).toBeGreaterThanOrEqual(100)
        expect(battery.y).toBeLessThanOrEqual(200)
      })
    })

    it('LED positions should be in valid range', () => {
      const leds = Array.from({ length: 50 }, (_, i) => ComponentFactory.createLED(i))

      leds.forEach(led => {
        expect(led.x).toBeGreaterThanOrEqual(250)
        expect(led.x).toBeLessThanOrEqual(350)
        expect(led.y).toBeGreaterThanOrEqual(100)
        expect(led.y).toBeLessThanOrEqual(200)
      })
    })

    it('resistor positions should be in valid range', () => {
      const resistors = Array.from({ length: 50 }, (_, i) => ComponentFactory.createResistor(i))

      resistors.forEach(resistor => {
        expect(resistor.x).toBeGreaterThanOrEqual(400)
        expect(resistor.x).toBeLessThanOrEqual(500)
        expect(resistor.y).toBeGreaterThanOrEqual(100)
        expect(resistor.y).toBeLessThanOrEqual(200)
      })
    })

    it('capacitor positions should be in valid range', () => {
      const capacitors = Array.from({ length: 50 }, (_, i) => ComponentFactory.createCapacitor(i))

      capacitors.forEach(capacitor => {
        expect(capacitor.x).toBeGreaterThanOrEqual(550)
        expect(capacitor.x).toBeLessThanOrEqual(650)
        expect(capacitor.y).toBeGreaterThanOrEqual(100)
        expect(capacitor.y).toBeLessThanOrEqual(200)
      })
    })

    it('light bulb positions should be in valid range', () => {
      const bulbs = Array.from({ length: 50 }, (_, i) => ComponentFactory.createLightBulb(i))

      bulbs.forEach(bulb => {
        expect(bulb.x).toBeGreaterThanOrEqual(700)
        expect(bulb.x).toBeLessThanOrEqual(800)
        expect(bulb.y).toBeGreaterThanOrEqual(100)
        expect(bulb.y).toBeLessThanOrEqual(200)
      })
    })
  })

  describe('Factory Method Return Values', () => {
    it('all factory methods should return objects', () => {
      expect(typeof ComponentFactory.createBattery(1)).toBe('object')
      expect(typeof ComponentFactory.createLED(1)).toBe('object')
      expect(typeof ComponentFactory.createResistor(1)).toBe('object')
      expect(typeof ComponentFactory.createCapacitor(1)).toBe('object')
      expect(typeof ComponentFactory.createLightBulb(1)).toBe('object')
    })

    it('all factory methods should return new instances', () => {
      const battery1 = ComponentFactory.createBattery(1)
      const battery2 = ComponentFactory.createBattery(1)

      expect(battery1).not.toBe(battery2) // Different objects
      expect(battery1.id).toBe(battery2.id) // Same ID
    })
  })
})
