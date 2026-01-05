# Cloudinary Setup Guide

This project uses Cloudinary for image storage and management. Follow these steps to set it up:

## 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account (or log in if you already have one)
3. The free tier includes:
   - 25 GB storage
   - 25 GB monthly bandwidth
   - Image transformations
   - Auto-optimization

## 2. Get Your Cloudinary Credentials

1. After signing up, you'll be taken to your dashboard
2. On the dashboard, you'll see your **Cloud Name**, **API Key**, and **API Secret**
3. Copy these values (you'll need them in the next step)

## 3. Add Environment Variables

Add the following to your `.env.local` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Important:** 
- Never commit `.env.local` to version control
- Replace the placeholder values with your actual Cloudinary credentials
- Restart your development server after adding these variables

## 4. How It Works

- **Image Upload**: When admins upload images in the menu management page, images are automatically uploaded to Cloudinary
- **Storage**: Images are stored in the `qickbite/menu-items` folder in your Cloudinary account
- **Optimization**: Images are automatically:
  - Resized to max 800x800px
  - Optimized for web (auto quality)
  - Converted to WebP format when supported by the browser
- **URLs**: Cloudinary URLs are stored in MongoDB instead of base64 strings

## 5. Benefits

✅ **Faster Loading**: Images are served from Cloudinary's CDN  
✅ **Automatic Optimization**: Images are optimized for web automatically  
✅ **Scalable**: No database bloat from base64 strings  
✅ **Transformations**: Easy to resize/transform images on the fly  
✅ **Free Tier**: Generous free tier for small to medium apps  

## 6. Testing

1. Start your development server: `npm run dev`
2. Log in as an admin
3. Go to Menu Management
4. Try uploading an image - you should see "Image uploaded successfully ✅"
5. Check your Cloudinary dashboard to see the uploaded image

## Troubleshooting

**Error: "Failed to upload image"**
- Check that your environment variables are set correctly
- Verify your Cloudinary credentials in the dashboard
- Make sure you've restarted your dev server after adding env variables

**Images not displaying**
- Check browser console for errors
- Verify the Cloudinary URL is stored correctly in MongoDB
- Ensure the image URL starts with `https://res.cloudinary.com/`

