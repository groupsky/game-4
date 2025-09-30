# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Circuit Quest: From Potatoes to Processors** - An educational sandbox game where players build computers from household items, progressing through computing history from potato batteries to processors. Features a 2D hand-drawn "inventor's sketchbook" aesthetic with sophisticated visual feedback and user-generated challenges.

## Tech Stack

- **Frontend**: React
- **Build Tool**: Vite
- **Testing**: Vitest

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run a single test file
npm test -- path/to/test.spec.js
```

## Core Architecture

### Game Structure (Three Acts)

1. **Act 1: Maker Era (1800s-1920s)** - Household experiments, potato batteries, LEDs, crystal radios
2. **Act 2: Machine Era (1930s-1970s)** - Electromagnetic relays, vacuum tubes, logic gates, mechanical computers
3. **Act 3: Silicon Era (1980s-2000s)** - Transistors, ICs, CPUs, assembly programming

### Key Systems to Implement

#### 1. Circuit Simulation Engine
- **95% Analytical Formulas** - Direct calculations for most circuits (voltage dividers, RC charge, LC frequency)
- **5% Numerical** - RK4 ODE solver for complex multi-transistor circuits (lazy-loaded)
- **Boolean Logic** - Simple gate operations for digital/relay circuits
- Performance target: 60 FPS with 100+ components, <100ms simulation step

#### 2. Component System
Components have visual states, not facial expressions:
- State indicators (charge bars, glow intensity, mechanical positions)
- Visual feedback (particle flows, voltage gradients, animations)
- Degradation over time (batteries deplete, components wear)

#### 3. Visual Rendering (2D Sketch Aesthetic)
- Graph paper background, hand-drawn components
- SVG filters for pencil texture and wobble effects
- Smooth physics-based animations (12 principles of animation)
- State-based visual feedback (fill levels, glows, mechanical movements)

#### 4. User-Generated Challenge System
Three challenge types:
- **Design Challenges** - Build to specs with constraints
- **Puzzle Challenges** - Reverse engineering, debug mode
- **Creative Showcases** - Open-ended sharing

Challenge Editor features:
- Circuit builder with component library
- Constraint settings (max components, power, time)
- Test case validation
- Difficulty tagging and metadata

#### 5. Crafting & Progression
- Material tiers: Household → Hardware Store → Electronic Parts
- Recipe system for component construction
- Tech tree unlocks based on milestones

## Visual Design Guidelines

### Sketch Aesthetic
- Wobbly lines, hatching/cross-hatching for shading
- Colored pencil highlights, visible construction lines
- Notebook margin notes in cursive
- Coffee stains and eraser marks for character

### Color Palette
```
Paper White: #F5F5DC
Pencil Gray: #4A4A4A
Pen Blue: #1E3A8A
Copper: #B87333
Warning Red: #DC2626
Success Green: #16A34A
Power Yellow: #FBBF24
Highlight Orange: #F97316
```

### Component Visual States
Use sophisticated indicators instead of faces:
- Charge/energy: Fill levels, progress bars, glow intensity
- Activity: Pulsing animations, particle flows, wave patterns
- State changes: Smooth transitions, mechanical movements
- Errors: Warning icons, red highlights, smoke effects
- Success: Subtle sparkles, check marks, green highlights

## Code Organization Recommendations

```
src/
├── components/         # React UI components
│   ├── circuit/       # Circuit workspace, component drawer
│   ├── challenges/    # Challenge browser, creator
│   └── ui/           # Shared UI elements (notebook, tooltips)
├── engine/           # Circuit simulation
│   ├── components/   # Component definitions & behaviors
│   ├── solver/       # Analytical formulas & numerical solver
│   └── simulation/   # Circuit evaluation logic
├── rendering/        # Visual rendering system
│   ├── canvas/       # Canvas 2D or Pixi.js rendering
│   ├── filters/      # SVG filters for sketch effect
│   └── animations/   # Component animation states
├── challenges/       # Challenge system
│   ├── editor/       # Challenge creation tools
│   ├── validator/    # Test case validation
│   └── storage/      # IndexedDB persistence
├── progression/      # Game progression & unlocks
│   ├── crafting/     # Recipe system
│   └── tech-tree/    # Unlock logic
└── utils/           # Shared utilities
```

## Educational Philosophy

- **Learning by doing** - No lectures, discover through experimentation
- **Intuition first, math second** - Visual understanding before equations
- **Scaffolded complexity** - Each step builds naturally
- **Immediate feedback** - See results instantly
- **Historical context** - Understand *why* technology evolved

## Performance Requirements

- 60 FPS with 100+ components
- < 100ms simulation step
- < 50MB base download
- Runs on 5-year-old hardware
- Mobile-friendly touch controls

## Community Features

- Challenge creation and sharing
- Social features (follow, comment, leaderboards)
- Auto-validation (challenges must be solvable)
- Community rating and moderation
- Screenshot/replay sharing

## Important Notes

- Components show state through visual indicators, not facial expressions
- All circuits must use real electrical engineering principles
- The 2D sketch aesthetic should feel like an inventor's notebook
- User-generated content is a core feature, not an afterthought
- Education through play, not lectures or forced tutorials
