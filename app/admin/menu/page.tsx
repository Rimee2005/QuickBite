"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, ArrowLeft, Upload, X, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

interface MenuItem {
  _id?: string
  id?: number
  name: { en: string; hi?: string; mai?: string; bho?: string } | string
  price: number
  category: string
  emoji?: string
  image?: string
  description?: string
  available?: boolean
}

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    emoji: "",
    image: "",
    description: "",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const { toast } = useToast()
  const { t, getTranslatedName, language } = useLanguage()

  // Fetch menu items from API
  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu')
      if (response.ok) {
        const data = await response.json()
        setMenuItems(data.menuItems || [])
      }
    } catch (error) {
      console.error('Error fetching menu items:', error)
      toast({
        title: t("admin.error_loading_menu") || "Error loading menu",
        description: t("admin.failed_fetch_menu") || "Failed to fetch menu items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMenuItems()
  }, [language]) // Re-fetch when language changes to ensure proper display

  const resetForm = () => {
    setFormData({ name: "", price: "", category: "", emoji: "", image: "", description: "" })
    setImagePreview(null)
    setEditingItem(null)
  }

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: t("admin.invalid_file_type") || "Invalid file type",
        description: t("admin.please_upload_image") || "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: t("admin.file_too_large") || "File too large",
        description: t("admin.upload_smaller_image") || "Please upload an image smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    setUploadingImage(true)

    try {
      // Create FormData for upload
      const formData = new FormData()
      formData.append('image', file)

      // Upload to Cloudinary via API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data = await response.json()

      // Store Cloudinary URL in form data
      setFormData((prev) => ({ ...prev, image: data.url }))
      setImagePreview(data.url)

      toast({
        title: t("admin.image_uploaded") || "Image uploaded successfully ✅",
        description: t("admin.image_uploaded_desc") || "Image has been uploaded to Cloudinary",
      })
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast({
        title: t("admin.error_uploading") || "Error uploading image",
        description: error.message || t("admin.failed_upload") || "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }))
    setImagePreview(null)
  }

  const handleAddItem = async () => {
    // Trim and validate name
    const name = formData.name?.trim() || ""
    if (name.length === 0) {
      toast({
        title: t("admin.validation_error") || "Validation Error ❌",
        description: t("admin.enter_item_name") || "Please enter an item name",
        variant: "destructive",
      })
      return
    }

    // Validate price
    const price = formData.price?.toString().trim() || ""
    if (price.length === 0) {
      toast({
        title: t("admin.validation_error") || "Validation Error ❌",
        description: t("admin.enter_price") || "Please enter a price",
        variant: "destructive",
      })
      return
    }

    const priceNum = Number.parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      toast({
        title: t("admin.validation_error") || "Validation Error ❌",
        description: `${t("admin.enter_valid_price") || "Please enter a valid price (greater than 0). Current value:"} "${price}"`,
        variant: "destructive",
      })
      return
    }

    // Validate category
    const category = formData.category?.trim() || ""
    if (category.length === 0) {
      toast({
        title: t("admin.validation_error") || "Validation Error ❌",
        description: t("admin.select_category_required") || "Please select a category",
        variant: "destructive",
      })
      return
    }

    // Image or emoji is required (emoji can be any text, not just emoji characters)
    const hasImage = formData.image && formData.image.trim().length > 0
    const hasEmoji = formData.emoji && formData.emoji.trim().length > 0
    
    if (!hasImage && !hasEmoji) {
      toast({
        title: t("admin.image_emoji_required") || "Image or emoji required",
        description: t("admin.upload_image_or_emoji") || "Please upload an image or add an emoji",
        variant: "destructive",
      })
      return
    }

    // Debug: Log form data to console
    console.log('Form data being submitted:', {
      name: name.trim(),
      price: priceNum,
      category: formData.category,
      hasImage: hasImage,
      hasEmoji: hasEmoji,
    })

    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          price: priceNum,
          category: category,
          image: formData.image || null,
          emoji: formData.emoji?.trim() || null,
          description: formData.description?.trim() || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        const errorMsg = data.error || `Server error: ${response.status} ${response.statusText}`
        throw new Error(errorMsg)
      }

      const data = await response.json()
      setMenuItems((prev) => [data.menuItem, ...prev])
      setIsAddDialogOpen(false)
      resetForm()
      toast({
        title: `${t("admin.item_added") || "Item added"} ✅`,
        description: `${formData.name} ${t("admin.added_to_menu") || "added to menu"}`,
      })
    } catch (error: any) {
      console.error('Error adding menu item:', error)
      const errorMessage = error.message || t("admin.failed_add_item") || "Failed to add menu item. Please check your connection and try again."
      toast({
        title: t("admin.error_adding") || "Error adding item ❌",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleEditItem = async () => {
    if (!editingItem || !formData.name || !formData.price || !formData.category) {
      toast({
        title: t("admin.validation_error") || "Validation Error ❌",
        description: t("admin.fill_required_fields") || "Please fill all required fields (Name, Price, Category)",
        variant: "destructive",
      })
      return
    }

    // Image or emoji is required
    if (!formData.image && !formData.emoji) {
      toast({
        title: t("admin.image_emoji_required") || "Image or emoji required",
        description: t("admin.upload_image_or_emoji") || "Please upload an image or add an emoji",
        variant: "destructive",
      })
      return
    }

    const itemId = editingItem._id || editingItem.id
    if (!itemId) {
      toast({
        title: t("admin.error") || "Error",
        description: t("admin.invalid_item_id") || "Invalid menu item ID",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/menu/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          price: Number.parseFloat(formData.price),
          category: formData.category,
          image: formData.image || null,
          emoji: formData.emoji || null,
          description: formData.description || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update menu item')
      }

      const data = await response.json()
      setMenuItems((prev) =>
        prev.map((item) => {
          const itemIdToCompare = item._id || item.id
          return itemIdToCompare === itemId ? data.menuItem : item
        })
      )

      resetForm()
      toast({
        title: `${t("admin.item_updated") || "Item updated"} ✅`,
        description: `${formData.name} ${t("admin.has_been_updated") || "has been updated"}`,
      })
    } catch (error: any) {
      console.error('Error updating menu item:', error)
      toast({
        title: "Error updating item ❌",
        description: error.message || "Failed to update menu item",
        variant: "destructive",
      })
    }
  }

  const handleDeleteItem = async (item: MenuItem) => {
    const itemId = item._id || item.id
    if (!itemId) return

    try {
      const response = await fetch(`/api/menu/${itemId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete menu item')
      }

      setMenuItems((prev) => prev.filter((i) => {
        const idToCompare = i._id || i.id
        return idToCompare !== itemId
      }))
      toast({
        title: `${t("admin.item_deleted") || "Item deleted"} 🗑️`,
        description: t("admin.menu_item_removed") || "Menu item removed",
      })
    } catch (error: any) {
      console.error('Error deleting menu item:', error)
      toast({
        title: "Error deleting item ❌",
        description: error.message || "Failed to delete menu item",
        variant: "destructive",
      })
    }
  }

  const startEdit = (item: MenuItem) => {
    setEditingItem(item)
    // Handle both old format (string) and new format (object)
    const nameValue = typeof item.name === 'string' ? item.name : item.name.en
    setFormData({
      name: nameValue,
      price: item.price.toString(),
      category: item.category,
      emoji: item.emoji || "",
      image: item.image || "",
      description: item.description || "",
    })
    setImagePreview(item.image || null)
  }

  // Helper function to get translated category name
  const getCategoryName = (category: string) => {
    switch (category) {
      case "Snacks":
        return t("dashboard.categories.snacks") || "Snacks"
      case "Beverages":
        return t("dashboard.categories.beverages") || "Beverages"
      case "Meals":
        return t("dashboard.categories.meals") || "Meals"
      default:
        return category
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header - Improved Layout */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/admin/dashboard">
              <Button 
                variant="outline" 
                className="border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("admin.back_to_dashboard")}
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              {t("admin.manage_menu_title")} 🍽️
            </h1>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <Plus className="w-4 h-4 mr-2" />
                {t("admin.add_new_item")}
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[1.25rem]">
              <DialogHeader>
                <DialogTitle>{t("admin.add_new_menu_item")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">{t("admin.item_name") || "Item Name"} *</Label>
                    <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="rounded-[1.25rem]"
                    placeholder={t("admin.name_placeholder") || "e.g., Burger"}
                    required
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <Label htmlFor="image">{t("admin.item_image") || "Food Image"}</Label>
                  <div className="space-y-2">
                    {imagePreview ? (
                      <div className="relative">
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">{t("admin.click_upload") || "Click to upload"}</span> {t("admin.drag_drop") || "or drag and drop"}
                          </p>
                          <p className="text-xs text-gray-500">{t("admin.file_types") || "PNG, JPG, GIF up to 10MB"}</p>
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Emoji (Optional, for backward compatibility) */}
                <div>
                  <Label htmlFor="emoji">{t("admin.item_emoji") || "Emoji (Optional)"}</Label>
                  <Input
                    id="emoji"
                    value={formData.emoji}
                    onChange={(e) => setFormData((prev) => ({ ...prev, emoji: e.target.value }))}
                    className="rounded-[1.25rem]"
                    placeholder={t("admin.emoji_placeholder") || "🍔 (optional if image is uploaded)"}
                  />
                  <p className="text-xs text-gray-500 mt-1">{t("admin.emoji_optional") || "Optional: Add an emoji if no image is uploaded"}</p>
                </div>

                <div>
                  <Label htmlFor="price">{t("admin.item_price") || "Price"}</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    className="rounded-[1.25rem]"
                    placeholder={t("admin.price_placeholder") || "70"}
                  />
                </div>
                <div>
                  <Label htmlFor="category">{t("admin.item_category") || "Category"}</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="rounded-[1.25rem]">
                      <SelectValue placeholder={t("admin.select_category") || "Select category"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Snacks">{t("dashboard.categories.snacks") || "Snacks"}</SelectItem>
                      <SelectItem value="Beverages">{t("dashboard.categories.beverages") || "Beverages"}</SelectItem>
                      <SelectItem value="Meals">{t("dashboard.categories.meals") || "Meals"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">{t("admin.item_description") || "Description (Optional)"}</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="rounded-[1.25rem]"
                    placeholder={t("admin.description_placeholder") || "Brief description of the item"}
                  />
                </div>
                <Button onClick={handleAddItem} className="w-full btn-primary">
                  {t("admin.add_item") || "Add Item"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">{t("admin.loading_menu") || "Loading menu items..."}</p>
          </div>
        )}

        {/* Menu Items Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {menuItems.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 dark:text-gray-300">{t("admin.no_items_yet") || "No menu items yet. Add your first item!"}</p>
              </div>
            ) : (
              menuItems.map((item) => {
                const itemId = item._id || item.id
                return (
                  <Card key={itemId} className="card-style overflow-hidden">
                    <CardHeader className="text-center p-0">
                      {/* Image or Emoji Display */}
                      <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={getTranslatedName(item)}
                            fill
                            className="object-cover"
                          />
                        ) : item.emoji ? (
                          <div className="text-6xl">{item.emoji}</div>
                        ) : (
                          <ImageIcon className="w-16 h-16 text-gray-400" />
                        )}
                      </div>
                      <div className="p-4">
                        <CardTitle className="text-lg">{getTranslatedName(item)}</CardTitle>
                        {item.description && (
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">₹{item.price}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{getCategoryName(item.category)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 rounded-[1.25rem]"
                              onClick={() => startEdit(item)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              {t("admin.edit_item") || "Edit"}
                            </Button>
                          </DialogTrigger>
                    <DialogContent className="rounded-[1.25rem]">
                      <DialogHeader>
                        <DialogTitle>{t("admin.edit_menu_item")}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="edit-name">{t("admin.item_name") || "Item Name"} *</Label>
                          <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            className="rounded-[1.25rem]"
                            required
                          />
                        </div>

                        {/* Image Upload for Edit */}
                        <div>
                          <Label htmlFor="edit-image">{t("admin.item_image") || "Food Image"}</Label>
                          <div className="space-y-2">
                            {imagePreview ? (
                              <div className="relative">
                                <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                                  <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2"
                                  onClick={removeImage}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <label
                                htmlFor="edit-image-upload"
                                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  {uploadingImage ? (
                                    <>
                                      <div className="w-8 h-8 mb-2 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                      <p className="mb-2 text-sm text-gray-500">{t("admin.uploading") || "Uploading..."}</p>
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                      <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">{t("admin.click_upload") || "Click to upload"}</span> {t("admin.drag_drop") || "or drag and drop"}
                                      </p>
                                      <p className="text-xs text-gray-500">{t("admin.file_types") || "PNG, JPG, GIF up to 10MB"}</p>
                                    </>
                                  )}
                                </div>
                                <input
                                  id="edit-image-upload"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleImageUpload}
                                  disabled={uploadingImage}
                                />
                              </label>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="edit-emoji">{t("admin.item_emoji") || "Emoji (Optional)"}</Label>
                          <Input
                            id="edit-emoji"
                            value={formData.emoji}
                            onChange={(e) => setFormData((prev) => ({ ...prev, emoji: e.target.value }))}
                            className="rounded-[1.25rem]"
                            placeholder={t("admin.emoji_placeholder") || "🍔 (optional if image is uploaded)"}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-price">{t("admin.item_price") || "Price"}</Label>
                          <Input
                            id="edit-price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                            className="rounded-[1.25rem]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-category">{t("admin.item_category") || "Category"}</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger className="rounded-[1.25rem]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Snacks">{t("dashboard.categories.snacks") || "Snacks"}</SelectItem>
                              <SelectItem value="Beverages">{t("dashboard.categories.beverages") || "Beverages"}</SelectItem>
                              <SelectItem value="Meals">{t("dashboard.categories.meals") || "Meals"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="edit-description">{t("admin.item_description") || "Description (Optional)"}</Label>
                          <Input
                            id="edit-description"
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            className="rounded-[1.25rem]"
                            placeholder={t("admin.description_placeholder") || "Brief description of the item"}
                          />
                        </div>
                        <Button onClick={handleEditItem} className="w-full btn-primary">
                          {t("admin.update_item") || "Update Item"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-[1.25rem]"
                          onClick={() => handleDeleteItem(item)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}
