import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { authenticateUser } from '@/lib/middleware/auth'

/**
 * GET /api/profile
 * Get the current user's profile information
 * Protected route - requires authentication
 */
export async function GET(req: NextRequest) {
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

    // Connect to database
    await connectToDatabase()

    // Find user in database
    const userDoc = await User.findById(user.id).select('-password').lean()

    if (!userDoc) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Return user profile (excluding password)
    return NextResponse.json({
      success: true,
      profile: {
        id: userDoc._id.toString(),
        name: userDoc.name,
        email: userDoc.email,
        type: userDoc.type,
        role: userDoc.type, // Alias for type
        profileImage: userDoc.profileImage || null,
        registrationNumber: userDoc.registrationNumber || null,
        createdAt: userDoc.createdAt,
        updatedAt: userDoc.updatedAt,
      }
    })
  } catch (error: any) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile. Please try again.' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/profile
 * Update the current user's profile (name, profileImage)
 * Protected route - requires authentication
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
    const { name, profileImage } = body

    // Validate input
    const updates: any = {}
    
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json(
          { error: 'Name must be a non-empty string' },
          { status: 400 }
        )
      }
      updates.name = name.trim()
    }

    if (profileImage !== undefined) {
      if (profileImage !== null && (typeof profileImage !== 'string' || profileImage.trim().length === 0)) {
        return NextResponse.json(
          { error: 'Profile image must be a valid URL string or null' },
          { status: 400 }
        )
      }
      updates.profileImage = profileImage || null
    }

    // Check if there are any updates
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectToDatabase()

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { 
        ...updates,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select('-password').lean()

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Return updated profile
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        type: updatedUser.type,
        role: updatedUser.type,
        profileImage: updatedUser.profileImage || null,
        registrationNumber: updatedUser.registrationNumber || null,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      }
    })
  } catch (error: any) {
    console.error('Error updating profile:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message || 'Validation error' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update profile. Please try again.' },
      { status: 500 }
    )
  }
}

