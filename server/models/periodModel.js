import mongoose from "mongoose";

const periodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    lastPeriodDate: {
        type: Date,
        required: true,
    },
    cycleLength: {
        type: Number,
        required: true,
        default: 28,
    },
    duration: {
        type: Number,
    },
    nextPeriod: {
        type: Date,
    },
    ovulation: {
        type: Date,
    },
    phase: {
        type: String,
    },
    insights: {
        type: String,
    },
}, {
    timestamps: true,
});

const Period = mongoose.model("Period", periodSchema);

export default Period;