"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  User,
  ShoppingCart,
  Clock,
  Bell,
  Shield,
  ChefHat,
  Star,
  ArrowRight,
  Github,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Sun,
  Moon,
  TrendingUp,
  Users,
  Timer,
  Flame,
  Monitor,
  CheckCircle,
  MapPinIcon,
  Languages,
  Play,
  Gift,
  MessageSquare,
  UsersIcon,
  Heart,
  Award,
  Zap,
  Navigation2,
  Activity,
  Circle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useMemo, useRef } from "react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"

// testimonials will be defined inside component to use translations

// Features and steps will be defined inside component to use translations

// topPicks and dailySpecials will be defined inside component to use translations

// Team members, fun facts, and FAQs will be defined inside component to use translations

// Animated Star component for testimonials
function AnimatedStar({ index, progress }: { index: number; progress: number }) {
  const isFilled = progress >= index + 1
  const isPartial = progress > index && progress < index + 1
  const fillPercentage = isPartial ? (progress - index) * 100 : isFilled ? 100 : 0

  return (
    <div className="relative inline-block">
      <Star 
        className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
          isFilled || isPartial 
            ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.6)]' 
            : 'text-gray-300 dark:text-gray-600 fill-transparent'
        }`}
        style={{
          filter: isFilled || isPartial ? 'drop-shadow(0 0 4px rgba(250, 204, 21, 0.6))' : 'none',
        }}
      />
      {isPartial && (
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fillPercentage}%` }}
        >
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
        </div>
      )}
    </div>
  )
}

