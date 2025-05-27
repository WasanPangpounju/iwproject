import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb"; // เชื่อมต่อ MongoDB
import Companys from "@/models/company";
import SystemLog from "@/models/systemLog";
import { ACTION_ACTIVITY, ROLE, TARGET_MODEL } from "@/const/enum";

export async function POST(req) {
  const data = await req.json();

  try {
    // เชื่อมต่อฐานข้อมูล
    await mongoDB();

    // อ่านข้อมูลจาก request body
    const {
      nameCompany,
      address,
      province,
      amphor,
      tambon,
      zipcode,
      work_type,
      work_detail,
      date_start,
      date_end,
      time_start,
      time_end,
      welfare,
      coordinator,
      coordinator_tel,
    } = data;

    // สร้างเอกสารใหม่ใน MongoDB
    const result = await Companys.create({
      nameCompany,
      address,
      province,
      amphor,
      tambon,
      zipcode,
      work_type,
      work_detail,
      date_start,
      date_end,
      time_start,
      time_end,
      welfare,
      coordinator,
      coordinator_tel,
    });

    await SystemLog.create({
      actorUuid: ROLE.ADMIN,
      action: ACTION_ACTIVITY.CREATE,
      targetModel: TARGET_MODEL.COMPANY,
      description: `${ACTION_ACTIVITY.CREATE} บริษัท "${data.nameCompany}"`,
      data: data,
    });
    // ส่งผลลัพธ์กลับไปยัง client
    return NextResponse.json(
      { message: "Company data created successfully", data: result },
      { status: 200 }
    );
  } catch (error) {
    await SystemLog.create({
      actorUuid: ROLE.ADMIN,
      action: ACTION_ACTIVITY.ERROR,
      targetModel: TARGET_MODEL.COMPANY,
      description: `เกิดข้อผิดพลาด ${ACTION_ACTIVITY.CREATE} บริษัท "${data.nameCompany}" ล้มเหลว`,
      data: data,
    });
    console.error("Error creating company data:", error);
    return NextResponse.json(
      { message: "Error creating company data" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  await mongoDB();
  const companys = await Companys.find({});
  return NextResponse.json({ companys });
}
