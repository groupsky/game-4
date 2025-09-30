# Circuit Quest: From Potatoes to Processors

**Game Design Document - Concept Pitch**

---

## Executive Summary

**Genre**: Educational Sandbox / Progression Crafting  
**Platform**: PC/Web (potential mobile)  
**Target Audience**: Ages 12+, makers, engineers, puzzle enthusiasts  
**Tagline**: *"Build a computer using everything in your house... then invent the future"*

---

## The Core Hook

Players **literally build the history of computing** - starting with a potato battery powering an LED, ending with designing their own CPU architecture. Every component is crafted from household items or unlocked historical parts.

### Why This Works
- **Educational**: Learn real electrical engineering through play
- **Tangible**: "I could actually build this at home!"
- **Progressive**: Start simple, get infinitely complex
- **Creative**: Sandbox mode for experimentation
- **Historical**: Understand *why* technology evolved

---

## Gameplay Loop

```
Scavenge → Craft → Test → Learn → Unlock → Repeat
```

### Example Player Session (First 10 Minutes)

1. **Tutorial**: "Find items in your kitchen"
2. **Scavenge**: Player clicks on potato, nails, copper wire
3. **Craft**: Drag-and-drop to build battery
4. **Test**: Connect to LED - see voltage readout: 0.9V!
5. **Challenge**: Try to power calculator - fails! Not enough current
6. **Learn**: Game explains series circuits with visual diagram
7. **Experiment**: Build 5 potato batteries in series → 4.5V
8. **Success**: Calculator powers on! Achievement unlocked
9. **Unlock**: "Battery Tech Tree" opens, new components available
10. **Hook**: "Want to power something bigger? Try building a radio..."

---

## Three-Act Structure

### Act 1: "The Maker Era" (1800s-1920s)
**Theme**: Discovery through household experiments  
**Duration**: 2-4 hours gameplay

#### Available Components
- **Power Sources**: Potato/lemon batteries, saltwater cells
- **Passive Components**: Pencil resistors, foil capacitors, wire coils
- **Output Devices**: LEDs, light bulbs, buzzers, motors
- **Special**: Crystal radio (no power source needed!)

#### Key Milestones
1. Light an LED with potato battery
2. Build a working electromagnet
3. Create a simple motor
4. Receive AM radio signal (crystal radio)
5. **Final Challenge**: Power a light bulb for 1 minute

