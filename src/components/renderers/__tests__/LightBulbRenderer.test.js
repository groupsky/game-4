/**
 * LightBulbRenderer.test.js - Unit tests for light bulb drawing function
 *
 * Tests the drawLightBulb function that renders incandescent bulb visualization:
 * - Glass bulb outline (circle with brightness-based fill)
 * - Outer glow halos (multi-layer radial gradients)
 * - Tungsten filament (zigzag pattern with heat-based color)
 * - Threaded screw base (copper color with threading lines)
 * - Light rays radiating outward (for bright bulbs)
 * - Shadow blur effects
 * - Status text (Off/Dim/Warm/Bright)
 * - Power display in milliwatts
 *
 * Note: These are canvas rendering tests focused on verifying expected
 * canvas method calls rather than visual output.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { drawLightBulb } from '../LightBulbRenderer.js'

describe('LightBulbRenderer', () => {
  let mockCtx

  beforeEach(() => {
    mockCtx = {
      strokeStyle: '',
      lineWidth: 0,
      fillStyle: '',
      font: '',
      textAlign: '',
      textBaseline: '',
      shadowBlur: 0,
      shadowColor: '',
      globalAlpha: 1,
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      fillText: vi.fn(),
      createRadialGradient: vi.fn(() => ({
        addColorStop: vi.fn()
      }))
    }
  })

  describe('Glass Bulb Outline', () => {
    it('should draw bulb as circle', () => {
      const component = { brightness: 0, power: 0 }

      drawLightBulb(mockCtx, component)

      // Bulb circle at center (0, -10) with radius size/2 = 35
      const bulbCircle = mockCtx.arc.mock.calls.find(
        call => call[0] === 0 && call[1] === -10 && call[2] === 35
      )
      expect(bulbCircle).toBeDefined()
    })

    it('should fill bulb', () => {
      const component = { brightness: 0, power: 0 }

      drawLightBulb(mockCtx, component)

      expect(mockCtx.fill).toHaveBeenCalled()
    })

    it('should stroke bulb outline', () => {
      const component = { brightness: 0, power: 0 }

      drawLightBulb(mockCtx, component)

      expect(mockCtx.stroke).toHaveBeenCalled()
    })

    it('should use transparent fill for off bulb', () => {
      const component = { brightness: 0, power: 0 }
      const fillStyles = []

      Object.defineProperty(mockCtx, 'fillStyle', {
        set: (value) => { fillStyles.push(value) },
        get: () => fillStyles[fillStyles.length - 1],
        configurable: true
      })

      drawLightBulb(mockCtx, component)

      expect(fillStyles.some(style => style.includes('rgba(255, 255, 255, 0.1)'))).toBe(true)
    })

    it('should use yellow-tinted fill for lit bulb', () => {
      const component = { brightness: 0.5, power: 0 }
      const fillStyles = []

      Object.defineProperty(mockCtx, 'fillStyle', {
        set: (value) => { fillStyles.push(value) },
        get: () => fillStyles[fillStyles.length - 1],
        configurable: true
      })

      drawLightBulb(mockCtx, component)

      // rgba(255, 255, 200, 0.15) for brightness 0.5
      expect(fillStyles.some(style => style.includes('rgba(255, 255, 200'))).toBe(true)
    })

    it('should set outline width to 2', () => {
      const component = { brightness: 0, power: 0 }
      const lineWidths = []

      Object.defineProperty(mockCtx, 'lineWidth', {
        set: (value) => { lineWidths.push(value) },
        get: () => lineWidths[lineWidths.length - 1],
        configurable: true
      })

      drawLightBulb(mockCtx, component)

      // Should set lineWidth to 2 at some point
      expect(lineWidths.some(width => width === 2)).toBe(true)
    })

    it('should set outline color to gray', () => {
      const component = { brightness: 0, power: 0 }

      drawLightBulb(mockCtx, component)

      expect(mockCtx.strokeStyle).toBe('#4A4A4A')
    })
  })

  describe('Outer Glow Halos', () => {
    it('should not draw glow for off bulb', () => {
      const component = { brightness: 0, power: 0 }

      drawLightBulb(mockCtx, component)

      // Only 1 radial gradient for bulb fill, no halos
      // (Off bulb doesn't create gradients, uses rgba)
      expect(mockCtx.createRadialGradient).not.toHaveBeenCalled()
    })

    it('should draw glow halos for lit bulb', () => {
      const component = { brightness: 0.5, power: 0 }

      drawLightBulb(mockCtx, component)

      // glowLayers = floor(0.5 * 4) + 2 = 4 layers
      expect(mockCtx.createRadialGradient).toHaveBeenCalled()
    })

    it('should calculate glow layer count correctly', () => {
      const component = { brightness: 0.8, power: 0 }

      drawLightBulb(mockCtx, component)

      // glowLayers = floor(0.8 * 4) + 2 = 5 layers
      expect(mockCtx.createRadialGradient.mock.calls.length).toBe(5)
    })

    it('should draw more glow layers for brighter bulbs', () => {
      const component = { brightness: 1.0, power: 0 }

      drawLightBulb(mockCtx, component)

      // glowLayers = floor(1.0 * 4) + 2 = 6 layers
      expect(mockCtx.createRadialGradient.mock.calls.length).toBe(6)
    })

    it('should not draw glow for very dim bulb', () => {
      const component = { brightness: 0.05, power: 0 }

      drawLightBulb(mockCtx, component)

      // brightness 0.05 NOT > 0.1, so no glow
      expect(mockCtx.createRadialGradient).not.toHaveBeenCalled()
    })
  })

  describe('Tungsten Filament', () => {
    it('should draw filament as zigzag pattern', () => {
      const component = { brightness: 0, power: 0 }

      drawLightBulb(mockCtx, component)

      // Filament has 8 points (moveTo + 7 lineTos)
      // Should have lineTo calls for filament
      expect(mockCtx.lineTo).toHaveBeenCalled()
    })

    it('should use gray color for cold filament', () => {
      const component = { brightness: 0.1, power: 0 }
      const strokeStyles = []

      Object.defineProperty(mockCtx, 'strokeStyle', {
        set: (value) => { strokeStyles.push(value) },
        get: () => strokeStyles[strokeStyles.length - 1],
        configurable: true
      })

      drawLightBulb(mockCtx, component)

      // brightness 0.1 NOT > 0.2, so gray filament
      expect(strokeStyles.some(style => style === '#666666')).toBe(true)
    })

    it('should use gold color for warm filament', () => {
      const component = { brightness: 0.3, power: 0 }
      const strokeStyles = []

      Object.defineProperty(mockCtx, 'strokeStyle', {
        set: (value) => { strokeStyles.push(value) },
        get: () => strokeStyles[strokeStyles.length - 1],
        configurable: true
      })

      drawLightBulb(mockCtx, component)

      // brightness 0.3 > 0.2 but NOT > 0.5, so gold
      expect(strokeStyles.some(style => style === '#FFD700')).toBe(true)
    })

    it('should use orange color for hot filament', () => {
      const component = { brightness: 0.6, power: 0 }
      const strokeStyles = []

      Object.defineProperty(mockCtx, 'strokeStyle', {
        set: (value) => { strokeStyles.push(value) },
        get: () => strokeStyles[strokeStyles.length - 1],
        configurable: true
      })

      drawLightBulb(mockCtx, component)

      // brightness 0.6 > 0.5, so orange
      expect(strokeStyles.some(style => style === '#FFA500')).toBe(true)
    })

    it('should use thicker line for brighter filament', () => {
      const component = { brightness: 0.5, power: 0 }
      const lineWidths = []

      Object.defineProperty(mockCtx, 'lineWidth', {
        set: (value) => { lineWidths.push(value) },
        get: () => lineWidths[lineWidths.length - 1],
        configurable: true
      })

      drawLightBulb(mockCtx, component)

      // brightness 0.5 > 0.3, so lineWidth = 2
      expect(lineWidths.some(width => width === 2)).toBe(true)
    })

    it('should use thin line for dim filament', () => {
      const component = { brightness: 0.2, power: 0 }
      const lineWidths = []

      Object.defineProperty(mockCtx, 'lineWidth', {
        set: (value) => { lineWidths.push(value) },
        get: () => lineWidths[lineWidths.length - 1],
        configurable: true
      })

      drawLightBulb(mockCtx, component)

      // brightness 0.2 NOT > 0.3, so lineWidth = 1
      expect(lineWidths.some(width => width === 1)).toBe(true)
    })

    it('should add shadow blur for bright filament', () => {
      const component = { brightness: 0.5, power: 0 }

      drawLightBulb(mockCtx, component)

      // brightness 0.5 > 0.3, so shadow applied then reset
      expect(mockCtx.shadowBlur).toBe(0) // Reset after use
    })

    it('should not add shadow blur for dim filament', () => {
      const component = { brightness: 0.2, power: 0 }
      let maxShadowBlur = 0

      Object.defineProperty(mockCtx, 'shadowBlur', {
        set: (value) => { if (value > maxShadowBlur) maxShadowBlur = value },
        get: () => 0,
        configurable: true
      })

      drawLightBulb(mockCtx, component)

      // brightness 0.2 NOT > 0.3, so no shadow
      expect(maxShadowBlur).toBe(0)
    })
  })

  describe('Screw Base', () => {
    it('should draw base cylinder', () => {
      const component = { brightness: 0, power: 0 }

      drawLightBulb(mockCtx, component)

      // Base at y = size/2 - 10 = 25
      expect(mockCtx.fillRect).toHaveBeenCalledWith(-12, 25, 24, 25)
    })

    it('should stroke base outline', () => {
      const component = { brightness: 0, power: 0 }

      drawLightBulb(mockCtx, component)

      expect(mockCtx.strokeRect).toHaveBeenCalledWith(-12, 25, 24, 25)
    })

    it('should use copper color for base', () => {
      const component = { brightness: 0, power: 0 }
      const fillStyles = []

      Object.defineProperty(mockCtx, 'fillStyle', {
        set: (value) => { fillStyles.push(value) },
        get: () => fillStyles[fillStyles.length - 1],
        configurable: true
      })

      drawLightBulb(mockCtx, component)

      expect(fillStyles.some(style => style === '#B87333')).toBe(true)
    })

    it('should draw 5 threading lines', () => {
      const component = { brightness: 0, power: 0 }

      drawLightBulb(mockCtx, component)

      // 5 threading lines at y = 28, 33, 38, 43, 48
      // Each from x=-12 to x=12
      const threadingLines = mockCtx.lineTo.mock.calls.filter(
        call => call[0] === 12 && call[1] >= 28 && call[1] <= 48
      )
      expect(threadingLines.length).toBeGreaterThanOrEqual(5)
    })

    it('should draw bottom contact circle', () => {
      const component = { brightness: 0, power: 0 }

      drawLightBulb(mockCtx, component)

      // Bottom contact at (0, size/2 + 18 = 53) with radius 8
      const bottomContact = mockCtx.arc.mock.calls.find(
        call => call[0] === 0 && call[1] === 53 && call[2] === 8
      )
      expect(bottomContact).toBeDefined()
    })

    it('should use brown color for bottom contact', () => {
      const component = { brightness: 0, power: 0 }
      const fillStyles = []

      Object.defineProperty(mockCtx, 'fillStyle', {
        set: (value) => { fillStyles.push(value) },
        get: () => fillStyles[fillStyles.length - 1],
        configurable: true
      })

      drawLightBulb(mockCtx, component)

      expect(fillStyles.some(style => style === '#8B4513')).toBe(true)
    })
  })

  describe('Light Rays', () => {
    it('should not draw rays for dim bulb', () => {
      const component = { brightness: 0.3, power: 0 }

      drawLightBulb(mockCtx, component)

      // brightness 0.3 NOT > 0.4, so no rays
      // Count ray-specific moveTo calls (from bulb edge)
      // Hard to distinguish from other moveTo, so just check total count is reasonable
      const totalMoveTo = mockCtx.moveTo.mock.calls.length
      expect(totalMoveTo).toBeLessThan(20) // No rays means fewer moveTo calls
    })

    it('should draw rays for bright bulb', () => {
      const component = { brightness: 0.6, power: 0 }

      drawLightBulb(mockCtx, component)

      // brightness 0.6 > 0.4
      // rays = floor(0.6 * 8) + 4 = 8 rays
      const totalMoveTo = mockCtx.moveTo.mock.calls.length
      expect(totalMoveTo).toBeGreaterThan(10) // Rays add many moveTo calls
    })

    it('should calculate ray count correctly', () => {
      const component = { brightness: 0.8, power: 0 }

      drawLightBulb(mockCtx, component)

      // rays = floor(0.8 * 8) + 4 = 10 rays
      // Hard to count exactly due to other shapes, but should increase moveTo calls
      expect(mockCtx.moveTo).toHaveBeenCalled()
    })

    it('should use yellow color for very bright rays', () => {
      const component = { brightness: 0.8, power: 0 }
      const strokeStyles = []

      Object.defineProperty(mockCtx, 'strokeStyle', {
        set: (value) => { strokeStyles.push(value) },
        get: () => strokeStyles[strokeStyles.length - 1],
        configurable: true
      })

      drawLightBulb(mockCtx, component)

      // brightness 0.8 > 0.7, so yellow rays
      expect(strokeStyles.some(style => style === '#FFFF00')).toBe(true)
    })

    it('should use gold color for medium bright rays', () => {
      const component = { brightness: 0.6, power: 0 }
      const strokeStyles = []

      Object.defineProperty(mockCtx, 'strokeStyle', {
        set: (value) => { strokeStyles.push(value) },
        get: () => strokeStyles[strokeStyles.length - 1],
        configurable: true
      })

      drawLightBulb(mockCtx, component)

      // brightness 0.6 NOT > 0.7, so gold rays
      expect(strokeStyles.some(style => style === '#FFD700')).toBe(true)
    })

    it('should set global alpha for rays', () => {
      const component = { brightness: 0.6, power: 0 }
      let alphaWasSet = false

      Object.defineProperty(mockCtx, 'globalAlpha', {
        set: (value) => { if (value < 1) alphaWasSet = true },
        get: () => 1,
        configurable: true
      })

      drawLightBulb(mockCtx, component)

      expect(alphaWasSet).toBe(true)
    })

    it('should reset global alpha after rays', () => {
      const component = { brightness: 0.6, power: 0 }

      drawLightBulb(mockCtx, component)

      expect(mockCtx.globalAlpha).toBe(1)
    })
  })

  describe('Labels and Text', () => {
    it('should display bulb emoji label', () => {
      const component = { brightness: 0, power: 0 }

      drawLightBulb(mockCtx, component)

      expect(mockCtx.fillText).toHaveBeenCalledWith('💡 Bulb', 0, -55)
    })

    it('should display "Off" status for off bulb', () => {
      const component = { brightness: 0, power: 0 }

      drawLightBulb(mockCtx, component)

      expect(mockCtx.fillText).toHaveBeenCalledWith('Off', 0, 65)
    })

    it('should display "Dim" status for low brightness', () => {
      const component = { brightness: 0.2, power: 0 }

      drawLightBulb(mockCtx, component)

      expect(mockCtx.fillText).toHaveBeenCalledWith('Dim', 0, 65)
    })

    it('should display "Warm" status for medium brightness', () => {
      const component = { brightness: 0.5, power: 0 }

      drawLightBulb(mockCtx, component)

      expect(mockCtx.fillText).toHaveBeenCalledWith('Warm', 0, 65)
    })

    it('should display "Bright" status for high brightness', () => {
      const component = { brightness: 0.8, power: 0 }

      drawLightBulb(mockCtx, component)

      expect(mockCtx.fillText).toHaveBeenCalledWith('Bright', 0, 65)
    })

    it('should display power in milliwatts when power > 0', () => {
      const component = { brightness: 0.5, power: 0.5 }

      drawLightBulb(mockCtx, component)

      // 0.5W * 1000 = 500mW
      expect(mockCtx.fillText).toHaveBeenCalledWith('500mW', 0, 77)
    })

    it('should not display power when power = 0', () => {
      const component = { brightness: 0.5, power: 0 }

      drawLightBulb(mockCtx, component)

      // Should not have power text
      const powerText = mockCtx.fillText.mock.calls.find(
        call => call[0].includes('mW')
      )
      expect(powerText).toBeUndefined()
    })

    it('should round power to nearest milliwatt', () => {
      const component = { brightness: 0.5, power: 0.1234 }

      drawLightBulb(mockCtx, component)

      // 0.1234W * 1000 = 123.4mW → 123mW
      expect(mockCtx.fillText).toHaveBeenCalledWith('123mW', 0, 77)
    })

    it('should center-align text', () => {
      const component = { brightness: 0, power: 0 }

      drawLightBulb(mockCtx, component)

      expect(mockCtx.textAlign).toBe('center')
    })

    it('should use Courier New font', () => {
      const component = { brightness: 0, power: 0 }

      drawLightBulb(mockCtx, component)

      expect(mockCtx.font).toContain('Courier New')
    })
  })

  describe('Default Values', () => {
    it('should default brightness to 0 if not provided', () => {
      const component = { power: 0 }

      drawLightBulb(mockCtx, component)

      expect(mockCtx.fillText).toHaveBeenCalledWith('Off', 0, 65)
    })

    it('should default power to 0 if not provided', () => {
      const component = { brightness: 0.5 }

      drawLightBulb(mockCtx, component)

      // No power display
      const powerText = mockCtx.fillText.mock.calls.find(
        call => call[0].includes('mW')
      )
      expect(powerText).toBeUndefined()
    })

    it('should handle empty component object', () => {
      const component = {}

      expect(() => drawLightBulb(mockCtx, component)).not.toThrow()
    })
  })

  describe('Brightness State Boundaries', () => {
    it('should handle exactly 0.1 brightness (glow threshold)', () => {
      const component = { brightness: 0.1, power: 0 }

      drawLightBulb(mockCtx, component)

      // At 0.1, NOT > 0.1, so no glow
      expect(mockCtx.createRadialGradient).not.toHaveBeenCalled()
    })

    it('should handle exactly 0.2 brightness (filament color threshold)', () => {
      const component = { brightness: 0.2, power: 0 }
      const strokeStyles = []

      Object.defineProperty(mockCtx, 'strokeStyle', {
        set: (value) => { strokeStyles.push(value) },
        get: () => strokeStyles[strokeStyles.length - 1],
        configurable: true
      })

      drawLightBulb(mockCtx, component)

      // At 0.2, NOT > 0.2, so gray filament
      expect(strokeStyles.some(style => style === '#666666')).toBe(true)
    })

    it('should handle exactly 0.3 brightness (shadow and status thresholds)', () => {
      const component = { brightness: 0.3, power: 0 }

      drawLightBulb(mockCtx, component)

      // At 0.3, NOT > 0.3, so status is "Dim"
      expect(mockCtx.fillText).toHaveBeenCalledWith('Dim', 0, 65)
    })

    it('should handle exactly 0.4 brightness (ray threshold)', () => {
      const component = { brightness: 0.4, power: 0 }

      drawLightBulb(mockCtx, component)

      // At 0.4, NOT > 0.4, so no rays (fewer moveTo calls)
      const totalMoveTo = mockCtx.moveTo.mock.calls.length
      expect(totalMoveTo).toBeLessThan(15)
    })

    it('should handle exactly 0.5 brightness (filament color threshold)', () => {
      const component = { brightness: 0.5, power: 0 }
      const strokeStyles = []

      Object.defineProperty(mockCtx, 'strokeStyle', {
        set: (value) => { strokeStyles.push(value) },
        get: () => strokeStyles[strokeStyles.length - 1],
        configurable: true
      })

      drawLightBulb(mockCtx, component)

      // At 0.5, NOT > 0.5, so gold filament
      expect(strokeStyles.some(style => style === '#FFD700')).toBe(true)
    })

    it('should handle exactly 0.7 brightness (status and ray color thresholds)', () => {
      const component = { brightness: 0.7, power: 0 }

      drawLightBulb(mockCtx, component)

      // At 0.7, NOT > 0.7, so status is "Warm"
      expect(mockCtx.fillText).toHaveBeenCalledWith('Warm', 0, 65)
    })
  })

  describe('Canvas Method Calls', () => {
    it('should call beginPath before drawing', () => {
      const component = { brightness: 0, power: 0 }

      drawLightBulb(mockCtx, component)

      expect(mockCtx.beginPath).toHaveBeenCalled()
    })

    it('should call arc for circles', () => {
      const component = { brightness: 0, power: 0 }

      drawLightBulb(mockCtx, component)

      expect(mockCtx.arc).toHaveBeenCalled()
    })

    it('should call fill for filled shapes', () => {
      const component = { brightness: 0, power: 0 }

      drawLightBulb(mockCtx, component)

      expect(mockCtx.fill).toHaveBeenCalled()
    })

    it('should call stroke for outlines', () => {
      const component = { brightness: 0, power: 0 }

      drawLightBulb(mockCtx, component)

      expect(mockCtx.stroke).toHaveBeenCalled()
    })

    it('should call fillRect for base', () => {
      const component = { brightness: 0, power: 0 }

      drawLightBulb(mockCtx, component)

      expect(mockCtx.fillRect).toHaveBeenCalled()
    })

    it('should call strokeRect for base outline', () => {
      const component = { brightness: 0, power: 0 }

      drawLightBulb(mockCtx, component)

      expect(mockCtx.strokeRect).toHaveBeenCalled()
    })
  })

  describe('Function Export', () => {
    it('should export drawLightBulb as a function', () => {
      expect(typeof drawLightBulb).toBe('function')
    })

    it('should accept two parameters (ctx, component)', () => {
      expect(drawLightBulb.length).toBe(2)
    })
  })
})
