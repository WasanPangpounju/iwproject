import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";


export async function GET(req) {
    await mongoDB();
    const user = await Users.find({})
    return NextResponse.json({ user });
}

