export function drawLightBulb(ctx, component) {
  const size = 70
  const brightness = component.brightness || 0
  const power = component.power || 0

  // Draw glass bulb (hand-drawn circle)
  ctx.strokeStyle = '#4A4A4A'
  ctx.lineWidth = 2

  // Bulb outline
  ctx.beginPath()
  ctx.arc(0, -10, size/2, 0, Math.PI * 2)
  ctx.fillStyle = brightness > 0 ? `rgba(255, 255, 200, ${brightness * 0.3})` : 'rgba(255, 255, 255, 0.1)'
  ctx.fill()
  ctx.stroke()

  // Draw outer glow when lit
  if (brightness > 0.1) {
    const glowLayers = Math.floor(brightness * 4) + 2
    for (let i = glowLayers; i > 0; i--) {
      const radius = size/2 + (i * 10)
      const alpha = (brightness / glowLayers) * (1 - i / glowLayers) * 0.4

      const gradient = ctx.createRadialGradient(0, -10, 0, 0, -10, radius)
      gradient.addColorStop(0, `rgba(255, 255, 150, ${alpha})`)
      gradient.addColorStop(0.5, `rgba(255, 240, 100, ${alpha * 0.5})`)
      gradient.addColorStop(1, `rgba(255, 220, 50, 0)`)

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(0, -10, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Draw tungsten filament
  ctx.strokeStyle = brightness > 0.5 ? '#FFA500' : brightness > 0.2 ? '#FFD700' : '#666666'
  ctx.lineWidth = brightness > 0.3 ? 2 : 1

  // Coiled filament (zigzag inside bulb)
  const filamentHeight = size * 0.5
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const y = -10 - filamentHeight/2 + (i / 7) * filamentHeight
    const x = (i % 2 === 0) ? -8 : 8
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // Filament glow
  if (brightness > 0.3) {
    ctx.shadowBlur = 15 * brightness
    ctx.shadowColor = '#FFD700'
    ctx.stroke()
    ctx.shadowBlur = 0
  }

  // Draw base (threaded screw base)
  ctx.fillStyle = '#B87333'  // Copper color
  ctx.strokeStyle = '#4A4A4A'
  ctx.lineWidth = 1

  // Base cylinder
  ctx.fillRect(-12, size/2 - 10, 24, 25)
  ctx.strokeRect(-12, size/2 - 10, 24, 25)

  // Threading lines
  ctx.strokeStyle = '#4A4A4A'
  for (let i = 0; i < 5; i++) {
    const y = size/2 - 7 + (i * 5)
    ctx.beginPath()
    ctx.moveTo(-12, y)
    ctx.lineTo(12, y)
    ctx.stroke()
  }

  // Bottom contact
  ctx.fillStyle = '#8B4513'
  ctx.beginPath()
  ctx.arc(0, size/2 + 18, 8, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // Light rays when bright
  if (brightness > 0.4) {
    ctx.strokeStyle = brightness > 0.7 ? '#FFFF00' : '#FFD700'
    ctx.lineWidth = 2
    const rays = Math.floor(brightness * 8) + 4
    const rayLength = 20 + (brightness * 25)

    for (let i = 0; i < rays; i++) {
      const angle = (i / rays) * Math.PI * 2
      const startDist = size/2 + 5
      const endDist = startDist + rayLength

      ctx.beginPath()
      ctx.moveTo(Math.cos(angle) * startDist, -10 + Math.sin(angle) * startDist)
      ctx.lineTo(Math.cos(angle) * endDist, -10 + Math.sin(angle) * endDist)
      ctx.globalAlpha = brightness * 0.7
      ctx.stroke()
      ctx.globalAlpha = 1
    }
  }

  // Label
  ctx.fillStyle = '#4A4A4A'
  ctx.font = '12px Courier New'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('💡 Bulb', 0, -size/2 - 20)

  // Status
  const status = brightness > 0.7 ? 'Bright' : brightness > 0.3 ? 'Warm' : brightness > 0 ? 'Dim' : 'Off'
  ctx.fillText(status, 0, size/2 + 30)

  // Power display
  if (power > 0) {
    ctx.font = '10px Courier New'
    ctx.fillText(`${(power * 1000).toFixed(0)}mW`, 0, size/2 + 42)
  }
}

