"use client"

// Teacher order status page - redirects to student order status since they share the same interface
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function TeacherOrderStatus() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading } = useAuth()
  const orderId = searchParams.get("orderId")

  useEffect(() => {
    if (!isLoading) {
      // Redirect teachers to student order status (they share the same interface)
      // Preserve the orderId query parameter
      const queryString = orderId ? `?orderId=${orderId}` : ""
      router.replace(`/student/order-status${queryString}`)
    }
  }, [isLoading, router, orderId])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

