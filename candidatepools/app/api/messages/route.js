import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb"; // เชื่อมต่อ MongoDB ของคุณ
import Chats from "@/models/chat";

export default async function handler(req, res) {
    await connectMongo();

    if (req.method === "POST") {
        const { message, sender } = req.body;
        const newMessage = await ChatMessage.create({ message, sender });
        res.status(201).json(newMessage);
    } else if (req.method === "GET") {
        const messages = await ChatMessage.find().sort({ timestamp: 1 }); // เรียงตามเวลา
        res.status(200).json(messages);
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}