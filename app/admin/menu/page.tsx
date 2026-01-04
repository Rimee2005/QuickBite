"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

interface MenuItem {
  id: number
  name: string
  price: number
  category: string
  emoji: string
}

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, name: "Burger", price: 70, category: "Meals", emoji: "🍔" },
    { id: 2, name: "Cold Coffee", price: 40, category: "Beverages", emoji: "☕" },
    { id: 3, name: "French Fries", price: 50, category: "Snacks", emoji: "🍟" },
    { id: 4, name: "Chicken Biryani", price: 120, category: "Meals", emoji: "🍛" },
    { id: 5, name: "Samosa", price: 15, category: "Snacks", emoji: "🥟" },
    { id: 6, name: "Mango Juice", price: 35, category: "Beverages", emoji: "🥭" },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    emoji: "",
  })

  const { toast } = useToast()
  const { t } = useLanguage()

  const resetForm = () => {
    setFormData({ name: "", price: "", category: "", emoji: "" })
    setEditingItem(null)
  }

  const handleAddItem = () => {
    if (!formData.name || !formData.price || !formData.category || !formData.emoji) {
      toast({
        title: `${t("admin.error_loading")} ❌`,
        description: t("admin.fill_all_fields"),
        variant: "destructive",
      })
      return
    }

    const newItem: MenuItem = {
      id: Date.now(),
      name: formData.name,
      price: Number.parseInt(formData.price),
      category: formData.category,
      emoji: formData.emoji,
    }

    setMenuItems((prev) => [...prev, newItem])
    setIsAddDialogOpen(false)
    resetForm()
    toast({
      title: `${t("admin.item_added")} ✅`,
      description: `${formData.name} ${t("admin.added_to_menu")}`,
    })
  }

  const handleEditItem = () => {
    if (!editingItem || !formData.name || !formData.price || !formData.category || !formData.emoji) {
      toast({
        title: `${t("admin.error_loading")} ❌`,
        description: t("admin.fill_all_fields"),
        variant: "destructive",
      })
      return
    }

    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              name: formData.name,
              price: Number.parseInt(formData.price),
              category: formData.category,
              emoji: formData.emoji,
            }
          : item,
      ),
    )

    resetForm()
    toast({
      title: `${t("admin.item_updated")} ✅`,
      description: `${formData.name} ${t("admin.has_been_updated")}`,
    })
  }

  const handleDeleteItem = (id: number) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id))
    toast({
      title: `${t("admin.item_deleted")} 🗑️`,
      description: t("admin.menu_item_removed"),
    })
  }

  const startEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      emoji: item.emoji,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("admin.back_to_dashboard")}
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">{t("admin.manage_menu_title")} 🍽️</h1>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
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
                  <Label htmlFor="name">{t("admin.item_name")}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="rounded-[1.25rem]"
                    placeholder="e.g., Burger"
                  />
                </div>
                <div>
                  <Label htmlFor="emoji">{t("admin.item_emoji")}</Label>
                  <Input
                    id="emoji"
                    value={formData.emoji}
                    onChange={(e) => setFormData((prev) => ({ ...prev, emoji: e.target.value }))}
                    className="rounded-[1.25rem]"
                    placeholder="🍔"
                  />
                </div>
                <div>
                  <Label htmlFor="price">{t("admin.item_price")}</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    className="rounded-[1.25rem]"
                    placeholder="70"
                  />
                </div>
                <div>
                  <Label htmlFor="category">{t("admin.item_category")}</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="rounded-[1.25rem]">
                      <SelectValue placeholder={t("admin.select_category")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Snacks">{t("dashboard.categories.snacks")}</SelectItem>
                      <SelectItem value="Beverages">{t("dashboard.categories.beverages")}</SelectItem>
                      <SelectItem value="Meals">{t("dashboard.categories.meals")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddItem} className="w-full btn-primary">
                  {t("admin.add_item")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <Card key={item.id} className="card-style">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{item.emoji}</div>
                <CardTitle>{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-emerald-600 font-bold text-lg">₹{item.price}</p>
                  <p className="text-gray-500 text-sm">{item.category}</p>
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
                        {t("admin.edit_item")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-[1.25rem]">
                      <DialogHeader>
                        <DialogTitle>{t("admin.edit_menu_item")}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="edit-name">{t("admin.item_name")}</Label>
                          <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            className="rounded-[1.25rem]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-emoji">{t("admin.item_emoji")}</Label>
                          <Input
                            id="edit-emoji"
                            value={formData.emoji}
                            onChange={(e) => setFormData((prev) => ({ ...prev, emoji: e.target.value }))}
                            className="rounded-[1.25rem]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-price">{t("admin.item_price")}</Label>
                          <Input
                            id="edit-price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                            className="rounded-[1.25rem]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-category">{t("admin.item_category")}</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger className="rounded-[1.25rem]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Snacks">{t("dashboard.categories.snacks")}</SelectItem>
                              <SelectItem value="Beverages">{t("dashboard.categories.beverages")}</SelectItem>
                              <SelectItem value="Meals">{t("dashboard.categories.meals")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleEditItem} className="w-full btn-primary">
                          {t("admin.update_item")}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-[1.25rem]"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
