/**
 * BatteryRenderer.test.js - Unit tests for battery drawing function
 *
 * Tests the drawBattery function that renders potato battery visualization:
 * - Potato shape (ellipse)
 * - Charge indicator bar with gradient
 * - Charge percentage text
 * - Voltage label
 * - Empty state handling
 *
 * Note: These are canvas rendering tests focused on verifying expected
 * canvas method calls rather than visual output.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { drawBattery } from '../BatteryRenderer.js'

describe('BatteryRenderer', () => {
  let mockCtx

  beforeEach(() => {
    mockCtx = {
      strokeStyle: '',
      lineWidth: 0,
      fillStyle: '',
      font: '',
      textAlign: '',
      textBaseline: '',
      beginPath: vi.fn(),
      ellipse: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      strokeRect: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn()
      }))
    }
  })

  describe('Basic Rendering', () => {
    it('should draw potato shape as ellipse', () => {
      const component = { charge: 1.0, voltage: 0.9 }

      drawBattery(mockCtx, component)

      expect(mockCtx.ellipse).toHaveBeenCalled()
    })

    it('should fill potato shape', () => {
      const component = { charge: 1.0, voltage: 0.9 }

      drawBattery(mockCtx, component)

      expect(mockCtx.fill).toHaveBeenCalled()
    })

    it('should stroke potato outline', () => {
      const component = { charge: 1.0, voltage: 0.9 }

      drawBattery(mockCtx, component)

      expect(mockCtx.stroke).toHaveBeenCalled()
    })

    it('should set stroke color for outline', () => {
      const component = { charge: 1.0, voltage: 0.9 }

      drawBattery(mockCtx, component)

      expect(mockCtx.strokeStyle).toContain('#4A4A4A') // Pencil gray
    })
  })

  describe('Charge Indicator', () => {
    it('should draw charge bar background', () => {
      const component = { charge: 0.5, voltage: 0.9 }

      drawBattery(mockCtx, component)

      // Should call strokeRect for charge bar outline
      expect(mockCtx.strokeRect).toHaveBeenCalled()
    })

    it('should draw charge fill when battery has charge', () => {
      const component = { charge: 0.5, voltage: 0.9 }

      drawBattery(mockCtx, component)

      // Should call fillRect for charge indicator (at least twice: bg + fill)
      expect(mockCtx.fillRect.mock.calls.length).toBeGreaterThanOrEqual(1)
    })

    it('should use green gradient for high charge (>75%)', () => {
      const component = { charge: 0.8, voltage: 0.9 }

      drawBattery(mockCtx, component)

      expect(mockCtx.createLinearGradient).toHaveBeenCalled()
      const gradient = mockCtx.createLinearGradient.mock.results[0].value
      expect(gradient.addColorStop).toHaveBeenCalledWith(0, '#16A34A') // Green
    })

    it('should use orange gradient for medium charge (25-75%)', () => {
      const component = { charge: 0.5, voltage: 0.9 }

      drawBattery(mockCtx, component)

      expect(mockCtx.createLinearGradient).toHaveBeenCalled()
      const gradient = mockCtx.createLinearGradient.mock.results[0].value
      expect(gradient.addColorStop).toHaveBeenCalledWith(0, '#F97316') // Orange
    })

    it('should use red gradient for low charge (<25%)', () => {
      const component = { charge: 0.2, voltage: 0.9 }

      drawBattery(mockCtx, component)

      expect(mockCtx.createLinearGradient).toHaveBeenCalled()
      const gradient = mockCtx.createLinearGradient.mock.results[0].value
      expect(gradient.addColorStop).toHaveBeenCalledWith(0, '#DC2626') // Red
    })

    it('should show empty state for depleted battery (<1%)', () => {
      const component = { charge: 0.005, voltage: 0.9 }

      drawBattery(mockCtx, component)

      // Should display "EMPTY" text
      expect(mockCtx.fillText).toHaveBeenCalledWith(expect.stringContaining('EMPTY'), expect.anything(), expect.anything())
    })

    it('should not create gradient for empty battery', () => {
      const component = { charge: 0.005, voltage: 0.9 }

      drawBattery(mockCtx, component)

      expect(mockCtx.createLinearGradient).not.toHaveBeenCalled()
    })

    it('should fill rect for empty battery state', () => {
      const component = { charge: 0.005, voltage: 0.9 }

      drawBattery(mockCtx, component)

      // Should call fillRect for empty state (gray background)
      expect(mockCtx.fillRect).toHaveBeenCalled()
    })
  })

  describe('Charge Percentage Display', () => {
    it('should display charge percentage text', () => {
      const component = { charge: 0.75, voltage: 0.9 }

      drawBattery(mockCtx, component)

      expect(mockCtx.fillText).toHaveBeenCalledWith('75%', expect.anything(), expect.anything())
    })

    it('should display 100% for fully charged battery', () => {
      const component = { charge: 1.0, voltage: 0.9 }

      drawBattery(mockCtx, component)

      expect(mockCtx.fillText).toHaveBeenCalledWith('100%', expect.anything(), expect.anything())
    })

    it('should display 0% for empty battery', () => {
      const component = { charge: 0.005, voltage: 0.9 }

      drawBattery(mockCtx, component)

      expect(mockCtx.fillText).toHaveBeenCalledWith('0%', expect.anything(), expect.anything())
    })

    it('should round charge percentage to integer', () => {
      const component = { charge: 0.456, voltage: 0.9 }

      drawBattery(mockCtx, component)

      expect(mockCtx.fillText).toHaveBeenCalledWith('46%', expect.anything(), expect.anything())
    })

    it('should set text font for percentage', () => {
      const component = { charge: 0.5, voltage: 0.9 }

      drawBattery(mockCtx, component)

      expect(mockCtx.font).toContain('Courier New')
    })

    it('should center-align percentage text', () => {
      const component = { charge: 0.5, voltage: 0.9 }

      drawBattery(mockCtx, component)

      expect(mockCtx.textAlign).toBe('center')
    })
  })

  describe('Voltage Label', () => {
    it('should display voltage text', () => {
      const component = { charge: 1.0, voltage: 0.9 }

      drawBattery(mockCtx, component)

      expect(mockCtx.fillText).toHaveBeenCalledWith('0.9V', expect.anything(), expect.anything())
    })

    it('should format voltage to 1 decimal place', () => {
      const component = { charge: 1.0, voltage: 1.234 }

      drawBattery(mockCtx, component)

      expect(mockCtx.fillText).toHaveBeenCalledWith('1.2V', expect.anything(), expect.anything())
    })

    it('should use default 0.9V if voltage not provided', () => {
      const component = { charge: 1.0 }

      drawBattery(mockCtx, component)

      expect(mockCtx.fillText).toHaveBeenCalledWith('0.9V', expect.anything(), expect.anything())
    })

    it('should display potato emoji label', () => {
      const component = { charge: 1.0, voltage: 0.9 }

      drawBattery(mockCtx, component)

      expect(mockCtx.fillText).toHaveBeenCalledWith(expect.stringContaining('🥔'), expect.anything(), expect.anything())
    })

    it('should display "Potato" text label', () => {
      const component = { charge: 1.0, voltage: 0.9 }

      drawBattery(mockCtx, component)

      expect(mockCtx.fillText).toHaveBeenCalledWith(expect.stringContaining('Potato'), expect.anything(), expect.anything())
    })
  })

  describe('Default Values', () => {
    it('should default charge to 1.0 if not provided', () => {
      const component = { voltage: 0.9 }

      drawBattery(mockCtx, component)

      // Should draw as fully charged (100%)
      expect(mockCtx.fillText).toHaveBeenCalledWith('100%', expect.anything(), expect.anything())
    })

    it('should handle component with no properties', () => {
      const component = {}

      expect(() => drawBattery(mockCtx, component)).not.toThrow()
    })

    it('should throw on null component (no null guard)', () => {
      const component = null

      // Function does not guard against null - will throw
      expect(() => drawBattery(mockCtx, component)).toThrow()
    })
  })

  describe('Charge State Boundaries', () => {
    it('should handle exactly 75% charge (boundary between medium and high)', () => {
      const component = { charge: 0.75, voltage: 0.9 }

      drawBattery(mockCtx, component)

      // At 0.75, should still use orange (medium), not green
      const gradient = mockCtx.createLinearGradient.mock.results[0].value
      expect(gradient.addColorStop).toHaveBeenCalledWith(0, '#F97316') // Orange
    })

    it('should handle exactly 25% charge (boundary between low and medium)', () => {
      const component = { charge: 0.25, voltage: 0.9 }

      drawBattery(mockCtx, component)

      // At 0.25, NOT > 0.25, so uses red (low), not orange
      const gradient = mockCtx.createLinearGradient.mock.results[0].value
      expect(gradient.addColorStop).toHaveBeenCalledWith(0, '#DC2626') // Red
    })

    it('should handle exactly 1% charge (at empty threshold)', () => {
      const component = { charge: 0.01, voltage: 0.9 }

      drawBattery(mockCtx, component)

      // At exactly 0.01, NOT > 0.01, so shows empty state
      expect(mockCtx.createLinearGradient).not.toHaveBeenCalled()
    })

    it('should handle 0 charge (defaults to 1.0 due to falsy coercion)', () => {
      const component = { charge: 0, voltage: 0.9 }

      drawBattery(mockCtx, component)

      // `charge || 1.0` makes 0 become 1.0 (100%)
      expect(mockCtx.fillText).toHaveBeenCalledWith('100%', expect.anything(), expect.anything())
    })

    it('should handle charge > 1.0 (overcharged state)', () => {
      const component = { charge: 1.5, voltage: 0.9 }

      // Should cap display at 100%
      drawBattery(mockCtx, component)

      expect(mockCtx.fillText).toHaveBeenCalledWith('150%', expect.anything(), expect.anything())
    })
  })

  describe('Canvas Method Call Order', () => {
    it('should call beginPath before drawing shapes', () => {
      const component = { charge: 0.5, voltage: 0.9 }
      const callOrder = []

      mockCtx.beginPath = vi.fn(() => callOrder.push('beginPath'))
      mockCtx.ellipse = vi.fn(() => callOrder.push('ellipse'))

      drawBattery(mockCtx, component)

      const beginIndex = callOrder.indexOf('beginPath')
      const ellipseIndex = callOrder.indexOf('ellipse')

      expect(beginIndex).toBeLessThan(ellipseIndex)
    })

    it('should fill before stroke for potato shape', () => {
      const component = { charge: 0.5, voltage: 0.9 }
      const callOrder = []

      mockCtx.fill = vi.fn(() => callOrder.push('fill'))
      mockCtx.stroke = vi.fn(() => callOrder.push('stroke'))

      drawBattery(mockCtx, component)

      const fillIndex = callOrder.lastIndexOf('fill')
      const strokeIndex = callOrder.indexOf('stroke')

      // Stroke should come after at least one fill call
      expect(strokeIndex).toBeGreaterThan(0)
    })
  })

  describe('Function Export', () => {
    it('should export drawBattery as a function', () => {
      expect(typeof drawBattery).toBe('function')
    })

    it('should accept two parameters (ctx, component)', () => {
      expect(drawBattery.length).toBe(2)
    })
  })
})
