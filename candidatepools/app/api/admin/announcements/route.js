import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Announcement from "@/models/Announcement";

// TODO: ใส่ auth/role admin ของคุณ (Clerk / sessionClaims.metadata.role)

export async function GET() {
  await dbConnect();
  const items = await Announcement.find({})
    .sort({ pinned: -1, publishedAt: -1, createdAt: -1 })
    .limit(200)
    .lean();

  return NextResponse.json({ items });
}

  export async function POST(req) {
  //     const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // if (!token || token.role !== "admin") {
  //   return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  // }
  
  await dbConnect();
  const body = await req.json();

//   if (!body.title || !body.description || !body.content) {
//   return NextResponse.json(
//     { error: "missing required fields" },
//     { status: 400 }
//   );
// }

  const created = await Announcement.create({
    title: body.title,
    description: body.description,
    content: body.content,
    imageUrl: body.imageUrl || "",
    linkUrl: body.linkUrl || "",
    linkText: body.linkText || "",
    pinned: !!body.pinned,
    publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
    isActive: true,
  });

  return NextResponse.json({ item: created }, { status: 201 });
}
