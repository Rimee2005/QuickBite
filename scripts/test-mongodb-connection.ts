/**
 * Test MongoDB Connection Script
 * Run this to verify your MongoDB connection string is correct
 * Usage: npm run test-db
 */

import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in .env.local')
  process.exit(1)
}

console.log('🔌 Testing MongoDB connection...')
console.log('Connection string:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')) // Hide password

async function testConnection() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined')
    }
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    })
    
    console.log('✅ Successfully connected to MongoDB!')
    
    const db = mongoose.connection.db
    if (db) {
      console.log('📊 Database:', db.databaseName)
      // Test a simple operation
      const collections = await db.listCollections().toArray()
      console.log('📁 Collections:', collections.map(c => c.name).join(', ') || 'None')
    }
    console.log('🌐 Host:', mongoose.connection.host)
    
    await mongoose.disconnect()
    console.log('👋 Disconnected from MongoDB')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ MongoDB connection failed!')
    console.error('Error:', error.message)
    
    if (error?.code === 8000 || error?.codeName === 'AtlasError') {
      console.error('\n💡 Troubleshooting steps:')
      console.error('1. Verify your username and password in MongoDB Atlas')
      console.error('2. Check Network Access in MongoDB Atlas - add your IP or use 0.0.0.0/0 for development')
      console.error('3. Ensure the database user has read/write permissions')
      console.error('4. If password has special characters, URL encode them (e.g., @ becomes %40)')
    }
    
    process.exit(1)
  }
}

testConnection()

