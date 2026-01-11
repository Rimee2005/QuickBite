"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Mail, Lock, Coffee, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const { t } = useLanguage()

  // Check if user is already logged in and redirect
  // Add timeout to prevent hanging
  useEffect(() => {
    let isMounted = true
    let timeoutId: NodeJS.Timeout

    const checkExistingSession = async () => {
      try {
        // Set timeout to prevent hanging (max 2 seconds)
        const sessionPromise = getSession()
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Session check timeout')), 2000)
        })

        const session = await Promise.race([sessionPromise, timeoutPromise]) as any

        if (!isMounted) return

        if (session?.user) {
          // User is already logged in, redirect to appropriate dashboard
          const userType = session.user.type || 'student'
          let redirectPath = '/student/dashboard'
          if (userType === 'admin') {
            redirectPath = '/admin/dashboard'
          } else if (userType === 'teacher') {
            redirectPath = '/teacher/dashboard'
          }
          
          // Use window.location in production to avoid middleware issues
          if (typeof window !== 'undefined') {
            window.location.href = redirectPath
            return // Don't set isCheckingSession to false if redirecting
          }
        }
      } catch (error) {
        // Silently fail - let middleware handle redirects
        // Don't log errors in production to avoid console spam
        if (process.env.NODE_ENV === 'development') {
          console.error('Error checking session:', error)
        }
      } finally {
        if (isMounted) {
          clearTimeout(timeoutId)
          setIsCheckingSession(false)
        }
      }
    }

    // Only check session in client-side
    if (typeof window !== 'undefined') {
      checkExistingSession()
    } else {
      setIsCheckingSession(false)
    }

    return () => {
      isMounted = false
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      // Wait for session to be established - retry with delay for production
      let session = null
      let attempts = 0
      const maxAttempts = 15 // Increased attempts for production
      
      while (!session && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 300)) // Increased delay to 300ms
        session = await getSession()
        attempts++
      }

      if (!session?.user) {
        throw new Error("Session not established. Please try again.")
      }

      const userType = session.user.type || 'student'
      
      let redirectPath = '/student/dashboard'
      if (userType === 'admin') {
        redirectPath = '/admin/dashboard'
      } else if (userType === 'teacher') {
        redirectPath = '/teacher/dashboard'
      }

      // Show success toast
      toast({
        title: t("login.success"),
        description: t("login.welcome_back_msg"),
      })
      
      // Always use window.location in production to ensure full page reload and cookie persistence
      // This prevents middleware redirect loops
      if (typeof window !== 'undefined') {
        // Small delay to ensure cookie is set
        await new Promise(resolve => setTimeout(resolve, 100))
        window.location.href = redirectPath
      }
    } catch (error) {
      toast({
        title: t("login.failed"),
        description: error instanceof Error ? error.message : t("login.invalid_credentials"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-hide loading after 2 seconds as fallback to prevent hanging
  useEffect(() => {
    if (isCheckingSession) {
      const timeout = setTimeout(() => {
        setIsCheckingSession(false)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [isCheckingSession])

  // Show loading while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-emerald-200 via-emerald-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-emerald-200 via-emerald-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="rounded-full p-2 sm:p-3 hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="ml-2 hidden sm:inline">{t("login.back_home")}</span>
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-md mx-auto shadow-xl dark:shadow-emerald-500/10 border-0 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
            <Coffee className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {t("login.welcome_back")}
          </CardTitle>
          <CardDescription>
            {t("login.login_to_order")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                {t("login.email")}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t("login.email_placeholder")}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-500" />
                {t("login.password")}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("login.password_placeholder")}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t("login.logging_you_in")}</span>
                </div>
              ) : (
                t("login.login")
              )}
            </Button>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              {t("login.no_account")}{' '}
              <Link href="/register" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium transition-colors">
                {t("login.register_here")}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 