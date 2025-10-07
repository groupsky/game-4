/**
 * UndoStack - Multi-level undo/redo system
 *
 * Stores up to 20 actions with undo/redo capability.
 * Cleared when simulation starts or challenge changes.
 */

export class UndoStack {
  constructor() {
    this.stack = []
    this.current = -1 // Points to current position, -1 means empty
    this.maxSize = 20
    this.listeners = []
  }

  /**
   * Push a new action onto the stack
   * Clears any redo history
   */
  push(action) {
    // Remove any redo history (everything after current)
    this.stack = this.stack.slice(0, this.current + 1)

    // Add new action
    this.stack.push({
      type: action.type,
      data: action.data,
      timestamp: Date.now()
    })

    // Remove oldest if exceeding max size
    if (this.stack.length > this.maxSize) {
      this.stack.shift()
    } else {
      this.current++
    }

    this.notifyListeners()
  }

  /**
   * Undo the last action
   * Returns the action or null if nothing to undo
   */
  undo() {
    if (!this.canUndo()) {
      return null
    }

    const action = this.stack[this.current]
    this.current--
    this.notifyListeners()
    return action
  }

  /**
   * Redo the next action
   * Returns the action or null if nothing to redo
   */
  redo() {
    if (!this.canRedo()) {
      return null
    }

    this.current++
    const action = this.stack[this.current]
    this.notifyListeners()
    return action
  }

  /**
   * Check if undo is available
   */
  canUndo() {
    return this.current >= 0
  }

  /**
   * Check if redo is available
   */
  canRedo() {
    return this.current < this.stack.length - 1
  }

  /**
   * Get number of available undos
   */
  getUndoCount() {
    return this.current + 1
  }

  /**
   * Peek at the last action without removing it
   */
  peek() {
    if (!this.canUndo()) {
      return null
    }
    return this.stack[this.current]
  }

  /**
   * Clear all undo/redo history
   */
  clear() {
    this.stack = []
    this.current = -1
    this.notifyListeners()
  }

  /**
   * Add listener for stack changes
   */
  onChange(callback) {
    this.listeners.push(callback)
  }

  /**
   * Notify all listeners
   */
  notifyListeners() {
    this.listeners.forEach(listener => listener(this))
  }
}

/**
 * Action types and their descriptions for toast messages
 */
export const UndoActions = {
  ADD_COMPONENT: (componentType) => ({
    type: 'add-component',
    message: `${getComponentName(componentType)} added`
  }),

  DELETE_COMPONENT: (componentType) => ({
    type: 'delete-component',
    message: `${getComponentName(componentType)} deleted`
  }),

  ADD_WIRES: (count) => ({
    type: 'add-wires',
    message: count === 1 ? 'Wire created' : `${count} wires created`
  }),

  DELETE_WIRE: () => ({
    type: 'delete-wire',
    message: 'Wire deleted'
  }),

  MOVE_COMPONENT: () => ({
    type: 'move-component',
    message: 'Component moved'
  }),

  COPY_COMPONENT: (componentType) => ({
    type: 'copy-component',
    message: `${getComponentName(componentType)} copied`
  })
}

function getComponentName(type) {
  const names = {
    battery: '🥔 Battery',
    led: '💡 LED',
    resistor: '⚡ Resistor',
    capacitor: '⚡ Capacitor',
    lightbulb: '💡 Bulb'
  }
  return names[type] || 'Component'
}
