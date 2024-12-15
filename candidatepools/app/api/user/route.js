import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"; // สร้าง UUID ใหม่
import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";

export async function POST(req) {
    try {
        const {
            id,
            user,
            password,
            firstName,
            lastName,
            firstNameEng,
            lastNameEng,
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
            role,
            position
        } = await req.json();

        // เชื่อมต่อ MongoDB
        await mongoDB();

        // ตรวจสอบว่ามี id หรือไม่ ถ้าไม่มี ให้สร้าง UUID ใหม่

        // สร้างผู้ใช้งานใน MongoDB
        await Users.create({
            uuid: id,
            user: user,
            password: password,
            firstName: firstName,
            lastName: lastName,
            firstNameEng: firstNameEng,
            lastNameEng: lastNameEng,
            profile: profile,
            typeDisabled: typeDisabled,
            detailDisabled: detailDisabled,
            university: university,
            email: email,
            prefix: prefix,
            nickname: nickname,
            sex: sex,
            dateBirthday: dateBirthday,
            monthBirthday: monthBirthday,
            yearBirthday: yearBirthday,
            nationality: nationality,
            religion: religion,
            idCard: idCard,
            idCardDisabled: idCardDisabled,
            addressIdCard: addressIdCard,
            addressIdCardProvince: addressIdCardProvince,
            addressIdCardAmphor: addressIdCardAmphor,
            addressIdCardTambon: addressIdCardTambon,
            addressIdCardZipCode: addressIdCardZipCode,
            address: address,
            addressProvince: addressProvince,
            addressAmphor: addressAmphor,
            addressTambon: addressTambon,
            addressZipCode: addressZipCode,
            tel: tel,
            telEmergency: telEmergency,
            relationship: relationship,
            typePerson: typePerson,
            role: role,
            position: position
        });

        return NextResponse.json({ message: "Created User" }, { status: 201 });
    } catch (error) {
        console.error("User creation error:", error.message);
        return NextResponse.json({ message: "Error Create User" }, { status: 500 });
    }
}
