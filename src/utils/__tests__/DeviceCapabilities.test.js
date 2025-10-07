import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DeviceCapabilities } from '../DeviceCapabilities'

describe('DeviceCapabilities', () => {
  let matchMediaMock
  let navigatorMock

  beforeEach(() => {
    // Reset mocks before each test
    matchMediaMock = vi.fn()
    navigatorMock = {}

    global.window = {
      matchMedia: matchMediaMock,
      innerWidth: 1024,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }

    global.navigator = navigatorMock
  })

  describe('pointer precision detection', () => {
    it('should detect fine pointer (mouse)', () => {
      matchMediaMock.mockImplementation((query) => {
        if (query === '(pointer: fine)') return { matches: true }
        if (query === '(pointer: coarse)') return { matches: false }
        return { matches: false }
      })

      const caps = new DeviceCapabilities()

      expect(caps.hasFinePointer).toBe(true)
      expect(caps.hasCoarsePointer).toBe(false)
      expect(caps.pointerType).toBe('fine')
    })

    it('should detect coarse pointer (touch)', () => {
      matchMediaMock.mockImplementation((query) => {
        if (query === '(pointer: fine)') return { matches: false }
        if (query === '(pointer: coarse)') return { matches: true }
        return { matches: false }
      })

      const caps = new DeviceCapabilities()

      expect(caps.hasFinePointer).toBe(false)
      expect(caps.hasCoarsePointer).toBe(true)
      expect(caps.pointerType).toBe('coarse')
    })

    it('should handle hybrid devices (both pointers)', () => {
      matchMediaMock.mockImplementation((query) => {
        if (query === '(pointer: fine)') return { matches: true }
        if (query === '(pointer: coarse)') return { matches: true }
        return { matches: false }
      })

      const caps = new DeviceCapabilities()

      expect(caps.hasFinePointer).toBe(true)
      expect(caps.hasCoarsePointer).toBe(true)
      expect(caps.pointerType).toBe('fine') // Prefers fine when both
    })
  })

  describe('multi-touch detection', () => {
    it('should detect multi-touch support', () => {
      navigatorMock.maxTouchPoints = 10

      matchMediaMock.mockReturnValue({ matches: false })

      const caps = new DeviceCapabilities()

      expect(caps.maxTouchPoints).toBe(10)
      expect(caps.hasMultiTouch).toBe(true)
    })

    it('should detect single-touch devices', () => {
      navigatorMock.maxTouchPoints = 1

      matchMediaMock.mockReturnValue({ matches: false })

      const caps = new DeviceCapabilities()

      expect(caps.maxTouchPoints).toBe(1)
      expect(caps.hasMultiTouch).toBe(false)
    })

    it('should handle devices with no touch', () => {
      navigatorMock.maxTouchPoints = 0

      matchMediaMock.mockReturnValue({ matches: false })

      const caps = new DeviceCapabilities()

      expect(caps.maxTouchPoints).toBe(0)
      expect(caps.hasMultiTouch).toBe(false)
    })

    it('should handle undefined maxTouchPoints', () => {
      navigatorMock.maxTouchPoints = undefined

      matchMediaMock.mockReturnValue({ matches: false })

      const caps = new DeviceCapabilities()

      expect(caps.maxTouchPoints).toBe(0)
      expect(caps.hasMultiTouch).toBe(false)
    })
  })

  describe('hover detection', () => {
    it('should detect hover capability', () => {
      matchMediaMock.mockImplementation((query) => {
        if (query === '(hover: hover)') return { matches: true }
        return { matches: false }
      })

      const caps = new DeviceCapabilities()

      expect(caps.hasHover).toBe(true)
    })

    it('should detect no hover capability', () => {
      matchMediaMock.mockImplementation((query) => {
        if (query === '(hover: hover)') return { matches: false }
        return { matches: false }
      })

      const caps = new DeviceCapabilities()

      expect(caps.hasHover).toBe(false)
    })
  })

  describe('viewport size detection', () => {
    it('should detect small viewport', () => {
      global.window.innerWidth = 600
      matchMediaMock.mockReturnValue({ matches: false })

      const caps = new DeviceCapabilities()

      expect(caps.viewportWidth).toBe(600)
      expect(caps.viewportSize).toBe('small')
    })

    it('should detect medium viewport', () => {
      global.window.innerWidth = 900
      matchMediaMock.mockReturnValue({ matches: false })

      const caps = new DeviceCapabilities()

      expect(caps.viewportWidth).toBe(900)
      expect(caps.viewportSize).toBe('medium')
    })

    it('should detect large viewport', () => {
      global.window.innerWidth = 1920
      matchMediaMock.mockReturnValue({ matches: false })

      const caps = new DeviceCapabilities()

      expect(caps.viewportWidth).toBe(1920)
      expect(caps.viewportSize).toBe('large')
    })
  })

  describe('adaptive sizing', () => {
    it('should return large touch targets for coarse pointer', () => {
      matchMediaMock.mockImplementation((query) => {
        if (query === '(pointer: coarse)') return { matches: true }
        return { matches: false }
      })

      const caps = new DeviceCapabilities()

      expect(caps.getTouchTargetSize()).toBe(60)
      expect(caps.getComponentScale()).toBe(1.5)
      expect(caps.getSnapRadius()).toBe(60)
    })

    it('should return small touch targets for fine pointer', () => {
      matchMediaMock.mockImplementation((query) => {
        if (query === '(pointer: fine)') return { matches: true }
        return { matches: false }
      })

      const caps = new DeviceCapabilities()

      expect(caps.getTouchTargetSize()).toBe(32)
      expect(caps.getComponentScale()).toBe(1.0)
      expect(caps.getSnapRadius()).toBe(30)
    })
  })

  describe('feature support detection', () => {
    it('should support shift+drag for fine pointer with keyboard', () => {
      matchMediaMock.mockImplementation((query) => {
        if (query === '(pointer: fine)') return { matches: true }
        return { matches: false }
      })

      const caps = new DeviceCapabilities()
      caps.hasKeyboard = true

      expect(caps.supportsShiftDrag()).toBe(true)
    })

    it('should not support shift+drag for coarse pointer', () => {
      matchMediaMock.mockImplementation((query) => {
        if (query === '(pointer: coarse)') return { matches: true }
        return { matches: false }
      })

      const caps = new DeviceCapabilities()
      caps.hasKeyboard = true

      expect(caps.supportsShiftDrag()).toBe(false)
    })

    it('should always support click-sequence wiring', () => {
      matchMediaMock.mockReturnValue({ matches: false })

      const caps = new DeviceCapabilities()

      expect(caps.supportsClickSequence()).toBe(true)
    })

    it('should support ctrl+click for fine pointer with keyboard', () => {
      matchMediaMock.mockImplementation((query) => {
        if (query === '(pointer: fine)') return { matches: true }
        return { matches: false }
      })

      const caps = new DeviceCapabilities()
      caps.hasKeyboard = true

      expect(caps.supportsCtrlClick()).toBe(true)
    })

    it('should support drag-box for fine pointer', () => {
      matchMediaMock.mockImplementation((query) => {
        if (query === '(pointer: fine)') return { matches: true }
        return { matches: false }
      })

      const caps = new DeviceCapabilities()

      expect(caps.supportsDragBox()).toBe(true)
    })

    it('should support double-tap multi-select for coarse pointer', () => {
      matchMediaMock.mockImplementation((query) => {
        if (query === '(pointer: coarse)') return { matches: true }
        return { matches: false }
      })

      const caps = new DeviceCapabilities()

      expect(caps.supportsDoubleTapMultiSelect()).toBe(true)
    })

    it('should support pinch zoom for multi-touch', () => {
      navigatorMock.maxTouchPoints = 5
      matchMediaMock.mockReturnValue({ matches: false })

      const caps = new DeviceCapabilities()

      expect(caps.supportsPinchZoom()).toBe(true)
    })

    it('should support scroll wheel zoom for fine pointer', () => {
      matchMediaMock.mockImplementation((query) => {
        if (query === '(pointer: fine)') return { matches: true }
        return { matches: false }
      })

      const caps = new DeviceCapabilities()

      expect(caps.supportsScrollWheelZoom()).toBe(true)
    })
  })

  describe('keyboard detection', () => {
    it('should initially have no keyboard detected', () => {
      matchMediaMock.mockReturnValue({ matches: false })

      const caps = new DeviceCapabilities()

      expect(caps.hasKeyboard).toBe(false)
    })

    it('should detect keyboard on keyboard event', () => {
      matchMediaMock.mockReturnValue({ matches: false })

      const caps = new DeviceCapabilities()
      caps.onKeyboardEvent()

      expect(caps.hasKeyboard).toBe(true)
    })

    it('should timeout keyboard detection after 5 seconds', async () => {
      vi.useFakeTimers()
      matchMediaMock.mockReturnValue({ matches: false })

      const caps = new DeviceCapabilities()
      caps.onKeyboardEvent()

      expect(caps.hasKeyboard).toBe(true)

      vi.advanceTimersByTime(5000)

      expect(caps.hasKeyboard).toBe(false)

      vi.useRealTimers()
    })

    it('should reset timeout on subsequent keyboard events', async () => {
      vi.useFakeTimers()
      matchMediaMock.mockReturnValue({ matches: false })

      const caps = new DeviceCapabilities()
      caps.onKeyboardEvent()

      vi.advanceTimersByTime(3000)
      expect(caps.hasKeyboard).toBe(true)

      caps.onKeyboardEvent() // Reset timeout

      vi.advanceTimersByTime(3000)
      expect(caps.hasKeyboard).toBe(true) // Still active

      vi.advanceTimersByTime(2000) // Total 5s since last event
      expect(caps.hasKeyboard).toBe(false)

      vi.useRealTimers()
    })
  })
})
