import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb";
import SystemLog from "@/models/systemLog";
import Users from "@/models/user";

// เชื่อมต่อ MongoDB ก่อนทุก request
await mongoDB();

// GET: ดึง log ทั้งหมด
export async function GET() {
  try {
    // ดึง logs แบบ lean เพื่อให้ได้ plain object
    const logs = await SystemLog.find().sort({ createdAt: -1 }).lean();

    // หา actorUuid ที่ไม่ซ้ำ
    const actorUuids = [
      ...new Set(logs.map((log) => log.actorUuid).filter(Boolean)),
    ];

    // ดึงผู้ใช้ที่ตรงกับ uuid
    const users = await Users.find({ uuid: { $in: actorUuids } }).lean();

    // สร้าง map uuid -> ชื่อเต็ม
    const userMap = new Map();
    users.forEach((user) => {
      const fullName = [user.firstName, user.lastName]
        .filter(Boolean)
        .join(" ");
      userMap.set(user.uuid, fullName);
    });

    function formatThaiDate(dateString) {
      const date = new Date(dateString);
      const thDate = new Intl.DateTimeFormat("th-TH", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);
      return `${thDate} น.`; // เพิ่มคำว่า "น." ต่อท้าย
    }
    // สร้าง array ใหม่ที่เพิ่ม actorName (ไม่มี object ซ้อน)
    const result = logs.map((log) => ({
      ...log,
      actorName: userMap.get(log.actorUuid) || log.actorUuid,
      createdAtFormatted: formatThaiDate(log.createdAt),
    }));

    return NextResponse.json({ success: true, data: result }, { status: 200 });
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
