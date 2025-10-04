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

