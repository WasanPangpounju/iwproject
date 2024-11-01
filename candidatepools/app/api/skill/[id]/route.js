import { mongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Skills from "@/models/skill";

export async function GET(req) {
    const id = req.nextUrl.pathname.split('/').filter(Boolean).pop();
    await mongoDB();
    const skills = await Skills.findOne({ uuid: id })
    return NextResponse.json({ skills });
}

