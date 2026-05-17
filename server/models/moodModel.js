import mongoose from "mongoose";

const moodSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    mood:{
        type:String,
        required:true
    },
    stressLevel:{
        type:Number,
        required:true
    },
    painLevel:{
        type:Number,
        required:true
    },
    note:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    });

const Mood = mongoose.model("Mood",moodSchema);

export default Mood;