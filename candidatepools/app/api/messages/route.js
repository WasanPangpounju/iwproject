import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb"; // เชื่อมต่อ MongoDB ของคุณ
import Chats from "@/models/chat";

export async function GET(req) {
    try {
        await mongoDB();
        const chats = await Chats.find({});
        return NextResponse.json({ chats })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: "Error get chat message" }, { status: 500 });
    }
}

export async function POST(req) {
    try {

        const { userId, message, senderRole, statusRead, statusReadAdmin } = await req.json(); // ดึงข้อมูลจาก body ของ POST request

        // เชื่อมต่อกับ MongoDB
        await mongoDB();

        // บันทึกข้อความใน MongoDB
        const chat = await Chats.findOneAndUpdate(
            { uuid: userId }, // ใช้ userId เพื่อค้นหา chat
            {
                $push: { roomChat: { message, senderRole, timestamp: new Date() } }, // เพิ่มข้อความใหม่ลงใน array
                $set: { statusRead: statusRead, statusReadAdmin: statusReadAdmin } // เพิ่มการอัปเดต statusRead ในการอัปเดตเดียวกัน
            },
           
            { upsert: true, new: true } // upsert: true -> ถ้าไม่พบจะสร้างใหม่, new: true -> ส่งค่าผลลัพธ์ใหม่หลังการอัพเดต
        );
        return NextResponse.json({ message: "success", data: chat }, { status: 200 });
    } catch (error) {
        console.error('Error saving chat message:', error);
        return NextResponse.json({ message: "Error saving chat message" }, { status: 500 });
    }
}