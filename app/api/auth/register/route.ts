import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { hashPassword } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { name, email, password, type, registrationNumber } = await req.json()

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      )
    }

    // Connect to database
    try {
      await connectToDatabase()
    } catch (dbError: any) {
      // Handle database connection errors specifically
      if (dbError?.message?.includes('MongoDB authentication failed') || 
          dbError?.code === 8000 || 
          dbError?.codeName === 'AtlasError') {
        return NextResponse.json(
          { 
            error: "Database connection failed. Please check your MongoDB Atlas settings:\n• Verify your IP address is whitelisted (Network Access)\n• Check your username and password are correct\n• Ensure the database user has proper permissions"
          },
          { status: 500 }
        )
      }
      throw dbError // Re-throw if it's not a connection error
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Validate user type
    const validTypes = ['student', 'admin', 'teacher']
    const userType = (type || 'student').toLowerCase()
    
    if (!validTypes.includes(userType)) {
      return NextResponse.json(
        { error: `Invalid user type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Create user object based on type
    const userData: any = {
      name,
      email,
      password: hashedPassword,
      type: userType,
    }

    // Add registration number for students
    if (userType === 'student') {
      if (!registrationNumber) {
        return NextResponse.json(
          { error: "Registration number is required for students" },
          { status: 400 }
        )
      }
      userData.registrationNumber = registrationNumber
    }

    // Create new user
    const user = await User.create(userData)

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
      }
    })

  } catch (error: any) {
    console.error("Registration error:", error)
    
    // Provide more specific error messages
    if (error?.code === 8000 || error?.codeName === 'AtlasError' || error?.message?.includes('authentication failed') || error?.message?.includes('MongoDB authentication')) {
      return NextResponse.json(
        { 
          error: "Database connection failed. Please check your MongoDB Atlas settings: verify your IP is whitelisted, and your credentials are correct."
        },
        { status: 500 }
      )
    }
    
    if (error?.code === 11000) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }
    
    if (error?.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message || "Validation error. Please check your input." },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error?.message || "Error creating user. Please try again." },
      { status: 500 }
    )
  }
}

// Optional: Add GET method to check if registration endpoint is working
export async function GET() {
  return NextResponse.json(
    { message: 'Registration endpoint is working' },
    { status: 200 }
  )
}
