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

