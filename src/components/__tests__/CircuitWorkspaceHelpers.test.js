import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createWiresFromChain, deleteComponent } from '../CircuitWorkspaceHelpers'
import { UndoStack, UndoActions } from '../../utils/UndoStack'

describe('CircuitWorkspaceHelpers', () => {
  describe('createWiresFromChain - duplicate wire prevention', () => {
    let wires, setWires, undoStack, setToast

    beforeEach(() => {
      wires = []
      setWires = vi.fn()
      undoStack = new UndoStack()
      setToast = vi.fn()
    })

    it('should create wires from a chain of components', () => {
      const chain = ['comp1', 'comp2', 'comp3']
      createWiresFromChain(chain, wires, setWires, undoStack, UndoActions, setToast)

      expect(setWires).toHaveBeenCalledWith(expect.any(Array))
      const newWires = setWires.mock.calls[0][0]
      expect(newWires).toHaveLength(2)
      expect(newWires[0]).toMatchObject({ from: 'comp1', to: 'comp2' })
      expect(newWires[1]).toMatchObject({ from: 'comp2', to: 'comp3' })
    })

    it('should not create duplicate wires (same direction)', () => {
      wires = [{ id: 1, from: 'comp1', to: 'comp2' }]
      const chain = ['comp1', 'comp2', 'comp3']

      createWiresFromChain(chain, wires, setWires, undoStack, UndoActions, setToast)

      const newWires = setWires.mock.calls[0][0]
      // Should only add comp2->comp3 wire, not comp1->comp2 (duplicate)
      expect(newWires).toHaveLength(2) // Original wire + 1 new wire
      expect(newWires.filter(w => w.from === 'comp2' && w.to === 'comp3')).toHaveLength(1)
      expect(newWires.filter(w => w.from === 'comp1' && w.to === 'comp2')).toHaveLength(1) // Original
    })

    it('should not create duplicate wires (reverse direction)', () => {
      wires = [{ id: 1, from: 'comp2', to: 'comp1' }]
      const chain = ['comp1', 'comp2', 'comp3']

      createWiresFromChain(chain, wires, setWires, undoStack, UndoActions, setToast)

      const newWires = setWires.mock.calls[0][0]
      // Should only add comp2->comp3 wire, not comp1->comp2 (reverse duplicate)
      expect(newWires).toHaveLength(2) // Original wire + 1 new wire
      expect(newWires.filter(w => w.from === 'comp2' && w.to === 'comp3')).toHaveLength(1)
      expect(newWires.filter(w => w.from === 'comp2' && w.to === 'comp1')).toHaveLength(1) // Original
    })

    it('should handle battery -> led -> battery -> led chain without duplicates', () => {
      wires = []
      const chain = ['battery1', 'led1', 'battery1', 'led2']

      createWiresFromChain(chain, wires, setWires, undoStack, UndoActions, setToast)

      const newWires = setWires.mock.calls[0][0]
      expect(newWires).toHaveLength(3)
      expect(newWires[0]).toMatchObject({ from: 'battery1', to: 'led1' })
      expect(newWires[1]).toMatchObject({ from: 'led1', to: 'battery1' })
      expect(newWires[2]).toMatchObject({ from: 'battery1', to: 'led2' })

      // Now try creating same chain again - should not add duplicates
      setWires.mockClear()
      createWiresFromChain(chain, newWires, setWires, undoStack, UndoActions, setToast)

      // Should not call setWires because no new wires to add
      expect(setWires).not.toHaveBeenCalled()
    })

    it('should not call setWires when all wires already exist', () => {
      wires = [
        { id: 1, from: 'comp1', to: 'comp2' },
        { id: 2, from: 'comp2', to: 'comp3' }
      ]
      const chain = ['comp1', 'comp2', 'comp3']

      createWiresFromChain(chain, wires, setWires, undoStack, UndoActions, setToast)

      expect(setWires).not.toHaveBeenCalled()
      expect(setToast).not.toHaveBeenCalled()
    })

    it('should not create wire if chain has less than 2 components', () => {
      const chain = ['comp1']
      createWiresFromChain(chain, wires, setWires, undoStack, UndoActions, setToast)

      expect(setWires).not.toHaveBeenCalled()
    })
  })

  describe('deleteComponent - multi-select behavior', () => {
    let components, setComponents, wires, setWires, undoStack, setToast

    beforeEach(() => {
      components = [
        { id: 1, type: 'battery', x: 100, y: 100 },
        { id: 2, type: 'led', x: 200, y: 100 },
        { id: 3, type: 'resistor', x: 300, y: 100 },
        { id: 4, type: 'capacitor', x: 400, y: 100 }
      ]
      wires = [
        { id: 10, from: 1, to: 2 },
        { id: 11, from: 2, to: 3 },
        { id: 12, from: 3, to: 4 }
      ]
      setComponents = vi.fn((fn) => {
        if (typeof fn === 'function') {
          components = fn(components)
        }
      })
      setWires = vi.fn((fn) => {
        if (typeof fn === 'function') {
          wires = fn(wires)
        }
      })
      undoStack = new UndoStack()
      setToast = vi.fn()
    })

    it('should delete single component by index', () => {
      deleteComponent(1, components, setComponents, wires, setWires, undoStack, UndoActions, setToast)

      expect(setComponents).toHaveBeenCalled()
      expect(components).toHaveLength(3)
      expect(components.find(c => c.id === 2)).toBeUndefined()
    })

    it('should delete multiple components in descending order', () => {
      // Simulate multi-select delete with indices [1, 3]
      // Must delete in descending order to avoid index shifting
      const selectedIndices = [1, 3].sort((a, b) => b - a) // [3, 1]

      selectedIndices.forEach(index => {
        deleteComponent(index, components, setComponents, wires, setWires, undoStack, UndoActions, setToast)
      })

      expect(components).toHaveLength(2)
      expect(components.find(c => c.id === 2)).toBeUndefined() // LED deleted
      expect(components.find(c => c.id === 4)).toBeUndefined() // Capacitor deleted
      expect(components.find(c => c.id === 1)).toBeDefined() // Battery remains
      expect(components.find(c => c.id === 3)).toBeDefined() // Resistor remains
    })

    it('should delete wires connected to deleted components', () => {
      deleteComponent(1, components, setComponents, wires, setWires, undoStack, UndoActions, setToast)

      expect(setWires).toHaveBeenCalled()
      expect(wires.find(w => w.id === 10)).toBeUndefined() // Wire from battery to LED deleted
    })
  })
})
