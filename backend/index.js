import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";

// Configs
import connectDb from "./config/db.js";
import { initSocket } from "./socket/socket.js";

// Routes
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";

dotenv.config();
const app = express();

// ✅ Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// ✅ API Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

// ✅ Connect to MongoDB
connectDb();

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Initialize Socket.IO with modular logic
initSocket(server, process.env.FRONTEND_URL);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
