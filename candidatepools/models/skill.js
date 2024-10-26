import mongoose, { Schema } from "mongoose";

// Schema สำหรับการจัดเก็บข้อมูลทักษะและการฝึกอบรมของผู้ใช้
const SkillSchema = new Schema(
    {
        uuid: {  
            type: String,
            required: true,
        },
        skills: [
            {
                type: { type: String, required: true },
                name: { type: String, required: true },
                detail: { type: String, required: true },
            }
        ],
        trains: [
            {
                name: { type: String, required: true },
                detail: { type: String, required: true },
                files: [
                    {
                        fileName: { type: String },
                        fileType: { type: String },
                        fileUrl: { type: String },
                        fileSize: { type: String },
                    }
                ]
            }
        ],
    },
    {
        timestamps: true
    }
);

const Skills = mongoose.models.Skills || mongoose.model("Skills", SkillSchema);
export default Skills;
