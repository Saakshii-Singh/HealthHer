import mongoose from "mongoose";

const CommunityPostSchema = new mongoose.Schema({
    anonymousName:String,
    title: String,
    content: String,
    mood: String,
    category: String,
    likes:{
        type: Number,
        default: 0,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("CommunityPost", CommunityPostSchema);