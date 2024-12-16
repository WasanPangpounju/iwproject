import { mongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Companys from "@/models/company";

export async function GET(req) {
    const id = req.nextUrl.pathname.split('/').filter(Boolean).pop();
    await mongoDB();
    const company = await Companys.findOne({ _id: id })
    return NextResponse.json({ company });
}

export async function PUT(req) {
    const id = req.nextUrl.pathname.split('/').filter(Boolean).pop();

    try {
        await mongoDB();

        const {
            nameCompany,
            address,
            province,
            amphor,
            tambon,
            zipcode,
            work_type,
            work_detail,
            date_start,
            date_end,
            time_start,
            time_end,
            welfare,
            coordinator,
            coordinator_tel
        } = await req.json();

        // อัปเดตข้อมูลผู้ใช้ในฐานข้อมูล
        const result = await Companys.findOneAndUpdate(
            { _id: id }, 
            {
                nameCompany,
                address,
                province,
                amphor,
                tambon,
                zipcode,
                work_type,
                work_detail,
                date_start,
                date_end,
                time_start,
                time_end,
                welfare,
                coordinator,
                coordinator_tel
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

export async function DELETE(req) {
    const id = req.nextUrl.pathname.split('/').filter(Boolean).pop();
    await mongoDB();
    try {
        // Attempt to find and delete the user by the correct field
        const result = await Companys.findByIdAndDelete(id);
        if (!result) {
            return new Response(JSON.stringify({ error: "User not found or already deleted." }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        return new Response(JSON.stringify({ message: "User deleted successfully." }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return new Response(JSON.stringify({ error: `Failed to delete user: ${error.message}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

