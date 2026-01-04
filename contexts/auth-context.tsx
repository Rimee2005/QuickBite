"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: {
    id: string
    name: string
    email: string
    type: "student" | "admin" | "teacher"
  } | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        return false
      }

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  const user = session?.user ? {
    id: session.user.id,
    name: session.user.name || "",
    email: session.user.email || "",
    type: session.user.type as "student" | "admin" | "teacher",
  } : null

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!session?.user,
        isLoading: status === "loading",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
