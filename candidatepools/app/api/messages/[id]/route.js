import { mongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Chats from "@/models/chat";

export async function GET(req) {
    const id = req.nextUrl.pathname.split('/').filter(Boolean).pop();
    await mongoDB();

    const chats = await Chats.findOne({ uuid: id })
    return NextResponse.json({ chats });
}


export async function PUT(req) {
    const id = req.nextUrl.pathname.split('/').filter(Boolean).pop();

    try {
        await mongoDB();

        const {
            statusRead,
        } = await req.json();

        // อัปเดตข้อมูลผู้ใช้ในฐานข้อมูล
        const result = await Chats.findOneAndUpdate(
            { uuid: id }, // ใช้ email เป็น filter
            {
                statusRead
            },
            { new: true } // ส่งกลับเอกสารที่อัปเดตใหม่
        );

        if (!result) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ data: result }, { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: "Error updating user" }, { status: 500 });
    }
}