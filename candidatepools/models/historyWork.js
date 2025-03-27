import mongoose, { Schema } from "mongoose";

// Schema สำหรับการจัดเก็บข้อมูลโครงงาน ฝึกงาน และการทำงานของผู้ใช้
const HistoryWorkSchema = new Schema(
    {
        uuid: {  
            type: String,
            required: true,
        },
        statusNow: {  
            type: String,
        },
        projects: [
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
        internships: [
            {
                dateStart: { type: String },
                dateStartMonth: { type: String },
                dateEnd: { type: String },
                dateEndMonth: { type: String },
                place: { type: String },
                position: { type: String },
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
        workExperience: [
            {
                dateStart: { type: String },
                dateStartMonth: { type: String },
                dateEnd: { type: String },
                dateEndMonth: { type: String },
                place: { type: String },
                position: { type: String },
                files: [
                    {
                        fileName: { type: String },
                        fileType: { type: String },
                        fileUrl: { type: String },
                        fileSize: { type: String },
                    }
                ]
            }
        ]
    },
    {
        timestamps: true
    }
);

const HistoryWork = mongoose.models.HistoryWork || mongoose.model("HistoryWork", HistoryWorkSchema);
export default HistoryWork;
