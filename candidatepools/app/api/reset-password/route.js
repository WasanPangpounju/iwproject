import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";
import SystemLog from "@/models/systemLog";
import { ACTION_ACTIVITY, TARGET_MODEL } from "@/const/enum";

export async function POST(req) {
  const { token, newPassword } = await req.json();

  await mongoDB();

  const user = await Users.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    await SystemLog.create({
      actorUuid: user.uuid,
      action: ACTION_ACTIVITY.ERROR,
      targetModel: TARGET_MODEL.ACCOUNT,
      description: `เกิดข้อผิดพลาด ${ACTION_ACTIVITY.UPDATE} รหัสผ่าน "${user.email}"`,
      data: {},
    });
    return Response.json(
      { message: "ลิงก์ไม่ถูกต้องหรือหมดอายุแล้ว" },
      { status: 400 }
    );
  }

  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;

  await SystemLog.create({
    actorUuid: user.uuid,
    action: ACTION_ACTIVITY.UPDATE,
    targetModel: TARGET_MODEL.ACCOUNT,
    description: `${ACTION_ACTIVITY.UPDATE} รหัสผ่าน "${user.email}"`,
    data: {},
  });

  await user.save();

  return Response.json({ message: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว" });
}
