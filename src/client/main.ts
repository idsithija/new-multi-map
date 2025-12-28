import { io, Socket } from "socket.io-client";
import { Game } from "./game/Game";

let game: Game | null = null;
let socket: Socket;

// Connect to server
socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

// Start game immediately
game = new Game(socket);
game.start();
