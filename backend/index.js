// index.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";

import { app, server, io } from "./socket/socket.js";

dotenv.config();

const port = process.env.PORT || 5000;

// CORS for your deployed frontend
app.use(
  cors({
    origin: "https://chat-appp-ktmw.onrender.com",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Health check (super helpful on Render)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

server.listen(port, () => {
  connectDb();
  console.log(`✅ Server running on ${port}`);
});
