import Message from "../models/Message.js";
import { censorText } from "../utils/censor.js";

// @desc    Get historical room messages
// @route   GET /api/messages/:room
export async function getMessagesByRoom(req, res) {
  const { room } = req.params;

  try {
    const limit = parseInt(req.query.limit) || 50;
    
    // Fetch latest messages from the DB
    const messages = await Message.find({ room })
      .sort({ createdAt: -1 })
      .limit(limit);

    // Return in chronological order
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc    Create/Save a chat message (REST fallback)
// @route   POST /api/messages
export async function createMessage(req, res) {
  const { nickname, content, room } = req.body;

  try {
    if (!nickname || !content) {
      return res.status(400).json({ message: "Nickname and content are required" });
    }

    const sanitizedContent = censorText(content);

    const newMessage = await Message.create({
      nickname,
      content: sanitizedContent,
      room: room || "general"
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

