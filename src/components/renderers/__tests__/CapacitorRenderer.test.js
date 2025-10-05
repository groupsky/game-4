/**
 * CapacitorRenderer.test.js - Unit tests for capacitor drawing function
 *
 * Tests the drawCapacitor function that renders capacitor visualization:
 * - Two parallel plates (classic capacitor symbol)
 * - Electric field lines between plates (based on charge level)
 * - Aluminum foil texture (Act 1 foil capacitor aesthetic)
 * - Charge bar indicator with gradient
 * - Voltage and capacitance labels
 *
 * Note: These are canvas rendering tests focused on verifying expected
 * canvas method calls rather than visual output.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { drawCapacitor } from '../CapacitorRenderer.js'

describe('CapacitorRenderer', () => {
  let mockCtx

  beforeEach(() => {
    mockCtx = {
      strokeStyle: '',
      lineWidth: 0,
      fillStyle: '',
      font: '',
      textAlign: '',
      textBaseline: '',
      globalAlpha: 1,
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      strokeRect: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn()
      }))
    }
  })

  describe('Parallel Plates', () => {
    it('should draw left plate as vertical line', () => {
      const component = { voltage: 0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // Left plate at x=-5
      const leftPlate = mockCtx.moveTo.mock.calls.find(
        call => call[0] === -5 && call[1] === -40 // -height/2 = -80/2
      )
      expect(leftPlate).toBeDefined()
    })

    it('should draw right plate as vertical line', () => {
      const component = { voltage: 0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // Right plate at x=5
      const rightPlate = mockCtx.moveTo.mock.calls.find(
        call => call[0] === 5 && call[1] === -40
      )
      expect(rightPlate).toBeDefined()
    })

    it('should set plate line width to 3 initially', () => {
      const component = { voltage: 0, maxVoltage: 5.0, capacitance: 0.1 }
      let plateLineWidth = 0

      Object.defineProperty(mockCtx, 'lineWidth', {
        set: (value) => { if (value === 3) plateLineWidth = value },
        get: () => plateLineWidth,
        configurable: true
      })

      drawCapacitor(mockCtx, component)

      // lineWidth gets overwritten, but should be set to 3 for plates
      expect(plateLineWidth).toBe(3)
    })

    it('should set plate color to gray', () => {
      const component = { voltage: 0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      expect(mockCtx.strokeStyle).toBe('#4A4A4A')
    })

    it('should stroke both plates', () => {
      const component = { voltage: 0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // At least 2 strokes for plates (plus foil texture strokes)
      expect(mockCtx.stroke.mock.calls.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Electric Field Lines', () => {
    it('should not draw field lines for empty capacitor', () => {
      const component = { voltage: 0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // chargeFill = 0/5 = 0, not > 0.1
      // Field lines only for chargeFill > 0.1
      // Count moveTo calls for field lines (between plates)
      const fieldLineStarts = mockCtx.moveTo.mock.calls.filter(
        call => call[0] === -3 // Field lines start at x=-3
      )
      expect(fieldLineStarts.length).toBe(0)
    })

    it('should draw field lines for charged capacitor', () => {
      const component = { voltage: 1.0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // chargeFill = 1.0/5.0 = 0.2 > 0.1
      // fieldLines = floor(0.2 * 8) + 2 = 1 + 2 = 3 lines
      const fieldLineStarts = mockCtx.moveTo.mock.calls.filter(
        call => call[0] === -3
      )
      expect(fieldLineStarts.length).toBeGreaterThanOrEqual(3)
    })

    it('should calculate field line count correctly', () => {
      const component = { voltage: 3.0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // chargeFill = 3.0/5.0 = 0.6
      // fieldLines = floor(0.6 * 8) + 2 = 4 + 2 = 6 lines
      const fieldLineStarts = mockCtx.moveTo.mock.calls.filter(
        call => call[0] === -3
      )
      expect(fieldLineStarts.length).toBe(6)
    })

    it('should draw more field lines for higher charge', () => {
      const component = { voltage: 5.0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // chargeFill = 5.0/5.0 = 1.0
      // fieldLines = floor(1.0 * 8) + 2 = 10 lines
      const fieldLineStarts = mockCtx.moveTo.mock.calls.filter(
        call => call[0] === -3
      )
      expect(fieldLineStarts.length).toBe(10)
    })

    it('should set field line color to blue', () => {
      const component = { voltage: 1.0, maxVoltage: 5.0, capacitance: 0.1 }
      const strokeStyles = []

      Object.defineProperty(mockCtx, 'strokeStyle', {
        set: (value) => { strokeStyles.push(value) },
        get: () => strokeStyles[strokeStyles.length - 1],
        configurable: true
      })

      drawCapacitor(mockCtx, component)

      expect(strokeStyles.some(style => style === '#1E3A8A')).toBe(true)
    })

    it('should set global alpha for field lines', () => {
      const component = { voltage: 2.5, maxVoltage: 5.0, capacitance: 0.1 }
      let maxAlpha = 0

      Object.defineProperty(mockCtx, 'globalAlpha', {
        set: (value) => { if (value > maxAlpha && value < 1) maxAlpha = value },
        get: () => 1,
        configurable: true
      })

      drawCapacitor(mockCtx, component)

      // chargeFill = 0.5, alpha = 0.5 * 0.8 = 0.4
      expect(maxAlpha).toBeGreaterThan(0)
    })

    it('should reset global alpha after field lines', () => {
      const component = { voltage: 2.5, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      expect(mockCtx.globalAlpha).toBe(1)
    })
  })

  describe('Aluminum Foil Texture', () => {
    it('should draw left foil texture lines', () => {
      const component = { voltage: 0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // Left foil: 5 horizontal lines from x=-15 to x=-5
      const leftFoilLines = mockCtx.moveTo.mock.calls.filter(
        call => call[0] === -15
      )
      expect(leftFoilLines.length).toBe(5)
    })

    it('should draw right foil texture lines', () => {
      const component = { voltage: 0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // Right foil: 5 horizontal lines from x=5 to x=15
      // But moveTo for right foil uses (5, y) where y varies
      // The lineTo goes to (15, y)
      const rightFoilLines = mockCtx.lineTo.mock.calls.filter(
        call => call[0] === 15 // Right foil ends at x=15
      )
      expect(rightFoilLines.length).toBe(5)
    })

    it('should set foil texture color to silver', () => {
      const component = { voltage: 0, maxVoltage: 5.0, capacitance: 0.1 }
      const strokeStyles = []

      Object.defineProperty(mockCtx, 'strokeStyle', {
        set: (value) => { strokeStyles.push(value) },
        get: () => strokeStyles[strokeStyles.length - 1],
        configurable: true
      })

      drawCapacitor(mockCtx, component)

      expect(strokeStyles.some(style => style === '#C0C0C0')).toBe(true)
    })

    it('should draw foil with reduced opacity', () => {
      const component = { voltage: 0, maxVoltage: 5.0, capacitance: 0.1 }
      const alphaValues = []

      Object.defineProperty(mockCtx, 'globalAlpha', {
        set: (value) => { alphaValues.push(value) },
        get: () => alphaValues[alphaValues.length - 1] || 1,
        configurable: true
      })

      drawCapacitor(mockCtx, component)

      // Foil drawn with alpha = 0.5
      expect(alphaValues.some(alpha => alpha === 0.5)).toBe(true)
    })
  })

  describe('Charge Bar Indicator', () => {
    it('should draw charge bar background', () => {
      const component = { voltage: 0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // Charge bar at x = width/2 = 25
      expect(mockCtx.strokeRect).toHaveBeenCalledWith(25, -24, 10, 48)
    })

    it('should fill charge bar based on voltage', () => {
      const component = { voltage: 2.5, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // chargeFill = 0.5, fillHeight = 48 * 0.5 = 24
      expect(mockCtx.fillRect).toHaveBeenCalled()
    })

    it('should use green gradient for high charge (>75%)', () => {
      const component = { voltage: 4.0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // chargeFill = 0.8 > 0.75
      expect(mockCtx.createLinearGradient).toHaveBeenCalled()
      const gradient = mockCtx.createLinearGradient.mock.results[0].value
      expect(gradient.addColorStop).toHaveBeenCalledWith(0, '#16A34A')
    })

    it('should use orange gradient for medium charge (25-75%)', () => {
      const component = { voltage: 2.5, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // chargeFill = 0.5
      const gradient = mockCtx.createLinearGradient.mock.results[0].value
      expect(gradient.addColorStop).toHaveBeenCalledWith(0, '#F97316')
    })

    it('should use red gradient for low charge (<25%)', () => {
      const component = { voltage: 1.0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // chargeFill = 0.2 < 0.25
      const gradient = mockCtx.createLinearGradient.mock.results[0].value
      expect(gradient.addColorStop).toHaveBeenCalledWith(0, '#DC2626')
    })

    it('should handle zero charge', () => {
      const component = { voltage: 0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // chargeFill = 0, fillHeight = 0
      // Still creates gradient and fillRect
      expect(mockCtx.createLinearGradient).toHaveBeenCalled()
    })

    it('should handle full charge', () => {
      const component = { voltage: 5.0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // chargeFill = 1.0, fillHeight = 48
      expect(mockCtx.fillRect).toHaveBeenCalled()
    })
  })

  describe('Labels and Text', () => {
    it('should display capacitance in millifarads', () => {
      const component = { voltage: 0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // 0.1F * 1000 = 100.0mF
      expect(mockCtx.fillText).toHaveBeenCalledWith('⚡ 100.0mF', 0, -55)
    })

    it('should display voltage with 2 decimal places', () => {
      const component = { voltage: 2.456, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      expect(mockCtx.fillText).toHaveBeenCalledWith('2.46V', 0, 55)
    })

    it('should default voltage to 0 if not provided', () => {
      const component = { maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      expect(mockCtx.fillText).toHaveBeenCalledWith('0.00V', 0, 55)
    })

    it('should default capacitance to 0.001F if not provided', () => {
      const component = { voltage: 0, maxVoltage: 5.0 }

      drawCapacitor(mockCtx, component)

      // 0.001F * 1000 = 1.0mF
      expect(mockCtx.fillText).toHaveBeenCalledWith('⚡ 1.0mF', 0, -55)
    })

    it('should default maxVoltage to 5.0 if not provided', () => {
      const component = { voltage: 2.5, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // chargeFill = 2.5 / 5.0 = 0.5 (medium charge, orange)
      const gradient = mockCtx.createLinearGradient.mock.results[0].value
      expect(gradient.addColorStop).toHaveBeenCalledWith(0, '#F97316')
    })

    it('should center-align text', () => {
      const component = { voltage: 0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      expect(mockCtx.textAlign).toBe('center')
    })

    it('should use Courier New font', () => {
      const component = { voltage: 0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      expect(mockCtx.font).toContain('Courier New')
    })
  })

  describe('Charge Fill Calculation', () => {
    it('should calculate charge fill as voltage/maxVoltage', () => {
      const component = { voltage: 3.0, maxVoltage: 6.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // chargeFill = 3.0 / 6.0 = 0.5
      const gradient = mockCtx.createLinearGradient.mock.results[0].value
      expect(gradient.addColorStop).toHaveBeenCalledWith(0, '#F97316') // Orange for 50%
    })

    it('should handle overvoltage (voltage > maxVoltage)', () => {
      const component = { voltage: 6.0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // chargeFill = 6.0 / 5.0 = 1.2 > 1.0
      // Should still use green gradient
      const gradient = mockCtx.createLinearGradient.mock.results[0].value
      expect(gradient.addColorStop).toHaveBeenCalledWith(0, '#16A34A')
    })

    it('should handle exactly 0.1 charge fill (field line threshold)', () => {
      const component = { voltage: 0.5, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // chargeFill = 0.5 / 5.0 = 0.1
      // At exactly 0.1, NOT > 0.1, so no field lines
      const fieldLineStarts = mockCtx.moveTo.mock.calls.filter(
        call => call[0] === -3
      )
      expect(fieldLineStarts.length).toBe(0)
    })

    it('should handle exactly 0.25 charge fill (red/orange boundary)', () => {
      const component = { voltage: 1.25, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // chargeFill = 0.25
      // At 0.25, NOT > 0.25, so red gradient
      const gradient = mockCtx.createLinearGradient.mock.results[0].value
      expect(gradient.addColorStop).toHaveBeenCalledWith(0, '#DC2626')
    })

    it('should handle exactly 0.75 charge fill (orange/green boundary)', () => {
      const component = { voltage: 3.75, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      // chargeFill = 0.75
      // At 0.75, NOT > 0.75, so orange gradient
      const gradient = mockCtx.createLinearGradient.mock.results[0].value
      expect(gradient.addColorStop).toHaveBeenCalledWith(0, '#F97316')
    })
  })

  describe('Canvas Method Calls', () => {
    it('should call beginPath before drawing lines', () => {
      const component = { voltage: 0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      expect(mockCtx.beginPath).toHaveBeenCalled()
    })

    it('should call moveTo and lineTo for lines', () => {
      const component = { voltage: 0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      expect(mockCtx.moveTo).toHaveBeenCalled()
      expect(mockCtx.lineTo).toHaveBeenCalled()
    })

    it('should call stroke to render lines', () => {
      const component = { voltage: 0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      expect(mockCtx.stroke).toHaveBeenCalled()
    })

    it('should call strokeRect for charge bar outline', () => {
      const component = { voltage: 0, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      expect(mockCtx.strokeRect).toHaveBeenCalled()
    })

    it('should call fillRect for charge bar fill', () => {
      const component = { voltage: 2.5, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      expect(mockCtx.fillRect).toHaveBeenCalled()
    })

    it('should create linear gradient for charge bar', () => {
      const component = { voltage: 2.5, maxVoltage: 5.0, capacitance: 0.1 }

      drawCapacitor(mockCtx, component)

      expect(mockCtx.createLinearGradient).toHaveBeenCalled()
    })
  })

  describe('Function Export', () => {
    it('should export drawCapacitor as a function', () => {
      expect(typeof drawCapacitor).toBe('function')
    })

    it('should accept two parameters (ctx, component)', () => {
      expect(drawCapacitor.length).toBe(2)
    })
  })
})
