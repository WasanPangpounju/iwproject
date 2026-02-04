import { mongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Companys from "@/models/company";
import SystemLog from "@/models/systemLog";
import { ACTION_ACTIVITY, ROLE, TARGET_MODEL } from "@/const/enum";

export async function GET(req) {
  const id = req.nextUrl.pathname.split("/").filter(Boolean).pop();
  await mongoDB();
  const company = await Companys.findOne({ _id: id });
  return NextResponse.json({ company });
}

export async function PUT(req) {
  const id = req.nextUrl.pathname.split("/").filter(Boolean).pop();

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
    typeBusiness,
    dutyWork,
    quantityEmployee,
    quantityDisabled,
    emailCompany,
    positionWork,
    addressWork,
    budget,
    timeStartWork,
    lineId
  } = await req.json();
  try {
    await mongoDB();

    // อัปเดตข้อมูลผู้ใช้ในฐานข้อมูล
    const result = await Companys.findOneAndUpdate(
      { _id: id },
      {
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
        typeBusiness,
        dutyWork,
        quantityEmployee,
        quantityDisabled,
        emailCompany,
        positionWork,
        addressWork,
        budget,
        timeStartWork,
        lineId
      },
      { new: true } // ส่งกลับเอกสารที่อัปเดตใหม่
    );

    if (!result) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await SystemLog.create({
      actorUuid: ROLE.ADMIN,
      action: ACTION_ACTIVITY.UPDATE,
      targetModel: TARGET_MODEL.COMPANY,
      description: `${ACTION_ACTIVITY.UPDATE} บริษัท "${nameCompany}"`,
      data: {},
    });
    return NextResponse.json(
      { message: "User updated successfully", data: result },
      { status: 200 }
    );
  } catch (error) {
    await SystemLog.create({
      actorUuid: ROLE.ADMIN,
      action: ACTION_ACTIVITY.ERROR,
      targetModel: TARGET_MODEL.COMPANY,
      description: `เกิดข้อผืดพลาด ${ACTION_ACTIVITY.UPDATE} บริษัท "${nameCompany}"`,
      data: { result },
    });
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const id = req.nextUrl.pathname.split("/").filter(Boolean).pop();
  await mongoDB();

  const company = await Companys.findOne({ _id: id });

  try {
    const result = await Companys.findOneAndDelete({ _id: id });

    if (!result) {
      return new Response(
        JSON.stringify({ error: "Company not found or already deleted." }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await SystemLog.create({
      actorUuid: ROLE.ADMIN,
      action: ACTION_ACTIVITY.DELETE,
      targetModel: TARGET_MODEL.COMPANY,
      description: `${ACTION_ACTIVITY.DELETE} บริษัท "${
        company?.nameCompany || "N/A"
      }"`,
      data: {},
    });

    return new Response(
      JSON.stringify({ message: "Company deleted successfully." }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    await SystemLog.create({
      actorUuid: ROLE.ADMIN,
      action: ACTION_ACTIVITY.ERROR,
      targetModel: TARGET_MODEL.COMPANY,
      description: `เกิดข้อผิดพลาด ${ACTION_ACTIVITY.DELETE} บริษัท "${
        company?.nameCompany || "N/A"
      }"`,
      data: {},
    });

    console.error("Error deleting company:", error);
    return new Response(
      JSON.stringify({ error: `Failed to delete company: ${error.message}` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
