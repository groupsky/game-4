/**
 * GraphAnalyzer - Circuit graph traversal and analysis
 *
 * Provides BFS/DFS algorithms for finding connected components,
 * analyzing circuit topology, and path finding in the component graph.
 */

export class GraphAnalyzer {
  constructor(components, wires) {
    this.components = components
    this.wires = wires
  }

  /**
   * Get IDs of all components directly connected to a given component via wires
   */
  getConnectedComponentIds(compId) {
    const connected = []
    for (const wire of this.wires) {
      if (wire.from === compId) {
        connected.push(wire.to)
      } else if (wire.to === compId) {
        connected.push(wire.from)
      }
    }
    return connected
  }

  /**
   * Check if two components are directly connected via a wire
   */
  isConnected(comp1, comp2) {
    for (const wire of this.wires) {
      if (
        (wire.from === comp1.id && wire.to === comp2.id) ||
        (wire.from === comp2.id && wire.to === comp1.id)
      ) {
        return true
      }
    }
    return false
  }

  /**
   * BFS to find all components connected to a starting component
   * Returns array of component objects
   */
  findConnectedComponents(startComponent) {
    const visited = new Set()
    const queue = [startComponent.id]
    const connected = []

    visited.add(startComponent.id)

    while (queue.length > 0) {
      const currentId = queue.shift()
      const current = this.components.find(c => c.id === currentId)

      if (!current) continue

      connected.push(current)

      const neighbors = this.getConnectedComponentIds(currentId)
      for (const connId of neighbors) {
        if (!visited.has(connId)) {
          visited.add(connId)
          queue.push(connId)
        }
      }
    }

    return connected
  }

  /**
   * Find all batteries connected to a given LED
   * Returns array of battery objects
   */
  findConnectedBatteries(led) {
    const visited = new Set()
    const queue = [led.id]
    const batteries = []

    visited.add(led.id)

    while (queue.length > 0) {
      const currentId = queue.shift()
      const current = this.components.find(c => c.id === currentId)

      if (!current) continue

      if (current.type === 'battery') {
        batteries.push(current)
      }

      const connected = this.getConnectedComponentIds(currentId)
      for (const connId of connected) {
        if (!visited.has(connId)) {
          visited.add(connId)
          queue.push(connId)
        }
      }
    }

    return batteries
  }

  /**
   * Find all resistors in the path between LED and batteries
   * Handles parallel branches correctly by BFS from LED toward batteries
   */
  findResistorsInPath(led, batteries) {
    if (batteries.length === 0) return []

    const resistors = []
    const visited = new Set()
    const queue = [led.id]
    visited.add(led.id)

    while (queue.length > 0) {
      const currentId = queue.shift()
      const current = this.components.find(c => c.id === currentId)

      if (!current) continue

      // Stop at batteries (found complete path)
      if (current.type === 'battery') {
        continue
      }

      if (current.type === 'resistor') {
        resistors.push(current)
      }

      const connected = this.getConnectedComponentIds(currentId)
      for (const connId of connected) {
        if (!visited.has(connId)) {
          visited.add(connId)
          queue.push(connId)
        }
      }
    }

    return resistors
  }

  /**
   * Check if capacitor is in series with LED (between battery and LED)
   * vs in parallel (both connected to same battery nodes)
   */
  isCapacitorInSeriesWithLED(capacitor, led, batteries) {
    if (batteries.length === 0) return false

    // BFS from battery to LED, tracking if capacitor is in the path
    const visited = new Set()
    const queue = [{ id: batteries[0].id, path: [] }]
    visited.add(batteries[0].id)

    while (queue.length > 0) {
      const { id, path } = queue.shift()

      // If we reached the LED, check if capacitor was in the path
      if (id === led.id) {
        return path.includes(capacitor.id)
      }

      const connected = this.getConnectedComponentIds(id)
      for (const connId of connected) {
        if (!visited.has(connId)) {
          visited.add(connId)
          queue.push({ id: connId, path: [...path, connId] })
        }
      }
    }

    return false
  }
}
