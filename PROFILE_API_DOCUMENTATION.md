# Profile Management API Documentation

This document describes the backend API routes for user profile management with JWT authentication and role-based authorization.

## Overview

The profile management system allows both users and admins to:
- View their profile information (name, email, role, profile image)
- Update profile details (name, profile image)
- Change password (old password + new password)

All routes are protected with JWT authentication using NextAuth.js.

## Authentication

All profile routes require a valid JWT session token. The token is automatically included in requests when using NextAuth.js session.

## API Routes

### 1. Get Profile

**Endpoint:** `GET /api/profile`

**Description:** Get the current authenticated user's profile information.

**Authentication:** Required (JWT)

**Authorization:** Any authenticated user (student, admin, or teacher)

**Response:**
```json
{
  "success": true,
  "profile": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "type": "admin",
    "role": "admin",
    "profileImage": "https://cloudinary.com/image.jpg",
    "registrationNumber": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - User not authenticated
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

---

### 2. Update Profile

**Endpoint:** `PUT /api/profile`

**Description:** Update the current authenticated user's profile (name and/or profile image).

**Authentication:** Required (JWT)

**Authorization:** Any authenticated user (student, admin, or teacher)

**Request Body:**
```json
{
  "name": "Updated Name",           // Optional
  "profileImage": "https://..."     // Optional (can be null to remove)
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "profile": {
    "id": "user_id_here",
    "name": "Updated Name",
    "email": "john@example.com",
    "type": "admin",
    "role": "admin",
    "profileImage": "https://cloudinary.com/image.jpg",
    "registrationNumber": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input (empty name, invalid profileImage format)
- `401 Unauthorized` - User not authenticated
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

---

### 3. Change Password

**Endpoint:** `PUT /api/profile/password`

**Description:** Change the current authenticated user's password.

**Authentication:** Required (JWT)

**Authorization:** Any authenticated user (student, admin, or teacher)

**Request Body:**
```json
{
  "oldPassword": "current_password",
  "newPassword": "new_secure_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Missing fields, password too short, or new password same as old
- `401 Unauthorized` - User not authenticated or old password incorrect
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

**Password Requirements:**
- New password must be at least 6 characters long
- New password must be different from old password

---

## Middleware

### Authentication Middleware

Located in `lib/middleware/auth.ts`

**Function:** `authenticateUser(req: NextRequest)`

Verifies that the user is authenticated via NextAuth session.

**Returns:**
- `{ user: User, error: null }` - User is authenticated
- `{ user: null, error: NextResponse }` - User is not authenticated

**Usage:**
```typescript
import { authenticateUser } from '@/lib/middleware/auth'

export async function GET(req: NextRequest) {
  const { user, error } = await authenticateUser(req)
  
  if (error) {
    return error // Returns 401 Unauthorized
  }
  
  // User is authenticated, proceed with request
  // user.id, user.email, user.name, user.type are available
}
```

---

### Role-Based Authorization Middleware

Located in `lib/middleware/auth.ts`

**Function:** `requireRole(allowedRoles: ('admin' | 'student' | 'teacher')[])`

Checks if the authenticated user has the required role(s).

**Returns:**
- `null` - User has required role, proceed
- `NextResponse` - User doesn't have required role (403 Forbidden)

**Usage:**
```typescript
import { requireRole } from '@/lib/middleware/auth'

export async function GET(req: NextRequest) {
  // Check if user is admin
  const authError = await requireRole(['admin'])(req)
  if (authError) {
    return authError // Returns 403 Forbidden if not admin
  }
  
  // User is admin, proceed with request
}
```

**Shorthand Functions:**
- `requireAdmin` - Requires admin role
- `requireStudent` - Requires student role

**Example:**
```typescript
import { requireAdmin } from '@/lib/middleware/auth'

export async function DELETE(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) {
    return authError
  }
  
  // Only admins can reach here
}
```

---

## User Schema

The User model includes the following fields:

```typescript
interface IUser {
  name: string                    // Required
  email: string                   // Required, unique
  password: string                // Required, hashed with bcrypt, hidden by default
  type: 'student' | 'admin' | 'teacher'  // Required
  registrationNumber?: string     // Required if type is 'student'
  profileImage?: string          // Optional, URL to profile image
  createdAt: Date
  updatedAt: Date
}
```

**Password Security:**
- Passwords are hashed using bcrypt with 12 salt rounds
- Password field is hidden by default in queries (`select: false`)
- Use `.select('+password')` to include password when needed (e.g., for verification)

---

## Example Usage

### Frontend (Next.js with NextAuth)

```typescript
import { getSession } from 'next-auth/react'

// Get profile
async function getProfile() {
  const session = await getSession()
  const response = await fetch('/api/profile', {
    headers: {
      'Cookie': document.cookie, // NextAuth handles this automatically
    },
  })
  const data = await response.json()
  return data.profile
}

// Update profile
async function updateProfile(name: string, profileImage: string) {
  const response = await fetch('/api/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': document.cookie,
    },
    body: JSON.stringify({ name, profileImage }),
  })
  const data = await response.json()
  return data
}

// Change password
async function changePassword(oldPassword: string, newPassword: string) {
  const response = await fetch('/api/profile/password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': document.cookie,
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  })
  const data = await response.json()
  return data
}
```

### Backend (API Route with Role Check)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/middleware/auth'

// Admin-only route example
export async function DELETE(req: NextRequest) {
  // Check authentication and admin role
  const authError = await requireAdmin(req)
  if (authError) {
    return authError
  }
  
  // Only admins can reach here
  // Proceed with admin-only logic
  return NextResponse.json({ success: true })
}
```

---

## Security Features

1. **JWT Authentication:** All routes require valid NextAuth session
2. **Password Hashing:** Passwords are hashed with bcrypt (12 rounds)
3. **Password Verification:** Old password must be verified before changing
4. **Input Validation:** All inputs are validated before processing
5. **Role-Based Access:** Middleware enforces role-based authorization
6. **Password Field Hidden:** Password is excluded from queries by default

---

## Error Handling

All routes include comprehensive error handling:
- **400 Bad Request:** Invalid input or validation errors
- **401 Unauthorized:** Not authenticated or incorrect password
- **403 Forbidden:** Authenticated but insufficient permissions
- **404 Not Found:** Resource not found
- **500 Internal Server Error:** Server errors

---

## Testing

### Test Get Profile
```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

### Test Update Profile
```bash
curl -X PUT http://localhost:3000/api/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{"name": "New Name", "profileImage": "https://example.com/image.jpg"}'
```

### Test Change Password
```bash
curl -X PUT http://localhost:3000/api/profile/password \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{"oldPassword": "old123", "newPassword": "new456"}'
```

---

## Notes

- Email remains the primary login method (as per requirements)
- Profile image URLs should be stored from Cloudinary or similar service
- Password changes require verification of old password
- All timestamps are automatically managed by Mongoose
- The `role` field in responses is an alias for `type` for better clarity

