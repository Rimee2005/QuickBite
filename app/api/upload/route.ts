import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

/**
 * POST /api/upload
 * Upload image to Cloudinary (admin for menu items, students for reviews)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Admins and students can upload images (students for reviews)
    if (session.user.type !== 'admin' && session.user.type !== 'student') {
      return NextResponse.json(
        { error: 'Forbidden. Admin or student access required.' },
        { status: 403 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('image') as File
    const folder = formData.get('folder') as string // Optional folder parameter

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB for admins, 5MB for students)
    const maxSize = session.user.type === 'admin' ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB.` },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Determine folder based on provided folder or user type
    let uploadFolder = folder
    if (!uploadFolder) {
      // Default folders based on user type
      if (session.user.type === 'admin') {
        uploadFolder = 'qickbite/menu-items'
      } else {
        uploadFolder = 'qickbite/reviews'
      }
    }
    
    // Allow profile images for both admin and student
    if (uploadFolder === 'qickbite/profiles') {
      // Profile images are allowed for all authenticated users
    }

    // Upload to Cloudinary with the file's MIME type
    const result = await uploadImageToCloudinary(buffer, uploadFolder, file.type)

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error: any) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    )
  }
}

