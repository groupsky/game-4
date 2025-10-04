/**
 * Toolbar - Component toolbar for adding circuit elements
 *
 * Provides buttons for starting/stopping simulation and adding components
 * to the circuit workspace.
 */

export function Toolbar({ isRunning, onToggleSimulation, onAddComponent }) {
  const addBattery = () => {
    onAddComponent({
      id: Date.now(),
      type: 'battery',
      x: 100 + Math.random() * 100,
      y: 100 + Math.random() * 100,
      charge: 1.0,
      voltage: 0.9  // Single potato battery
    })
  }

  const addLED = () => {
    onAddComponent({
      id: Date.now(),
      type: 'led',
      x: 250 + Math.random() * 100,
      y: 100 + Math.random() * 100,
      brightness: 0
    })
  }

  const addResistor = () => {
    onAddComponent({
      id: Date.now(),
      type: 'resistor',
      x: 400 + Math.random() * 100,
      y: 100 + Math.random() * 100,
      resistance: 100,
      current: 0
    })
  }

  const addCapacitor = () => {
    onAddComponent({
      id: Date.now(),
      type: 'capacitor',
      x: 550 + Math.random() * 100,
      y: 100 + Math.random() * 100,
      capacitance: 0.1,  // 100mF capacitor
      voltage: 0,
      maxVoltage: 5.0
    })
  }

  const addLightBulb = () => {
    onAddComponent({
      id: Date.now(),
      type: 'lightbulb',
      x: 700 + Math.random() * 100,
      y: 100 + Math.random() * 100,
      brightness: 0,
      resistance: 0.36,  // Tuned to drain 3 batteries in ~40 seconds
      current: 0,
      power: 0
    })
  }

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
        onClick={addBattery}
      >
        Add 🥔 Potato
      </button>
      <button
        disabled={isRunning}
        onClick={addLED}
      >
        Add 💡 LED
      </button>
      <button
        disabled={isRunning}
        onClick={addResistor}
      >
        Add ⚡ Resistor (100Ω)
      </button>
      <button
        disabled={isRunning}
        onClick={addCapacitor}
      >
        Add ⚡ Capacitor (100mF)
      </button>
      <button
        disabled={isRunning}
        onClick={addLightBulb}
      >
        Add 💡 Light Bulb
      </button>
    </div>
  )
}
