import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb";
import Educations from "@/models/education";

export async function POST(req) {
    try {
        const { user, password, firstName, lastName, typeDisabled, university, email, typePerson } = await req.json();
        await mongoDB();
        await Educations.create({ user: user, password: password, firstName: firstName, lastName: lastName, typeDisabled: typeDisabled, university: university, email: email, typePerson: typePerson });
        return NextResponse.json({ message: "Created User" }, { status: 201 })
    } catch {
        return NextResponse.json({ message: "Error Create User" }, { status: 500 })
    }
}

