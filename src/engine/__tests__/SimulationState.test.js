import { describe, it, expect, beforeEach } from 'vitest'
import { SimulationState } from '../SimulationState'

describe('SimulationState', () => {
  let simState

  beforeEach(() => {
    simState = new SimulationState()
  })

  it('should start in stopped state', () => {
    expect(simState.isRunning()).toBe(false)
  })

  it('should start simulation when start() called', () => {
    simState.start()
    expect(simState.isRunning()).toBe(true)
  })

  it('should stop simulation when stop() called', () => {
    simState.start()
    simState.stop()
    expect(simState.isRunning()).toBe(false)
  })

  it('should toggle between running and stopped', () => {
    expect(simState.isRunning()).toBe(false)
    simState.toggle()
    expect(simState.isRunning()).toBe(true)
    simState.toggle()
    expect(simState.isRunning()).toBe(false)
  })

  it('should call callback when state changes', () => {
    let callbackCount = 0
    let lastState = null

    simState.onChange((isRunning) => {
      callbackCount++
      lastState = isRunning
    })

    simState.start()
    expect(callbackCount).toBe(1)
    expect(lastState).toBe(true)

    simState.stop()
    expect(callbackCount).toBe(2)
    expect(lastState).toBe(false)
  })

  it('should not call callback if state unchanged', () => {
    let callbackCount = 0

    simState.onChange(() => {
      callbackCount++
    })

    simState.stop() // Already stopped
    expect(callbackCount).toBe(0)

    simState.start()
    expect(callbackCount).toBe(1)

    simState.start() // Already started
    expect(callbackCount).toBe(1)
  })

  it('should allow multiple callbacks', () => {
    let callback1Count = 0
    let callback2Count = 0

    simState.onChange(() => callback1Count++)
    simState.onChange(() => callback2Count++)

    simState.start()
    expect(callback1Count).toBe(1)
    expect(callback2Count).toBe(1)
  })
})
