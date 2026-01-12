import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// Separate middleware for protected routes
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
    const isStudentRoute = req.nextUrl.pathname.startsWith("/student")
    const isTeacherRoute = req.nextUrl.pathname.startsWith("/teacher")

    // Redirect admin trying to access student or teacher routes
    if ((isStudentRoute || isTeacherRoute) && token?.type === "admin") {
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
        const pathname = req.nextUrl.pathname
        
        // Always allow API routes (especially NextAuth routes)
        if (pathname.startsWith("/api/")) {
          return true
        }

        const isAdminRoute = pathname.startsWith("/admin")
        const isStudentRoute = pathname.startsWith("/student")
        const isTeacherRoute = pathname.startsWith("/teacher")
        const isAuthRoute = pathname.startsWith("/login") || 
                          pathname.startsWith("/register") ||
                          pathname.startsWith("/admin/login") ||
                          pathname.startsWith("/admin/register") ||
                          pathname.startsWith("/student/login")

        // Allow access to auth routes (but redirect if already authenticated)
        if (isAuthRoute) {
          // If user is already authenticated, redirect to their dashboard
          // Only redirect if we have a valid token with user type
          // IMPORTANT: Don't redirect immediately - let client handle it to avoid loops
          // The client-side login page will check session and redirect if needed
          return true
        }

        // Require authentication for protected routes
        if (isAdminRoute || isStudentRoute || isTeacherRoute) {
          // Return true if token exists, false otherwise
          // withAuth will handle the redirect to login automatically
          return !!token
        }

        return true
      },
    },
  }
)

// Update matcher to only include protected routes
// Exclude API routes, especially NextAuth routes
export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
    "/teacher/:path*",
    "/login",
    "/register",
  ],
} 