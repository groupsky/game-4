import { describe, it, expect, beforeEach } from 'vitest'
import { UndoStack, UndoActions } from '../UndoStack'

describe('UndoStack', () => {
  let stack

  beforeEach(() => {
    stack = new UndoStack()
  })

  describe('basic operations', () => {
    it('should start empty', () => {
      expect(stack.canUndo()).toBe(false)
      expect(stack.canRedo()).toBe(false)
      expect(stack.getUndoCount()).toBe(0)
    })

    it('should push action to stack', () => {
      const action = { type: 'add-component', data: { id: 1 } }
      stack.push(action)

      expect(stack.canUndo()).toBe(true)
      expect(stack.canRedo()).toBe(false)
      expect(stack.getUndoCount()).toBe(1)
    })

    it('should undo action', () => {
      const action = { type: 'add-component', data: { id: 1 } }
      stack.push(action)

      const undone = stack.undo()

      expect(undone.type).toBe(action.type)
      expect(undone.data).toEqual(action.data)
      expect(undone.timestamp).toBeDefined()
      expect(stack.canUndo()).toBe(false)
      expect(stack.canRedo()).toBe(true)
    })

    it('should redo action', () => {
      const action = { type: 'add-component', data: { id: 1 } }
      stack.push(action)
      stack.undo()

      const redone = stack.redo()

      expect(redone.type).toBe(action.type)
      expect(redone.data).toEqual(action.data)
      expect(redone.timestamp).toBeDefined()
      expect(stack.canUndo()).toBe(true)
      expect(stack.canRedo()).toBe(false)
    })

    it('should return null when undoing empty stack', () => {
      expect(stack.undo()).toBeNull()
    })

    it('should return null when redoing with no redo history', () => {
      stack.push({ type: 'test', data: {} })
      expect(stack.redo()).toBeNull()
    })
  })

  describe('multiple actions', () => {
    it('should push multiple actions', () => {
      stack.push({ type: 'action1', data: { id: 1 } })
      stack.push({ type: 'action2', data: { id: 2 } })
      stack.push({ type: 'action3', data: { id: 3 } })

      expect(stack.getUndoCount()).toBe(3)
      expect(stack.canUndo()).toBe(true)
    })

    it('should undo multiple actions in reverse order', () => {
      stack.push({ type: 'action1', data: { id: 1 } })
      stack.push({ type: 'action2', data: { id: 2 } })
      stack.push({ type: 'action3', data: { id: 3 } })

      const undo1 = stack.undo()
      expect(undo1.type).toBe('action3')
      expect(stack.getUndoCount()).toBe(2)

      const undo2 = stack.undo()
      expect(undo2.type).toBe('action2')
      expect(stack.getUndoCount()).toBe(1)

      const undo3 = stack.undo()
      expect(undo3.type).toBe('action1')
      expect(stack.getUndoCount()).toBe(0)
    })

    it('should redo multiple actions', () => {
      stack.push({ type: 'action1', data: { id: 1 } })
      stack.push({ type: 'action2', data: { id: 2 } })

      stack.undo()
      stack.undo()

      const redo1 = stack.redo()
      expect(redo1.type).toBe('action1')

      const redo2 = stack.redo()
      expect(redo2.type).toBe('action2')

      expect(stack.canRedo()).toBe(false)
    })
  })

  describe('max size limit', () => {
    it('should limit stack to 20 actions', () => {
      // Push 25 actions
      for (let i = 0; i < 25; i++) {
        stack.push({ type: 'action', data: { id: i } })
      }

      expect(stack.getUndoCount()).toBe(20)
    })

    it('should remove oldest action when exceeding limit', () => {
      // Push 21 actions
      for (let i = 0; i < 21; i++) {
        stack.push({ type: 'action', data: { id: i } })
      }

      // Should have removed action 0, kept 1-20
      expect(stack.getUndoCount()).toBe(20)

      // Undo all and check oldest is id:1 (not id:0)
      let lastAction
      while (stack.canUndo()) {
        lastAction = stack.undo()
      }
      expect(lastAction.data.id).toBe(1)
    })
  })

  describe('redo history clearing', () => {
    it('should clear redo history when pushing new action', () => {
      stack.push({ type: 'action1', data: {} })
      stack.push({ type: 'action2', data: {} })
      stack.undo()

      expect(stack.canRedo()).toBe(true)

      stack.push({ type: 'action3', data: {} })

      expect(stack.canRedo()).toBe(false)
      expect(stack.getUndoCount()).toBe(2)
    })

    it('should clear multiple redo actions', () => {
      stack.push({ type: 'action1', data: {} })
      stack.push({ type: 'action2', data: {} })
      stack.push({ type: 'action3', data: {} })

      stack.undo()
      stack.undo()

      expect(stack.canRedo()).toBe(true)

      stack.push({ type: 'action4', data: {} })

      expect(stack.canRedo()).toBe(false)
    })
  })

  describe('clear operation', () => {
    it('should clear all actions', () => {
      stack.push({ type: 'action1', data: {} })
      stack.push({ type: 'action2', data: {} })

      stack.clear()

      expect(stack.canUndo()).toBe(false)
      expect(stack.canRedo()).toBe(false)
      expect(stack.getUndoCount()).toBe(0)
    })

    it('should clear redo history', () => {
      stack.push({ type: 'action1', data: {} })
      stack.undo()

      expect(stack.canRedo()).toBe(true)

      stack.clear()

      expect(stack.canRedo()).toBe(false)
    })
  })

  describe('peek operations', () => {
    it('should peek at last action without removing', () => {
      const action = { type: 'test', data: { id: 1 } }
      stack.push(action)

      const peeked = stack.peek()

      expect(peeked.type).toBe(action.type)
      expect(peeked.data).toEqual(action.data)
      expect(peeked.timestamp).toBeDefined()
      expect(stack.canUndo()).toBe(true)
      expect(stack.getUndoCount()).toBe(1)
    })

    it('should return null when peeking empty stack', () => {
      expect(stack.peek()).toBeNull()
    })
  })

  describe('change notifications', () => {
    it('should notify listeners on push', () => {
      let notified = false
      stack.onChange(() => { notified = true })

      stack.push({ type: 'test', data: {} })

      expect(notified).toBe(true)
    })

    it('should notify listeners on undo', () => {
      let notified = false
      stack.push({ type: 'test', data: {} })
      stack.onChange(() => { notified = true })

      stack.undo()

      expect(notified).toBe(true)
    })

    it('should notify listeners on redo', () => {
      let notified = false
      stack.push({ type: 'test', data: {} })
      stack.undo()
      stack.onChange(() => { notified = true })

      stack.redo()

      expect(notified).toBe(true)
    })

    it('should notify listeners on clear', () => {
      let notified = false
      stack.push({ type: 'test', data: {} })
      stack.onChange(() => { notified = true })

      stack.clear()

      expect(notified).toBe(true)
    })

    it('should notify multiple listeners', () => {
      let count = 0
      stack.onChange(() => { count++ })
      stack.onChange(() => { count++ })

      stack.push({ type: 'test', data: {} })

      expect(count).toBe(2)
    })
  })
})

