# Circuit Quest - Responsive UX User Guide

## Overview

Circuit Quest now features a fully responsive, capability-based UX that adapts to your device's input methods and screen size.

---

## Desktop Experience (Mouse + Keyboard)

### Component Placement

1. Click a component button (e.g., 🥔 Battery)
2. Click anywhere on the canvas to place
3. Click multiple times to place multiple components
4. Click the button again or press Escape to exit mode

### Wire Creation

**Click-Sequence Mode:**
1. Click the 🔌 Wire button
2. Click components in sequence: A → B → C → D
3. Orange dotted lines show the wire chain preview
4. Click empty space to finish the chain
5. Creates wires: A→B, B→C, C→D in one action

**Benefits:**
- Can zoom between clicks
- Can pan to reach distant components
- More precise than dragging
- Works great for complex circuits

### Selection

- **Click component** → Select
- **Ctrl+Click** → Add/remove from multi-selection
- **Drag empty space** → Rectangle selection
- **Drag component** → Move
- **Right-click component** → Delete

### Keyboard Shortcuts

- **Ctrl+Z** → Undo (up to 20 actions)
- **Ctrl+Shift+Z** → Redo (coming soon)
- **Escape** → Exit mode, clear selection
- **Delete/Backspace** → Delete selected
- **Space** → Run/stop simulation (in toolbar)

### Undo System

- **↶ Button** (top-left) → Click to undo
- Shows count: ↶ ×3 means 3 undos available
- **Toast notifications** → Click [UNDO] button within 3 seconds
- Actions tracked:
  - Add component
  - Delete component
  - Create wires
  - Delete wire
  - Move component (coming soon)

---

## Mobile/Tablet Experience (Touch)

### Bottom Toolbar

On small screens (<768px), a mobile toolbar appears at the bottom:

```
┌────────────────────────────┐
│                            │
│      Canvas (tap here)     │
│                            │
├────────────────────────────┤
│ 🥔 💡 ⚡ 💡 🔌 │ ▶️      │  ← Mobile Toolbar
└────────────────────────────┘
```

### Component Placement

1. Tap a component button (e.g., 💡 LED)
2. Button highlights in orange
3. Tap canvas repeatedly to place multiple LEDs
4. Tap button again to exit mode

**Features:**
- 60px touch targets (easy to tap)
- Components render 1.5x larger
- Haptic feedback when placing

### Wire Creation (Click-Sequence)

1. Tap 🔌 Wire button
2. Tap components in order: Battery → LED → Resistor
3. Orange preview shows your chain
4. Tap empty space to finish
5. Wires created!

**Tips:**
- Can zoom/pan between taps (pinch and 2-finger drag)
- Orange glow shows last component in chain
- No need to hold finger down - just tap, tap, tap

### Pan & Zoom (Coming Soon)

- **Pinch** → Zoom in/out (0.5x - 3x)
- **2-finger drag** → Pan canvas
- **Double-tap** → Toggle zoom (1x ↔ 2x)

### Undo

- **Toast notification** → Appears for 3 seconds with [UNDO] button
- **↶ Button** (top-left) → Tap to undo
- Same 20-action history as desktop

---

## Capability Detection

The app automatically detects your device capabilities:

### Detected Capabilities

| Capability | Detection | Adaptation |
|------------|-----------|------------|
| **Pointer Type** | Coarse (touch) vs Fine (mouse) | Touch targets: 60px vs 32px |
| **Viewport Size** | Width in pixels | Toolbar position: bottom vs top |
| **Multi-touch** | Touch points count | Pinch zoom vs scroll wheel |
| **Hover** | CSS media query | Show/hide tooltips |
| **Keyboard** | Event detection | Enable/disable shortcuts |

### Hybrid Devices

Touchscreen laptops get **best of both worlds**:
- Mouse precision when using trackpad
- Large touch targets when touching screen
- Click-sequence wiring works with both touch and mouse
- Keyboard shortcuts always available

---

## Mode Indicator

When a mode is active:

**Component Placement Mode:**
- Button highlighted in orange
- Click canvas to place
- Mode stays active for rapid placement

**Wire Mode:**
- 🔌 button highlighted
- Orange dotted line follows cursor
- Click components to build chain
- Click empty space to finish

**Select Mode (Default):**
- No buttons highlighted
- Click to select/drag
- Right-click to delete

---

## Tips & Tricks

### Desktop

1. **Rapid Placement:** Click button once, place 10 components, done!
2. **Wire Chains:** Connect battery → 9 LEDs in parallel with 10 clicks
3. **Undo Mistakes:** Ctrl+Z is your friend
4. **Exit Mode Fast:** Escape key
5. **Zoom While Wiring:** Click-sequence mode lets you zoom between clicks

### Mobile

1. **Use Bottom Toolbar:** Easier to reach with thumb
2. **Rapid Tapping:** Tap tool button, then tap canvas multiple times
3. **Wire Chains:** Tap 🔌, then tap all components, tap empty to finish
4. **Toast Undo:** Tap [UNDO] immediately if you make a mistake
5. **Challenge Panel:** Tap banner to expand full-screen

### Universal

1. **One Tool Active:** Only one mode can be active at a time
2. **Simulation Clears Modes:** Starting simulation exits mode automatically
3. **Undo Cleared:** Starting simulation clears undo history
4. **Progressive Enhancement:** Base functionality works everywhere, enhanced features when available

---

## Troubleshooting

### "Wire mode not working"

- Make sure 🔌 button is highlighted
- Must click on actual components (not empty space)
- Click empty space to finish chain
- Need at least 2 components in chain

### "Can't place components"

- Component button must be highlighted
- Simulation must be stopped
- Click on canvas (not on existing components)

### "Undo button disappeared"

- Undo cleared when simulation starts
- Only available when undo history exists
- Check if simulation is running

### "Mobile toolbar not showing"

- Only appears on screens <768px wide
- Try resizing browser window
- Desktop toolbar should show instead

---

## Keyboard Shortcuts Summary

| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo |
| Ctrl+Shift+Z | Redo (coming) |
| Escape | Exit mode |
| Delete | Delete selected |
| Backspace | Delete selected |
| Space | (In toolbar) Run/Stop |

---

## Feedback

The UX is designed to be:
- ✅ Faster (fewer actions needed)
- ✅ More precise (exact placement)
- ✅ More forgiving (undo everything)
- ✅ Device-aware (adapts to your input method)

Enjoy building circuits!
