import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Order } from '@/lib/models/order'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { 
  sendEmail, 
  getOrderAcceptedEmailTemplate, 
  getOrderReadyEmailTemplate 
} from '@/lib/email'

/**
 * GET /api/orders/[id]
 * Get a specific order by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const order = await Order.findOne({ orderId: params.id }).lean()

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Students can only see their own orders
    if (session.user.type !== 'admin' && order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    return NextResponse.json({ order })
  } catch (error: any) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/orders/[id]
 * Update order status (admin only)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only admins can update order status
    if (session.user.type !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { status, estimatedTime } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Get the old order to check previous status
    const oldOrder = await Order.findOne({ orderId: params.id }).lean()
    
    if (!oldOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const order = await Order.findOneAndUpdate(
      { orderId: params.id },
      { 
        status,
        ...(estimatedTime && { estimatedTime }),
        updatedAt: new Date(),
      },
      { new: true }
    ).lean()

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Send email notifications based on status change
    if (order.userEmail && oldOrder.status !== status) {
      try {
        if (status === 'accepted') {
          // Send order accepted email
          const emailHtml = getOrderAcceptedEmailTemplate(order)
          await sendEmail({
            to: order.userEmail,
            subject: `Order Accepted - ${order.orderId} | QickBite`,
            html: emailHtml,
          })
          console.log('Order accepted email sent to:', order.userEmail)
        } else if (status === 'ready') {
          // Send order ready email
          const emailHtml = getOrderReadyEmailTemplate(order)
          await sendEmail({
            to: order.userEmail,
            subject: `Order Ready for Pickup - ${order.orderId} | QickBite`,
            html: emailHtml,
          })
          console.log('Order ready email sent to:', order.userEmail)
        }
      } catch (emailError: any) {
        // Don't fail the status update if email fails
        console.error('Failed to send status update email:', emailError)
      }
    }

    // Return updated order
    // Socket.IO event will be emitted from the client side (admin dashboard)
    return NextResponse.json({
      message: 'Order status updated successfully',
      order,
    })
  } catch (error: any) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

