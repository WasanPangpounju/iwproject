import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb";
import Educations from "@/models/education";
import SystemLog from "@/models/systemLog";
import { ACTION_ACTIVITY, ROLE, TARGET_MODEL } from "@/const/enum";

export async function GET(req) {
  await mongoDB();
  const educations = await Educations.find({});
  return NextResponse.json({ educations });
}

export async function POST(req) {
  const {
    uuid,
    typePerson,
    university,
    campus,
    faculty,
    branch,
    level,
    educationLevel,
    grade,
    yearGraduation,
    file,
    nameFile,
    sizeFile,
    typeFile,
  } = await req.json();
  try {
    await mongoDB();

    const educations = await Educations.findOne({ uuid });

    if (educations) {
      const updatedEducation = await Educations.findOneAndUpdate(
        { uuid },
        {
          typePerson,
          university,
          campus,
          faculty,
          branch,
          level,
          educationLevel,
          grade,
          yearGraduation,
          fileDocument: file,
          nameDocument: nameFile,
          sizeDocument: sizeFile,
          typeDocument: typeFile,
        },
        { new: true }
      );
      await SystemLog.create({
        actorUuid: uuid,
        action: ACTION_ACTIVITY.UPDATE,
        targetModel: TARGET_MODEL.EDUCATION,
        description: `${ACTION_ACTIVITY.UPDATE} "${TARGET_MODEL.EDUCATION}"`,
        data: updatedEducation,
      });
      return NextResponse.json(
        { educations: updatedEducation },
        { status: 200 }
      );
    } else {
      const newEducation = await Educations.create({
        uuid,
        typePerson,
        university,
        campus,
        faculty,
        branch,
        level,
        educationLevel,
        grade,
        yearGraduation,
        fileDocument: file,
        nameDocument: nameFile,
        sizeDocument: sizeFile,
        typeDocument: typeFile,
      });
      await SystemLog.create({
        actorUuid: uuid,
        action: ACTION_ACTIVITY.CREATE,
        targetModel: TARGET_MODEL.EDUCATION,
        description: `${ACTION_ACTIVITY.CREATE} "${TARGET_MODEL.EDUCATION}"`,
        data: newEducation,
      });
      return NextResponse.json({ educations: newEducation }, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating/updating education data:", error);
    await SystemLog.create({
      actorUuid: uuid || ROLE.SYSTEM,
      action: ACTION_ACTIVITY.ERROR,
      targetModel: TARGET_MODEL.EDUCATION,
      description: `เกิดข้อผิดพลาด ${ACTION_ACTIVITY.UPDATE} "${TARGET_MODEL.EDUCATION}"`,
      data: {},
    });
    return NextResponse.json(
      { message: "Error creating/updating education data" },
      { status: 500 }
    );
  }
}
