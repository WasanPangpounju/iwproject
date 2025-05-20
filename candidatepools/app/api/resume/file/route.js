import { mongoDB } from "@/lib/mongodb";
import Resume from "@/models/resume";
export async function POST(req) {
  try {
    await mongoDB();

    const body = await req.json();
    const { uuid, file } = body; // ← เปลี่ยนจาก files เป็น file

    if (!uuid || !file) {
      return Response.json(
        { message: "กรุณาระบุ uuid และข้อมูลไฟล์ให้ครบถ้วน" },
        { status: 400 }
      );
    }

    let resume = await Resume.findOne({ uuid });

    if (!resume) {
      resume = new Resume({
        uuid,
        files: [file], // สร้างใหม่พร้อมไฟล์
        interestedWork: [],
      });
    } else {
      if (!Array.isArray(resume.files)) {
        resume.files = [];
      }
      resume.files.push(file); // เพิ่มไฟล์ใหม่
    }

    await resume.save();

    return Response.json({ message: "บันทึกไฟล์เรียบร้อยแล้ว", resume });
  } catch (error) {
    console.error("Upload Resume Error:", error);
    return Response.json(
      { message: "เกิดข้อผิดพลาดที่ server" },
      { status: 500 }
    );
  }
}

// อัปเดตชื่อไฟล์ใน Resume ตาม uuid และ fileUrl
export async function PATCH(req) {
  try {
    await mongoDB();

    const { uuid, fileUrl, newFileName } = await req.json();

    if (!uuid || !fileUrl || !newFileName) {
      return Response.json(
        { message: "กรุณาระบุ uuid, fileUrl และ newFileName" },
        { status: 400 }
      );
    }

    const resume = await Resume.findOne({ uuid });

    if (!resume) {
      return Response.json({ message: "ไม่พบข้อมูล Resume" }, { status: 404 });
    }

    const fileIndex = resume.files.findIndex(
      (file) => file.fileUrl === fileUrl
    );
    if (fileIndex === -1) {
      return Response.json(
        { message: "ไม่พบไฟล์ที่ต้องการอัปเดต" },
        { status: 404 }
      );
    }

    // อัปเดตชื่อไฟล์
    resume.files[fileIndex].fileName = newFileName;

    await resume.save();

    return Response.json(
      { message: "อัปเดตชื่อไฟล์เรียบร้อยแล้ว" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Update file name error:", err);
    return Response.json(
      { message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await mongoDB();

    const { searchParams } = new URL(req.url);
    const uuid = searchParams.get("uuid");

    if (!uuid) {
      return Response.json({ message: "กรุณาระบุ uuid" }, { status: 400 });
    }

    const resume = await Resume.findOne({ uuid });

    if (!resume) {
      return Response.json({ message: "ไม่พบข้อมูล Resume" }, { status: 404 });
    }

    return Response.json({ files: resume.files }, { status: 200 });
  } catch (error) {
    console.error("Get resume error:", error);
    return Response.json(
      { message: "เกิดข้อผิดพลาดที่ server" },
      { status: 500 }
    );
  }
}

// DELETE: ลบไฟล์ออกจาก resume
export async function DELETE(req) {
  try {
    await mongoDB();

    const { uuid, fileUrl } = await req.json();

    if (!uuid || !fileUrl) {
      return Response.json(
        { message: "กรุณาระบุ uuid และ fileUrl" },
        { status: 400 }
      );
    }

    const resume = await Resume.findOne({ uuid });

    if (!resume) {
      return Response.json({ message: "ไม่พบข้อมูล Resume" }, { status: 404 });
    }

    // กรองไฟล์ที่ไม่ต้องการลบ
    const updatedFiles = resume.files.filter(
      (file) => file.fileUrl !== fileUrl
    );

    if (updatedFiles.length === resume.files.length) {
      return Response.json(
        { message: "ไม่พบไฟล์ที่ต้องการลบ" },
        { status: 404 }
      );
    }

    resume.files = updatedFiles;
    await resume.save();

    return Response.json({ message: "ลบไฟล์เรียบร้อยแล้ว" }, { status: 200 });
  } catch (error) {
    console.error("Delete resume file error:", error);
    return Response.json(
      { message: "เกิดข้อผิดพลาดที่ server" },
      { status: 500 }
    );
  }
}