// Animated counter component with smooth easing
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3)
    }

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutCubic(progress)
      setCount(Math.floor(easedProgress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(end) // Ensure final value is exact
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return (
    <span className="tabular-nums">
      {count}
      {suffix}
    </span>
  )
}

// Component to animate numbers in fact text
function AnimatedFactText({ text, isVisible }: { text: string; isVisible: boolean }) {
  const [animatedText, setAnimatedText] = useState(text)

  useEffect(() => {
    if (!isVisible) {
      setAnimatedText(text)
      return
    }

    // Extract and animate numbers in the text
    const numberRegex = /(\d+(?:,\d+)?(?:\.\d+)?)/g
    const matches = text.match(numberRegex)
    
    if (matches) {
      matches.forEach((numStr) => {
        const num = parseInt(numStr.replace(/,/g, ''))
        if (!isNaN(num) && num > 0) {
          let current = 0
          const increment = Math.max(1, Math.floor(num / 40))
          const timer = setInterval(() => {
            current += increment
            if (current >= num) {
              current = num
              clearInterval(timer)
            }
            const formatted = num >= 1000 
              ? Math.floor(current).toLocaleString()
              : Math.floor(current).toString()
            setAnimatedText((prev) => {
              const regex = new RegExp(numStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
              return prev.replace(regex, formatted)
            })
          }, 30)
          return () => clearInterval(timer)
        }
      })
    }
  }, [text, isVisible])

  return <span>{animatedText}</span>
}

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [testimonialAnimating, setTestimonialAnimating] = useState(false)
  const [starProgress, setStarProgress] = useState(0)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const [canteenOpen, setCanteenOpen] = useState(true)
  const [feedback, setFeedback] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [activeFactIndex, setActiveFactIndex] = useState(0)
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [howItWorksVisible, setHowItWorksVisible] = useState(false)
  const [featuresVisible, setFeaturesVisible] = useState(false)
  const howItWorksRef = useRef<HTMLElement>(null)
  const featuresRef = useRef<HTMLElement>(null)
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  // Intersection Observer for How It Works section
  useEffect(() => {
    if (howItWorksRef.current && !howItWorksVisible) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setHowItWorksVisible(true)
            observer.disconnect()
          }
        },
        { threshold: 0.1 }
      )
      observer.observe(howItWorksRef.current)
      return () => observer.disconnect()
    }
  }, [howItWorksVisible])

  // Intersection Observer for Features section
  useEffect(() => {
    if (featuresRef.current && !featuresVisible) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setFeaturesVisible(true)
            observer.disconnect()
          }
        },
        { threshold: 0.1 }
      )
      observer.observe(featuresRef.current)
      return () => observer.disconnect()
    }
  }, [featuresVisible])

  // Trigger hero entrance animation on mount
  useEffect(() => {
    setHeroLoaded(true)
  }, [])

  // Auto-rotate fun facts every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFactIndex((prev) => (prev + 1) % 4)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  // Memoize arrays to ensure they update when language changes
  const features = useMemo(() => [
    {
      icon: <Shield className="w-8 h-8 text-emerald-500" />,
      title: t("features.secure_login"),
      description: t("features.secure_login_desc"),
    },
    {
      icon: <ShoppingCart className="w-8 h-8 text-emerald-500" />,
      title: t("features.one_click"),
      description: t("features.one_click_desc"),
    },
    {
      icon: <ChefHat className="w-8 h-8 text-emerald-500" />,
      title: t("features.admin_control"),
      description: t("features.admin_control_desc"),
    },
    {
      icon: <Bell className="w-8 h-8 text-emerald-500" />,
      title: t("features.live_notifications"),
      description: t("features.live_notifications_desc"),
    },
  ], [t, language])

  const steps = useMemo(() => [
    {
      number: "01",
      title: t("steps.signup.title"),
      description: t("steps.signup.desc"),
      icon: <User className="w-6 h-6" />,
    },
    {
      number: "02",
      title: t("steps.browse.title"),
      description: t("steps.browse.desc"),
      icon: <ShoppingCart className="w-6 h-6" />,
    },
    {
      number: "03",
      title: t("steps.confirm.title"),
      description: t("steps.confirm.desc"),
      icon: <Clock className="w-6 h-6" />,
    },
    {
      number: "04",
      title: t("steps.admin.title"),
      description: t("steps.admin.desc"),
      icon: <ChefHat className="w-6 h-6" />,
    },
    {
      number: "05",
      title: t("steps.notify.title"),
      description: t("steps.notify.desc"),
      icon: <Bell className="w-6 h-6" />,
    },
  ], [t, language])

  const teamMembers = useMemo(() => [
    {
      name: t("team.chef_ramesh.name"),
      role: t("team.chef_ramesh.role"),
      experience: t("team.chef_ramesh.experience"),
      emoji: "👨‍🍳",
      specialty: t("team.chef_ramesh.specialty"),
    },
    {
      name: t("team.admin_priya.name"),
      role: t("team.admin_priya.role"),
      experience: t("team.admin_priya.experience"),
      emoji: "👩‍💼",
      specialty: t("team.admin_priya.specialty"),
    },
    {
      name: t("team.chef_sunita.name"),
      role: t("team.chef_sunita.role"),
      experience: t("team.chef_sunita.experience"),
      emoji: "👩‍🍳",
      specialty: t("team.chef_sunita.specialty"),
    },
  ], [t, language])

  const funFacts = useMemo(() => [
    {
      icon: <TrendingUp className="w-6 h-6 text-emerald-500" />,
      fact: t("facts.orders_served"),
      emoji: "🎉",
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      fact: t("facts.fastest_delivery"),
      emoji: "⚡",
    },
    {
      icon: <Heart className="w-6 h-6 text-red-500" />,
      fact: t("facts.satisfaction"),
      emoji: "❤️",
    },
    {
      icon: <Award className="w-6 h-6 text-purple-500" />,
      fact: t("facts.award"),
      emoji: "🏆",
    },
  ], [t, language])

  const faqs = useMemo(() => [
    {
      question: t("faq.login_required.q"),
      answer: t("faq.login_required.a"),
    },
    {
      question: t("faq.cancel_order.q"),
      answer: t("faq.cancel_order.a"),
    },
    {
      question: t("faq.who_prepares.q"),
      answer: t("faq.who_prepares.a"),
    },
    {
      question: t("faq.prep_time.q"),
      answer: t("faq.prep_time.a"),
    },
    {
      question: t("faq.payment.q"),
      answer: t("faq.payment.a"),
    },
    {
      question: t("faq.modify_order.q"),
      answer: t("faq.modify_order.a"),
    },
  ], [t, language])

  const topPicks = useMemo(() => [
    {
      id: 1,
      name: t("food.chicken_biryani"),
      price: 120,
      emoji: "🍛",
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&h=500&fit=crop&q=80",
      offer: "20% Off",
      popular: true,
    },
    {
      id: 2,
      name: t("food.masala_dosa"),
      price: 60,
      emoji: "🥞",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=500&fit=crop&q=80",
      offer: null,
      popular: true,
    },
    {
      id: 3,
      name: t("food.paneer_butter_masala"),
      price: 100,
      emoji: "🍛",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=500&fit=crop&q=80",
      offer: "15% Off",
      popular: false,
    },
    {
      id: 4,
      name: t("food.cold_coffee"),
      price: 40,
      emoji: "☕",
      image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500&h=500&fit=crop&q=80",
      offer: null,
      popular: true,
    },
    {
      id: 5,
      name: t("food.veg_burger"),
      price: 70,
      emoji: "🍔",
      image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500&h=500&fit=crop&q=80",
      offer: "10% Off",
      popular: false,
    },
    {
      id: 6,
      name: t("food.fresh_juice"),
      price: 35,
      emoji: "🥤",
      image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&h=500&fit=crop&q=80",
      offer: null,
      popular: true,
    },
  ], [t, language])

  const dailySpecials = useMemo(() => [
    { name: t("food.paneer_wrap"), emoji: "🌯", discount: 20 },
    { name: t("food.chicken_biryani"), emoji: "🍛", discount: 25 },
    { name: t("food.masala_dosa"), emoji: "🥞", discount: 15 },
    { name: t("food.veg_thali"), emoji: "🍽️", discount: 30 },
  ], [t, language])

  const testimonials = useMemo(() => [
    {
      id: 1,
      name: t("testimonial.priya.name"),
      role: t("testimonial.priya.role"),
      content: t("testimonial.priya.content"),
      rating: 5,
      avatar: "👩‍🎓",
    },
    {
      id: 2,
      name: t("testimonial.rahul.name"),
      role: t("testimonial.rahul.role"),
      content: t("testimonial.rahul.content"),
      rating: 5,
      avatar: "👨‍🎓",
    },
    {
      id: 3,
      name: t("testimonial.anita.name"),
      role: t("testimonial.anita.role"),
      content: t("testimonial.anita.content"),
      rating: 5,
      avatar: "👩‍💼",
    },
    {
      id: 4,
      name: t("testimonial.admin.name"),
      role: t("testimonial.admin.role"),
      content: t("testimonial.admin.content"),
      rating: 5,
      avatar: "👨‍🍳",
    },
  ], [t, language])

  const changeTestimonial = (newIndex: number, skipAutoPlayReset = false) => {
    // Clear auto-play when manually changing (unless it's auto-play itself)
    if (!skipAutoPlayReset && autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
      autoPlayRef.current = null
    }
    
    setTestimonialAnimating(true)
    setStarProgress(0)
    setTimeout(() => {
      setActiveTestimonial(newIndex)
      setTimeout(() => {
        setTestimonialAnimating(false)
        // Animate stars filling up
        const targetRating = testimonials[newIndex].rating
        let current = 0
        const interval = setInterval(() => {
          current += 0.1
          if (current >= targetRating) {
            current = targetRating
            clearInterval(interval)
          }
          setStarProgress(current)
        }, 50)
      }, 150)
    }, 100)
  }

  const nextTestimonial = () => {
    changeTestimonial((activeTestimonial + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    changeTestimonial((activeTestimonial - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-play testimonials every 7 seconds
  useEffect(() => {
    // Clear existing interval
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }

    // Start auto-play after initial load
    const startTimer = setTimeout(() => {
      autoPlayRef.current = setInterval(() => {
        if (!testimonialAnimating) {
          const nextIndex = (activeTestimonial + 1) % testimonials.length
          changeTestimonial(nextIndex, true)
        }
      }, 7000)
    }, 2000)

    return () => {
      clearTimeout(startTimer)
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
        autoPlayRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTestimonial, testimonialAnimating])

  // Initialize star animation on mount
  useEffect(() => {
    const targetRating = testimonials[activeTestimonial].rating
    let current = 0
    const interval = setInterval(() => {
      current += 0.1
      if (current >= targetRating) {
        current = targetRating
        clearInterval(interval)
      }
      setStarProgress(current)
    }, 50)
    return () => clearInterval(interval)
  }, [activeTestimonial, testimonials])

  // Check canteen status based on time
  useEffect(() => {
    const checkCanteenStatus = () => {
      const now = new Date()
      const hour = now.getHours()
      // Canteen open from 8 AM to 8 PM
      setCanteenOpen(hour >= 8 && hour < 20)
    }

    checkCanteenStatus()
    const interval = setInterval(checkCanteenStatus, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const handleFeedbackSubmit = () => {
    if (!selectedLanguage || !feedback.trim()) {
      toast({
        title: t("feedback.please_provide"),
        variant: "destructive",
      })
      return
    }

    toast({
      title: t("feedback.thank_you"),
      description: t("feedback.helps_improve_desc"),
    })

    setFeedback("")
  }

  const handleDemoOrder = () => {
    toast({
      title: `${t("demo.activated")} 🎮`,
      description: t("demo.description"),
    })
  }

  const handleGroupOrder = () => {
    toast({
      title: `${t("group.coming_soon")} 👥`,
      description: t("group.coming_soon_desc"),
    })
  }

  // Update theme toggle to use next-themes
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Daily Specials Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white py-2 sm:py-3 px-3 sm:px-4 text-center relative overflow-hidden">
        <div className="animate-pulse">
          <span className="font-bold text-sm sm:text-base">
            {t("special.today")}: {dailySpecials[activeTestimonial].name} {dailySpecials[activeTestimonial].emoji}{" "}
            {dailySpecials[activeTestimonial].discount}% {t("special.off")} 🔥
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
          <span className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{t("nav.title")}</span>
        </div>
        <div className="flex items-center flex-wrap gap-2 sm:gap-4 w-full sm:w-auto justify-end sm:justify-start">
          {/* Language Selector */}
          <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
            <SelectTrigger className="w-auto border-none bg-transparent h-9 sm:h-10">
              <Languages className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <SelectValue className="text-xs sm:text-sm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी</SelectItem>
              <SelectItem value="mai">मैथिली</SelectItem>
              <SelectItem value="bho">भोजपुरी</SelectItem>
            </SelectContent>
          </Select>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 h-9 w-9 sm:h-10 sm:w-10"
          >
            {theme === "light" ? <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>

          <Link href="/login" className="flex-1 sm:flex-initial">
            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-[1.25rem] border-emerald-400 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950 text-sm sm:text-base py-2 sm:py-2.5 px-4 sm:px-6"
            >
              {t("login.login")}
            </Button>
          </Link>
          <Link href="/admin/login" className="flex-1 sm:flex-initial">
            <Button className="w-full sm:w-auto bg-emerald-400 hover:bg-emerald-500 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-[1.25rem] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base">
              {t("nav.admin")}
            </Button>
          </Link>
        </div>
      </nav>

      {/* Real-time Status Display */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
        <div className="flex justify-center">
          <Badge
            className={`text-sm sm:text-lg py-1.5 sm:py-2 px-4 sm:px-6 rounded-full animate-badge-pulse ${
              canteenOpen
                ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {canteenOpen ? "✅" : "❌"} <span className="whitespace-nowrap">{canteenOpen ? t("canteen.status.open") : t("canteen.status.closed")}</span>
          </Badge>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        {/* Animated background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 via-emerald-100/0 to-white/0 dark:from-gray-900/0 dark:via-gray-800/0 dark:to-gray-800/0 animate-hero-gradient pointer-events-none" />
        <div className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">
              {t("hero.badge")}
            </Badge>
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white leading-tight transition-all duration-700 ease-out ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {t("hero.title")}
            </h1>
            <p className={`text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-700 ease-out ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: heroLoaded ? '100ms' : '0ms' }}>
              {t("hero.subtitle")}
            </p>
            <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 transition-all duration-700 ease-out ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: heroLoaded ? '200ms' : '0ms' }}>
              <Link href="/login" className="flex-1 sm:flex-initial">
                <Button className="w-full sm:w-auto bg-emerald-400 hover:bg-emerald-500 text-white font-medium text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 rounded-[1.25rem] transition-all duration-300 ease-out shadow-lg hover:shadow-xl hover:-translate-y-1">
                  {t("hero.cta1")}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/admin/login" className="flex-1 sm:flex-initial">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 rounded-[1.25rem] border-emerald-400 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950 transition-all duration-300 ease-out hover:-translate-y-1"
                >
                  {t("hero.cta2")}
                </Button>
              </Link>
            </div>

            {/* Demo Order Button */}
            <div className={`pt-2 sm:pt-4 transition-all duration-700 ease-out ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: heroLoaded ? '300ms' : '0ms' }}>
              <Button
                variant="outline"
                onClick={handleDemoOrder}
                className="border-dashed border-2 border-gray-400 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 text-sm sm:text-base py-2 sm:py-2.5 px-4 sm:px-6 transition-all duration-300 ease-out hover:-translate-y-1"
              >
                <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                {t("demo.title")}
              </Button>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">{t("demo.subtitle")}</p>
            </div>
          </div>

          <div className={`relative order-1 lg:order-2 transition-all duration-700 ease-out ${
            heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: heroLoaded ? '400ms' : '0ms' }}>
            <Card className="bg-white dark:bg-gray-800 rounded-[1.25rem] shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700 p-6 sm:p-8 animate-card-float">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center flex-shrink-0 animate-icon-bounce">
                    <span className="text-xl sm:text-2xl">👥</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">{t("hero.long_queue")}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{t("hero.students_waiting")}</p>
                  </div>
                </div>

                <div className="border-l-4 border-emerald-400 pl-4 sm:pl-6 ml-3 sm:ml-6">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 animate-icon-bounce-delayed">
                      <span className="text-xl sm:text-2xl">😊</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">{t("hero.quick_pickup")}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{t("hero.happy_student")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Mini Video Demo Placeholder */}
            <div className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 bg-white dark:bg-gray-800 rounded-[1.25rem] shadow-lg p-3 sm:p-4 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-400 rounded-full flex items-center justify-center">
                  <Play className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white">{t("hero.how_to_order")}</span>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Canteen Location Map */}
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 py-10 sm:py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">{t("location.title")} 📍</h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">{t("location.address")}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
            {/* Map Card */}
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-600 p-0 overflow-hidden h-56 sm:h-72 lg:h-80 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
              <iframe
                src="https://maps.google.com/maps?q=WIT%2C+Mansaar+Colony%2C+Darbhanga%2C+Bihar+846008&t=m&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="Canteen, College Campus - WIT, Mansaar Colony, Darbhanga, Bihar 846008"
              />
            </Card>

            {/* Info Cards */}
            <div className="space-y-4 sm:space-y-4 flex flex-col justify-center">
              {/* Location Card */}
              <Card className="bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-700 dark:to-emerald-900/20 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-600 p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-emerald-300 dark:hover:border-emerald-700">
                <div className="flex items-start space-x-4 sm:space-x-5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <MapPinIcon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 dark:text-white text-base sm:text-lg mb-1">Canteen, College Campus</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                      WIT, Mansaar Colony, Darbhanga, Bihar 846008
                    </p>
                  </div>
                </div>
              </Card>

              {/* Hours Card */}
              <Card className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-700 dark:to-blue-900/20 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-600 p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-700">
                <div className="flex items-start space-x-4 sm:space-x-5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 dark:text-white text-base sm:text-lg mb-1">{t("location.open_hours")}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">{t("location.hours")}</p>
                  </div>
                </div>
              </Card>

              {/* Get Directions Button */}
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=WIT+College+Campus%2C+Mansaar+Colony%2C+Darbhanga%2C+Bihar+846008"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-12 sm:h-14 text-base sm:text-lg font-semibold group">
                  <Navigation2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  Get Directions
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-10 sm:py-12 bg-[#ECFDF5] dark:bg-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10">
            <div className="flex items-center justify-center gap-3 mb-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100">{t("stats.title")}</h2>
              {/* LIVE Indicator */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50/80 dark:bg-red-950/40 rounded-full border border-red-200/60 dark:border-red-900/50">
                <Circle className="w-1.5 h-1.5 fill-red-400 text-red-400 animate-pulse" />
                <span className="text-xs font-medium text-red-500 dark:text-red-400 tracking-wide">LIVE</span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{t("stats.subtitle")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {/* Total Orders Card - Fresh Modern Green */}
            <Card className="group bg-[#10B981] dark:bg-emerald-800 rounded-2xl shadow-md hover:shadow-lg border-0 p-5 sm:p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-1.5 tracking-tight">
                <AnimatedCounter end={247} suffix="+" />
              </div>
              <p className="text-xs sm:text-sm text-white/90 font-medium mt-2 uppercase tracking-wide">
                {t("stats.total_orders")}
              </p>
            </Card>

            {/* Active Admins Card - Soft Muted Orange */}
            <Card className="group bg-[#FB923C] dark:bg-[#e55a2b] rounded-2xl shadow-md hover:shadow-lg border-0 p-5 sm:p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-1.5 tracking-tight">
                <AnimatedCounter end={5} />
              </div>
              <p className="text-xs sm:text-sm text-white/90 font-medium mt-2 uppercase tracking-wide">
                {t("stats.active_admins")}
              </p>
            </Card>

            {/* Avg Prep Time Card - Clean Modern Blue */}
            <Card className="group bg-[#2563EB] dark:bg-blue-800 rounded-2xl shadow-md hover:shadow-lg border-0 p-5 sm:p-6 text-center sm:col-span-2 lg:col-span-1 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-lg flex items-center justify-center">
                <Timer className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-1.5 tracking-tight">
                <AnimatedCounter end={12} suffix={` ${t("common.min")}`} />
              </div>
              <p className="text-xs sm:text-sm text-white/90 font-medium mt-2 uppercase tracking-wide">
                {t("stats.avg_prep_time")}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Meet The Team Section */}
      <section className="bg-gray-100 dark:bg-gray-700 py-10 sm:py-12 lg:py-14 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">{t("team.title")} 👥</h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">{t("team.subtitle")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="group bg-white/90 dark:bg-gray-600/90 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/80 dark:border-gray-500/50 p-5 sm:p-6 text-center transform hover:-translate-y-1 hover:scale-[1.02]"
              >
                {/* Avatar with circular background */}
                <div className="mb-4 sm:mb-5 flex justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-emerald-50/80 to-emerald-100/60 dark:from-emerald-900/30 dark:to-emerald-800/20 flex items-center justify-center ring-2 ring-emerald-200/40 dark:ring-emerald-700/30 shadow-sm">
                    <span className="text-3xl sm:text-4xl lg:text-5xl">{member.emoji}</span>
                  </div>
                </div>
                
                <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 mb-1.5">{member.name}</h3>
                <p className="text-emerald-600/90 dark:text-emerald-400/80 font-medium mb-2 text-sm sm:text-base">{member.role}</p>
                <p className="text-gray-600/80 dark:text-gray-300/70 text-xs sm:text-sm mb-3 leading-relaxed">{member.experience}</p>
                <Badge className="bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 text-xs px-2.5 py-0.5">
                  {member.specialty}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Picks Section */}
      <section className="py-10 sm:py-12 lg:py-14 bg-gradient-to-br from-emerald-50/50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">{t("picks.title")} 🍽️</h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">{t("picks.subtitle")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {topPicks.map((dish) => (
              <Card
                key={dish.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden transform hover:-translate-y-1"
              >
                <div className="relative h-48 sm:h-52 overflow-hidden">
                  {dish.image ? (
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                      <span className="text-5xl sm:text-6xl">{dish.emoji}</span>
                  </div>
                  )}
                  {/* Gradient overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  
                  {/* Badges */}
                  {dish.offer && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg border-0 text-xs sm:text-sm font-semibold px-2.5 py-1">
                      <Flame className="w-3 h-3 mr-1" />
                      {dish.offer}
                    </Badge>
                  )}
                  {dish.popular && (
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg border-0 text-xs sm:text-sm font-semibold px-2.5 py-1">
                      <Star className="w-3 h-3 mr-1 fill-white" />
                      {t("picks.popular")}
                    </Badge>
                  )}
                </div>
                
                <div className="p-4 sm:p-5">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2.5 text-base sm:text-lg line-clamp-1">{dish.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">₹{dish.price}</span>
                    {dish.offer && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        ₹{Math.round(dish.price / (1 - Number.parseInt(dish.offer) / 100))}
                      </span>
                    )}
                    </div>
                  </div>
                  <Link href="/login">
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 text-sm sm:text-base shadow-md hover:shadow-lg">
                      {t("picks.login_to_order")}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Group Order & Loyalty Program */}
      <section className="bg-white dark:bg-gray-800 py-12 sm:py-16 lg:py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Group Order */}
            <Card className="group relative rounded-[1.25rem] shadow-lg border border-blue-200/50 dark:border-blue-700/50 p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl overflow-hidden">
              {/* Base background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-900 dark:via-blue-800 dark:to-blue-700" />
              {/* Idle animated gradient layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-50 dark:from-blue-800 dark:via-blue-700 dark:to-blue-900 animate-gradient-idle" />
              {/* Hover gradient shift */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-50 to-blue-100 dark:from-blue-700 dark:via-blue-900 dark:to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Soft inner border */}
              <div className="absolute inset-[1px] rounded-[1.2rem] border border-blue-300/30 dark:border-blue-600/30 pointer-events-none" />
              <div className="relative z-10 flex flex-col justify-center items-center text-center min-h-[280px] sm:min-h-[320px]">
                <div className="animate-pulse-slow mb-4 sm:mb-5">
                  <UsersIcon className="w-16 h-16 sm:w-20 sm:h-20 text-blue-600 dark:text-blue-400 mx-auto" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-blue-800 dark:text-blue-200 mb-3 sm:mb-4">{t("group.title")}</h3>
                <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 mb-4 sm:mb-6">{t("group.subtitle")}</p>
                <Button
                  onClick={handleGroupOrder}
                  className="relative bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 sm:py-3 px-5 sm:px-6 rounded-[1.25rem] text-sm sm:text-base transition-all duration-300 hover:scale-105 group/btn overflow-visible"
                >
                  <span className="absolute -inset-1 rounded-[1.25rem] bg-blue-400 opacity-0 group-hover/btn:opacity-30 blur-md transition-opacity duration-300" />
                  <span className="relative z-10">{t("group.cta")}</span>
                </Button>
              </div>
            </Card>

            {/* Loyalty Program */}
            <Card className="group relative rounded-[1.25rem] shadow-lg border border-orange-200/50 dark:border-orange-700/50 p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl overflow-hidden">
              {/* Base background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-[#ff6b35] to-orange-600 dark:from-orange-900 dark:via-[#e55a2b] dark:to-orange-800" />
              {/* Idle animated gradient layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35] via-orange-200 to-orange-100 dark:from-[#e55a2b] dark:via-orange-700 dark:to-orange-900 animate-gradient-idle" />
              {/* Hover gradient shift */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-[#ff6b35] to-orange-100 dark:from-orange-700 dark:via-[#e55a2b] dark:to-orange-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Soft inner border */}
              <div className="absolute inset-[1px] rounded-[1.2rem] border border-orange-300/30 dark:border-orange-600/30 pointer-events-none" />
              <div className="relative z-10 flex flex-col justify-center items-center text-center min-h-[280px] sm:min-h-[320px]">
                <div className="animate-pulse-slow mb-4 sm:mb-5">
                  <Gift className="w-16 h-16 sm:w-20 sm:h-20 text-white dark:text-orange-200 mx-auto" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white dark:text-orange-100 mb-3 sm:mb-4">{t("loyalty.program")} 🎁</h3>
                <p className="text-sm sm:text-base text-white/90 dark:text-orange-200/90 mb-4 sm:mb-6">{t("loyalty.title")}</p>
                <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/30 dark:bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    1
                  </div>
                  <span className="text-sm sm:text-base text-white/90 dark:text-orange-200/90">{t("loyalty.order_point")}</span>
                </div>
                <Badge className="bg-white/30 dark:bg-white/20 text-white text-xs sm:text-sm relative backdrop-blur-sm">
                  {t("loyalty.coming_soon")}
                  <span className="ml-1 inline-flex">
                    <span className="animate-dot-1">.</span>
                    <span className="animate-dot-2">.</span>
                    <span className="animate-dot-3">.</span>
                  </span>
                </Badge>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes gradient-idle {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
        .animate-gradient-idle {
          animation: gradient-idle 12s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        @keyframes dot-1 {
          0%, 20% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes dot-2 {
          0%, 40% {
            opacity: 0;
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes dot-3 {
          0%, 60% {
            opacity: 0;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        .animate-dot-1 {
          animation: dot-1 1.5s ease-in-out infinite;
        }
        .animate-dot-2 {
          animation: dot-2 1.5s ease-in-out infinite;
        }
        .animate-dot-3 {
          animation: dot-3 1.5s ease-in-out infinite;
        }
        @keyframes gradient-shift-orange {
          0%, 100% {
            opacity: 0.3;
            transform: translateX(0) translateY(0) scale(1);
          }
          25% {
            opacity: 0.5;
            transform: translateX(-1.5%) translateY(-0.5%) scale(1.02);
          }
          50% {
            opacity: 0.4;
            transform: translateX(0) translateY(-1%) scale(1);
          }
          75% {
            opacity: 0.6;
            transform: translateX(1.5%) translateY(-0.5%) scale(1.02);
          }
        }
        .animate-gradient-shift-orange {
          animation: gradient-shift-orange 10s ease-in-out infinite;
        }
        @keyframes arrow-glow {
          0%, 100% {
            opacity: 0.6;
            transform: translateX(0) translateY(-50%);
          }
          50% {
            opacity: 1;
            transform: translateX(4px) translateY(-50%);
          }
        }
        .animate-arrow-glow {
          animation: arrow-glow 2s ease-in-out infinite;
          transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
        }
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .animate-float-gentle {
          animation: float-gentle 3s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }
        .animate-pulse-dot {
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes hero-gradient {
          0% {
            background-position: 0% 0%;
            opacity: 0.2;
          }
          25% {
            background-position: 50% 25%;
            opacity: 0.3;
          }
          50% {
            background-position: 100% 50%;
            opacity: 0.25;
          }
          75% {
            background-position: 50% 75%;
            opacity: 0.3;
          }
          100% {
            background-position: 0% 100%;
            opacity: 0.2;
          }
        }
        .animate-hero-gradient {
          background-size: 200% 200%;
          animation: hero-gradient 18s ease-in-out infinite;
        }
        @keyframes badge-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.02);
            opacity: 0.95;
          }
        }
        .animate-badge-pulse {
          animation: badge-pulse 3s ease-in-out infinite;
        }
        @keyframes card-float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-card-float {
          animation: card-float 4s ease-in-out infinite;
        }
        @keyframes icon-bounce {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 1;
          }
          25% {
            transform: translateY(-4px) scale(1.05);
            opacity: 0.9;
          }
          50% {
            transform: translateY(0px) scale(1);
            opacity: 1;
          }
          75% {
            transform: translateY(-2px) scale(1.02);
            opacity: 0.95;
          }
        }
        .animate-icon-bounce {
          animation: icon-bounce 3s ease-in-out infinite;
        }
        .animate-icon-bounce-delayed {
          animation: icon-bounce 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>

      {/* Fun Facts Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">{t("facts.title")} 🧠</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">{t("facts.subtitle")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {funFacts.map((fact, index) => {
              const isActive = index === activeFactIndex
              return (
              <Card
                key={index}
                  className="group relative bg-white dark:bg-gray-800 rounded-[1.25rem] shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 p-4 sm:p-6 text-center overflow-hidden hover:-translate-y-2 hover:scale-[1.02]"
                  style={{
                    opacity: isActive ? 1 : 0.75,
                    transform: isActive ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(0)',
                    transition: 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out',
                  }}
                >
                  {/* Soft glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/0 to-blue-100/0 dark:from-emerald-900/0 dark:to-blue-900/0 group-hover:from-emerald-100/20 group-hover:to-blue-100/20 dark:group-hover:from-emerald-900/20 dark:group-hover:to-blue-900/20 transition-all duration-500 rounded-[1.25rem] pointer-events-none" />
                  
                  <div className="relative z-10">
                    {/* Emoji with floating animation */}
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 animate-float-slow">{fact.emoji}</div>
                    
                    {/* Icon with pulsing animation */}
                    <div className="flex justify-center mb-2 sm:mb-3 animate-pulse-gentle">
                      {fact.icon}
                    </div>
                    
                    {/* Fact text with animated numbers */}
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                      {isActive ? (
                        <AnimatedFactText text={fact.fact} isVisible={isActive} />
                      ) : (
                        fact.fact
                      )}
                    </p>
                  </div>
              </Card>
              )
            })}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-float-slow {
          animation: float-slow 3s ease-in-out infinite;
        }
        @keyframes pulse-gentle {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.9;
          }
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* Live Feedback Section */}
      <section className="bg-white dark:bg-gray-800 py-12 sm:py-16 lg:py-20 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">{t("feedback.title")} 💬</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">{t("feedback.helps_improve")}</p>
          </div>

          <Card className="bg-white dark:bg-gray-700 rounded-[1.25rem] shadow-lg border border-gray-100 dark:border-gray-600 p-6 sm:p-8">
            <div className="space-y-4 sm:space-y-6">
              {/* Emoji Rating */}
              <div className="text-center">
                <p className="text-base sm:text-lg font-medium text-gray-800 dark:text-white mb-3 sm:mb-4">{t("feedback.rate_experience")}</p>
                <div className="flex justify-center space-x-2 sm:space-x-4">
                  {[
                    { emoji: "😞", value: "poor", label: t("feedback.poor") },
                    { emoji: "😐", value: "okay", label: t("feedback.okay") },
                    { emoji: "😊", value: "good", label: t("feedback.good") },
                    { emoji: "😍", value: "excellent", label: t("feedback.excellent") },
                  ].map((rating) => (
                    <button
                      key={rating.value}
                      onClick={() => setSelectedLanguage(rating.value)}
                      className={`text-3xl sm:text-4xl p-2 sm:p-3 rounded-full transition-all duration-200 ${
                        selectedLanguage === rating.value
                          ? "bg-emerald-100 dark:bg-emerald-900 scale-110"
                          : "hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                    >
                      {rating.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Text */}
              <div>
                <Textarea
                  placeholder={t("feedback.placeholder")}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="rounded-[1.25rem] border-gray-300 dark:border-gray-600 text-sm sm:text-base"
                  rows={4}
                />
              </div>

              <div className="text-center">
                <Button
                  onClick={handleFeedbackSubmit}
                  className="bg-emerald-400 hover:bg-emerald-500 text-white font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-[1.25rem] text-sm sm:text-base"
                >
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  {t("feedback.submit")}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Smart Dashboard Preview */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4 flex-wrap">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white">{t("dashboard_preview.title")} 📊</h2>
              {/* Enhanced Pulsing Live Indicator */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50/90 dark:bg-red-950/50 rounded-full border border-red-200/70 dark:border-red-900/60 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="relative">
                  <Circle className="w-1.5 h-1.5 fill-red-400 text-red-400 animate-pulse" />
                  <div className="absolute inset-0 w-1.5 h-1.5 bg-red-400 rounded-full animate-ping opacity-75" />
                </div>
                <span className="text-xs font-semibold text-red-600 dark:text-red-400 tracking-wide">LIVE</span>
              </div>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">{t("dashboard_preview.subtitle")}</p>
          </div>

          <Card className="bg-white dark:bg-gray-800 rounded-[1.25rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full shadow-sm"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full shadow-sm"></div>
                <span className="ml-2 sm:ml-4 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{t("dashboard_preview.admin_dashboard")}</span>
              </div>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Pending Orders Card - Green */}
                <Card className="group bg-emerald-50 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 p-3 sm:p-4 text-center relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-emerald-300 dark:hover:border-emerald-600">
                  <div className="flex items-center justify-center mb-2 sm:mb-3">
                    <div className="p-2 rounded-lg bg-emerald-100/50 dark:bg-emerald-800/50 group-hover:bg-emerald-200/70 dark:group-hover:bg-emerald-700/70 transition-colors duration-300">
                      <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="relative">
                    {/* Enhanced soft glow behind number */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-200/40 dark:bg-emerald-700/40 rounded-full blur-xl opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-300 relative z-10 drop-shadow-sm">
                      <AnimatedCounter end={12} />
                    </div>
                  </div>
                  <p className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm mt-2 font-medium">{t("dashboard_preview.pending_orders")}</p>
                </Card>
                
                {/* Avg Wait Time Card - Blue */}
                <Card className="group bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-3 sm:p-4 text-center relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-600">
                  <div className="flex items-center justify-center mb-2 sm:mb-3">
                    <div className="p-2 rounded-lg bg-blue-100/50 dark:bg-blue-800/50 group-hover:bg-blue-200/70 dark:group-hover:bg-blue-700/70 transition-colors duration-300">
                      <Timer className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="relative">
                    {/* Enhanced soft glow behind number */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-200/40 dark:bg-blue-700/40 rounded-full blur-xl opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-300 relative z-10 drop-shadow-sm">
                      <AnimatedCounter end={8} suffix={` ${t("common.min")}`} />
                    </div>
                  </div>
                  <p className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm mt-2 font-medium">{t("dashboard_preview.avg_wait")}</p>
                </Card>
                
                {/* Active Admins Card - Light Orange Gradient */}
                <Card className="group relative border-0 p-3 sm:p-4 text-center sm:col-span-2 lg:col-span-1 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                  {/* Base gradient background - lighter orange */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 dark:from-orange-500 dark:via-orange-600 dark:to-red-500" />
                  {/* Animated gradient overlay - lighter shades */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-300 via-orange-400 to-red-400 dark:from-orange-600 dark:via-orange-700 dark:to-red-600 animate-gradient-shift-orange" />
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-center mb-2 sm:mb-3">
                      <div className="p-2 rounded-lg bg-white/20 dark:bg-white/10 group-hover:bg-white/30 dark:group-hover:bg-white/20 transition-colors duration-300 backdrop-blur-sm">
                        <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-md" strokeWidth={2.5} />
                      </div>
                    </div>
                    <div className="relative">
                      {/* Enhanced soft glow behind number */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/30 rounded-full blur-xl opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-white relative z-10 drop-shadow-md">
                        <AnimatedCounter end={3} />
                      </div>
                    </div>
                    <p className="text-white/95 text-xs sm:text-sm mt-2 font-medium drop-shadow-sm">{t("dashboard_preview.active_admins")}</p>
                  </div>
                </Card>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Card className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">#QB-1325 - Priya Sharma</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">1x Burger 🍔, 1x Cold Coffee ☕</p>
                    </div>
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <select className="flex-1 sm:flex-initial px-2 sm:px-3 py-1.5 sm:py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
                        <option>{t("dashboard_preview.set_eta")}</option>
                        <option>10 {t("common.min")}</option>
                        <option>15 {t("common.min")}</option>
                        <option>20 {t("common.min")}</option>
                      </select>
                      <Button size="sm" className="bg-emerald-400 hover:bg-emerald-500 text-white text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {t("dashboard_preview.accept")}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-900 rounded-lg border border-emerald-200 dark:border-emerald-700">
                <div className="flex items-start sm:items-center space-x-2">
                  <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 font-medium">
                    🎯 <strong>{t("dashboard_preview.admin_control")}</strong> {t("dashboard_preview.admin_control_desc")}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        ref={howItWorksRef}
        className="bg-white dark:bg-gray-800 py-12 sm:py-16 lg:py-20 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">{t("how_it_works.title")} 🔍</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">{t("how_it_works.subtitle")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <Card 
                  className={`group bg-white dark:bg-gray-700 rounded-[1.25rem] shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-600 p-4 sm:p-6 text-center h-full hover:-translate-y-2 hover:scale-[1.02] ${
                    howItWorksVisible 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 -translate-x-8'
                  }`}
                  style={{
                    transitionDelay: howItWorksVisible ? `${index * 150}ms` : '0ms',
                  }}
                >
                  {/* Soft glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/0 to-emerald-200/0 dark:from-emerald-900/0 dark:to-emerald-800/0 group-hover:from-emerald-100/20 group-hover:to-emerald-200/20 dark:group-hover:from-emerald-900/20 dark:group-hover:to-emerald-800/20 transition-all duration-500 rounded-[1.25rem] pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse-gentle">
                    <div className="text-emerald-600 dark:text-emerald-400 scale-75 sm:scale-100">{step.icon}</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{step.number}</div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm sm:text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{step.description}</p>
                  </div>
                </Card>
                {index < steps.length - 1 && (
                  <div 
                    className={`hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 animate-arrow-glow ${
                      howItWorksVisible 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 -translate-x-4'
                    }`}
                    style={{
                      transitionDelay: howItWorksVisible ? `${(index + 1) * 150}ms` : '0ms',
                    }}
                  >
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 drop-shadow-lg" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">{t("features.title")} 📦</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">
              {t("features.subtitle")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`group bg-white dark:bg-gray-700 rounded-[1.25rem] shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-600 p-4 sm:p-6 text-center hover:-translate-y-2 hover:scale-[1.02] hover:border-emerald-300 dark:hover:border-emerald-600 ${
                  featuresVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: featuresVisible ? `${index * 100}ms` : '0ms',
                }}
              >
                {/* Subtle border glow on hover */}
                <div className="absolute inset-0 rounded-[1.25rem] bg-gradient-to-br from-emerald-100/0 to-emerald-200/0 dark:from-emerald-900/0 dark:to-emerald-800/0 group-hover:from-emerald-100/30 group-hover:to-emerald-200/30 dark:group-hover:from-emerald-900/30 dark:group-hover:to-emerald-800/30 transition-all duration-500 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex justify-center mb-3 sm:mb-4 scale-75 sm:scale-100 animate-float-gentle">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2 text-sm sm:text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white dark:bg-gray-800 py-12 sm:py-16 lg:py-20 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">{t("testimonials.title")} 🗣️</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">{t("testimonials.subtitle")}</p>
          </div>

          <div className="relative">
            <Card 
              className={`bg-white dark:bg-gray-700 rounded-[1.25rem] shadow-xl border border-gray-100 dark:border-gray-600 p-6 sm:p-8 relative overflow-hidden transition-all duration-300 ${
                testimonialAnimating 
                  ? 'opacity-0 scale-95' 
                  : 'opacity-100 scale-100'
              }`}
            >
              {/* Gentle gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 via-transparent to-blue-50/0 dark:from-emerald-900/0 dark:via-transparent dark:to-blue-900/0 pointer-events-none" />
              
              {/* Soft inner highlight */}
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent dark:from-white/5 pointer-events-none rounded-t-[1.25rem]" />
              
              <div className="text-center relative z-10">
                <div 
                  className={`text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 transition-all duration-300 ${
                    testimonialAnimating 
                      ? 'opacity-0 scale-90' 
                      : 'opacity-100 scale-100'
                  }`}
                >
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div 
                  className={`flex justify-center mb-3 sm:mb-4 gap-1 transition-all duration-300 ${
                    testimonialAnimating 
                      ? 'opacity-0 translate-y-2' 
                      : 'opacity-100 translate-y-0'
                  }`}
                >
                  {[...Array(5)].map((_, i) => (
                    <AnimatedStar key={i} index={i} progress={starProgress} />
                  ))}
                </div>
                <blockquote 
                  className={`text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 italic px-2 sm:px-0 transition-all duration-300 ${
                    testimonialAnimating 
                      ? 'opacity-0 translate-y-4' 
                      : 'opacity-100 translate-y-0'
                  }`}
                >
                  "{testimonials[activeTestimonial].content}"
                </blockquote>
                <div 
                  className={`transition-all duration-300 ${
                    testimonialAnimating 
                      ? 'opacity-0 translate-y-2' 
                      : 'opacity-100 translate-y-0'
                  }`}
                  style={{ transitionDelay: testimonialAnimating ? '0ms' : '100ms' }}
                >
                  <div className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">
                    {testimonials[activeTestimonial].name}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                    {testimonials[activeTestimonial].role}
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial 
                      ? "bg-emerald-400 animate-pulse-dot scale-125 shadow-lg shadow-emerald-400/50" 
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                  }`}
                  onClick={() => changeTestimonial(index)}
                />
              ))}
            </div>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                className="group rounded-full dark:border-gray-600 dark:text-gray-300 h-9 w-9 sm:h-10 sm:w-10 p-0 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-400/30 hover:scale-110"
                onClick={prevTestimonial}
              >
                <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">←</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="group rounded-full dark:border-gray-600 dark:text-gray-300 h-9 w-9 sm:h-10 sm:w-10 p-0 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-400/30 hover:scale-110"
                onClick={nextTestimonial}
              >
                <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">→</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">{t("faq.title")} ❓</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300">{t("faq.subtitle")}</p>
          </div>

          <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-gray-50 dark:bg-gray-700 rounded-[1.25rem] border border-gray-200 dark:border-gray-600 px-4 sm:px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-800 dark:text-white hover:no-underline text-sm sm:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 pb-3 sm:pb-4 text-sm sm:text-base">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-emerald-400 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">{t("cta.title")} 📣</h2>
          <p className="text-base sm:text-lg lg:text-xl text-emerald-100 mb-6 sm:mb-8">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/login" className="flex-1 sm:flex-initial">
              <Button className="w-full sm:w-auto bg-white text-emerald-600 hover:bg-gray-100 font-medium text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 rounded-[1.25rem] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                👉 {t("hero.cta1")}
              </Button>
            </Link>
            <Link href="/admin/login" className="flex-1 sm:flex-initial">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-emerald-600 text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 rounded-[1.25rem]"
              >
                👉 {t("hero.cta2")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8 sm:py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl font-bold">{t("nav.title")}</span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                {t("footer.tagline")}
              </p>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400">
                <span>🏫</span>
                <span>{t("footer.campus_project")}</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t("footer.quick_links")}</h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.home")}
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.login")}
                  </Link>
                </li>
                <li>
                  <Link href="/admin/login" className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.admin_login")}
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.menu")}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {t("footer.contact")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t("footer.contact_title")}</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li className="flex items-start sm:items-center space-x-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span className="break-all">support@quickbite.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-start sm:items-center space-x-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span>College Campus, India</span>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t("footer.follow_us")}</h3>
              <div className="flex space-x-4 mb-3 sm:mb-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              </div>
              <div className="text-xs sm:text-sm text-gray-400">
                <p>{t("footer.built_for_students")}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
