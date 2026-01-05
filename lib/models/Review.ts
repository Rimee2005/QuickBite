import mongoose from 'mongoose'

export interface IReview {
  orderId: string
  userId: string
  userName: string
  menuItemId: string
  menuItemName: string
  rating: number // 1-5
  comment: string
  images?: string[] // Array of Cloudinary URLs
  createdAt: Date
  updatedAt: Date
}

const reviewSchema = new mongoose.Schema<IReview>({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  menuItemId: { type: String, required: true },
  menuItemName: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5,
  },
  comment: { type: String, required: true },
  images: [{ type: String }], // Array of Cloudinary URLs
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
})

// Index for efficient queries
reviewSchema.index({ menuItemId: 1 })
// Unique index: one review per user per order per menu item
reviewSchema.index({ userId: 1, orderId: 1, menuItemId: 1 }, { unique: true })

// Update the updatedAt field before saving
reviewSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema)

