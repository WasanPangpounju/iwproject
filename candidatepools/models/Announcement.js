import mongoose, { Schema, models, model } from "mongoose";

const AnnouncementSchema = new Schema(
  {
    title: { type: String, trim: true, required: true, maxlength: 120 },
    description: { type: String, trim: true, required: true, maxlength: 300 }, // preview
    content: { type: String, trim: true, required: true, maxlength: 5000 }, // full

    imageUrl: { type: String, trim: true },
    linkUrl: { type: String, trim: true },
    linkText: { type: String, trim: true, maxlength: 80 },

    pinned: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Announcement || model("Announcement", AnnouncementSchema);
