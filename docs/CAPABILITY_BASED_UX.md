# Capability-Based UX Design

## Core Philosophy

Design for **actual device capabilities** rather than "mobile vs desktop":
- **Pointer precision**: Coarse (touch) vs Fine (mouse)
- **Viewport size**: Small (<768px) vs Medium vs Large (>1024px)
- **Multi-touch**: Single-point vs Multi-touch (pinch, pan)
- **Hover**: Available vs Not available
- **Keyboard**: Available vs Not available

These capabilities are **orthogonal** and can combine in any way:
- 📱 Phone: Coarse + Small + Multi + No-hover + No-keyboard
- 🖥️ Desktop: Fine + Large + Single + Hover + Keyboard
- 💻 Touchscreen laptop: **BOTH** + Large + Multi + Hover + Keyboard
- 📱 Phone + Bluetooth mouse: Fine + Small + Single + Hover + Maybe-keyboard
- 🖥️ Touch monitor: Coarse + Large + Multi + No-hover + Keyboard

---

## Capability Detection

### JavaScript Detection

```javascript
class DeviceCapabilities {
  constructor() {
    this.detect()
    window.addEventListener('resize', () => this.detect())
  }

  detect() {
    // Pointer precision
    this.hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches
    this.hasFinePointer = window.matchMedia('(pointer: fine)').matches
    this.pointerType = this.hasFinePointer ? 'fine' : 'coarse'

    // Multi-touch
    this.maxTouchPoints = navigator.maxTouchPoints || 0
    this.hasMultiTouch = this.maxTouchPoints > 1

    // Hover capability
    this.hasHover = window.matchMedia('(hover: hover)').matches

    // Viewport size
    this.viewportWidth = window.innerWidth
    this.viewportSize =
      this.viewportWidth < 768 ? 'small' :
      this.viewportWidth < 1024 ? 'medium' : 'large'

    // Keyboard (detected by event)
    this.hasKeyboard = false
    this.keyboardCheckTimeout = null

    this.notifyListeners()
  }

  onKeyboardEvent() {
    this.hasKeyboard = true
    clearTimeout(this.keyboardCheckTimeout)
    this.keyboardCheckTimeout = setTimeout(() => {
      this.hasKeyboard = false
    }, 5000) // Assume no keyboard if no events for 5s
  }

  // Adaptive sizing
  getTouchTargetSize() {
    return this.hasCoarsePointer ? 60 : 32
  }

  getComponentScale() {
    return this.hasCoarsePointer ? 1.5 : 1.0
  }

  getSnapRadius() {
    return this.hasCoarsePointer ? 60 : 30
  }

  // Feature availability
  supportsShiftDrag() {
    return this.hasFinePointer && this.hasKeyboard
  }

  supportsClickSequence() {
    return true // Always available
  }

  supportsCtrlClick() {
    return this.hasFinePointer && this.hasKeyboard
  }

  supportsDragBox() {
    return this.hasFinePointer
  }

  supportsDoubleTapMultiSelect() {
    return this.hasCoarsePointer
  }

  supportsPinchZoom() {
    return this.hasMultiTouch
  }

  supportsScrollWheelZoom() {
    return this.hasFinePointer
  }
}
```

### CSS Detection

```css
/* Fine pointer (mouse) - precise targeting */
@media (pointer: fine) {
  .component-btn {
    min-width: 32px;
    min-height: 32px;
    padding: 6px 12px;
  }

  .component-btn:hover {
    background: #FBBF24;
    transform: translateY(-2px);
  }
}

/* Coarse pointer (touch) - large targets */
@media (pointer: coarse) {
  .component-btn {
    min-width: 60px;
    min-height: 60px;
    padding: 12px 16px;
  }

  .component-btn:active {
    background: #FBBF24;
    transform: scale(0.95);
  }
}

/* Hover available - show tooltips and hover states */
@media (hover: hover) {
  .component {
    transition: opacity 0.2s;
  }

  .component:hover {
    opacity: 0.8;
    cursor: grab;
  }

  .tooltip {
    display: block;
  }
}

/* No hover - stronger selection indicators */
@media (hover: none) {
  .tooltip {
    display: none;
  }

  .component.selected {
    outline: 3px solid #F97316;
  }
}
```

---

## Adaptive Interactions

### 1. Component Placement

