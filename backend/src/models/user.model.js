import mongoose from "mongoose";
import { Rol } from "../domain/enums/Rol.js";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: Object.values(Rol) },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);
