import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      unique: true, // ตรวจสอบให้แน่ใจว่าอีเมลไม่ซ้ำกัน
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    typePerson: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // ตรวจสอบให้แน่ใจว่าอีเมลไม่ซ้ำกัน
    },
    firstNameEng: {
      type: String,
    },
    lastNameEng: {
      type: String,
    },
    profile: {
      type: String,
    },
    typeDisabled: {
      type: [String],
    },
    detailDisabled: {
      type: String,
    },
    university: {
      type: String,
    },
    prefix: {
      type: String,
    },
    nickname: {
      type: String,
    },
    sex: {
      type: String,
    },
    dateBirthday: {
      type: String,
    },
    monthBirthday: {
      type: String,
    },
    yearBirthday: {
      type: String,
    },
    nationality: {
      type: String,
    },
    religion: {
      type: String,
    },
    idCard: {
      type: String,
    },
    idCardDisabled: {
      type: String,
    },
    addressIdCard: {
      type: String,
    },
    addressIdCardProvince: {
      type: String,
    },
    addressIdCardAmphor: {
      type: String,
    },
    addressIdCardTambon: {
      type: String,
    },
    addressIdCardZipCode: {
      type: String,
    },
    address: {
      type: String,
    },
    addressProvince: {
      type: String,
    },
    addressAmphor: {
      type: String,
    },
    addressTambon: {
      type: String,
    },
    addressZipCode: {
      type: String,
    },
    tel: {
      type: String,
    },
    telEmergency: {
      type: String,
    },
    relationship: {
      type: String,
    },
    position: {
      type: String,
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpires: {
      type: Date,
      default: null,
    },
    comeForm: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.models.Users || mongoose.model("Users", UserSchema);
export default Users;
