const { MongoClient } = require('mongodb');
const xlsx = require('xlsx');
const { v4: uuidv4 } = require('uuid'); // ติดตั้ง uuid ด้วย npm install uuid
require("dotenv").config();

// เชื่อมต่อกับ MongoDB Atlas
const uri = process.env.MONGODB_URI; // แทนที่ด้วย Connection String ของคุณ
const client = new MongoClient(uri);

async function run() {
    try {
        // เชื่อมต่อกับฐานข้อมูล
        await client.connect();
        const database = client.db('iw'); // แทนที่ด้วยชื่อฐานข้อมูลที่คุณต้องการ
        const userCollection = database.collection('users'); // คอลเลกชัน users
        const educationCollection = database.collection('educations'); // คอลเลกชัน educations

        // อ่านข้อมูลจาก Excel
        const workbook = xlsx.readFile('update_users.xlsx'); // แทนที่ด้วย path ที่แท้จริงของไฟล์ Excel
        const sheetNameUser = "user"; // ชื่อ sheet สำหรับ users
        const sheetNameEducation = "education"; // ชื่อ sheet สำหรับ education

        const dataUser = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameUser]);
        const dataEducation = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameEducation]);

        // สร้าง mapping ระหว่างประเภทที่มีอยู่กับประเภทที่ต้องการ
        const disabledTypeMapping = {
            "ประเภท 1 ทางการเห็น": "พิการทางการมองเห็น",
            "ประเภท 2 ทางการได้ยินหรือสื่อความหมาย": "พิการทางการได้ยินหรือสื่อความหมาย",
            "ประเภท 3 ทางการเคลื่อนไหวหรือร่างกาย": "พิการทางการเคลื่อนไหวหรือทางร่างกาย",
            "ประเภท 4 ทางจิตใจหรือพฤติกรรม": "พิการทางจิตใจหรือพฤติกรรม",
            "ประเภท 5 ทางสติปัญญา": "พิการทางสติปัญญา",
            "ประเภท 6 ทางการเรียนรู้": "พิการทางการเรียนรู้",
            "ประเภท 7 ทางออทิสติก": "พิการทางการออทิสติก"
        };

        // สร้าง mapping สำหรับชื่อเดือน
        const monthNames = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
            "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
            "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];

        // ตรวจสอบให้แน่ใจว่า users และ educations มีจำนวนแถวเท่ากัน
        if (dataUser.length !== dataEducation.length) {
            console.error("จำนวนแถวของ user และ education ไม่ตรงกัน");
            return;
        }

        // วนลูปตามจำนวนข้อมูลใน users
        for (let i = 0; i < dataUser.length; i++) {
            const uuid = uuidv4(); // สร้าง UUID ใหม่สำหรับแต่ละระเบียน

            let record = dataUser[i];
            let educationRecord = dataEducation[i];

            // กำหนดค่าเริ่มต้นสำหรับ user
            record.password = '1234';  // กำหนด password เป็น 1234
            record.role = 'user'; // กำหนด role เป็น user
            record.createdAt = new Date().toISOString(); // เพิ่มเวลาปัจจุบัน
            record.uuid = uuid; // เพิ่ม UUID ให้กับ record
            record.university = record.university || educationRecord.university || "-"; // ถ้าไม่มีค่า university ให้กำหนดเป็น "-"

            // แปลง monthBirthday เป็นชื่อเดือน
            if (record.monthBirthday) {
                const monthIndex = parseInt(record.monthBirthday, 10) - 1; // แปลงหมายเลขเป็นดัชนี (0-11)
                record.monthBirthday = monthNames[monthIndex] || "เลือกเดือน"; // ใช้ชื่อเดือนจาก array
            } else {
                record.monthBirthday = "เลือกเดือน"; // ค่าเริ่มต้น
            }

            // แปลงปี พ.ศ. เป็นปี ค.ศ.
            if (record.yearBirthday) {
                record.yearBirthday = parseInt(record.yearBirthday, 10) - 543; // ลบ 543
            }

            // ตรวจสอบและปรับค่าของ typeDisabled
            if (record.typeDisabled) {
                const originalTypes = record.typeDisabled.split(', '); // แยกประเภทที่มีหลายค่า
                record.typeDisabled = originalTypes.map(originalType => {
                    return disabledTypeMapping[originalType.trim()] || "เลือกประเภทความพิการ";
                });
            } else {
                record.typeDisabled = ["เลือกประเภทความพิการ"]; // ค่าเริ่มต้น
            }

            // ถ้า typePerson ของ education ไม่ใช่ "กำลังศึกษาระดับ ป.ตรี" ให้กำหนดเป็น "บัญฑิตพิการ"
            if (educationRecord.typePerson !== "กำลังศึกษาระดับ ป.ตรี") {
                educationRecord.typePerson = "บัณฑิตพิการ";
                record.typePerson = "บัณฑิตพิการ";
            } else {
                educationRecord.typePerson = "นักศึกษาพิการ";
                record.typePerson = "นักศึกษาพิการ";
            }

            if (educationRecord.level === "ชั้นปีที่ 1") {
                educationRecord.level = '1'
                educationRecord.educationLevel = "ปริญญาตรี"
            } else if (educationRecord.level === "ชั้นปีที่ 2") {
                educationRecord.level = '2'
                educationRecord.educationLevel = "ปริญญาตรี"
            } else if (educationRecord.level === "ชั้นปีที่ 3") {
                educationRecord.level = '3'
                educationRecord.educationLevel = "ปริญญาตรี"
            } else if (educationRecord.level === "ชั้นปีที่ 4") {
                educationRecord.level = '4'
                educationRecord.educationLevel = "ปริญญาตรี"
            }

            // แปลงปี พ.ศ. เป็นปี ค.ศ.
            if (educationRecord.yearGraduation) {
                educationRecord.yearGraduation = parseInt(educationRecord.yearGraduation, 10) - 543; // ลบ 543
            }

            // นำเข้าข้อมูลไปยังคอลเลกชัน users
            await userCollection.insertOne(record);

            // ตรวจสอบและกำหนดค่า typePerson ให้กับ education
            educationRecord.typePerson = educationRecord.typePerson || record.typePerson; // ใช้ typePerson จาก user ถ้าไม่มีค่าใน education

            // สร้างข้อมูลสำหรับคอลเลกชัน educations
            educationRecord.uuid = uuid; // ใช้ UUID เดียวกัน
            educationRecord.university = educationRecord.university || record.university; // ใช้ university จาก education ถ้าไม่มีให้ใช้จาก user

            // นำเข้าข้อมูลไปยังคอลเลกชัน educations
            await educationCollection.insertOne(educationRecord);
        }

        console.log("นำเข้าข้อมูลเสร็จสิ้น!");
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
    } finally {
        await client.close();
    }
}

run().catch(console.error);
