export function drawLED(ctx, component) {
  const size = 60
  const brightness = component.brightness || 0

  // Draw outer glow halos when bright (multiple layers)
  if (brightness > 0.1) {
    const glowLayers = Math.floor(brightness * 5) + 2
    for (let i = glowLayers; i > 0; i--) {
      const radius = size/2 + (i * 8)
      const alpha = (brightness / glowLayers) * (1 - i / glowLayers) * 0.3

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
      gradient.addColorStop(0, `rgba(255, 255, 100, ${alpha * 0.8})`)
      gradient.addColorStop(0.5, `rgba(255, 220, 0, ${alpha * 0.5})`)
      gradient.addColorStop(1, `rgba(255, 180, 0, 0)`)

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // LED body with enhanced gradient
  ctx.beginPath()
  ctx.arc(0, 0, size/2, 0, Math.PI * 2)

  // Fill based on brightness with more vibrant colors
  if (brightness > 0) {
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size/2)

    // Much brighter core
    gradient.addColorStop(0, `rgba(255, 255, 255, ${Math.min(1, brightness * 1.2)})`)
    gradient.addColorStop(0.3, `rgba(255, 255, 100, ${brightness})`)
    gradient.addColorStop(0.6, `rgba(255, 220, 0, ${brightness * 0.9})`)
    gradient.addColorStop(1, `rgba(255, 180, 0, ${brightness * 0.5})`)
    ctx.fillStyle = gradient

    // Add glow effect with shadow
    ctx.shadowBlur = 30 * brightness
    ctx.shadowColor = brightness > 0.7 ? '#FFFF00' : '#FBBF24'
    ctx.fill()
    ctx.shadowBlur = 0
  } else {
    ctx.fillStyle = '#E0E0E0'
    ctx.fill()
  }

  // Draw LED outline
  ctx.strokeStyle = '#4A4A4A'
  ctx.lineWidth = 2
  ctx.stroke()

  // Draw brightness indicators (enhanced wave patterns with sparkles)
  if (brightness > 0.2) {
    // Radiating light rays
    ctx.strokeStyle = brightness > 0.7 ? '#FFFF00' : '#FBBF24'
    ctx.lineWidth = 2
    const rays = Math.floor(brightness * 6) + 3
    const rayLength = 15 + (brightness * 20)

    for (let i = 0; i < rays; i++) {
      const angle = (i / rays) * Math.PI * 2
      const startDist = size/2 + 5
      const endDist = startDist + rayLength

      ctx.beginPath()
      ctx.moveTo(Math.cos(angle) * startDist, Math.sin(angle) * startDist)
      ctx.lineTo(Math.cos(angle) * endDist, Math.sin(angle) * endDist)
      ctx.globalAlpha = brightness * 0.8
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    // Add sparkles for high brightness
    if (brightness > 0.6) {
      ctx.fillStyle = '#FFFFFF'
      const sparkles = Math.floor((brightness - 0.6) * 10)
      for (let i = 0; i < sparkles; i++) {
        const angle = (Math.random() * Math.PI * 2)
        const dist = (size/2 + 10) + Math.random() * 30
        const x = Math.cos(angle) * dist
        const y = Math.sin(angle) * dist

        ctx.beginPath()
        ctx.arc(x, y, 1.5, 0, Math.PI * 2)
        ctx.fill()

        // Cross sparkle
        ctx.beginPath()
        ctx.moveTo(x - 3, y)
        ctx.lineTo(x + 3, y)
        ctx.moveTo(x, y - 3)
        ctx.lineTo(x, y + 3)
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }
  }

  // Label
  ctx.fillStyle = '#4A4A4A'
  ctx.font = '12px Courier New'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('💡 LED', 0, -size/2 - 15)

  const status = brightness > 0.7 ? 'Bright' : brightness > 0.3 ? 'Dim' : brightness > 0 ? 'Faint' : 'Off'
  ctx.fillText(status, 0, size/2 + 20)
}

