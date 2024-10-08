import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";
import GoogleProvider from "next-auth/providers/google";
import LineProvider from 'next-auth/providers/line';
import { v4 as uuidv4 } from 'uuid'; // นำเข้า UUID


const authOption = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        LineProvider({
            clientId: process.env.LINE_CLIENT_ID,
            clientSecret: process.env.LINE_CLIENT_SECRET
        }),

        CredentialsProvider({
            name: 'credentials',
            credentials: {},
            async authorize(credentials, req) {
                const { email, password } = credentials;

                try {
                    await mongoDB();

                    // ค้นหาผู้ใช้ตามอีเมลหรือชื่อผู้ใช้
                    const userDocument = await Users.findOne({
                        $or: [{ email: email }, { user: email }]
                    });

                    if (!userDocument) {
                        // ไม่พบผู้ใช้
                        return null;
                    }

                    // ตรวจสอบรหัสผ่าน
                    if (userDocument.password !== password) {
                        // รหัสผ่านไม่ถูกต้อง
                        return null;
                    }

                    // ส่งคืนข้อมูลผู้ใช้หากสำเร็จ
                    return userDocument;

                } catch (err) {
                    console.error('เกิดข้อผิดพลาดระหว่างการตรวจสอบ:', err);
                    return null; 
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            // หาก user มีข้อมูลให้ตรวจสอบว่ามี uuid อยู่ใน token หรือไม่
            if (user) {
                if (!token.id) {
                    // ตรวจสอบว่าผู้ใช้มี uuid อยู่ในฐานข้อมูลแล้วหรือไม่
                    const existingUser = await Users.findOne({ email: user.email });
    
                    if (existingUser && existingUser.uuid) {
                        // หากผู้ใช้มี uuid ให้ใช้ uuid นั้น
                        token.id = existingUser.uuid;
                    } else {
                        // หากไม่มี uuid ให้สร้าง uuid ใหม่
                        token.id = uuidv4();
                    }
                }
            }
            return token;
        },
        async session({ session, token }) {
            // กำหนดข้อมูลใน session ให้มี uuid คงที่
            session.user.id = token.id;
            return session;
        }
    },    
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/"
    }
}

const handler = NextAuth(authOption);
export { handler as GET, handler as POST };
