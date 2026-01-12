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

          // Select password field explicitly since it's hidden by default
          const user = await User.findOne({ email: credentials.email }).select('+password')

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
      // Initial sign in - add user data to token
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.type = user.type
        if (user.type === 'student' && 'registrationNumber' in user) {
          token.registrationNumber = user.registrationNumber
        }
      }
      // On subsequent requests, token already has the data, so just return it
      return token
    },
    async session({ session, token }) {
      // Add token data to session
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.type = token.type as "student" | "admin" | "teacher"
        if (token.type === 'student' && token.registrationNumber) {
          session.user.registrationNumber = token.registrationNumber as string
        }
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax', // Use 'lax' for same-origin requests (Next.js + NextAuth on same domain)
        path: '/',
        secure: process.env.NODE_ENV === 'production', // Only secure in production (HTTPS required)
        maxAge: 30 * 24 * 60 * 60, // 30 days
        // Don't set domain - browser will handle it for same-origin requests
      },
    },
    callbackUrl: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
    csrfToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Host-' : ''}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
