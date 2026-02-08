import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb"; // เชื่อมต่อ MongoDB ของคุณ
import Chats from "@/models/chat";

export async function GET(req) {
  try {
    await mongoDB();
    const chats = await Chats.find({});
    return NextResponse.json({ chats });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Error get chat message" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await mongoDB();

    const {
      userId,
      message,
      senderRole,
      nameDocument,
      file,
      statusRead = false,
      statusReadAdmin = false,
    } = await req.json();

    if (!userId || (!message && !file)) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const chat = await Chats.findOneAndUpdate(
      { uuid: userId },
      {
        $push: {
          roomChat: {
            message,
            senderRole,
            nameDocument: nameDocument || [],
            file: file || [],
            timestamp: new Date(),
          },
        },
        $set: {
          statusRead,
          statusReadAdmin,
        },
        $setOnInsert: {
          uuid: userId,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );

    return NextResponse.json(
      { message: "success", data: chat },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error saving chat message:", error);
    return NextResponse.json(
      { message: "Error saving chat message" },
      { status: 500 },
    );
  }
}
