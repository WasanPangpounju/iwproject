import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";

export async function POST(req) {
  const { token, newPassword } = await req.json();

  await mongoDB();

  const user = await Users.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return Response.json({ message: "ลิงก์ไม่ถูกต้องหรือหมดอายุแล้ว" }, { status: 400 });
  }

  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;

  await user.save();

  return Response.json({ message: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว" });
}