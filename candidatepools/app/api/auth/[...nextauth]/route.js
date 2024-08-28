import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { mongoDB } from "@/lib/mongodb";
import Users from "@/models/user";
import GoogleProvider from "next-auth/providers/google";
import LineProvider from 'next-auth/providers/line';


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
                    const user = await Users.findOne({ email });

                    if (!user) {
                        return null;
                    }

                    if (user.password !== password) {
                        return null;
                    }


                    return user;

                } catch (err) {
                    console.log(err)
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    page: {
        signIn: "/"
    }
}

const handler = NextAuth(authOption);
export { handler as GET, handler as POST };