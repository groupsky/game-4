# Circuit Quest: From Potatoes to Processors

An educational sandbox game where you build circuits from household items and watch them come to life with a hand-drawn sketchbook aesthetic.

## First Prototype Features

This initial prototype demonstrates:

- **Graph Paper Workspace** - Hand-drawn notebook interface with faint grid lines
- **Interactive Components** - Drag potato batteries and LEDs around the canvas
- **Circuit Simulation** - Real-time electrical simulation with voltage and current
- **Visual Feedback** - Components show state through visual indicators (charge bars, brightness, glow effects)
- **Wire Connections** - Connect components using Shift+Click to create circuits
- **Battery Drain** - Batteries lose charge over time when powering components

## How to Use

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### Controls

- **Click and Drag** - Move components around the workspace
- **Shift+Click** - Start a wire connection from a component
- **Shift+Click (second component)** - Complete the wire connection
- **Add Battery** - Click the "Add 🥔 Battery (5x)" button to add a 5-potato battery pack (4.5V)
- **Add LED** - Click the "Add 💡 LED" button to add an LED

### Try It Out

1. Add a battery to the workspace
2. Add an LED to the workspace
3. Hold Shift and click the battery
4. Hold Shift and click the LED to complete the wire
5. Watch the LED light up! ✨

The LED will glow based on the voltage:
- **Bright** - High voltage (>70% brightness)
- **Dim** - Medium voltage (30-70% brightness)
- **Faint** - Low voltage (<30% brightness)
- **Off** - Insufficient voltage or no connection

The battery charge bar shows remaining power, and drains slowly as it powers the LED.

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool with fast HMR
- **Vitest** - Unit testing
- **Canvas 2D API** - For rendering the hand-drawn circuit components

## Project Structure

```
src/
├── components/           # React components
│   ├── CircuitWorkspace.jsx  # Main circuit canvas and UI
│   └── CircuitWorkspace.css  # Styling
├── engine/              # Circuit simulation
│   ├── CircuitSimulator.js   # Physics engine
│   └── CircuitSimulator.test.js  # Unit tests
├── styles/              # Global styles
│   └── global.css       # Base styling and theme
└── test/                # Test setup
    └── setup.js         # Vitest configuration
```

## Next Steps

See [CONCEPT-PITCH.md](./CONCEPT-PITCH.md) for the full game vision, including:
- Additional components (resistors, capacitors, transistors)
- More sophisticated simulation (AC circuits, timing diagrams)
- User-generated challenges
- Historical progression (Maker Era → Machine Era → Silicon Era)
- SVG filters for enhanced sketch aesthetic

## Development

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm test:ui

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```
