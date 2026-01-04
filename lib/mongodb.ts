import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env')
}

let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
    console.log("✅ MongoDB connected successfully")
  } catch (e: any) {
    cached.promise = null
    console.error("MongoDB connection error:", e)
    
    // Provide more helpful error messages
    if (e?.code === 8000 || e?.codeName === 'AtlasError') {
      throw new Error("MongoDB authentication failed")
    }
    
    if (e?.code === 'ENOTFOUND' || e?.code === 'ECONNREFUSED') {
      throw new Error(
        "Cannot connect to MongoDB. Please check your connection string and ensure MongoDB is accessible."
      )
    }
    
    throw e
  }

  return cached.conn
}

// This is to avoid TypeScript errors when accessing the global scope
declare global {
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  } | undefined
}
