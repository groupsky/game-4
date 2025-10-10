/**
 * TimedChallengeIntegration.test.js - Integration tests for timed challenges
 *
 * Verifies that timed challenges work correctly with TimeTracker:
 * - Challenge requirements are met
 * - Timer runs for required duration
 * - 10-second minimum is enforced
 * - Success is reported after goal time reached
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ChallengeSystem } from '../ChallengeSystem'
import { ComponentFactory } from '../../utils/ComponentFactory'
import { CircuitSimulator } from '../../engine/CircuitSimulator'

describe('Timed Challenge Integration', () => {
  let challengeSystem
  let simulator
  let timeTracker

  beforeEach(() => {
    vi.useFakeTimers()
    challengeSystem = new ChallengeSystem()
    simulator = new CircuitSimulator()
    timeTracker = challengeSystem.getTimeTracker()
  })

  describe('Challenge 5: Battery Blues (30s)', () => {
    it('should pass when light bulb stays lit for 30 seconds', () => {
      // Arrange: Build working circuit with 63 batteries + 1 bulb (enough for 30s with 0.36Ω bulb)
      // Need parallel chains: 3 batteries/chain @ 2.7V = 7.5A, drains 0.675/sec
      // For 30s: need 20.25 capacity = 21 parallel chains = 63 batteries total
      const numChains = 21
      const batteriesPerChain = 3
      const batteries = []

      // Create batteries with unique IDs
      let nextId = 1
      for (let chain = 0; chain < numChains; chain++) {
        for (let i = 0; i < batteriesPerChain; i++) {
          batteries.push(ComponentFactory.createBattery(nextId++))
        }
      }
      const bulb = ComponentFactory.createLightBulb(1000)

      const components = [...batteries, bulb]

      // Wire batteries as parallel chains of 3 batteries each
      const wires = []
      for (let chain = 0; chain < numChains; chain++) {
        const startIdx = chain * batteriesPerChain

        // Wire batteries in series within chain
        for (let i = 0; i < batteriesPerChain - 1; i++) {
          wires.push({
            from: batteries[startIdx + i].id,
            to: batteries[startIdx + i + 1].id
          })
        }

        // Connect last battery in chain to bulb
        wires.push({
          from: batteries[startIdx + batteriesPerChain - 1].id,
          to: bulb.id
        })
      }

      simulator.setComponents(components)
      simulator.setWires(wires)

      // Act: Start timer and simulate for 30 seconds
      timeTracker.start()

      // Simulate in 1-second intervals
      for (let i = 0; i < 30; i++) {
        vi.advanceTimersByTime(1000)
        simulator.simulate(1.0)

        // Update tracker with condition: bulb must be lit
        const isBulbLit = bulb.brightness >= 0.2
        timeTracker.update(() => isBulbLit)

        // Check validator at each step
        const result = challengeSystem.challenges.find(c => c.id === 'battery-blues')
          .validator({ components, wires })

        if (i < 10) {
          // Before 10 seconds: should not succeed (minimum time not reached)
          expect(result.success).toBe(false)
        }
      }

      // Final check after 30 seconds
      const finalResult = challengeSystem.challenges.find(c => c.id === 'battery-blues')
        .validator({ components, wires })

      // Assert: Validator returns tracking=true, time tracker confirms goal reached
      expect(finalResult.success).toBe(false) // Still tracking (not complete yet)
      expect(finalResult.tracking).toBe(true)  // Indicates this is a time-based challenge
      expect(timeTracker.hasReachedGoal(30)).toBe(true) // Goal time reached
    })

    it('should fail if light bulb goes out before 30 seconds', () => {
      // Arrange: Build circuit with only 2 batteries (not enough for 30s)
      const battery1 = ComponentFactory.createBattery(100, 100)
      battery1.charge = 0.3 // Partially drained
      const battery2 = ComponentFactory.createBattery(150, 100)
      battery2.charge = 0.3 // Partially drained
      const bulb = ComponentFactory.createLightBulb(200, 150)

      const components = [battery1, battery2, bulb]
      const wires = [
        { from: battery1.id, to: battery2.id },
        { from: battery2.id, to: bulb.id },
        { from: bulb.id, to: battery1.id }
      ]

      simulator.setComponents(components)
      simulator.setWires(wires)

      timeTracker.start()

      // Act: Simulate for 30 seconds - batteries should die partway through
      let bulbWentOut = false
      for (let i = 0; i < 30; i++) {
        vi.advanceTimersByTime(1000)
        simulator.simulate(1.0)
        timeTracker.update(() => bulb.brightness >= 0.2)

        if (bulb.brightness < 0.2) {
          bulbWentOut = true
        }
      }

      // Assert: Bulb should have gone out at some point
      expect(bulbWentOut).toBe(true)
      expect(timeTracker.hasReachedGoal(30)).toBe(false) // Did not meet goal
    })
  })

  describe('Challenge 6: Parallel Power (60s)', () => {
    it('should pass when light bulb stays lit for 60 seconds with parallel batteries', () => {
      // Arrange: Build circuit with 123 batteries + bulb (enough for 60s with 0.36Ω bulb)
      // Need parallel chains: 3 batteries/chain @ 2.7V = 7.5A, drains 0.675/sec
      // For 60s: need 40.5 capacity = 41 parallel chains = 123 batteries total
      const numChains = 41
      const batteriesPerChain = 3
      const batteries = []

      // Create batteries with unique IDs
      let nextId = 1
      for (let chain = 0; chain < numChains; chain++) {
        for (let i = 0; i < batteriesPerChain; i++) {
          batteries.push(ComponentFactory.createBattery(nextId++))
        }
      }
      const bulb = ComponentFactory.createLightBulb(2000)

      const components = [...batteries, bulb]

      // Wire batteries as parallel chains of 3 batteries each
      const wires = []
      for (let chain = 0; chain < numChains; chain++) {
        const startIdx = chain * batteriesPerChain

        // Wire batteries in series within chain
        for (let i = 0; i < batteriesPerChain - 1; i++) {
          wires.push({
            from: batteries[startIdx + i].id,
            to: batteries[startIdx + i + 1].id
          })
        }

        // Connect last battery in chain to bulb
        wires.push({
          from: batteries[startIdx + batteriesPerChain - 1].id,
          to: bulb.id
        })
      }

      simulator.setComponents(components)
      simulator.setWires(wires)

      timeTracker.start()

      // Act: Simulate for 60 seconds
      for (let i = 0; i < 60; i++) {
        vi.advanceTimersByTime(1000)
        simulator.simulate(1.0)

        // Update tracker with condition: bulb must be lit
        const isBulbLit = bulb.brightness >= 0.2
        timeTracker.update(() => isBulbLit)
      }

      // Assert: Should succeed after 60 seconds
      expect(bulb.brightness).toBeGreaterThan(0.2) // Bulb still lit
      expect(timeTracker.hasReachedGoal(60)).toBe(true)
    })
  })

  describe('Challenge 15: Endurance (60s)', () => {
    it('should pass when 2 LEDs stay lit for 60 seconds', () => {
      // Arrange: Build circuit with enough batteries to power 2 LEDs for 60s
      const batteries = []
      for (let i = 0; i < 8; i++) {
        batteries.push(ComponentFactory.createBattery(100 + i * 50, 100))
      }

      const led1 = ComponentFactory.createLED(200, 200)
      const led2 = ComponentFactory.createLED(300, 200)
      const resistor1 = ComponentFactory.createResistor(200, 250)
      const resistor2 = ComponentFactory.createResistor(300, 250)

      const components = [...batteries, led1, led2, resistor1, resistor2]

      // Wire all batteries in series, then parallel branches for LEDs
      const wires = []
      for (let i = 0; i < batteries.length - 1; i++) {
        wires.push({ from: batteries[i].id, to: batteries[i + 1].id })
      }

      // LED 1 branch
      wires.push({ from: batteries[batteries.length - 1].id, to: resistor1.id })
      wires.push({ from: resistor1.id, to: led1.id })
      wires.push({ from: led1.id, to: batteries[0].id })

      // LED 2 branch (parallel)
      wires.push({ from: batteries[batteries.length - 1].id, to: resistor2.id })
      wires.push({ from: resistor2.id, to: led2.id })
      wires.push({ from: led2.id, to: batteries[0].id })

      simulator.setComponents(components)
      simulator.setWires(wires)

      timeTracker.start()

      // Act: Simulate for 60 seconds
      for (let i = 0; i < 60; i++) {
        vi.advanceTimersByTime(1000)
        simulator.simulate(1.0)

        // Update tracker with condition: both LEDs must be lit
        const areBothLEDsLit = led1.brightness >= 0.1 && led2.brightness >= 0.1
        timeTracker.update(() => areBothLEDsLit)
      }

      // Assert: Both LEDs should still be lit
      expect(led1.brightness).toBeGreaterThan(0.1)
      expect(led2.brightness).toBeGreaterThan(0.1)
      expect(timeTracker.hasReachedGoal(60)).toBe(true)
    })
  })

  describe('Challenge 20: Marathon (60s)', () => {
    it('should pass when light bulb stays lit for 60 seconds with battery bank', () => {
      // Arrange: Build 123-battery bank (41 chains of 3 batteries each)
      // 3 batteries in series = 2.7V, draws 7.5A, drains 0.675/sec
      // Need 40.5 charge for 60s, so need 41 chains of 3 batteries = 123 total
      const numChains = 41
      const batteriesPerChain = 3
      const batteries = []

      // Create batteries with unique IDs
      let nextId = 1
      for (let chain = 0; chain < numChains; chain++) {
        for (let i = 0; i < batteriesPerChain; i++) {
          batteries.push(ComponentFactory.createBattery(nextId++))
        }
      }

      const bulb = ComponentFactory.createLightBulb(3000)
      const components = [...batteries, bulb]

      // Wire batteries as parallel chains of 3 batteries each
      const wires = []
      for (let chain = 0; chain < numChains; chain++) {
        const startIdx = chain * batteriesPerChain

        // Wire batteries in series within chain
        for (let i = 0; i < batteriesPerChain - 1; i++) {
          wires.push({
            from: batteries[startIdx + i].id,
            to: batteries[startIdx + i + 1].id
          })
        }

        // Connect last battery in chain to bulb
        wires.push({
          from: batteries[startIdx + batteriesPerChain - 1].id,
          to: bulb.id
        })
      }

      simulator.setComponents(components)
      simulator.setWires(wires)

      timeTracker.start()

      // Act: Simulate for 60 seconds
      for (let i = 0; i < 60; i++) {
        vi.advanceTimersByTime(1000)
        simulator.simulate(1.0)

        // Update tracker with condition: bulb must be lit
        const isBulbLit = bulb.brightness >= 0.2
        timeTracker.update(() => isBulbLit)
      }

      // Assert: Bulb should still be lit after 60 seconds
      expect(bulb.brightness).toBeGreaterThan(0.2)
      expect(timeTracker.hasReachedGoal(60)).toBe(true)
    })
  })

  describe('10-second minimum enforcement', () => {
    it('should not allow instant success even with overpowered circuit', () => {
      // Arrange: Build massively overpowered circuit (50 batteries!)
      const batteries = []
      for (let i = 0; i < 50; i++) {
        batteries.push(ComponentFactory.createBattery(100 + i * 20, 100))
      }

      const bulb = ComponentFactory.createLightBulb(300, 200)
      const components = [...batteries, bulb]

      // Wire all batteries in parallel for maximum capacity
      const wires = []
      batteries.forEach(battery => {
        wires.push({ from: battery.id, to: bulb.id })
        wires.push({ from: bulb.id, to: battery.id })
      })

      simulator.setComponents(components)
      simulator.setWires(wires)

      timeTracker.start()

      // Act: Try to complete immediately (0 seconds)
      timeTracker.update(() => true) // Condition met
      simulator.simulate(0.1)

      // Assert: Should not succeed yet (no time elapsed)
      expect(timeTracker.hasReachedGoal(30)).toBe(false)

      // Try at 5 seconds
      for (let i = 0; i < 5; i++) {
        vi.advanceTimersByTime(1000)
        timeTracker.update(() => true) // Condition always met
      }
      expect(timeTracker.hasReachedGoal(30)).toBe(false) // Still under 10s minimum

      // Continue to exactly 10 seconds and accumulate 30s condition time
      for (let i = 0; i < 25; i++) { // 5 + 25 = 30 total seconds
        vi.advanceTimersByTime(1000)
        timeTracker.update(() => true) // Condition always met
        simulator.simulate(1.0)
      }

      // Now should succeed (30s elapsed >= 10s minimum, 30s condition time >= 30s goal)
      expect(timeTracker.hasReachedGoal(30)).toBe(true)
    })

    it('should enforce minimum even if condition time exceeds goal', () => {
      // Arrange: Simple circuit
      const battery = ComponentFactory.createBattery(100, 100)
      const led = ComponentFactory.createLED(200, 100)
      const resistor = ComponentFactory.createResistor(150, 150)

      const components = [battery, led, resistor]
      const wires = [
        { from: battery.id, to: resistor.id },
        { from: resistor.id, to: led.id },
        { from: led.id, to: battery.id }
      ]

      simulator.setComponents(components)
      simulator.setWires(wires)

      timeTracker.start()

      // Act: Simulate for 5 seconds with condition met the entire time
      for (let i = 0; i < 5; i++) {
        vi.advanceTimersByTime(1000)
        timeTracker.update(() => true) // Condition always true
      }

      // Condition time is 5s, but elapsed time is only 5s
      expect(timeTracker.getConditionTime()).toBeGreaterThanOrEqual(5.0)
      expect(timeTracker.getElapsedTime()).toBeLessThan(10.0)

      // Assert: Should NOT succeed for a 5-second goal (elapsed < 10s minimum)
      expect(timeTracker.hasReachedGoal(5.0)).toBe(false)

      // Continue to 10 seconds
      for (let i = 0; i < 5; i++) {
        vi.advanceTimersByTime(1000)
        timeTracker.update(() => true)
      }

      // Now should succeed (elapsed >= 10s, condition >= 5s)
      expect(timeTracker.hasReachedGoal(5.0)).toBe(true)
    })
  })

  describe('Condition tracking during timed challenges', () => {
    it('should only count time when challenge conditions are met', () => {
      // Arrange: Circuit that starts working, then fails
      const battery = ComponentFactory.createBattery(100, 100)
      battery.charge = 0.5 // Half charged - will die partway through
      const bulb = ComponentFactory.createLightBulb(200, 100)

      const components = [battery, bulb]
      const wires = [
        { from: battery.id, to: bulb.id },
        { from: bulb.id, to: battery.id }
      ]

      simulator.setComponents(components)
      simulator.setWires(wires)

      timeTracker.start()

      // Act: Simulate until battery dies
      for (let i = 0; i < 30; i++) {
        vi.advanceTimersByTime(1000)
        simulator.simulate(1.0)

        // Update tracker with condition: bulb must be lit
        const isBulbLit = bulb.brightness >= 0.2
        timeTracker.update(() => isBulbLit)
      }

      // Assert: Elapsed time should be 30s, but condition time < 30s
      expect(timeTracker.getElapsedTime()).toBeGreaterThanOrEqual(30.0)
      expect(timeTracker.getConditionTime()).toBeLessThan(30.0) // Battery died before 30s
      expect(timeTracker.hasReachedGoal(30)).toBe(false) // Condition not met for full duration
    })
  })
})