**Coarse Pointer (Touch):**
- Tap tool → tool activated
- Tap canvas → 60px snap radius to grid
- Component appears centered on tap
- Large visual feedback (orange circle 80px)
- Haptic feedback if supported

**Fine Pointer (Mouse):**
- Click tool → tool activated
- Hover shows preview at cursor (if hover capable)
- Click to place at exact pixel
- Smaller preview (component outline 40px)
- No snap unless Shift held

**Implementation:**
```javascript
handlePlacementClick(e) {
  const pos = this.getCanvasCoords(e.clientX, e.clientY)

  if (capabilities.hasHover && capabilities.hasFinePointer) {
    // Mouse: Place exactly where cursor is
    this.placeComponent(this.activeComponentType, pos.x, pos.y)
  } else {
    // Touch: Snap to grid, show animation
    const snapRadius = capabilities.getSnapRadius()
    const snapped = this.snapToGrid(pos.x, pos.y, 20)
    this.showPlacementAnimation(snapped.x, snapped.y)
    this.placeComponent(this.activeComponentType, snapped.x, snapped.y)
  }

  // Haptic feedback for touch
  if (navigator.vibrate && capabilities.hasCoarsePointer) {
    navigator.vibrate(10)
  }
}
```

### 2. Wire Creation

**All Devices: Click-Sequence Mode (Primary)**
- Click 🔌 → wire mode active
- Click components in sequence: A → B → C
- Dotted line follows cursor
- Click empty space to finish chain
- Benefits: Can zoom/pan between clicks, works while zoomed

**Fine Pointer + Keyboard: Shift+Drag Mode (Secondary)**
- Shift+drag from A to B → wire created
- Classic desktop UX for short distances
- Faster for adjacent components
- Doesn't work well zoomed in

**Coarse Pointer:**
- Click-sequence ONLY (drag is imprecise)
- 60px snap radius to nearest component
- Large pulse highlights (80px circles)
- Banner: "Tap next component (3 wires so far)"

**Fine Pointer:**
- Click-sequence OR Shift+drag
- 30px snap radius
- Small highlights (40px circles)
- Hover preview of target component

**Implementation:**
```javascript
handleWireStart(e) {
  const isTouch = e.type.startsWith('touch')
  const isShiftKey = e.shiftKey && capabilities.hasKeyboard

  if (isShiftKey && capabilities.hasFinePointer) {
    // Mouse + Shift: Classic drag mode
    this.wireDragMode = true
    this.wireChain = [hitComponent.id]
  } else {
    // Touch OR click-sequence: Click mode
    this.wireClickMode = true
    this.wireChain.push(hitComponent.id)
    const count = this.wireChain.length - 1
    this.showBanner(`Click next component (${count} wire${count !== 1 ? 's' : ''} so far)`)
  }
}

handleWireClick(e) {
  if (!this.wireClickMode) return

  const pos = this.getCanvasCoords(e.clientX, e.clientY)
  const snapRadius = capabilities.getSnapRadius()
  const hit = this.getComponentAt(pos.x, pos.y, snapRadius)

  if (hit) {
    // Add to chain
    this.wireChain.push(hit.id)
    this.showBanner(`Click next component (${this.wireChain.length - 1} wires so far)`)
  } else {
    // Finish chain
    this.createWiresFromChain(this.wireChain)
    this.wireClickMode = false
    this.wireChain = []
    this.hideBanner()
  }
}
```

### 3. Selection

**Coarse Pointer (Touch):**
- Tap component → select (60px radius)
- Double-tap component → multi-select mode
- Drag selected → move with momentum
- Context menu: 📋 Copy | 🔌 Wire | 🗑️ Delete

**Fine Pointer (Mouse):**
- Click component → select (exact hit)
- Ctrl+click → add to selection (if keyboard)
- Drag empty space → selection box
- Drag component → precise move
- Right-click → context menu at cursor

**Keyboard Available:**
- Shift+click → range select
- Ctrl+A → select all
- Delete/Backspace → delete selected
- Escape → deselect all
- Arrow keys → nudge selected component

**No Keyboard:**
- All actions via touch/context menu
- Delete button in UI

