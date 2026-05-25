import { Schema, model, Types } from "mongoose";

const aiHistorySchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  agentUsed: { type: String, required: true },
  promptSnippet: { type: String },
  tokensUsed: { type: Number, default: 0 },
}, { timestamps: true });

export const AIHistory = model("AIHistory", aiHistorySchema);
