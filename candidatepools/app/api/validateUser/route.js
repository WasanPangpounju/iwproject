import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";

export async function POST(req){
    const { email } = await req.json();
    await mongoDB()
    const user = await Users.findOne({ email }).select("_id")
    return NextResponse.json({ user })
}