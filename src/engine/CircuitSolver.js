/**
 * CircuitSolver - LED and light bulb circuit simulation
 *
 * Handles the physics calculations for powering LEDs and light bulbs
 * from batteries and capacitors. Separated from CircuitSimulator
 * for better organization.
 */

/**
 * Simulate an LED circuit
 * @param {Object} circuit - Circuit data { batteries, capacitors, led, totalLEDs, isParallel }
 * @param {Object} context - Helper methods { analyzeBatteryTopology, isCapacitorInSeriesWithLED, findResistorsInPath, deltaTime }
 */
export function simulateCircuit(circuit, context) {
  const { batteries = [], capacitors = [], led, totalLEDs, isParallel } = circuit
  const { analyzeBatteryTopology, isCapacitorInSeriesWithLED, findResistorsInPath, deltaTime } = context

  // Analyze battery topology to find series chains in parallel
  const batteryTopology = analyzeBatteryTopology(batteries, led)
  const { seriesChains } = batteryTopology

  // Calculate total voltage - for parallel chains, use the highest voltage
  // (or a weighted combination based on current distribution)
  let batteryVoltage = 0
  let minCharge = 1.0

  if (seriesChains.length === 1) {
    // Simple case: all batteries in series
    seriesChains[0].forEach(battery => {
      batteryVoltage += battery.voltage * (battery.charge > 0 ? 1 : 0)
      minCharge = Math.min(minCharge, battery.charge)
    })
  } else if (seriesChains.length > 1) {
    // Parallel chains: use highest voltage chain (dominant voltage source)
    // In reality, parallel voltage sources with different voltages create complex current flows
    // For simplicity, we'll use the highest voltage and distribute current based on voltage
    seriesChains.forEach(chain => {
      const chainVoltage = chain.reduce((sum, bat) => sum + (bat.charge > 0 ? bat.voltage : 0), 0)
      batteryVoltage = Math.max(batteryVoltage, chainVoltage)
      chain.forEach(bat => {
        minCharge = Math.min(minCharge, bat.charge)
      })
    })
  }

  // Handle capacitors based on their configuration:
  // - Series with LED: oppose battery (blocks DC when charged)
  // - Parallel with LED: add to voltage (smoothing/boost)
  // - No battery: act as voltage source (discharge mode)
  let totalVoltage = batteryVoltage

  if (batteries.length > 0) {
    // Check each capacitor: series or parallel?
    capacitors.forEach(capacitor => {
      const inSeries = isCapacitorInSeriesWithLED(capacitor, led, batteries)
      if (inSeries) {
        // Series: capacitor opposes battery voltage as it charges
        totalVoltage -= capacitor.voltage
      } else {
        // Parallel: capacitor adds to voltage (both provide power)
        totalVoltage += capacitor.voltage
      }
    })
  } else {
    // No battery: capacitor acts as voltage source (discharge mode)
    capacitors.forEach(capacitor => {
      totalVoltage += capacitor.voltage
    })
  }

  // Find resistors in THIS LED's branch (not all connected resistors)
  const resistorsInPath = findResistorsInPath(led, batteries)

  // Calculate total resistance in THIS LED's branch
  const LED_RESISTANCE = 100  // Ohms
  let totalResistance = LED_RESISTANCE

  resistorsInPath.forEach(resistor => {
    totalResistance += resistor.resistance
  })

  // For series LEDs, each LED adds resistance
  if (!isParallel && totalLEDs > 1) {
    totalResistance += LED_RESISTANCE * (totalLEDs - 1)
  }

  // LED characteristics
  const LED_FORWARD_VOLTAGE = 2.0  // Typical LED forward voltage
  const MAX_LED_CURRENT = 0.020     // 20mA

  // Voltage calculation depends on configuration
  // Parallel: each LED gets full voltage
  // Series: voltage is divided across all components
  let availableVoltage = totalVoltage

  if (!isParallel && totalLEDs > 1) {
    availableVoltage = totalVoltage / totalLEDs
  }

  // Check if voltage is sufficient to light LED (even dimly)
  if (availableVoltage < 0.5) {
    // Not enough voltage at all
    led.brightness = 0
    led.voltage = availableVoltage
    led.current = 0
    return
  }

  // Calculate current using Ohm's law: I = V / R
  let current = totalVoltage / totalResistance

  // Limit current to max LED current
  current = Math.min(current, MAX_LED_CURRENT)

  // Calculate voltage drops in THIS LED's branch
  resistorsInPath.forEach(resistor => {
    resistor.voltageDrop = current * resistor.resistance
    resistor.current = current
  })

  // Calculate voltage across LED (after resistor drops in this branch)
  let ledVoltage = totalVoltage
  resistorsInPath.forEach(resistor => {
    ledVoltage -= resistor.voltageDrop
  })

  // For series LEDs, divide remaining voltage
  if (!isParallel && totalLEDs > 1) {
    ledVoltage = ledVoltage / totalLEDs
  }

  const voltage = ledVoltage

  // Calculate LED brightness (0-1 scale)
  // LED gets brighter as current increases
  let brightness = current / MAX_LED_CURRENT

  // Apply forward voltage threshold (more gradual)
  if (voltage < LED_FORWARD_VOLTAGE) {
    // Scale brightness based on voltage (allows dim glow at low voltage)
    brightness *= (voltage / LED_FORWARD_VOLTAGE) * 0.8
  }

  // Clamp brightness
  brightness = Math.max(0, Math.min(1, brightness))

  // Update LED state
  led.brightness = brightness
  led.voltage = voltage
  led.current = current

  // Drain batteries based on current draw, distributed by series chain voltage
  // For parallel LEDs, each LED draws current, so multiply by number of parallel LEDs
  const parallelMultiplier = isParallel ? totalLEDs : 1
  const totalCurrent = current * parallelMultiplier

  if (batteries.length > 0) {
    // Calculate voltage of each series chain
    const chainVoltages = seriesChains.map(chain =>
      chain.reduce((sum, bat) => sum + (bat.charge > 0 ? bat.voltage : 0), 0)
    )
    const totalChainVoltage = chainVoltages.reduce((sum, v) => sum + v, 0)

    // Distribute current based on each chain's voltage contribution
    // Higher voltage chains supply more current (parallel resistor network behavior)
    seriesChains.forEach((chain, index) => {
      const chainVoltage = chainVoltages[index]
      if (totalChainVoltage === 0) return

      // Current from this chain is proportional to its voltage
      const chainCurrentFraction = chainVoltage / totalChainVoltage
      const chainCurrent = totalCurrent * chainCurrentFraction

      // All batteries in a series chain get the same current
      // Each parallel chain discharges independently based on its own current
      // Scale drain by deltaTime to make it framerate-independent
      // Factor of 0.09 gives reasonable lifetimes: LEDs ~560s, bulbs ~1.5s
      const drainRate = chainCurrent * deltaTime * 0.09
      chain.forEach(battery => {
        battery.charge = Math.max(0, battery.charge - drainRate)
      })
    })
  }

  // Discharge capacitors when powering LED (only if no battery, or if series with battery)
  if (capacitors.length > 0 && batteries.length === 0) {
    // Only discharge capacitors if they're the sole power source
    // If battery is present, battery charges/powers and capacitor just charges
    capacitors.forEach(capacitor => {
      const capacitance = capacitor.capacitance || 0.001
      const dischargeCurrent = current * parallelMultiplier / capacitors.length
      const voltageDrop = (dischargeCurrent * deltaTime) / capacitance
      capacitor.voltage = Math.max(0, capacitor.voltage - voltageDrop)
    })
  }
}

