import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { MenuItem } from '@/lib/models/MenuItems'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * GET /api/menu
 * Get all menu items (public endpoint, no auth required)
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const menuItems = await MenuItem.find({ available: true })
      .sort({ category: 1, 'name.en': 1 })
      .lean()

    // Migrate old format to new format for backward compatibility
    const migratedItems = menuItems.map((item: any) => {
      // If name is a string (old format), convert to new format
      if (typeof item.name === 'string') {
        return {
          ...item,
          name: {
            en: item.name,
            hi: item.nameHi || undefined,
            mai: item.nameMai || undefined,
            bho: item.nameBho || undefined,
          }
        }
      }
      return item
    })

    return NextResponse.json({ menuItems: migratedItems })
  } catch (error: any) {
    console.error('Error fetching menu items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/menu
 * Create a new menu item (admin only)
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

    // Only admins can create menu items
    if (session.user.type !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { name, price, category, image, emoji, description } = body

    // Validate required fields
    if (!name || !price || !category) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      )
    }

    const validCategories = ['Snacks', 'Beverages', 'Meals']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Convert name to new format if it's a string (backward compatibility)
    let nameObj: { en: string; hi?: string; mai?: string; bho?: string }
    if (typeof name === 'string') {
      nameObj = { en: name }
    } else if (name && typeof name === 'object' && name.en) {
      nameObj = {
        en: name.en,
        hi: name.hi || undefined,
        mai: name.mai || undefined,
        bho: name.bho || undefined,
      }
    } else {
      return NextResponse.json(
        { error: 'Name must be a string or an object with at least an "en" property' },
        { status: 400 }
      )
    }

    // Check if menu item with same English name already exists
    const existingItem = await MenuItem.findOne({ 'name.en': nameObj.en })
    if (existingItem) {
      return NextResponse.json(
        { error: 'Menu item with this name already exists' },
        { status: 400 }
      )
    }

    // Create new menu item
    const menuItem = await MenuItem.create({
      name: nameObj,
      price: Number(price),
      category,
      image: image || null,
      emoji: emoji || null,
      description: description || null,
      available: true,
    })

    return NextResponse.json({
      message: 'Menu item created successfully',
      menuItem,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating menu item:', error)
    
    // Provide more specific error messages
    if (error?.name === 'ValidationError') {
      return NextResponse.json(
        { error: `Validation error: ${error.message}` },
        { status: 400 }
      )
    }
    
    if (error?.code === 11000) {
      return NextResponse.json(
        { error: 'Menu item with this name already exists' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error?.message || 'Failed to create menu item. Please try again.' },
      { status: 500 }
    )
  }
}

