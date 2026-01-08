"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error properly (handle Event objects)
    if (error instanceof Error) {
      console.error("Application error:", {
        message: error.message,
        stack: error.stack,
        digest: error.digest,
      })
    } else if (error && typeof error === "object") {
      // Handle Event objects or other non-Error objects
      console.error("Application error (non-Error object):", {
        type: error.constructor?.name || typeof error,
        stringified: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        error: error,
      })
    } else {
      console.error("Application error:", error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">
            Something went wrong!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred. Please try again."}
          </p>
          <div className="flex gap-2">
            <Button onClick={reset} variant="default">
              Try again
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
            >
              Go home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

