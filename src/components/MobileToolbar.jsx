import './MobileToolbar.css'

/**
 * MobileToolbar - Bottom toolbar with component palette and controls
 *
 * Modes:
 * - null: Selection mode (tap to select, drag to move)
 * - 'battery'/'led'/etc: Placement mode (tap canvas to place)
 * - 'wire': Wire creation mode (drag to connect)
 */
export function MobileToolbar({
  activeMode,
  onModeChange,
  isRunning,
  onToggleSimulation,
  isMobile
}) {
  if (!isMobile) return null

  const tools = [
    { id: 'battery', icon: '🥔', label: 'Battery' },
    { id: 'led', icon: '💡', label: 'LED' },
    { id: 'resistor', icon: '⚡', label: 'Resistor' },
    { id: 'capacitor', icon: '⚡', label: 'Cap' },
    { id: 'lightbulb', icon: '💡', label: 'Bulb' },
    { id: 'wire', icon: '🔌', label: 'Wire' }
  ]

  const handleToolClick = (toolId) => {
    if (isRunning) return
    // Toggle: if already active, deactivate; otherwise activate
    onModeChange(activeMode === toolId ? null : toolId)
  }

  return (
    <div className="mobile-toolbar">
      <div className="mobile-toolbar-tools">
        {tools.map(tool => (
          <button
            key={tool.id}
            className={`mobile-tool-btn ${activeMode === tool.id ? 'active' : ''}`}
            onClick={() => handleToolClick(tool.id)}
            disabled={isRunning}
            title={tool.label}
          >
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-label">{tool.label}</span>
          </button>
        ))}
      </div>
      <button
        className={`mobile-run-btn ${isRunning ? 'running' : 'stopped'}`}
        onClick={onToggleSimulation}
      >
        {isRunning ? '⏸️' : '▶️'}
      </button>
    </div>
  )
}
