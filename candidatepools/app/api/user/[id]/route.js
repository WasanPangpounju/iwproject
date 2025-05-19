import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";
import Educations from "@/models/education";
import HistoryWork from "@/models/historyWork";
import Skills from "@/models/skill";
import Resume from "@/models/resume";
import Chats from "@/models/chat";
import { NextResponse } from "next/server";

export async function GET(req) {
  const id = req.nextUrl.pathname.split("/").filter(Boolean).pop();
  await mongoDB();
  const user = await Users.findOne({ uuid: id });
  return NextResponse.json({ user });
}

export async function DELETE(req) {
  const id = req.nextUrl.pathname.split("/").filter(Boolean).pop(); // uuid ที่ต้องการลบ
  await mongoDB();

  try {
    const deleteResults = await Promise.all([
      Users.findOneAndDelete({ uuid: id }),
      Educations.deleteMany({ uuid: id }),
      HistoryWork.deleteMany({ uuid: id }),
      Skills.deleteMany({ uuid: id }),
      Resume.deleteMany({ uuid: id }),
      Chats.findOneAndDelete({ uuid: id }),
    ]);

    const userDeleted = deleteResults[0];

    if (!userDeleted) {
      return new Response(
        JSON.stringify({ error: "User not found or already deleted." }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "User and related data deleted successfully.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting user and related data:", error);
    return new Response(
      JSON.stringify({ error: `Failed to delete: ${error.message}` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PUT(req) {
  const id = req.nextUrl.pathname.split("/").filter(Boolean).pop();

  try {
    await mongoDB();

    const {
      user,
      password,
      firstName,
      lastName,
      firstNameEng,
      lastNameEng,
      profile,
      typeDisabled,
      detailDisabled,
      university,
      email,
      prefix,
      nickname,
      sex,
      dateBirthday,
      monthBirthday,
      yearBirthday,
      nationality,
      religion,
      idCard,
      idCardDisabled,
      addressIdCard,
      addressIdCardProvince,
      addressIdCardAmphor,
      addressIdCardTambon,
      addressIdCardZipCode,
      address,
      addressProvince,
      addressAmphor,
      addressTambon,
      addressZipCode,
      tel,
      telEmergency,
      relationship,
      typePerson,
      role,
      position,
    } = await req.json();

    // อัปเดตข้อมูลผู้ใช้ในฐานข้อมูล
    const result = await Users.findOneAndUpdate(
      { uuid: id }, // ใช้ email เป็น filter
      {
        user,
        password,
        firstName,
        lastName,
        firstNameEng,
        lastNameEng,
        profile,
        typeDisabled,
        detailDisabled,
        university,
        email,
        prefix,
        nickname,
        sex,
        dateBirthday,
        monthBirthday,
        yearBirthday,
        nationality,
        religion,
        idCard,
        idCardDisabled,
        addressIdCard,
        addressIdCardProvince,
        addressIdCardAmphor,
        addressIdCardTambon,
        addressIdCardZipCode,
        address,
        addressProvince,
        addressAmphor,
        addressTambon,
        addressZipCode,
        tel,
        telEmergency,
        relationship,
        typePerson,
        role,
        position,
      },
      { new: true } // ส่งกลับเอกสารที่อัปเดตใหม่
    );

    if (!result) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User updated successfully", user: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 }
    );
  }
}
