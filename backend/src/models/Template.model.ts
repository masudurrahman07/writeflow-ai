import { Schema, model, Types } from "mongoose";

const templateSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ["Blog", "Social Media", "Email", "Ad Copy"], required: true },
  description: { type: String, required: true },
  prompt: { type: String, required: true },
  sampleOutput: { type: String },
  thumbnail: { type: String },
  rating: { type: Number, default: 0 },
  usageCount: { type: Number, default: 0 },
  createdBy: { type: Types.ObjectId, ref: "User", required: true },
}, {
  timestamps: true,
});

export const Template = model("Template", templateSchema);
