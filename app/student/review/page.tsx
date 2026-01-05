"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Star, Upload, X, ArrowLeft, Image as ImageIcon, Send } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"

interface OrderItem {
  menuItemId: string
  name: string
  quantity: number
  price: number
}

interface Order {
  orderId: string
  items: OrderItem[]
  status: string
}

export default function ReviewPage() {
  const [order, setOrder] = useState<Order | null>(null)
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null)
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [comment, setComment] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const orderId = searchParams.get("orderId")
  const menuItemId = searchParams.get("menuItemId")

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || user?.type !== "student") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  // Fetch order details and existing review
  useEffect(() => {
    if (!orderId) {
      toast({
        title: "Order ID missing",
        description: "Please provide a valid order ID",
        variant: "destructive",
      })
      router.push("/student/dashboard")
      return
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch order")
        }
        const data = await response.json()
        setOrder(data.order)

        // If menuItemId is provided, select that item
        if (menuItemId && data.order.items) {
          const item = data.order.items.find((i: OrderItem) => i.menuItemId === menuItemId)
          if (item) {
            setSelectedItem(item)
            
            // Fetch existing review for this item
            try {
              const reviewResponse = await fetch(`/api/reviews?menuItemId=${menuItemId}`)
              if (reviewResponse.ok) {
                const reviewData = await reviewResponse.json()
                const existingReview = reviewData.reviews?.find(
                  (r: any) => r.orderId === orderId && r.userId === user?.id
                )
                if (existingReview) {
                  setRating(existingReview.rating)
                  setComment(existingReview.comment || "")
                  setImages(existingReview.images || [])
                  setImagePreviews(existingReview.images || [])
                }
              }
            } catch (error) {
              console.error("Error fetching existing review:", error)
            }
          }
        }
      } catch (error: any) {
        console.error("Error fetching order:", error)
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive",
        })
        router.push("/student/dashboard")
      }
    }

    fetchOrder()
  }, [orderId, menuItemId, router, toast, user?.id])

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Limit to 3 images
    const filesArray = Array.from(files).slice(0, 3 - images.length)

    setUploading(true)

    try {
      const uploadPromises = filesArray.map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error('Invalid file type. Only images are allowed.')
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('File too large. Maximum size is 5MB.')
        }

        // Upload to Cloudinary (specify reviews folder)
        const formData = new FormData()
        formData.append('image', file)
        formData.append('folder', 'qickbite/reviews')

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to upload image')
        }

        const data = await response.json()
        return data.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      setImages((prev) => [...prev, ...uploadedUrls])
      setImagePreviews((prev) => [...prev, ...uploadedUrls])

      toast({
        title: "Images uploaded successfully ✅",
        description: `${uploadedUrls.length} image(s) uploaded`,
      })
    } catch (error: any) {
      console.error('Error uploading images:', error)
      toast({
        title: "Error uploading images",
        description: error.message || "Failed to upload images",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle review submission
  const handleSubmitReview = async () => {
    if (!selectedItem) {
      toast({
        title: "Please select an item",
        description: "Select a menu item to review",
        variant: "destructive",
      })
      return
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide a rating",
        variant: "destructive",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Comment required",
        description: "Please write a comment about your experience",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId,
          menuItemId: selectedItem.menuItemId,
          rating,
          comment: comment.trim(),
          images,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit review')
      }

      const data = await response.json()
      toast({
        title: data.isUpdate ? "Review updated successfully! ⭐" : "Review submitted successfully! ⭐",
        description: data.isUpdate ? "Your review has been updated." : "Thank you for your feedback!",
      })

      // Redirect to order status or dashboard
      router.push(`/student/order-status?orderId=${orderId}`)
    } catch (error: any) {
      console.error('Error submitting review:', error)
      toast({
        title: "Error submitting review",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center">
        <Card className="p-8">
          <p className="text-gray-600">Loading order details...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/student/order-status?orderId=${orderId}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Order Status
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Rate Your Experience ⭐</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Order ID: {order.orderId}</p>
        </div>

        {/* Select Menu Item */}
        {!selectedItem && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select an Item to Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <Button
                    key={item.menuItemId}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-4"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Review Form */}
        {selectedItem && (
          <Card>
            <CardHeader>
              <CardTitle>Review: {selectedItem.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Rating */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Rating *</Label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        className={`w-10 h-10 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                      {rating} {rating === 1 ? "star" : "stars"}
                    </span>
                  )}
                </div>
              </div>

              {/* Comment */}
              <div>
                <Label htmlFor="comment" className="text-base font-semibold mb-3 block">
                  Your Review *
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience with this item..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[120px] rounded-xl"
                  rows={5}
                />
              </div>

              {/* Image Upload */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Add Photos (Optional)
                </Label>
                <div className="space-y-4">
                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {imagePreviews.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                          <Image
                            src={url}
                            alt={`Review image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => removeImage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Button */}
                  {imagePreviews.length < 3 && (
                    <label
                      htmlFor="image-upload"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                          <>
                            <div className="w-8 h-8 mb-2 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mb-2 text-sm text-gray-500">Uploading...</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> photos
                            </p>
                            <p className="text-xs text-gray-500">Up to 3 images, 5MB each</p>
                          </>
                        )}
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedItem(null)
                    setRating(0)
                    setComment("")
                    setImages([])
                    setImagePreviews([])
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  disabled={submitting || rating === 0 || !comment.trim()}
                  className="flex-1 bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

