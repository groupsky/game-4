# CLAUDE.md

**IMPORTANT: When adding to this file, ALWAYS write in compact form - remove general knowledge, keep only MUST/SHOULD/ALWAYS/NEVER rules and specific constraints.**

Circuit Quest: educational sandbox game - build computers from household items, 2D "inventor's sketchbook" aesthetic.

**Tech:** React + Vite + Vitest

## Development Rules

**ALWAYS use TDD when implementing features or fixing bugs:**
1. Write test first (RED) - test must fail initially
2. Implement minimal code to pass (GREEN) - don't over-engineer
3. Refactor while keeping tests green
4. Commit only when all tests pass - include test + implementation together

**MUST refactor when file exceeds line limits:**
- Implementation files: 500 lines
- Test files: 1500 lines
- Split into logical modules/classes
- Extract related functions into separate files
- Keep test files close to implementation
- Maintain single responsibility principle

**ALWAYS verify before removing files:**
- Run all tests to ensure split modules work correctly
- Verify no functionality lost in refactoring
- Check git status to confirm all new files added
- Only remove original file after verification passes

**Engine/Logic Layer MUST have tests:**
- Circuit simulation, component behavior, wire connectivity, voltage/current calculations, graph traversal, state management

**UI Layer tests optional but encouraged**

**Challenge Tests MUST include:**
- Positive test: Working solution that passes validation (in ChallengeSolutions.test.js)
- Negative tests: Verify challenge cannot be cheesed with easier solutions (in ChallengeNegative.test.js)
- ALWAYS create both when adding/modifying challenges

**Test Quality:** < 1ms per test, descriptive names, Arrange-Act-Assert structure, one assertion focus per test

## Architecture Constraints

**Circuit Simulation Engine:**
- 95% analytical formulas, 5% numerical (RK4 ODE lazy-loaded)
- Performance target: 60 FPS with 100+ components, <100ms simulation step

**Components:** Visual states NOT facial expressions
- MUST show state through: charge bars, glow intensity, mechanical positions, particle flows, voltage gradients
- NEVER use faces or anthropomorphism

**Visual Design:**
- 2D sketch aesthetic: wobbly lines, hatching, hand-drawn components
- MUST feel like inventor's notebook

**Color Palette:**
```
Paper White: #F5F5DC, Pencil Gray: #4A4A4A, Pen Blue: #1E3A8A
Copper: #B87333, Warning Red: #DC2626, Success Green: #16A34A
Power Yellow: #FBBF24, Highlight Orange: #F97316
```

**Code Organization:**
```
src/
├── components/    # React UI
├── engine/        # Circuit simulation
├── rendering/     # Visual rendering
├── challenges/    # Challenge system
├── progression/   # Crafting & tech tree
└── utils/
```

## Game Structure
- Act 1: Maker Era (1800s-1920s) - potato batteries, LEDs, crystal radios
- Act 2: Machine Era (1930s-1970s) - relays, tubes, logic gates
- Act 3: Silicon Era (1980s-2000s) - transistors, ICs, CPUs

## Important Rules
- ALL circuits MUST use real electrical engineering principles
- Challenges MUST be auto-validated AND have solution tests proving solvability
- NO lectures or forced tutorials - learning by doing only
- Performance: <50MB download, runs on 5-year-old hardware
