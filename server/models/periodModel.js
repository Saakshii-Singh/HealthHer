import mongoose from "mongoose";
 
const periodSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    lastDate:{
        type: Date,
        required: true,
    },
    cycleLength:{
        type: Number,
        required: true,
        default: 28,
    },
},{
    timestamps: true,
});

const Period=mongoose.model("Period", periodSchema);

export default Period;