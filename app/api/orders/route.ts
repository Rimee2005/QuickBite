import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Order } from '@/lib/models/order'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * GET /api/orders
 * Get all orders (admin) or user's orders (student)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectToDatabase()

    // Admin can see all orders, students see only their orders
    const query = session.user.type === 'admin' 
      ? {} 
      : { userId: session.user.id }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    return NextResponse.json({ orders })
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/orders
 * Create a new order
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
    const { items, totalAmount } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order items are required' },
        { status: 400 }
      )
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Valid total amount is required' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Create new order
    const order = await Order.create({
      userId: session.user.id,
      userName: session.user.name || 'Unknown',
      userEmail: session.user.email || '',
      items,
      totalAmount,
      status: 'pending',
    })

    // Emit socket event for real-time notification
    // This will be handled by the Socket.IO server
    const orderData = {
      orderId: order.orderId,
      userId: order.userId,
      userName: order.userName,
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
    }

    // Import and emit socket event
    // Note: In Next.js App Router, we'll handle this differently
    // We'll emit from the client side after successful order creation

    return NextResponse.json({
      message: 'Order created successfully',
      order: orderData,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

