"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, User, Camera, Lock, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

interface Profile {
  id: string
  name: string
  email: string
  type: string
  role: string
  profileImage: string | null
  createdAt: string
  updatedAt: string
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile")
  const [formData, setFormData] = useState({
    name: "",
    profileImage: null as string | null,
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }
      const data = await response.json()
      setProfile(data.profile)
      setFormData({
        name: data.profile.name,
        profileImage: data.profile.profileImage,
      })
    } catch (error: any) {
      toast({
        title: t("admin.error") || "Error",
        description: error.message || t("admin.failed_load_profile") || "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: t("admin.invalid_file_type") || "Invalid file type",
        description: t("admin.please_upload_image") || "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t("admin.file_too_large") || "File too large",
        description: t("admin.upload_smaller_image") || "Please upload an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("folder", "qickbite/profiles")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload image")
      }

      const data = await response.json()
      setFormData((prev) => ({ ...prev, profileImage: data.url }))

      toast({
        title: t("admin.image_uploaded") || "Image uploaded successfully ✅",
        description: t("admin.profile_image_uploaded") || "Profile image has been uploaded",
      })
    } catch (error: any) {
      toast({
        title: t("admin.error_uploading") || "Error uploading image",
        description: error.message || t("admin.failed_upload") || "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) {
      toast({
        title: t("admin.validation_error") || "Validation Error",
        description: t("admin.name_required") || "Name is required",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          profileImage: formData.profileImage,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update profile")
      }

      const data = await response.json()
      setProfile(data.profile)

      toast({
        title: t("admin.profile_updated") || "Profile updated successfully ✅",
        description: t("admin.profile_updated_desc") || "Your profile has been updated",
      })
    } catch (error: any) {
      toast({
        title: t("admin.error") || "Error",
        description: error.message || t("admin.failed_update_profile") || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      toast({
        title: t("admin.validation_error") || "Validation Error",
        description: t("admin.all_fields_required") || "All password fields are required",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: t("admin.validation_error") || "Validation Error",
        description: t("admin.password_min_length") || "New password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: t("admin.validation_error") || "Validation Error",
        description: t("admin.passwords_not_match") || "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to change password")
      }

      toast({
        title: t("admin.password_changed") || "Password changed successfully ✅",
        description: t("admin.password_changed_desc") || "Your password has been updated",
      })

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      toast({
        title: t("admin.error") || "Error",
        description: error.message || t("admin.failed_change_password") || "Failed to change password",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl mx-auto">
        <Link href="/admin/dashboard">
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-4 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("admin.back_to_dashboard")}
          </Button>
        </Link>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{t("admin.account_settings") || "Account Settings"}</CardTitle>
            <CardDescription>{t("admin.manage_profile_security") || "Manage your profile and account security"}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b">
              <button
                onClick={() => setActiveTab("profile")}
                className={`pb-2 px-1 border-b-2 transition-colors ${
                  activeTab === "profile"
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t("admin.profile") || "Profile"}
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`pb-2 px-1 border-b-2 transition-colors ${
                  activeTab === "password"
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t("admin.password") || "Password"}
              </button>
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Profile Image */}
                <div className="space-y-2">
                  <Label>{t("admin.profile_image") || "Profile Image"}</Label>
                  <div className="flex items-center space-x-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      {formData.profileImage ? (
                        <Image
                          src={formData.profileImage}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-image" className="cursor-pointer">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={uploadingImage}
                          asChild
                        >
                          <span>
                            <Camera className="w-4 h-4 mr-2" />
                            {uploadingImage ? (t("admin.uploading") || "Uploading...") : (t("admin.upload_image") || "Upload Image")}
                          </span>
                        </Button>
                      </Label>
                      <Input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                      {formData.profileImage && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, profileImage: null }))
                          }
                        >
                          {t("admin.remove_image") || "Remove Image"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">{t("admin.name") || "Name"}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder={t("admin.name_placeholder_profile") || "Your name"}
                  />
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email">{t("admin.email") || "Email"}</Label>
                  <Input
                    id="email"
                    value={profile?.email || ""}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                  <p className="text-sm text-gray-500">{t("admin.email_cannot_change") || "Email cannot be changed"}</p>
                </div>

                {/* Role (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="role">{t("admin.role") || "Role"}</Label>
                  <Input
                    id="role"
                    value={profile?.role || ""}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>

                <Button
                  onClick={handleUpdateProfile}
                  disabled={saving}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("admin.saving") || "Saving..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {t("admin.save_changes") || "Save Changes"}
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="old-password">{t("admin.current_password") || "Current Password"}</Label>
                  <Input
                    id="old-password"
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        oldPassword: e.target.value,
                      }))
                    }
                    placeholder={t("admin.enter_current_password") || "Enter current password"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">{t("admin.new_password") || "New Password"}</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    placeholder={t("admin.enter_new_password") || "Enter new password (min 6 characters)"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t("admin.confirm_password") || "Confirm New Password"}</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder={t("admin.confirm_new_password") || "Confirm new password"}
                  />
                </div>

                <Button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("admin.changing") || "Changing..."}
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      {t("admin.change_password") || "Change Password"}
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

