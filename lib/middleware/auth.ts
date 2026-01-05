import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * JWT Authentication Middleware
 * Verifies that the user is authenticated via NextAuth session
 * 
 * @returns {Promise<{user: any, error: null} | {user: null, error: NextResponse}>}
 */
export async function authenticateUser(req: NextRequest) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session || !session.user) {
      return {
        user: null,
        error: NextResponse.json(
          { error: 'Unauthorized. Please login to continue.' },
          { status: 401 }
        )
      }
    }

    // Return authenticated user
    return {
      user: session.user,
      error: null
    }
  } catch (error: any) {
    console.error('Authentication error:', error)
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Authentication failed. Please try again.' },
        { status: 500 }
      )
    }
  }
}

/**
 * Role-Based Authorization Middleware
 * Checks if the authenticated user has the required role(s)
 * 
 * @param allowedRoles - Array of allowed roles (e.g., ['admin', 'student'])
 * @returns Middleware function that checks user role
 */
export function requireRole(allowedRoles: ('admin' | 'student' | 'teacher')[]) {
  return async (req: NextRequest) => {
    // First authenticate the user
    const { user, error } = await authenticateUser(req)

    if (error) {
      return error
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to continue.' },
        { status: 401 }
      )
    }

    // Check if user has required role
    if (!allowedRoles.includes(user.type as 'admin' | 'student' | 'teacher')) {
      return NextResponse.json(
        { 
          error: 'Forbidden. You do not have permission to access this resource.',
          requiredRoles: allowedRoles,
          yourRole: user.type
        },
        { status: 403 }
      )
    }

    // User is authenticated and has required role
    return null // No error, proceed
  }
}

/**
 * Admin-Only Authorization Middleware
 * Shorthand for requireRole(['admin'])
 */
export const requireAdmin = requireRole(['admin'])

/**
 * Student-Only Authorization Middleware
 * Shorthand for requireRole(['student'])
 */
export const requireStudent = requireRole(['student'])

