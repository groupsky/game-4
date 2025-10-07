# Mobile UX Design - Complete Specification

## Overview

Complete mobile-responsive design for Circuit Quest, optimized for rapid component placement and wiring.

### Key Metrics
- **Challenge 13 (9 LEDs)**: 22 actions (vs 87 desktop = 75% reduction)
- **Touch targets**: 60x60px minimum
- **Component scale**: 1.5x larger on mobile
- **Canvas zoom**: 0.5x - 3.0x with pinch gestures

---

## Layout Architecture

```
┌────────────────────────────┐
│ ↶  🎯 Challenge 13  ▼ 🔍   │ 40px: Undo + Challenge + Reset zoom
├────────────────────────────┤
│                            │
│    CANVAS                  │
│  (Pannable/Zoomable)       │ 75% screen
│                            │
│  [Toast: "LED added" ⎌]    │ Undo toast (3s)
│                            │
├────────────────────────────┤
│ [🥔] 💡 ⚡ 💡 [🔌] │ ▶️  │ 70px: Tools + Run
│   ▲ active                 │
└────────────────────────────┘
```

---

## Interaction Modes

### 1. Pan & Zoom (Always Available)
**2-finger gestures** (doesn't interfere with 1-finger interactions):

- **Pinch-to-zoom**: Spread = zoom in, pinch = zoom out (0.5x - 3x)
- **Pan**: 2-finger drag moves canvas
- **Double-tap**: Toggles between 1x and 2x zoom at tap point
- **Reset button**: 🔍 in top-right returns to 1:1 centered view

**Implementation**: `CanvasZoom.js`
- Transforms screen coords ↔ canvas coords
- Applies `ctx.translate()` and `ctx.scale()`
- Handles gesture tracking (distance, center point)

### 2. Select Mode (Default, no tool active)
**1-finger tap interactions**:

- Tap component → Select + show context menu
- Drag component → Move it (after tap-select)
- Tap empty space → Deselect all
- Context menu appears at bottom: `📋 Copy │ 🔌 Wire │ 🗑️ Delete`

### 3. Place Mode (Component button highlighted)
**Rapid bulk placement workflow**:

1. Tap tool button (e.g., 💡 LED) → Button highlights, mode activates
2. Tap canvas repeatedly → Components spawn at exact tap location
3. Tool stays active for rapid multi-placement
4. Tap tool button again → Deactivate, return to select mode

**Optimizations**:
- No random positioning - exact tap location
- Optional snap-to-grid (20px grid)
- Components 1.5x larger on mobile for visibility
- Default spawn at canvas center if empty

### 4. Wire Mode (🔌 button highlighted)
**Chain-wire creation** (game changer for mobile):

- Drag finger from component A → B → C → release
- Creates wires: A→B, B→C in single gesture
- Visual feedback: Dotted line follows finger
- Components pulse/highlight when hovering (60px snap radius)
- Each drag chain = 1 undoable action

**Example**: Challenge 13 (9 LEDs grid)
- 3 drag chains = 9 LEDs powered in parallel
- 3 drag chains = 9 LEDs returned to ground
- Total: 6 drag gestures = 24 wires

---

## Undo System

**Single-level undo** with toast notifications:

### Undo Button
- Top-left corner (↶)
- Only visible when undo available
- Reverts last action

### Toast Notifications
- Appear for 3 seconds at bottom-center
- Format: "Battery added" [UNDO]
- Tap UNDO button in toast or top-left ↶
- Auto-dismiss after 3s

### Actions Tracked
```javascript
- add-component    → "🥔 Battery added"
- delete-component → "💡 LED deleted"
- add-wires        → "3 wires created"
- delete-wire      → "Wire deleted"
- move-component   → "Component moved"
- copy-component   → "💡 LED copied"
```

### Undo Cleared When
- Simulation starts (prevents editing during run)
- Challenge changes (fresh start)
- Another action performed (single-level only)

**Implementation**: `UndoManager.js`

---

## Component Context Menu

Appears when component selected (tap in select mode):

### 📋 Copy
- Duplicates component 80px to the right
- Auto-selects copy for immediate dragging
- Preserves component properties
- Toast: "Component copied" [UNDO]

### 🔌 Wire
- Enters wire mode with component pre-selected
- Banner hint: "Drag to target component"
- First tap/drag creates wire to target

### 🗑️ Delete
- Deletes component + ALL connected wires
- Toast: "Component deleted" [UNDO 3s]
- Clears selection

---

## Mobile Toolbar

Bottom-fixed toolbar (70px height):

### Component Tools (scrollable if needed)
- 🥔 Battery
- 💡 LED
- ⚡ Resistor
- ⚡ Capacitor
- 💡 Bulb
- 🔌 Wire mode

**Behavior**:
- Tap = activate (button highlights)
- Tap again = deactivate
- Disabled during simulation (grayed out)
- Active tool shows with highlight + translateY(-2px)

### Run/Stop Button
- Fixed right position (doesn't scroll)
- ▶️ Green = Start simulation
- ⏸️ Red = Stop simulation
- 64x64px touch target

**Implementation**: `MobileToolbar.jsx`

---

## Challenge Panel Mobile

### Collapsed State (default)
- 40px banner at top
- Shows: "🎯 Challenge Title · N/26"
- Tap to expand

### Expanded State
- Full-screen overlay (80% height)
- Backdrop dimmed (rgba(0,0,0,0.3))
- Scrollable content
- Swipe down or tap backdrop to dismiss
- Sticky header with close button

**Implementation**: Update `ChallengePanel.jsx` with mobile detection

---

## Touch Event Handling

### Event Priority
1. **2-finger events** → Always pan/zoom (highest priority)
2. **1-finger + wire mode** → Wire creation
3. **1-finger + place mode** → Component placement
4. **1-finger + select mode** → Selection/movement

### Gesture Detection
```javascript
touchstart → Detect 1-finger vs 2-finger
  - 2-finger: Start pan/zoom gesture
  - 1-finger + wire mode: Start wire preview
  - 1-finger + place mode: Place component immediately
  - 1-finger + select mode: Check hit component

touchmove → Handle active gesture
  - 2-finger: Update pan/zoom
  - Wire mode: Update wire preview line, highlight hover targets
  - Select mode + dragging: Move component

touchend → Complete gesture
  - 2-finger: End pan/zoom, reset gesture state
  - Wire mode: Create wire chain, record undo
  - Place mode: (no-op, already placed)
  - Select mode: Final position, record undo
```

### Hit Detection
- Component tap radius: 60px (2x desktop 30px)
- Wire snap radius: 60px (for connecting during drag)
- Empty space detection: No component within radius

---

## Complete User Flow Example

### Challenge 13: LED Array (9 LEDs + 3 batteries)

#### Setup (14 taps)
1. Tap 🥔 → Battery mode active
2. Tap canvas 3× → 3 batteries appear at tap locations
3. Tap 💡 → LED mode active
4. Tap canvas 9× → 9 LEDs appear

#### Arrange (zoom + drag)
5. Pinch-out → Zoom to 150%
6. 2-finger drag → Pan view
7. Tap 🥔 to exit place mode → Select mode active
8. Drag components to arrange 3×3 grid pattern

#### Wire Power (1 tap + 4 drags)
9. Tap 🔌 → Wire mode active
10. Drag bat1→bat2→bat3 (series chain)
11. Drag bat+→LED1→LED2→LED3 (parallel branch 1)
12. Drag bat+→LED4→LED5→LED6 (parallel branch 2)
13. Drag bat+→LED7→LED8→LED9 (parallel branch 3)

#### Wire Returns (3 drags)
14. Drag LED3→LED6→LED9→bat- (combine returns)
15. Or separate returns if needed

#### Test
16. Tap ▶️ → Simulation runs
17. Challenge auto-validates

**Total**: ~15 taps + 7 drag chains = **22 actions** (vs 87 desktop!)

---

## Implementation Files

### Created
- ✅ `src/utils/CanvasZoom.js` - Pan/zoom/coordinate transform
- ✅ `src/utils/UndoManager.js` - Single-level undo system
- ✅ `src/components/Toast.jsx` - Toast notifications
- ✅ `src/components/Toast.css`
- ✅ `src/components/MobileToolbar.jsx` - Bottom toolbar
- ✅ `src/components/MobileToolbar.css`
- ✅ `src/components/MobileControls.jsx` - (deprecated, use MobileToolbar)
- ✅ `src/components/MobileControls.css`

### Updated
- ✅ `src/components/CircuitWorkspace.css` - Responsive breakpoints
- ✅ `src/components/ChallengePanel.css` - Mobile expand/collapse
- 🔄 `src/components/CircuitWorkspace.jsx` - Needs mobile integration
- 🔄 `src/components/ChallengePanel.jsx` - Needs mobile expand behavior

---

## Next Steps

### Phase 1: Core Touch (TDD)
1. Write tests for CanvasZoom coordinate transforms
2. Write tests for UndoManager state management
3. Integrate CanvasZoom into CircuitWorkspace
4. Add mobile mode state management
5. Implement touch event handlers (touchstart/move/end)
6. Test tap-to-place component workflow

### Phase 2: Wire Mode (TDD)
1. Write tests for wire chain creation
2. Implement wire mode touch handlers
3. Add wire preview rendering
4. Add snap-to-component highlighting
5. Test chain-wire creation (A→B→C)

### Phase 3: Polish
1. Add haptic feedback (if supported)
2. Add component spawn animations
3. Optimize canvas rendering for mobile
4. Add snap-to-grid option
5. Performance testing on real devices

---

## Edge Cases Handled

### Component Overlap
- Z-order: Last placed = on top
- Selection: Tap cycles through overlapping
- Move apart by dragging

### Wire Creation
- No self-wiring (A→A blocked)
- No duplicate wires (A→B exists, ignore)
- Cancel wire: Tap empty space or 🔌 button

### Zoom During Interaction
- 2-finger during wire → Cancels wire, starts pan/zoom
- 2-finger during drag → Cancels drag, starts pan/zoom
- Intentional: Zoom takes priority over edits

### Simulation Running
- All edit modes disabled (toolbar grayed)
- Only pan/zoom + stop button active
- Undo cleared when simulation starts
- Respects "no editing during simulation" rule

---

## Performance Targets

- Touch response: < 16ms (60fps)
- Component placement: Instant (<50ms)
- Wire preview: Smooth during drag (60fps)
- Canvas render: < 16ms for 100 components
- Memory: No leaks during rapid placement
- Pan/zoom: Butter-smooth (no jank)

---

## Browser Compatibility

- iOS Safari 12+
- Chrome Android 80+
- Firefox Android 80+
- Samsung Internet 12+

### Features Used
- Touch Events API (touchstart/move/end)
- Canvas 2D API with transforms
- CSS flexbox + media queries
- Position: fixed for modals
- Transform: translate for animations

---

## Design Rationale

### Why Mode-Based?
- **Explicit, not hidden**: Every action is visible via button state
- **Scales to bulk operations**: 1 mode select + N placements
- **Prevents mistakes**: Clear affordance of what will happen
- **Familiar pattern**: Matches Figma, Procreate, drawing apps

### Why Chain-Wire?
- **Scalability**: Linear scaling (not 3x per wire)
- **Natural gesture**: Dragging = connecting is intuitive
- **Efficiency**: 7 drags vs 75 taps for Challenge 13
- **Undo-friendly**: Each chain is one action

### Why Single-Level Undo?
- **Simplicity**: No undo stack complexity
- **Mobile-appropriate**: 3s toast is enough time to react
- **Clears on simulation**: Prevents editing confusion
- **Sufficient**: Mistakes are rare with clear modes

### Why Bottom Toolbar?
- **Thumb-reachable**: 80% of screen usage is bottom 1/3
- **Non-blocking**: Doesn't cover canvas content
- **Persistent**: Always visible, no hidden menus
- **Familiar**: Matches iOS/Android app patterns

---

## Future Enhancements

### v2 Features
- Multi-level undo (stack of 10 actions)
- Redo functionality
- Component rotation (for aesthetic placement)
- Snap-to-grid toggle in settings
- Copy-paste multiple components
- Wire routing hints (auto-path finding)
- Gesture shortcuts (2-finger tap = undo)

### Accessibility
- VoiceOver/TalkBack support for component names
- High contrast mode toggle
- Larger touch targets option (80x80px)
- Haptic feedback for all actions
- Audio feedback for wire creation

---

This design delivers a **75% reduction in mobile actions** while maintaining desktop functionality. Ready for implementation with TDD approach.
