import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Order } from '@/lib/models/order'

/**
 * GET /api/menu/most-ordered
 * Get menu items ordered by frequency (most ordered items)
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    // Aggregate orders to count how many times each menu item was ordered
    const mostOrdered = await Order.aggregate([
      // Unwind items array to get individual items
      { $unwind: '$items' },
      // Group by menuItemId and sum quantities
      {
        $group: {
          _id: '$items.menuItemId',
          totalQuantity: { $sum: '$items.quantity' },
          orderCount: { $sum: 1 }, // Count how many orders included this item
        },
      },
      // Sort by total quantity (most ordered first)
      { $sort: { totalQuantity: -1 } },
      // Limit to top items (e.g., top 20%)
      { $limit: 50 },
    ])

    // Create a map of menuItemId -> order count
    const mostOrderedMap: Record<string, { totalQuantity: number; orderCount: number }> = {}
    mostOrdered.forEach((item) => {
      mostOrderedMap[item._id] = {
        totalQuantity: item.totalQuantity,
        orderCount: item.orderCount,
      }
    })

    // Calculate threshold for "Most Ordered" (top 20% of items)
    const quantities = mostOrdered.map((item) => item.totalQuantity)
    const threshold = quantities.length > 0 
      ? quantities[Math.floor(quantities.length * 0.2)] || 0
      : 0

    return NextResponse.json({
      mostOrdered: mostOrderedMap,
      threshold,
    })
  } catch (error: any) {
    console.error('Error fetching most ordered items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch most ordered items', mostOrdered: {}, threshold: 0 },
      { status: 500 }
    )
  }
}

