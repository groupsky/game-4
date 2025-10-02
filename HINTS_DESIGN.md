# Hints System Design

## Multi-Level Hint System

### Concept
Progressive hint disclosure based on player struggle:
- **Level 1**: High-level concept (what to try)
- **Level 2**: More specific guidance (how to do it)
- **Level 3**: Step-by-step solution (exact components)

### Stuck Detection
Track when player needs more help:
- Player requests hint while circuit unchanged → Player stuck
- Automatically escalate to next hint level
- Reset hint level when circuit changes

## Example Hints

### Challenge 1: First Light
```javascript
hints: [
  "💡 You need an LED and a battery. Try connecting them!",
  "🔌 Drag an LED and a potato battery onto the canvas, then Shift+Click to connect them.",
  "✅ Add 1 battery and 1 LED. Shift+Click the battery, then click the LED to wire them together."
]
```

### Challenge 2: Power Up
```javascript
hints: [
  "⚡ One battery isn't bright enough. Try using more batteries!",
  "🔗 Connect batteries end-to-end (in series) to add their voltages together.",
  "✅ Add 2+ batteries. Connect battery 1 → battery 2 → LED. This adds voltage!"
]
```

### Challenge 3: Current Control
```javascript
hints: [
  "⚠️ Too much current can damage your LED. Add something to limit it!",
  "🛡️ A resistor controls current flow. Try adding one between the battery and LED.",
  "✅ Add a resistor. Connect: batteries → resistor → LED. The resistor protects the LED!"
]
```

### Challenge 6: Parallel Power
```javascript
hints: [
  "🔋 Parallel batteries last longer. Try connecting battery pairs side-by-side!",
  "⏱️ Make battery groups: batteries in series for voltage, then connect these groups in parallel for capacity.",
  "✅ Create 2-3 series battery chains. Connect all chains in parallel to the bulb. This increases capacity!"
]
```

### Challenge 8: Energy Bank
```javascript
hints: [
  "⚡ Capacitors store energy like a tiny battery. Try adding one to your circuit!",
  "🔌 Connect capacitor in parallel with the LED (both connect to same battery terminals).",
  "✅ Add: battery → capacitor (parallel) → LED. The capacitor charges and smooths power!"
]
```

### Challenge 13: LED Array
```javascript
hints: [
  "📊 A 3x3 grid means 3 rows, each with 3 LEDs in series.",
  "🔀 Make 3 identical branches: each branch has 3 LEDs in series. Connect all branches in parallel.",
  "✅ Create branch 1: battery → LED → LED → LED. Repeat 2 more times in parallel. That's 9 LEDs!"
]
```

## Implementation Plan

### 1. Add Hints to Challenges
```javascript
{
  id: 'first-light',
  title: '1. First Light',
  description: '...',
  hints: [
    'Level 1 hint',
    'Level 2 hint',
    'Level 3 hint'
  ],
  // ...
}
```

### 2. Hint State Tracking
```javascript
class HintSystem {
  constructor() {
    this.currentLevel = 0
    this.lastCircuitHash = null
  }

  getHint(challenge, circuit) {
    const circuitHash = this.hashCircuit(circuit)

    // If circuit changed, reset to level 1
    if (circuitHash !== this.lastCircuitHash) {
      this.currentLevel = 0
      this.lastCircuitHash = circuitHash
    }

    // Return current hint
    const hint = challenge.hints[this.currentLevel]

    // Advance to next level (max 2)
    this.currentLevel = Math.min(this.currentLevel + 1, 2)

    return hint
  }

  hashCircuit(circuit) {
    // Simple hash: component count + wire count
    return `${circuit.components.length}-${circuit.wires.length}`
  }
}
```

### 3. UI Integration
- Add "Show Hint" button to ChallengePanel
- Display current hint in styled box
- Show hint level indicator (1/3, 2/3, 3/3)
- Keyboard shortcut: ? or F1

### 4. Visual Design
```css
.hint-box {
  background: #FEF3C7;
  border: 2px solid #F59E0B;
  border-left: 6px solid #F59E0B;
  padding: 12px;
  margin: 12px 0;
  font-family: 'Courier New', monospace;
}

.hint-level {
  font-size: 11px;
  color: #92400E;
  margin-bottom: 4px;
}

.hint-content {
  font-size: 14px;
  color: #78350F;
  line-height: 1.4;
}
```

## Benefits

✅ **Progressive Disclosure**: Players get help when needed, not overwhelming upfront
✅ **Stuck Detection**: System recognizes when player needs more help
✅ **Learning by Doing**: Players try first, hints guide when stuck
✅ **No Forced Tutorials**: Hints are optional, available on demand
✅ **Clear Communication**: Each hint level has specific purpose

## Priority: MEDIUM

This system is valuable but not critical for MVP. The current challenge descriptions provide basic guidance. Hints would enhance the experience but aren't blocking gameplay.
