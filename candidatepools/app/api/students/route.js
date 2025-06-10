import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";

export async function GET(req) {
  await mongoDB();
  const user = await Users.find({}).sort({ updatedAt: -1 }); // หรือใช้ _id แทนก็ได้
  return NextResponse.json({ user });
}