import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb";
import UniModel from "@/models/university";

// เชื่อมต่อฐานข้อมูล MongoDB
await mongoDB();

// POST: เพิ่มชื่อสถาบัน
export async function POST(req) {
  try {
    const body = await req.json();
    const { university } = body;

    if (!university) {
      return NextResponse.json(
        { error: "กรุณาระบุชื่อสถาบัน" },
        { status: 400 }
      );
    }

    const newUni = new UniModel({ university });
    await newUni.save();

    return NextResponse.json(
      { message: "เพิ่มสถาบันสำเร็จ", data: newUni },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล" },
      { status: 500 }
    );
  }
}

// GET: ดึงชื่อสถาบันทั้งหมด
export async function GET() {
  try {
    const uniList = await UniModel.find().sort({ university: 1 }); // เรียงตามชื่อ
    return NextResponse.json({ data: uniList }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    );
  }
}
