import mongoose from 'mongoose'

export interface IMenuItem {
  name: {
    en: string
    hi?: string
    mai?: string
    bho?: string
  }
  price: number
  category: 'Snacks' | 'Beverages' | 'Meals'
  image?: string // Cloudinary URL
  emoji?: string // Optional emoji for backward compatibility
  description?: string
  available: boolean
  createdAt: Date
  updatedAt: Date
}

const menuItemSchema = new mongoose.Schema<IMenuItem>({
  name: {
    en: { type: String, required: true },
    hi: { type: String },
    mai: { type: String },
    bho: { type: String },
  },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['Snacks', 'Beverages', 'Meals'],
    required: true 
  },
  image: { type: String }, // Cloudinary URL
  emoji: { type: String }, // Optional, for backward compatibility
  description: { type: String },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
})

// Update the updatedAt field before saving
menuItemSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export const MenuItem = mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', menuItemSchema)

