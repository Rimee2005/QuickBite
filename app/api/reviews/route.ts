import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Review } from '@/lib/models/Review'
import { Order } from '@/lib/models/order'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * GET /api/reviews
 * Get reviews for a menu item or all reviews
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const menuItemId = searchParams.get('menuItemId')
    const orderId = searchParams.get('orderId')
    const userId = searchParams.get('userId')

    await connectToDatabase()

    const query: any = {}
    if (menuItemId) {
      query.menuItemId = menuItemId
    }
    if (orderId) {
      query.orderId = orderId
    }
    if (userId) {
      query.userId = userId
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    return NextResponse.json({ reviews })
  } catch (error: any) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/reviews
 * Create a new review
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

    const body = await req.json()
    const { orderId, menuItemId, rating, comment, images } = body

    // Validate required fields
    if (!orderId || !menuItemId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Order ID, Menu Item ID, rating, and comment are required' },
        { status: 400 }
      )
    }

    // Validate rating
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Verify the order exists and belongs to the user
    const order = await Order.findOne({ orderId }).lean()
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized. This order does not belong to you.' },
        { status: 403 }
      )
    }

    // Check if order is completed
    if (order.status !== 'completed') {
      return NextResponse.json(
        { error: 'Order must be completed before submitting a review' },
        { status: 400 }
      )
    }

    // Find the menu item name from order items
    const orderItem = order.items.find(item => item.menuItemId === menuItemId)
    if (!orderItem) {
      return NextResponse.json(
        { error: 'Menu item not found in this order' },
        { status: 400 }
      )
    }

    // Check if review already exists for this order and menu item
    const existingReview = await Review.findOne({ 
      userId: session.user.id,
      orderId,
      menuItemId,
    })

    let review
    let isUpdate = false
    
    if (existingReview) {
      // Update existing review instead of creating a new one
      isUpdate = true
      review = await Review.findOneAndUpdate(
        { 
          userId: session.user.id,
          orderId,
          menuItemId,
        },
        {
          rating: Number(rating),
          comment: String(comment).trim(),
          images: images && Array.isArray(images) ? images : [],
          updatedAt: new Date(),
        },
        { new: true }
      )
    } else {
      // Create new review
      review = await Review.create({
        orderId,
        userId: session.user.id,
        userName: session.user.name || 'Anonymous',
        userEmail: session.user.email || '',
        menuItemId,
        menuItemName: orderItem.name,
        rating: Number(rating),
        comment: String(comment).trim(),
        images: images && Array.isArray(images) ? images : [],
      })
    }

    // Update menu item's average rating and total reviews
    const { MenuItem } = await import('@/lib/models/MenuItems')
    const aggregation = await Review.aggregate([
      { $match: { menuItemId: menuItemId } },
      {
        $group: {
          _id: '$menuItemId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ])

    if (aggregation.length > 0) {
      const { averageRating, totalReviews } = aggregation[0]
      await MenuItem.findByIdAndUpdate(menuItemId, {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalReviews: totalReviews,
      })
    }

    return NextResponse.json({
      message: isUpdate ? 'Review updated successfully' : 'Review submitted successfully',
      review,
      isUpdate,
    }, { status: isUpdate ? 200 : 201 })
  } catch (error: any) {
    console.error('Error creating review:', error)
    
    if (error?.code === 11000) {
      return NextResponse.json(
        { error: 'You have already reviewed this item for this order' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error?.message || 'Failed to create review' },
      { status: 500 }
    )
  }
}

