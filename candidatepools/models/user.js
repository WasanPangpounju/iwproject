import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        uuid: {
            type: String,
            required: true,
        },
        user:{
            type: String,
            required: true,
            unique: true, // ตรวจสอบให้แน่ใจว่าอีเมลไม่ซ้ำกัน
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
        profile:{
            type: String,
        },
        typeDisabled:{
            type: [String],
        },
        detailDisabled:{
            type: String,
        },
        university:{
            type: String,
        },
        email:{
            type: String,
            required: true,
            unique: true, // ตรวจสอบให้แน่ใจว่าอีเมลไม่ซ้ำกัน
        },
        prefix:{
            type: String,
        },
        nickname:{
            type: String,
        },
        sex:{
            type: String,
        },
        dateBirthday:{
            type: String,
        },
        monthBirthday:{
            type: String,
        },
        yearBirthday:{
            type: String,
        },   
        nationality:{
            type: String,
        },
        religion:{
            type: String,
        },
        idCard:{
            type: String,
        },
        idCardDisabled:{
            type: String,
        },
        addressIdCard:{
            type: String,
        },
        addressIdCardProvince:{
            type: String,
        },
        addressIdCardAmphor:{
            type: String,
        },
        addressIdCardTambon:{
            type: String,
        },
        addressIdCardZipCode:{
            type: String,
        },
        address:{
            type: String,
        },
        addressProvince:{
            type: String,
        },
        addressAmphor:{
            type: String,
        },
        addressTambon:{
            type: String,
        },
        addressZipCode:{
            type: String,
        },
        tel:{
            type: String,
        },
        telEmergency:{
            type: String,
        },
        relationship:{
            type: String,
        },
        role:{
            type: String,
            require: true,
            default: "user"
        },
        typePerson:{
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

const Users = mongoose.models.Users || mongoose.model("Users",UserSchema);
export default Users