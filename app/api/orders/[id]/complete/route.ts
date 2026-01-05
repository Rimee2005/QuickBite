import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Order } from '@/lib/models/order'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { sendEmail, getRatingReviewEmailTemplate } from '@/lib/email'

/**
 * POST /api/orders/[id]/complete
 * Mark order as completed by user and send rating & review email
 */
export async function POST(
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

    // Find the order
    const order = await Order.findOne({ orderId: params.id }).lean()

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Verify the order belongs to the user
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized. This order does not belong to you.' },
        { status: 403 }
      )
    }

    // Only allow completion if order is in 'ready' status
    if (order.status !== 'ready') {
      return NextResponse.json(
        { error: `Order cannot be completed. Current status: ${order.status}. Order must be 'ready' to be completed.` },
        { status: 400 }
      )
    }

    // Update order status to completed
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: params.id },
      { 
        status: 'completed',
        updatedAt: new Date(),
      },
      { new: true }
    ).lean()

    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      )
    }

    // Send rating & review email
    if (updatedOrder.userEmail) {
      try {
        // Generate review link (you can customize this URL)
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const reviewLink = `${baseUrl}/student/review?orderId=${updatedOrder.orderId}`

        const emailHtml = getRatingReviewEmailTemplate(updatedOrder, reviewLink)
        await sendEmail({
          to: updatedOrder.userEmail,
          subject: `Rate Your Experience - ${updatedOrder.orderId} | QickBite`,
          html: emailHtml,
        })
        console.log('Rating & review email sent to:', updatedOrder.userEmail)
      } catch (emailError: any) {
        // Don't fail the completion if email fails
        console.error('Failed to send rating & review email:', emailError)
      }
    }

    return NextResponse.json({
      message: 'Order marked as completed successfully',
      order: updatedOrder,
    })
  } catch (error: any) {
    console.error('Error completing order:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to complete order' },
      { status: 500 }
    )
  }
}

