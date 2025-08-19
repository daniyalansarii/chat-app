import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const sender = req.userId; // set by auth middleware
    const receiver = req.params.receiver;
    const { message } = req.body;

    let imageUrl = null;
    if (req.file) {
      const uploaded = await uploadOnCloudinary(req.file.path);
      imageUrl = uploaded?.secure_url || null;
    }

    // Create new message
    const newMessage = await Message.create({
      sender,
      receiver,
      message,
      image: imageUrl,
    });

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    // Emit to receiver if online
    const receiverSocketId = getReceiverSocketId(receiver.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Emit to sender for instant UI update
    const senderSocketId = getReceiverSocketId(sender.toString());
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("sendMessage error:", error);
    return res.status(500).json({ message: "Failed to send message", error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const sender = req.userId;
    const receiver = req.params.receiver;

    const conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }

    return res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("getMessages error:", error);
    return res.status(500).json({ message: "Failed to fetch messages", error: error.message });
  }
};
