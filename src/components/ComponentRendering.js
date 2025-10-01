// Component rendering functions for Circuit Quest
// Hand-drawn sketch aesthetic with visual state feedback

export function drawBattery(ctx, component) {
  const width = 80
  const height = 120
  const charge = component.charge || 1.0

  // Draw potato shape (hand-drawn style)
  ctx.strokeStyle = '#4A4A4A'
  ctx.lineWidth = 2
  ctx.fillStyle = '#C9A675'

  ctx.beginPath()
  ctx.ellipse(0, 0, width/2, height/2, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // Draw charge indicator
  const barHeight = height * 0.6
  const barWidth = width * 0.6
  const chargeHeight = barHeight * charge

  // Charge bar background
  ctx.strokeStyle = '#4A4A4A'
  ctx.fillStyle = '#FFFFFF'
  ctx.lineWidth = 2
  ctx.strokeRect(-barWidth/2, -barHeight/2, barWidth, barHeight)

  // Charge fill
  if (charge > 0.01) {
    const gradient = ctx.createLinearGradient(0, barHeight/2, 0, -barHeight/2)
    if (charge > 0.75) {
      gradient.addColorStop(0, '#16A34A')
      gradient.addColorStop(1, '#22C55E')
    } else if (charge > 0.25) {
      gradient.addColorStop(0, '#F97316')
      gradient.addColorStop(1, '#FBBF24')
    } else {
      gradient.addColorStop(0, '#DC2626')
      gradient.addColorStop(1, '#EF4444')
    }

    ctx.fillStyle = gradient
    ctx.fillRect(-barWidth/2, barHeight/2 - chargeHeight, barWidth, chargeHeight)
  } else {
    // Battery is dead - show empty/grayed out
    ctx.fillStyle = '#D1D5DB'
    ctx.fillRect(-barWidth/2, -barHeight/2, barWidth, barHeight)

    // Add "EMPTY" text
    ctx.fillStyle = '#DC2626'
    ctx.font = 'bold 12px Courier New'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('EMPTY', 0, 0)
  }

  // Charge percentage text
  ctx.fillStyle = '#4A4A4A'
  ctx.font = 'bold 14px Courier New'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const displayCharge = charge < 0.01 ? 0 : Math.round(charge * 100)
  ctx.fillText(`${displayCharge}%`, 0, barHeight/2 + 20)

  // Label
  ctx.font = '12px Courier New'
  ctx.fillText('🥔 Potato', 0, -height/2 - 10)
  ctx.fillText(`${(component.voltage || 0.9).toFixed(1)}V`, 0, height/2 + 35)
}

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

export function drawCapacitor(ctx, component) {
  const width = 50
  const height = 80
  const voltage = component.voltage || 0
  const maxVoltage = component.maxVoltage || 5.0
  const chargeFill = voltage / maxVoltage

  // Draw two parallel plates (classic capacitor symbol)
  ctx.strokeStyle = '#4A4A4A'
  ctx.lineWidth = 3

  // Left plate
  ctx.beginPath()
  ctx.moveTo(-5, -height/2)
  ctx.lineTo(-5, height/2)
  ctx.stroke()

  // Right plate
  ctx.beginPath()
  ctx.moveTo(5, -height/2)
  ctx.lineTo(5, height/2)
  ctx.stroke()

  // Draw charge indicator between plates
  if (chargeFill > 0.1) {
    // Electric field lines (more lines = more charge)
    ctx.strokeStyle = '#1E3A8A'
    ctx.lineWidth = 1
    const fieldLines = Math.floor(chargeFill * 8) + 2

    for (let i = 0; i < fieldLines; i++) {
      const y = -height/3 + (i / (fieldLines - 1)) * (height * 2/3)
      const alpha = chargeFill * 0.8

      ctx.globalAlpha = alpha
      ctx.beginPath()
      ctx.moveTo(-3, y)
      ctx.lineTo(3, y)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  // Draw aluminum foil texture (Act 1 foil capacitor)
  ctx.strokeStyle = '#C0C0C0'
  ctx.lineWidth = 1
  ctx.globalAlpha = 0.5

  // Left foil texture
  for (let i = 0; i < 5; i++) {
    const y = -height/2 + (i / 4) * height
    ctx.beginPath()
    ctx.moveTo(-15, y)
    ctx.lineTo(-5, y)
    ctx.stroke()
  }

  // Right foil texture
  for (let i = 0; i < 5; i++) {
    const y = -height/2 + (i / 4) * height
    ctx.beginPath()
    ctx.moveTo(5, y)
    ctx.lineTo(15, y)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  // Draw charge bar indicator
  const barHeight = height * 0.6
  const barWidth = 10

  // Background
  ctx.strokeStyle = '#4A4A4A'
  ctx.lineWidth = 1
  ctx.strokeRect(width/2, -barHeight/2, barWidth, barHeight)

  // Charge fill
  const fillHeight = barHeight * chargeFill
  const gradient = ctx.createLinearGradient(0, barHeight/2, 0, -barHeight/2)

  if (chargeFill > 0.75) {
    gradient.addColorStop(0, '#16A34A')
    gradient.addColorStop(1, '#22C55E')
  } else if (chargeFill > 0.25) {
    gradient.addColorStop(0, '#F97316')
    gradient.addColorStop(1, '#FBBF24')
  } else {
    gradient.addColorStop(0, '#DC2626')
    gradient.addColorStop(1, '#EF4444')
  }

  ctx.fillStyle = gradient
  ctx.fillRect(width/2, barHeight/2 - fillHeight, barWidth, fillHeight)

  // Label
  ctx.fillStyle = '#4A4A4A'
  ctx.font = '12px Courier New'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const capacitance = (component.capacitance || 0.001) * 1000  // Convert to mF
  ctx.fillText(`⚡ ${capacitance.toFixed(1)}mF`, 0, -height/2 - 15)

  // Voltage display
  ctx.fillText(`${voltage.toFixed(2)}V`, 0, height/2 + 15)
}

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

export function drawGraphPaper(ctx, width, height) {
  const gridSize = 20

  // Background color (aged paper)
  ctx.fillStyle = '#F5F5DC'
  ctx.fillRect(0, 0, width, height)

  // Grid lines (faint)
  ctx.strokeStyle = '#D0D0C0'
  ctx.lineWidth = 0.5

  // Vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  // Thicker lines every 5 grid squares
  ctx.strokeStyle = '#B0B0A0'
  ctx.lineWidth = 1

  for (let x = 0; x <= width; x += gridSize * 5) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  for (let y = 0; y <= height; y += gridSize * 5) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
}

export function drawWire(ctx, wire, components) {
  const from = components.find(c => c.id === wire.from)
  const to = components.find(c => c.id === wire.to)

  if (!from || !to) return

  // Draw copper wire
  ctx.strokeStyle = '#B87333'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.stroke()

  // Draw pen blue outline for sketch effect
  ctx.strokeStyle = '#1E3A8A'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.stroke()
}
