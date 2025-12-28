import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = 3001;

interface Player {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: number;
  health: number;
}

const players = new Map<string, Player>();

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  
  socket.on('joinGame', () => {
    // Add new player
    players.set(socket.id, {
      id: socket.id,
      position: { x: 0, y: 5, z: 0 },
      rotation: 0,
      health: 100
    });
    
    // Notify all clients about player count
    io.emit('playerCount', players.size);
    
    // Send current players to new player
    socket.emit('currentPlayers', Array.from(players.values()));
    
    // Notify others about new player
    socket.broadcast.emit('playerJoined', {
      id: socket.id,
      position: { x: 0, y: 5, z: 0 },
      rotation: 0
    });
    
    console.log(`Player joined game: ${socket.id}. Total players: ${players.size}`);
  });
  
  socket.on('playerUpdate', (data: { position: { x: number; y: number; z: number }; rotation: number }) => {
    const player = players.get(socket.id);
    if (player) {
      player.position = data.position;
      player.rotation = data.rotation;
      
      // Broadcast to other players
      socket.broadcast.emit('playerMoved', {
        id: socket.id,
        position: data.position,
        rotation: data.rotation
      });
    }
  });
  
  socket.on('playerShoot', () => {
    // Handle shooting
    socket.broadcast.emit('playerShot', { id: socket.id });
  });
  
  socket.on('disconnect', () => {
    players.delete(socket.id);
    io.emit('playerCount', players.size);
    io.emit('playerLeft', socket.id);
    console.log(`Player disconnected: ${socket.id}. Total players: ${players.size}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Waiting for players to connect...`);
});
