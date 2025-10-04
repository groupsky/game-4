/**
 * ComponentRendering - Re-exports component renderers
 *
 * Aggregates individual component rendering modules for convenient import.
 * Each component type has its own renderer module for better organization.
 */

export { drawBattery } from './renderers/BatteryRenderer.js'
export { drawLED } from './renderers/LEDRenderer.js'
export { drawResistor } from './renderers/ResistorRenderer.js'
export { drawCapacitor } from './renderers/CapacitorRenderer.js'
export { drawLightBulb } from './renderers/LightBulbRenderer.js'

/**
 * Draw grid paper background with faint lines
 */
export function drawGraphPaper(ctx, width, height) {
  ctx.strokeStyle = '#E0E0E0'
  ctx.lineWidth = 0.5

  // Vertical lines
  for (let x = 0; x < width; x += 20) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  // Horizontal lines
  for (let y = 0; y < height; y += 20) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
}

/**
 * Draw wire connection between components
 */
export function drawWire(ctx, wire, components) {
  const fromComponent = components.find(c => c.id === wire.from)
  const toComponent = components.find(c => c.id === wire.to)

  if (!fromComponent || !toComponent) return

  ctx.strokeStyle = '#2C3E50'
  ctx.lineWidth = 2
  ctx.setLineDash([5, 3])

  ctx.beginPath()
  ctx.moveTo(fromComponent.x, fromComponent.y)
  ctx.lineTo(toComponent.x, toComponent.y)
  ctx.stroke()

  ctx.setLineDash([])
}
