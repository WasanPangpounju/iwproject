import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { email } = await req.json();

    await mongoDB();

    const user = await Users.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: "ไม่พบบัญชีผู้ใช้" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpires = Date.now() + 1000 * 60 * 60;

    user.resetToken = token;
    user.resetTokenExpires = tokenExpires;
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Career IW Support" <pportler.sss@gmail.com>',
      to: email,
      subject: "รีเซ็ตรหัสผ่าน",
      html: `
        <p>คุณได้รับอีเมลนี้เพราะคุณได้ร้องขอการรีเซ็ตรหัสผ่านในระบบ iw </p>
        <p><a href="${resetUrl}">คลิกที่นี่เพื่อรีเซ็ตรหัสผ่าน</a></p>
        <p>ลิงก์นี้จะหมดอายุใน 1 ชั่วโมง</p>
      `,
    });

    return new Response(JSON.stringify({ message: "ส่งอีเมลสำเร็จแล้ว" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return new Response(
      JSON.stringify({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
