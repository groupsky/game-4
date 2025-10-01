import { useRef, useState, useEffect } from 'react'
import { CircuitSimulator } from '../engine/CircuitSimulator'
import { ChallengeSystem } from '../challenges/ChallengeSystem'
import { ChallengePanel } from './ChallengePanel'
import {
  drawBattery,
  drawLED,
  drawResistor,
  drawCapacitor,
  drawLightBulb,
  drawGraphPaper,
  drawWire
} from './ComponentRendering'
import './CircuitWorkspace.css'

const simulator = new CircuitSimulator()
const challengeSystem = new ChallengeSystem()

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
      drawWire(ctx, wire, components)
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

  // Run simulation every 100ms (with 10ms physics step for finer granularity)
  useEffect(() => {
    const interval = setInterval(() => {
      simulator.setComponents(components)
      simulator.setWires(wires)
      const updated = simulator.simulate(0.01)  // 10ms physics step (10x slower)
      setComponents([...updated])

      // Update time tracking for active challenge
      challengeSystem.updateTimeTracking({ components: updated, wires })
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
              charge: 0.01,  // Reduced 100x for slower depletion
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
              capacitance: 0.1,  // 100mF foil capacitor - larger for visible charging
              voltage: 0,
              maxVoltage: 5.0
            }])}
          >
            Add ⚡ Capacitor (100mF)
          </button>
          <button
            onClick={() => setComponents([...components, {
              id: Date.now(),
              type: 'lightbulb',
              x: 700 + Math.random() * 100,
              y: 100 + Math.random() * 100,
              brightness: 0,
              resistance: 30,  // Lower resistance = draws much more current, drains batteries faster
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

      <ChallengePanel
        challengeSystem={challengeSystem}
        circuit={{ components, wires }}
      />
    </div>
  )
}
