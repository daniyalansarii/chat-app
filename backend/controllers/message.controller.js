// controllers/message.controller.js
import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const sender = req.userId;                 // set by your auth middleware
    const receiver = req.params.receiver;      // from route /send/:receiver
    const { message } = req.body;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    // Create message first
    const newMessage = await Message.create({
      sender,
      receiver,
      message,
      image,
    });

    // Find or create conversation and push message
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

    // Emit to receiver (if online) and to sender (so sender UI updates instantly)
    const receiverSocketId = getReceiverSocketId(receiver?.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    const senderSocketId = getReceiverSocketId(sender?.toString());
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("send message error:", error);
    return res.status(500).json({ message: `send message error: ${error.message}` });
  }
};

export const getMessages = async (req, res) => {
  try {
    const sender = req.userId;
    const receiver = req.params.receiver;

    const conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    }).populate("messages");

    // Return empty list if no conversation yet
    if (!conversation) return res.status(200).json([]);

    return res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("get message error:", error);
    return res.status(500).json({ message: `get message error: ${error.message}` });
  }
};
