import mongoose, { Schema } from "mongoose";
import { ACTION_ACTIVITY } from "@/const/enum";

const LogSchema = new Schema(
  {
    actorUuid: {
      type: String,
      required: false,
    },
    targetUuid: {
      type: String,
      required: false,
    },
    action: {
      type: String,
      required: true,
    },
    targetModel: {
      type: String,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const SystemLog =
  mongoose.models.SystemLog || mongoose.model("SystemLog", LogSchema);

export default SystemLog;