#### Learning Goals
- Voltage, current, resistance (Ohm's Law)
- Series vs. parallel circuits
- Electromagnetic induction
- Resonance and tuning

---

### Act 2: "The Machine Era" (1930s-1970s)
**Theme**: Building mechanical computers  
**Duration**: 8-15 hours gameplay

#### Available Components
- **Logic Elements**: Electromagnetic relays, vacuum tubes
- **Memory**: Ferrite core memory, punch cards
- **Input/Output**: Switches, indicator lights, card readers
- **Power**: Wall outlets, battery arrays

#### Key Milestones
1. Build a relay (from coil + switch)
2. Create logic gates (AND, OR, NOT)
3. Build a 1-bit adder
4. Build a 4-bit adder
5. Create a simple calculator
6. Build core memory (8 bytes!)
7. **Final Challenge**: Create a programmable calculator

#### Learning Goals
- Boolean logic
- Binary arithmetic
- State machines
- Memory addressing
- How computers actually work (mechanically)

#### Special Challenges
- **"Colossus Challenge"**: Break an encrypted code using relay logic
- **"ENIAC Recreation"**: Build computer within size/weight limits
- **"Efficiency Mode"**: Minimize relay count in design

---

### Act 3: "The Silicon Era" (1980s-2000s)
**Theme**: Miniaturization and abstraction  
**Duration**: 15-30+ hours gameplay

#### Available Components
- **Transistors**: NPN, PNP, MOSFET
- **Integrated Circuits**: Gates, flip-flops, counters, ALUs
- **Memory**: RAM, ROM chips
- **Interfaces**: 7-segment displays, keyboards, screens

#### Key Milestones
1. Build transistor logic gates
2. Create a D flip-flop (memory cell)
3. Design an ALU (Arithmetic Logic Unit)
4. Build a simple CPU (4-bit)
5. Design instruction set architecture
6. Create a complete computer system
7. Write assembly code for your computer
8. **Final Challenge**: Run Pong on your homemade computer

#### Learning Goals
- Transistor operation
- Sequential vs. combinational logic
- CPU architecture
- Assembly programming
- Computer organization

#### Advanced Features
- **Visual Circuit Editor**: Design custom ICs
- **Timing Diagrams**: See signal propagation
- **Optimization**: Minimize gate count, power, or delay
- **Programming**: Write programs for your creation

---

## Unique Features

### 1. Real Physics, Gamified
- **Visual Current Flow**: Particles flowing through wires
- **Real Measurements**: Oscilloscope, multimeter tools
- **Failure States**: Smoke effects if wired wrong (but forgiving)
- **"Why?" System**: Click any failure → tutorial explanation

### 2. Historical Context
- **Era-Specific Challenges**: Solve problems engineers actually faced
- **Historical Photos**: Unlock as you progress
- **Famous Quotes**: Edison, Tesla, Turing, etc.
- **Timeline**: See your progress on computing history timeline

### 3. Creative Sandbox Mode
- All components unlocked
- No resource constraints
- Export/import designs as "blueprints"
- Community sharing system
- Weekly design challenges

### 4. Multiplayer Options (Future)
- **Co-op**: One player designs power system, other designs logic
- **Trading Post**: Exchange rare components
- **Async Challenges**: "Improve my design" competitions
- **Leaderboards**: Most efficient designs

---

## Crafting System

### Material Types
```
Basic Materials → Components → Circuits → Systems
```

#### Tier 1: Household Items
- Potato, lemon, salt, water
- Aluminum foil, copper wire, nails
- Paper, cardboard, pencil (graphite)
- Mason jars, plastic wrap

#### Tier 2: Hardware Store
- Wire coils, magnets
- Switches, terminals
- Light bulbs, buzzers
- Basic electronic components

#### Tier 3: Electronic Parts
- Diodes, transistors
- Capacitors, resistors (standardized)
- ICs, microcontrollers
- Displays, interfaces

### Example Recipes

**Potato Battery**
- 1 Potato
- 1 Zinc nail (galvanized)
- 1 Copper wire/coin
- Output: 0.9V, 1mA max

**Crystal Radio**
- 1 Wire coil (tuning inductor)
- 1 Variable capacitor
- 1 Diode (detector)
- 1 Earphone
- No power source needed!

**Electromagnetic Relay**
- 1 Wire coil (100 turns)
- 1 Iron nail (core)
- 1 Switch mechanism
- 1 Spring
- Output: Logic gate building block

---

## Educational Philosophy

### Learning by Doing
- **No lectures**: Learn through experimentation
- **Immediate feedback**: See results instantly
- **Scaffolded complexity**: Each step builds on last
- **Multiple paths**: Different ways to solve challenges

### Intuition First, Math Second
- Show current flow visually
- Explain concepts through analogy
- Math equations available but optional
- "Feel" how circuits work before calculating

### Historical Context = Motivation
Players understand:
- Why vacuum tubes were revolutionary
- Why transistors changed everything
- Why integrated circuits enabled computers
- How we got from room-sized to pocket-sized

---

## Art Direction

### Visual Style
**Theme**: Cozy workshop/inventor's lab aesthetic

- **Hand-drawn schematic look**: Circuits that come alive
- **Blueprint UI**: Notebook/graph paper backgrounds
- **Particle effects**: Electricity as flowing particles
- **Material textures**: Wood, metal, paper feel tactile
- **Historical photos**: Black & white archival images

### Audio Design
- **Satisfying clicks**: Relay switches, button presses
- **Electrical hum**: Transformers, power supplies
- **Era-appropriate music**: 1920s → 1950s → 1980s styles
- **Voice-over tutorials**: Friendly inventor character

### UI/UX
- **Minimal HUD**: Focus on the workshop
- **Context menus**: Right-click for component info
- **Visual feedback**: Voltage/current as glowing intensity
- **Tooltips**: Always available, never intrusive

---

## Technical Requirements

### Simulation Engine
**95% Analytical Formulas** (instant calculations)
- Ohm's Law: V = IR
- Power: P = VI
- RC circuits: V(t) = V₀(1 - e^(-t/RC))
- LC resonance: f = 1/(2π√LC)
- Voltage dividers, current dividers

**5% Numerical Integration** (for complex circuits)
- RK4 solver for transistor amplifiers
- Boolean logic engine for digital circuits
- State machine for relay computers

### Platform Considerations
**Web Version** (Primary)
- Three.js for 3D visualization
- Web Audio API for sound
- Canvas/WebGL for circuit rendering
- Local storage for saves

**Downloadable** (Secondary)
- Electron wrapper
- Better performance
- Offline play
- Steam integration

### Performance Targets
- 60 FPS with 100+ components on screen
- < 100ms simulation step
- < 50MB download size (base game)
- Works on 5-year-old hardware

---

## Progression & Monetization

### Free Base Game
- Act 1 complete (household experiments)
- Act 2 partial (up to relay logic)
- Sandbox mode (limited components)

### Premium DLC (Optional)
**"The Vacuum Tube Age"** - $4.99
- Act 2 complete
- Tube circuits and radio receivers
- Historical challenges

**"The Transistor Revolution"** - $4.99
- Act 3 up to basic ICs
- Transistor circuits and amplifiers
- CPU design basics

**"The Microprocessor Era"** - $4.99
- Act 3 complete
- Full CPU architecture
- Assembly programming

### Alternative: One-Time Purchase
- $14.99 for complete game
- All acts unlocked
- Free updates
- Support indie development

---

## Success Metrics

### Educational Impact
- Players can explain basic circuits after Act 1
- Players understand boolean logic after Act 2
- Players grasp CPU architecture after Act 3
- Teachers request classroom licenses

### Engagement
- Average session: 45+ minutes
- Completion rate: 40%+ finish Act 1
- Community: Active blueprint sharing
- Retention: 30% return after 1 week

### Commercial
- 50K downloads in first year (web)
- 10K sales if premium (realistic indie)
- 4.0+ rating on Steam/stores
- Positive press from education sector

---

## Comparable Games & Differentiation

### Similar Games
| Game | Similarity | How We're Different |
|------|-----------|-------------------|
| **Minecraft** | Creative building | We teach real engineering |
| **Factorio** | Complex systems | Focus on electronics, not factory |
| **Human Resource Machine** | Programming education | Hardware focus, not software |
| **Opus Magnum** | Engineering puzzles | Open-ended, not puzzle-based |
| **Shenzhen I/O** | Circuit design | More accessible, historical context |

### Our Unique Selling Points
1. **Only game teaching real EE through play**
2. **Household items make it tangible**
3. **Historical progression is inherently engaging**
4. **Both creative and educational**
5. **Accessible to beginners, deep for experts**

---

## Development Roadmap

### Phase 1: Prototype (3 months)
- Core simulation engine
- Act 1 basic components
- Potato battery → LED working
- Basic UI/UX

### Phase 2: Vertical Slice (3 months)
- Complete Act 1
- Polish gameplay loop
- Tutorial system
- Audio/visual polish

### Phase 3: Alpha (6 months)
- Act 2 implementation
- Relay logic system
- Historical challenges
- Playtesting with educators

### Phase 4: Beta (3 months)
- Act 3 implementation
- Sandbox mode
- Community features
- Bug fixing

### Phase 5: Launch (1 month)
- Marketing push
- Press outreach
- Community building
- Post-launch support

**Total Development Time**: 16 months  
**Team Size**: 2-4 people (small indie team)

---

## Marketing Angles

### Primary Audiences
1. **Students (12-18)**: "Learn while gaming"
2. **Makers/Hobbyists**: "Build what you play"
3. **Teachers**: "Classroom tool that's actually fun"
4. **Nostalgic Engineers**: "Remember when you learned this?"
5. **Puzzle Gamers**: "Engineering challenges"

### Marketing Channels
- **YouTube**: "I built a computer from a potato" videos
- **Reddit**: r/electronics, r/DIY, r/gaming
- **Maker Fairs**: Demo stations
- **Educational Conferences**: STEM teaching tool
- **Twitch**: Speedrun categories (fastest relay computer)

### Press Angles
- "The game that teaches electrical engineering"
- "From potatoes to processors: gaming meets education"
- "This game makes you want to learn physics"
- "Minecraft meets MIT OpenCourseWare"

---

## Risks & Mitigation

### Risk: "Too educational, not fun enough"
**Mitigation**: 
- Gameplay first, education second
- No forced tutorials
- Creative sandbox for pure play
- Satisfying feedback loops

### Risk: "Too complex for casual players"
**Mitigation**:
- Extremely gentle difficulty curve
- Optional hints always available
- Can skip to sandbox mode
- Multiple difficulty levels

### Risk: "Not educational enough for schools"
**Mitigation**:
- Align with educational standards
- Teacher resources/lesson plans
- Assessment tools for educators
- Curriculum integration guides

### Risk: "Simulation too difficult to build"
**Mitigation**:
- Already validated: 95% analytical
- Start simple, add complexity gradually
- Open source simulation libraries exist
- Can simplify for gameplay

---

## Closing Statement

**Circuit Quest** fills a gap in both gaming and education. It's the game that makes players say "I never understood electricity until I played this" and "I can't believe I built a working computer!"

By following the historical path of computing - from household experiments to silicon chips - players don't just learn *about* computers; they experience the journey of *inventing* them.

**One sentence pitch**: *Minecraft meets electrical engineering, where you build computers from scratch using historical and household components.*

---

## Next Steps

To move forward, we need:

1. **Prototype Funding**: $20-40K for 3-month prototype
2. **Team Assembly**: Developer, artist, educator consultant
3. **Playtesting**: With target audiences
4. **Partnership Exploration**: Educational institutions, maker communities

**Contact**: [Your Name/Studio]  
**Date**: September 30, 2025  
**Version**: 1.0

---

## Appendix: Technical Details

### Simulation Approach

**Analytical Solutions (No ODE solver needed)**
```javascript
// 90% of game circuits
const voltage_divider = (Vin, R1, R2) => Vin * R2 / (R1 + R2);
const RC_charge = (V, R, C, t) => V * (1 - Math.exp(-t/(R*C)));
const LC_frequency = (L, C) => 1 / (2 * Math.PI * Math.sqrt(L * C));
```

**Numerical Integration (RK4 for transistors)**
```javascript
// 5% of circuits - only when needed
const ode_rk4 = require('ode-rk4'); // Lazy load
// For multi-transistor amplifiers, coupled oscillators
```

**Boolean Logic (Relay/digital circuits)**
```javascript
// 5% of circuits
const AND = (a, b) => a && b;
const OR = (a, b) => a || b;
const NOT = (a) => !a;
```

### Component Library Examples

```javascript
const COMPONENTS = {
  potato_battery: {
    voltage: 0.9,
    current_max: 0.001,
    internal_resistance: 1000,
    degradation_rate: 0.01 // per hour
  },
  
  relay: {
    coil_resistance: 100,
    switching_voltage: 5,
    contact_resistance: 0.1,
    switching_time: 0.010 // 10ms
  },
  
  npn_transistor: {
    type: 'bjt',
    beta: 100,
    vbe_on: 0.7,
    simulation: 'ode' // Needs RK4
  }
}
```

---

**End of Pitch Document**