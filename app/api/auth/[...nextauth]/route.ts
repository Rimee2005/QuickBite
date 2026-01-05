import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyPassword } from "@/lib/auth"
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
            console.error(`User not found for email: ${credentials.email}`)
            throw new Error("Invalid credentials")
          }

          // Check if password is hashed (starts with $2a$, $2b$, or $2y$)
          // If it's plain text (old data), we need to handle it differently
          const isHashed = user.password && (
            user.password.startsWith('$2a$') || 
            user.password.startsWith('$2b$') || 
            user.password.startsWith('$2y$')
          )

          let isPasswordValid = false

          if (isHashed) {
            // Password is hashed, use bcryptjs to verify
            isPasswordValid = await verifyPassword(credentials.password, user.password)
          } else {
            // Old plain text password - for backward compatibility
            // In production, you should force password reset for these users
            console.warn(`Plain text password detected for user: ${user.email}. Please update to hashed password.`)
            isPasswordValid = credentials.password === user.password
          }

          if (!isPasswordValid) {
            console.error(`Password validation failed for email: ${credentials.email}`)
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
