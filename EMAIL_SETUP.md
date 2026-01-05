# Email Setup Guide - Nodemailer with Gmail

This project uses Nodemailer with Gmail SMTP to send email notifications. Follow these steps to configure it:

## 1. Gmail App Password Setup

Since Gmail requires App Passwords for third-party applications, you need to:

1. **Enable 2-Step Verification** on your Gmail account:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification if not already enabled

2. **Generate an App Password**:
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Enter "QickBite" as the name
   - Click "Generate"
   - Copy the 16-character password (you'll need this)

## 2. Environment Variables

Add the following to your `.env.local` file:

```env
# Gmail SMTP Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

**Important:**
- Use your Gmail email address for `GMAIL_USER`
- Use the App Password (not your regular Gmail password) for `GMAIL_APP_PASSWORD`
- Never commit `.env.local` to version control
- Restart your development server after adding these variables

## 3. Email Notifications

The system sends emails for the following events:

### 📧 Order Placed
- **When**: User places an order
- **Recipient**: User's email
- **Content**: Order confirmation with order details

### ✅ Order Accepted
- **When**: Admin accepts/confirms the order
- **Recipient**: User's email
- **Content**: Order acceptance notification with estimated time

### 🎉 Order Ready
- **When**: Admin marks order as ready
- **Recipient**: User's email
- **Content**: Ready for pickup notification

### ⭐ Rating & Review
- **When**: User marks order as completed
- **Recipient**: User's email
- **Content**: Rating and review link

## 4. Testing

1. Start your development server: `npm run dev`
2. Place a test order
3. Check the console for email sending logs
4. Check the recipient's email inbox (and spam folder)

## 5. Troubleshooting

**Error: "Invalid login"**
- Verify your App Password is correct (16 characters, no spaces)
- Make sure 2-Step Verification is enabled
- Check that you're using App Password, not regular password

**Error: "Connection timeout"**
- Check your internet connection
- Verify Gmail SMTP settings are correct
- Try again after a few minutes

**Emails not received**
- Check spam/junk folder
- Verify the email address is correct
- Check console logs for errors
- Ensure environment variables are set correctly

## 6. Production Considerations

For production, consider:
- Using a dedicated email service (SendGrid, Mailgun, AWS SES)
- Setting up SPF, DKIM, and DMARC records
- Using a custom domain for sending emails
- Implementing email queue system for reliability
- Adding retry logic for failed email sends

## 7. Email Templates

All email templates are in `lib/email.ts`:
- `getOrderPlacedEmailTemplate()` - Order confirmation
- `getOrderAcceptedEmailTemplate()` - Order accepted
- `getOrderReadyEmailTemplate()` - Order ready
- `getRatingReviewEmailTemplate()` - Rating & review

You can customize these templates to match your brand.

