# Battle Royale Web Game

A multiplayer battle royale web game built with Three.js, TypeScript, and Socket.IO.

## Features

- ✨ 3D graphics with Three.js
- 🎮 First-person shooter controls
- 🌐 Real-time multiplayer with Socket.IO
- ⚡ Physics simulation with Cannon.js
- 🎯 Player movement, jumping, and shooting mechanics
- 🏃 WASD movement controls
- 🖱️ Mouse look controls
- 💯 Health system
- 🎨 Dynamic lighting and shadows

## Tech Stack

- **Frontend**: Three.js, TypeScript, Vite
- **Backend**: Node.js, Express, Socket.IO
- **Physics**: Cannon-es
- **Build Tool**: Vite

## Installation

```bash
npm install
```

## Development

Run both client and server in development mode:

```bash
npm run dev
```

This will start:
- Client dev server on `http://localhost:3000`
- Game server on `http://localhost:3001`

Or run them separately:

```bash
# Client only
npm run dev:client

# Server only
npm run dev:server
```

## Build

```bash
npm run build
```

## Controls

- **WASD** - Move
- **Space** - Jump
- **Mouse** - Look around
- **Left Click** - Shoot
- **ESC** - Pause/Menu

## Project Structure

```
├── src/
│   ├── client/
│   │   ├── game/
│   │   │   ├── Game.ts          # Main game class
│   │   │   ├── Player.ts        # Player controller
│   │   │   └── InputManager.ts  # Input handling
│   │   └── main.ts              # Client entry point
│   └── server/
│       └── index.ts              # Server entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Next Steps

- [ ] Add weapon system
- [ ] Implement shooting mechanics
- [ ] Add player name tags
- [ ] Create safe zone/storm mechanics
- [ ] Add inventory system
- [ ] Implement loot drops
- [ ] Add minimap
- [ ] Create lobby system
- [ ] Add sound effects
- [ ] Improve terrain generation

## License

MIT
