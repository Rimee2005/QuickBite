import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyPassword } from "./auth"
import { connectToDatabase } from "./mongodb"
import { User } from "./models/User"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        await connectToDatabase()
        const user = await User.findOne({ email: credentials.email }).exec()

        if (!user) {
          throw new Error("Invalid email or password")
        }

        const isValid = await verifyPassword(credentials.password, user.password)

        if (!isValid) {
          throw new Error("Invalid email or password")
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          type: user.type,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.type = user.type as 'student' | 'admin' | 'teacher'
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.type = token.type as 'student' | 'admin' | 'teacher'
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
} 