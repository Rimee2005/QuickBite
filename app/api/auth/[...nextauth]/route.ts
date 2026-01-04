import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import { connectToDatabase } from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        try {
          await connectToDatabase()

          const user = await User.findOne({ email: credentials.email })

          if (!user) {
            throw new Error("Invalid credentials")
          }

          const isPasswordValid = await compare(credentials.password, user.password)

          if (!isPasswordValid) {
            throw new Error("Invalid credentials")
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            type: user.type,
            ...(user.type === 'student' && { registrationNumber: user.registrationNumber })
          }
        } catch (error: any) {
          console.error("Authorization error:", error)
          
          // Handle database connection errors
          if (error?.code === 8000 || error?.codeName === 'AtlasError') {
            throw new Error("Database connection failed. Please check your MongoDB connection.")
          }
          
          // Re-throw authentication errors as-is
          if (error?.message && error.message !== "Invalid credentials") {
            throw error
          }
          
          throw new Error("Invalid credentials")
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.type = user.type
        if (user.type === 'student') {
          token.registrationNumber = user.registrationNumber
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.type = token.type
        if (token.type === 'student') {
          session.user.registrationNumber = token.registrationNumber
        }
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
