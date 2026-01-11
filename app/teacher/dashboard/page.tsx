"use client"

// Teacher dashboard - redirects to student dashboard since they share the same interface
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function TeacherDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      // Redirect teachers to student dashboard (they share the same interface)
      router.replace("/student/dashboard")
    }
  }, [isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

