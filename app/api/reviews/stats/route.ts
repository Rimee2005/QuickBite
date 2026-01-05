import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Review } from '@/lib/models/Review'

/**
 * GET /api/reviews/stats?menuItemId=xxx
 * Get rating statistics for menu items
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const menuItemIds = searchParams.get('menuItemIds')

    if (!menuItemIds) {
      return NextResponse.json(
        { error: 'menuItemIds parameter is required' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const ids = menuItemIds.split(',')

    // Aggregate ratings for each menu item
    const stats = await Review.aggregate([
      {
        $match: {
          menuItemId: { $in: ids },
        },
      },
      {
        $group: {
          _id: '$menuItemId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratings: {
            $push: {
              rating: '$rating',
              comment: '$comment',
              images: '$images',
              userName: '$userName',
              createdAt: '$createdAt',
            },
          },
        },
      },
    ])

    // Format response
    const statsMap: Record<string, any> = {}
    stats.forEach((stat) => {
      statsMap[stat._id] = {
        averageRating: Math.round(stat.averageRating * 10) / 10, // Round to 1 decimal
        totalReviews: stat.totalReviews,
        ratings: stat.ratings,
      }
    })

    // Include items with no reviews
    ids.forEach((id) => {
      if (!statsMap[id]) {
        statsMap[id] = {
          averageRating: 0,
          totalReviews: 0,
          ratings: [],
        }
      }
    })

    return NextResponse.json({ stats: statsMap })
  } catch (error: any) {
    console.error('Error fetching review stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch review statistics' },
      { status: 500 }
    )
  }
}

