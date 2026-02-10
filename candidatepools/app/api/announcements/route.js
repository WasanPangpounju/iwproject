export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Announcement from "@/models/Announcement";

export async function GET() {
  await dbConnect();

  const items = await Announcement.find({ isActive: true })
    .sort({ pinned: -1, publishedAt: -1, createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json({ items });
}
