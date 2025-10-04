/**
 * InfoPanel - Status display for circuit workspace
 *
 * Shows current mode (simulation/edit), component counts,
 * and contextual messages based on user actions.
 */

export function InfoPanel({ isRunning, components, wires, connecting, selectedComponents, selectedComponent }) {
  return (
    <div className="info-panel">
      {isRunning ? (
        <p>🔬 <strong>SIMULATION RUNNING</strong> | Editing disabled | Press Stop to edit circuit</p>
      ) : (
        <p>✏️ <strong>EDIT MODE</strong> | Drag to move | Shift+Click to wire | Drag rectangle to multi-select | Ctrl+Click to add to selection</p>
      )}
      <p>Components: {components.length} | Wires: {wires.length}</p>
      {!isRunning && connecting && <p>🔌 Connecting... Click another component to finish wire.</p>}
      {!isRunning && selectedComponents.length > 0 && <p>🎯 Selected: {selectedComponents.length} components (Press Delete to remove)</p>}
      {!isRunning && selectedComponent !== null && selectedComponents.length === 0 && <p>🎯 Selected: {components[selectedComponent]?.type} (Press Delete to remove)</p>}
    </div>
  )
}
