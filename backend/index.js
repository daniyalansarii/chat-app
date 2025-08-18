import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import authRouter from './routes/auth.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from './routes/user.routes.js'
import messageRouter from './routes/message.routes.js'
import { app, server, io } from './socket/socket.js'

dotenv.config()

const port = process.env.PORT || 5000

// ✅ Allow frontend access
app.use(cors({
    origin: "https://chat-appp-ktmw.onrender.com", // your frontend domain
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// ✅ Attach io so controllers can use it
app.set("io", io)

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/message", messageRouter)

server.listen(port, () => {
    connectDb()
    console.log(`✅ Server running on port ${port}`)
})
