import mongoose from "mongoose";
import { env } from "./env";

const connectDB = async () => {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  try {
    await mongoose.connect(env.DATABASE_URL);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

export default connectDB;
