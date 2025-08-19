import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/upload.js"; // ✅ make sure this path is correct

const router = express.Router();

// ✅ Enable multer for image + message
router.post("/send/:receiver", isAuth, upload.single("image"), sendMessage);
router.get("/:receiver", isAuth, getMessages);

export default router;
