import mongoose, { Schema } from "mongoose";


const ChatSchema = new Schema(
    {
        message: {
            type: String,
            required: true,
        },
        sender: {
            type: String, // "user" หรือ "admin"
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    }
);

const Chats = mongoose.models.Chats || mongoose.model("Chats", ChatSchema);
export default Chats;
