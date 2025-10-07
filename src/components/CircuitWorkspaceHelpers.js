/**
 * CircuitWorkspaceHelpers - Helper functions for capability-based interactions
 */

/**
 * Show toast notification with optional undo
 */
export function showToast(setToast, message, onUndo = null) {
  setToast({ message, show: true, onUndo })
}

/**
 * Hide toast notification
 */
export function hideToast(setToast) {
  setToast(null)
}

/**
 * Place a component at specified coordinates with undo support
 */
export function placeComponent(type, x, y, components, setComponents, undoStack, UndoActions, setToast, capabilities) {
  const newComponent = createComponent(type, x, y)

  // Record undo
  const actionInfo = UndoActions.ADD_COMPONENT(type)
  undoStack.push({
    type: actionInfo.type,
    data: { component: newComponent }
  })

  setComponents([...components, newComponent])
  showToast(setToast, actionInfo.message, () => {
    // Undo: remove the component
    setComponents(prev => prev.filter(c => c.id !== newComponent.id))
    hideToast(setToast)
  })

  // Haptic feedback for touch
  if (navigator.vibrate && capabilities.hasCoarsePointer) {
    navigator.vibrate(10)
  }
}

/**
 * Create a component with default properties
 */
function createComponent(type, x, y) {
  const id = Date.now() + Math.random()

  const defaults = {
    battery: {
      id, type, x, y,
      charge: 1.0,
      voltage: 0.9
    },
    led: {
      id, type, x, y,
      brightness: 0
    },
    resistor: {
      id, type, x, y,
      resistance: 100,
      current: 0
    },
    capacitor: {
      id, type, x, y,
      capacitance: 0.1,
      voltage: 0,
      maxVoltage: 5.0
    },
    lightbulb: {
      id, type, x, y,
      brightness: 0,
      resistance: 0.36,
      current: 0,
      power: 0
    }
  }

  return defaults[type] || { id, type, x, y }
}

/**
 * Create wires from a chain of component IDs with undo support
 */
export function createWiresFromChain(chain, wires, setWires, undoStack, UndoActions, setToast) {
  if (chain.length < 2) return

  const newWires = []
  for (let i = 0; i < chain.length - 1; i++) {
    newWires.push({
      id: Date.now() + i,
      from: chain[i],
      to: chain[i + 1]
    })
  }

  // Record undo
  const actionInfo = UndoActions.ADD_WIRES(newWires.length)
  undoStack.push({
    type: actionInfo.type,
    data: { wires: newWires }
  })

  setWires([...wires, ...newWires])
  showToast(setToast, actionInfo.message, () => {
    // Undo: remove the wires
    const wireIds = newWires.map(w => w.id)
    setWires(prev => prev.filter(w => !wireIds.includes(w.id)))
    hideToast(setToast)
  })
}

/**
 * Delete component with undo support
 */
export function deleteComponent(index, components, setComponents, wires, setWires, undoStack, UndoActions, setToast) {
  const component = components[index]
  if (!component) return

  // Find wires connected to this component
  const connectedWires = wires.filter(w => w.from === component.id || w.to === component.id)

  // Record undo
  const actionInfo = UndoActions.DELETE_COMPONENT(component.type)
  undoStack.push({
    type: actionInfo.type,
    data: {
      component,
      index,
      wires: connectedWires
    }
  })

  setComponents(prev => prev.filter((_, i) => i !== index))
  setWires(prev => prev.filter(w => w.from !== component.id && w.to !== component.id))

  showToast(setToast, actionInfo.message, () => {
    // Undo: restore component and wires
    setComponents(prev => {
      const newComponents = [...prev]
      newComponents.splice(index, 0, component)
      return newComponents
    })
    setWires(prev => [...prev, ...connectedWires])
    hideToast(setToast)
  })
}

/**
 * Get component at canvas coordinates with capability-based hit radius
 */
export function getComponentAt(x, y, components, capabilities) {
  const radius = capabilities.getTouchTargetSize() / 2

  for (let i = components.length - 1; i >= 0; i--) {
    const comp = components[i]
    const dx = x - comp.x
    const dy = y - comp.y
    const size = comp.type === 'battery' ? 60 : 30

    if (Math.abs(dx) < Math.max(size, radius) && Math.abs(dy) < Math.max(size, radius)) {
      return { index: i, component: comp }
    }
  }
  return null
}

/**
 * Perform undo with toast notification
 */
export function performUndo(undoStack, setComponents, setWires, setToast, UndoActions) {
  const action = undoStack.undo()
  if (!action) return

  hideToast(setToast)

  switch (action.type) {
    case 'add-component':
      // Undo add: remove component
      setComponents(prev => prev.filter(c => c.id !== action.data.component.id))
      break

    case 'delete-component':
      // Undo delete: restore component and wires
      setComponents(prev => {
        const newComponents = [...prev]
        newComponents.splice(action.data.index, 0, action.data.component)
        return newComponents
      })
      setWires(prev => [...prev, ...action.data.wires])
      break

    case 'add-wires':
      // Undo add wires: remove wires
      const wireIds = action.data.wires.map(w => w.id)
      setWires(prev => prev.filter(w => !wireIds.includes(w.id)))
      break

    case 'delete-wire':
      // Undo delete wire: restore wire
      setWires(prev => [...prev, action.data.wire])
      break

    case 'move-component':
      // Undo move: restore old position
      setComponents(prev => prev.map((c, i) =>
        i === action.data.index
          ? { ...c, x: action.data.oldX, y: action.data.oldY }
          : c
      ))
      break

    case 'copy-component':
      // Undo copy: remove copied component
      setComponents(prev => prev.filter(c => c.id !== action.data.component.id))
      break

    default:
      console.warn('Unknown undo action type:', action.type)
  }
}
