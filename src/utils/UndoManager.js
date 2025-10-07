/**
 * UndoManager - Single-level undo system for mobile
 *
 * Stores the last action and allows one-level undo.
 * Cleared when simulation starts or challenge changes.
 */

export class UndoManager {
  constructor() {
    this.lastAction = null
    this.listeners = []
  }

  /**
   * Record an action that can be undone
   */
  record(action) {
    this.lastAction = {
      type: action.type,
      data: action.data,
      timestamp: Date.now()
    }
    this.notifyListeners()
  }

  /**
   * Check if undo is available
   */
  canUndo() {
    return this.lastAction !== null
  }

  /**
   * Get the last action
   */
  getLastAction() {
    return this.lastAction
  }

  /**
   * Clear undo history
   */
  clear() {
    this.lastAction = null
    this.notifyListeners()
  }

  /**
   * Execute undo and return the action data
   */
  undo() {
    const action = this.lastAction
    this.lastAction = null
    this.notifyListeners()
    return action
  }

  /**
   * Add listener for undo state changes
   */
  onChange(callback) {
    this.listeners.push(callback)
  }

  /**
   * Notify all listeners
   */
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.canUndo()))
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
