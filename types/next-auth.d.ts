import { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"]
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `signIn` callback, when using a database.
   */
  interface User {
    id: string
    name: string
    email: string
    type: "student" | "admin" | "teacher"
    registrationNumber?: string
    role?: 'student' | 'admin' | 'teacher' // For compatibility
    image?: string | null
  } 
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    id: string
    name?: string
    email?: string
    type: "student" | "admin" | "teacher"
    registrationNumber?: string
  }
}
