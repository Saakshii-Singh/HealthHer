import mongoose from "mongoose";

export async function connectDB() {
  try {
    const connStr = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthher";
    const conn = await mongoose.connect(connStr);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
}