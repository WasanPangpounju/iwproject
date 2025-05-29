import mongoose, { Schema } from "mongoose";

const UniSchema = new Schema(
  {
    university: {
      type: String,
      required: false,
    },
  }
);

const UniModel =
  mongoose.models.University || mongoose.model("University", UniSchema);

export default UniModel;
