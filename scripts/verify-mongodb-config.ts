/**
 * MongoDB Configuration Verification Script
 * This script helps diagnose MongoDB connection issues
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI

console.log('🔍 MongoDB Configuration Verification\n')
console.log('=' .repeat(50))

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in .env.local')
  process.exit(1)
}

// Parse connection string
const uriPattern = /^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/(.+)$/
const match = MONGODB_URI.match(uriPattern)

if (!match) {
  console.error('❌ Invalid MongoDB connection string format')
  console.log('\nExpected format: mongodb+srv://username:password@cluster.mongodb.net/databaseName')
  process.exit(1)
}

const [, username, password, cluster, database] = match

console.log('✅ Connection string format is valid\n')
console.log('📋 Configuration Details:')
console.log(`   Username: ${username}`)
console.log(`   Password: ${'*'.repeat(password.length)} (${password.length} characters)`)
console.log(`   Cluster: ${cluster}`)
console.log(`   Database: ${database}`)

// Check for common issues
console.log('\n🔍 Checking for common issues:\n')

const issues: string[] = []

// Check password length
if (password.length < 8) {
  issues.push('⚠️  Password is less than 8 characters (might be too short)')
}

// Check for special characters that might need encoding
const specialChars = /[@#%+?=]/
if (specialChars.test(password)) {
  console.log('⚠️  Password contains special characters that might need URL encoding')
  console.log('   Special characters in passwords should be URL encoded:')
  console.log('   @ → %40, # → %23, % → %25, + → %2B, ? → %3F, = → %3D')
  
  // Show encoded version
  const encodedPassword = encodeURIComponent(password)
  if (encodedPassword !== password) {
    console.log(`\n   Try this encoded password in your connection string:`)
    console.log(`   ${encodedPassword}`)
    console.log(`\n   Full connection string would be:`)
    console.log(`   mongodb+srv://${username}:${encodedPassword}@${cluster}/${database}`)
  }
}

// Check database name
if (database !== 'quickbite' && database !== 'qickbite') {
  console.log(`⚠️  Database name is "${database}" - make sure it exists in MongoDB Atlas`)
}

if (issues.length === 0) {
  console.log('✅ No obvious configuration issues detected')
}

console.log('\n' + '='.repeat(50))
console.log('\n📝 Next Steps:')
console.log('1. Go to MongoDB Atlas → Network Access')
console.log('   - Click "Add IP Address"')
console.log('   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)')
console.log('   - Wait 1-2 minutes for changes to propagate')
console.log('\n2. Go to MongoDB Atlas → Database Access')
console.log('   - Verify the username matches:', username)
console.log('   - If password is wrong, reset it and update .env.local')
console.log('   - Ensure user has "Read and write to any database" permission')
console.log('\n3. Test the connection again:')
console.log('   npm run test-mongodb')
console.log('\n4. If still failing, try creating a new database user in MongoDB Atlas')
console.log('   and use those credentials in your .env.local file\n')

