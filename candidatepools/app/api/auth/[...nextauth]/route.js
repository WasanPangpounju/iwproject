import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";
import GoogleProvider from "next-auth/providers/google";
import LineProvider from "next-auth/providers/line";
import { v4 as uuidv4 } from "uuid";


//lib
import { addSystemLog } from "@/lib/logHelper";

//enum
import { ACTION_ACTIVITY, TARGET_MODEL, ROLE } from "@/const/enum";

// import bcrypt from 'bcrypt';

const authOption = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID,
      clientSecret: process.env.LINE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        console.log("Authorizing user:", credentials); // เพิ่ม log ที่นี่

        const { email, password, loginMod } = credentials;

        try {
          await mongoDB();

          // ค้นหาผู้ใช้ตามอีเมลหรือชื่อผู้ใช้
          const userDocument = await Users.findOne({
            $or: [{ email }, { user: email }],
          });

          if (!userDocument) {
            console.log("User not found");
            return null;
          }

          if (loginMod === "user" && userDocument.role === "supervisor") {
            console.log("Email is not role user");
            return null;
          } else if (loginMod === "user" && userDocument.role === "admin") {
            console.log("Email is not role user");
            return null;
          } else if (loginMod === "admin" && userDocument.role === "user") {
            console.log("Email is not role user");
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

          // await addLog({
          //   actorUuid: user?.uuid ?? null,
          //   targetUuid: user?.uuid ?? null,
          //   action: ACTION_ACTIVITY.LOGIN_FAILED,
          //   targetModel: TARGET_MODEL.LOGIN,
          //   description: "User failed to login",
          //   data: { email },
          // });
          if (userDocument) {
            await addSystemLog({
              actorUuid: userDocument?.uuid,
              targetUuid: userDocument?.uuid,
              action: ACTION_ACTIVITY.LOGIN,
              targetModel: TARGET_MODEL.LOGIN,
              description: `${userDocument?.role === ROLE.SUPERVISOR ? "admin": userDocument?.role === ROLE.ADMIN ? "super user":  ROLE.USER} login.`,
              data: userDocument,
            });
            return userDocument;
          }
        } catch (err) {
          await addSystemLog({
            actorUuid: email,
            targetUuid: email,
            action: ACTION_ACTIVITY.ERROR,
            targetModel: TARGET_MODEL.LOGIN,
            description: "Login is Failed",
            data: { email },
          });
          console.error("Error during authentication:", err);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // refresh token every 24h
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      try {
        // ตรวจสอบว่ามาจาก LINE หรือไม่
        const existingUser = await Users.findOne({ email: user?.email });

        if (account && account.provider === "line") {
          token.id = profile?.sub || uuidv4();
          token.role = existingUser?.role || "user";
        } else if (user) {
          token.id = existingUser?.uuid || uuidv4();
          token.role = existingUser?.role || "user";
        }
      } catch (error) {
        console.error("JWT callback error:", error);
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOption);
export { handler as GET, handler as POST };
