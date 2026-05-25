import mongoose from "mongoose";

const cycleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 5,
      min: 1,
      max: 15,
    },
    cycleLength: {
      type: Number,
      required: true,
      default: 28,
      min: 15,
      max: 50,
    },
    symptoms: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

cycleSchema.index({ userId: 1, startDate: -1 });

const Cycle = mongoose.model("Cycle", cycleSchema);
export default Cycle;
