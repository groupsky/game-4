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

    // Draw components
    components.forEach((component, index) => {
      drawComponent(ctx, component)

      // Draw selection indicator
      if (index === selectedComponent) {
        ctx.save()
        ctx.strokeStyle = '#F97316'
        ctx.lineWidth = 3
        ctx.setLineDash([5, 5])
        const size = component.type === 'battery' ? 70 : 40
        ctx.strokeRect(component.x - size, component.y - size, size * 2, size * 2)
        ctx.setLineDash([])
        ctx.restore()
      }
    })
  }, [components, wires, connecting, mousePos, selectedComponent])

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
        if (selectedComponent !== null) {
          // Delete component
          setComponents(prev => prev.filter((_, i) => i !== selectedComponent))
          // Delete connected wires
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
  }, [selectedComponent, components])

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

    // Draw LED bulb shape
    ctx.strokeStyle = '#4A4A4A'
    ctx.lineWidth = 2

    // LED body
    ctx.beginPath()
    ctx.arc(0, 0, size/2, 0, Math.PI * 2)

    // Fill based on brightness
    if (brightness > 0) {
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size/2)
      gradient.addColorStop(0, `rgba(255, 255, 0, ${brightness})`)
      gradient.addColorStop(0.5, `rgba(255, 200, 0, ${brightness * 0.6})`)
      gradient.addColorStop(1, `rgba(255, 150, 0, ${brightness * 0.3})`)
      ctx.fillStyle = gradient
    } else {
      ctx.fillStyle = '#E0E0E0'
    }

    ctx.fill()
    ctx.stroke()

    // Glow effect when bright
    if (brightness > 0.5) {
      ctx.shadowBlur = 20 * brightness
      ctx.shadowColor = '#FBBF24'
      ctx.beginPath()
      ctx.arc(0, 0, size/2, 0, Math.PI * 2)
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    // Draw brightness indicators (wave patterns)
    if (brightness > 0.3) {
      ctx.strokeStyle = '#FBBF24'
      ctx.lineWidth = 1
      const waves = Math.floor(brightness * 3) + 1
      for (let i = 0; i < waves; i++) {
        const offset = i * 5
        ctx.beginPath()
        ctx.moveTo(-10 - offset, 0)
        ctx.lineTo(-5 - offset, -5)
        ctx.lineTo(-5 - offset, 5)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(10 + offset, 0)
        ctx.lineTo(5 + offset, -5)
        ctx.lineTo(5 + offset, 5)
        ctx.stroke()
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
    if (e.shiftKey) {
      // Shift+click to start wire connection
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const hit = getComponentAt(x, y)
      if (hit) {
        setConnecting(hit.component.id)
      }
      return
    }

    // Regular click for dragging
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const hit = getComponentAt(x, y)
    if (hit) {
      setDragging(hit.index)
      setSelectedComponent(hit.index)
      setOffset({ x: x - hit.component.x, y: y - hit.component.y })
    } else {
      setSelectedComponent(null)
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

    if (dragging !== null) {
      setComponents(prev => {
        const newComponents = [...prev]
        newComponents[dragging] = {
          ...newComponents[dragging],
          x: x - offset.x,
          y: y - offset.y
        }
        return newComponents
      })
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
              voltage: 4.5  // 5 potatoes in series
            }])}
          >
            Add 🥔 Battery (5x)
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
        <p>💬 Drag to move | Shift+Click to wire | Right-click or Delete to remove</p>
        <p>Components: {components.length} | Wires: {wires.length}</p>
        {connecting && <p>🔌 Connecting... Click another component to finish wire.</p>}
        {selectedComponent !== null && <p>🎯 Selected: {components[selectedComponent]?.type} (Press Delete to remove)</p>}
      </div>
    </div>
  )
}
