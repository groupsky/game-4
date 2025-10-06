# Challenge Progression Guide

## Overview

This document outlines the pedagogical progression of Circuit Quest's 30 challenges in Act 1 (Maker Era). Each challenge introduces ONE new concept while building on previously learned skills.

## Design Principles

1. **One New Thing Per Challenge**: Each challenge introduces exactly one new component, concept, or constraint
2. **Strict Progression**: Solutions from Challenge N should NOT pass validation for Challenge N+1
3. **Validated Difficulty**: All challenges have verified optimal solutions that achieve 3-star ratings
4. **Progressive Complexity**: Challenges build from simple (2 components) to complex (15 components)

## Challenge Categories

### Basic Components (Challenges 1-4)
**Purpose**: Introduce fundamental components and voltage concepts

1. **First Light** (2 components)
   - **New**: Battery + LED basics
   - **Optimal**: 1 battery + 1 LED
   - **Key Concept**: Basic circuit connectivity

2. **Power Up** (3 components)
   - **New**: Series batteries (voltage addition)
   - **Optimal**: 2 batteries + 1 LED
   - **Key Concept**: V_total = V1 + V2 + ...
   - **Progression**: Requires 2+ batteries; Challenge 1 solution (1 battery) fails

3. **Current Control** (4 components)
   - **New**: Resistors (current limiting)
   - **Optimal**: 2 batteries + 1 resistor + 1 LED
   - **Key Concept**: Protecting LEDs from over-voltage
   - **Progression**: Requires resistor; Challenge 2 solution (no resistor) fails

4. **The Warm Glow** (4 components)
   - **New**: Light bulbs (higher voltage requirement)
   - **Optimal**: 3 batteries + 1 bulb
   - **Key Concept**: Different components need different voltages
   - **Validation**: Bulb needs ≥2.5V (3 batteries minimum)

### Battery Longevity (Challenges 5-6, 15, 20, 28-29)
**Purpose**: Introduce time constraints and capacity concepts

5. **Battery Blues** (4 components, 30s timed)
   - **New**: First timed challenge
   - **Optimal**: 3 batteries + 1 bulb
   - **Key Concept**: Batteries drain over time

6. **Parallel Power** (5 components, 60s timed)
   - **New**: Parallel batteries (capacity without voltage increase)
   - **Optimal**: 4 batteries + 1 bulb
   - **Key Concept**: Parallel = more capacity, series = more voltage

15. **Endurance** (10 components, 60s timed)
   - **New**: Extended duration challenge
   - **Optimal**: 8 batteries + 2 LEDs
   - **Key Concept**: Efficient battery topology

20. **Marathon** (7 components, 60s timed)
   - **New**: Battery bank optimization
   - **Optimal**: 6 batteries + 1 bulb
   - **Key Concept**: Long-duration power delivery

28. **Efficiency Master** (6 components, 60s timed)
   - **New**: Constrained battery count (exactly 3)
   - **Optimal**: 3 batteries + 3 LEDs
   - **Key Concept**: Maximum efficiency with minimal batteries

29. **Grand Circuit** (12 components, 60s timed)
   - **New**: All concepts combined
   - **Optimal**: Complex mixed topology
   - **Key Concept**: Mastery demonstration

### Parallel Circuits (Challenges 7, 13, 24, 26)
**Purpose**: Teach parallel vs series LED configurations

7. **Double Bright** (6 components)
   - **New**: Parallel LEDs
   - **Optimal**: 2 batteries + 2 resistors + 2 LEDs
   - **Key Concept**: Each parallel branch needs current limiting
   - **Technical**: 2 series batteries (1.8V) to power parallel LEDs

13. **LED Array** (12 components)
   - **New**: Large-scale parallel (3x3 grid)
   - **Optimal**: 3 batteries + 9 LEDs
   - **Key Concept**: Parallel scaling

24. **Mixed Load** (7 components)
   - **New**: Series AND parallel LEDs in same circuit
   - **Optimal**: 4 batteries + 3 LEDs (2 series + 1 parallel)
   - **Key Concept**: Hybrid topologies

26. **Power Distribution** (9 components)
   - **New**: Multiple parallel branches
   - **Optimal**: 3 batteries + 3 resistors + 3 LEDs
   - **Key Concept**: Power distribution networks

