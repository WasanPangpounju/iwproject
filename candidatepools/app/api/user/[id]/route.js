import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req){
    const email = req.nextUrl.pathname.split('/').pop();
    await mongoDB();
    const user = await Users.findOne({ email:email })
    return NextResponse.json({ user });
}
