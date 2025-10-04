/**
 * TimeTracker - Tracks elapsed time and condition-based duration
 *
 * Used for challenges requiring time-based validation
 * (e.g., "Keep LED lit for 60 seconds")
 */

export class TimeTracker {
  constructor() {
    this.running = false
    this.elapsedTime = 0
    this.conditionTime = 0
    this.lastUpdateTime = null
    this.failed = false
  }

  start() {
    this.running = true
    this.lastUpdateTime = Date.now()
  }

  stop() {
    this.running = false
    this.lastUpdateTime = null
  }

  reset() {
    this.elapsedTime = 0
    this.conditionTime = 0
    this.lastUpdateTime = this.running ? Date.now() : null
  }

  update(condition = null) {
    if (!this.running) return

    const now = Date.now()
    if (this.lastUpdateTime === null) {
      this.lastUpdateTime = now
      return
    }

    const deltaTime = (now - this.lastUpdateTime) / 1000
    this.lastUpdateTime = now

    this.elapsedTime += deltaTime

    // Track condition time if condition provided
    if (condition && condition()) {
      this.conditionTime += deltaTime
    }
  }

  getElapsedTime() {
    return this.elapsedTime
  }

  getConditionTime() {
    return this.conditionTime
  }

  hasReachedGoal(goalTime) {
    // Enforce 10-second minimum before success (prevents instant-win exploits)
    const MIN_TIME = 10
    return this.conditionTime >= goalTime && this.elapsedTime >= MIN_TIME
  }

  getProgress(goalTime) {
    return Math.min(this.conditionTime / goalTime, 1.0)
  }

  getFormattedTime() {
    const totalSeconds = Math.floor(this.conditionTime)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
}
