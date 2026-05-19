import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    note: {
      type: String,
      trim: true,
      maxLength: 2000,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

moodSchema.index({ userId: 1, createdAt: -1 });

const Mood = mongoose.model("Mood", moodSchema);
export default Mood;