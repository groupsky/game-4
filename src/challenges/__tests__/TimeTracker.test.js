import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TimeTracker } from '../TimeTracker.js'

describe('TimeTracker', () => {
  let timeTracker

  beforeEach(() => {
    timeTracker = new TimeTracker()
    vi.useFakeTimers()
  })

  describe('Basic Timing', () => {
    it('should start at 0 elapsed time', () => {
      expect(timeTracker.getElapsedTime()).toBe(0)
    })

    it('should track elapsed time when started', () => {
      timeTracker.start()
      vi.advanceTimersByTime(1000)
      timeTracker.update()

      expect(timeTracker.getElapsedTime()).toBeCloseTo(1.0, 1)
    })

    it('should not track time when stopped', () => {
      timeTracker.start()
      vi.advanceTimersByTime(1000)
      timeTracker.update()

      timeTracker.stop()
      vi.advanceTimersByTime(1000)
      timeTracker.update()

      expect(timeTracker.getElapsedTime()).toBeCloseTo(1.0, 1)
    })

    it('should reset elapsed time', () => {
      timeTracker.start()
      vi.advanceTimersByTime(5000)
      timeTracker.update()

      timeTracker.reset()

      expect(timeTracker.getElapsedTime()).toBe(0)
    })
  })

  describe('Condition Tracking', () => {
    it('should track time while condition is met', () => {
      const condition = () => true

      timeTracker.start()
      vi.advanceTimersByTime(1000)
      timeTracker.update(condition)

      expect(timeTracker.getConditionTime()).toBeCloseTo(1.0, 1)
    })

    it('should not track condition time when condition is false', () => {
      const condition = () => false

      timeTracker.start()
      vi.advanceTimersByTime(1000)
      timeTracker.update(condition)

      expect(timeTracker.getConditionTime()).toBe(0)
    })

    it('should accumulate condition time across multiple true periods', () => {
      let conditionMet = true
      const condition = () => conditionMet

      timeTracker.start()

      // First period - condition true for 1 second
      conditionMet = true
      vi.advanceTimersByTime(1000)
      timeTracker.update(condition)

      // Second period - condition false for 1 second
      conditionMet = false
      vi.advanceTimersByTime(1000)
      timeTracker.update(condition)

      // Third period - condition true for 0.5 seconds
      conditionMet = true
      vi.advanceTimersByTime(500)
      timeTracker.update(condition)

      expect(timeTracker.getConditionTime()).toBeCloseTo(1.5, 1)
    })

    it('should reset condition time on reset', () => {
      const condition = () => true

      timeTracker.start()
      vi.advanceTimersByTime(2000)
      timeTracker.update(condition)

      timeTracker.reset()

      expect(timeTracker.getConditionTime()).toBe(0)
    })
  })

  describe('Goal Achievement', () => {
    it('should detect when goal time is reached', () => {
      const condition = () => true

      timeTracker.start()
      vi.advanceTimersByTime(5000)
      timeTracker.update(condition)

      expect(timeTracker.hasReachedGoal(5.0)).toBe(true)
    })

    it('should not detect goal before time is reached', () => {
      const condition = () => true

      timeTracker.start()
      vi.advanceTimersByTime(3000)
      timeTracker.update(condition)

      expect(timeTracker.hasReachedGoal(5.0)).toBe(false)
    })

    it('should return progress percentage', () => {
      const condition = () => true

      timeTracker.start()
      vi.advanceTimersByTime(3000)
      timeTracker.update(condition)

      expect(timeTracker.getProgress(6.0)).toBeCloseTo(0.5, 1)
    })
  })

  describe('Formatted Time', () => {
    it('should format time as MM:SS', () => {
      const condition = () => true

      timeTracker.start()
      vi.advanceTimersByTime(65000) // 1 minute 5 seconds
      timeTracker.update(condition)

      expect(timeTracker.getFormattedTime()).toBe('01:05')
    })

    it('should pad single digit seconds', () => {
      const condition = () => true

      timeTracker.start()
      vi.advanceTimersByTime(8000) // 8 seconds
      timeTracker.update(condition)

      expect(timeTracker.getFormattedTime()).toBe('00:08')
    })
  })
})
