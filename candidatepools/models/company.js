import mongoose, { Schema } from "mongoose";

const CompanySchema = new Schema(
  {
    nameCompany: {
      type: String,
    },
    address: {
      type: String,
    },
    province: {
      type: String,
    },
    amphor: {
      type: String,
    },
    tambon: {
      type: String,
    },
    zipcode: {
      type: String,
    },
    work_type: {
      type: String,
    },
    work_detail: {
      type: String,
    },
    date_start: {
      type: String,
    },
    date_end: {
      type: String,
    },
    time_start: {
      type: String,
    },
    time_end: {
      type: String,
    },
    welfare: {
      type: [String],
    },
    coordinator: {
      type: String,
    },
    coordinator_tel: {
      type: String,
    },
    typeBusiness: { type: String },
    dutyWork: { type: String },
    quantityEmployee: { type: String },
    quantityDisabled: { type: String },
    emailCompany: { type: String },
    positionWork: { type: String },
    addressWork: { type: String },
    budget: { type: String },
    timeStartWork: { type: String },
  },
  {
    timestamps: true,
  }
);

const Companys =
  mongoose.models.Companys || mongoose.model("Companys", CompanySchema);
export default Companys;
