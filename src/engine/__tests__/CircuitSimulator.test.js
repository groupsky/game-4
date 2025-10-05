/**
 * CircuitSimulator.test.js - Integration tests for the main circuit simulator
 *
 * Tests the orchestration layer that coordinates:
 * - Component and wire management
 * - Graph analysis (GraphAnalyzer)
 * - Capacitor simulation (CapacitorSimulation)
 * - Circuit solving (CircuitSolver)
 * - Visual state generation (VisualState)
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { CircuitSimulator } from '../CircuitSimulator.js'

describe('CircuitSimulator', () => {
  let simulator

  beforeEach(() => {
    simulator = new CircuitSimulator()
  })

  describe('Initialization', () => {
    it('should initialize with empty components and wires', () => {
      expect(simulator.components).toEqual([])
      expect(simulator.wires).toEqual([])
      expect(simulator.graph).toBeNull()
    })

    it('should create graph when components are set', () => {
      const components = [{ id: 1, type: 'battery' }]
      simulator.setComponents(components)

      expect(simulator.graph).toBeDefined()
      expect(simulator.components).toBe(components)
    })

    it('should create graph when wires are set', () => {
      const components = [{ id: 1, type: 'battery' }, { id: 2, type: 'led' }]
      const wires = [{ from: 1, to: 2 }]

      simulator.setComponents(components)
      simulator.setWires(wires)

      expect(simulator.graph).toBeDefined()
      expect(simulator.wires).toBe(wires)
    })
  })

  describe('resetCircuit', () => {
    it('should reset battery to full charge', () => {
      const battery = { id: 1, type: 'battery', charge: 0.5, voltage: 1.5 }
      const reset = simulator.resetCircuit([battery])

      expect(reset[0].charge).toBe(1.0)
      expect(reset[0].voltage).toBe(1.5) // Voltage unchanged
    })

    it('should reset capacitor to empty', () => {
      const capacitor = { id: 1, type: 'capacitor', voltage: 3.0, capacitance: 0.001 }
      const reset = simulator.resetCircuit([capacitor])

      expect(reset[0].voltage).toBe(0)
      expect(reset[0].capacitance).toBe(0.001) // Capacitance unchanged
    })

    it('should reset resistor to cold state', () => {
      const resistor = { id: 1, type: 'resistor', current: 0.1, voltageDrop: 2.0, resistance: 100 }
      const reset = simulator.resetCircuit([resistor])

      expect(reset[0].current).toBe(0)
      expect(reset[0].voltageDrop).toBe(0)
      expect(reset[0].resistance).toBe(100) // Resistance unchanged
    })

    it('should reset LED to off state', () => {
      const led = { id: 1, type: 'led', brightness: 0.8, voltage: 2.5, current: 0.02 }
      const reset = simulator.resetCircuit([led])

      expect(reset[0].brightness).toBe(0)
      expect(reset[0].voltage).toBe(0)
      expect(reset[0].current).toBe(0)
    })

    it('should reset light bulb to off state', () => {
      const bulb = { id: 1, type: 'lightbulb', brightness: 0.7, current: 0.1, power: 0.5, voltage: 5.0 }
      const reset = simulator.resetCircuit([bulb])

      expect(reset[0].brightness).toBe(0)
      expect(reset[0].current).toBe(0)
      expect(reset[0].power).toBe(0)
      expect(reset[0].voltage).toBe(0)
    })

    it('should not mutate original components', () => {
      const battery = { id: 1, type: 'battery', charge: 0.5 }
      const reset = simulator.resetCircuit([battery])

      expect(battery.charge).toBe(0.5) // Original unchanged
      expect(reset[0].charge).toBe(1.0) // Reset copy changed
    })
  })

  describe('simulate - Basic LED Circuit', () => {
    it('should light LED with battery', () => {
      const battery = { id: 1, type: 'battery', voltage: 3.0, charge: 1.0 }
      const led = { id: 2, type: 'led', brightness: 0 }
      const wires = [
        { from: 1, to: 2 },
        { from: 2, to: 1 }
      ]

      simulator.setComponents([battery, led])
      simulator.setWires(wires)
      simulator.simulate(0.1)

      expect(led.brightness).toBeGreaterThan(0)
      expect(led.current).toBeGreaterThan(0)
      expect(led.voltage).toBeGreaterThan(0)
    })

    it('should drain battery when powering LED', () => {
      const battery = { id: 1, type: 'battery', voltage: 3.0, charge: 1.0 }
      const led = { id: 2, type: 'led', brightness: 0 }
      const wires = [{ from: 1, to: 2 }, { from: 2, to: 1 }]

      simulator.setComponents([battery, led])
      simulator.setWires(wires)

      for (let i = 0; i < 100; i++) {
        simulator.simulate(0.1)
      }

      expect(battery.charge).toBeLessThan(1.0)
    })

    it('should reset LED state each simulation step', () => {
      const battery = { id: 1, type: 'battery', voltage: 3.0, charge: 1.0 }
      const led = { id: 2, type: 'led', brightness: 0.5 }
      const wires = [{ from: 1, to: 2 }, { from: 2, to: 1 }]

      simulator.setComponents([battery, led])
      simulator.setWires(wires)

      // Before simulate, brightness is 0.5
      expect(led.brightness).toBe(0.5)

      simulator.simulate(0.1)

      // After simulate, brightness is recalculated (not 0.5)
      expect(led.brightness).not.toBe(0.5)
    })
  })

  describe('simulate - Light Bulb Circuit', () => {
    it('should light bulb with battery', () => {
      const battery = { id: 1, type: 'battery', voltage: 5.0, charge: 1.0 }
      const bulb = { id: 2, type: 'lightbulb', brightness: 0, resistance: 50 }
      const wires = [{ from: 1, to: 2 }, { from: 2, to: 1 }]

      simulator.setComponents([battery, bulb])
      simulator.setWires(wires)
      simulator.simulate(0.1)

      expect(bulb.brightness).toBeGreaterThan(0)
      expect(bulb.current).toBeGreaterThan(0)
      expect(bulb.power).toBeGreaterThan(0)
    })

    it('should drain battery faster than LED (higher current)', () => {
      const battery1 = { id: 1, type: 'battery', voltage: 3.0, charge: 1.0 }
      const led = { id: 2, type: 'led', brightness: 0 }
      const wires1 = [{ from: 1, to: 2 }, { from: 2, to: 1 }]

      const battery2 = { id: 3, type: 'battery', voltage: 3.0, charge: 1.0 }
      const bulb = { id: 4, type: 'lightbulb', brightness: 0, resistance: 50 }
      const wires2 = [{ from: 3, to: 4 }, { from: 4, to: 3 }]

      const sim1 = new CircuitSimulator()
      sim1.setComponents([battery1, led])
      sim1.setWires(wires1)

      const sim2 = new CircuitSimulator()
      sim2.setComponents([battery2, bulb])
      sim2.setWires(wires2)

      for (let i = 0; i < 50; i++) {
        sim1.simulate(0.1)
        sim2.simulate(0.1)
      }

      const ledDrain = 1.0 - battery1.charge
      const bulbDrain = 1.0 - battery2.charge

      expect(bulbDrain).toBeGreaterThan(ledDrain)
    })
  })

  describe('simulate - Capacitor Behavior', () => {
    it('should charge capacitor when connected to battery', () => {
      const battery = { id: 1, type: 'battery', voltage: 3.0, charge: 1.0 }
      const capacitor = { id: 2, type: 'capacitor', voltage: 0, capacitance: 0.001 }
      const wires = [{ from: 1, to: 2 }, { from: 2, to: 1 }]

      simulator.setComponents([battery, capacitor])
      simulator.setWires(wires)

      for (let i = 0; i < 10; i++) {
        simulator.simulate(0.1)
      }

      expect(capacitor.voltage).toBeGreaterThan(0)
      expect(capacitor.voltage).toBeLessThanOrEqual(3.0)
    })

    it('should power LED from charged capacitor (no battery)', () => {
      const capacitor = { id: 1, type: 'capacitor', voltage: 3.0, capacitance: 0.001 }
      const led = { id: 2, type: 'led', brightness: 0 }
      const wires = [{ from: 1, to: 2 }, { from: 2, to: 1 }]

      simulator.setComponents([capacitor, led])
      simulator.setWires(wires)
      simulator.simulate(0.1)

      expect(led.brightness).toBeGreaterThan(0)
      expect(capacitor.voltage).toBeLessThan(3.0) // Discharged
    })
  })

  describe('simulate - Series Resistor', () => {
    it('should reduce LED brightness with resistor in circuit', () => {
      const battery = { id: 1, type: 'battery', voltage: 5.0, charge: 1.0 }
      const resistor = { id: 2, type: 'resistor', resistance: 200 }
      const led = { id: 3, type: 'led', brightness: 0 }
      const wires = [
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 1 }
      ]

      const battery2 = { id: 4, type: 'battery', voltage: 5.0, charge: 1.0 }
      const led2 = { id: 5, type: 'led', brightness: 0 }
      const wires2 = [{ from: 4, to: 5 }, { from: 5, to: 4 }]

      const sim1 = new CircuitSimulator()
      sim1.setComponents([battery, resistor, led])
      sim1.setWires(wires)
      sim1.simulate(0.1)

      const sim2 = new CircuitSimulator()
      sim2.setComponents([battery2, led2])
      sim2.setWires(wires2)
      sim2.simulate(0.1)

      // LED with resistor should be dimmer
      expect(led.brightness).toBeLessThan(led2.brightness)
    })

    it('should calculate resistor voltage drop', () => {
      const battery = { id: 1, type: 'battery', voltage: 5.0, charge: 1.0 }
      const resistor = { id: 2, type: 'resistor', resistance: 200 }
      const led = { id: 3, type: 'led', brightness: 0 }
      const wires = [
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 1 }
      ]

      simulator.setComponents([battery, resistor, led])
      simulator.setWires(wires)
      simulator.simulate(0.1)

      expect(resistor.voltageDrop).toBeGreaterThan(0)
      expect(resistor.current).toBeGreaterThan(0)
    })
  })

  describe('findCircuits', () => {
    it('should find LED circuit with battery', () => {
      const battery = { id: 1, type: 'battery', voltage: 3.0, charge: 1.0 }
      const led = { id: 2, type: 'led', brightness: 0 }
      const wires = [{ from: 1, to: 2 }, { from: 2, to: 1 }]

      simulator.setComponents([battery, led])
      simulator.setWires(wires)

      const circuits = simulator.findCircuits()

      expect(circuits).toHaveLength(1)
      expect(circuits[0].type).toBe('led')
      expect(circuits[0].batteries).toHaveLength(1)
      expect(circuits[0].led).toBe(led)
    })

    it('should find light bulb circuit with battery', () => {
      const battery = { id: 1, type: 'battery', voltage: 5.0, charge: 1.0 }
      const bulb = { id: 2, type: 'lightbulb', resistance: 50 }
      const wires = [{ from: 1, to: 2 }, { from: 2, to: 1 }]

      simulator.setComponents([battery, bulb])
      simulator.setWires(wires)

      const circuits = simulator.findCircuits()

      expect(circuits).toHaveLength(1)
      expect(circuits[0].type).toBe('lightbulb')
      expect(circuits[0].batteries).toHaveLength(1)
      expect(circuits[0].bulb).toBe(bulb)
    })

    it('should include charged capacitors as voltage sources', () => {
      const capacitor = { id: 1, type: 'capacitor', voltage: 3.0, capacitance: 0.001 }
      const led = { id: 2, type: 'led', brightness: 0 }
      const wires = [{ from: 1, to: 2 }, { from: 2, to: 1 }]

      simulator.setComponents([capacitor, led])
      simulator.setWires(wires)

      const circuits = simulator.findCircuits()

      expect(circuits).toHaveLength(1)
      expect(circuits[0].capacitors).toHaveLength(1)
      expect(circuits[0].batteries).toHaveLength(0)
    })

    it('should not include discharged capacitors (<0.1V)', () => {
      const capacitor = { id: 1, type: 'capacitor', voltage: 0.05, capacitance: 0.001 }
      const led = { id: 2, type: 'led', brightness: 0 }
      const wires = [{ from: 1, to: 2 }, { from: 2, to: 1 }]

      simulator.setComponents([capacitor, led])
      simulator.setWires(wires)

      const circuits = simulator.findCircuits()

      expect(circuits).toHaveLength(0) // No valid circuit
    })

    it('should not create circuit for LED without power source', () => {
      const led = { id: 1, type: 'led', brightness: 0 }
      const resistor = { id: 2, type: 'resistor', resistance: 100 }
      const wires = [{ from: 1, to: 2 }, { from: 2, to: 1 }]

      simulator.setComponents([led, resistor])
      simulator.setWires(wires)

      const circuits = simulator.findCircuits()

      expect(circuits).toHaveLength(0)
    })
  })

  describe('analyzeBatteryTopology', () => {
    it('should detect single series chain', () => {
      const battery1 = { id: 1, type: 'battery', voltage: 1.5, charge: 1.0 }
      const battery2 = { id: 2, type: 'battery', voltage: 1.5, charge: 1.0 }
      const led = { id: 3, type: 'led' }
      const wires = [
        { from: 1, to: 2 },  // Batteries in series
        { from: 2, to: 3 },
        { from: 3, to: 1 }
      ]

      simulator.setComponents([battery1, battery2, led])
      simulator.setWires(wires)

      const topology = simulator.analyzeBatteryTopology([battery1, battery2], led)

      expect(topology.seriesChains).toHaveLength(1)
      expect(topology.seriesChains[0]).toHaveLength(2)
      expect(topology.voltage).toBe(3.0) // 1.5V + 1.5V
    })

    it('should detect parallel battery chains', () => {
      const battery1 = { id: 1, type: 'battery', voltage: 3.0, charge: 1.0 }
      const battery2 = { id: 2, type: 'battery', voltage: 3.0, charge: 1.0 }
      const led = { id: 3, type: 'led' }
      const wires = [
        { from: 1, to: 3 },  // Battery 1 to LED
        { from: 2, to: 3 },  // Battery 2 to LED (parallel)
        { from: 3, to: 1 },
        { from: 3, to: 2 }
      ]

      simulator.setComponents([battery1, battery2, led])
      simulator.setWires(wires)

      const topology = simulator.analyzeBatteryTopology([battery1, battery2], led)

      expect(topology.seriesChains).toHaveLength(2) // 2 parallel chains
      expect(topology.parallelCount).toBe(2)
    })

    it('should handle depleted batteries (charge = 0)', () => {
      const battery1 = { id: 1, type: 'battery', voltage: 1.5, charge: 0 }  // Depleted
      const battery2 = { id: 2, type: 'battery', voltage: 1.5, charge: 1.0 }
      const led = { id: 3, type: 'led' }
      const wires = [
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 1 }
      ]

      simulator.setComponents([battery1, battery2, led])
      simulator.setWires(wires)

      const topology = simulator.analyzeBatteryTopology([battery1, battery2], led)

      // Depleted battery contributes 0V
      expect(topology.voltage).toBe(1.5) // Only battery2
    })

    it('should handle empty battery array', () => {
      const led = { id: 1, type: 'led' }
      simulator.setComponents([led])
      simulator.setWires([])

      const topology = simulator.analyzeBatteryTopology([], led)

      expect(topology.seriesChains).toHaveLength(0)
      expect(topology.voltage).toBe(0)
      expect(topology.parallelCount).toBe(0)
    })
  })

  describe('isParallelConfiguration', () => {
    it('should detect single LED as parallel', () => {
      const battery = { id: 1, type: 'battery', voltage: 3.0, charge: 1.0 }
      const led = { id: 2, type: 'led', brightness: 0 }
      const wires = [{ from: 1, to: 2 }, { from: 2, to: 1 }]

      simulator.setComponents([battery, led])
      simulator.setWires(wires)

      expect(simulator.isParallelConfiguration(led, [battery])).toBe(true)
    })

    it('should detect series LEDs (LED connected to other LEDs)', () => {
      const battery = { id: 1, type: 'battery', voltage: 6.0, charge: 1.0 }
      const led1 = { id: 2, type: 'led', brightness: 0 }
      const led2 = { id: 3, type: 'led', brightness: 0 }
      const wires = [
        { from: 1, to: 2 },  // Battery → LED1
        { from: 2, to: 3 },  // LED1 → LED2 (series)
        { from: 3, to: 1 }
      ]

      simulator.setComponents([battery, led1, led2])
      simulator.setWires(wires)

      expect(simulator.isParallelConfiguration(led1, [battery])).toBe(false)
      expect(simulator.isParallelConfiguration(led2, [battery])).toBe(false)
    })
  })

  describe('Graph Delegation Methods', () => {
    it('should delegate findConnectedComponents to GraphAnalyzer', () => {
      const battery = { id: 1, type: 'battery', voltage: 3.0, charge: 1.0 }
      const led = { id: 2, type: 'led', brightness: 0 }
      const wires = [{ from: 1, to: 2 }, { from: 2, to: 1 }]

      simulator.setComponents([battery, led])
      simulator.setWires(wires)

      const connected = simulator.findConnectedComponents(battery)

      expect(connected).toHaveLength(2)
      expect(connected).toContainEqual(battery)
      expect(connected).toContainEqual(led)
    })

    it('should delegate isConnected to GraphAnalyzer', () => {
      const battery = { id: 1, type: 'battery', voltage: 3.0, charge: 1.0 }
      const led = { id: 2, type: 'led', brightness: 0 }
      const resistor = { id: 3, type: 'resistor', resistance: 100 }
      const wires = [{ from: 1, to: 2 }]

      simulator.setComponents([battery, led, resistor])
      simulator.setWires(wires)

      expect(simulator.isConnected(battery, led)).toBe(true)
      expect(simulator.isConnected(battery, resistor)).toBe(false)
    })
  })

  describe('Visual State Delegation', () => {
    it('should delegate getBatteryVisualState', () => {
      const battery = { charge: 0.8 }
      const visual = simulator.getBatteryVisualState(battery)

      expect(visual.state).toBe('full')
      expect(visual.chargePercent).toBe(80)
    })

    it('should delegate getLEDVisualState', () => {
      const led = { brightness: 0.6 }
      const visual = simulator.getLEDVisualState(led)

      expect(visual.state).toBe('medium')
      expect(visual.brightnessPercent).toBe(60)
    })

    it('should delegate getResistorVisualState', () => {
      const resistor = { current: 0.1, resistance: 100 }
      const visual = simulator.getResistorVisualState(resistor)

      expect(visual.powerDissipated).toBeCloseTo(1.0, 2)
      expect(visual.state).toBe('warm')
    })

    it('should delegate getCapacitorVisualState', () => {
      const capacitor = { voltage: 2.5, maxVoltage: 5.0 }
      const visual = simulator.getCapacitorVisualState(capacitor)

      expect(visual.state).toBe('charged')
      expect(visual.chargePercent).toBe(50)
    })

    it('should delegate getLightBulbVisualState', () => {
      const bulb = { brightness: 0.5, power: 0.5 }
      const visual = simulator.getLightBulbVisualState(bulb)

      expect(visual.state).toBe('warm')
      expect(visual.brightnessPercent).toBe(50)
    })
  })

  describe('Helper Formulas', () => {
    it('should calculate voltage divider', () => {
      const vout = simulator.voltageDivider(10, 100, 100)
      expect(vout).toBe(5) // Equal resistors → half voltage
    })

    it('should calculate RC charge curve', () => {
      const v = simulator.rcCharge(5, 100, 0.01, 1)
      // After 1τ (R×C = 100×0.01 = 1s): V ≈ 5 × (1 - e^-1) ≈ 3.16V
      expect(v).toBeGreaterThan(3.0)
      expect(v).toBeLessThan(3.5)
    })

    it('should calculate power', () => {
      const p = simulator.power(5, 0.1)
      expect(p).toBe(0.5) // P = V × I = 5 × 0.1
    })
  })

  describe('Integration - Complete Circuit Simulation', () => {
    it('should simulate complete circuit with all component types', () => {
      const battery = { id: 1, type: 'battery', voltage: 5.0, charge: 1.0 }
      const capacitor = { id: 2, type: 'capacitor', voltage: 0, capacitance: 0.001 }
      const resistor = { id: 3, type: 'resistor', resistance: 200 }
      const led = { id: 4, type: 'led', brightness: 0 }
      const wires = [
        { from: 1, to: 2 },  // Battery → Capacitor
        { from: 2, to: 3 },  // Capacitor → Resistor
        { from: 3, to: 4 },  // Resistor → LED
        { from: 4, to: 1 }   // LED → Battery
      ]

      simulator.setComponents([battery, capacitor, resistor, led])
      simulator.setWires(wires)

      // Simulate for several steps
      for (let i = 0; i < 10; i++) {
        simulator.simulate(0.1)
      }

      // All components should have valid states
      expect(battery.charge).toBeLessThan(1.0) // Drained
      expect(capacitor.voltage).toBeGreaterThan(0) // Charged
      expect(resistor.current).toBeGreaterThan(0) // Current flowing
      expect(resistor.voltageDrop).toBeGreaterThan(0) // Voltage drop
      expect(led.brightness).toBeGreaterThan(0) // Lit
    })

    it('should handle disconnected components gracefully', () => {
      const battery = { id: 1, type: 'battery', voltage: 3.0, charge: 1.0 }
      const led1 = { id: 2, type: 'led', brightness: 0 }
      const led2 = { id: 3, type: 'led', brightness: 0 }
      const wires = [
        { from: 1, to: 2 },
        { from: 2, to: 1 }
        // LED2 not connected
      ]

      simulator.setComponents([battery, led1, led2])
      simulator.setWires(wires)
      simulator.simulate(0.1)

      expect(led1.brightness).toBeGreaterThan(0) // Connected LED lights
      expect(led2.brightness).toBe(0) // Disconnected LED stays off
    })

    it('should return components after simulation', () => {
      const battery = { id: 1, type: 'battery', voltage: 3.0, charge: 1.0 }
      const led = { id: 2, type: 'led', brightness: 0 }
      const wires = [{ from: 1, to: 2 }, { from: 2, to: 1 }]

      simulator.setComponents([battery, led])
      simulator.setWires(wires)

      const result = simulator.simulate(0.1)

      expect(result).toBe(simulator.components)
      expect(result).toHaveLength(2)
    })
  })
})