**Implementation:**
```javascript
handleSelectionStart(e) {
  const pos = this.getCanvasCoords(e.clientX, e.clientY)
  const radius = capabilities.getTouchTargetSize() / 2
  const hit = this.getComponentAt(pos.x, pos.y, radius)

  if (hit) {
    if (capabilities.supportsCtrlClick() && (e.ctrlKey || e.metaKey)) {
      // Ctrl+click: Add to selection
      this.toggleSelection(hit.index)
    } else if (e.detail === 2 && capabilities.supportsDoubleTapMultiSelect()) {
      // Double-tap: Start multi-select
      this.multiSelectMode = true
      this.addToSelection(hit.index)
    } else {
      // Regular click: Select one
      this.selectComponent(hit.index)
    }
  } else if (capabilities.supportsDragBox()) {
    // Start drag box (mouse only)
    this.dragBoxStart = pos
  }
}
```

### 4. Pan & Zoom

**Multi-Touch:**
- Pinch-to-zoom (0.5x - 3.0x)
- 2-finger drag to pan
- Double-tap to zoom toggle (1x ↔ 2x)

**Fine Pointer + Keyboard:**
- Scroll wheel to zoom (at cursor)
- Space+drag OR middle-click to pan
- Ctrl+scroll for fine zoom control
- Ctrl+0 to reset zoom

**All Devices:**
- Zoom controls in UI (+ - 🔍)
- Fit-to-screen button
- Current zoom indicator: "150%"

**Small Viewport:**
- Controls at bottom-right
- Larger buttons (48px)

**Large Viewport:**
- Controls at top-right
- Smaller buttons (32px)
- Optional minimap

**Implementation:**
```javascript
handleZoom(e) {
  if (e.type === 'wheel' && capabilities.supportsScrollWheelZoom()) {
    // Mouse wheel zoom
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const pos = this.getCanvasCoords(e.clientX, e.clientY)
    this.zoomAtPoint(delta, pos.x, pos.y)
  } else if (e.type === 'touchmove' && e.touches.length === 2) {
    // Pinch zoom
    this.canvasZoom.handlePinch(e.touches[0], e.touches[1], this.canvasRef.getBoundingClientRect())
  }
}

handlePan(e) {
  if (e.type === 'touchmove' && e.touches.length === 2) {
    // 2-finger pan
    this.canvasZoom.handlePan(e.touches[0], e.touches[1])
  } else if (e.type === 'mousemove' && (e.buttons === 4 || (e.buttons === 1 && this.spacePressed))) {
    // Middle-click or Space+drag
    const dx = e.clientX - this.lastPanPos.x
    const dy = e.clientY - this.lastPanPos.y
    this.canvasZoom.pan(dx, dy)
    this.lastPanPos = { x: e.clientX, y: e.clientY }
  }
}
```

### 5. Context Menu

**Coarse Pointer:**
- Tap selected component → menu slides up from bottom
- Full-width bottom sheet
- Large buttons (56px height)
- Backdrop dims screen
- Actions: 📋 Copy | 🔌 Wire | 🗑️ Delete

**Fine Pointer:**
- Right-click → compact popup at cursor
- Smaller buttons (32px height)
- Hover highlights
- No backdrop

**Small Viewport:**
- Always bottom sheet (even for mouse)
- More vertical space for actions

**Large Viewport:**
- Floating menu near component
- Compact, doesn't block view

**Implementation:**
```javascript
showContextMenu(componentIndex, x, y) {
  this.contextMenu = {
    componentIndex,
    actions: this.getContextActions(componentIndex)
  }

  if (capabilities.viewportSize === 'small') {
    // Bottom sheet on small screens
    this.contextMenu.position = 'bottom-sheet'
  } else if (capabilities.hasCoarsePointer) {
    // Bottom sheet for touch on any screen
    this.contextMenu.position = 'bottom-sheet'
  } else {
    // Floating menu for mouse on large screens
    this.contextMenu.position = { x, y }
  }
}
```

---

## Undo System

**Multi-Level Stack (20 actions):**
```javascript
class UndoStack {
  constructor() {
    this.stack = []
    this.current = -1
    this.maxSize = 20
  }

  push(action) {
    // Remove any redo history
    this.stack = this.stack.slice(0, this.current + 1)
    this.stack.push(action)
    if (this.stack.length > this.maxSize) {
      this.stack.shift()
    } else {
      this.current++
    }
  }

  undo() {
    if (this.canUndo()) {
      return this.stack[this.current--]
    }
  }

  redo() {
    if (this.canRedo()) {
      return this.stack[++this.current]
    }
  }

  canUndo() {
    return this.current >= 0
  }

  canRedo() {
    return this.current < this.stack.length - 1
  }

  getUndoCount() {
    return this.current + 1
  }
}
```

