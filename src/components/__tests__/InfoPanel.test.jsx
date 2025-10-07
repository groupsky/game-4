/**
 * InfoPanel.test.jsx - React component tests for InfoPanel
 *
 * Tests the status display panel that shows current mode,
 * component counts, and contextual messages.
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InfoPanel } from '../InfoPanel.jsx'

describe('InfoPanel', () => {
  describe('Mode Display', () => {
    it('should show "SIMULATION RUNNING" when isRunning is true', () => {
      render(
        <InfoPanel
          isRunning={true}
          components={[]}
          wires={[]}
          selectedComponents={[]}
          selectedComponent={null}
        />
      )

      expect(screen.getByText(/SIMULATION RUNNING/i)).toBeInTheDocument()
    })

    it('should show simulation running message with editing disabled hint', () => {
      render(
        <InfoPanel
          isRunning={true}
          components={[]}
          wires={[]}
          selectedComponents={[]}
          selectedComponent={null}
        />
      )

      expect(screen.getByText(/Editing disabled/i)).toBeInTheDocument()
      expect(screen.getByText(/Press Stop to edit/i)).toBeInTheDocument()
    })

    it('should show "EDIT MODE" when isRunning is false', () => {
      render(
        <InfoPanel
          isRunning={false}
          components={[]}
          wires={[]}
          selectedComponents={[]}
          selectedComponent={null}
        />
      )

      expect(screen.getByText(/EDIT MODE/i)).toBeInTheDocument()
    })

    it('should show editing instructions when in edit mode', () => {
      render(
        <InfoPanel
          isRunning={false}
          components={[]}
          wires={[]}
          selectedComponents={[]}
          selectedComponent={null}
        />
      )

      expect(screen.getByText(/Click mode button/i)).toBeInTheDocument()
      expect(screen.getByText(/Wire mode: Click components in sequence/i)).toBeInTheDocument()
    })
  })

  describe('Component and Wire Counts', () => {
    it('should display zero components and wires', () => {
      render(
        <InfoPanel
          isRunning={false}
          components={[]}
          wires={[]}
          selectedComponents={[]}
          selectedComponent={null}
        />
      )

      expect(screen.getByText(/Components: 0/i)).toBeInTheDocument()
      expect(screen.getByText(/Wires: 0/i)).toBeInTheDocument()
    })

    it('should display correct component count', () => {
      const components = [
        { type: 'battery', id: 1 },
        { type: 'led', id: 2 },
        { type: 'resistor', id: 3 }
      ]

      render(
        <InfoPanel
          isRunning={false}
          components={components}
          wires={[]}
          selectedComponents={[]}
          selectedComponent={null}
        />
      )

      expect(screen.getByText(/Components: 3/i)).toBeInTheDocument()
    })

    it('should display correct wire count', () => {
      const wires = [
        { from: 1, to: 2 },
        { from: 2, to: 3 }
      ]

      render(
        <InfoPanel
          isRunning={false}
          components={[]}
          wires={wires}
          selectedComponents={[]}
          selectedComponent={null}
        />
      )

      expect(screen.getByText(/Wires: 2/i)).toBeInTheDocument()
    })

    it('should display both counts correctly', () => {
      const components = [
        { type: 'battery', id: 1 },
        { type: 'led', id: 2 }
      ]
      const wires = [{ from: 1, to: 2 }]

      render(
        <InfoPanel
          isRunning={false}
          components={components}
          wires={wires}
          selectedComponents={[]}
          selectedComponent={null}
        />
      )

      expect(screen.getByText(/Components: 2.*Wires: 1/i)).toBeInTheDocument()
    })
  })

  describe('Multi-Selection State', () => {
    it('should show selected count when multiple components selected', () => {
      render(
        <InfoPanel
          isRunning={false}
          components={[]}
          wires={[]}
          selectedComponents={[1, 2, 3]}
          selectedComponent={null}
        />
      )

      expect(screen.getByText(/Selected: 3 components/i)).toBeInTheDocument()
    })

    it('should show delete hint for multi-selection', () => {
      render(
        <InfoPanel
          isRunning={false}
          components={[]}
          wires={[]}
          selectedComponents={[1, 2]}
          selectedComponent={null}
        />
      )

      expect(screen.getByText(/Press Delete to remove/i)).toBeInTheDocument()
    })

    it('should not show multi-selection during simulation', () => {
      render(
        <InfoPanel
          isRunning={true}
          components={[]}
          wires={[]}
          selectedComponents={[1, 2]}
          selectedComponent={null}
        />
      )

      expect(screen.queryByText(/Selected: 2 components/i)).not.toBeInTheDocument()
    })
  })

  describe('Single Selection State', () => {
    it('should show component type when single component selected', () => {
      const components = [
        { type: 'battery', id: 1 },
        { type: 'led', id: 2 }
      ]

      render(
        <InfoPanel
          isRunning={false}
          components={components}
          wires={[]}
          selectedComponents={[]}
          selectedComponent={1}
        />
      )

      expect(screen.getByText(/Selected: led/i)).toBeInTheDocument()
    })

    it('should show delete hint for single selection', () => {
      const components = [{ type: 'resistor', id: 1 }]

      render(
        <InfoPanel
          isRunning={false}
          components={components}
          wires={[]}
          selectedComponents={[]}
          selectedComponent={0}
        />
      )

      expect(screen.getByText(/Press Delete to remove/i)).toBeInTheDocument()
    })

    it('should not show single selection when multi-selection active', () => {
      const components = [
        { type: 'battery', id: 1 },
        { type: 'led', id: 2 }
      ]

      render(
        <InfoPanel
          isRunning={false}
          components={components}
          wires={[]}
          selectedComponents={[0, 1]}
          selectedComponent={0}
        />
      )

      // Should show multi-selection, not single
      expect(screen.getByText(/Selected: 2 components/i)).toBeInTheDocument()
      expect(screen.queryByText(/Selected: battery/i)).not.toBeInTheDocument()
    })

    it('should not show single selection during simulation', () => {
      const components = [{ type: 'battery', id: 1 }]

      render(
        <InfoPanel
          isRunning={true}
          components={components}
          wires={[]}
          selectedComponents={[]}
          selectedComponent={0}
        />
      )

      expect(screen.queryByText(/Selected: battery/i)).not.toBeInTheDocument()
    })

    it('should handle null component gracefully', () => {
      const components = []

      render(
        <InfoPanel
          isRunning={false}
          components={components}
          wires={[]}
          selectedComponents={[]}
          selectedComponent={0}
        />
      )

      // Should not crash, optional chaining handles undefined
      expect(screen.getByText(/Components: 0/i)).toBeInTheDocument()
    })
  })

  describe('State Priority', () => {
    it('should prioritize simulation running over all other states', () => {
      const components = [{ type: 'battery', id: 1 }]

      render(
        <InfoPanel
          isRunning={true}
          components={components}
          wires={[]}
          selectedComponents={[0]}
          selectedComponent={0}
        />
      )

      expect(screen.getByText(/SIMULATION RUNNING/i)).toBeInTheDocument()
      expect(screen.queryByText(/EDIT MODE/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Connecting/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Selected/i)).not.toBeInTheDocument()
    })

    it('should show all edit mode states when not running', () => {
      const components = [
        { type: 'battery', id: 1 },
        { type: 'led', id: 2 }
      ]

      render(
        <InfoPanel
          isRunning={false}
          components={components}
          wires={[{ from: 1, to: 2 }]}
          selectedComponents={[]}
          selectedComponent={1}
        />
      )

      expect(screen.getByText(/EDIT MODE/i)).toBeInTheDocument()
      expect(screen.getByText(/Components: 2/i)).toBeInTheDocument()
      expect(screen.getByText(/Wires: 1/i)).toBeInTheDocument()
      expect(screen.getByText(/Selected: led/i)).toBeInTheDocument()
    })
  })

  describe('Component Rendering', () => {
    it('should render the info-panel div', () => {
      const { container } = render(
        <InfoPanel
          isRunning={false}
          components={[]}
          wires={[]}
          selectedComponents={[]}
          selectedComponent={null}
        />
      )

      expect(container.querySelector('.info-panel')).toBeInTheDocument()
    })

    it('should render multiple paragraph elements', () => {
      const { container } = render(
        <InfoPanel
          isRunning={false}
          components={[]}
          wires={[]}
          selectedComponents={[]}
          selectedComponent={null}
        />
      )

      const paragraphs = container.querySelectorAll('p')
      expect(paragraphs.length).toBeGreaterThanOrEqual(2)
    })
  })
})