### Capacitors (Challenges 8-11, 16, 22-23, 27)
**Purpose**: Introduce energy storage and RC circuits

8. **Energy Bank** (4 components)
   - **New**: Capacitors (energy storage)
   - **Optimal**: 2 batteries + 1 capacitor + 1 LED
   - **Key Concept**: Charging and discharging
   - **Validation**: Capacitor must reach 1.5V

9. **Capacitor Power** (3 components)
   - **New**: Efficient capacitor use (1 battery only)
   - **Optimal**: 1 battery + 1 capacitor + 1 LED
   - **Key Concept**: Minimal power, maximum effect
   - **Progression**: Requires exactly 1 battery; Challenge 8 solution (2 batteries) fails

10. **Capacitor Bank** (5 components)
   - **New**: Parallel capacitors
   - **Optimal**: 2 batteries + 2 capacitors + 1 LED
   - **Key Concept**: C_total = C1 + C2 (parallel)

11. **Energy Storage Mastery** (4 components)
   - **New**: Mastery demonstration
   - **Optimal**: 2 batteries + 1 capacitor + 1 LED
   - **Key Concept**: Same as Challenge 8, validates understanding

16. **RC Timing** (5 components)
   - **New**: Resistor-Capacitor time constants
   - **Optimal**: 2 batteries + 1 capacitor + 1 resistor + 1 LED
   - **Key Concept**: τ = R × C
   - **Technical**: Requires 100 simulation steps (10s) to charge 100mF capacitor

22. **Capacitor Network** (5 components)
   - **New**: Parallel capacitor networks
   - **Optimal**: 2 batteries + 2 capacitors + 1 LED
   - **Key Concept**: Maximizing energy storage

23. **Series Capacitors** (5 components)
   - **New**: Series capacitors (voltage division)
   - **Optimal**: 2 batteries + 2 capacitors + 1 LED
   - **Key Concept**: 1/C_total = 1/C1 + 1/C2

27. **Sustained Flash** (6 components, 45s timed)
   - **New**: Batteries + capacitors for duration
   - **Optimal**: Combined battery-capacitor topology
   - **Key Concept**: Hybrid energy systems

### Series Circuits (Challenges 12, 14, 25)
**Purpose**: Teach series resistance and voltage division

12. **Triple Chain** (6 components)
   - **New**: Multiple LEDs in series
   - **Optimal**: 3 batteries + 3 LEDs
   - **Key Concept**: Voltage division across series components

14. **Voltage Divider** (6 components)
   - **New**: Resistor voltage division
   - **Optimal**: 3 batteries + 2 resistors + 1 LED
   - **Key Concept**: V_out = V_in × R2/(R1+R2)

25. **Resistor Ladder** (6 components)
   - **New**: Multiple series resistors
   - **Optimal**: 2 batteries + 3 resistors + 1 LED
   - **Key Concept**: R_total = R1 + R2 + R3

### Efficiency & Optimization (Challenges 17-19, 21)
**Purpose**: Teach efficiency and component optimization

17. **Power Efficiency** (3 components)
   - **New**: Minimal component constraint
   - **Optimal**: 1 battery + 1 resistor + 1 LED
   - **Key Concept**: Maximum efficiency
   - **Validation**: Exactly 1 battery required

18. **Maximum Brightness** (5 components)
   - **New**: Optimization challenge
   - **Optimal**: 3 batteries + 1 resistor + 1 LED
   - **Key Concept**: Balancing brightness vs safety

19. **Battery Bank** (10 components)
   - **New**: 3x3 battery topology
   - **Optimal**: 9 batteries + 1 LED
   - **Key Concept**: Series chains in parallel
   - **Validation**: Requires exactly 9 batteries

21. **Dual Power** (5 components)
   - **New**: Powering different component types
   - **Optimal**: 3 batteries + 1 LED + 1 bulb
   - **Key Concept**: Different loads in parallel

### Final Challenges (Challenge 30)
**Purpose**: Demonstrate mastery of all concepts

30. **Master Inventor** (15 components, 60s timed)
   - **New**: Open-ended mastery test
   - **Optimal**: Any circuit with 5+ lit components for 60s
   - **Key Concept**: Creative circuit design

## Star Rating System

### Component Efficiency
- **3 Stars**: ≤ optimal components AND (no time limit OR ≤110% time)
- **2 Stars**: ≤ optimal + 2 components
- **1 Star**: Any working solution

