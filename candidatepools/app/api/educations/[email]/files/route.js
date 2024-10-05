import { mongoDB } from "@/lib/mongodb";
import Educations from "@/models/education";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
    const { email } = params; // ดึง email จาก params
    const { fileName } = await req.json(); // ดึงชื่อไฟล์จาก body

    try {
        // เชื่อมต่อกับฐานข้อมูล
        await mongoDB();

        // หาข้อมูลการศึกษาโดยใช้ email
        const existingEducation = await Educations.findOne({ email });

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

        // อัปเดตข้อมูลในฐานข้อมูล
        await Educations.updateOne(
            { email },
            {
                $set: {
                    fileDocument: updatedFileDocument,
                    nameDocument: updatedNameDocument,
                    sizeDocument: updatedSizeDocument,
                }
            }
        );

        return NextResponse.json({ message: "ลบไฟล์สำเร็จ", data: existingEducation }, { status: 200 });
    } catch (error) {
        console.error("Error deleting file:", error);
        return NextResponse.json({ message: "Error deleting file" }, { status: 500 });
    }
}
