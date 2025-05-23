import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb"; // เชื่อมต่อ MongoDB ของคุณ
import Skills from "@/models/skill";
import SystemLog from "@/models/systemLog";
import { ACTION_ACTIVITY, ROLE, TARGET_MODEL } from "@/const/enum";

export async function POST(req) {
  const data = await req.json();
  try {
    // เชื่อมต่อฐานข้อมูลก่อน (หากยังไม่เชื่อมต่อ)
    await mongoDB();

    // อ่านข้อมูลจาก request
    const { uuid, skills, trains } = data;

    if (!uuid) {
      return NextResponse.json(
        { message: "UUID is required" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
    const dataSkills = await Skills.findOneAndUpdate(
      { uuid }, // ค้นหาข้อมูลจาก uuid
      { skills, trains }, // อัปเดตข้อมูลถ้าพบ uuid ตรงกัน
      { upsert: true, new: true } // สร้างใหม่ถ้าไม่พบข้อมูล (upsert) และคืนค่าเอกสารที่อัปเดตแล้ว
    );

    await SystemLog.create({
      actorUuid: uuid,
      action: ACTION_ACTIVITY.UPDATE,
      targetModel: TARGET_MODEL.SKILL,
      description: `${ACTION_ACTIVITY.UPDATE} "${TARGET_MODEL.SKILL}"`,
      data: data,
    });
    return NextResponse.json(
      {
        message: "Education data created/updated successfully",
        skills: dataSkills,
      },
      { status: 200 }
    );
  } catch (error) {
    await SystemLog.create({
      actorUuid: data.uuid || ROLE.SYSTEM,
      action: ACTION_ACTIVITY.ERROR,
      targetModel: TARGET_MODEL.SKILL,
      description: `เกิดข้อผิดพลาด ${ACTION_ACTIVITY.UPDATE} "${TARGET_MODEL.SKILL}"`,
      data: data,
    });
    console.error("Error creating/updating education data:", error);
    return NextResponse.json(
      { message: "Error creating/updating education data" },
      { status: 500 }
    );
  }
}
