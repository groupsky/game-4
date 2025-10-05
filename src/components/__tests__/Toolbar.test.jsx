/**
 * Toolbar.test.jsx - React component tests for Toolbar
 *
 * Tests the toolbar component for simulation control and
 * adding circuit components.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Toolbar } from '../Toolbar.jsx'

describe('Toolbar', () => {
  describe('Simulation Control Button', () => {
    it('should render start button when not running', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      expect(screen.getByRole('button', { name: /Start/i })).toBeInTheDocument()
    })

    it('should render stop button when running', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      render(
        <Toolbar
          isRunning={true}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      expect(screen.getByRole('button', { name: /Stop/i })).toBeInTheDocument()
    })

    it('should call onToggleSimulation when start button clicked', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /Start/i }))

      expect(onToggleSimulation).toHaveBeenCalledTimes(1)
    })

    it('should call onToggleSimulation when stop button clicked', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      render(
        <Toolbar
          isRunning={true}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /Stop/i }))

      expect(onToggleSimulation).toHaveBeenCalledTimes(1)
    })

    it('should have "running" class when simulation is running', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      render(
        <Toolbar
          isRunning={true}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      const button = screen.getByRole('button', { name: /Stop/i })
      expect(button.className).toContain('running')
    })

    it('should have "stopped" class when simulation is stopped', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      const button = screen.getByRole('button', { name: /Start/i })
      expect(button.className).toContain('stopped')
    })
  })

  describe('Component Buttons - Enabled State', () => {
    it('should enable all component buttons when not running', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      expect(screen.getByRole('button', { name: /Potato/i })).not.toBeDisabled()
      expect(screen.getByRole('button', { name: /LED/i })).not.toBeDisabled()
      expect(screen.getByRole('button', { name: /Resistor/i })).not.toBeDisabled()
      expect(screen.getByRole('button', { name: /Capacitor/i })).not.toBeDisabled()
      expect(screen.getByRole('button', { name: /Light Bulb/i })).not.toBeDisabled()
    })

    it('should disable all component buttons when running', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      render(
        <Toolbar
          isRunning={true}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      expect(screen.getByRole('button', { name: /Potato/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /LED/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /Resistor/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /Capacitor/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /Light Bulb/i })).toBeDisabled()
    })
  })

  describe('Add Battery', () => {
    it('should call onAddComponent with battery data when clicked', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /Potato/i }))

      expect(onAddComponent).toHaveBeenCalledTimes(1)
      const component = onAddComponent.mock.calls[0][0]
      expect(component.type).toBe('battery')
      expect(component.voltage).toBe(0.9)
      expect(component.charge).toBe(1.0)
      expect(component.id).toBeDefined()
      expect(component.x).toBeGreaterThanOrEqual(100)
      expect(component.y).toBeGreaterThanOrEqual(100)
    })

    it('should generate unique ID for battery', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /Potato/i }))
      const id1 = onAddComponent.mock.calls[0][0].id

      fireEvent.click(screen.getByRole('button', { name: /Potato/i }))
      const id2 = onAddComponent.mock.calls[1][0].id

      expect(id1).not.toBe(id2)
    })
  })

  describe('Add LED', () => {
    it('should call onAddComponent with LED data when clicked', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /LED/i }))

      expect(onAddComponent).toHaveBeenCalledTimes(1)
      const component = onAddComponent.mock.calls[0][0]
      expect(component.type).toBe('led')
      expect(component.brightness).toBe(0)
      expect(component.id).toBeDefined()
      expect(component.x).toBeGreaterThanOrEqual(250)
      expect(component.y).toBeGreaterThanOrEqual(100)
    })
  })

  describe('Add Resistor', () => {
    it('should call onAddComponent with resistor data when clicked', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /Resistor/i }))

      expect(onAddComponent).toHaveBeenCalledTimes(1)
      const component = onAddComponent.mock.calls[0][0]
      expect(component.type).toBe('resistor')
      expect(component.resistance).toBe(100)
      expect(component.current).toBe(0)
      expect(component.id).toBeDefined()
      expect(component.x).toBeGreaterThanOrEqual(400)
      expect(component.y).toBeGreaterThanOrEqual(100)
    })

    it('should show 100Ω in button label', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      expect(screen.getByRole('button', { name: /100Ω/i })).toBeInTheDocument()
    })
  })

  describe('Add Capacitor', () => {
    it('should call onAddComponent with capacitor data when clicked', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /Capacitor/i }))

      expect(onAddComponent).toHaveBeenCalledTimes(1)
      const component = onAddComponent.mock.calls[0][0]
      expect(component.type).toBe('capacitor')
      expect(component.capacitance).toBe(0.1)
      expect(component.voltage).toBe(0)
      expect(component.maxVoltage).toBe(5.0)
      expect(component.id).toBeDefined()
      expect(component.x).toBeGreaterThanOrEqual(550)
      expect(component.y).toBeGreaterThanOrEqual(100)
    })

    it('should show 100mF in button label', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      expect(screen.getByRole('button', { name: /100mF/i })).toBeInTheDocument()
    })
  })

  describe('Add Light Bulb', () => {
    it('should call onAddComponent with light bulb data when clicked', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /Light Bulb/i }))

      expect(onAddComponent).toHaveBeenCalledTimes(1)
      const component = onAddComponent.mock.calls[0][0]
      expect(component.type).toBe('lightbulb')
      expect(component.brightness).toBe(0)
      expect(component.resistance).toBe(0.36)
      expect(component.current).toBe(0)
      expect(component.power).toBe(0)
      expect(component.id).toBeDefined()
      expect(component.x).toBeGreaterThanOrEqual(700)
      expect(component.y).toBeGreaterThanOrEqual(100)
    })
  })

  describe('Component Position Randomization', () => {
    it('should randomize battery position within range', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /Potato/i }))

      const component = onAddComponent.mock.calls[0][0]
      // x: 100 + Math.random() * 100 = [100, 200)
      expect(component.x).toBeGreaterThanOrEqual(100)
      expect(component.x).toBeLessThan(200)
      // y: 100 + Math.random() * 100 = [100, 200)
      expect(component.y).toBeGreaterThanOrEqual(100)
      expect(component.y).toBeLessThan(200)
    })

    it('should place different component types at different x offsets', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /Potato/i }))
      const battery = onAddComponent.mock.calls[0][0]

      fireEvent.click(screen.getByRole('button', { name: /LED/i }))
      const led = onAddComponent.mock.calls[1][0]

      fireEvent.click(screen.getByRole('button', { name: /Resistor/i }))
      const resistor = onAddComponent.mock.calls[2][0]

      // Battery starts at x=100, LED at x=250, Resistor at x=400
      expect(battery.x).toBeLessThan(200)
      expect(led.x).toBeGreaterThanOrEqual(250)
      expect(led.x).toBeLessThan(350)
      expect(resistor.x).toBeGreaterThanOrEqual(400)
    })
  })

  describe('Component Rendering', () => {
    it('should render the toolbar div', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      const { container } = render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      expect(container.querySelector('.toolbar')).toBeInTheDocument()
    })

    it('should render 6 buttons (1 control + 5 components)', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(6)
    })
  })

  describe('Button Labels', () => {
    it('should show emoji labels for all components', () => {
      const onToggleSimulation = vi.fn()
      const onAddComponent = vi.fn()

      render(
        <Toolbar
          isRunning={false}
          onToggleSimulation={onToggleSimulation}
          onAddComponent={onAddComponent}
        />
      )

      expect(screen.getByRole('button', { name: /🥔/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /💡 LED/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /⚡ Resistor/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /⚡ Capacitor/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /💡 Light Bulb/i })).toBeInTheDocument()
    })
  })
})
