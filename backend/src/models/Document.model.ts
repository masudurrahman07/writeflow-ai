import { Schema, model, Types } from "mongoose";

const documentSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String },
  userId: { type: Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },
  wordCount: { type: Number, default: 0 },
  templateId: { type: Types.ObjectId, ref: "Template" },
}, {
  timestamps: true,
});

export const Document = model("Document", documentSchema);
