/**
 * ComponentRendering.test.js - Unit tests for rendering utilities
 *
 * Tests the utility functions that support component rendering:
 * - drawGraphPaper: Grid background rendering
 * - drawWire: Wire connection rendering
 *
 * Note: Individual component renderers (BatteryRenderer, etc.) are pure
 * canvas drawing functions with no business logic, so they're not tested here.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { drawGraphPaper, drawWire } from '../ComponentRendering.js'

describe('ComponentRendering', () => {
  let mockCtx

  beforeEach(() => {
    mockCtx = {
      strokeStyle: '',
      lineWidth: 0,
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      setLineDash: vi.fn()
    }
  })

  describe('drawGraphPaper', () => {
    it('should set correct stroke style for grid lines', () => {
      drawGraphPaper(mockCtx, 100, 100)

      expect(mockCtx.strokeStyle).toBe('#E0E0E0')
    })

    it('should set correct line width for grid lines', () => {
      drawGraphPaper(mockCtx, 100, 100)

      expect(mockCtx.lineWidth).toBe(0.5)
    })

    it('should draw vertical lines spanning full height', () => {
      const height = 200
      drawGraphPaper(mockCtx, 100, height)

      // Should have vertical lines from top (y=0) to bottom (y=height)
      const hasVerticalLines = mockCtx.lineTo.mock.calls.some(
        call => call[1] === height
      )

      expect(hasVerticalLines).toBe(true)
    })

    it('should draw horizontal lines spanning full width', () => {
      const width = 300
      drawGraphPaper(mockCtx, width, 100)

      // Should have horizontal lines from left (x=0) to right (x=width)
      const hasHorizontalLines = mockCtx.lineTo.mock.calls.some(
        call => call[0] === width
      )

      expect(hasHorizontalLines).toBe(true)
    })

    it('should draw vertical lines from top to bottom', () => {
      const height = 200
      drawGraphPaper(mockCtx, 100, height)

      // First vertical line should go from (0,0) to (0,200)
      const firstVerticalStart = mockCtx.moveTo.mock.calls.find(
        call => call[0] === 0 && call[1] === 0
      )
      const firstVerticalEnd = mockCtx.lineTo.mock.calls.find(
        call => call[0] === 0 && call[1] === height
      )

      expect(firstVerticalStart).toBeDefined()
      expect(firstVerticalEnd).toBeDefined()
    })

    it('should draw horizontal lines from left to right', () => {
      const width = 200
      drawGraphPaper(mockCtx, width, 100)

      // First horizontal line should go from (0,0) to (200,0)
      const firstHorizontalStart = mockCtx.moveTo.mock.calls.find(
        call => call[0] === 0 && call[1] === 0
      )
      const firstHorizontalEnd = mockCtx.lineTo.mock.calls.find(
        call => call[0] === width && call[1] === 0
      )

      expect(firstHorizontalStart).toBeDefined()
      expect(firstHorizontalEnd).toBeDefined()
    })

    it('should call stroke for each line drawn', () => {
      drawGraphPaper(mockCtx, 100, 100)

      // Width 100: x < 100, x += 20 → 5 vertical (0, 20, 40, 60, 80)
      // Height 100: y < 100, y += 20 → 5 horizontal (0, 20, 40, 60, 80)
      expect(mockCtx.stroke).toHaveBeenCalledTimes(10)
    })

    it('should handle large canvas dimensions', () => {
      drawGraphPaper(mockCtx, 1000, 800)

      // 1000/20 = 50 vertical (0-980) + 800/20 = 40 horizontal (0-780) = 90 lines
      expect(mockCtx.stroke).toHaveBeenCalledTimes(90)
    })

    it('should handle small canvas dimensions', () => {
      drawGraphPaper(mockCtx, 40, 60)

      // 40/20 = 2 vertical (0, 20) + 60/20 = 3 horizontal (0, 20, 40) = 5 lines
      expect(mockCtx.stroke).toHaveBeenCalledTimes(5)
    })

    it('should begin new path for each line', () => {
      drawGraphPaper(mockCtx, 100, 100)

      // Should call beginPath for each of the 10 lines (5 vertical + 5 horizontal)
      expect(mockCtx.beginPath).toHaveBeenCalledTimes(10)
    })
  })

  describe('drawWire', () => {
    const createComponents = () => [
      { id: 1, x: 100, y: 150, type: 'battery' },
      { id: 2, x: 300, y: 250, type: 'led' }
    ]

    it('should set correct stroke style for wire', () => {
      const wire = { from: 1, to: 2 }
      const components = createComponents()

      drawWire(mockCtx, wire, components)

      expect(mockCtx.strokeStyle).toBe('#2C3E50')
    })

    it('should set correct line width for wire', () => {
      const wire = { from: 1, to: 2 }
      const components = createComponents()

      drawWire(mockCtx, wire, components)

      expect(mockCtx.lineWidth).toBe(2)
    })

    it('should set dashed line pattern', () => {
      const wire = { from: 1, to: 2 }
      const components = createComponents()

      drawWire(mockCtx, wire, components)

      expect(mockCtx.setLineDash).toHaveBeenCalledWith([5, 3])
    })

    it('should reset line dash after drawing', () => {
      const wire = { from: 1, to: 2 }
      const components = createComponents()

      drawWire(mockCtx, wire, components)

      // Should be called twice: once to set [5,3], once to reset []
      expect(mockCtx.setLineDash).toHaveBeenCalledWith([])
    })

    it('should draw line from source component to target component', () => {
      const wire = { from: 1, to: 2 }
      const components = createComponents()

      drawWire(mockCtx, wire, components)

      expect(mockCtx.moveTo).toHaveBeenCalledWith(100, 150)
      expect(mockCtx.lineTo).toHaveBeenCalledWith(300, 250)
    })

    it('should handle wire in reverse direction', () => {
      const wire = { from: 2, to: 1 }
      const components = createComponents()

      drawWire(mockCtx, wire, components)

      expect(mockCtx.moveTo).toHaveBeenCalledWith(300, 250)
      expect(mockCtx.lineTo).toHaveBeenCalledWith(100, 150)
    })

    it('should not draw if source component missing', () => {
      const wire = { from: 999, to: 2 }
      const components = createComponents()

      drawWire(mockCtx, wire, components)

      expect(mockCtx.beginPath).not.toHaveBeenCalled()
      expect(mockCtx.stroke).not.toHaveBeenCalled()
    })

    it('should not draw if target component missing', () => {
      const wire = { from: 1, to: 999 }
      const components = createComponents()

      drawWire(mockCtx, wire, components)

      expect(mockCtx.beginPath).not.toHaveBeenCalled()
      expect(mockCtx.stroke).not.toHaveBeenCalled()
    })

    it('should not draw if both components missing', () => {
      const wire = { from: 999, to: 888 }
      const components = createComponents()

      drawWire(mockCtx, wire, components)

      expect(mockCtx.beginPath).not.toHaveBeenCalled()
      expect(mockCtx.stroke).not.toHaveBeenCalled()
    })

    it('should handle wire connecting component to itself', () => {
      const wire = { from: 1, to: 1 }
      const components = createComponents()

      drawWire(mockCtx, wire, components)

      // Should draw from component to same position
      expect(mockCtx.moveTo).toHaveBeenCalledWith(100, 150)
      expect(mockCtx.lineTo).toHaveBeenCalledWith(100, 150)
    })

    it('should call beginPath before drawing', () => {
      const wire = { from: 1, to: 2 }
      const components = createComponents()

      drawWire(mockCtx, wire, components)

      expect(mockCtx.beginPath).toHaveBeenCalledTimes(1)
    })

    it('should call stroke after drawing line', () => {
      const wire = { from: 1, to: 2 }
      const components = createComponents()

      drawWire(mockCtx, wire, components)

      expect(mockCtx.stroke).toHaveBeenCalledTimes(1)
    })

    it('should handle components with different positions', () => {
      const wire = { from: 1, to: 2 }
      const components = [
        { id: 1, x: 0, y: 0, type: 'battery' },
        { id: 2, x: 500, y: 400, type: 'led' }
      ]

      drawWire(mockCtx, wire, components)

      expect(mockCtx.moveTo).toHaveBeenCalledWith(0, 0)
      expect(mockCtx.lineTo).toHaveBeenCalledWith(500, 400)
    })

    it('should handle negative coordinates', () => {
      const wire = { from: 1, to: 2 }
      const components = [
        { id: 1, x: -50, y: -100, type: 'battery' },
        { id: 2, x: 50, y: 100, type: 'led' }
      ]

      drawWire(mockCtx, wire, components)

      expect(mockCtx.moveTo).toHaveBeenCalledWith(-50, -100)
      expect(mockCtx.lineTo).toHaveBeenCalledWith(50, 100)
    })

    it('should work with empty components array', () => {
      const wire = { from: 1, to: 2 }
      const components = []

      drawWire(mockCtx, wire, components)

      expect(mockCtx.beginPath).not.toHaveBeenCalled()
    })

    it('should find components by ID regardless of array position', () => {
      const wire = { from: 2, to: 1 }
      const components = [
        { id: 3, x: 999, y: 999, type: 'resistor' },
        { id: 1, x: 100, y: 150, type: 'battery' },
        { id: 5, x: 888, y: 888, type: 'capacitor' },
        { id: 2, x: 300, y: 250, type: 'led' }
      ]

      drawWire(mockCtx, wire, components)

      expect(mockCtx.moveTo).toHaveBeenCalledWith(300, 250)
      expect(mockCtx.lineTo).toHaveBeenCalledWith(100, 150)
    })
  })

  describe('Module Exports', () => {
    it('should export drawGraphPaper function', () => {
      expect(typeof drawGraphPaper).toBe('function')
    })

    it('should export drawWire function', () => {
      expect(typeof drawWire).toBe('function')
    })
  })
})
