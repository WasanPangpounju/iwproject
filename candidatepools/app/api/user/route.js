import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";

export async function POST(req) {
    try {
        const { user, password, firstName, lastName, typeUser, university, email } = await req.json();
        await mongoDB();
        await Users.create({ user:user, password:password, firstName:firstName, lastName:lastName, typeUser:typeUser, university:university, email:email });
        return NextResponse.json({ message: "Created User" }, { status: 201 })
    }catch{
        return NextResponse.json({ message: "Error Create User" }, { status: 500 })
    }
}