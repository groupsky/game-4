/**
 * Toolbar.test.jsx - React component tests for Toolbar
 *
 * Tests the mode-based toolbar component for simulation control
 * and component placement mode selection.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Toolbar } from '../Toolbar.jsx'

describe('Toolbar', () => {
  describe('Simulation Control Button', () => {
    it('should render start button when not running', () => {
      const onToggleSimulation = vi.fn()
      const onModeChange = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={onToggleSimulation}
          onModeChange={onModeChange}
          activeMode={null}
        />
      )

      expect(screen.getByRole('button', { name: /Start/i })).toBeInTheDocument()
    })

    it('should render stop button when running', () => {
      const onToggleSimulation = vi.fn()
      const onModeChange = vi.fn()

      render(
        <Toolbar
          isRunning={true}
          onToggleSimulation={onToggleSimulation}
          onModeChange={onModeChange}
          activeMode={null}
        />
      )

      expect(screen.getByRole('button', { name: /Stop/i })).toBeInTheDocument()
    })

    it('should call onToggleSimulation when start button clicked', () => {
      const onToggleSimulation = vi.fn()
      const onModeChange = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={onToggleSimulation}
          onModeChange={onModeChange}
          activeMode={null}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /Start/i }))

      expect(onToggleSimulation).toHaveBeenCalledTimes(1)
    })

    it('should call onToggleSimulation when stop button clicked', () => {
      const onToggleSimulation = vi.fn()
      const onModeChange = vi.fn()

      render(
        <Toolbar
          isRunning={true}
          onToggleSimulation={onToggleSimulation}
          onModeChange={onModeChange}
          activeMode={null}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /Stop/i }))

      expect(onToggleSimulation).toHaveBeenCalledTimes(1)
    })

    it('should have "running" class when simulation is running', () => {
      const onToggleSimulation = vi.fn()
      const onModeChange = vi.fn()

      render(
        <Toolbar
          isRunning={true}
          onToggleSimulation={onToggleSimulation}
          onModeChange={onModeChange}
          activeMode={null}
        />
      )

      const button = screen.getByRole('button', { name: /Stop/i })
      expect(button).toHaveClass('running')
    })

    it('should have "stopped" class when simulation is not running', () => {
      const onToggleSimulation = vi.fn()
      const onModeChange = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={onToggleSimulation}
          onModeChange={onModeChange}
          activeMode={null}
        />
      )

      const button = screen.getByRole('button', { name: /Start/i })
      expect(button).toHaveClass('stopped')
    })
  })

  describe('Component Mode Buttons', () => {
    it('should render battery mode button', () => {
      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={vi.fn()}
          activeMode={null}
        />
      )

      expect(screen.getByRole('button', { name: /Battery/i })).toBeInTheDocument()
    })

    it('should render LED mode button', () => {
      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={vi.fn()}
          activeMode={null}
        />
      )

      expect(screen.getByRole('button', { name: /LED/i })).toBeInTheDocument()
    })

    it('should render resistor mode button', () => {
      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={vi.fn()}
          activeMode={null}
        />
      )

      expect(screen.getByRole('button', { name: /Resistor/i })).toBeInTheDocument()
    })

    it('should render capacitor mode button', () => {
      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={vi.fn()}
          activeMode={null}
        />
      )

      expect(screen.getByRole('button', { name: /Capacitor/i })).toBeInTheDocument()
    })

    it('should render bulb mode button', () => {
      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={vi.fn()}
          activeMode={null}
        />
      )

      expect(screen.getByRole('button', { name: /Bulb/i })).toBeInTheDocument()
    })

    it('should render wire mode button', () => {
      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={vi.fn()}
          activeMode={null}
        />
      )

      expect(screen.getByRole('button', { name: /Wire/i })).toBeInTheDocument()
    })

    it('should disable component buttons when simulation is running', () => {
      render(
        <Toolbar
          isRunning={true}
          onToggleSimulation={vi.fn()}
          onModeChange={vi.fn()}
          activeMode={null}
        />
      )

      expect(screen.getByRole('button', { name: /Battery/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /LED/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /Resistor/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /Capacitor/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /Bulb/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /Wire/i })).toBeDisabled()
    })

    it('should enable component buttons when simulation is not running', () => {
      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={vi.fn()}
          activeMode={null}
        />
      )

      expect(screen.getByRole('button', { name: /Battery/i })).not.toBeDisabled()
      expect(screen.getByRole('button', { name: /LED/i })).not.toBeDisabled()
      expect(screen.getByRole('button', { name: /Resistor/i })).not.toBeDisabled()
      expect(screen.getByRole('button', { name: /Capacitor/i })).not.toBeDisabled()
      expect(screen.getByRole('button', { name: /Bulb/i })).not.toBeDisabled()
      expect(screen.getByRole('button', { name: /Wire/i })).not.toBeDisabled()
    })
  })

  describe('Mode Selection', () => {
    it('should call onModeChange with "battery" when battery button clicked (inactive)', () => {
      const onModeChange = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={onModeChange}
          activeMode={null}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /Battery/i }))

      expect(onModeChange).toHaveBeenCalledWith('battery')
    })

    it('should call onModeChange with null when battery button clicked (active)', () => {
      const onModeChange = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={onModeChange}
          activeMode="battery"
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /Battery/i }))

      expect(onModeChange).toHaveBeenCalledWith(null)
    })

    it('should call onModeChange with "led" when LED button clicked', () => {
      const onModeChange = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={onModeChange}
          activeMode={null}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /LED/i }))

      expect(onModeChange).toHaveBeenCalledWith('led')
    })

    it('should call onModeChange with "resistor" when resistor button clicked', () => {
      const onModeChange = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={onModeChange}
          activeMode={null}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /Resistor/i }))

      expect(onModeChange).toHaveBeenCalledWith('resistor')
    })

    it('should call onModeChange with "capacitor" when capacitor button clicked', () => {
      const onModeChange = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={onModeChange}
          activeMode={null}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /Capacitor/i }))

      expect(onModeChange).toHaveBeenCalledWith('capacitor')
    })

    it('should call onModeChange with "lightbulb" when bulb button clicked', () => {
      const onModeChange = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={onModeChange}
          activeMode={null}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /Bulb/i }))

      expect(onModeChange).toHaveBeenCalledWith('lightbulb')
    })

    it('should call onModeChange with "wire" when wire button clicked', () => {
      const onModeChange = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={onModeChange}
          activeMode={null}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /Wire/i }))

      expect(onModeChange).toHaveBeenCalledWith('wire')
    })
  })

  describe('Active Mode Highlighting', () => {
    it('should add "active" class to battery button when battery mode is active', () => {
      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={vi.fn()}
          activeMode="battery"
        />
      )

      expect(screen.getByRole('button', { name: /Battery/i })).toHaveClass('active')
    })

    it('should add "active" class to LED button when LED mode is active', () => {
      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={vi.fn()}
          activeMode="led"
        />
      )

      expect(screen.getByRole('button', { name: /LED/i })).toHaveClass('active')
    })

    it('should add "active" class to resistor button when resistor mode is active', () => {
      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={vi.fn()}
          activeMode="resistor"
        />
      )

      expect(screen.getByRole('button', { name: /Resistor/i })).toHaveClass('active')
    })

    it('should add "active" class to capacitor button when capacitor mode is active', () => {
      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={vi.fn()}
          activeMode="capacitor"
        />
      )

      expect(screen.getByRole('button', { name: /Capacitor/i })).toHaveClass('active')
    })

    it('should add "active" class to bulb button when lightbulb mode is active', () => {
      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={vi.fn()}
          activeMode="lightbulb"
        />
      )

      expect(screen.getByRole('button', { name: /Bulb/i })).toHaveClass('active')
    })

    it('should add "active" class to wire button when wire mode is active', () => {
      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={vi.fn()}
          activeMode="wire"
        />
      )

      expect(screen.getByRole('button', { name: /Wire/i })).toHaveClass('active')
    })

    it('should not add "active" class to any button when no mode is active', () => {
      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={vi.fn()}
          onModeChange={vi.fn()}
          activeMode={null}
        />
      )

      expect(screen.getByRole('button', { name: /Battery/i })).not.toHaveClass('active')
      expect(screen.getByRole('button', { name: /LED/i })).not.toHaveClass('active')
      expect(screen.getByRole('button', { name: /Resistor/i })).not.toHaveClass('active')
      expect(screen.getByRole('button', { name: /Capacitor/i })).not.toHaveClass('active')
      expect(screen.getByRole('button', { name: /Bulb/i })).not.toHaveClass('active')
      expect(screen.getByRole('button', { name: /Wire/i })).not.toHaveClass('active')
    })
  })
})
