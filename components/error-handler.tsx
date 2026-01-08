"use client"

import { useEffect } from "react"

export function ErrorHandler() {
  useEffect(() => {
    // Handle global errors to prevent [object Event] issues
    const handleError = (event: ErrorEvent) => {
      // Prevent default error handling that might cause [object Event]
      if (event.error instanceof Error) {
        console.error("Global error:", {
          message: event.error.message,
          stack: event.error.stack,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        })
      } else {
        console.error("Global error (non-Error):", {
          message: event.message,
          error: event.error,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        })
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Handle unhandled promise rejections
      const reason = event.reason
      if (reason instanceof Error) {
        console.error("Unhandled promise rejection:", {
          message: reason.message,
          stack: reason.stack,
        })
      } else if (reason && typeof reason === "object") {
        // Handle Event objects or other non-Error objects
        console.error("Unhandled promise rejection (non-Error):", {
          type: reason.constructor?.name || typeof reason,
          reason: reason,
        })
      } else {
        console.error("Unhandled promise rejection:", reason)
      }
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return null
}

