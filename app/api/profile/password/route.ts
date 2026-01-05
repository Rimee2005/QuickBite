import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { authenticateUser } from '@/lib/middleware/auth'
import { hashPassword, verifyPassword } from '@/lib/auth'

/**
 * PUT /api/profile/password
 * Change the current user's password
 * Protected route - requires authentication
 * Requires old password and new password
 */
export async function PUT(req: NextRequest) {
  try {
    // Authenticate user
    const { user, error } = await authenticateUser(req)
    
    if (error) {
      return error
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Parse request body
    const body = await req.json()
    const { oldPassword, newPassword } = body

    // Validate input
    if (!oldPassword || typeof oldPassword !== 'string') {
      return NextResponse.json(
        { error: 'Old password is required' },
        { status: 400 }
      )
    }

    if (!newPassword || typeof newPassword !== 'string') {
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      )
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if old and new passwords are different
    if (oldPassword === newPassword) {
      return NextResponse.json(
        { error: 'New password must be different from old password' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectToDatabase()

    // Find user with password field
    const userDoc = await User.findById(user.id).select('+password')

    if (!userDoc) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify old password
    const isOldPasswordValid = await verifyPassword(oldPassword, userDoc.password)

    if (!isOldPasswordValid) {
      return NextResponse.json(
        { error: 'Old password is incorrect' },
        { status: 401 }
      )
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword)

    // Update password
    userDoc.password = hashedNewPassword
    userDoc.updatedAt = new Date()
    await userDoc.save()

    // Return success response (don't return password)
    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error: any) {
    console.error('Error changing password:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message || 'Validation error' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to change password. Please try again.' },
      { status: 500 }
    )
  }
}

