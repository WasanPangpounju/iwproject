import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";

export async function POST(req) {
    try {
        await mongoDB();

        const { user: username, email } = await req.json();

        const user = await Users.findOne({ user: username }).select("_id");
        const userEmail = await Users.findOne({ email }).select("_id");

        return NextResponse.json({ user, email: userEmail });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" }, { status: 500 });
    }
}
