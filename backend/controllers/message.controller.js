import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: req.body.message,
    });

    await newMessage.populate("sender receiver", "name username image");

    // ✅ use socket.io from app
    const io = req.app.get("io");
    if (io) {
      io.to(senderId.toString()).emit("newMessage", newMessage);
      io.to(receiverId.toString()).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
