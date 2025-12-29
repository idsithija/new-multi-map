import { io, Socket } from "socket.io-client";
import { Game } from "./game/Game";

// Initialize the game
const game = new Game();
console.log("Game initialized");

let socket: Socket;

// Connect to server
socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
