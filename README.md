# Snake & Ladders - Modern Web Implementation

<div align="center">

<img src="assets/images/game-icon-gameBoardScreen-alt.jpg" alt="Snake & Ladders" width="700" height="700">

**A feature-rich, browser-based implementation of the classic board game with modern enhancements**

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://snake-ladders-js.netlify.app)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

**[Play Now](https://snake-ladders-js.netlify.app)** | [Documentation](#documentation) | [Architecture](#architecture)

</div>

---

## Overview

A fully-featured Snake & Ladders game built with vanilla JavaScript, featuring persistent state management, challenge modes, power-up systems, and responsive design. Developed as a comprehensive college project demonstrating modern web development practices.

### Key Features

- **2-4 Player Support** with customizable avatars
- **Auto-Save System** using LocalStorage API
- **Power-Up Cards** for strategic gameplay
- **Challenge Modes** (No Stack, Chaos Shuffle, Elimination, No Power-Ups)
- **Audio System** with SFX and background music
- **Responsive Design** for desktop and mobile
- **Persistent Leaderboard** tracking player rankings

---

## Quick Start

### Play Online
**[https://snake-ladders-js.netlify.app](https://snake-ladders-js.netlify.app)**

### Local Installation

```bash
# Clone repository
git clone https://github.com/yourusername/snake-ladders-js.git
cd snake-ladders-js

# Open in browser
open html/welcome.html

# Or serve locally
python -m http.server 8000
# Navigate to http://localhost:8000/html/welcome.html
```

---

## Project Structure

```
snake-ladders-js/
├── html/                    # Application pages
│   ├── welcome.html         # Landing page
│   ├── home.html           # Player configuration
│   ├── game-board.html     # Main game interface
│   ├── leaderboard.html    # Rankings display
│   └── instructions.html   # Game rules
├── css/                     # Stylesheets
│   ├── global.css          # Unified theme system
│   ├── game-board.css      # Board layout
│   └── ...
├── js/
│   ├── game-logic/         # Core game engine
│   │   ├── game.js         # Game orchestration
│   │   ├── grid.js         # Board management
│   │   ├── player.js       # Player state
│   │   ├── tiles/          # Tile implementations
│   │   └── cards/          # Card implementations
│   ├── pages/              # UI controllers
│   └── utils/              # Helper modules
└── assets/                 # Media resources
    ├── images/
    └── audio/
```

---

## Architecture

### Core Design Pattern

The application follows a **Model-View-Controller (MVC)** architecture with clear separation of concerns:

**Model** (`game-logic/`) - Pure game logic, no DOM dependencies
- **Game Class**: State management, turn flow, win conditions
- **Grid Class**: Board representation, movement calculations
- **PlayerGameData**: Player state encapsulation

**View** (`html/` + `css/`) - User interface presentation

**Controller** (`pages/`) - DOM manipulation, event handling, state synchronization

### Class Hierarchy

```javascript
// Core Game Engine
Game
├── manages → Grid (10×10 board)
├── manages → PlayerGameData[] (player states)
├── manages → CyclicQueue (turn order)
└── manages → Challenge Rules

// Tile System (Polymorphism)
Tile (abstract)
├── PortalTile (snakes & ladders)
└── CardTile (power-up pickups)

// Card System (Strategy Pattern)
Card (abstract)
├── JumpCard (movement)
└── SwapCard (position exchange)
```

### Core Algorithms

**Coordinate System Transformation**

The grid uses a flattened representation for movement calculations, converting between 2D board positions and 1D linear distances:

- **2D to 1D**: `distance = x + (y × width)`
- **1D to 2D**: `x = distance % width`, `y = ⌊distance / width⌋`
- **Zigzag Adjustment**: Odd rows reverse x-coordinate to match traditional board layout

**Turn Order Management**

Implements a circular queue that maintains player sequence while handling dynamic removal (winners/eliminated players) without breaking the turn cycle.

---

## Documentation

### Game Rules

1. **Setup**: 2-4 players, unique names and avatars
2. **Objective**: First player to reach square 100 wins
3. **Movement**: Roll dice (1-6), move forward automatically
4. **Ladders**: Climb to higher squares instantly
5. **Snakes**: Slide down to lower squares
6. **Cards**: Collect and use strategically (max 3 per player)
7. **Winning**: Must land exactly on square 100

### Challenge Modes

| Mode | Description | Technical Implementation |
|------|-------------|-------------------------|
| **No Stack** | Players cannot occupy same square | `enforceNoOverlap()` in `game.js` |
| **Chaos Shuffle** | Positions randomize each round | `Array.sort()` on `activeQueue` |
| **No Power-Ups** | Disables card pickups | Conditional `CardTile` placement |
| **Elimination** | Rising danger line removes players | Threshold check in `updateQueues()` |

### API Reference

**Game Class**
```javascript
class Game {
  constructor(playerIds, grid, shuffle, noOverlap)
  playTurn()                    // Execute complete turn
  advancePlayer(id, steps)      // Move player forward
  processEffects(id, tile)      // Apply tile effects
  updateQueues()                // Check wins, switch turns
  toJson() / fromJson(data)     // State serialization
}
```

**Grid Class**
```javascript
class Grid {
  constructor(width, height)
  advance(player, amount)       // Calculate new position
  addTile(tile, position)       // Place snake/ladder
  getTile(position)             // Retrieve tile at square
}
```

---

## Technical Highlights

### State Persistence
Implements custom serialization for nested game state, preserving player positions, card inventories, and turn order across browser sessions.

### Audio Management
Utilizes Web Audio API with lazy loading, preloaded buffers, and localStorage-based preference persistence for optimal performance.

### Responsive Architecture
Mobile-first CSS with breakpoint-specific layouts, flexbox reordering, and touch-optimized controls for cross-device compatibility.

### Modern CSS Implementation
Leverages CSS custom properties for dynamic theming, CSS Grid for layout systems, and hardware-accelerated transforms for smooth animations.

---

## Development

### Prerequisites
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- Optional: Local server for CORS compliance

### Adding Custom Content

**New Snake/Ladder**
```javascript
// In game-board.js
[[40, 2], [4, 23]].forEach(([start, end]) => {
  grid.addTile(new PortalTile(
    grid.distToPoint(start - 1),
    grid.distToPoint(end - 1)
  ))
})
```

**New Card Type**
```javascript
// Create cards/customCard.js
export default class CustomCard extends Card {
  effect(game, player) {
    // Implementation
  }
  get name() { return "Card Name" }
}

// Register in all-cards.js
import CustomCard from "./cards/customCard.js"
export const allCards = [
  [CustomCard, [params], "icon.png", "Description"]
]
```

---

## Known Limitations

- **Browser Storage**: 5-10MB limit (sufficient for game state)
- **Safari Autoplay**: Audio may require initial user interaction
- **Mobile Scrolling**: Horizontal scroll required for game board on small screens (<600px)

---

## Future Roadmap

- [ ] AI opponent implementation
- [ ] WebSocket multiplayer
- [ ] Progressive Web App (PWA) support
- [ ] Custom board editor
- [ ] Extended statistics dashboard
- [ ] Achievement system

---

## Contributors

<div align="center">

### Development Team

**Mohamed Abdel-haq** • **Haneen Elasawy** • **Zeyad Hesham**

**Andrew Emad** • **Hashim Abdelaziz**

</div>

---

## License

MIT License - Copyright (c) 2025 Snake & Ladders Team

---

## Acknowledgments

- Classic Snake & Ladders game mechanics
- ES6 module system and modern JavaScript patterns
- Web Audio API for sound implementation
- LocalStorage API for state persistence

---

<div align="center">

**[Live Demo](https://snake-ladders-js.netlify.app)** • **[Report Issue](https://github.com/yourusername/snake-ladders-js/issues)** • **[Request Feature](https://github.com/yourusername/snake-ladders-js/issues)**

Made with precision by the Snake & Ladders Team

</div>