**UI:**
- ↶ button shows "×3" when multiple undos available
- Toast: "3 wires created" [UNDO] (3s timeout)
- Click toast UNDO or ↶ button → undo last
- Long-press ↶ → show undo history dropdown

**Keyboard:**
- Ctrl+Z / Cmd+Z → Undo
- Ctrl+Shift+Z / Cmd+Shift+Z → Redo
- Ctrl+Y → Redo (Windows)

---

## Layout Adaptation

### Small Viewport (<768px)
```
┌────────────────┐
│ ↶×3 🎯 Ch.13▼ │ 40px banner
├────────────────┤
│                │
│    CANVAS      │ 80% (touch optimized)
│                │
├────────────────┤
│ 🥔 💡 ⚡ 🔌 ▶️│ 70px toolbar (bottom)
└────────────────┘
```

### Large Viewport (>1024px)
```
┌──────────────────────────┐
│ ↶×3 🎯 Challenge 13 ▼    │ 40px banner
├──────────────────────────┤
│ 🥔 💡 ⚡ 🔌 │ ▶️       │ 50px toolbar (top)
├──────────────────────────┤
│         CANVAS           │ 85%
├──────────────────────────┤
│ Info: 3 components       │ 30px info bar
└──────────────────────────┘
```

**Challenge Panel:**
- Small: Collapsible banner → full-screen overlay
- Large: Fixed panel at right side

---

## Implementation Plan

### Phase 1: Capability Detection (TDD)
- [ ] Create DeviceCapabilities class
- [ ] Write tests for capability detection
- [ ] Test on various device combinations
- [ ] Hook into React state management

### Phase 2: Adaptive Component Placement (TDD)
- [ ] Update component placement to use capabilities
- [ ] Write tests for touch vs mouse placement
- [ ] Implement snap-to-grid for coarse pointers
- [ ] Add placement animation

### Phase 3: Click-Sequence Wiring (TDD)
- [ ] Implement click-sequence wire mode
- [ ] Write tests for wire chain creation
- [ ] Add visual feedback (dotted line, highlights)
- [ ] Keep Shift+drag for fine pointers

### Phase 4: Multi-Level Undo (TDD)
- [ ] Replace UndoManager with UndoStack
- [ ] Write tests for stack operations
- [ ] Update UI to show undo count
- [ ] Add keyboard shortcuts

### Phase 5: Adaptive Selection (TDD)
- [ ] Implement double-tap multi-select
- [ ] Maintain Ctrl+click and drag-box
- [ ] Write tests for all selection modes
- [ ] Add context menu adaptations

### Phase 6: Pan/Zoom Refinement (TDD)
- [ ] Test pinch zoom on real devices
- [ ] Add scroll wheel zoom
- [ ] Implement Space+drag pan
- [ ] Write tests for zoom constraints

### Phase 7: Polish
- [ ] Add haptic feedback
- [ ] Optimize rendering for each viewport
- [ ] Add keyboard shortcut hints
- [ ] Test on all capability combinations

---

## Testing Matrix

| Device Type | Pointer | Viewport | Multi-Touch | Hover | Keyboard |
|-------------|---------|----------|-------------|-------|----------|
| iPhone | Coarse | Small | Yes | No | No |
| iPad | Coarse | Medium | Yes | No | Virtual |
| iPad + Mouse | Fine | Medium | Yes | Yes | Virtual |
| Laptop Trackpad | Fine | Large | No | Yes | Yes |
| Laptop Touch | Coarse | Large | Yes | No | Yes |
| Desktop Mouse | Fine | Large | No | Yes | Yes |
| Touch Monitor | Coarse | Large | Yes | No | Yes |
| Phone + BT Mouse | Fine | Small | No | Yes | No |

---

## Benefits

✅ **Universal**: Works on ALL device combinations
✅ **Optimized**: Each capability gets best UX
✅ **Progressive**: Enhanced features when available
✅ **Future-proof**: New devices automatically supported
✅ **No assumptions**: Doesn't assume "mobile" or "desktop"

---

## Performance Targets

- Capability detection: < 50ms
- Touch response: < 16ms (60fps)
- Component placement: < 50ms
- Wire preview: 60fps smooth
- Zoom/pan: No jank, butter-smooth
- Canvas render: < 16ms for 100 components
