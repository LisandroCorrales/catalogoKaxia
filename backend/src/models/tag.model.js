import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    color: { type: String, default: "#667085", trim: true }
  },
  { timestamps: true }
);

export const TagModel = mongoose.model("Tag", tagSchema);
