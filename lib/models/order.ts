import mongoose from 'mongoose'

export interface IOrderItem {
  menuItemId: string
  name: string
  quantity: number
  price: number
}

export interface IOrder {
  orderId: string
  userId: string
  userName: string
  userEmail: string
  items: IOrderItem[]
  totalAmount: number
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  estimatedTime?: number // in minutes
  createdAt: Date
  updatedAt: Date
}

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
}, { _id: false })

const orderSchema = new mongoose.Schema<IOrder>({
  orderId: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => `QB-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
  },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending',
    required: true 
  },
  estimatedTime: { type: Number }, // Estimated preparation time in minutes
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
})

// Update the updatedAt field before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema)

