# Circuit Quest - Act 1 Challenge Design

## Educational Goals
- Gradually introduce each component
- Teach fundamental circuit concepts
- Build complexity progressively
- Show why each component matters
- Create "aha!" moments when concepts click

## Challenge Progression

### 1. First Light (Tutorial)
**Components:** Battery + LED
**Concept:** Basic circuit connection
**Goal:** Connect LED directly to potato battery and make it glow
**Validation:** LED brightness >= 0.1

### 2. Current Control (Introduce Resistor)
**Components:** Battery + LED + Resistor
**Concept:** Current limiting, component protection
**Goal:** Add a resistor to protect the LED from burning out
**Teaching:** Show LED without resistor (very bright, hot) vs with resistor (stable, safe)
**Validation:**
- Has resistor in circuit
- LED brightness > 0.1
- LED brightness < 0.9 (not overdriven)

### 3. Power Up (Introduce Series Batteries)
**Components:** 2+ Batteries + LED + Resistor
**Concept:** Voltage addition in series
**Goal:** LED is too dim with one battery. Connect batteries in series to increase voltage
**Teaching:** More voltage = more brightness (but need resistor for control)
**Validation:**
- At least 2 batteries connected in series
- Total voltage >= 1.5V
- LED brightness >= 0.3

### 4. The Warm Glow (Introduce Light Bulb)
**Components:** 2+ Batteries + Light Bulb + Resistor
**Concept:** Power-hungry components, higher current draw
**Goal:** Light bulb needs more power than LED. Use series batteries to power it
**Teaching:** Different components need different amounts of power
**Validation:**
- Has light bulb
- Bulb brightness >= 0.2
- Total voltage >= 1.5V

### 5. Battery Blues (Teach Battery Drain)
**Components:** 2+ Batteries + Light Bulb
**Concept:** Battery depletion, power management
**Goal:** Keep light bulb lit for 30 seconds (batteries will drain!)
**Teaching:** High power draw = faster battery drain
**Challenge:** Need enough batteries in series to last 30 seconds
**Validation:**
- Bulb brightness >= 0.2 for continuous 30 seconds
- If batteries deplete, timer resets

### 6. Parallel Power (Introduce Parallel Batteries)
**Components:** 4+ Batteries (2 series pairs in parallel) + Light Bulb
**Concept:** Parallel batteries for longer runtime
**Goal:** Keep light bulb lit for 60 seconds using parallel battery banks
**Teaching:** Parallel doesn't increase voltage, but increases capacity (runtime)
**Validation:**
- At least 2 parallel branches of batteries
- Bulb brightness >= 0.2 for continuous 60 seconds
- Must survive the full minute

### 7. Double Bright (Introduce Parallel LEDs)
**Components:** Battery + 2 LEDs + Resistors
**Concept:** Parallel loads
**Goal:** Light up 2 LEDs in parallel from the same battery
**Teaching:** Parallel components share voltage but split current
**Validation:**
- At least 2 LEDs connected in parallel
- Both LEDs brightness >= 0.1
- Has resistors for current limiting

### 8. Energy Bank (Introduce Capacitor - Smoothing)
**Components:** Battery + Capacitor + LED + Resistor
**Concept:** Capacitor as energy buffer
**Goal:** Charge capacitor, then briefly disconnect battery to see LED stay lit
**Teaching:** Capacitor stores energy and releases it slowly
**Challenge:** Must demonstrate capacitor actually working
**Validation:**
- Has capacitor with voltage >= 1.5V
- LED stays lit briefly when battery removed
- Capacitor must be in circuit with LED

### 9. Flash Photography (Capacitor - Energy Burst)
**Components:** Multiple Batteries + Capacitor + Light Bulb
**Concept:** Capacitor discharge for high-power burst
**Goal:** Charge large capacitor from batteries, use it to briefly power light bulb at high brightness
**Teaching:** Capacitors can deliver power quickly
**Validation:**
- Capacitor charged to >= 2.5V
- Light bulb achieves brightness >= 0.5 for at least 1 second
- Demonstrates capacitor discharge

### 10. The Grand Circuit (Final Challenge)
**Components:** All components combined
**Concept:** Complete circuit design with all learned principles
**Goal:** Build a circuit that:
  - Uses series batteries for voltage (at least 2)
  - Has parallel battery banks for capacity (at least 2 branches)
  - Powers both LED and light bulb simultaneously
  - Uses resistors for current control
  - Has capacitor for power smoothing
  - Keeps everything running for 45 seconds
**Teaching:** Real circuits combine multiple concepts
**Validation:**
- At least 2 batteries in series
- At least 2 parallel battery branches
- Has both LED (brightness >= 0.1) and light bulb (brightness >= 0.2)
- Has at least 1 resistor
- Has capacitor (voltage >= 1.0V)
- Maintains power for 45 continuous seconds

## Validation Improvements Needed

### Capacitor Validation Issues
Current problem: Challenge passes even without capacitor doing anything useful
Fix needed: Require demonstrating capacitor behavior
- Challenge 8: Must show LED staying lit after battery disconnect
- Challenge 9: Must show capacitor discharge pattern

### Battery Drain Testing
Current problem: Need to actually test if batteries can survive duration
Fix needed: Simulate battery drain in real-time
- Track battery charge during timed challenges
- Reset timer if any critical component goes dim

### Component Requirement Checks
Need stricter validation:
- Verify components are actually connected in circuit (not just present)
- Check for proper series vs parallel topology
- Ensure resistors are actually in the current path

## Learning Curve
Easy → Medium → Hard
1. ✅ Basic connection (Tutorial)
2. ✅ Add one component
3. ✅ Voltage concept
4. ✅ Power concept
5. ⚡ Time pressure + drain
6. ⚡ Advanced topology
7. ✅ Parallel concept
8. ⚡ Capacitor utility
9. ⚡ Capacitor advanced
10. 🔥 Integration challenge

## Estimated Time to Complete
- Challenges 1-3: ~2 minutes each (tutorial pace)
- Challenges 4-7: ~3-5 minutes each (problem-solving)
- Challenges 8-9: ~5-7 minutes each (experimentation)
- Challenge 10: ~10-15 minutes (integration)
Total: ~45-60 minutes for Act 1
