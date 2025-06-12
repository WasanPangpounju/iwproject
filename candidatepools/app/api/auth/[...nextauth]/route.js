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

export const authOption = {
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

          if (userDocument) {
            // await addSystemLog({
            //   actorUuid: userDocument?.uuid,
            //   action: ACTION_ACTIVITY.LOGIN,
            //   targetModel: TARGET_MODEL.LOGIN,
            //   description: `${email} ${
            //     userDocument?.role === ROLE.SUPERVISOR
            //       ? "(admin)"
            //       : userDocument?.role === ROLE.ADMIN
            //       ? "(super user)"
            //       : `(${ROLE.USER})`
            //   } login.`,
            //   data: userDocument,
            // });
            return userDocument;
          }
        } catch (err) {
          // await addSystemLog({
          //   actorUuid: email,
          //   action: ACTION_ACTIVITY.ERROR,
          //   targetModel: TARGET_MODEL.LOGIN,
          //   description: `${email} Login is Failed`,
          //   data: { email },
          // });
          console.error("Error during authentication:", err);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 6 * 60 * 60, // 6 ชั่วโมง = 21600 วินาที
    updateAge: 60 * 60, // (แนะนำ) อัปเดตอายุ token ทุก 1 ชั่วโมง
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          const existingUser = await Users.findOne({ email: user.email });

          if (existingUser) {
            token.id = existingUser.uuid;
            token.role = existingUser.role || "user";
            token.email = existingUser.email;
            token.isRegistered = true; // ✅ ลงทะเบียนแล้ว
          } else {
            token.id = null; // ❌ อย่า gen UUID
            token.role = "user";
            token.email = user.email;
            token.isRegistered = false; // ❌ ยังไม่ได้สมัคร
          }
        }
      } catch (error) {
        console.error("JWT callback error:", error);
      }
      return token;
    },
    async session({ session, token }) {
      if (token.isRegistered) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      session.user.email = token.email;
      session.user.isRegistered = token.isRegistered;
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      const email = user?.email;
      const provider = account?.provider;
      try {
        // ค้นหาข้อมูลในฐานข้อมูล (เพื่อดึง uuid & role)
        const existingUser = await Users.findOne({ email });

        // ถ้าไม่มีในระบบ (OAuth ผู้ใช้ใหม่)
        if (!existingUser) {
          console.log(
            `[SignIn Event] ${email} login via ${provider} but not registered.`
          );
          return;
        }

        await addSystemLog({
          actorUuid: existingUser?.uuid,
          action: ACTION_ACTIVITY.LOGIN,
          targetModel: TARGET_MODEL.LOGIN,
          description: `${email} from (${provider}) role: ${
            existingUser?.role === ROLE.SUPERVISOR
              ? "admin"
              : existingUser?.role === ROLE.ADMIN
              ? "super user"
              : `${ROLE.USER}`
          }.`,
          data: {
            provider,
            email,
            role: existingUser?.role,
          },
        });
      } catch (err) {
        await addSystemLog({
          actorUuid: email,
          action: ACTION_ACTIVITY.ERROR,
          targetModel: TARGET_MODEL.LOGIN,
          description: `${email} Login is Failed`,
          data: { email },
        });
        console.error("Error logging OAuth login:", err);
      }
    },
    async signOut({ token }) {
      const existingUser = await Users.findOne({ email: token?.email });

      if (!token?.email || !existingUser) return;
      try {
        await addSystemLog({
          actorUuid: token?.id || "unknown",
          action: ACTION_ACTIVITY.LOGOUT,
          targetModel: TARGET_MODEL.LOGOUT,
          description: `${token?.email} logout.`,
          data: { email: token.email },
        });
      } catch (err) {
        console.error("Error logging logout activity:", err);
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOption);
export { handler as GET, handler as POST };
