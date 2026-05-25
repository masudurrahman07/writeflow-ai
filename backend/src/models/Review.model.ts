import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  itemId: { type: Schema.Types.ObjectId, ref: "Template", required: true },
  approved: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export const Review = model("Review", reviewSchema);
