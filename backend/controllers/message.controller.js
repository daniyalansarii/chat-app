import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// 📩 Send a message
export const sendMessage = async (req, res) => {
  try {
    const receiverId = req.params.id; // receiver user ID
    const senderId = req.user._id;    // sender (from auth middleware)

    // create new message
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: req.body.message || "",
      image: req.file ? req.file.filename : null, // if using multer
    });

    // populate sender & receiver basic data
    await newMessage.populate("sender receiver", "name username image");

    // ✅ Emit socket event
    const io = req.app.get("io");
    if (io) {
      // send to both sender & receiver rooms
      io.to(senderId.toString()).emit("newMessage", newMessage);
      io.to(receiverId.toString()).emit("newMessage", newMessage);
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 📥 Get all messages with a specific user
export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const receiverId = req.params.id;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    }).populate("sender receiver", "name username image");

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
