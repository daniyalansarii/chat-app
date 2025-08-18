// routes/message.routes.js
import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import protect from "../middlewares/protect.js";
// if you use multer/cloudinary: import upload from "../middlewares/upload.js";

const router = express.Router();

// NOTE: param name is :receiver (used by controller)
router.post("/send/:receiver", protect, /* upload.single("image"), */ sendMessage);
router.get("/:receiver", protect, getMessages);

export default router;
