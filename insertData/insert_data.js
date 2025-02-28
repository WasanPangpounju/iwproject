const { MongoClient } = require('mongodb');
const xlsx = require('xlsx');
const { v4: uuidv4 } = require('uuid'); // ติดตั้ง uuid ด้วย npm install uuid

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
        const workbook = xlsx.readFile('users.xlsx'); // แทนที่ด้วย path ที่แท้จริงของไฟล์ Excel
        const sheetName = "data";
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

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

        // กำหนดค่า password, typePerson, และ role สำหรับทุกระเบียน
        for (const record of data) {
            const uuid = uuidv4(); // สร้าง UUID ใหม่สำหรับแต่ละระเบียน
            record.password = '1234';  // กำหนด password เป็น 1234
            record.typePerson = 'นักศึกษาพิการ';  // กำหนด typePerson เป็น นักศึกษาพิการ
            record.role = 'user'; // กำหนด role เป็น user
            record.createdAt = new Date().toISOString(); // เพิ่มเวลาปัจจุบัน

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
                // ถ้าไม่มีข้อมูลให้เลือกประเภทที่ 1
                record.typeDisabled = ["เลือกประเภทความพิการ"]; // ค่าเริ่มต้น
            }

            // นำเข้าข้อมูลไปยังคอลเลกชัน users
            record.uuid = uuid; // เพิ่ม UUID ให้กับ record เพื่อให้ตรงกับ educations
            record.university = record.university || "-"; // กำหนด university ถ้าไม่มีค่า
            await userCollection.insertOne(record);

            // สร้างข้อมูลสำหรับคอลเลกชัน educations
            const educationRecord = {
                uuid: uuid, // ใช้ UUID เดียวกัน
                typePerson: record.typePerson,
                university: record.university, // ใช้ข้อมูล university จาก record
            };

            // นำเข้าข้อมูลไปยังคอลเลกชัน educations
            await educationCollection.insertOne(educationRecord);
        }

        console.log("นำเข้าข้อมูลเสร็จสิ้น!");
    } finally {
        await client.close();
    }
}

run().catch(console.error);
