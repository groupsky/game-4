/**
 * CanvasZoom - Handles pan, zoom, and coordinate transformations for mobile canvas
 *
 * Features:
 * - Pinch-to-zoom (2-finger pinch/spread)
 * - Pan (2-finger drag)
 * - Double-tap to zoom
 * - Coordinate transformation (screen ↔ canvas)
 */

export class CanvasZoom {
  constructor() {
    this.scale = 1.0
    this.offsetX = 0
    this.offsetY = 0
    this.minScale = 0.5
    this.maxScale = 3.0

    // Touch gesture tracking
    this.lastTouchDistance = 0
    this.lastTouchCenter = { x: 0, y: 0 }
    this.lastTap = 0
    this.doubleTapDelay = 300
  }

  /**
   * Transform screen coordinates to canvas coordinates
   */
  screenToCanvas(screenX, screenY) {
    return {
      x: (screenX - this.offsetX) / this.scale,
      y: (screenY - this.offsetY) / this.scale
    }
  }

  /**
   * Transform canvas coordinates to screen coordinates
   */
  canvasToScreen(canvasX, canvasY) {
    return {
      x: canvasX * this.scale + this.offsetX,
      y: canvasY * this.scale + this.offsetY
    }
  }

  /**
   * Apply transformations to canvas context
   */
  applyTransform(ctx) {
    ctx.save()
    ctx.translate(this.offsetX, this.offsetY)
    ctx.scale(this.scale, this.scale)
  }

  /**
   * Restore canvas context after transform
   */
  restoreTransform(ctx) {
    ctx.restore()
  }

  /**
   * Get distance between two touch points
   */
  getTouchDistance(touch1, touch2) {
    const dx = touch2.clientX - touch1.clientX
    const dy = touch2.clientY - touch1.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  /**
   * Get center point between two touches
   */
  getTouchCenter(touch1, touch2) {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    }
  }

  /**
   * Handle pinch-to-zoom gesture
   */
  handlePinch(touch1, touch2, rect) {
    const distance = this.getTouchDistance(touch1, touch2)
    const center = this.getTouchCenter(touch1, touch2)

    // Convert center to canvas coordinates before zoom
    const canvasCenter = this.screenToCanvas(
      center.x - rect.left,
      center.y - rect.top
    )

    if (this.lastTouchDistance > 0) {
      // Calculate scale change
      const scaleChange = distance / this.lastTouchDistance
      const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale * scaleChange))

      // Zoom towards pinch center
      const scaleDelta = newScale - this.scale
      this.offsetX -= canvasCenter.x * scaleDelta
      this.offsetY -= canvasCenter.y * scaleDelta
      this.scale = newScale
    }

    this.lastTouchDistance = distance
    this.lastTouchCenter = center
  }

  /**
   * Handle pan gesture (2-finger drag)
   */
  handlePan(touch1, touch2) {
    const center = this.getTouchCenter(touch1, touch2)

    if (this.lastTouchCenter.x !== 0) {
      const dx = center.x - this.lastTouchCenter.x
      const dy = center.y - this.lastTouchCenter.y
      this.offsetX += dx
      this.offsetY += dy
    }

    this.lastTouchCenter = center
  }

  /**
   * Handle double-tap to zoom
   */
  handleDoubleTap(x, y, rect) {
    const now = Date.now()

    if (now - this.lastTap < this.doubleTapDelay) {
      // Double tap detected
      const canvasPoint = this.screenToCanvas(x - rect.left, y - rect.top)

      if (this.scale > 1.5) {
        // Zoom out to 1.0
        const targetScale = 1.0
        const scaleDelta = targetScale - this.scale
        this.offsetX -= canvasPoint.x * scaleDelta
        this.offsetY -= canvasPoint.y * scaleDelta
        this.scale = targetScale
      } else {
        // Zoom in to 2.0
        const targetScale = 2.0
        const scaleDelta = targetScale - this.scale
        this.offsetX -= canvasPoint.x * scaleDelta
        this.offsetY -= canvasPoint.y * scaleDelta
        this.scale = targetScale
      }

      this.lastTap = 0 // Reset to prevent triple-tap
    } else {
      this.lastTap = now
    }
  }

  /**
   * Reset zoom state
   */
  resetGesture() {
    this.lastTouchDistance = 0
    this.lastTouchCenter = { x: 0, y: 0 }
  }

  /**
   * Reset to default view
   */
  reset() {
    this.scale = 1.0
    this.offsetX = 0
    this.offsetY = 0
  }

  /**
   * Center canvas view
   */
  centerView(canvasWidth, canvasHeight) {
    this.offsetX = 0
    this.offsetY = 0
    this.scale = 1.0
  }
}
