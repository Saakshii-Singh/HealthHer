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
    try {
      const savedMsg = await Message.create({
        nickname: nickname || "Anonymous",
        content: content || "",
        room: room || "general",
      });

      // Broadcast the fully saved DB model to everyone in the room
      io.to(room).emit("new_message", savedMsg);
    } catch (err) {
      console.error(`Error saving websocket message: ${err.message}`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Websocket client disconnected: ${socket.id}`);
  });
});

// Production Setup to serve static SPA files
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API Server is running in development mode...");
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});