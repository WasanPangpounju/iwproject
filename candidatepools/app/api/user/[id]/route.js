import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req) {
    const email = req.nextUrl.pathname.split('/').pop();
    await mongoDB();
    const user = await Users.findOne({ email: email })
    return NextResponse.json({ user });
}

export async function PUT(req) {
    const sessionEmail = req.nextUrl.pathname.split('/').pop(); // ดึง email จาก URL

    try {
        await mongoDB();

        const {
            user,
            password,
            firstName,
            lastName,
            profile,
            typeDisabled,
            detailDisabled,
            university,
            email,
            prefix,
            nickname,
            sex,
            dateBirthday, 
            monthBirthday,
            yearBirthday,
            nationality,
            religion,
            idCard,
            idCardDisabled,
            addressIdCard,
            addressIdCardProvince,
            addressIdCardAmphor,
            addressIdCardTambon,
            addressIdCardZipCode,
            address,
            addressProvince,
            addressAmphor,
            addressTambon,
            addressZipCode,
            tel,
            telEmergency,
            relationship
        } = await req.json();

        // อัปเดตข้อมูลผู้ใช้ในฐานข้อมูล
        const result = await Users.findOneAndUpdate(
            { email: sessionEmail }, // ใช้ email เป็น filter
            { 
                user,
                password,
                firstName,
                lastName,
                profile,
                typeDisabled,
                detailDisabled,
                university,
                email,
                prefix,
                nickname,
                sex,
                dateBirthday,
                monthBirthday,
                yearBirthday,
                nationality,
                religion,
                idCard,
                idCardDisabled,
                addressIdCard,
                addressIdCardProvince,
                addressIdCardAmphor,
                addressIdCardTambon,
                addressIdCardZipCode,
                address,
                addressProvince,
                addressAmphor,
                addressTambon,
                addressZipCode,
                tel,
                telEmergency,
                relationship,
            },
            { new: true } // ส่งกลับเอกสารที่อัปเดตใหม่
        );

        if (!result) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: "Error updating user" }, { status: 500 });
    }
}