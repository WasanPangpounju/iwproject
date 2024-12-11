import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";
import GoogleProvider from "next-auth/providers/google";
import LineProvider from 'next-auth/providers/line';
import { v4 as uuidv4 } from 'uuid';
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
            async authorize(credentials) {
                console.log("Authorizing user:", credentials); // เพิ่ม log ที่นี่

                const { email, password } = credentials;

                try {
                    await mongoDB();

                    // ค้นหาผู้ใช้ตามอีเมลหรือชื่อผู้ใช้
                    const userDocument = await Users.findOne({
                        $or: [{ email }, { user: email }]
                    });

                    if (!userDocument) {
                        console.log("User not found");
                        return null;
                    }

                    // ตรวจสอบรหัสผ่านแบบตรงๆ (Plain-text comparison)
                    if (password !== userDocument.password) {
                        console.log("Invalid password");
                        return null;
                    }

                    // // ตรวจสอบรหัสผ่าน bcrypt
                    // const isPasswordValid = await bcrypt.compare(password, userDocument.password);
                    // if (!isPasswordValid) {
                    //     console.log("Invalid password");
                    //     return null;
                    // }
                    // ส่งคืนข้อมูลผู้ใช้หากสำเร็จ
                    return userDocument;

                } catch (err) {
                    console.error('Error during authentication:', err);
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
            try {
                // ตรวจสอบว่ามาจาก LINE หรือไม่
                if (account && account.provider === 'line') {
                    token.id = profile?.sub || uuidv4();
                } else if (user) {
                    const existingUser = await Users.findOne({ email: user.email });
                    token.id = existingUser?.uuid || uuidv4();
                }
            } catch (error) {
                console.error("JWT callback error:", error);
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/",
    }
};

const handler = NextAuth(authOption);
export { handler as GET, handler as POST };
