import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";
import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOption);
  await mongoDB();

  let user;

  if (session?.user?.role === "admin") {
    const currentUser = await Users.findOne({ uuid: session.user.id });

    if (!currentUser?.university) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูลมหาวิทยาลัยของผู้ใช้" },
        { status: 400 },
      );
    }

    user = await Users.find({
      university: currentUser.university,
    }).sort({ updatedAt: -1 });
  } else {
    user = await Users.find({}).sort({ updatedAt: -1 });
  }

  return NextResponse.json({ user });
}
