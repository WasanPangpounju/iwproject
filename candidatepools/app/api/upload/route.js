import { NextResponse } from "next/server";
import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        // Load JSON file (Make sure it's in the `public` folder)
        const filePath = path.join(process.cwd(), "public", "output.json");
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ message: "JSON file not found" }, { status: 404 });
        }

        const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        if (!jsonData || jsonData.length === 0) {
            return NextResponse.json({ message: "No data found in JSON file" }, { status: 400 });
        }

        // Connect to MongoDB
        await mongoDB();

        // Insert data into MongoDB
        await Users.insertMany(jsonData);

        return NextResponse.json({ message: "Data uploaded successfully" }, { status: 201 });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ message: "Error uploading data" }, { status: 500 });
    }
}
