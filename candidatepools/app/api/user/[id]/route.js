import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";
import Educations from "@/models/education";
import HistoryWork from "@/models/historyWork";
import Skills from "@/models/skill";
import Resume from "@/models/resume";
import Chats from "@/models/chat";
import SystemLog from "@/models/systemLog";
import { NextResponse } from "next/server";
import { ACTION_ACTIVITY, ROLE, TARGET_MODEL } from "@/const/enum";
import { getServerSession } from "next-auth";
import { authOption } from "../../auth/[...nextauth]/route";
import { checkUserPermission } from "@/utils/auth/checkUserPermission";

export async function GET(req) {
  const id = req.nextUrl.pathname.split("/").filter(Boolean).pop();
  await mongoDB();
  const user = await Users.findOne({ uuid: id });
  return NextResponse.json({ user });
}

export async function DELETE(req) {
  const session = await getServerSession(authOption);

  if (session?.user?.role !== ROLE.SUPERVISOR && session?.user?.role !== ROLE.ADMIN) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const id = req.nextUrl.pathname.split("/").filter(Boolean).pop(); // uuid ที่ต้องการลบ
  await mongoDB();
  const user = await Users.findOne({ uuid: id });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found." }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
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

    await SystemLog.create({
      actorUuid: ROLE.ADMIN,
      action: ACTION_ACTIVITY.DELETE,
      targetModel: TARGET_MODEL.ACCOUNT,
      description: `ลบบัญชี ${user.email} (${user.role})`,
      data: {},
    });
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
    await SystemLog.create({
      actorUuid: ROLE.ADMIN,
      action: ACTION_ACTIVITY.ERROR,
      targetModel: TARGET_MODEL.ACCOUNT,
      description: `ลบบัญชี ${user.email} (${user.role}) ล้มเหลว`,
      data: {},
    });
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
  const session = await getServerSession(authOption);

  const id = req.nextUrl.pathname.split("/").filter(Boolean).pop();

  try {
    await mongoDB();

    if (!id) {
      return NextResponse.json({ message: "Missing user ID" }, { status: 400 });
    }

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
      comeForm
    } = await req.json();

    const permission = checkUserPermission(session?.user?.role, role);

    if (!permission.allowed) {
      return NextResponse.json(
        { message: permission.message },
        { status: permission.status }
      );
    }

    const data = {
      user: user,
      firstName: firstName,
      lastName: lastName,
      firstNameEng: firstNameEng,
      lastNameEng: lastNameEng,
      profile: profile,
      typeDisabled: typeDisabled,
      detailDisabled: detailDisabled,
      university: university,
      email: email,
      prefix: prefix,
      nickname: nickname,
      sex: sex,
      dateBirthday: dateBirthday,
      monthBirthday: monthBirthday,
      yearBirthday: yearBirthday,
      nationality: nationality,
      religion: religion,
      idCard: idCard,
      idCardDisabled: idCardDisabled,
      addressIdCard: addressIdCard,
      addressIdCardProvince: addressIdCardProvince,
      addressIdCardAmphor: addressIdCardAmphor,
      addressIdCardTambon: addressIdCardTambon,
      addressIdCardZipCode: addressIdCardZipCode,
      address: address,
      addressProvince: addressProvince,
      addressAmphor: addressAmphor,
      addressTambon: addressTambon,
      addressZipCode: addressZipCode,
      tel: tel,
      telEmergency: telEmergency,
      relationship: relationship,
      typePerson: typePerson,
      role: role,
      position: position,
      comeForm: comeForm
    };

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
        comeForm
      },
      { new: true } // ส่งกลับเอกสารที่อัปเดตใหม่
    );

    if (!result) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await SystemLog.create({
      actorUuid: id,
      action: ACTION_ACTIVITY.UPDATE,
      targetModel: TARGET_MODEL.PERSONAL,
      description: `${ACTION_ACTIVITY.UPDATE} "${TARGET_MODEL.PERSONAL}"`,
      data: data,
    });
    return NextResponse.json(
      { message: "User updated successfully", user: result },
      { status: 200 }
    );
  } catch (error) {
    await SystemLog.create({
      actorUuid: id || ROLE.ADMIN,
      action: ACTION_ACTIVITY.ERROR,
      targetModel: TARGET_MODEL.PERSONAL,
      description: `เกิดข้อผิดพลาด ${ACTION_ACTIVITY.UPDATE} "${TARGET_MODEL.PERSONAL}" ล้มเหลว`,
      data: error,
    });
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 }
    );
  }
}
