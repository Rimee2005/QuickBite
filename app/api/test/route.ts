import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import mongoose from 'mongoose'

export async function GET() {
  if (!process.env.MONGODB_URI) {
    console.error("No MONGODB_URI found")
    return NextResponse.json({ 
      status: 'error',
      message: 'MongoDB URI not configured'
    }, { status: 500 })
  }

  try {
    console.log("Attempting to connect to MongoDB...")
    const connection = await connectToDatabase()
    
    if (!connection) {
      throw new Error('Failed to establish connection')
    }

    const db = connection.connection.db

    // Test the connection by listing collections
    console.log("Connected, fetching collections...")
    const collections = await db.listCollections().toArray()
    
    // Get server status
    console.log("Getting server status...")
    const status = await db.command({ serverStatus: 1 })

    console.log("Successfully connected to MongoDB")
    return NextResponse.json({ 
      status: 'success',
      message: 'Connected to MongoDB!',
      collections: collections.map(c => c.name),
      version: status.version,
      uptime: status.uptime,
      connections: status.connections
    })
  } catch (e) {
    console.error("MongoDB connection error:", e)
    return NextResponse.json({ 
      status: 'error',
      message: 'Failed to connect to MongoDB',
      error: e instanceof Error ? e.message : String(e)
    }, { status: 500 })
  }
} 