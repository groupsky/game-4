/**
 * InfoPanel - Status display for circuit workspace
 *
 * Shows current mode (simulation/edit), component counts,
 * and contextual messages based on user actions.
 */

export function InfoPanel({ isRunning, components, wires, selectedComponents, selectedComponent }) {
  return (
    <div className="info-panel">
      {isRunning ? (
        <p>🔬 <strong>SIMULATION RUNNING</strong> | Editing disabled | Press Stop to edit circuit</p>
      ) : (
        <p>✏️ <strong>EDIT MODE</strong> | Click mode button → Click canvas to place | Wire mode: Click components in sequence | Ctrl+Z to undo</p>
      )}
      <p>Components: {components.length} | Wires: {wires.length}</p>
      {!isRunning && selectedComponents.length > 0 && <p>🎯 Selected: {selectedComponents.length} components (Press Delete to remove)</p>}
      {!isRunning && selectedComponent !== null && selectedComponents.length === 0 && <p>🎯 Selected: {components[selectedComponent]?.type} (Press Delete to remove)</p>}
    </div>
  )
}
