import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";
import GoogleProvider from "next-auth/providers/google";
import LineProvider from 'next-auth/providers/line';
import { v4 as uuidv4 } from 'uuid'; // นำเข้า UUID
import bcrypt from 'bcrypt';

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
                    const isPasswordValid = await bcrypt.compare(password, userDocument.password);
                    if (!isPasswordValid) {
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
        async jwt({ token, user, account, profile }) {
            // ตรวจสอบว่ามาจาก LINE หรือไม่
            if (account && account.provider === 'line') {
                if (profile && profile.sub) {
                    // ใช้ LINE User ID เป็นตัวระบุใน token
                    token.id = profile.sub;
                } else {
                    // ใช้ uuid หากไม่มี LINE User ID
                    token.id = uuidv4();
                }
            } else if (user) {
                // ตรวจสอบข้อมูลผู้ใช้จาก Google หรือระบบ credentials
                const existingUser = await Users.findOne({ email: user.email });
                if (existingUser && existingUser.uuid) {
                    token.id = existingUser.uuid;
                } else {
                    token.id = uuidv4();
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
        signIn: "/",
    }
}

const handler = NextAuth(authOption);
export { handler as GET, handler as POST };
