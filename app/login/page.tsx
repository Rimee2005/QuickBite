"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Mail, Lock, Coffee } from "lucide-react"
import Link from "next/link"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

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

      // Wait for session to update, then check user type
      const session = await getSession()
      const userType = session?.user?.type || 'student'
      
      let redirectPath = '/student/dashboard'
      if (userType === 'admin') {
        redirectPath = '/admin/dashboard'
      } else if (userType === 'teacher') {
        redirectPath = '/student/dashboard' // Teachers use student dashboard for now
      }

      toast({
        title: "Login successful! 🎉",
        description: "Welcome back!",
      })
      router.push(redirectPath)
      router.refresh()
    } catch (error) {
      toast({
        title: "Login failed ❌",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-emerald-200 via-emerald-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="rounded-full p-2 sm:p-3 hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="ml-2 hidden sm:inline">Back to Home</span>
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-md mx-auto shadow-xl dark:shadow-emerald-500/10 border-0 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
            <Coffee className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Welcome Back!
          </CardTitle>
          <CardDescription>
            Login to order your favorite meals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
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
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
                className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
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
                  <span>Logging you in...</span>
                </div>
              ) : (
                'Login'
              )}
            </Button>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium transition-colors">
                Register here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 