/**
 * Simulate a light bulb circuit
 * @param {Object} circuit - Circuit data { batteries, capacitors, bulb, batteryTopology }
 * @param {Object} context - Helper methods { deltaTime }
 */
export function simulateLightBulb(circuit, context) {
  const { batteries = [], capacitors = [], bulb, batteryTopology } = circuit
  const { deltaTime } = context

  // Use battery topology analysis for accurate series/parallel handling
  let totalVoltage = 0

  if (batteryTopology) {
    // Use analyzed topology
    totalVoltage = batteryTopology.voltage
  } else {
    // Fallback: treat all batteries as series (old behavior)
    batteries.forEach(battery => {
      totalVoltage += battery.voltage * (battery.charge > 0 ? 1 : 0)
    })
  }

  // Add capacitor voltage
  capacitors.forEach(capacitor => {
    totalVoltage += capacitor.voltage
  })

  // Light bulb characteristics
  const BULB_MIN_VOLTAGE = 2.5  // Minimum voltage for visible glow
  const bulbResistance = bulb.resistance || 50  // Ohms (lower than LED)

  // Check if voltage is sufficient
  if (totalVoltage < BULB_MIN_VOLTAGE) {
    bulb.brightness = 0
    bulb.voltage = totalVoltage
    bulb.current = 0
    return
  }

  // Calculate current using Ohm's law: I = V / R
  const current = totalVoltage / bulbResistance

  // Calculate power dissipated (as light and heat)
  const power = current * current * bulbResistance  // P = I²R

  // Brightness is based on power (incandescent: more power = more light)
  // Normalized to 0-1 scale (1W = full brightness)
  let brightness = Math.min(power / 1.0, 1.0)

  // Apply voltage-based scaling for dim operation
  if (totalVoltage < 4.0) {
    brightness *= (totalVoltage / 4.0) * 0.7
  }

  // Update bulb state
  bulb.brightness = Math.max(0, Math.min(1, brightness))
  bulb.voltage = totalVoltage
  bulb.current = current
  bulb.power = power

  // Drain batteries (bulbs draw more current than LEDs)
  // For parallel chains: current is divided among chains
  // For series chains: all batteries in chain drain at same rate
  const totalSources = batteries.length + capacitors.length

  if (batteries.length > 0 && batteryTopology && batteryTopology.seriesChains) {
    // Use topology analysis to drain batteries correctly per chain
    const { seriesChains } = batteryTopology

    seriesChains.forEach((chain) => {
      // Calculate voltage of each chain to determine current distribution
      const chainVoltage = chain.reduce((sum, bat) => sum + (bat.charge > 0 ? bat.voltage : 0), 0)
      const totalChainVoltage = seriesChains.reduce((sum, ch) =>
        sum + ch.reduce((s, b) => s + (b.charge > 0 ? b.voltage : 0), 0), 0
      )

      // Current from this chain is proportional to its voltage
      const chainCurrentFraction = totalChainVoltage > 0 ? chainVoltage / totalChainVoltage : 1 / seriesChains.length
      const chainCurrent = current * chainCurrentFraction

      // All batteries in a series chain carry the same current
      // Each battery in the chain drains based on the chain's current
      // Scale drain by deltaTime to make it framerate-independent
      // Factor of 0.09 gives reasonable lifetimes: LEDs ~560s, bulbs ~1.5s
      const drainRate = chainCurrent * deltaTime * 0.09

      chain.forEach(battery => {
        battery.charge = Math.max(0, battery.charge - drainRate)
      })
    })
  } else if (batteries.length > 0) {
    // Fallback for circuits without topology analysis
    // Assume all batteries in series (old behavior for compatibility)
    const drainRate = current * deltaTime * 0.09 / totalSources

    batteries.forEach(battery => {
      battery.charge = Math.max(0, battery.charge - drainRate)
    })
  }

  // Discharge capacitors when powering bulb
  if (capacitors.length > 0) {
    capacitors.forEach(capacitor => {
      const capacitance = capacitor.capacitance || 0.001
      const dischargeCurrent = current / totalSources
      const voltageDrop = (dischargeCurrent * deltaTime) / capacitance
      capacitor.voltage = Math.max(0, capacitor.voltage - voltageDrop)
    })
  }
}
