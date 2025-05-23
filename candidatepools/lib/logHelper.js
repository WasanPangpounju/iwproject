// lib/logHelper.js
import SystemLog from "@/models/systemLog";

export async function addSystemLog(logData) {
  try {
    await SystemLog.create(logData);
  } catch (err) {
    console.error("Log creation error:", err);
  }
}