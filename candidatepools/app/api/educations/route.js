import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb";
import Educations from "@/models/education";

export async function GET(req) {
  await mongoDB();
  const educations = await Educations.find({});
  return NextResponse.json({ educations });
}

export async function POST(req) {
  try {
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
      return NextResponse.json({ educations: newEducation }, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating/updating education data:", error);
    return NextResponse.json(
      { message: "Error creating/updating education data" },
      { status: 500 }
    );
  }
}
