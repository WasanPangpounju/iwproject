import mongoose, { Schema } from "mongoose";

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
    dateTime: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ เพิ่ม Middleware เพื่อกำหนด dateTime เป็น format ไทย
LogSchema.pre("save", function (next) {
  if (!this.dateTime) {
    const now = new Date();
    const formattedDateTime =
      new Intl.DateTimeFormat("th-TH", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now) + " น.";
    this.dateTime = formattedDateTime;
  }
  next();
});

const SystemLog =
  mongoose.models.SystemLog || mongoose.model("SystemLog", LogSchema);

export default SystemLog;
