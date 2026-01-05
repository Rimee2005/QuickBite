import { IOrder } from './models/order'

// Dynamically import nodemailer to handle cases where it might not be installed
let nodemailer: any = null
try {
  nodemailer = require('nodemailer')
} catch (error) {
  console.warn('nodemailer not available. Email functionality will be disabled.')
}

// Create reusable transporter
const createTransporter = () => {
  if (!nodemailer) {
    throw new Error('nodemailer is not installed')
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
    },
  })
}

/**
 * Send email using Nodemailer
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<void> {
  try {
    // Check if nodemailer is available
    if (!nodemailer) {
      console.warn('nodemailer is not installed. Email not sent.')
      return
    }

    // Validate environment variables
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn('Gmail credentials not configured. Email not sent.')
      return
    }

    const transporter = createTransporter()

    const mailOptions = {
      from: `"QickBite" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)
  } catch (error: any) {
    console.error('Error sending email:', error)
    // Don't throw error, just log it so the order can still be placed
    console.warn('Email sending failed, but order processing continues.')
  }
}

/**
 * Format order items for email display
 */
function formatOrderItems(items: IOrder['items']): string {
  return items
    .map((item) => `${item.quantity}x ${item.name} - ₹${item.price * item.quantity}`)
    .join('<br>')
}

/**
 * Email template: Order Placed
 */
export function getOrderPlacedEmailTemplate(order: IOrder): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Placed - QickBite</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🍽️ QickBite</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Order Confirmation</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Order Placed Successfully! ✅</h2>
                  
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Hi ${order.userName},
                  </p>
                  
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Thank you for your order! We've received your order and our team is preparing it for you.
                  </p>
                  
                  <!-- Order Details -->
                  <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 30px 0;">
                    <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Order Details</h3>
                    <p style="color: #4b5563; margin: 5px 0; font-size: 14px;"><strong>Order ID:</strong> ${order.orderId}</p>
                    <p style="color: #4b5563; margin: 5px 0; font-size: 14px;"><strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">Pending</span></p>
                    <p style="color: #4b5563; margin: 5px 0; font-size: 14px;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  
                  <!-- Order Items -->
                  <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 30px 0;">
                    <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Order Items</h3>
                    <div style="color: #4b5563; font-size: 14px; line-height: 1.8;">
                      ${formatOrderItems(order.items)}
                    </div>
                    <div style="border-top: 2px solid #e5e7eb; margin-top: 15px; padding-top: 15px;">
                      <p style="color: #1f2937; margin: 0; font-size: 18px; font-weight: bold;">
                        Total Amount: <span style="color: #10b981;">₹${order.totalAmount.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                  
                  <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                    We'll notify you once your order is accepted and ready for pickup. Thank you for choosing QickBite! 🎉
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} QickBite. All rights reserved.
                  </p>
                  <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">
                    This is an automated email. Please do not reply.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

/**
 * Email template: Order Accepted/Confirmed
 */
export function getOrderAcceptedEmailTemplate(order: IOrder): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Accepted - QickBite</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🍽️ QickBite</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Order Accepted</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Order Accepted! ✅</h2>
                  
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Hi ${order.userName},
                  </p>
                  
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Great news! Your order has been accepted and our kitchen team has started preparing your meal.
                  </p>
                  
                  <!-- Order Details -->
                  <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 30px 0;">
                    <p style="color: #1f2937; margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">Order ID: ${order.orderId}</p>
                    ${order.estimatedTime ? `
                      <p style="color: #1e40af; margin: 10px 0 0 0; font-size: 18px; font-weight: bold;">
                        ⏱️ Estimated Time: ${order.estimatedTime} minutes
                      </p>
                    ` : ''}
                  </div>
                  
                  <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                    We'll notify you as soon as your order is ready for pickup. Thank you for your patience! 🙏
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} QickBite. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

/**
 * Email template: Order Ready
 */
export function getOrderReadyEmailTemplate(order: IOrder): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Ready - QickBite</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🍽️ QickBite</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Order Ready for Pickup!</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Your Order is Ready! 🎉</h2>
                  
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Hi ${order.userName},
                  </p>
                  
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Excellent news! Your order is ready for pickup. Please come to collect your delicious meal!
                  </p>
                  
                  <!-- Order Details -->
                  <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 8px; padding: 20px; margin: 30px 0;">
                    <p style="color: #1f2937; margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">Order ID: ${order.orderId}</p>
                    <p style="color: #059669; margin: 10px 0 0 0; font-size: 18px; font-weight: bold;">
                      ✅ Status: Ready for Pickup
                    </p>
                  </div>
                  
                  <!-- Order Items -->
                  <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 30px 0;">
                    <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Your Order</h3>
                    <div style="color: #4b5563; font-size: 14px; line-height: 1.8;">
                      ${formatOrderItems(order.items)}
                    </div>
                    <div style="border-top: 2px solid #e5e7eb; margin-top: 15px; padding-top: 15px;">
                      <p style="color: #1f2937; margin: 0; font-size: 18px; font-weight: bold;">
                        Total: <span style="color: #10b981;">₹${order.totalAmount.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                  
                  <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                    We look forward to serving you! See you soon! 😊
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} QickBite. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

/**
 * Email template: Rating & Review (sent when order is completed)
 */
export function getRatingReviewEmailTemplate(order: IOrder, reviewLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rate Your Experience - QickBite</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🍽️ QickBite</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Share Your Experience</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">How was your experience? ⭐</h2>
                  
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Hi ${order.userName},
                  </p>
                  
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Thank you for choosing QickBite! We hope you enjoyed your meal. Your feedback helps us improve and serve you better.
                  </p>
                  
                  <!-- Order Details -->
                  <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 30px 0;">
                    <p style="color: #1f2937; margin: 0 0 10px 0; font-size: 14px;"><strong>Order ID:</strong> ${order.orderId}</p>
                    <p style="color: #1f2937; margin: 0; font-size: 14px;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  
                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 40px 0;">
                    <a href="${reviewLink}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      Rate & Review Your Order ⭐
                    </a>
                  </div>
                  
                  <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                    Your feedback is valuable to us and helps us serve you better!
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} QickBite. All rights reserved.
                  </p>
                  <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">
                    This link will expire in 30 days.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

