import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb"; // เชื่อมต่อ MongoDB ของคุณ
import Resume from "@/models/resume";

export async function GET(req) {
    await mongoDB();
    const interestedWork = await Resume.find({ })
    return NextResponse.json({ interestedWork });
}

export async function POST(req) {
    try {
        // เชื่อมต่อฐานข้อมูลก่อน (หากยังไม่เชื่อมต่อ)
        await mongoDB();

        // อ่านข้อมูลจาก request
        const data = await req.json();
        const { uuid, interestedWork } = data;

        if (!uuid) {
            return NextResponse.json({ message: "UUID is required" }, { status: 400 });
        }

        // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
        const result = await Resume.findOneAndUpdate(
            { uuid }, // ค้นหาข้อมูลจาก uuid
            { interestedWork }, // อัปเดตข้อมูลถ้าพบ uuid ตรงกัน
            { upsert: true, new: true } // สร้างใหม่ถ้าไม่พบข้อมูล (upsert) และคืนค่าเอกสารที่อัปเดตแล้ว
        );

        return NextResponse.json({ message: "Education data created/updated successfully", data: result }, { status: 200 });
    } catch (error) {
        console.error("Error creating/updating education data:", error);
        return NextResponse.json({ message: "Error creating/updating education data" }, { status: 500 });
    }
}
