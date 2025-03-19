const { MongoClient } = require('mongodb');
const xlsx = require('xlsx');
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();

// เชื่อมต่อกับ MongoDB Atlas
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
    try {
        // เชื่อมต่อกับฐานข้อมูล
        await client.connect();
        const database = client.db('iw'); // แทนที่ด้วยชื่อฐานข้อมูลที่คุณต้องการ
        const userCollection = database.collection('users'); // คอลเลกชัน users

        // อ่านข้อมูลจาก Excel
        const workbook = xlsx.readFile('admin.xlsx');
        const sheetNameUser = "เจ้าหน้าที่DSS";

        // อ่านข้อมูลจากแถวที่สองเป็น header (header: 1)
        const dataUser = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameUser], { header: 1 });

        // กรองแถวที่ว่างหรือไม่จำเป็นออก
        const validDataUser = dataUser.filter(row => row && row.length > 0); // กรองแถวที่ว่าง

        // ข้ามแถวแรกที่เป็นหัวข้อ
        const headers = validDataUser[1]; // แถวที่ 2 เป็น header
        const users = validDataUser.slice(2); // ข้อมูลหลังแถวที่ 2

        // สร้าง mapping สำหรับชื่อเดือน
        const monthNames = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
            "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
            "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];

        // วนลูปตามจำนวนข้อมูลใน users
        for (let i = 0; i < users.length; i++) {
            const uuid = uuidv4(); // สร้าง UUID ใหม่สำหรับแต่ละระเบียน

            let record = users[i];

            // ใช้ headers สำหรับการตั้งชื่อคอลัมน์
            let mappedRecord = {};

            // วนลูปตาม headers และจับคู่ข้อมูล
            for (let j = 0; j < headers.length; j++) {
                mappedRecord[headers[j]] = record[j];
            }

            // แยก "name" เป็น firstName และ lastName
            if (mappedRecord.name) {
                const nameParts = mappedRecord.name.split(' '); // แยกชื่อและนามสกุล
                mappedRecord.firstName = nameParts.slice(0, -1).join(' '); // ใช้คำทั้งหมดก่อนสุดท้ายเป็น firstName
                mappedRecord.lastName = nameParts.slice(-1).join(' '); // ใช้คำสุดท้ายเป็น lastName
            }

            // กำหนดค่าเริ่มต้นสำหรับ user
            mappedRecord.password = '1234';  // กำหนด password เป็น 1234
            mappedRecord.role = 'admin';
            mappedRecord.createdAt = new Date().toISOString(); // เพิ่มเวลาปัจจุบัน
            mappedRecord.uuid = uuid; // เพิ่ม UUID ให้กับ record
            mappedRecord.university = mappedRecord.university || "-"; // ถ้าไม่มีค่า university ให้กำหนดเป็น "-"

            // แปลง monthBirthday เป็นชื่อเดือน
            if (mappedRecord.monthBirthday) {
                const monthIndex = parseInt(mappedRecord.monthBirthday, 10) - 1; // แปลงหมายเลขเป็นดัชนี (0-11)
                mappedRecord.monthBirthday = monthNames[monthIndex] || "เลือกเดือน"; // ใช้ชื่อเดือนจาก array
            } else {
                mappedRecord.monthBirthday = "เลือกเดือน"; // ค่าเริ่มต้น
            }

            // แปลงปี พ.ศ. เป็นปี ค.ศ.
            if (mappedRecord.yearBirthday) {
                mappedRecord.yearBirthday = parseInt(mappedRecord.yearBirthday, 10) - 543; // ลบ 543
            }

            // นำเข้าข้อมูลไปยังคอลเลกชัน users
            await userCollection.insertOne(mappedRecord);
        }

        console.log("นำเข้าข้อมูลเสร็จสิ้น!");
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
    } finally {
        await client.close();
    }
}

run().catch(console.error);
