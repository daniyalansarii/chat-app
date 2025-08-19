// src/backend/index.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";

// Routes
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";

// Socket.io
import { Server } from "socket.io";
import http from "http";

dotenv.config();
const app = express();

// Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

// Connect to DB
connectDb();

// Create HTTP server and socket.io instance
const server = http.createServer(app);
export const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
});

// Socket.io logic
let onlineUsers = [];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId && !onlineUsers.includes(userId)) {
    onlineUsers.push(userId);
  }

  io.emit("getOnlineUsers", onlineUsers);

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((id) => id !== userId);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
