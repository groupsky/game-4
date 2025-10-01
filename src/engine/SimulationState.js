/**
 * SimulationState - Manages simulation running/stopped state
 *
 * Responsibilities:
 * - Track whether simulation is running or stopped
 * - Notify listeners when state changes
 * - Provide methods to start, stop, and toggle simulation
 */
export class SimulationState {
  constructor() {
    this.running = false
    this.callbacks = []
  }

  /**
   * Check if simulation is currently running
   * @returns {boolean} True if running, false if stopped
   */
  isRunning() {
    return this.running
  }

  /**
   * Start the simulation
   */
  start() {
    if (this.running) return // Already running
    this.running = true
    this.notifyListeners()
  }

  /**
   * Stop the simulation
   */
  stop() {
    if (!this.running) return // Already stopped
    this.running = false
    this.notifyListeners()
  }

  /**
   * Toggle between running and stopped
   */
  toggle() {
    if (this.running) {
      this.stop()
    } else {
      this.start()
    }
  }

  /**
   * Register a callback to be called when state changes
   * @param {Function} callback - Called with (isRunning) when state changes
   */
  onChange(callback) {
    this.callbacks.push(callback)
  }

  /**
   * Notify all registered listeners of state change
   * @private
   */
  notifyListeners() {
    this.callbacks.forEach(callback => {
      callback(this.running)
    })
  }
}
