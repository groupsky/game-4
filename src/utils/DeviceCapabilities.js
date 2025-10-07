/**
 * DeviceCapabilities - Detects device capabilities for adaptive UX
 *
 * Capabilities detected:
 * - Pointer precision: coarse (touch) vs fine (mouse)
 * - Viewport size: small, medium, large
 * - Multi-touch: single-point vs multi-touch
 * - Hover: available vs not available
 * - Keyboard: available vs not available (detected by events)
 *
 * These capabilities are orthogonal and can combine in any way:
 * - Phone: coarse + small + multi + no-hover + no-keyboard
 * - Desktop: fine + large + single + hover + keyboard
 * - Touchscreen laptop: BOTH + large + multi + hover + keyboard
 */

export class DeviceCapabilities {
  constructor() {
    this.listeners = []
    this.detect()
    window.addEventListener('resize', () => this.detect())
  }

  /**
   * Detect all device capabilities
   */
  detect() {
    // Pointer precision
    this.hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches
    this.hasFinePointer = window.matchMedia('(pointer: fine)').matches
    // Prefer fine pointer on hybrid devices
    this.pointerType = this.hasFinePointer ? 'fine' : 'coarse'

    // Multi-touch
    this.maxTouchPoints = navigator.maxTouchPoints || 0
    this.hasMultiTouch = this.maxTouchPoints > 1

    // Hover capability
    this.hasHover = window.matchMedia('(hover: hover)').matches

    // Viewport size
    this.viewportWidth = window.innerWidth
    this.viewportSize =
      this.viewportWidth < 768 ? 'small' :
      this.viewportWidth < 1024 ? 'medium' : 'large'

    // Keyboard (initially false, detected by events)
    if (this.hasKeyboard === undefined) {
      this.hasKeyboard = false
    }

    this.notifyListeners()
  }

  /**
   * Called when keyboard event detected
   * Keyboard is assumed present for 5s after last event
   */
  onKeyboardEvent() {
    this.hasKeyboard = true
    clearTimeout(this.keyboardCheckTimeout)
    this.keyboardCheckTimeout = setTimeout(() => {
      this.hasKeyboard = false
      this.notifyListeners()
    }, 5000)
    this.notifyListeners()
  }

  /**
   * Get appropriate touch target size based on pointer type
   */
  getTouchTargetSize() {
    return this.hasCoarsePointer ? 60 : 32
  }

  /**
   * Get component rendering scale for pointer type
   */
  getComponentScale() {
    return this.hasCoarsePointer ? 1.5 : 1.0
  }

  /**
   * Get snap radius for selection/placement
   */
  getSnapRadius() {
    return this.hasCoarsePointer ? 60 : 30
  }

  /**
   * Check if Shift+drag wiring is supported
   * Requires fine pointer and keyboard
   */
  supportsShiftDrag() {
    return this.hasFinePointer && this.hasKeyboard
  }

  /**
   * Click-sequence wiring is always available
   */
  supportsClickSequence() {
    return true
  }

  /**
   * Check if Ctrl+click multi-select is supported
   * Requires fine pointer and keyboard
   */
  supportsCtrlClick() {
    return this.hasFinePointer && this.hasKeyboard
  }

  /**
   * Check if drag-box selection is supported
   * Requires fine pointer for precision
   */
  supportsDragBox() {
    return this.hasFinePointer
  }

  /**
   * Check if double-tap multi-select is supported
   * Available for coarse pointers
   */
  supportsDoubleTapMultiSelect() {
    return this.hasCoarsePointer
  }

  /**
   * Check if pinch-to-zoom is supported
   * Requires multi-touch capability
   */
  supportsPinchZoom() {
    return this.hasMultiTouch
  }

  /**
   * Check if scroll wheel zoom is supported
   * Requires fine pointer (mouse)
   */
  supportsScrollWheelZoom() {
    return this.hasFinePointer
  }

  /**
   * Add listener for capability changes
   */
  onChange(callback) {
    this.listeners.push(callback)
  }

  /**
   * Notify all listeners of capability changes
   */
  notifyListeners() {
    this.listeners.forEach(listener => listener(this))
  }

  /**
   * Clean up
   */
  destroy() {
    clearTimeout(this.keyboardCheckTimeout)
    window.removeEventListener('resize', this.detect)
  }
}

/**
 * Global singleton instance
 * Created lazily to avoid issues with testing
 */
let _deviceCapabilities = null

export function getDeviceCapabilities() {
  if (!_deviceCapabilities) {
    _deviceCapabilities = new DeviceCapabilities()
  }
  return _deviceCapabilities
}
