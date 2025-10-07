import { useRef, useState, useEffect } from 'react'
import { CircuitSimulator } from '../engine/CircuitSimulator'
import { SimulationState } from '../engine/SimulationState'
import { ChallengeSystem } from '../challenges/ChallengeSystem'
import { ChallengePanel } from './ChallengePanel'
import { Toolbar } from './Toolbar'
import { InfoPanel } from './InfoPanel'
import { MobileToolbar } from './MobileToolbar'
import { Toast } from './Toast'
import {
  drawBattery,
  drawLED,
  drawResistor,
  drawCapacitor,
  drawLightBulb,
  drawGraphPaper,
  drawWire
} from './ComponentRendering'
import { getDeviceCapabilities } from '../utils/DeviceCapabilities'
import { UndoStack, UndoActions } from '../utils/UndoStack'
import { CanvasZoom } from '../utils/CanvasZoom'
import './CircuitWorkspace.css'

const simulator = new CircuitSimulator()
const simulationState = new SimulationState()
const challengeSystem = new ChallengeSystem()
const undoStack = new UndoStack()
const canvasZoom = new CanvasZoom()

export default function CircuitWorkspace() {
  const canvasRef = useRef(null)
  const [components, setComponents] = useState([])
  const [wires, setWires] = useState([])
  const [dragging, setDragging] = useState(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [selectedComponents, setSelectedComponents] = useState([])
  const [selectionBox, setSelectionBox] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [currentChallengeId, setCurrentChallengeId] = useState(null)
  const [challengeChangeCounter, setChallengeChangeCounter] = useState(0)

  // Capability-based UX state
  const [capabilities, setCapabilities] = useState(getDeviceCapabilities())
  const [activeMode, setActiveMode] = useState(null) // null | 'battery' | 'led' | 'wire' | etc
  const [wireChain, setWireChain] = useState([]) // For click-sequence wiring
  const [canUndo, setCanUndo] = useState(false)
  const [toast, setToast] = useState(null) // { message, show }

  // Capability detection
  useEffect(() => {
    const caps = getDeviceCapabilities()
    caps.onChange((newCaps) => {
      setCapabilities({ ...newCaps })
    })

    // Keyboard detection
    const handleKeyEvent = () => {
      caps.onKeyboardEvent()
    }
    window.addEventListener('keydown', handleKeyEvent)
    window.addEventListener('keyup', handleKeyEvent)

    return () => {
      window.removeEventListener('keydown', handleKeyEvent)
      window.removeEventListener('keyup', handleKeyEvent)
    }
  }, [])

  // Undo stack notifications
  useEffect(() => {
    undoStack.onChange((stack) => {
      setCanUndo(stack.canUndo())
    })
  }, [])

  // Clear undo when simulation starts
  useEffect(() => {
    if (isRunning) {
      undoStack.clear()
      setWireChain([])
      setActiveMode(null)
    }
  }, [isRunning])

  // Listen to simulation state changes
  useEffect(() => {
    simulationState.onChange((running) => {
      setIsRunning(running)

      if (!running) {
        setComponents(prevComponents => {
          return simulator.resetCircuit(prevComponents)
        })
        challengeSystem.getTimeTracker().reset()
      }
    })
  }, [])

  // Load circuit when challenge changes
  useEffect(() => {
    const activeChallenge = challengeSystem.getActiveChallenge()
    if (!activeChallenge) return

    if (currentChallengeId && currentChallengeId !== activeChallenge.id) {
      challengeSystem.saveCircuit(currentChallengeId, { components, wires })
    }

    if (activeChallenge.id !== currentChallengeId) {
      if (isRunning) {
        simulationState.stop()
      }

      // Clear circuit FIRST to prevent auto-save race condition
      setComponents([])
      setWires([])

      // Then update challenge ID and load saved circuit
      setCurrentChallengeId(activeChallenge.id)

      const savedCircuit = challengeSystem.loadCircuit(activeChallenge.id)
      if (savedCircuit) {
        const resetComponents = simulator.resetCircuit(savedCircuit.components || [])
        setComponents(resetComponents)
        setWires(savedCircuit.wires || [])
      }
    }
  }, [challengeSystem.getActiveChallenge()?.id, challengeChangeCounter])

  // Auto-save circuit when it changes
  useEffect(() => {
    if (currentChallengeId && !isRunning) {
      challengeSystem.saveCircuit(currentChallengeId, { components, wires })
    }
  }, [components, wires, currentChallengeId, isRunning])

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

    // Draw wire chain preview (click-sequence mode)
    if (wireChain.length > 0) {
      ctx.strokeStyle = '#F97316'
      ctx.lineWidth = 3
      ctx.setLineDash([5, 5])

      // Draw existing chain segments
      for (let i = 0; i < wireChain.length - 1; i++) {
        const fromComp = components.find(c => c.id === wireChain[i])
        const toComp = components.find(c => c.id === wireChain[i + 1])
        if (fromComp && toComp) {
          ctx.beginPath()
          ctx.moveTo(fromComp.x, fromComp.y)
          ctx.lineTo(toComp.x, toComp.y)
          ctx.stroke()
        }
      }

      // Draw line to cursor from last component
      const lastComp = components.find(c => c.id === wireChain[wireChain.length - 1])
      if (lastComp) {
        ctx.beginPath()
        ctx.moveTo(lastComp.x, lastComp.y)
        ctx.lineTo(mousePos.x, mousePos.y)
        ctx.stroke()

        // Highlight last component
        ctx.fillStyle = 'rgba(249, 115, 22, 0.3)'
        ctx.beginPath()
        ctx.arc(lastComp.x, lastComp.y, 40, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.setLineDash([])
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
  }, [components, wires, mousePos, selectedComponent, selectedComponents, selectionBox, wireChain])

  // Run simulation every 100ms (with 10ms physics step for finer granularity)
  // ONLY when simulation is running
  useEffect(() => {
    if (!isRunning) return

    // Capture the active challenge at the start of simulation
    // This prevents auto-validation from cascading through multiple challenges
    const challengeAtStart = challengeSystem.getActiveChallenge()

    const interval = setInterval(() => {
      simulator.setComponents(components)
      simulator.setWires(wires)
      const updated = simulator.simulate(0.01)  // 10ms physics step (10x slower)
      setComponents([...updated])

      // Update time tracking for active challenge
      challengeSystem.updateTimeTracking({ components: updated, wires })

      // Auto-validate challenge on each tick (for non-manual challenges)
      // ONLY validate the challenge that was active when simulation started
      if (challengeAtStart && !challengeAtStart.requiresManualStart && !challengeAtStart.requiresTime) {
        // Only validate if this is still the active challenge
        const currentActive = challengeSystem.getActiveChallenge()
        if (currentActive?.id === challengeAtStart.id) {
          challengeSystem.validate(challengeAtStart.id, { components: updated, wires })
        }
      }
    }, 100)

    return () => clearInterval(interval)
  }, [components, wires, isRunning])

  // Keyboard handler for shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          // Redo
          const action = undoStack.redo()
          if (action) {
            const { performUndo } = require('./CircuitWorkspaceHelpers')
            // TODO: Implement redo logic
          }
        } else {
          // Undo
          const { performUndo, hideToast } = require('./CircuitWorkspaceHelpers')
          performUndo(undoStack, setComponents, setWires, setToast, UndoActions)
        }
        return
      }

      // Escape - exit mode
      if (e.key === 'Escape') {
        setActiveMode(null)
        setWireChain([])
        setSelectedComponent(null)
        setSelectedComponents([])
        return
      }

      // Disable editing when simulation is running
      if (isRunning) return

      // Delete key
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const { deleteComponent } = require('./CircuitWorkspaceHelpers')

        if (selectedComponents.length > 0) {
          // Delete multiple components
          selectedComponents.forEach(index => {
            deleteComponent(index, components, setComponents, wires, setWires, undoStack, UndoActions, setToast)
          })
          setSelectedComponents([])
          setSelectedComponent(null)
        } else if (selectedComponent !== null) {
          // Delete single component
          deleteComponent(selectedComponent, components, setComponents, wires, setWires, undoStack, UndoActions, setToast)
          setSelectedComponent(null)
        }
        setDragging(null)
        setConnecting(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedComponent, selectedComponents, components, wires, activeMode, wireChain, isRunning])

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
    // Disable editing when simulation is running
    if (isRunning) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // MODE-BASED INTERACTIONS
    // Check if we're in component placement mode
    if (activeMode && activeMode !== 'wire') {
      // Place component at click location
      const { placeComponent } = require('./CircuitWorkspaceHelpers')
      placeComponent(activeMode, x, y, components, setComponents, undoStack, UndoActions, setToast, capabilities)
      return
    }

    // Check if we're in wire mode (click-sequence)
    if (activeMode === 'wire') {
      const { getComponentAt: getComponentAtHelper } = require('./CircuitWorkspaceHelpers')
      const hit = getComponentAtHelper(x, y, components, capabilities)

      if (hit) {
        // Add to wire chain
        setWireChain(prev => [...prev, hit.component.id])
      } else if (wireChain.length >= 2) {
        // Clicked empty space - finalize wire chain
        const { createWiresFromChain } = require('./CircuitWorkspaceHelpers')
        createWiresFromChain(wireChain, wires, setWires, undoStack, UndoActions, setToast)
        setWireChain([])
        setActiveMode(null)
      }
      return
    }

    // SELECTION MODE (default when no active mode)
    const hit = getComponentAt(x, y)

    if (hit) {
      // Clicking on a component
      if ((e.ctrlKey || e.metaKey) && capabilities.supportsCtrlClick()) {
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
      // Clicking on empty space - start rectangle selection (if supported)
      if (capabilities.supportsDragBox()) {
        setSelectionBox({ x, y, width: 0, height: 0, startX: x, startY: y })
      }
      setSelectedComponent(null)
      setSelectedComponents([])
    }
  }

  const handleContextMenu = (e) => {
    e.preventDefault()

    // Disable editing when simulation is running
    if (isRunning) return

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

  const handleUndo = () => {
    const { performUndo } = require('./CircuitWorkspaceHelpers')
    performUndo(undoStack, setComponents, setWires, setToast, UndoActions)
  }

  return (
    <div className="circuit-workspace">
      {canUndo && (
        <button
          className="undo-btn"
          onClick={handleUndo}
          title="Undo (Ctrl+Z)"
          style={{
            position: 'fixed',
            top: '10px',
            left: '10px',
            zIndex: 1000,
            background: 'white',
            border: '2px solid #4A4A4A',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'Courier New, monospace',
            fontSize: '14px'
          }}
        >
          ↶ {undoStack.getUndoCount() > 1 && `×${undoStack.getUndoCount()}`}
        </button>
      )}

      <div className="workspace-header">
        <h1>📔 Circuit Quest - Inventor's Notebook</h1>
        <Toolbar
          isRunning={isRunning}
          onToggleSimulation={() => simulationState.toggle()}
          onModeChange={setActiveMode}
          activeMode={activeMode}
        />
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

      <InfoPanel
        isRunning={isRunning}
        components={components}
        wires={wires}
        selectedComponents={selectedComponents}
        selectedComponent={selectedComponent}
      />

      <ChallengePanel
        challengeSystem={challengeSystem}
        circuit={{ components, wires }}
        isRunning={isRunning}
        onChallengeChange={() => setChallengeChangeCounter(c => c + 1)}
        onStopSimulation={() => simulationState.stop()}
      />

      <MobileToolbar
        activeMode={activeMode}
        onModeChange={setActiveMode}
        isRunning={isRunning}
        onToggleSimulation={() => simulationState.toggle()}
        isMobile={capabilities.viewportSize === 'small'}
      />

      <Toast
        message={toast?.message}
        show={toast?.show}
        onUndo={toast?.onUndo}
        onDismiss={() => setToast(null)}
      />
    </div>
  )
}
