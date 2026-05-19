import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      required: true,
      maxLength: 40,
    },
    content: {
      type: String,
      required: true,
      maxLength: 1000,
    },
    room: {
      type: String,
      required: true,
      default: "general",
      maxLength: 40,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// Add index on room and createdAt (descending) to optimize fetch history query
messageSchema.index({ room: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;