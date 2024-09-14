import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";

export async function POST(req) {
    try {
        await mongoDB();

        const { idCard: idCard, idCardDisabled: idCardDisabled } = await req.json();

        const idcard = await Users.findOne({ idCard: idCard }).select("_id");
        const idcarddisabled = await Users.findOne({ idCardDisabled: idCardDisabled }).select("_id");

        return NextResponse.json({ idCard: idcard, idCardDisabled: idcarddisabled });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" }, { status: 500 });
    }
}