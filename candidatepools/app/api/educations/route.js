import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb";
import Educations from "@/models/education"; 

export async function GET(req) {
    await mongoDB();
    const educations = await Educations.find({ })
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

        // เชื่อมต่อกับฐานข้อมูล MongoDB
        await mongoDB();

        // ตรวจสอบว่า email นี้มีอยู่ในฐานข้อมูลแล้วหรือยัง
        const existingEducation = await Educations.findOne({ uuid });

        if (existingEducation) {
            // ถ้ามีอยู่แล้ว ให้ทำการอัปเดตข้อมูลแทน
            await Educations.findOneAndUpdate(
                { uuid }, // เงื่อนไขการค้นหา
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
                { new: true } // คำสั่งนี้จะคืนค่าข้อมูลใหม่หลังอัปเดต
            );
            return NextResponse.json({ message: "Updated Education Data" }, { status: 200 });
        } else {
            // ถ้าไม่มี ให้สร้างเอกสารข้อมูลการศึกษาใหม่
            await Educations.create({
                uuid: uuid,
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
            return NextResponse.json({ message: "Created Education Data" }, { status: 201 });
        }

    } catch (error) {
        console.error("Error creating/updating education data:", error);
        return NextResponse.json({ message: "Error creating/updating education data" }, { status: 500 });
    }
}
