import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    items: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const AnnouncementModel = mongoose.model("Announcement", announcementSchema);
