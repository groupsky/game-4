/**
 * ChallengeDefinitions - Data for all Act 1 challenges
 *
 * Contains challenge metadata: titles, descriptions, validators, star requirements
 * Separated from ChallengeSystem for better organization and maintainability
 */

import { ChallengeValidators } from './ChallengeValidators.js'

export function getChallengeDefinitions() {
  return [
    // === BASICS: Getting Started (1-5) ===
    // 1. Tutorial - Basic Connection
    {
      id: 'first-light',
      act: 1,
      title: '1. First Light',
      description: 'Connect an LED to a potato battery. Watch it glow! This is your first circuit.',
      unlocked: true,
      completed: false,
      validator: (circuit) => ChallengeValidators.validateFirstLight(circuit),
      stars: { optimalComponents: 2 }
    },
    // 2. Series Batteries (Introduce voltage boost)
    {
      id: 'power-up',
      act: 1,
      title: '2. Power Up',
      description: 'One battery is too weak. Connect 2 or more batteries in series (end-to-end) to increase voltage and make your LED brighter!',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validatePowerUp(circuit),
      stars: { optimalComponents: 3 }
    },
    // 3. Introduce Resistor (After seeing over-bright LED)
    {
      id: 'current-control',
      act: 1,
      title: '3. Current Control',
      description: 'Your LED is TOO bright now! Add a resistor to control the current and protect your LED from burning out.',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validateCurrentControl(circuit),
      stars: { optimalComponents: 4 }
    },
    // 4. Introduce Light Bulb
    {
      id: 'warm-glow',
      act: 1,
      title: '4. The Warm Glow',
      description: 'Light bulbs need more power than LEDs. Use series batteries to power a light bulb.',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validateWarmGlow(circuit),
      stars: { optimalComponents: 3 } // 2 batteries + 1 bulb
    },
    // 5. Battery Drain (30s)
    {
      id: 'battery-blues',
      act: 1,
      title: '5. Battery Blues',
      description: 'Light bulbs drain batteries fast! Keep one lit for 30 seconds. You\'ll need enough batteries to last.',
      unlocked: false,
      completed: false,
      requiresTime: true,
      goalTime: 30,
      validator: (circuit) => ChallengeValidators.validateBatteryBlues(circuit),
      stars: { optimalComponents: 4, optimalTime: 30 } // 3 batteries + 1 bulb, ≤33s
    },
    // 6. Parallel Batteries
    {
      id: 'parallel-power',
      act: 1,
      title: '6. Parallel Power',
      description: 'To last longer, connect battery pairs in parallel (side-by-side). This increases capacity, not voltage. Keep the bulb lit for 60 seconds!',
      unlocked: false,
      completed: false,
      requiresTime: true,
      goalTime: 60,
      validator: (circuit) => ChallengeValidators.validateParallelPower(circuit),
      stars: { optimalComponents: 5, optimalTime: 60 } // 4 batteries + 1 bulb
    },
    // 7. Parallel LEDs
    {
      id: 'double-bright',
      act: 1,
      title: '7. Double Bright',
      description: 'Light up 2 LEDs at once using parallel connections. Each LED needs its own resistor!',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validateDoubleBright(circuit),
      stars: { optimalComponents: 5 } // 2 batteries + 2 LEDs + 2 resistors (1 per LED)
    },

    // === CAPACITORS: Energy Storage (8-11, 16, 22-23, 27) ===
    // 8. Introduce Capacitor
    {
      id: 'energy-bank',
      act: 1,
      title: '8. Energy Bank',
      description: 'Capacitors store energy! Connect a capacitor in parallel with your LED and battery. Watch it charge up and smooth the power.',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validateEnergyBank(circuit),
      stars: { optimalComponents: 4 } // 2 batteries + 1 capacitor + 1 LED
    },
    // 9. Capacitor Power
    {
      id: 'capacitor-power',
      act: 1,
      title: '9. Capacitor Power',
      description: 'A charged capacitor can power an LED temporarily. Connect a capacitor, battery, and LED in parallel.',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validateCapacitorPower(circuit),
      stars: { optimalComponents: 3 }
    },
    // 10. Capacitor Bank
    {
      id: 'capacitor-bank',
      act: 1,
      title: '10. Capacitor Bank',
      description: 'Use multiple capacitors in parallel to store even more energy! Connect 2+ capacitors with batteries and an LED.',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validateCapNetwork(circuit),
      stars: { optimalComponents: 5 }
    },
    // 11. Energy Storage Mastery (same as 8, demonstrates understanding)
    {
      id: 'energy-storage-mastery',
      act: 1,
      title: '11. Energy Storage Mastery',
      description: 'Show your mastery! Build another energy storage circuit with capacitors and batteries powering an LED.',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validateEnergyBank(circuit),
      stars: { optimalComponents: 4 }
    },

    // === LEDS: Multiple Lights and Brightness (12-14, 18, 24, 26, 30) ===
    // 12. Triple Chain
    {
      id: 'triple-chain',
      act: 1,
      title: '12. Triple Chain',
      description: 'Connect 3 LEDs in series. Notice how the brightness dims because the same current flows through all of them!',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validateTripleChain(circuit),
      stars: { optimalComponents: 6 } // 3 batteries + 3 LEDs
    },
    // 13. LED Array
    {
      id: 'led-array',
      act: 1,
      title: '13. LED Array',
      description: 'Create a 3x3 grid of 9 LEDs! Use parallel connections to light them all evenly.',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validateLEDArray(circuit),
      stars: { optimalComponents: 12 } // 3 batteries + 9 LEDs
    },
    // 14. Voltage Divider
    {
      id: 'voltage-divider',
      act: 1,
      title: '14. Voltage Divider',
      description: 'Use 2 resistors to reduce voltage for an LED. Connect resistors in series - the LED gets a fraction of the total voltage!',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validateVoltageDivide(circuit),
      stars: { optimalComponents: 5 }
    },

    // === BATTERIES: Longevity and Efficiency (15, 17, 19-20, 28-29) ===
    // 15. Endurance Challenge (60s)
    {
      id: 'endurance',
      act: 1,
      title: '15. Endurance',
      description: 'Keep 2 LEDs lit for 60 seconds using efficient battery engineering!',
      unlocked: false,
      completed: false,
      requiresTime: true,
      goalTime: 60,
      validator: (circuit) => ChallengeValidators.validateEndurance(circuit),
      stars: { optimalComponents: 10, optimalTime: 60 }
    },
    // 16. RC Timing
    {
      id: 'rc-timing',
      act: 1,
      title: '16. RC Timing',
      description: 'Create an RC circuit! Use a resistor and capacitor together to control timing. The LED will fade as the capacitor discharges.',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validateRCTiming(circuit),
      stars: { optimalComponents: 5 }
    },
    // 17. Efficiency Challenge
    {
      id: 'power-efficiency',
      act: 1,
      title: '17. Power Efficiency',
      description: 'Light an LED using ONLY 1 battery! You\'ll need the perfect resistor to make it work efficiently.',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validateEfficiency(circuit),
      stars: { optimalComponents: 3 }
    },
    // 18. Max Brightness (without burning out)
    {
      id: 'max-brightness',
      act: 1,
      title: '18. Maximum Brightness',
      description: 'Get your LED as bright as possible without burning it out! Use batteries, resistors, and careful calculation.',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validateMaxBright(circuit),
      stars: { optimalComponents: 5 }
    },
    // 19. Battery Bank
    {
      id: 'battery-bank',
      act: 1,
      title: '19. Battery Bank',
      description: 'Build a 3x3 battery bank (9 batteries) using series and parallel connections to power an LED efficiently.',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validateBatteryBank(circuit),
      stars: { optimalComponents: 10 }
    },
    // 20. Marathon Challenge
    {
      id: 'marathon',
      act: 1,
      title: '20. Marathon',
      description: 'Keep a light bulb lit for 60 seconds using your battery bank design!',
      unlocked: false,
      completed: false,
      requiresTime: true,
      goalTime: 60,
      validator: (circuit) => ChallengeValidators.validateMarathon(circuit),
      stars: { optimalComponents: 7, optimalTime: 60 }
    },

    // === MIXED: Complex Circuits (21, 25) ===
    // 21. Dual Power
    {
      id: 'dual-power',
      act: 1,
      title: '21. Dual Power',
      description: 'Power both an LED and a light bulb from the same battery source. Balance the current!',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validateDualPower(circuit),
      stars: { optimalComponents: 5 }
    },
    // 22. Capacitor Network (same as 10)
    {
      id: 'capacitor-network',
      act: 1,
      title: '22. Capacitor Network',
      description: 'Master capacitor networks! Build a parallel capacitor bank to maximize energy storage.',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validateCapNetwork(circuit),
      stars: { optimalComponents: 5 }
    },
    // 23. Series Capacitors
    {
      id: 'series-capacitors',
      act: 1,
      title: '23. Series Capacitors',
      description: 'Connect capacitors in series. Notice how the total capacitance decreases but voltage rating increases!',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validateSeriesCaps(circuit),
      stars: { optimalComponents: 5 }
    },
    // 24. Mixed Load
    {
      id: 'mixed-load',
      act: 1,
      title: '24. Mixed Load',
      description: 'Combine series and parallel LED connections in one circuit. Light at least 3 LEDs with different brightness levels!',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validateMixedLoad(circuit),
      stars: { optimalComponents: 7 }
    },
    // 25. Resistor Ladder
    {
      id: 'resistor-ladder',
      act: 1,
      title: '25. Resistor Ladder',
      description: 'Build a resistor ladder network with 3+ resistors in series to create precise voltage steps.',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validateResistorLadder(circuit),
      stars: { optimalComponents: 6 }
    },
    // 26. Power Distribution
    {
      id: 'power-distribution',
      act: 1,
      title: '26. Power Distribution',
      description: 'Create a power distribution network! Use parallel branches to power 3 separate LED circuits from one battery source.',
      unlocked: false,
      completed: false,
      validator: (circuit) => ChallengeValidators.validatePowerDist(circuit),
      stars: { optimalComponents: 9 }
    },
    // 27. Sustained Flash
    {
      id: 'sustained-flash',
      act: 1,
      title: '27. Sustained Flash',
      description: 'Use batteries and capacitors together to power a bulb for 45 seconds!',
      unlocked: false,
      completed: false,
      requiresTime: true,
      goalTime: 45,
      validator: (circuit) => ChallengeValidators.validateSustainedFlash(circuit),
      stars: { optimalComponents: 6, optimalTime: 45 }
    },
    // 28. Efficiency Master
    {
      id: 'efficiency-master',
      act: 1,
      title: '28. Efficiency Master',
      description: 'Light 3 LEDs for 60 seconds using only 3 batteries. No waste!',
      unlocked: false,
      completed: false,
      requiresTime: true,
      goalTime: 60,
      validator: (circuit) => ChallengeValidators.validateEfficiencyMaster(circuit),
      stars: { optimalComponents: 6, optimalTime: 60 }
    },
    // 29. Grand Circuit (60s timed challenge)
    {
      id: 'grand-circuit',
      act: 1,
      title: '29. The Grand Circuit',
      description: 'Build the ultimate circuit: series batteries for voltage, parallel banks for capacity, power both LED and bulb, use resistors for control, add a capacitor for smoothing. Keep it running for 60 seconds!',
      unlocked: false,
      completed: false,
      requiresTime: true,
      goalTime: 60,
      validator: (circuit) => ChallengeValidators.validateGrandCircuit(circuit),
      stars: { optimalComponents: 12, optimalTime: 60 }
    },
    // 30. Master Inventor
    {
      id: 'master-inventor',
      act: 1,
      title: '30. Master Inventor',
      description: 'The final test: Build ANY circuit that lights 5+ components and runs for 60 seconds. Show your mastery!',
      unlocked: false,
      completed: false,
      requiresTime: true,
      goalTime: 60,
      validator: (circuit) => ChallengeValidators.validateMasterInventor(circuit),
      stars: { optimalComponents: 15, optimalTime: 60 }
    }
  ]
}
