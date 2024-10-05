import { mongoDB } from "@/lib/mongodb";
import Educations from "@/models/education"; 
import { NextResponse } from "next/server";

export async function GET(req) {
    const email = req.nextUrl.pathname.split('/').pop();
    await mongoDB();
    const educations = await Educations.findOne({ email: email })
    return NextResponse.json({ educations });
}

