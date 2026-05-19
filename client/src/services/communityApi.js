import axios from "axios";
import { data } from "react-router-dom";

const API=axios.create({
    baseURL:"http://localhost:5000/api/community"
});
export const createPost=(data)=>API.post("/create",data);
export const getPosts=()=>API.get("/posts");
export const addReply=(data)=>API.post("/reply",data);  
export const getReplies=(postId)=>API.get(`/replies/${postId}`);