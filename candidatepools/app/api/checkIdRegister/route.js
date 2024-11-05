import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";

export async function POST(req) {
    try {
        await mongoDB();

        const { idCard: idCard } = await req.json();

        const idcard = await Users.findOne({ idCard: idCard }).select("_id");

        return NextResponse.json({ idCard: idcard });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" }, { status: 500 });
    }
}