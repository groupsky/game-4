import { useState } from 'react'
import './MobileControls.css'

/**
 * MobileControls - Floating action button for mobile interaction modes
 *
 * Modes:
 * - drag: Tap to select and drag components
 * - wire: Tap components to connect with wires
 * - delete: Tap to delete components/wires
 * - multi: Multi-select mode for batch operations
 */
export function MobileControls({ mode, onModeChange, disabled }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const modes = [
    { id: 'drag', icon: '👆', label: 'Move', description: 'Drag components' },
    { id: 'wire', icon: '🔌', label: 'Wire', description: 'Connect components' },
    { id: 'delete', icon: '🗑️', label: 'Delete', description: 'Remove items' },
    { id: 'multi', icon: '☑️', label: 'Select', description: 'Multi-select' }
  ]

  const currentMode = modes.find(m => m.id === mode) || modes[0]

  const handleModeSelect = (modeId) => {
    onModeChange(modeId)
    setIsExpanded(false)
  }

  if (disabled) {
    return null
  }

  return (
    <div className="mobile-controls">
      {isExpanded && (
        <>
          <div
            className="mobile-controls-overlay"
            onClick={() => setIsExpanded(false)}
          />
          <div className="mobile-controls-menu">
            {modes.map(m => (
              <button
                key={m.id}
                className={`mode-btn ${mode === m.id ? 'active' : ''}`}
                onClick={() => handleModeSelect(m.id)}
              >
                <span className="mode-icon">{m.icon}</span>
                <div className="mode-info">
                  <span className="mode-label">{m.label}</span>
                  <span className="mode-description">{m.description}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
      <button
        className="mobile-fab"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={`Current mode: ${currentMode.label}`}
      >
        <span className="fab-icon">{currentMode.icon}</span>
        <span className="fab-label">{currentMode.label}</span>
      </button>
    </div>
  )
}
