import { mongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Resume from "@/models/resume";

export async function GET(req) {
    const id = req.nextUrl.pathname.split('/').filter(Boolean).pop();
    await mongoDB();
    const interestedWork = await Resume.findOne({ uuid: id })
    return NextResponse.json({ interestedWork });
}

