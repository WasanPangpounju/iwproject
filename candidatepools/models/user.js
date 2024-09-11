import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        profile:{
            type: String,
        },
        user:{
            type: String,
            required: true
        },
        password:{
            type: String,
        },
        firstName:{
            type: String,
            required: true
        },
        lastName:{
            type: String,
            required: true
        },
        typeUser:{
            type: String,
            required: true
        },
        university:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        },
        role:{
            type: String,
            require: true,
            default: "user"
        }
    },
    {
        timestamps: true
    }
)

const Users = mongoose.models.Users || mongoose.model("Users",UserSchema);
export default Users