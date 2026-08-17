import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    hexCode: { type: String, required: true, unique: true, uppercase: true, trim: true }
  },
  { timestamps: true }
);

export const ColorModel = mongoose.model("Color", colorSchema);
