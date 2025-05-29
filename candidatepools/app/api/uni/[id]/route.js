import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb";
import UniModel from "@/models/university";

// เชื่อมต่อ MongoDB
await mongoDB();

// อัปเดตชื่อสถาบัน
export async function PUT(req, { params }) {
  const { id } = params;
  try {
    const body = await req.json();
    const { university } = body;

    if (!university) {
      return NextResponse.json({ error: "กรุณาระบุชื่อสถาบัน" }, { status: 400 });
    }

    const updated = await UniModel.findByIdAndUpdate(id, { university }, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "ไม่พบข้อมูลที่ต้องการอัปเดต" }, { status: 404 });
    }

    return NextResponse.json({ message: "อัปเดตสำเร็จ", data: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการอัปเดต" }, { status: 500 });
  }
}

// ลบชื่อสถาบัน
export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    const deleted = await UniModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "ไม่พบข้อมูลที่ต้องการลบ" }, { status: 404 });
    }

    return NextResponse.json({ message: "ลบสำเร็จ", data: deleted }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล" }, { status: 500 });
  }
}