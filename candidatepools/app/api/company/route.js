import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb"; // เชื่อมต่อ MongoDB
import Companys from "@/models/company";

export async function POST(req) {
    try {
        // เชื่อมต่อฐานข้อมูล
        await mongoDB();

        // อ่านข้อมูลจาก request body
        const data = await req.json();
        const {
            nameCompany,
            address,
            province,
            amphor,
            tambon,
            zipcode,
            work_type,
            work_detail,
            date_start,
            date_end,
            time_start,
            time_end,
            welfare,
            coordinator,
            coordinator_tel
        } = data;

        // สร้างเอกสารใหม่ใน MongoDB
        const result = await Companys.create({
            nameCompany,
            address,
            province,
            amphor,
            tambon,
            zipcode,
            work_type,
            work_detail,
            date_start,
            date_end,
            time_start,
            time_end,
            welfare,
            coordinator,
            coordinator_tel
        });

        // ส่งผลลัพธ์กลับไปยัง client
        return NextResponse.json(
            { message: "Company data created successfully", data: result },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error creating company data:", error);
        return NextResponse.json(
            { message: "Error creating company data" },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    await mongoDB();
    const companys = await Companys.find({})
    return NextResponse.json({ companys });
}

