import { mongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import HistoryWork from "@/models/historyWork";

export async function GET(req) {
    const id = req.nextUrl.pathname.split('/').filter(Boolean).pop();
    await mongoDB();
    const historyWork = await HistoryWork.findOne({ uuid: id })
    return NextResponse.json({ historyWork });
}

