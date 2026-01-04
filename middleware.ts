import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// Separate middleware for protected routes
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
    const isStudentRoute = req.nextUrl.pathname.startsWith("/student")

    // Redirect admin trying to access student routes
    if (isStudentRoute && token?.type === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }

    // Redirect student or teacher trying to access admin routes
    if (isAdminRoute && (token?.type === "student" || token?.type === "teacher")) {
      return NextResponse.redirect(new URL("/student/dashboard", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
        const isStudentRoute = req.nextUrl.pathname.startsWith("/student")
        const isAuthRoute = req.nextUrl.pathname.startsWith("/login") || 
                          req.nextUrl.pathname.startsWith("/admin/login") ||
                          req.nextUrl.pathname.startsWith("/admin/register") ||
                          req.nextUrl.pathname.startsWith("/student/login")

        // Allow access to auth routes
        if (isAuthRoute) return true

        // Require authentication for protected routes
        if (isAdminRoute || isStudentRoute) {
          return !!token
        }

        return true
      },
    },
  }
)

// Update matcher to only include protected routes
export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
    "/login",
  ],
} 