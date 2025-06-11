import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"; // สร้าง UUID ใหม่
import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";
import Educations from "@/models/education";
import SystemLog from "@/models/systemLog";
import { ACTION_ACTIVITY, ROLE, TARGET_MODEL } from "@/const/enum";
import HistoryWork from "@/models/historyWork";
import Skills from "@/models/skill";
import Resume from "@/models/resume";

export async function POST(req) {
  const {
    id,
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
  try {
    // เชื่อมต่อ MongoDB
    await mongoDB();
    const uuid = id || uuidv4();

    // สร้างผู้ใช้งานใน MongoDB
    await Users.create({
      uuid: uuid,
      user: user,
      password: password,
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
    });

    await Educations.create({
      uuid: uuid,
      email,
      typePerson,
      university,
    });

    await HistoryWork.create({
      uuid: uuid,
    });

    await Skills.create({
      uuid: uuid,
    });

    await Resume.create({
      uuid: uuid,
    });

    const dataLog = {
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
    };
    await SystemLog.create({
      actorUuid: uuid,
      action: ACTION_ACTIVITY.CREATE,
      targetModel: TARGET_MODEL.ACCOUNT,
      description: `สร้างบัญชี "${email}"`,
      data: dataLog,
    });

    return NextResponse.json({ message: "Created User" }, { status: 201 });
  } catch (error) {
    await SystemLog.create({
      actorUuid: id || ROLE.SYSTEM,
      action: ACTION_ACTIVITY.ERROR,
      targetModel: TARGET_MODEL.ACCOUNT,
      description: `เกิดข้อผิดพลาด ${error.message}`,
      data: dataLog || { error: error.message },
    });

    console.error("User creation error:", error.message);
    return NextResponse.json({ message: "Error Create User" }, { status: 500 });
  }
}
