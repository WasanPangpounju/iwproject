import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req) {
    const id = req.nextUrl.pathname.split('/').filter(Boolean).pop();
    await mongoDB();
    const user = await Users.findOne({ uuid: id })
    return NextResponse.json({ user });
}

export async function PUT(req) {
    const id = req.nextUrl.pathname.split('/').filter(Boolean).pop();

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
            relationship,
            typePerson
        } = await req.json();

        // อัปเดตข้อมูลผู้ใช้ในฐานข้อมูล
        const result = await Users.findOneAndUpdate(
            { uuid: id }, // ใช้ email เป็น filter
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
                typePerson,
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