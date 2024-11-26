import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";
import bcrypt from 'bcrypt'; // นำเข้า bcrypt

export async function POST(req) {
    try {
        const { id ,user, password, firstName, lastName, typeDisabled, university, email, typePerson, idCard } = await req.json();

        const hashedPassword = await bcrypt.hash(password, 10); // 10 คือค่า salt rounds

        // console.log(id ,user, password, firstName, lastName, typeDisabled, university, email, typePerson, idCard)
        await mongoDB();
        await Users.create({ uuid: id, user: user, password: hashedPassword, firstName: firstName, lastName: lastName, typeDisabled: typeDisabled, university: university, email: email, typePerson: typePerson, idCard: idCard });
        return NextResponse.json({ message: "Created User" }, { status: 201 })
    } catch {
        return NextResponse.json({ message: "Error Create User" }, { status: 500 })
    }
}