describe('UndoActions', () => {
  describe('ADD_COMPONENT', () => {
    it('should format battery message', () => {
      const action = UndoActions.ADD_COMPONENT('battery')

      expect(action.type).toBe('add-component')
      expect(action.message).toBe('🥔 Battery added')
    })

    it('should format LED message', () => {
      const action = UndoActions.ADD_COMPONENT('led')

      expect(action.type).toBe('add-component')
      expect(action.message).toBe('💡 LED added')
    })

    it('should format unknown component', () => {
      const action = UndoActions.ADD_COMPONENT('unknown')

      expect(action.type).toBe('add-component')
      expect(action.message).toBe('Component added')
    })
  })

  describe('DELETE_COMPONENT', () => {
    it('should format delete message', () => {
      const action = UndoActions.DELETE_COMPONENT('resistor')

      expect(action.type).toBe('delete-component')
      expect(action.message).toBe('⚡ Resistor deleted')
    })
  })

  describe('ADD_WIRES', () => {
    it('should format single wire message', () => {
      const action = UndoActions.ADD_WIRES(1)

      expect(action.type).toBe('add-wires')
      expect(action.message).toBe('Wire created')
    })

    it('should format multiple wires message', () => {
      const action = UndoActions.ADD_WIRES(5)

      expect(action.type).toBe('add-wires')
      expect(action.message).toBe('5 wires created')
    })
  })

  describe('DELETE_WIRE', () => {
    it('should format delete wire message', () => {
      const action = UndoActions.DELETE_WIRE()

      expect(action.type).toBe('delete-wire')
      expect(action.message).toBe('Wire deleted')
    })
  })

  describe('MOVE_COMPONENT', () => {
    it('should format move message', () => {
      const action = UndoActions.MOVE_COMPONENT()

      expect(action.type).toBe('move-component')
      expect(action.message).toBe('Component moved')
    })
  })

  describe('COPY_COMPONENT', () => {
    it('should format copy message', () => {
      const action = UndoActions.COPY_COMPONENT('capacitor')

      expect(action.type).toBe('copy-component')
      expect(action.message).toBe('⚡ Capacitor copied')
    })
  })
})
