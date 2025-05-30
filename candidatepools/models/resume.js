import mongoose, { Schema } from "mongoose";

// Schema สำหรับการจัดเก็บข้อมูลทักษะและการฝึกอบรมของผู้ใช้
const ResumeSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
    },
    interestedWork: [
      {
        type: { type: String, required: true },
        detail: { type: String, required: true },
        province1: { type: String },
        province2: { type: String },
        province3: { type: String },
      },
    ],
    files: [
      {
        fileName: { type: String },
        fileType: { type: String },
        fileUrl: { type: String },
        fileSize: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);
export default Resume;
