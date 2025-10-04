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
   *
   * Series: Capacitor must be traversed to get from battery to LED (no bypass)
   * Parallel: Battery connects directly to both capacitor and LED (bypass exists)
   *
   * Key insight: Check if battery has direct wire TO LED (parallel)
   * vs only having wires through intermediate components (series)
   */
  isCapacitorInSeriesWithLED(capacitor, led, batteries) {
    if (batteries.length === 0) return false

    const battery = batteries[0]

    // Check if there's a direct wire from battery to LED
    // In parallel circuits, battery connects to both cap and LED directly
    // In series circuits, battery only connects to one component (the first in chain)
    const hasDirectWireToLED = this.wires.some(wire =>
      (wire.from === battery.id && wire.to === led.id)
    )

    if (hasDirectWireToLED) {
      // Direct wire from battery to LED means parallel topology
      return false
    }

    // No direct wire - check if capacitor is in the path using BFS
    // Find path from battery to LED that goes through capacitor
    const visited = new Set()
    const queue = [battery.id]
    const parent = new Map()

    visited.add(battery.id)
    parent.set(battery.id, null)

    while (queue.length > 0) {
      const currentId = queue.shift()

      if (currentId === led.id) {
        // Found LED - reconstruct path and check if capacitor is in it
        const path = []
        let node = led.id
        while (parent.get(node) !== null) {
          path.unshift(node)
          node = parent.get(node)
        }
        path.unshift(battery.id)

        return path.includes(capacitor.id)
      }

      const neighbors = this.getConnectedComponentIds(currentId)
      for (const neighborId of neighbors) {
        if (!visited.has(neighborId)) {
          visited.add(neighborId)
          parent.set(neighborId, currentId)
          queue.push(neighborId)
        }
      }
    }

    return false
  }
}
