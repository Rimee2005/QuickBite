"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, User2, Mail, Lock, School, BookOpen, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    registrationNumber: "",
    type: "student" as "student" | "teacher"
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Registration successful! 🎉",
          description: "Please login to continue",
        })
        router.push('/login')
      } else {
        throw new Error(data.error || 'Registration failed')
      }
    } catch (error) {
      toast({
        title: "Registration failed ❌",
        description: error instanceof Error ? error.message : "Something went wrong",
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
            <User2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription>
            Join QuickBite to start ordering delicious meals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">I am a</Label>
              <RadioGroup
                defaultValue="student"
                onValueChange={(value) => handleChange('type', value)}
                className="flex gap-4"
              >
                <div className="flex-1">
                  <RadioGroupItem
                    value="student"
                    id="student"
                    className="peer hidden"
                  />
                  <Label
                    htmlFor="student"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:text-emerald-600 cursor-pointer"
                  >
                    <BookOpen className="mb-2 h-6 w-6" />
                    <span>Student</span>
                  </Label>
                </div>
                <div className="flex-1">
                  <RadioGroupItem
                    value="teacher"
                    id="teacher"
                    className="peer hidden"
                  />
                  <Label
                    htmlFor="teacher"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:text-emerald-600 cursor-pointer"
                  >
                    <School className="mb-2 h-6 w-6" />
                    <span>Teacher/Staff</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <User2 className="w-4 h-4 text-gray-500" />
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

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

            {/* Registration Number Field - Only for Students */}
            {formData.type === 'student' && (
              <div className="space-y-2">
                <Label htmlFor="registrationNumber" className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  Registration Number
                </Label>
                <Input
                  id="registrationNumber"
                  placeholder="Enter your registration number"
                  value={formData.registrationNumber}
                  onChange={(e) => handleChange('registrationNumber', e.target.value)}
                  required
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-500" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
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
                  <span>Creating your account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </Button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium transition-colors">
                Login here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 