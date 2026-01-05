import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

/**
 * Upload image to Cloudinary
 * @param file - File buffer or base64 string
 * @param folder - Folder path in Cloudinary (optional)
 * @returns Promise with upload result containing secure_url
 */
export async function uploadImageToCloudinary(
  file: Buffer | string,
  folder: string = 'qickbite/menu-items',
  mimeType: string = 'image/jpeg'
): Promise<{ secure_url: string; public_id: string }> {
  try {
    let uploadData: string

    if (Buffer.isBuffer(file)) {
      // Convert Buffer to base64 data URI
      const base64 = file.toString('base64')
      uploadData = `data:${mimeType};base64,${base64}`
    } else if (typeof file === 'string') {
      // If it's already a data URI, use it directly
      if (file.startsWith('data:')) {
        uploadData = file
      } else {
        // If it's a base64 string without data URI prefix, add it
        uploadData = `data:${mimeType};base64,${file}`
      }
    } else {
      throw new Error('Invalid file type. Expected Buffer or string.')
    }

    const result = await cloudinary.uploader.upload(uploadData, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 800, height: 800, crop: 'limit' }, // Resize to max 800x800
        { quality: 'auto' }, // Auto optimize quality
        { format: 'auto' }, // Auto format (webp when supported)
      ],
    })

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    }
  } catch (error: any) {
    console.error('Cloudinary upload error:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - Public ID of the image to delete
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error: any) {
    console.error('Cloudinary delete error:', error)
    throw new Error(`Failed to delete image: ${error.message}`)
  }
}

