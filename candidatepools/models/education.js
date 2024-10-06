import mongoose, { Schema } from "mongoose";

const EducationSchema = new Schema(
    {
        email: {
            type: String,
            required: true
        },
        typePerson: {
            type: String,
        },
        yearGraduation: {
            type: [String],
        },
        educationLevel: {
            type: [String],
        },
        level: {
            type: [String],
        },
        faculty: {
            type: [String],
        },
        branch: {
            type: [String],
        },
        university: {
            type: [String],
        },
        campus: {
            type: [String],
        },
        grade: {
            type: [String],
        },
        nameDocument: {
            type: [String],
        },
        sizeDocument: {
            type: [String],
        },
        fileDocument: {
            type: [String],
        },
        typeDocument: {
            type: [String]
        }

    },
    {
        timestamps: true
    }
)

const Educations = mongoose.models.Educations || mongoose.model("Educations", EducationSchema);
export default Educations