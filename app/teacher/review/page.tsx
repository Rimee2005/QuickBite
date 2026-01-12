"use client"

// Teacher review page - redirects to student review since they share the same interface
import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

function TeacherReviewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading } = useAuth()
  const orderId = searchParams.get("orderId")
  const menuItemId = searchParams.get("menuItemId")

  useEffect(() => {
    if (!isLoading) {
      // Redirect teachers to student review (they share the same interface)
      // Preserve query parameters
      const params = new URLSearchParams()
      if (orderId) params.set("orderId", orderId)
      if (menuItemId) params.set("menuItemId", menuItemId)
      const queryString = params.toString() ? `?${params.toString()}` : ""
      router.replace(`/student/review${queryString}`)
    }
  }, [isLoading, router, orderId, menuItemId])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export default function TeacherReview() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <TeacherReviewContent />
    </Suspense>
  )
}

