import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Config files
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";
import periodRoutes from "./routes/periodRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

// Database models for Websocket triggers
import Message from "./models/Message.js";
import { censorText } from "./utils/censor.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/messages", communityRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/cycle", periodRoutes);
app.use("/api/ai", aiRoutes);

// Rate limiting tracking map
const socketLastMessageTime = new Map();

// Socket.io Real-time anonymous room chat handlers
io.on("connection", (socket) => {
  console.log(`Websocket client connected: ${socket.id}`);

  // Join a specific room
  socket.on("join_room", ({ room }) => {
    // Leave other rooms to prevent double-logging
    const rooms = Array.from(socket.rooms);
    rooms.forEach(r => {
      if (r !== socket.id) socket.leave(r);
    });

    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  // Handle incoming messages
  socket.on("send_message", async (data) => {
    const { nickname, content, room } = data;
    const now = Date.now();
    const lastTime = socketLastMessageTime.get(socket.id) || 0;

    // 1.5s spam control
    if (now - lastTime < 1500) {
      socket.emit("rate_limit_error", { message: "Slow down! Please wait a moment before sending another message. 🌸" });
      return;
    }
    socketLastMessageTime.set(socket.id, now);

    try {
      const sanitizedContent = censorText(content);
      const savedMsg = await Message.create({
        nickname: nickname || "Anonymous",
        content: sanitizedContent || "",
        room: room || "general",
      });

      // Broadcast the fully saved DB model to everyone in the room
      io.to(room).emit("new_message", savedMsg);
    } catch (err) {
      console.error(`Error saving websocket message: ${err.message}`);
    }
  });

  socket.on("disconnect", () => {
    socketLastMessageTime.delete(socket.id);
    console.log(`Websocket client disconnected: ${socket.id}`);
  });
});

// Production Setup to serve static SPA files
const distPath = path.resolve(__dirname, "../client/dist/index.html");
import fs from "fs";

if (fs.existsSync(distPath)) {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(distPath);
  });
} else {
  app.get("*", (req, res) => {
    res.send("API Server is running successfully!");
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
