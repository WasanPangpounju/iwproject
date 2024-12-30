import mongoose, { Schema } from "mongoose";


const ChatSchema = new Schema(
    {
        uuid: {
            type: String,
            required: true,
        },
        statusRead: {
            type: Boolean,
            required: true,
        },
        statusReadAdmin: {
            type: Boolean,
            required: true,
        },
        roomChat: [{
            message: {
                type: String,
                required: true,
                trim: true,
            },
            senderRole: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        }]
    },
    {
        timestamps: true,
    }
);

const Chats = mongoose.models.Chats || mongoose.model("Chats", ChatSchema);
export default Chats;
