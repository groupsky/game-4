import { useRef, useState, useEffect } from 'react'
import { CircuitSimulator } from '../engine/CircuitSimulator'
import './CircuitWorkspace.css'

const simulator = new CircuitSimulator()

export default function CircuitWorkspace() {
  const canvasRef = useRef(null)
  const [components, setComponents] = useState([])
  const [wires, setWires] = useState([])
  const [dragging, setDragging] = useState(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [connecting, setConnecting] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [selectedComponents, setSelectedComponents] = useState([])
  const [selectionBox, setSelectionBox] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw graph paper background
    drawGraphPaper(ctx, canvas.width, canvas.height)

    // Draw wires
    wires.forEach(wire => {
      drawWire(ctx, wire)
    })

    // Draw wire being created
    if (connecting) {
      const comp = components.find(c => c.id === connecting)
      if (comp) {
        ctx.strokeStyle = '#1E3A8A'
        ctx.lineWidth = 3
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(comp.x, comp.y)
        ctx.lineTo(mousePos.x, mousePos.y)
        ctx.stroke()
        ctx.setLineDash([])
      }
    }

    // Draw selection box
    if (selectionBox) {
      ctx.strokeStyle = '#F97316'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.fillStyle = 'rgba(249, 115, 22, 0.1)'
      ctx.fillRect(selectionBox.x, selectionBox.y, selectionBox.width, selectionBox.height)
      ctx.strokeRect(selectionBox.x, selectionBox.y, selectionBox.width, selectionBox.height)
      ctx.setLineDash([])
    }

    // Draw components
    components.forEach((component, index) => {
      drawComponent(ctx, component)

      // Draw selection indicator
      if (index === selectedComponent || selectedComponents.includes(index)) {
        ctx.save()
        ctx.strokeStyle = '#F97316'
        ctx.lineWidth = 3
        ctx.setLineDash([5, 5])
        let size = 40
        if (component.type === 'battery') size = 70
        else if (component.type === 'resistor') size = 50
        else if (component.type === 'capacitor') size = 50
        else if (component.type === 'lightbulb') size = 60
        ctx.strokeRect(component.x - size, component.y - size, size * 2, size * 2)
        ctx.setLineDash([])
        ctx.restore()
      }
    })
  }, [components, wires, connecting, mousePos, selectedComponent, selectedComponents, selectionBox])

  // Run simulation every 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      simulator.setComponents(components)
      simulator.setWires(wires)
      const updated = simulator.simulate()
      setComponents([...updated])
    }, 100)

    return () => clearInterval(interval)
  }, [components, wires])

  // Keyboard handler for delete
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedComponents.length > 0) {
          // Delete multiple components
          const compIds = selectedComponents.map(i => components[i]?.id).filter(Boolean)
          setComponents(prev => prev.filter((_, i) => !selectedComponents.includes(i)))
          setWires(prev => prev.filter(w => !compIds.includes(w.from) && !compIds.includes(w.to)))
          setSelectedComponents([])
          setSelectedComponent(null)
        } else if (selectedComponent !== null) {
          // Delete single component
          setComponents(prev => prev.filter((_, i) => i !== selectedComponent))
          const compId = components[selectedComponent]?.id
          if (compId) {
            setWires(prev => prev.filter(w => w.from !== compId && w.to !== compId))
          }
          setSelectedComponent(null)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedComponent, selectedComponents, components])

  const drawGraphPaper = (ctx, width, height) => {
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

  const drawComponent = (ctx, component) => {
    ctx.save()
    ctx.translate(component.x, component.y)

    if (component.type === 'battery') {
      drawBattery(ctx, component)
    } else if (component.type === 'led') {
      drawLED(ctx, component)
    } else if (component.type === 'resistor') {
      drawResistor(ctx, component)
    } else if (component.type === 'capacitor') {
      drawCapacitor(ctx, component)
    } else if (component.type === 'lightbulb') {
      drawLightBulb(ctx, component)
    }

    ctx.restore()
  }

  const drawBattery = (ctx, component) => {
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

    // Charge percentage text
    ctx.fillStyle = '#4A4A4A'
    ctx.font = 'bold 14px Courier New'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${Math.round(charge * 100)}%`, 0, barHeight/2 + 20)

    // Label
    ctx.font = '12px Courier New'
    ctx.fillText('🥔 Potato', 0, -height/2 - 10)
    ctx.fillText(`${(component.voltage || 0.9).toFixed(1)}V`, 0, height/2 + 35)
  }

  const drawLED = (ctx, component) => {
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

  const drawResistor = (ctx, component) => {
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

  const drawCapacitor = (ctx, component) => {
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

  const drawLightBulb = (ctx, component) => {
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

  const drawWire = (ctx, wire) => {
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

  const getComponentAt = (x, y) => {
    for (let i = components.length - 1; i >= 0; i--) {
      const comp = components[i]
      const dx = x - comp.x
      const dy = y - comp.y
      const size = comp.type === 'battery' ? 60 : 30

      if (Math.abs(dx) < size && Math.abs(dy) < size) {
        return { index: i, component: comp }
      }
    }
    return null
  }

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (e.shiftKey) {
      // Shift+click to start wire connection
      const hit = getComponentAt(x, y)
      if (hit) {
        setConnecting(hit.component.id)
      }
      return
    }

    const hit = getComponentAt(x, y)

    if (hit) {
      // Clicking on a component
      if (e.ctrlKey || e.metaKey) {
        // Ctrl/Cmd+click to add to selection
        if (selectedComponents.includes(hit.index)) {
          setSelectedComponents(prev => prev.filter(i => i !== hit.index))
        } else {
          setSelectedComponents(prev => [...prev, hit.index])
        }
      } else {
        // Regular click - select and drag
        setDragging(hit.index)

        if (selectedComponents.includes(hit.index)) {
          // If already in multi-selection, drag all selected
          setOffset({ x: x - hit.component.x, y: y - hit.component.y })
        } else {
          // Single selection
          setSelectedComponent(hit.index)
          setSelectedComponents([])
          setOffset({ x: x - hit.component.x, y: y - hit.component.y })
        }
      }
    } else {
      // Clicking on empty space - start rectangle selection
      setSelectionBox({ x, y, width: 0, height: 0, startX: x, startY: y })
      setSelectedComponent(null)
      setSelectedComponents([])
    }
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const hit = getComponentAt(x, y)
    if (hit) {
      // Right-click to delete
      setComponents(prev => prev.filter((_, i) => i !== hit.index))
      const compId = hit.component.id
      setWires(prev => prev.filter(w => w.from !== compId && w.to !== compId))
      setSelectedComponent(null)
    } else {
      // Check if clicking on a wire
      const wire = getWireAt(x, y)
      if (wire) {
        setWires(prev => prev.filter(w => w.id !== wire.id))
      }
    }
  }

  const getWireAt = (x, y) => {
    const threshold = 10
    for (const wire of wires) {
      const from = components.find(c => c.id === wire.from)
      const to = components.find(c => c.id === wire.to)
      if (!from || !to) continue

      // Check distance to line segment
      const dist = distanceToLineSegment(x, y, from.x, from.y, to.x, to.y)
      if (dist < threshold) {
        return wire
      }
    }
    return null
  }

  const distanceToLineSegment = (px, py, x1, y1, x2, y2) => {
    const dx = x2 - x1
    const dy = y2 - y1
    const lengthSquared = dx * dx + dy * dy

    if (lengthSquared === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2)

    let t = ((px - x1) * dx + (py - y1) * dy) / lengthSquared
    t = Math.max(0, Math.min(1, t))

    const projX = x1 + t * dx
    const projY = y1 + t * dy

    return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2)
  }

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setMousePos({ x, y })

    if (selectionBox && selectionBox.startX !== undefined) {
      // Update selection rectangle
      const newBox = {
        ...selectionBox,
        x: Math.min(x, selectionBox.startX),
        y: Math.min(y, selectionBox.startY),
        width: Math.abs(x - selectionBox.startX),
        height: Math.abs(y - selectionBox.startY)
      }
      setSelectionBox(newBox)
    } else if (dragging !== null) {
      const dx = x - offset.x
      const dy = y - offset.y
      const draggedComp = components[dragging]

      if (selectedComponents.includes(dragging)) {
        // Move all selected components together
        const deltaX = dx - draggedComp.x
        const deltaY = dy - draggedComp.y

        setComponents(prev => {
          const newComponents = [...prev]
          selectedComponents.forEach(i => {
            newComponents[i] = {
              ...newComponents[i],
              x: newComponents[i].x + deltaX,
              y: newComponents[i].y + deltaY
            }
          })
          return newComponents
        })
      } else {
        // Move single component
        setComponents(prev => {
          const newComponents = [...prev]
          newComponents[dragging] = {
            ...newComponents[dragging],
            x: dx,
            y: dy
          }
          return newComponents
        })
      }
    }
  }

  const handleMouseUp = (e) => {
    if (connecting) {
      // Finish wire connection
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const hit = getComponentAt(x, y)
      if (hit && hit.component.id !== connecting) {
        // Create wire
        setWires([...wires, {
          id: Date.now(),
          from: connecting,
          to: hit.component.id
        }])
      }
      setConnecting(null)
    }

    if (selectionBox && selectionBox.width > 5 && selectionBox.height > 5) {
      // Find all components within selection box
      const selected = []
      components.forEach((comp, index) => {
        const size = comp.type === 'battery' ? 60 : 30
        const compLeft = comp.x - size
        const compRight = comp.x + size
        const compTop = comp.y - size
        const compBottom = comp.y + size

        const boxLeft = selectionBox.x
        const boxRight = selectionBox.x + selectionBox.width
        const boxTop = selectionBox.y
        const boxBottom = selectionBox.y + selectionBox.height

        // Check if component overlaps with selection box
        if (compRight >= boxLeft && compLeft <= boxRight &&
            compBottom >= boxTop && compTop <= boxBottom) {
          selected.push(index)
        }
      })
      setSelectedComponents(selected)
    }

    setSelectionBox(null)
    setDragging(null)
  }

  return (
    <div className="circuit-workspace">
      <div className="workspace-header">
        <h1>📔 Circuit Quest - Inventor's Notebook</h1>
        <div className="toolbar">
          <button
            onClick={() => setComponents([...components, {
              id: Date.now(),
              type: 'battery',
              x: 100 + Math.random() * 100,
              y: 100 + Math.random() * 100,
              charge: 1.0,
              voltage: 0.9  // Single potato battery
            }])}
          >
            Add 🥔 Potato
          </button>
          <button
            onClick={() => setComponents([...components, {
              id: Date.now(),
              type: 'led',
              x: 250 + Math.random() * 100,
              y: 100 + Math.random() * 100,
              brightness: 0
            }])}
          >
            Add 💡 LED
          </button>
          <button
            onClick={() => setComponents([...components, {
              id: Date.now(),
              type: 'resistor',
              x: 400 + Math.random() * 100,
              y: 100 + Math.random() * 100,
              resistance: 100,
              current: 0
            }])}
          >
            Add ⚡ Resistor (100Ω)
          </button>
          <button
            onClick={() => setComponents([...components, {
              id: Date.now(),
              type: 'capacitor',
              x: 550 + Math.random() * 100,
              y: 100 + Math.random() * 100,
              capacitance: 0.001,  // 1mF foil capacitor
              voltage: 0,
              maxVoltage: 5.0
            }])}
          >
            Add ⚡ Capacitor (1mF)
          </button>
          <button
            onClick={() => setComponents([...components, {
              id: Date.now(),
              type: 'lightbulb',
              x: 700 + Math.random() * 100,
              y: 100 + Math.random() * 100,
              brightness: 0,
              resistance: 50,  // Lower resistance (draws more current)
              current: 0,
              power: 0
            }])}
          >
            Add 💡 Light Bulb
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="circuit-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
      />

      <div className="info-panel">
        <p>💬 Drag to move | Shift+Click to wire | Drag rectangle to multi-select | Ctrl+Click to add to selection</p>
        <p>Components: {components.length} | Wires: {wires.length}</p>
        {connecting && <p>🔌 Connecting... Click another component to finish wire.</p>}
        {selectedComponents.length > 0 && <p>🎯 Selected: {selectedComponents.length} components (Press Delete to remove)</p>}
        {selectedComponent !== null && selectedComponents.length === 0 && <p>🎯 Selected: {components[selectedComponent]?.type} (Press Delete to remove)</p>}
      </div>
    </div>
  )
}
