/**
 * Toolbar - Mode-based component toolbar
 *
 * Provides buttons for starting/stopping simulation and selecting
 * component placement modes with visual feedback.
 */

export function Toolbar({ isRunning, onToggleSimulation, onModeChange, activeMode }) {
  return (
    <div className="toolbar">
      <button
        className={`simulation-control-btn ${isRunning ? 'running' : 'stopped'}`}
        onClick={onToggleSimulation}
      >
        {isRunning ? '⏸️ Stop' : '▶️ Start'}
      </button>
      <button
        disabled={isRunning}
        className={activeMode === 'battery' ? 'active' : ''}
        onClick={() => onModeChange(activeMode === 'battery' ? null : 'battery')}
      >
        🥔 Battery
      </button>
      <button
        disabled={isRunning}
        className={activeMode === 'led' ? 'active' : ''}
        onClick={() => onModeChange(activeMode === 'led' ? null : 'led')}
      >
        💡 LED
      </button>
      <button
        disabled={isRunning}
        className={activeMode === 'resistor' ? 'active' : ''}
        onClick={() => onModeChange(activeMode === 'resistor' ? null : 'resistor')}
      >
        ⚡ Resistor
      </button>
      <button
        disabled={isRunning}
        className={activeMode === 'capacitor' ? 'active' : ''}
        onClick={() => onModeChange(activeMode === 'capacitor' ? null : 'capacitor')}
      >
        🔋 Capacitor
      </button>
      <button
        disabled={isRunning}
        className={activeMode === 'lightbulb' ? 'active' : ''}
        onClick={() => onModeChange(activeMode === 'lightbulb' ? null : 'lightbulb')}
      >
        💡 Bulb
      </button>
      <button
        disabled={isRunning}
        className={activeMode === 'wire' ? 'active' : ''}
        onClick={() => onModeChange(activeMode === 'wire' ? null : 'wire')}
      >
        🔌 Wire
      </button>
    </div>
  )
}
