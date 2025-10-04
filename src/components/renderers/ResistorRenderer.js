export function drawResistor(ctx, component) {
  const width = 80
  const height = 30
  const resistance = component.resistance || 100
  const current = component.current || 0

  // Calculate heat level for visual feedback
  const powerDissipated = current * current * resistance  // P = I²R
  const heatLevel = Math.min(powerDissipated / 2.0, 1.0)

  // Draw resistor body with zigzag pattern
  ctx.strokeStyle = '#4A4A4A'
  ctx.lineWidth = 2

  // Resistor body color based on heat
  if (heatLevel > 0.9) {
    ctx.fillStyle = '#DC2626'  // Overheating red
  } else if (heatLevel > 0.6) {
    ctx.fillStyle = '#F97316'  // Hot orange
  } else if (heatLevel > 0.25) {
    ctx.fillStyle = '#FBBF24'  // Warm yellow
  } else {
    ctx.fillStyle = '#E8DCC8'  // Cool beige
  }

  // Draw resistor box
  ctx.fillRect(-width/2, -height/2, width, height)
  ctx.strokeRect(-width/2, -height/2, width, height)

  // Draw resistance bands (color code)
  const drawBand = (x, color) => {
    ctx.fillStyle = color
    ctx.fillRect(x - 3, -height/2, 6, height)
  }

  // Simplified color bands for common resistances
  if (resistance === 100) {
    drawBand(-width/2 + 15, '#8B4513')  // Brown (1)
    drawBand(-width/2 + 27, '#000000')  // Black (0)
    drawBand(-width/2 + 39, '#8B4513')  // Brown (×10)
  } else if (resistance === 220) {
    drawBand(-width/2 + 15, '#DC2626')  // Red (2)
    drawBand(-width/2 + 27, '#DC2626')  // Red (2)
    drawBand(-width/2 + 39, '#8B4513')  // Brown (×10)
  } else if (resistance === 1000) {
    drawBand(-width/2 + 15, '#8B4513')  // Brown (1)
    drawBand(-width/2 + 27, '#000000')  // Black (0)
    drawBand(-width/2 + 39, '#DC2626')  // Red (×100)
  }

  // Draw heat shimmer effect if hot
  if (heatLevel > 0.5) {
    ctx.strokeStyle = '#F97316'
    ctx.lineWidth = 1
    ctx.globalAlpha = heatLevel * 0.5

    const shimmerLines = Math.floor(heatLevel * 5) + 2
    for (let i = 0; i < shimmerLines; i++) {
      const y = -height/2 - 10 - (i * 3)
      ctx.beginPath()
      ctx.moveTo(-width/4, y)
      ctx.quadraticCurveTo(0, y - 3, width/4, y)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  // Label
  ctx.fillStyle = '#4A4A4A'
  ctx.font = '12px Courier New'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`⚡ ${resistance}Ω`, 0, -height/2 - 15)

  // Status text based on heat
  let status = 'Cool'
  if (heatLevel > 0.9) status = 'OVERHEAT!'
  else if (heatLevel > 0.6) status = 'Hot'
  else if (heatLevel > 0.25) status = 'Warm'

  ctx.fillText(status, 0, height/2 + 15)
}