### Examples
- Challenge 1 (optimal: 2)
  - 1-2 components = 3 stars
  - 3-4 components = 2 stars
  - 5+ components = 1 star

- Challenge 5 (optimal: 4, time: 30s)
  - 4 components + ≤33s = 3 stars
  - 4 components + >33s = 2 stars
  - 5-6 components + any time = 2 stars
  - 7+ components = 1 star

## Uniqueness Validation

The test suite includes `ChallengeUniqueness.test.js` which verifies:

1. Challenge 1 → Challenge 2: Adding more batteries required
2. Challenge 2 → Challenge 3: Adding resistor required
3. Challenge 8 → Challenge 9: Reducing to 1 battery required

This ensures challenges teach progression, not repetition.

## Test Coverage

- **Total Challenges**: 30
- **Star Rating Validated**: 22/30 (73%)
  - All non-timed challenges validated
  - Timed challenges require manual testing due to duration constraints
- **Validated Challenges**: 1-4, 7-14, 16-19, 21-26
- **Remaining**: 5, 6, 15, 20, 27-30 (all timed challenges)

## Component Counts Summary

| Challenge | ID | Components | Type | Concept |
|-----------|-----|------------|------|---------|
| 1 | first-light | 2 | Basic | Battery + LED |
| 2 | power-up | 3 | Basic | Series batteries |
| 3 | current-control | 4 | Basic | Resistors |
| 4 | warm-glow | 4 | Basic | Light bulbs |
| 5 | battery-blues | 4 | Timed | Battery drain (30s) |
| 6 | parallel-power | 5 | Timed | Parallel batteries (60s) |
| 7 | double-bright | 6 | Parallel | Parallel LEDs |
| 8 | energy-bank | 4 | Capacitor | Basic capacitor |
| 9 | capacitor-power | 3 | Capacitor | Efficient capacitor |
| 10 | capacitor-bank | 5 | Capacitor | Parallel capacitors |
| 11 | energy-storage-mastery | 4 | Capacitor | Mastery |
| 12 | triple-chain | 6 | Series | Series LEDs |
| 13 | led-array | 12 | Parallel | 3x3 LED grid |
| 14 | voltage-divider | 6 | Series | Resistor divider |
| 15 | endurance | 10 | Timed | 2 LEDs (60s) |
| 16 | rc-timing | 5 | Capacitor | RC circuits |
| 17 | power-efficiency | 3 | Efficiency | 1 battery limit |
| 18 | max-brightness | 5 | Efficiency | Brightness optimization |
| 19 | battery-bank | 10 | Efficiency | 3x3 battery grid |
| 20 | marathon | 7 | Timed | Bulb (60s) |
| 21 | dual-power | 5 | Efficiency | LED + bulb |
| 22 | capacitor-network | 5 | Capacitor | Parallel caps |
| 23 | series-capacitors | 5 | Capacitor | Series caps |
| 24 | mixed-load | 7 | Parallel | Mixed topology |
| 25 | resistor-ladder | 6 | Series | Series resistors |
| 26 | power-distribution | 9 | Parallel | Power network |
| 27 | sustained-flash | 6 | Timed | Caps + batteries (45s) |
| 28 | efficiency-master | 6 | Timed | 3 batteries limit (60s) |
| 29 | grand-circuit | 12 | Timed | All concepts (60s) |
| 30 | master-inventor | 15 | Timed | Open-ended (60s) |

## Implementation Notes

### Capacitor Charging
- Regular capacitors: 20 simulation steps (2 seconds) to reach required voltage
- RC circuits: 100 simulation steps (10 seconds) for 100mF capacitors
- This difference reflects real-world RC time constants

### Battery Topology
- Single series chain: V_total = Σ V_i
- Parallel chains: V_total = max(chain voltages), I_total = Σ I_chain
- Each battery in a chain drains at I_chain / n_parallel rate

### Validation Strategy
- Non-timed: Immediate validation after circuit simulation
- Timed: Return `tracking: true` to enable time tracking
- Component checks happen first, then time validation

## Future Enhancements

1. Add star rating validation for timed challenges (require duration simulation)
2. Implement challenge hints system
3. Add progressive unlock animations
4. Create challenge solution replay system
5. Add "perfect run" achievements for 3-starring all challenges in a category
