# Circuit Quest: From Potatoes to Processors

**Game Design Document - Complete Pitch v2.0**

---

## Executive Summary

**Genre**: Educational Sandbox / Progression Crafting  
**Platform**: PC/Web/Mobile  
**Target Audience**: Ages 12+, makers, engineers, puzzle enthusiasts  
**Tagline**: *"Build a computer using everything in your house... then invent the future"*

**Core Innovation**: 2D hand-drawn sketch aesthetic with sophisticated visual feedback system and robust user-generated challenge platform.

---

## The Core Hook

Players **literally build the history of computing** - starting with a potato battery powering an LED, ending with designing their own CPU architecture. Every component is crafted from household items or unlocked historical parts.

The game uses a **charming 2D sketch aesthetic** (like an inventor's notebook) where components show state through sophisticated visual feedback - fill levels, glow intensity, and mechanical animations rather than childish expressions. Players can create and share circuit challenges with the community.

### Why This Works
- **Educational**: Learn real electrical engineering through play
- **Tangible**: "I could actually build this at home!"
- **Progressive**: Start simple, get infinitely complex
- **Creative**: Sandbox mode + user-generated challenges
- **Historical**: Understand *why* technology evolved
- **Accessible**: 2D sketch style is approachable, not intimidating
- **Endless Content**: Community creates challenges forever

---

## Gameplay Loop

```
Scavenge → Craft → Test → Learn → Unlock → Share/Challenge → Repeat
```

### Example Player Session (First 10 Minutes)

1. **Tutorial**: "Find items in your kitchen"
2. **Scavenge**: Player clicks on potato, nails, copper wire
3. **Craft**: Drag-and-drop to build battery (components animate smoothly)
4. **Test**: Connect to LED - see voltage readout: 0.9V! LED glows softly ⚡
5. **Challenge**: Try to power calculator - fails! LED dims and flickers
6. **Learn**: Game explains series circuits with animated sketch
7. **Experiment**: Build 5 potato batteries in series → 4.5V
8. **Success**: Calculator powers on! Achievement unlocked, satisfying spark animation!
9. **Unlock**: "Battery Tech Tree" opens, new components available
10. **Share**: "Turn this into a challenge for friends?"
11. **Hook**: "Want to power something bigger? Try building a radio..."

---

## Art Direction: "Inventor's Sketchbook"

### Visual Style
**Core Aesthetic**: 2D hand-drawn cartoonish sketch style, as if everything is drawn in an inventor's notebook

#### Style Pillars

**1. Sketchbook Foundation**
- Graph paper background (faint grid lines)
- Hand-drawn component illustrations
- Pencil sketch annotations and labels
- Coffee stains and eraser marks for character
- Doodles in margins (failed experiments, ideas)
- Post-it notes for tutorials

**2. Component Visual Feedback (Subtle & Sophisticated)**
```
Components show state through visual cues, not faces:

⚡ Battery               💡 LED                🔧 Relay
┌──────────┐           ┌─────┐              ┌───────┐
│ ████████ │ (Full)    │ ≈≈≈ │ (Bright)     │ ═══╗  │ (Closed)
│ ████████ │           │ ≈≈≈ │              │    ║  │
│   100%   │           │ ✧✧✧ │              │    ║  │
└──────────┘           └─────┘ *glow*       └────╨──┘ *CLACK!*

┌──────────┐           ┌─────┐              ┌───────┐
│ ██░░░░░░ │ (Low)     │ ··· │ (Dim)        │ ═══   │ (Open)
│ ██░░░░░░ │           │ ··· │              │       │
│   25%    │           │  ·  │              │     ╷ │
└──────────┘           └─────┘              └─────╵─┘ *click*

┌──────────┐           ┌─────┐              ┌───────┐
│ ░░░░░░░░ │ (Dead)    │     │ (Off)        │ ═══   │ (Error)
│ ░░░░░░░░ │           │     │              │  ⚠️   │
│    0%    │           │     │              │       │
└──────────┘           └─────┘              └───────┘
```

**Visual Language:**
- **Charge/Energy**: Fill levels, progress bars, glow intensity
- **Activity**: Pulsing animations, particle flows, wave patterns
- **State Changes**: Smooth transitions, mechanical movements
- **Errors/Warnings**: Warning icons, red highlights, smoke effects
- **Success**: Subtle sparkles, check marks, green highlights

**3. Hand-Drawn Aesthetic**
- Wobbly lines (not perfect CAD)
- Hatching/cross-hatching for shading
- Colored pencil style for highlights
- Sketch construction lines visible
- Imperfect circles and curves (human touch)
- Notebook margin notes in cursive

**4. Visual Feedback (Sophisticated Indicators)**
- **Electricity Flow**: Stylized lightning paths ⚡ with glow trails
- **Current**: Animated particle streams with directional arrows
- **Voltage**: Color-coded intensity (blue→yellow→orange→red gradient)
- **Smoke**: Sketch-style wisps when overcurrent 
- **Success**: Subtle sparkles ✧, check marks ✓, soft green glow
- **Failure**: Warning triangles ⚠, red highlights, X marks

#### Color Palette
```
Primary Notebook Colors:
- Paper White: #F5F5DC (aged paper)
- Pencil Gray: #4A4A4A (sketch lines)
- Pen Blue: #1E3A8A (circuit traces)
- Copper: #B87333 (wire highlights)

Accent Colors:
- Warning Red: #DC2626 (too much current!)
- Success Green: #16A34A (working circuit!)
- Power Yellow: #FBBF24 (electricity flow)
- Highlight Orange: #F97316 (selected)
```

#### Animation Style
Based on 12 principles of animation, but sophisticated:
- **Smooth physics**: Components settle naturally when placed
- **Elastic transitions**: Wires flex realistically, springs compress
- **Anticipation**: Relays wind up slightly before clicking
- **Follow-through**: Energy dissipates naturally, smoke drifts
- **State feedback**: Visual indicators show component status clearly

### Audio Design
- **Mechanical sounds**: Relay switches (realistic clack!)
- **Electrical hum**: Transformers, power supplies (authentic bzzzz)
- **Subtle feedback**: Component state changes (soft clicks, beeps)
- **Era music**: 1920s → 1950s → 1980s (period-appropriate)
- **Voice-over**: Professional narrator (optional, toggle-able)
- **Ambient workshop**: Pencil scratching, paper rustling

### UI/UX: "Inventor's Desk"
```
┌──────────────────────────────────────────┐
│  📔 Circuit Quest - Inventor's Notebook  │
├──────────────────────────────────────────┤
│  ┌────────────────────────────┐          │
│  │ [Graph Paper Workspace]    │  [📦]    │
│  │                            │  Parts   │
│  │      ⚡────●────💡         │  Drawer  │
│  │     /             \        │          │
│  │   🔋──────────────●        │  [📋]    │
│  │                            │  Goals   │
│  │    V: 4.5V  I: 15mA        │          │
│  └────────────────────────────┘  [🏆]    │
│                                   Score  │
│  💬 "Great! The LED is happy!"           │
│     [Next Challenge →]                   │
└──────────────────────────────────────────┘
```

- **Notebook interface**: Pages flip between menus
- **Post-it notes**: Tutorials appear as sticky notes
- **Pencil cursor**: Changes to eraser, ruler, wire tool
- **Component drawer**: Pull-out sketchbook pages
- **Margin notes**: Tips in cursive handwriting
- **Tooltips**: Information boxes with technical details

---

## Three-Act Structure

### Act 1: "The Maker Era" (1800s-1920s)
**Theme**: Discovery through household experiments  
**Duration**: 2-4 hours gameplay

#### Available Components
- **Power**: Potato/lemon batteries, saltwater cells
- **Passive**: Pencil resistors, foil capacitors, wire coils
- **Output**: LEDs, light bulbs, buzzers, motors
- **Special**: Crystal radio (no power needed!)

#### Key Milestones
1. Light an LED with potato battery (first "aha!")
2. Build working electromagnet (pick up paperclips)
3. Create simple motor (watch it spin!)
4. Receive AM radio signal (hear real stations!)
5. **Final Boss**: Power a light bulb for 1 minute

#### Example Circuit (Sketch Style)
```
    📔 My First Circuit! ⚡
    ════════════════════════
    
    ╭─────╮                 ┌─────┐
    │ 🥔  │~~~~~~~~~~~~~~~~~│ 💡  │
    │ 9V  │  copper wire    │ ≈≈≈ │
    ╰─────╯                 └─────┘
    Potato                  LED
    Battery                 (glowing!)
    
    ✏️ Notes: 
    - Used nail from garage
    - Copper from old lamp
    - Working on first try!
    
    Next idea: Can I power a calculator? 🤔
```

---

### Act 2: "The Machine Era" (1930s-1970s)
**Theme**: Building mechanical computers  
**Duration**: 8-15 hours gameplay

#### Available Components
- **Logic**: Electromagnetic relays, vacuum tubes
- **Memory**: Ferrite core memory, punch cards
- **I/O**: Switches, indicator lights, card readers
- **Power**: Wall outlets, battery arrays

#### Key Milestones
1. Build a relay from scratch (coil + contacts)
2. Create logic gates (AND, OR, NOT with relays)
3. Build 1-bit adder (hear the relay symphony!)
4. Build 4-bit adder (calculator taking shape!)
5. Create simple calculator (multiplication works!)
6. Build core memory - 8 whole bytes! 
7. **Final Boss**: Programmable calculator

#### Special Challenges
- **"Colossus Challenge"**: Break encrypted code
- **"ENIAC Recreation"**: Build within weight limit
- **"Efficiency Mode"**: Minimize relay count

#### Relay Logic Example
```
    📔 AND Gate Design
    ══════════════════════
    
    Input A ──┐
              │  ┌───────┐
              ├──┤ 🔧😊  │──→ Output
              │  │Relay 1│
    Input B ──┘  └───────┘
    
    Truth Table:
    A | B | Out
    0 | 0 | 0  ✓
    0 | 1 | 0  ✓
    1 | 0 | 0  ✓
    1 | 1 | 1  ✓
    
    *click* *clack* Music! 🎵
```

---

### Act 3: "The Silicon Era" (1980s-2000s)
**Theme**: Miniaturization and abstraction  
**Duration**: 15-30+ hours gameplay

#### Available Components
- **Transistors**: NPN, PNP, MOSFET
- **ICs**: Gates, flip-flops, counters, ALUs
- **Memory**: RAM, ROM chips
- **I/O**: 7-segment displays, keyboards, screens

#### Key Milestones
1. Build transistor logic gates (so tiny!)
2. Create D flip-flop (memory cell!)
3. Design ALU (arithmetic unit)
4. Build simple CPU (4-bit to start)
5. Design instruction set
6. Create complete computer system
7. Write assembly code for your computer
8. **Final Boss**: Run Pong on your creation!

#### Advanced Features
- Visual IC editor (design custom chips)
- Timing diagrams (see signals propagate)
- Optimization challenges (speed/power/size)
- Assembly programming mini-game

---

## User-Generated Challenge System

### "The Challenge Workshop" - Core Community Feature

Players can create three types of challenges:

#### A) Design Challenges
**"Build something that meets specs"**

Example challenges:
- "Build 4-bit adder using max 20 relays"
- "Power this motor using only household items"
- "Create radio tuner for exactly 550 kHz"

**Creator tools:**
- Set constraints (max components, power, time)
- Define success criteria (voltage range, timing)
- Add test cases (input → expected output)
- Tag difficulty (⚡⚡⚡○○ = medium)

#### B) Puzzle Challenges
**"Figure out how this works"**

Black Box Mode:
- Show behavior, hide circuit
- "Replicate this mystery circuit"
- "Given outputs, recreate inputs"
- Reverse engineering puzzles

Debug Mode:
- "Find the 3 errors in this circuit"
- "Why doesn't this calculator work?"
- Teaching through troubleshooting

#### C) Creative Showcases
**"Check out what I built!"**

Open-ended sharing:
- "My 8-bit CPU design"
- "Working music synthesizer"
- "Animated LED matrix display"
- Remixable (others can improve it)

### Challenge Editor Interface
```
┌────────────────────────────────────────┐
│ 📋 Challenge Builder                   │
├────────────────────────────────────────┤
│  Title: ________________________       │
│  Your Amazing Circuit Name Here        │
│                                        │
│  ┌──────────────────────────┐          │
│  │  [Draw Circuit Here]     │          │
│  │                          │   [📦]   │
│  │    🔋───●───🔧───💡      │   Add    │
│  │        /                 │   Parts  │
│  └──────────────────────────┘          │
│                                        │
│  ⚙️ Constraints:                       │
│  ☑ Max 15 components                   │
│  ☑ Under 10 Watts                      │
│  ☐ Time limit: [60] seconds            │
│  ☐ Required parts: [Select...]         │
│                                        │
│  ✅ Test Cases: [Add +]                │
│  1. Input: [A=1, B=1] → Out: [1] ✓     │
│  2. Input: [A=0, B=1] → Out: [0] ✓     │
│                                        │
│  🎯 Difficulty: ⚡⚡⚡○○ (Medium)      │
│  🏷️ Tags: #logic #beginner #relay      │
│                                        │
│  Description:                          │
│  ┌────────────────────────────┐        │
│  │ Build an AND gate using... │        │
│  └────────────────────────────┘        │
│                                        │
│  [🧪 Test Challenge] [📤 Publish]       │
└────────────────────────────────────────┘
```

### Challenge Discovery: "Inventor's Bulletin Board"
```
┌────────────────────────────────────────┐
│ 📌 Community Challenges                │
├────────────────────────────────────────┤
│  🌟 Featured Today:                    │
│  "Mystery Calculator" by @TeslaFan     │
│  ⚡⚡⚡⚡○ | 847 attempts | 234 solved │
│  "Can you figure out how it works?"    │
│  [Try It →]                            │
│                                        │
│  🔥 Trending This Week:                │
│  1. "Potato Power Challenge" ⚡○○○○    │
│     2.4K attempts | 89% complete       │
│  2. "Relay Logic Puzzle" ⚡⚡⚡○○      │
│     1.8K attempts | 45% complete       │
│  3. "Build a Radio" ⚡⚡⚡⚡○          │
│     956 attempts | 23% complete        │
│                                        │
│  🔍 Search: [_________] 🔎             │
│  Filter: [Difficulty ▼] [Era ▼]        │
│          [#Tags ▼]                     │
│                                        │
│  Sort: [🔥 Hot] [⭐ Top] [🆕 New]      │
└────────────────────────────────────────┘
```

### Reward System
**Inventor Points & Badges**

Points earned:
- Create challenge: +10
- Solve challenge: +5 to +50 (by difficulty)
- First solver bonus: +25
- Challenge gets upvote: +1 to creator
- Featured challenge: +100

Badges (sketch-style icons):
- 🏆 "Edison's Apprentice" - 10 solved
- ⚡ "Tesla's Prodigy" - 50 solved
- 🔧 "Challenge Architect" - 5 created
- 🎓 "Master Engineer" - 100 solved
- 💡 "Lightbulb Moment" - First on hard challenge
- 🔥 "Viral Creator" - Challenge hits 1000 attempts

### Social Features
- **Follow creators**: See their new challenges
- **Comment system**: Tips in sketch-style bubbles
- **Screenshot sharing**: Export as notebook page image
- **Video replays**: Timelapse of solution (sketch animation)
- **Leaderboards**: Fastest solves, most efficient designs
- **Teams**: Collaborative challenge creation

### Moderation & Quality
- Auto-validation (must be solvable)
- Community rating (thumbs up/down)
- Report system (impossible/broken)
- Dev curation (weekly featured picks)
- Tutorial highlighting (best beginner content)

---

## Crafting System

### Material Progression
```
Basic Materials → Components → Circuits → Systems
```

#### Tier 1: Household Items
- Potato, lemon, salt, water
- Aluminum foil, copper wire, nails
- Paper, cardboard, pencil graphite
- Mason jars, plastic wrap

#### Tier 2: Hardware Store
- Wire coils, magnets
- Switches, terminals
- Light bulbs, buzzers
- Basic electronics

#### Tier 3: Electronic Parts
- Diodes, transistors
- Resistors, capacitors (standard values)
- ICs, microcontrollers
- Displays, interfaces

### Example Recipes

**Potato Battery** 🥔
```
Recipe:
- 1 Potato
- 1 Zinc nail
- 1 Copper wire
= Battery (0.9V, 1mA)

Personality: 😊 when fresh, 😴 when old
Degrades: 1% per game-hour
```

**Crystal Radio** 📻
```
Recipe:
- 1 Wire coil (100 turns)
- 1 Variable capacitor
- 1 Diode (detector)
- 1 Earphone
= Radio (no power needed!)

Special: Receives real AM frequencies!
Tuning: f = 1/(2π√LC)
```

**Electromagnetic Relay** 🔧
```
Recipe:
- 1 Wire coil (electromagnet)
- 1 Iron nail (core)
- 1 Spring contact
- 1 Switch mechanism
= Logic gate building block

Personality: Winks when it clicks! 😉
Sound: *click-CLACK!*
```

---

## Educational Philosophy

### Learning by Doing
- **No lectures**: Discover through experimentation
- **Immediate feedback**: See results instantly
- **Scaffolded complexity**: Each step builds naturally
- **Multiple paths**: Different ways to solve challenges
- **Fail forward**: Mistakes are learning opportunities

### Intuition First, Math Second
- Show current flow visually (animated particles)
- Explain concepts through analogy
- Math equations available but optional
- "Feel" circuits before calculating

### Historical Context = Motivation
Players understand:
- Why vacuum tubes were revolutionary
- Why transistors changed everything
- Why ICs enabled modern computing
- How room-sized became pocket-sized

---

## Technical Requirements

### Simulation Engine

**95% Analytical Formulas** (instant, no ODE solver)
```javascript
// Most circuits use direct formulas
voltage_divider = (Vin, R1, R2) => Vin * R2/(R1+R2)
RC_charge = (V, R, C, t) => V * (1 - exp(-t/(R*C)))
LC_frequency = (L, C) => 1/(2π*√(L*C))
power = (V, I) => V * I
```

**5% Numerical (RK4 for complex circuits)**
```javascript
// Only for multi-transistor amplifiers
const ode_rk4 = require('ode-rk4');
// Lazy-loaded when needed
```

**Boolean Logic** (digital/relay circuits)
```javascript
// Simple gates
AND = (a, b) => a && b
OR = (a, b) => a || b  
NOT = (a) => !a
XOR = (a, b) => a !== b
```

### Platform
**Web Version** (Primary)
- Pixi.js or Canvas 2D (sketch rendering)
- SVG filters (pencil texture, wobble effect)
- Web Audio API (sounds)
- Local storage (saves)
- IndexedDB (challenge database)

**Downloadable** (Secondary)
- Electron wrapper
- Steam Workshop integration
- Better performance
- Offline play

### Performance Targets
- 60 FPS with 100+ components
- < 100ms simulation step
- < 50MB base download
- Runs on 5-year-old hardware
- Mobile-friendly touch controls

---

## Progression & Monetization

### Free Base Game
- Act 1 complete (household experiments)
- Act 2 partial (relay logic basics)
- Sandbox mode (limited components)
- Challenge system (create & play unlimited)

### Premium DLC (Optional)
- **"Vacuum Tube Age"** ($4.99) - Act 2 complete
- **"Transistor Revolution"** ($4.99) - Act 3 partial
- **"Microprocessor Era"** ($4.99) - Act 3 complete

### Alternative Model
- **$14.99 one-time purchase** - Everything unlocked
- Free updates forever
- Support indie development

### Cosmetic DLC
- Notebook themes (vintage, modern, cyberpunk)
- Component skins (steampunk, sci-fi)
- Sound packs (realistic, retro, futuristic)

---

## Marketing Strategy

### Target Audiences
1. **Students (12-18)**: "Learn while gaming"
2. **Makers/Hobbyists**: "Build what you play"
3. **Teachers**: "Engaging classroom tool"
4. **Engineers**: "Remember learning this?"
5. **Puzzle Gamers**: "Creative challenges"

### Marketing Channels
- **YouTube**: "Potato to processor" timelapses
- **TikTok**: Short challenge completions (viral potential!)
- **Instagram**: Daily featured challenges, sketch art
- **Reddit**: r/electronics, r/DIY, r/gaming
- **Discord**: Creator community hub
- **Maker Fairs**: Playable demos
- **STEM Conferences**: Educational tool demos
- **Twitch**: Speedruns, challenge races

### Press Angles
- "The hand-drawn game teaching computer science"
- "From potatoes to processors: gaming meets education"
- "Players create 10,000+ educational challenges"
- "User-generated STEM education that works"
- "Minecraft meets electrical engineering"

---

## Success Metrics

### Educational Impact
- Players explain circuits after Act 1
- Understand boolean logic after Act 2
- Grasp CPU architecture after Act 3
- Teacher adoption in classrooms

### Engagement
- 45+ minute average sessions
- 40%+ complete Act 1
- 30% return after 1 week
- **UGC**: 10K+ challenges created (year 1)
- **UGC**: 50K+ attempts per month
- **UGC**: 20% of players create challenges

### Commercial
- 50K downloads first year (web)
- 10K premium sales (indie realistic)
- 4.0+ rating (Steam/stores)
- Positive education press
- 1000+ active challenge creators

---

## Development Roadmap

### Phase 1: Prototype (3 months)
- Core simulation engine
- Basic sketch rendering
- Act 1 components (potato → LED)
- Component personality system
- Basic UI

### Phase 2: Vertical Slice (3 months)
- Complete Act 1
- Polish gameplay loop
- Tutorial system
- **Challenge creation prototype**
- Audio/visual polish

### Phase 3: Alpha (6 months)
- Act 2 (relay logic)
- Historical challenges
- **Full Challenge Workshop**
- **Community features**
- Educator playtesting

### Phase 4: Beta (3 months)
- Act 3 (transistors/ICs)
- Sandbox mode
- **Challenge moderation**
- **Social features**
- Bug fixing

### Phase 5: Launch (1 month)
- Marketing push
- **50+ dev challenges**
- **Creator spotlight**
- Community building
- Post-launch support

**Total**: 16 months | **Team**: 2-4 people
- 1 Programmer (simulation + gameplay)
- 1 Artist (2D sketch + animation)
- 1 Designer (levels + UGC tools)
- 1 Community Manager (part-time)

---

## Risk Mitigation

### Risk: "Too educational, not fun"
**Mitigation**: 
- Gameplay first, education second
- No forced tutorials
- Cartoonish personality = playful
- Community challenges = endless variety

### Risk: "Too complex for casuals"
**Mitigation**:
- Gentle difficulty curve
- Sketch aesthetic reduces intimidation
- Optional hints always available
- Beginner challenges rated by community

### Risk: "Not educational enough"
**Mitigation**:
- Align with STEM standards
- Teacher resources
- Assessment tools
- Custom classroom challenges

### Risk: "UGC becomes low quality"
**Mitigation**:
- Auto-validation (must work)
- Community ratings
- Moderation tools
- Featured/curated highlights

---

## Visual Reference Examples

### Component Visual States (Sophisticated)
```
     ⚡ Battery States         💡 LED States
    ┌──────────┐             ┌─────┐
    │ ████████ │ Full        │ ≈≈≈ │ Bright
    │ ████████ │             │ ≈≈≈ │
    │   100%   │             │ ✧✧✧ │
    └──────────┘             └─────┘

    ┌──────────┐             ┌─────┐
    │ ███░░░░░ │ Medium      │ ··· │ Dim
    │ ███░░░░░ │             │ ··· │
    │   40%    │             │  ·  │
    └──────────┘             └─────┘

    ┌──────────┐             ┌─────┐
    │ ░░░░░░░░ │ Depleted    │     │ Off
    │ ░░░░░░░░ │             │     │
    │    0%    │             │     │
    └──────────┘             └─────┘
```

### Circuit Example (Professional Notebook Style)
```
    📔 Engineering Notebook - Entry 23
    ═══════════════════════════════════
    
    💡 Parallel Circuit Analysis
    
    ╭─────╮                    
    │ 🔋  │─┬─────●──[LED 1: 2.1V]
    │ 9V  │ │     │
    │100% │ └─────●──[LED 2: 2.1V]
    ╰─────╯       │
                  ●──[LED 3: 2.1V]
    
    ✏️ Measurements:
    - Voltage across each LED: ~2.1V
    - Current per branch: ~15mA
    - Total current draw: 45mA
    - If one LED fails, others continue
    
    💭 Application: Reliable lighting systems
    
    [Coffee ring stain] ☕
```

### Animation Sequence (Smooth Transitions)
```
LED Power-Up Sequence:

Frame 1:     Frame 2:     Frame 3:     Frame 4:
┌─────┐     ┌─────┐     ┌─────┐     ┌─────┐
│     │     │  ·  │     │ ··· │     │ ≈≈≈ │
│     │ --> │  ·  │ --> │ ··· │ --> │ ≈≈≈ │
│     │     │  ·  │     │ ··· │     │ ✧✧✧ │
└─────┘     └─────┘     └─────┘     └─────┘
  Off      Warming...   Glowing     Full
                                   *steady*

Current Flow Visualization:
───→ ───→ ───→ ───→ ───→
   ⚡  ⚡  ⚡  ⚡  ⚡
Smooth particle stream along traces
```

---

## Comparable Games

| Game | Similarity | Our Difference |
|------|-----------|----------------|
| Minecraft | Creative building | Real engineering education |
| Factorio | Complex systems | Electronics focus + history |
| Human Resource Machine | Programming education | Hardware, not software |
| Opus Magnum | Engineering puzzles | Open sandbox + learning |
| Shenzhen I/O | Circuit design | More accessible + UGC |
| Little Big Planet | UGC platformer | Educational circuits |
| Scribblenauts | Sketch aesthetic | Real physics simulation |

**Our USPs:**
1. Only game teaching real EE through play
2. Household items = tangible connection
3. Historical progression = engaging narrative
4. Professional sketch aesthetic = sophisticated yet approachable
5. Robust UGC = infinite content
6. Clear visual feedback without childishness
7. Both creative AND educational

---

## Closing Statement

**Circuit Quest** fills a unique gap in both gaming and education. The **hand-drawn sketch aesthetic** with sophisticated visual feedback makes circuits approachable without being childish, while the **robust user-generated challenge system** ensures endless replayability and a self-sustaining community.

Players don't just learn *about* computers - they experience the joy of *inventing* them, from potato batteries to processors. Then they share that joy by creating challenges for others.

**One sentence**: *A professionally illustrated educational sandbox where you build computers from potatoes to processors, then create and share circuit challenges with a global community of makers and engineers.*

---

## Next Steps

To move forward:

1. **Prototype Funding**: $20-40K for 3 months
2. **Team Assembly**: Developer, artist, educator
3. **Playtesting**: With students and teachers
4. **Partnership**: Educational institutions, maker communities

---

**Contact**: [Your Studio]  
**Date**: September 30, 2025  
**Version**: 2.0 (Complete with UGC & Sketch Aesthetic)

---

## Appendix: Technical Implementation

### Art Rendering
```javascript
// SVG filters for sketch effect
const sketchFilter = `
  <filter id="pencil">
    <feTurbulence baseFrequency="0.05"/>
    <feDisplacementMap scale="2"/>
  </filter>
  
  <filter id="wobble">
    <feTurbulence baseFrequency="0.02"/>
    <feDisplacementMap scale="3"/>
  </filter>
`;

// Component animation
class Component {
  animate() {
    // Bouncy placement
    this.scale.y = 1.2; // Squash
    setTimeout(() => this.scale.y = 0.9, 100);
    setTimeout(() => this.scale.y = 1.0, 200);
  }
}
```

### Challenge Data Structure
```javascript
interface Challenge {
  id: string;
  title: string;
  creator: string;
  difficulty: 1|2|3|4|5; // ⚡ count
  
  circuit: {
    components: Component[];
    connections: Wire[];
  };
  
  constraints: {
    maxComponents?: number;
    maxPower?: number;
    timeLimit?: number;
  };
  
  validation: {
    testCases: TestCase[];
    acceptance: (result) => boolean;
  };
  
  metadata: {
    attempts: number;
    completions: number;
    rating: number; // 0-5 stars
  };
}
```

### Component Visual System
```javascript
const COMPONENTS = {
  potato_battery: {
    sprite: '🥔',
    voltage: 0.9,
    visual: {
      chargeBar: true,
      glowIntensity: (charge) => charge * 0.5,
      states: ['full', 'medium', 'low', 'depleted'],
      getState(charge) {
        if (charge > 0.75) return 'full';
        if (charge > 0.5) return 'medium';
        if (charge > 0.25) return 'low';
        return 'depleted';
      }
    }
  },
  
  led: {
    sprite: '💡',
    visual: {
      brightness: (current) => Math.min(current / 0.020, 1.0),
      glowRadius: (brightness) => 5 + brightness * 15,
      colorGradient: ['#333', '#ff8800', '#ffff00'],
      pulseEffect: true
    }
  },
  
  relay: {
    sprite: '🔧',
    visual: {
      states: ['open', 'closed', 'switching'],
      switchAnimation: 'mechanical-spring',
      contactPosition: (state) => state === 'closed' ? 'down' : 'up',
      sparkEffect: true
    }
  }
};
```

---

**End of Document**