import { mongoDB } from "@/lib/mongodb";
import Educations from "@/models/education";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
    const { id } = params; // ดึง id จาก params
    const { fileName } = await req.json(); // ดึงชื่อไฟล์จาก body

    try {
        // เชื่อมต่อกับฐานข้อมูล
        await mongoDB();

        // หาข้อมูลการศึกษาโดยใช้ email
        const existingEducation = await Educations.findOne({ uuid: id });

        if (!existingEducation) {
            return NextResponse.json({ message: "ไม่พบข้อมูล" }, { status: 404 });
        }

        // หา index ของไฟล์ที่ต้องการลบ
        const fileIndex = existingEducation.fileDocument.indexOf(fileName);

        if (fileIndex === -1) {
            return NextResponse.json({ message: "ไม่พบไฟล์" }, { status: 404 });
        }

        // สร้างอาร์เรย์ใหม่ที่ไม่รวมไฟล์ที่ต้องการลบ
        const updatedFileDocument = existingEducation.fileDocument.filter((_, index) => index !== fileIndex);
        const updatedNameDocument = existingEducation.nameDocument.filter((_, index) => index !== fileIndex);
        const updatedSizeDocument = existingEducation.sizeDocument.filter((_, index) => index !== fileIndex);
        const updatedTypeDocument = existingEducation.typeDocument.filter((_, index) => index !== fileIndex);

        // อัปเดตข้อมูลในฐานข้อมูล
        await Educations.updateOne(
            { email },
            {
                $set: {
                    fileDocument: updatedFileDocument,
                    nameDocument: updatedNameDocument,
                    sizeDocument: updatedSizeDocument,
                    typeDocument: updatedTypeDocument,
                }
            }
        );

        return NextResponse.json({ message: "ลบไฟล์สำเร็จ", data: existingEducation }, { status: 200 });
    } catch (error) {
        console.error("Error deleting file:", error);
        return NextResponse.json({ message: "Error deleting file" }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const { id } = params;
    const { oldName, newName } = await req.json();

    try {
        // หาข้อมูลการศึกษาโดยใช้ email
        const existingEducation = await Educations.findOne({ uuid: id });

        if (!existingEducation) {
            return NextResponse.json({ message: "ไม่พบข้อมูล" }, { status: 404 });
        }
        // หา index ของไฟล์ที่ต้องการเปลี่ยนชื่อ
        const fileIndex = existingEducation.nameDocument.indexOf(oldName);

        if (fileIndex === -1) {
            return NextResponse.json({ message: "ไม่พบไฟล์" }, { status: 404 });
        }

        // อัปเดตชื่อไฟล์ที่ตำแหน่ง fileIndex เป็นชื่อใหม่
        existingEducation.nameDocument[fileIndex] = newName;

        // บันทึกการเปลี่ยนแปลงในฐานข้อมูล
        await existingEducation.save();

        return NextResponse.json({ message: "เปลี่ยนชื่อไฟล์สำเร็จ" }, { status: 200 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "เกิดข้อผิดพลาด" }, { status: 500 });
    }
}
