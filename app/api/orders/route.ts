import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Order } from '@/lib/models/order'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { sendEmail, getOrderPlacedEmailTemplate } from '@/lib/email'

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

    // Admin can see all orders, students and teachers see only their orders
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

    console.log('Order creation request:', {
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      itemsCount: items?.length,
      totalAmount,
    })

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

    // Validate required fields
    if (!session.user.id) {
      return NextResponse.json(
        { error: 'User ID is missing' },
        { status: 400 }
      )
    }

    if (!session.user.name && !session.user.email) {
      return NextResponse.json(
        { error: 'User name or email is required' },
        { status: 400 }
      )
    }

    // Validate order items structure
    const validatedItems = items.map((item: any, index: number) => {
      // menuItemId can be a string, number, or undefined (we'll generate one if missing)
      const menuItemId = item.menuItemId !== undefined && item.menuItemId !== null 
        ? String(item.menuItemId) 
        : `temp-${Date.now()}-${index}`
      
      // Handle both old format (string) and new format (object)
      let nameValue: string
      if (typeof item.name === 'string') {
        nameValue = item.name.trim()
      } else if (item.name && typeof item.name === 'object' && item.name.en) {
        // For new format, use the English name as the stored name
        // The full object structure is preserved in the menu item itself
        nameValue = item.name.en.trim()
      } else {
        throw new Error(`Item ${index + 1}: name is required`)
      }
      
      if (nameValue.length === 0) {
        throw new Error(`Item ${index + 1}: name cannot be empty`)
      }
      if (!item.quantity || item.quantity <= 0) {
        throw new Error(`Item ${index + 1}: valid quantity is required`)
      }
      if (!item.price || item.price <= 0) {
        throw new Error(`Item ${index + 1}: valid price is required`)
      }
      return {
        menuItemId: menuItemId,
        name: nameValue,
        quantity: Number(item.quantity),
        price: Number(item.price),
      }
    })

    // Prepare order data
    const orderData = {
      userId: String(session.user.id),
      userName: session.user.name || session.user.email || 'Unknown',
      userEmail: session.user.email || '',
      items: validatedItems,
      totalAmount: Number(totalAmount),
      status: 'pending' as const,
    }

    console.log('Creating order with data:', {
      ...orderData,
      items: validatedItems.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
    })

    // Create new order
    const order = await Order.create(orderData)

    // Send order placed email to user
    if (order.userEmail) {
      try {
        // Convert Mongoose document to plain object
        const orderObj = order.toObject ? order.toObject() : order
        const emailHtml = getOrderPlacedEmailTemplate(orderObj as any)
        await sendEmail({
          to: order.userEmail,
          subject: `Order Placed - ${order.orderId} | QickBite`,
          html: emailHtml,
        })
        console.log('Order placed email sent to:', order.userEmail)
      } catch (emailError: any) {
        // Don't fail the order creation if email fails
        console.error('Failed to send order placed email:', emailError)
      }
    }

    // Prepare response data
    const responseData = {
      orderId: order.orderId,
      userId: order.userId,
      userName: order.userName,
      userEmail: order.userEmail,
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
      order: responseData,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating order:', error)
    
    // Provide more specific error messages
    if (error?.name === 'ValidationError') {
      return NextResponse.json(
        { error: `Validation error: ${error.message}` },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error?.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}

