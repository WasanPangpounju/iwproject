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
                province: { type: String, required: true },
            }
        ],
    },
    {
        timestamps: true
    }
);

const Resume = mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);
export default Resume;
