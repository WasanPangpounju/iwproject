import { mongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Chats from "@/models/chat";

export async function GET(req) {
    const id = req.nextUrl.pathname.split('/').filter(Boolean).pop();
    await mongoDB();

    const chats = await Chats.findOne({ uuid: id })
    return NextResponse.json({ chats });
}

