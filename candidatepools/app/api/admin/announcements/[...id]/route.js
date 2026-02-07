import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Announcement from "@/models/Announcement";

// TODO: ใส่ auth/role admin ของคุณ

  export async function PUT(req, ctx) {
  await dbConnect();
  const body = await req.json();

  const updated = await Announcement.findByIdAndUpdate(
    ctx.params.id,
    {
      title: body.title,
      description: body.description,
      content: body.content,
      imageUrl: body.imageUrl || "",
      linkUrl: body.linkUrl || "",
      linkText: body.linkText || "",
      pinned: !!body.pinned,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
      isActive: body.isActive !== undefined ? !!body.isActive : undefined,
    },
    { new: true }
  );

  return NextResponse.json({ item: updated });
}

  export async function DELETE(_req, ctx) {
  await dbConnect();
  await Announcement.findByIdAndDelete(ctx.params.id);
  return NextResponse.json({ ok: true });
}
