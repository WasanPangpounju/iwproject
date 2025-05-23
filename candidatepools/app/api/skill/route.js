import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb"; // เชื่อมต่อ MongoDB ของคุณ
import Skills from "@/models/skill";

export async function POST(req) {
    try {
        // เชื่อมต่อฐานข้อมูลก่อน (หากยังไม่เชื่อมต่อ)
        await mongoDB();

        // อ่านข้อมูลจาก request
        const data = await req.json();
        const { uuid, skills, trains } = data;

        if (!uuid) {
            return NextResponse.json({ message: "UUID is required" }, { status: 400 });
        }

        // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
        const result = await Skills.findOneAndUpdate(
            { uuid }, // ค้นหาข้อมูลจาก uuid
            { skills, trains }, // อัปเดตข้อมูลถ้าพบ uuid ตรงกัน
            { upsert: true, new: true } // สร้างใหม่ถ้าไม่พบข้อมูล (upsert) และคืนค่าเอกสารที่อัปเดตแล้ว
        );

        return NextResponse.json({ message: "Education data created/updated successfully", data: result }, { status: 200 });
    } catch (error) {
        console.error("Error creating/updating education data:", error);
        return NextResponse.json({ message: "Error creating/updating education data" }, { status: 500 });
    }
}
