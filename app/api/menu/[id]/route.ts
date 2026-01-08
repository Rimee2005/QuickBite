import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { MenuItem } from '@/lib/models/MenuItems'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * GET /api/menu/[id]
 * Get a specific menu item
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase()

    const { id } = await params
    const menuItem = await MenuItem.findById(id).lean()

    if (!menuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ menuItem })
  } catch (error: any) {
    console.error('Error fetching menu item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu item' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/menu/[id]
 * Update a menu item (admin only)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only admins can update menu items
    if (session.user.type !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { name, price, category, image, emoji, description, available } = body

    await connectToDatabase()

    const { id } = await params

    const updateData: any = {}
    
    // Handle name update - convert to new format if needed
    if (name !== undefined) {
      if (typeof name === 'string') {
        // Convert string to new format
        updateData.name = { en: name }
      } else if (name && typeof name === 'object' && name.en) {
        updateData.name = {
          en: name.en,
          hi: name.hi || undefined,
          mai: name.mai || undefined,
          bho: name.bho || undefined,
        }
      }
    }
    
    if (price !== undefined) updateData.price = Number(price)
    if (category !== undefined) updateData.category = category
    if (image !== undefined) updateData.image = image
    if (emoji !== undefined) updateData.emoji = emoji
    if (description !== undefined) updateData.description = description
    if (available !== undefined) updateData.available = available

    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).lean()

    if (!menuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Menu item updated successfully',
      menuItem,
    })
  } catch (error: any) {
    console.error('Error updating menu item:', error)
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/menu/[id]
 * Delete a menu item (admin only)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only admins can delete menu items
    if (session.user.type !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      )
    }

    await connectToDatabase()

    const { id } = await params
    const menuItem = await MenuItem.findByIdAndDelete(id)

    if (!menuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Menu item deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting menu item:', error)
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    )
  }
}

