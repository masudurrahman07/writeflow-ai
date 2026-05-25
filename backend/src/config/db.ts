import mongoose from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL as string;

export async function connectDB(): Promise<void> {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in environment variables.");
  }

  try {
    const conn = await mongoose.connect(DATABASE_URL);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
