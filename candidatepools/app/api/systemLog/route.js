import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb";
import SystemLog from "@/models/systemLog";

// เชื่อมต่อ MongoDB ก่อนทุก request
await mongoDB();

// GET: ดึง log ทั้งหมด
export async function GET() {
  try {
    const logs = await SystemLog.find().sort({ createdAt: -1 }); // ล่าสุดก่อน
    return NextResponse.json({ success: true, data: logs }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST: สร้าง log ใหม่
export async function POST(req) {
  try {
    const body = await req.json();

    const newLog = await SystemLog.create({
      actorUuid: body.actorUuid || null,
      targetUuid: body.targetUuid || null,
      action: body.action,
      targetModel: body.targetModel,
      data: body.data || null,
      description: body.description || "",
    });

    return NextResponse.json({ success: true, data: newLog }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
