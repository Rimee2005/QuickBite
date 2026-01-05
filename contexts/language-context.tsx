"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "hi" | "mai" | "bho"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "nav.title": "QuickBite 🍽️",
    "nav.student": "Order Food 🍽️",
    "nav.admin": "Login as Admin",

    // Hero Section
    "hero.badge": "🚀 Now Live at Your College Canteen",
    "hero.title": "Skip the Queue, Not the Meal 🍔",
    "hero.subtitle":
      "Pre-order your food from the college canteen, get notified when it's ready, and just pick it up. No more waiting in long lines!",
    "hero.cta1": "Login & Order Now",
    "hero.cta2": "Admin? Manage Orders Here",

    // Daily Specials
    "special.today": "Today's Special",
    "special.off": "OFF",

    // Canteen Status
    "canteen.status.open": "Canteen is currently OPEN",
    "canteen.status.closed": "Canteen is currently CLOSED",

    // Location
    "location.title": "Find Us Easily",
    "location.address": "Canteen, College Campus",
    "location.block_b": "Block B, Ground Floor",

    // Feedback
    "feedback.title": "How was your last meal?",
    "feedback.submit": "Submit Feedback",

    // Group Order
    "group.title": "Ordering for a club meeting or team?",
    "group.subtitle": "Group ordering now available!",
    "group.cta": "Start Group Order",

    // Loyalty
    "loyalty.title": "Earn 1 point on every order. Redeem for free snacks!",

    // Demo
    "demo.title": "Try a Demo Order",
    "demo.subtitle": "Test the experience without real ordering",
    "demo.activated": "Demo Mode Activated!",
    "demo.description": "This is a demo order. No real food will be prepared.",
    "group.coming_soon": "Group Order Feature Coming Soon!",
    "group.coming_soon_desc": "We're working on this feature for bulk orders",

    // Student Dashboard
    "dashboard.greeting": "Hi",
    "dashboard.question": "What would you like to eat today?",
    "dashboard.search": "Search for food items...",
    "dashboard.categories.all": "All",
    "dashboard.categories.snacks": "Snacks",
    "dashboard.categories.beverages": "Beverages",
    "dashboard.categories.meals": "Meals",
    "dashboard.add_to_cart": "Add to Cart",
    "dashboard.my_orders": "My Orders",
    "dashboard.cart": "Cart",
    "dashboard.logout": "Logout",
    "dashboard.added_to_cart": "Added to cart!",
    "dashboard.added_desc": "added to your cart",
    "dashboard.logged_out": "Logged out successfully!",
    "dashboard.see_you": "See you next time!",
    "dashboard.no_items": "No items found",
    "dashboard.try_adjusting": "Try adjusting your search or category filter",

    // Cart
    "cart.title": "Your Cart",
    "cart.empty.title": "Your cart is empty",
    "cart.empty.subtitle": "Discover delicious meals and add them to your cart!",
    "cart.empty.browse": "Browse Menu",
    "cart.order_items": "Order Items",
    "cart.estimated": "Estimated: 10-15 min",
    "cart.subtotal": "Subtotal",
    "cart.service_fee": "Service Fee",
    "cart.taxes": "Taxes",
    "cart.total": "Total",
    "cart.payment_method": "Payment Method",
    "cart.cash_pickup": "Cash on Pickup",
    "cart.estimated_time": "Estimated Time",
    "cart.admin_time": "Admin will set exact time after confirmation",
    "cart.place_order": "Place Order",
    "cart.placing_order": "Placing Order...",
    "cart.terms": "By placing this order, you agree to our terms and conditions",
    "cart.item_removed": "Item removed!",
    "cart.removed_desc": "has been removed from your cart",

    // Order Status
    "status.title": "Order Tracking",
    "status.subtitle": "Track your delicious meal",
    "status.progress": "Order Progress",
    "status.pending": "Order Pending",
    "status.pending_desc": "Your order is waiting for admin confirmation. This usually takes 1-2 minutes.",
    "status.reviewing": "Admin is reviewing your order...",
    "status.accepted": "Order Accepted!",
    "status.accepted_desc": "Great news! Your order has been accepted and is now being prepared.",
    "status.estimated_time": "Estimated Time",
    "status.preparing": "Cooking in Progress",
    "status.preparing_desc": "Our chefs are working hard to prepare your delicious meal!",
    "status.remaining": "remaining",
    "status.ready": "🎉 Order Ready for Pickup!",
    "status.ready_desc": "Your delicious meal is ready! Please collect it from the canteen counter.",
    "status.pickup_location": "Pickup Location: Block B, Ground Floor",
    "status.mark_picked": "Mark as Picked Up",
    "status.complete": "Order Complete! 🎉",
    "status.complete_desc": "Thank you for using QuickBite! We hope you enjoyed your meal.",
    "status.rate_experience": "Rate your experience:",
    "status.order_again": "Order Again",
    "status.order_details": "Order Details",
    "status.order_id": "Order ID",
    "status.placed_at": "Placed at",
    "status.payment": "Payment",
    "status.need_help": "Need Help?",
    "status.call_canteen": "Call Canteen",
    "status.quick_actions": "Quick Actions",
    "status.browse_menu": "Browse Menu",
    "status.order_history": "Order History",
    "status.invalid_order": "Invalid Order",
    "status.order_id_missing": "Order ID is missing",
    "status.error": "Error",
    "status.failed_load": "Failed to load order details",
    "status.status_updated": "Status Updated!",
    "status.order_complete": "Order Complete!",
    "status.thank_you": "Thank you for using QuickBite! Please rate your experience.",
    "status.placed_by": "Placed by",

    // Admin Dashboard
    "admin.title": "QuickBite Admin 🍽️",
    "admin.manage_menu": "Manage Menu",
    "admin.logout": "Logout",
    "admin.order_queue": "Order Queue 📋",
    "admin.manage_orders": "Manage incoming orders from students",
    "admin.order_items": "Order Items:",
    "admin.set_eta": "Set ETA",
    "admin.accept_order": "Accept Order",
    "admin.mark_ready": "Mark as Ready",
    "admin.ready_pickup": "Ready for pickup",
    "admin.no_orders": "No orders yet",
    "admin.orders_appear": "New orders will appear here in real-time",
    "admin.error_loading": "Error loading orders",
    "admin.failed_fetch": "Failed to fetch orders. Please refresh the page.",
    "admin.new_order_received": "New Order Received!",
    "admin.order_from": "Order",
    "admin.from": "from",
    "admin.status_updated": "Status updated",
    "admin.status_updated_desc": "Order status updated. Customer will be notified.",
    "admin.error_updating": "Update failed",
    "admin.error_updating_desc": "Failed to update order status",
    "admin.set_eta_first": "Please set ETA first!",
    "admin.set_eta_first_desc": "You must set estimated preparation time before accepting order",
    "admin.order_accepted": "Order accepted!",
    "admin.order_accepted_desc": "Order has been accepted and customer will be notified.",
    "admin.error_accepting": "Error accepting order",
    "admin.error_accepting_desc": "Failed to accept order. Please try again.",
    "admin.logged_out": "Logged out successfully!",
    "admin.see_you": "See you next time!",
    "admin.fill_all_fields": "Please fill all fields",
    "admin.item_added": "Item added!",
    "admin.added_to_menu": "has been added to the menu",
    "admin.item_updated": "Item updated!",
    "admin.has_been_updated": "has been updated",
    "admin.item_deleted": "Item deleted!",
    "admin.menu_item_removed": "Menu item has been removed",
    "admin.manage_menu_title": "Manage Menu",
    "admin.add_item": "Add Item",
    "admin.edit_item": "Edit Item",
    "admin.item_name": "Item Name",
    "admin.item_price": "Price (₹)",
    "admin.item_category": "Category",
    "admin.item_emoji": "Emoji",
    "admin.save": "Save",
    "admin.cancel": "Cancel",
    "admin.actions": "Actions",
    "admin.back_to_dashboard": "Back to Dashboard",
    "admin.add_new_item": "Add New Item",
    "admin.add_new_menu_item": "Add New Menu Item",
    "admin.edit_menu_item": "Edit Menu Item",
    "admin.update_item": "Update Item",
    "admin.select_category": "Select category",

    // Login
    "login.title": "Welcome to QuickBite 🍽️",
    "login.admin_title": "Admin Login - QuickBite",
    "login.student_title": "Student Login",
    "login.email": "Email",
    "login.password": "Password",
    "login.login": "Login",
    "login.logging_in": "Logging in...",
    "login.logging_you_in": "Logging you in...",
    "login.demo_credentials": "Fill Demo Credentials",
    "login.demo_info": "Demo credentials:",
    "login.back_home": "Back to Home",
    "login.welcome_back": "Welcome Back!",
    "login.login_to_order": "Login to order your favorite meals",
    "login.email_placeholder": "john@example.com",
    "login.password_placeholder": "Enter your password",
    "login.admin_email_placeholder": "admin@example.com",
    "login.admin_only": "Only admins can access this area",
    "login.no_account": "Don't have an account?",
    "login.register_here": "Register here",
    "login.success": "Login successful! 🎉",
    "login.welcome_back_msg": "Welcome back!",
    "login.welcome_admin": "Welcome, Admin!",
    "login.failed": "Login failed ❌",
    "login.invalid_credentials": "Invalid credentials",
    "login.access_denied": "Access denied",
    "login.not_admin": "You are not an admin.",

    // Hero Section Additional
    "hero.long_queue": "Long Queue",
    "hero.students_waiting": "Students waiting in line",
    "hero.quick_pickup": "Quick Pickup",
    "hero.happy_student": "Happy student with food",
    "hero.how_to_order": "How to Order",

    // Location Additional
    "location.map_coming_soon": "Interactive Map Coming Soon",
    "location.map_integration": "Google Maps integration will be added here",
    "location.block_b": "Block B, Ground Floor",
    "location.main_campus": "Main Campus Building",
    "location.open_hours": "Open Hours",
    "location.hours": "8:00 AM - 8:00 PM",

    // Stats
    "stats.title": "Live Stats",
    "stats.subtitle": "Real-time data from our canteen system",
    "stats.total_orders": "Total Orders Served Today",
    "stats.active_admins": "Active Admins",
    "stats.avg_prep_time": "Avg. Preparation Time",

    // Team
    "team.title": "Meet Our Team",
    "team.subtitle": "The people who make your food experience amazing",

    // Top Picks
    "picks.title": "Top Picks",
    "picks.subtitle": "Most popular dishes among students",
    "picks.popular": "Popular",
    "picks.login_to_order": "Login to Order",
    // Food Items
    "food.chicken_biryani": "Chicken Biryani",
    "food.masala_dosa": "Masala Dosa",
    "food.paneer_butter_masala": "Paneer Butter Masala",
    "food.cold_coffee": "Cold Coffee",
    "food.veg_burger": "Veg Burger",
    "food.fresh_juice": "Fresh Juice",
    "food.paneer_wrap": "Paneer Wrap",
    "food.veg_thali": "Veg Thali",
    "food.burger": "Burger",
    "food.french_fries": "French Fries",
    "food.samosa": "Samosa",
    "food.mango_juice": "Mango Juice",

    // Loyalty Additional
    "loyalty.program": "Loyalty Program",
    "loyalty.order_point": "Order = 1 Point",
    "loyalty.coming_soon": "Coming Soon!",

    // Fun Facts
    "facts.title": "Fun Facts",
    "facts.subtitle": "Did you know?",

    // Feedback Additional
    "feedback.helps_improve": "Your feedback helps us improve",
    "feedback.rate_experience": "Rate your experience:",
    "feedback.poor": "Poor",
    "feedback.okay": "Okay",
    "feedback.good": "Good",
    "feedback.excellent": "Excellent",
    "feedback.placeholder": "Tell us about your experience...",
    "feedback.please_provide": "Please provide rating and feedback",
    "feedback.thank_you": "Thank you for your feedback! 🙏",
    "feedback.helps_improve_desc": "Your feedback helps us improve our service",

    // Dashboard Preview
    "dashboard_preview.title": "Smart Dashboard Preview",
    "dashboard_preview.subtitle": "Transparent order management system",
    "dashboard_preview.admin_dashboard": "QuickBite Admin Dashboard",
    "dashboard_preview.pending_orders": "Pending Orders",
    "dashboard_preview.avg_wait": "Avg. Wait Time",
    "dashboard_preview.active_admins": "Active Admins",
    "dashboard_preview.set_eta": "Set ETA",
    "dashboard_preview.accept": "Accept",
    "dashboard_preview.admin_control": "Admin Full Control:",
    "dashboard_preview.admin_control_desc": "Only admins can set preparation times after reviewing each order. Students get notified with exact pickup time!",

    // How It Works
    "how_it_works.title": "How It Works",
    "how_it_works.subtitle": "Simple steps to get your food without the wait",

    // Features
    "features.title": "Features Highlights",
    "features.subtitle": "Everything you need for a seamless food ordering experience",

    // Testimonials
    "testimonials.title": "What Our Users Say",
    "testimonials.subtitle": "Real feedback from students and admins",
    "testimonial.priya.name": "Priya Sharma",
    "testimonial.priya.role": "Computer Science Student",
    "testimonial.priya.content": "Loved how quick and smooth the process was! No more standing in lines during lunch break.",
    "testimonial.rahul.name": "Rahul Patel",
    "testimonial.rahul.role": "Engineering Student",
    "testimonial.rahul.content": "Perfect for busy students during breaks. I can order between classes and pick up when convenient.",
    "testimonial.anita.name": "Anita Singh",
    "testimonial.anita.role": "MBA Student",
    "testimonial.anita.content": "No more standing in line. Great experience! The notifications are super helpful.",
    "testimonial.admin.name": "Admin Team",
    "testimonial.admin.role": "Canteen Management",
    "testimonial.admin.content": "Easy to manage orders and set realistic preparation times. Students love the transparency!",

    // FAQ
    "faq.title": "Frequently Asked Questions",
    "faq.subtitle": "Everything you need to know about QuickBite",

    // CTA
    "cta.title": "Ready to Skip the Queue?",
    "cta.subtitle": "Join hundreds of students who are already enjoying hassle-free food ordering",

    // Footer
    "footer.tagline": "Making college dining faster and more convenient for everyone.",
    "footer.campus_project": "College Campus Project",
    "footer.quick_links": "Quick Links",
    "footer.home": "Home",
    "footer.login": "Login",
    "footer.admin_login": "Admin Login",
    "footer.menu": "Menu",
    "footer.contact": "Contact",
    "footer.contact_title": "Contact",
    "footer.follow_us": "Follow Us",
    "footer.built_for_students": "Built with ❤️ for students",
    "footer.copyright": "© 2025 QuickBite. All rights reserved. Made with ❤️ for college students.",

    // Cart Additional
    "cart.items_count": "item",
    "cart.items_count_plural": "items",
    "cart.student": "Student",
    "cart.subtotal_label": "Subtotal:",
    "cart.empty_cart": "Cart is empty! 🛒",
    "cart.add_items_first": "Add some items to your cart first",
    "cart.not_authenticated": "Not authenticated",
    "cart.please_login": "Please login to place an order",
    "cart.order_placed": "🎉 Order placed successfully!",
    "cart.order_sent": "has been sent to the kitchen. You'll be notified when it's ready.",
    "cart.order_failed": "Order failed ❌",
    "cart.failed_desc": "Failed to place order. Please try again.",

    // Features
    "features.secure_login": "Secure Login",
    "features.secure_login_desc": "Safe and secure authentication before ordering",
    "features.one_click": "One-Click Ordering",
    "features.one_click_desc": "Quick and easy food ordering with just a few clicks",
    "features.admin_control": "Admin Control",
    "features.admin_control_desc": "Admin-controlled food status updates and time management",
    "features.live_notifications": "Live Notifications",
    "features.live_notifications_desc": "Real-time updates when your food is ready for pickup",

    // Steps
    "steps.signup.title": "Sign Up or Log In",
    "steps.signup.desc": "Create your account or log in to access the ordering system",
    "steps.browse.title": "Browse Menu & Add Items",
    "steps.browse.desc": "Explore our delicious menu and add your favorite items to cart",
    "steps.confirm.title": "Confirm Order",
    "steps.confirm.desc": "Review your order and submit it for admin confirmation",
    "steps.admin.title": "Admin Updates Status",
    "steps.admin.desc": "Admin reviews, accepts order and sets preparation time",
    "steps.notify.title": "Get Notified",
    "steps.notify.desc": "Receive notification when your food is ready for pickup",

    // Team Members
    "team.chef_ramesh.name": "Chef Ramesh",
    "team.chef_ramesh.role": "Head Chef",
    "team.chef_ramesh.experience": "Serving students since 2015",
    "team.chef_ramesh.specialty": "North Indian Cuisine",
    "team.admin_priya.name": "Admin Priya",
    "team.admin_priya.role": "Order Manager",
    "team.admin_priya.experience": "Confirms every order herself",
    "team.admin_priya.specialty": "Customer Service",
    "team.chef_sunita.name": "Chef Sunita",
    "team.chef_sunita.role": "South Indian Specialist",
    "team.chef_sunita.experience": "Expert in Dosa & Idli",
    "team.chef_sunita.specialty": "South Indian Dishes",

    // Fun Facts
    "facts.orders_served": "We've served over 5,000 orders!",
    "facts.fastest_delivery": "Our fastest delivery was 4 minutes!",
    "facts.satisfaction": "98% customer satisfaction rate!",
    "facts.award": "Winner of 'Best Campus Food Service 2024'",

    // FAQ
    "faq.login_required.q": "Do I need to login to place an order?",
    "faq.login_required.a": "Yes, you need to create an account and login to place orders. This helps us track your orders and send you notifications.",
    "faq.cancel_order.q": "Can I cancel an order after placing it?",
    "faq.cancel_order.a": "No, once an order is confirmed by the admin, it cannot be cancelled. Please review your order carefully before placing it.",
    "faq.who_prepares.q": "Who prepares the food?",
    "faq.who_prepares.a": "The food is prepared by our trained canteen staff who are assigned by the admin. All hygiene and quality standards are maintained.",
    "faq.prep_time.q": "How long does it take to prepare food?",
    "faq.prep_time.a": "Preparation time varies by dish and current order volume. The admin will set an estimated time when they accept your order.",
    "faq.payment.q": "What payment methods are accepted?",
    "faq.payment.a": "Currently, we accept cash payments at the time of pickup. Digital payment options will be available soon.",
    "faq.modify_order.q": "Can I modify my order after placing it?",
    "faq.modify_order.a": "Order modifications are not possible once submitted. Please contact the canteen staff directly if you have special requirements.",

    // Common
    "common.free": "Free",
    "common.included": "Included",
    "common.minutes": "minutes",
    "common.items": "items",
    "common.item": "item",
    "common.min": "min",
  },
  hi: {
    // Navigation
    "nav.title": "क्विकबाइट 🍽️",
    "nav.student": "छात्र लॉगिन",
    "nav.admin": "एडमिन लॉगिन",

    // Hero Section
    "hero.badge": "🚀 अब आपके कॉलेज कैंटीन में लाइव",
    "hero.title": "कतार छोड़ें, खाना नहीं 🍔",
    "hero.subtitle": "कॉलेज कैंटीन से खाना पहले से ऑर्डर करें, तैयार होने पर सूचना पाएं, और बस उठा लें। अब लंबी कतारों में इंतजार नहीं!",
    "hero.cta1": "लॉगिन करें और ऑर्डर करें",
    "hero.cta2": "एडमिन? यहाँ ऑर्डर मैनेज करें",

    // Daily Specials
    "special.today": "आज का स्पेशल",
    "special.off": "छूट",

    // Canteen Status
    "canteen.status.open": "कैंटीन अभी खुला है",
    "canteen.status.closed": "कैंटीन अभी बंद है",

    // Location
    "location.title": "हमें आसानी से खोजें",
    "location.address": "ब्लॉक बी, ग्राउंड फ्लोर, कॉलेज कैंपस",

    // Feedback
    "feedback.title": "आपका पिछला खाना कैसा था?",
    "feedback.submit": "फीडबैक भेजें",

    // Group Order
    "group.title": "क्लब मीटिंग या टीम के लिए ऑर्डर कर रहे हैं?",
    "group.subtitle": "ग्रुप ऑर्डरिंग अब उपलब्ध!",
    "group.cta": "ग्रुप ऑर्डर शुरू करें",

    // Loyalty
    "loyalty.title": "हर ऑर्डर पर 1 पॉइंट कमाएं। मुफ्त स्नैक्स के लिए रिडीम करें!",

    // Demo
    "demo.title": "डेमो ऑर्डर ट्राई करें",
    "demo.subtitle": "बिना असली ऑर्डर के अनुभव टेस्ट करें",
    "demo.activated": "डेमो मोड सक्रिय!",
    "demo.description": "यह एक डेमो ऑर्डर है। कोई असली खाना तैयार नहीं किया जाएगा।",
    "group.coming_soon": "ग्रुप ऑर्डर फीचर जल्द ही आ रहा है!",
    "group.coming_soon_desc": "हम बल्क ऑर्डर के लिए इस फीचर पर काम कर रहे हैं",

    // Student Dashboard
    "dashboard.greeting": "नमस्ते",
    "dashboard.question": "आज आप क्या खाना चाहेंगे?",
    "dashboard.search": "खाने की चीजें खोजें...",
    "dashboard.categories.all": "सभी",
    "dashboard.categories.snacks": "स्नैक्स",
    "dashboard.categories.beverages": "पेय पदार्थ",
    "dashboard.categories.meals": "भोजन",
    "dashboard.add_to_cart": "कार्ट में डालें",
    "dashboard.my_orders": "मेरे ऑर्डर",
    "dashboard.cart": "कार्ट",
    "dashboard.logout": "लॉगआउट",
    "dashboard.added_to_cart": "कार्ट में जोड़ा गया!",
    "dashboard.added_desc": "आपके कार्ट में जोड़ा गया",
    "dashboard.logged_out": "सफलतापूर्वक लॉगआउट!",
    "dashboard.see_you": "फिर मिलेंगे!",
    "dashboard.no_items": "कोई आइटम नहीं मिला",
    "dashboard.try_adjusting": "अपनी खोज या श्रेणी फ़िल्टर को समायोजित करने का प्रयास करें",

    // Cart
    "cart.title": "आपका कार्ट",
    "cart.empty.title": "आपका कार्ट खाली है",
    "cart.empty.subtitle": "स्वादिष्ट भोजन खोजें और अपने कार्ट में डालें!",
    "cart.empty.browse": "मेन्यू देखें",
    "cart.order_items": "ऑर्डर आइटम",
    "cart.estimated": "अनुमानित: 10-15 मिनट",
    "cart.subtotal": "उप-योग",
    "cart.service_fee": "सेवा शुल्क",
    "cart.taxes": "कर",
    "cart.total": "कुल",
    "cart.payment_method": "भुगतान विधि",
    "cart.cash_pickup": "पिकअप पर नकद",
    "cart.estimated_time": "अनुमानित समय",
    "cart.admin_time": "एडमिन पुष्टि के बाद सटीक समय निर्धारित करेगा",
    "cart.place_order": "ऑर्डर करें",
    "cart.placing_order": "ऑर्डर कर रहे हैं...",
    "cart.terms": "इस ऑर्डर को करके, आप हमारे नियम और शर्तों से सहमत हैं",
    "cart.item_removed": "आइटम हटा दिया गया!",
    "cart.removed_desc": "आपके कार्ट से हटा दिया गया है",

    // Order Status
    "status.title": "ऑर्डर ट्रैकिंग",
    "status.subtitle": "अपने स्वादिष्ट भोजन को ट्रैक करें",
    "status.progress": "ऑर्डर प्रगति",
    "status.pending": "ऑर्डर लंबित",
    "status.pending_desc": "आपका ऑर्डर एडमिन की पुष्टि का इंतजार कर रहा है। इसमें आमतौर पर 1-2 मिनट लगते हैं।",
    "status.reviewing": "एडमिन आपके ऑर्डर की समीक्षा कर रहा है...",
    "status.accepted": "ऑर्डर स्वीकार किया गया!",
    "status.accepted_desc": "बहुत बढ़िया! आपका ऑर्डर स्वीकार कर लिया गया है और अब तैयार किया जा रहा है।",
    "status.estimated_time": "अनुमानित समय",
    "status.preparing": "खाना बन रहा है",
    "status.preparing_desc": "हमारे रसोइए आपका स्वादिष्ट भोजन तैयार करने में कड़ी मेहनत कर रहे हैं!",
    "status.remaining": "बाकी",
    "status.ready": "🎉 ऑर्डर पिकअप के लिए तैयार!",
    "status.ready_desc": "आपका स्वादिष्ट भोजन तैयार है! कृपया इसे कैंटीन काउंटर से लें।",
    "status.pickup_location": "पिकअप स्थान: ब्लॉक बी, ग्राउंड फ्लोर",
    "status.mark_picked": "पिक किया गया मार्क करें",
    "status.complete": "ऑर्डर पूरा! 🎉",
    "status.complete_desc": "क्विकबाइट का उपयोग करने के लिए धन्यवाद! हमें उम्मीद है कि आपको अपना भोजन पसंद आया।",
    "status.rate_experience": "अपने अनुभव को रेट करें:",
    "status.order_again": "फिर से ऑर्डर करें",
    "status.order_details": "ऑर्डर विवरण",
    "status.order_id": "ऑर्डर आईडी",
    "status.placed_at": "पर रखा गया",
    "status.payment": "भुगतान",
    "status.need_help": "मदद चाहिए?",
    "status.call_canteen": "कैंटीन को कॉल करें",
    "status.quick_actions": "त्वरित कार्य",
    "status.browse_menu": "मेन्यू देखें",
    "status.order_history": "ऑर्डर इतिहास",
    "status.invalid_order": "अमान्य ऑर्डर",
    "status.order_id_missing": "ऑर्डर आईडी गायब है",
    "status.error": "त्रुटि",
    "status.failed_load": "ऑर्डर विवरण लोड करने में विफल",
    "status.status_updated": "स्थिति अपडेट की गई!",
    "status.order_complete": "ऑर्डर पूरा!",
    "status.thank_you": "क्विकबाइट का उपयोग करने के लिए धन्यवाद! कृपया अपने अनुभव को रेट करें।",
    "status.placed_by": "द्वारा रखा गया",

    // Admin Dashboard
    "admin.title": "क्विकबाइट एडमिन 🍽️",
    "admin.manage_menu": "मेन्यू प्रबंधित करें",
    "admin.logout": "लॉगआउट",
    "admin.order_queue": "ऑर्डर कतार 📋",
    "admin.manage_orders": "छात्रों से आने वाले ऑर्डर प्रबंधित करें",
    "admin.order_items": "ऑर्डर आइटम:",
    "admin.set_eta": "ETA सेट करें",
    "admin.accept_order": "ऑर्डर स्वीकार करें",
    "admin.mark_ready": "तैयार मार्क करें",
    "admin.ready_pickup": "पिकअप के लिए तैयार",
    "admin.no_orders": "अभी तक कोई ऑर्डर नहीं",
    "admin.orders_appear": "नए ऑर्डर यहाँ रियल-टाइम में दिखाई देंगे",
    "admin.error_loading": "ऑर्डर लोड करने में त्रुटि",
    "admin.failed_fetch": "ऑर्डर प्राप्त करने में विफल। कृपया पृष्ठ को रीफ्रेश करें।",
    "admin.new_order_received": "नया ऑर्डर प्राप्त हुआ!",
    "admin.order_from": "ऑर्डर",
    "admin.from": "से",
    "admin.status_updated": "स्थिति अपडेट की गई",
    "admin.status_updated_desc": "ऑर्डर स्थिति अपडेट की गई। ग्राहक को सूचित किया जाएगा।",
    "admin.error_updating": "अपडेट विफल",
    "admin.error_updating_desc": "ऑर्डर स्थिति अपडेट करने में विफल",
    "admin.set_eta_first": "कृपया पहले ETA सेट करें!",
    "admin.set_eta_first_desc": "ऑर्डर स्वीकार करने से पहले आपको अनुमानित तैयारी समय सेट करना होगा",
    "admin.order_accepted": "ऑर्डर स्वीकार किया गया!",
    "admin.order_accepted_desc": "ऑर्डर स्वीकार कर लिया गया है और ग्राहक को सूचित किया जाएगा।",
    "admin.error_accepting": "ऑर्डर स्वीकार करने में त्रुटि",
    "admin.error_accepting_desc": "ऑर्डर स्वीकार करने में विफल। कृपया पुनः प्रयास करें।",
    "admin.logged_out": "सफलतापूर्वक लॉगआउट!",
    "admin.see_you": "फिर मिलेंगे!",
    "admin.fill_all_fields": "कृपया सभी फ़ील्ड भरें",
    "admin.item_added": "आइटम जोड़ा गया!",
    "admin.added_to_menu": "मेन्यू में जोड़ा गया है",
    "admin.item_updated": "आइटम अपडेट किया गया!",
    "admin.has_been_updated": "अपडेट किया गया है",
    "admin.item_deleted": "आइटम हटा दिया गया!",
    "admin.menu_item_removed": "मेन्यू आइटम हटा दिया गया है",
    "admin.manage_menu_title": "मेन्यू प्रबंधित करें",
    "admin.add_item": "आइटम जोड़ें",
    "admin.edit_item": "संपादित करें",
    "admin.item_name": "आइटम नाम",
    "admin.item_price": "मूल्य (₹)",
    "admin.item_category": "श्रेणी",
    "admin.item_emoji": "इमोजी",
    "admin.save": "सहेजें",
    "admin.cancel": "रद्द करें",
    "admin.actions": "कार्रवाई",
    "admin.back_to_dashboard": "डैशबोर्ड पर वापस",
    "admin.add_new_item": "नया आइटम जोड़ें",
    "admin.add_new_menu_item": "नया मेन्यू आइटम जोड़ें",
    "admin.edit_menu_item": "मेन्यू आइटम संपादित करें",
    "admin.update_item": "आइटम अपडेट करें",
    "admin.select_category": "श्रेणी चुनें",

    // Login
    "login.title": "क्विकबाइट में आपका स्वागत है 🍽️",
    "login.student_title": "छात्र लॉगिन",
    "login.admin_title": "एडमिन लॉगिन - क्विकबाइट",
    "login.email": "ईमेल",
    "login.password": "पासवर्ड",
    "login.login": "लॉगिन",
    "login.logging_in": "लॉगिन हो रहे हैं...",
    "login.logging_you_in": "आपको लॉगिन कर रहे हैं...",
    "login.demo_credentials": "डेमो क्रेडेंशियल भरें",
    "login.demo_info": "डेमो क्रेडेंशियल:",
    "login.back_home": "होम पर वापस",
    "login.welcome_back": "वापसी पर स्वागत है!",
    "login.login_to_order": "अपने पसंदीदा भोजन ऑर्डर करने के लिए लॉगिन करें",
    "login.email_placeholder": "john@example.com",
    "login.password_placeholder": "अपना पासवर्ड दर्ज करें",
    "login.admin_email_placeholder": "admin@example.com",
    "login.admin_only": "केवल एडमिन इस क्षेत्र तक पहुंच सकते हैं",
    "login.no_account": "खाता नहीं है?",
    "login.register_here": "यहाँ रजिस्टर करें",
    "login.success": "लॉगिन सफल! 🎉",
    "login.welcome_back_msg": "वापसी पर स्वागत है!",
    "login.welcome_admin": "स्वागत है, एडमिन!",
    "login.failed": "लॉगिन विफल ❌",
    "login.invalid_credentials": "अमान्य क्रेडेंशियल",
    "login.access_denied": "पहुंच अस्वीकृत",
    "login.not_admin": "आप एक एडमिन नहीं हैं।",

    // Hero Section Additional
    "hero.long_queue": "लंबी कतार",
    "hero.students_waiting": "कतार में इंतजार कर रहे छात्र",
    "hero.quick_pickup": "त्वरित पिकअप",
    "hero.happy_student": "खाने के साथ खुश छात्र",
    "hero.how_to_order": "कैसे ऑर्डर करें",

    // Location Additional
    "location.map_coming_soon": "इंटरैक्टिव मानचित्र जल्द ही आ रहा है",
    "location.map_integration": "Google Maps एकीकरण यहाँ जोड़ा जाएगा",
    "location.block_b": "ब्लॉक बी, ग्राउंड फ्लोर",
    "location.main_campus": "मुख्य कैंपस भवन",
    "location.open_hours": "खुले घंटे",
    "location.hours": "सुबह 8:00 - रात 8:00",

    // Stats
    "stats.title": "लाइव स्टैट्स",
    "stats.subtitle": "हमारे कैंटीन सिस्टम से रियल-टाइम डेटा",
    "stats.total_orders": "आज परोसे गए कुल ऑर्डर",
    "stats.active_admins": "सक्रिय एडमिन",
    "stats.avg_prep_time": "औसत तैयारी समय",

    // Fun Facts
    "facts.title": "मजेदार तथ्य",
    "facts.subtitle": "क्या आप जानते हैं?",
    "facts.orders_served": "हमने 5,000 से अधिक ऑर्डर परोसे हैं!",
    "facts.fastest_delivery": "हमारी सबसे तेज़ डिलीवरी 4 मिनट में थी!",
    "facts.satisfaction": "98% ग्राहक संतुष्टि दर!",
    "facts.award": "'बेस्ट कैंपस फूड सर्विस 2024' की विजेता",

    // How It Works
    "how_it_works.title": "यह कैसे काम करता है",
    "how_it_works.subtitle": "इंतजार किए बिना अपना भोजन पाने के लिए सरल कदम",

    // Steps
    "steps.signup.title": "साइन अप या लॉग इन करें",
    "steps.signup.desc": "ऑर्डरिंग सिस्टम तक पहुँचने के लिए अपना खाता बनाएं या लॉग इन करें",
    "steps.browse.title": "मेन्यू ब्राउज़ करें",
    "steps.browse.desc": "हमारे स्वादिष्ट मेन्यू को देखें और अपने पसंदीदा आइटम को कार्ट में जोड़ें",
    "steps.confirm.title": "ऑर्डर की पुष्टि करें",
    "steps.confirm.desc": "अपने ऑर्डर की समीक्षा करें और एडमिन पुष्टि के लिए सबमिट करें",
    "steps.admin.title": "एडमिन स्थिति अपडेट करता है",
    "steps.admin.desc": "एडमिन समीक्षा करता है, ऑर्डर स्वीकार करता है और तैयारी का समय निर्धारित करता है",
    "steps.notify.title": "सूचना प्राप्त करें",
    "steps.notify.desc": "जब आपका भोजन पिकअप के लिए तैयार हो तो सूचना प्राप्त करें",

    // Features
    "features.title": "फीचर्स हाइलाइट्स",
    "features.subtitle": "एक सहज भोजन ऑर्डरिंग अनुभव के लिए आपको जो कुछ चाहिए",
    "features.secure_login": "सुरक्षित लॉगिन",
    "features.secure_login_desc": "ऑर्डर करने से पहले सुरक्षित प्रमाणीकरण",
    "features.one_click": "वन-क्लिक ऑर्डरिंग",
    "features.one_click_desc": "कुछ ही क्लिक में अपना पसंदीदा भोजन ऑर्डर करें",
    "features.admin_control": "एडमिन नियंत्रण",
    "features.admin_control_desc": "एडमिन प्रत्येक ऑर्डर की समीक्षा करता है और समय निर्धारित करता है",
    "features.live_notifications": "लाइव सूचनाएं",
    "features.live_notifications_desc": "रियल-टाइम अपडेट जब आपका ऑर्डर तैयार हो",

    // Team
    "team.title": "हमारी टीम से मिलें",
    "team.subtitle": "वे लोग जो आपके भोजन के अनुभव को अद्भुत बनाते हैं",
    "team.chef_ramesh.name": "शेफ रमेश",
    "team.chef_ramesh.role": "हेड शेफ",
    "team.chef_ramesh.experience": "2015 से छात्रों की सेवा कर रहे हैं",
    "team.chef_ramesh.specialty": "उत्तर भारतीय व्यंजन",
    "team.admin_priya.name": "एडमिन प्रिया",
    "team.admin_priya.role": "ऑर्डर मैनेजर",
    "team.admin_priya.experience": "हर ऑर्डर की पुष्टि खुद करती हैं",
    "team.admin_priya.specialty": "ग्राहक सेवा",
    "team.chef_sunita.name": "शेफ सुनीता",
    "team.chef_sunita.role": "दक्षिण भारतीय विशेषज्ञ",
    "team.chef_sunita.experience": "डोसा और इडली में विशेषज्ञ",
    "team.chef_sunita.specialty": "दक्षिण भारतीय व्यंजन",

    // Top Picks
    "picks.title": "टॉप पिक्स",
    "picks.subtitle": "छात्रों के बीच सबसे लोकप्रिय व्यंजन",
    "picks.popular": "लोकप्रिय",
    "picks.login_to_order": "ऑर्डर करने के लिए लॉगिन करें",
    // Food Items
    "food.chicken_biryani": "चिकन बिरयानी",
    "food.masala_dosa": "मसाला डोसा",
    "food.paneer_butter_masala": "पनीर बटर मसाला",
    "food.cold_coffee": "कोल्ड कॉफी",
    "food.veg_burger": "वेज बर्गर",
    "food.fresh_juice": "ताजा जूस",
    "food.paneer_wrap": "पनीर रैप",
    "food.veg_thali": "वेज थाली",
    "food.burger": "बर्गर",
    "food.french_fries": "फ्रेंच फ्राइज़",
    "food.samosa": "समोसा",
    "food.mango_juice": "आम का जूस",

    // Loyalty Additional
    "loyalty.program": "लॉयल्टी प्रोग्राम",
    "loyalty.order_point": "ऑर्डर = 1 पॉइंट",
    "loyalty.coming_soon": "जल्द ही आ रहा है!",

    // Fun Facts
    "facts.title": "मजेदार तथ्य",
    "facts.subtitle": "क्या आप जानते हैं?",

    // Feedback Additional
    "feedback.helps_improve": "आपका फीडबैक हमें सुधारने में मदद करता है",
    "feedback.rate_experience": "अपने अनुभव को रेट करें:",
    "feedback.poor": "खराब",
    "feedback.okay": "ठीक",
    "feedback.good": "अच्छा",
    "feedback.excellent": "उत्कृष्ट",
    "feedback.placeholder": "अपने अनुभव के बारे में बताएं...",
    "feedback.please_provide": "कृपया रेटिंग और फीडबैक प्रदान करें",
    "feedback.thank_you": "आपके फीडबैक के लिए धन्यवाद! 🙏",
    "feedback.helps_improve_desc": "आपका फीडबैक हमारी सेवा में सुधार करने में मदद करता है",

    // Dashboard Preview
    "dashboard_preview.title": "स्मार्ट डैशबोर्ड पूर्वावलोकन",
    "dashboard_preview.subtitle": "पारदर्शी ऑर्डर प्रबंधन प्रणाली",
    "dashboard_preview.admin_dashboard": "क्विकबाइट एडमिन डैशबोर्ड",
    "dashboard_preview.pending_orders": "लंबित ऑर्डर",
    "dashboard_preview.avg_wait": "औसत प्रतीक्षा समय",
    "dashboard_preview.active_admins": "सक्रिय एडमिन",
    "dashboard_preview.set_eta": "ETA सेट करें",
    "dashboard_preview.accept": "स्वीकार करें",
    "dashboard_preview.admin_control": "एडमिन पूर्ण नियंत्रण:",
    "dashboard_preview.admin_control_desc": "केवल एडमिन प्रत्येक ऑर्डर की समीक्षा के बाद तैयारी का समय निर्धारित कर सकते हैं। छात्रों को सटीक पिकअप समय के साथ सूचित किया जाता है!",

    // How It Works
    "how_it_works.title": "यह कैसे काम करता है",
    "how_it_works.subtitle": "इंतजार किए बिना अपना भोजन पाने के लिए सरल कदम",

    // Features
    "features.title": "फीचर्स हाइलाइट्स",
    "features.subtitle": "एक सहज भोजन ऑर्डरिंग अनुभव के लिए आपको जो कुछ चाहिए",

    // Testimonials
    "testimonials.title": "हमारे उपयोगकर्ता क्या कहते हैं",
    "testimonials.subtitle": "छात्रों और एडमिन से वास्तविक फीडबैक",
    "testimonial.priya.name": "Priya Sharma",
    "testimonial.priya.role": "Computer Science Student",
    "testimonial.priya.content": "प्रक्रिया कितनी तेज़ और सुचारू थी, यह पसंद आया! अब लंच ब्रेक के दौरान लाइन में खड़े होने की जरूरत नहीं।",
    "testimonial.rahul.name": "Rahul Patel",
    "testimonial.rahul.role": "Engineering Student",
    "testimonial.rahul.content": "ब्रेक के दौरान व्यस्त छात्रों के लिए बिल्कुल सही। मैं कक्षाओं के बीच ऑर्डर कर सकता हूँ और सुविधाजनक समय पर ले सकता हूँ।",
    "testimonial.anita.name": "Anita Singh",
    "testimonial.anita.role": "MBA Student",
    "testimonial.anita.content": "अब लाइन में खड़े होने की जरूरत नहीं। बेहतरीन अनुभव! सूचनाएं बहुत मददगार हैं।",
    "testimonial.admin.name": "Admin Team",
    "testimonial.admin.role": "Canteen Management",
    "testimonial.admin.content": "ऑर्डर प्रबंधित करना और यथार्थवादी तैयारी समय निर्धारित करना आसान है। छात्रों को पारदर्शिता पसंद है!",

    // FAQ
    "faq.title": "अक्सर पूछे जाने वाले प्रश्न",
    "faq.subtitle": "क्विकबाइट के बारे में आपको जो कुछ जानना चाहिए",
    "faq.login_required.q": "क्या मुझे ऑर्डर देने के लिए लॉगिन करना होगा?",
    "faq.login_required.a": "हाँ, आपको ऑर्डर देने के लिए एक खाता बनाना और लॉगिन करना होगा। यह हमें आपके ऑर्डर को ट्रैक करने और आपको सूचनाएं भेजने में मदद करता है।",
    "faq.cancel_order.q": "क्या मैं ऑर्डर देने के बाद इसे रद्द कर सकता हूँ?",
    "faq.cancel_order.a": "नहीं, एक बार एडमिन द्वारा ऑर्डर की पुष्टि हो जाने के बाद, इसे रद्द नहीं किया जा सकता। कृपया इसे देने से पहले अपने ऑर्डर की सावधानी से समीक्षा करें।",
    "faq.who_prepares.q": "खाना कौन तैयार करता है?",
    "faq.who_prepares.a": "खाना हमारे प्रशिक्षित कैंटीन स्टाफ द्वारा तैयार किया जाता है जो एडमिन द्वारा नियुक्त किए जाते हैं। सभी स्वच्छता और गुणवत्ता मानकों को बनाए रखा जाता है।",
    "faq.prep_time.q": "खाना तैयार करने में कितना समय लगता है?",
    "faq.prep_time.a": "तैयारी का समय व्यंजन और वर्तमान ऑर्डर वॉल्यूम के अनुसार भिन्न होता है। एडमिन आपके ऑर्डर को स्वीकार करते समय एक अनुमानित समय निर्धारित करेगा।",
    "faq.payment.q": "कौन सी भुगतान विधि स्वीकार की जाती है?",
    "faq.payment.a": "वर्तमान में, हम पिकअप के समय नकद भुगतान स्वीकार करते हैं। डिजिटल भुगतान विकल्प जल्द ही उपलब्ध होंगे।",
    "faq.modify_order.q": "क्या मैं ऑर्डर देने के बाद इसे संशोधित कर सकता हूँ?",
    "faq.modify_order.a": "सबमिट होने के बाद ऑर्डर संशोधन संभव नहीं है। यदि आपकी विशेष आवश्यकता है तो कृपया सीधे कैंटीन स्टाफ से संपर्क करें।",

    // CTA
    "cta.title": "कतार छोड़ने के लिए तैयार हैं?",
    "cta.subtitle": "सैकड़ों छात्रों में शामिल हों जो पहले से ही परेशानी मुक्त भोजन ऑर्डरिंग का आनंद ले रहे हैं",

    // Footer
    "footer.tagline": "सभी के लिए कॉलेज डाइनिंग को तेज और अधिक सुविधाजनक बनाना।",
    "footer.campus_project": "कॉलेज कैंपस प्रोजेक्ट",
    "footer.quick_links": "त्वरित लिंक",
    "footer.home": "होम",
    "footer.login": "लॉगिन",
    "footer.admin_login": "एडमिन लॉगिन",
    "footer.menu": "मेन्यू",
    "footer.contact": "संपर्क",
    "footer.contact_title": "संपर्क",
    "footer.follow_us": "हमें फॉलो करें",
    "footer.built_for_students": "छात्रों के लिए ❤️ से बनाया गया",
    "footer.copyright": "© 2025 क्विकबाइट। सभी अधिकार सुरक्षित। कॉलेज छात्रों के लिए ❤️ से बनाया गया।",

    // Cart Additional
    "cart.items_count": "आइटम",
    "cart.items_count_plural": "आइटम",
    "cart.student": "छात्र",
    "cart.subtotal_label": "उप-योग:",
    "cart.empty_cart": "कार्ट खाली है! 🛒",
    "cart.add_items_first": "पहले अपने कार्ट में कुछ आइटम जोड़ें",
    "cart.not_authenticated": "प्रमाणित नहीं",
    "cart.please_login": "कृपया ऑर्डर देने के लिए लॉगिन करें",
    "cart.order_placed": "🎉 ऑर्डर सफलतापूर्वक दिया गया!",
    "cart.order_sent": "रसोई में भेजा गया है। तैयार होने पर आपको सूचित किया जाएगा।",
    "cart.order_failed": "ऑर्डर विफल ❌",
    "cart.failed_desc": "ऑर्डर देने में विफल। कृपया पुनः प्रयास करें।",

    // Common
    "common.free": "मुफ्त",
    "common.included": "शामिल",
    "common.minutes": "मिनट",
    "common.items": "आइटम",
    "common.item": "आइटम",
    "common.min": "मिन",
  },
  mai: {
    // Navigation
    "nav.title": "क्विकबाइट 🍽️",
    "nav.student": "छात्र लॉगिन",
    "nav.admin": "एडमिन लॉगिन",

    // Hero Section
    "hero.badge": "🚀 अहाँक कॉलेज कैंटीन मे लाइव",
    "hero.title": "कतार छोड़ू, खाना नहि 🍔",
    "hero.subtitle": "कॉलेज कैंटीन सँ खाना पहिने ऑर्डर करू, तैयार भेलाक बाद सूचना पाबू, आ बस उठा लिअ। आब लम्बा कतार मे इंतजार नहि!",
    "hero.cta1": "लॉगिन करू आ ऑर्डर करू",
    "hero.cta2": "एडमिन? एतय ऑर्डर मैनेज करू",

    // Daily Specials
    "special.today": "आइक स्पेशल",
    "special.off": "छूट",

    // Canteen Status
    "canteen.status.open": "कैंटीन अखन खुजल अछि",
    "canteen.status.closed": "कैंटीन अखन बन्द अछि",

    // Location
    "location.title": "हमरा आसानी सँ खोजू",
    "location.address": "ब्लॉक बी, ग्राउंड फ्लोर, कॉलेज कैंपस",

    // Feedback
    "feedback.title": "अहाँक पछिला खाना कहन छल?",
    "feedback.submit": "फीडबैक भेजू",

    // Group Order
    "group.title": "क्लब मीटिंग या टीमक लेल ऑर्डर कऽ रहल छी?",
    "group.subtitle": "ग्रुप ऑर्डरिंग आब उपलब्ध!",
    "group.cta": "ग्रुप ऑर्डर शुरू करू",

    // Loyalty
    "loyalty.title": "हर ऑर्डर पर 1 पॉइंट कमाऊ। फ्री स्नैक्सक लेल रिडीम करू!",

    // Demo
    "demo.title": "डेमो ऑर्डर ट्राई करू",
    "demo.subtitle": "बिना असली ऑर्डरक अनुभव टेस्ट करू",
    "demo.activated": "डेमो मोड सक्रिय!",
    "demo.description": "ई एक डेमो ऑर्डर अछि। कोनो असली खाना तैयार नहि कएल जाएत।",
    "group.coming_soon": "ग्रुप ऑर्डर फीचर जल्दी आबैत!",
    "group.coming_soon_desc": "हम बल्क ऑर्डरक लेल ई फीचर पर काम कऽ रहल छी",

    // Student Dashboard
    "dashboard.greeting": "नमस्कार",
    "dashboard.question": "आइ अहाँ की खाए चाहब?",
    "dashboard.search": "खानाक चीज खोजू...",
    "dashboard.categories.all": "सभ",
    "dashboard.categories.snacks": "स्नैक्स",
    "dashboard.categories.beverages": "पेय",
    "dashboard.categories.meals": "भोजन",
    "dashboard.add_to_cart": "कार्ट मे डालू",
    "dashboard.my_orders": "हमर ऑर्डर",
    "dashboard.cart": "कार्ट",
    "dashboard.logout": "लॉगआउट",
    "dashboard.added_to_cart": "कार्ट मे जोड़ल गेल!",
    "dashboard.added_desc": "अहाँक कार्ट मे जोड़ल गेल",
    "dashboard.logged_out": "सफलतापूर्वक लॉगआउट!",
    "dashboard.see_you": "फेर मिलब",
    "dashboard.no_items": "कोनो आइटम नहि मिलल",
    "dashboard.try_adjusting": "अपन खोज या श्रेणी फ़िल्टर कऽ समायोजित करबाक प्रयास करू",

    // Cart
    "cart.title": "अहाँक कार्ट",
    "cart.empty.title": "अहाँक कार्ट खाली अछि",
    "cart.empty.subtitle": "स्वादिष्ट भोजन खोजू आ अपन कार्ट मे डालू!",
    "cart.empty.browse": "मेन्यू देखू",
    "cart.order_items": "ऑर्डर आइटम",
    "cart.estimated": "अनुमानित: 10-15 मिनट",
    "cart.subtotal": "उप-योग",
    "cart.service_fee": "सेवा शुल्क",
    "cart.taxes": "कर",
    "cart.total": "कुल",
    "cart.payment_method": "भुगतान विधि",
    "cart.cash_pickup": "पिकअप पर नकद",
    "cart.estimated_time": "अनुमानित समय",
    "cart.admin_time": "एडमिन पुष्टिक बाद सटीक समय निर्धारित करत",
    "cart.place_order": "ऑर्डर करू",
    "cart.placing_order": "ऑर्डर कऽ रहल छी...",
    "cart.terms": "ई ऑर्डर कऽ कऽ, अहाँ हमर नियम आ शर्त सँ सहमत छी",
    "cart.item_removed": "आइटम हटा देल गेल!",
    "cart.removed_desc": "अहाँक कार्ट सँ हटा देल गेल अछि",

    // Order Status
    "status.title": "ऑर्डर ट्रैकिंग",
    "status.subtitle": "अपन स्वादिष्ट भोजन ट्रैक करू",
    "status.progress": "ऑर्डर प्रगति",
    "status.pending": "ऑर्डर लंबित",
    "status.pending_desc": "अहाँक ऑर्डर एडमिनक पुष्टिक इंतजार कऽ रहल अछि। एहि मे आमतौर पर 1-2 मिनट लगैत अछि।",
    "status.reviewing": "एडमिन अहाँक ऑर्डरक समीक्षा कऽ रहल अछि...",
    "status.accepted": "ऑर्डर स्वीकार भऽ गेल!",
    "status.accepted_desc": "बहुत नीक! अहाँक ऑर्डर स्वीकार कऽ लेल गेल अछि आ आब तैयार कएल जा रहल अछि।",
    "status.estimated_time": "अनुमानित समय",
    "status.preparing": "खाना बनि रहल अछि",
    "status.preparing_desc": "हमर रसोइया अहाँक स्वादिष्ट भोजन तैयार करै मे कड़ी मेहनत कऽ रहल छथि!",
    "status.remaining": "बाकी",
    "status.ready": "🎉 ऑर्डर पिकअपक लेल तैयार!",
    "status.ready_desc": "अहाँक स्वादिष्ट भोजन तैयार अछि! कृपया एकरा कैंटीन काउंटर सँ लऽ लिअ।",
    "status.pickup_location": "पिकअप स्थान: ब्लॉक बी, ग्राउंड फ्लोर",
    "status.mark_picked": "पिक कएल गेल मार्क करू",
    "status.complete": "ऑर्डर पूरा! 🎉",
    "status.complete_desc": "क्विकबाइटक उपयोग करबाक लेल धन्यवाद! हमरा उम्मीद अछि जे अहाँक अपन भोजन नीक लागल।",
    "status.rate_experience": "अपन अनुभव रेट करू:",
    "status.order_again": "फेर ऑर्डर करू",
    "status.order_details": "ऑर्डर विवरण",
    "status.order_id": "ऑर्डर आईडी",
    "status.placed_at": "पर राखल गेल",
    "status.payment": "भुगतान",
    "status.need_help": "मदद चाही?",
    "status.call_canteen": "कैंटीन कऽ कॉल करू",
    "status.quick_actions": "त्वरित कार्य",
    "status.browse_menu": "मेन्यू देखू",
    "status.order_history": "ऑर्डर इतिहास",
    "status.invalid_order": "अमान्य ऑर्डर",
    "status.order_id_missing": "ऑर्डर आईडी गायब अछि",
    "status.error": "त्रुटि",
    "status.failed_load": "ऑर्डर विवरण लोड करबाक मे विफल",
    "status.status_updated": "स्थिति अपडेट कएल गेल!",
    "status.order_complete": "ऑर्डर पूरा!",
    "status.thank_you": "क्विकबाइटक उपयोग करबाक लेल धन्यवाद! कृपया अपन अनुभव रेट करू।",
    "status.placed_by": "द्वारा राखल गेल",

    // Admin Dashboard
    "admin.title": "क्विकबाइट एडमिन 🍽️",
    "admin.manage_menu": "मेन्यू प्रबंधित करू",
    "admin.logout": "लॉगआउट",
    "admin.order_queue": "ऑर्डर कतार 📋",
    "admin.manage_orders": "छात्र सभ सँ आबै वाला ऑर्डर प्रबंधित करू",
    "admin.order_items": "ऑर्डर आइटम:",
    "admin.set_eta": "ETA सेट करू",
    "admin.accept_order": "ऑर्डर स्वीकार करू",
    "admin.mark_ready": "तैयार मार्क करू",
    "admin.ready_pickup": "पिकअपक लेल तैयार",
    "admin.no_orders": "अखन तक कोनो ऑर्डर नहि",
    "admin.orders_appear": "नव ऑर्डर एतय रियल-टाइम मे देखाइत",
    "admin.error_loading": "ऑर्डर लोड करबाक मे त्रुटि",
    "admin.failed_fetch": "ऑर्डर प्राप्त करबाक मे विफल। कृपया पृष्ठ कऽ रीफ्रेश करू।",
    "admin.new_order_received": "नव ऑर्डर प्राप्त भेल!",
    "admin.order_from": "ऑर्डर",
    "admin.from": "सँ",
    "admin.status_updated": "स्थिति अपडेट कएल गेल",
    "admin.status_updated_desc": "ऑर्डर स्थिति अपडेट कएल गेल। ग्राहक कऽ सूचित कएल जाएत।",
    "admin.error_updating": "अपडेट विफल",
    "admin.error_updating_desc": "ऑर्डर स्थिति अपडेट करबाक मे विफल",
    "admin.set_eta_first": "कृपया पहिने ETA सेट करू!",
    "admin.set_eta_first_desc": "ऑर्डर स्वीकार करबाक पहिने अहाँक अनुमानित तैयारी समय सेट करबाक पड़त",
    "admin.order_accepted": "ऑर्डर स्वीकार कएल गेल!",
    "admin.order_accepted_desc": "ऑर्डर स्वीकार कएल गेल अछि आ ग्राहक कऽ सूचित कएल जाएत।",
    "admin.error_accepting": "ऑर्डर स्वीकार करबाक मे त्रुटि",
    "admin.error_accepting_desc": "ऑर्डर स्वीकार करबाक मे विफल। कृपया पुनः प्रयास करू।",
    "admin.logged_out": "सफलतापूर्वक लॉगआउट!",
    "admin.see_you": "फेर मिलब!",
    "admin.fill_all_fields": "कृपया सभ फ़ील्ड भरू",
    "admin.item_added": "आइटम जोड़ल गेल!",
    "admin.added_to_menu": "मेन्यू मे जोड़ल गेल अछि",
    "admin.item_updated": "आइटम अपडेट कएल गेल!",
    "admin.has_been_updated": "अपडेट कएल गेल अछि",
    "admin.item_deleted": "आइटम हटा देल गेल!",
    "admin.menu_item_removed": "मेन्यू आइटम हटा देल गेल अछि",
    "admin.manage_menu_title": "मेन्यू प्रबंधित करू",
    "admin.add_item": "आइटम जोड़ू",
    "admin.edit_item": "संपादित करू",
    "admin.item_name": "आइटम नाम",
    "admin.item_price": "मूल्य (₹)",
    "admin.item_category": "श्रेणी",
    "admin.item_emoji": "इमोजी",
    "admin.save": "सहेजू",
    "admin.cancel": "रद्द करू",
    "admin.actions": "कार्रवाई",
    "admin.back_to_dashboard": "डैशबोर्ड पर वापस",
    "admin.add_new_item": "नव आइटम जोड़ू",
    "admin.add_new_menu_item": "नव मेन्यू आइटम जोड़ू",
    "admin.edit_menu_item": "मेन्यू आइटम संपादित करू",
    "admin.update_item": "आइटम अपडेट करू",
    "admin.select_category": "श्रेणी चुनू",

    // Login
    "login.title": "क्विकबाइट मे अहाँक स्वागत अछि 🍽️",
    "login.student_title": "छात्र लॉगिन",
    "login.admin_title": "एडमिन लॉगिन - क्विकबाइट",
    "login.email": "ईमेल",
    "login.password": "पासवर्ड",
    "login.login": "लॉगिन",
    "login.logging_in": "लॉगिन भऽ रहल अछि...",
    "login.logging_you_in": "अहाँक लॉगिन कऽ रहल छी...",
    "login.demo_credentials": "डेमो क्रेडेंशियल भरू",
    "login.demo_info": "डेमो क्रेडेंशियल:",
    "login.back_home": "घर वापस",
    "login.welcome_back": "वापसी पर स्वागत!",
    "login.login_to_order": "अपन पसंदीदा भोजन ऑर्डर करबाक लेल लॉगिन करू",
    "login.email_placeholder": "john@example.com",
    "login.password_placeholder": "अपन पासवर्ड दर्ज करू",
    "login.admin_email_placeholder": "admin@example.com",
    "login.admin_only": "केवल एडमिन ई क्षेत्र तक पहुँच सकैत छथि",
    "login.no_account": "खाता नहि अछि?",
    "login.register_here": "एतय रजिस्टर करू",
    "login.success": "लॉगिन सफल! 🎉",
    "login.welcome_back_msg": "वापसी पर स्वागत!",
    "login.welcome_admin": "स्वागत अछि, एडमिन!",
    "login.failed": "लॉगिन विफल ❌",
    "login.invalid_credentials": "अमान्य क्रेडेंशियल",
    "login.access_denied": "पहुँच अस्वीकृत",
    "login.not_admin": "अहाँ एक एडमिन नहि छी।",

    // Hero Section Additional
    "hero.long_queue": "लम्बा कतार",
    "hero.students_waiting": "कतार मे इंतजार कऽ रहल छात्र",
    "hero.quick_pickup": "त्वरित पिकअप",
    "hero.happy_student": "खानाक साथ खुश छात्र",
    "hero.how_to_order": "कहिने ऑर्डर करू",

    // Location Additional
    "location.map_coming_soon": "इंटरैक्टिव मानचित्र जल्दी आबैत",
    "location.map_integration": "Google Maps एकीकरण एतय जोड़ल जाएत",
    "location.block_b": "ब्लॉक बी, ग्राउंड फ्लोर",
    "location.main_campus": "मुख्य कैंपस भवन",
    "location.open_hours": "खुलल घंटा",
    "location.hours": "सुबह 8:00 - रात 8:00",

    // Stats
    "stats.title": "लाइव स्टैट्स",
    "stats.subtitle": "हमर कैंटीन सिस्टम सँ रियल-टाइम डेटा",
    "stats.total_orders": "आइ परोसल गेल कुल ऑर्डर",
    "stats.active_admins": "सक्रिय एडमिन",
    "stats.avg_prep_time": "औसत तैयारी समय",

    // Team
    "team.title": "हमर टीम सँ मिलू",
    "team.subtitle": "ओ लोग जे अहाँक भोजनक अनुभव कऽ अद्भुत बनाबैत छथि",

    // Top Picks
    "picks.title": "टॉप पिक्स",
    "picks.subtitle": "छात्र सभक बीच सबसँ लोकप्रिय व्यंजन",
    "picks.popular": "लोकप्रिय",
    "picks.login_to_order": "ऑर्डर करबाक लेल लॉगिन करू",
    // Food Items
    "food.chicken_biryani": "चिकन बिरयानी",
    "food.masala_dosa": "मसाला डोसा",
    "food.paneer_butter_masala": "पनीर बटर मसाला",
    "food.cold_coffee": "कोल्ड कॉफी",
    "food.veg_burger": "वेज बर्गर",
    "food.fresh_juice": "ताजा जूस",
    "food.paneer_wrap": "पनीर रैप",
    "food.veg_thali": "वेज थाली",
    "food.burger": "बर्गर",
    "food.french_fries": "फ्रेंच फ्राइज़",
    "food.samosa": "समोसा",
    "food.mango_juice": "आम के जूस",

    // Loyalty Additional
    "loyalty.program": "लॉयल्टी प्रोग्राम",
    "loyalty.order_point": "ऑर्डर = 1 पॉइंट",
    "loyalty.coming_soon": "जल्दी आबैत!",

    // Fun Facts
    "facts.title": "मजेदार तथ्य",
    "facts.subtitle": "की अहाँ जानैत छी?",

    // Feedback Additional
    "feedback.helps_improve": "अहाँक फीडबैक हमरा सुधारै मे मदद करैत अछि",
    "feedback.rate_experience": "अपन अनुभव रेट करू:",
    "feedback.poor": "खराब",
    "feedback.okay": "ठीक",
    "feedback.good": "निक",
    "feedback.excellent": "उत्कृष्ट",
    "feedback.placeholder": "अपन अनुभवक बारे मे बताउ...",
    "feedback.please_provide": "कृपया रेटिंग आ फीडबैक प्रदान करू",
    "feedback.thank_you": "अहाँक फीडबैक खातिर धन्यवाद! 🙏",
    "feedback.helps_improve_desc": "अहाँक फीडबैक हमर सेवा मे सुधार करै मे मदद करैत अछि",

    // Dashboard Preview
    "dashboard_preview.title": "स्मार्ट डैशबोर्ड पूर्वावलोकन",
    "dashboard_preview.subtitle": "पारदर्शी ऑर्डर प्रबंधन प्रणाली",
    "dashboard_preview.admin_dashboard": "क्विकबाइट एडमिन डैशबोर्ड",
    "dashboard_preview.pending_orders": "लंबित ऑर्डर",
    "dashboard_preview.avg_wait": "औसत प्रतीक्षा समय",
    "dashboard_preview.active_admins": "सक्रिय एडमिन",
    "dashboard_preview.set_eta": "ETA सेट करू",
    "dashboard_preview.accept": "स्वीकार करू",
    "dashboard_preview.admin_control": "एडमिन पूर्ण नियंत्रण:",
    "dashboard_preview.admin_control_desc": "केवल एडमिन प्रत्येक ऑर्डरक समीक्षा कऽ बाद तैयारीक समय निर्धारित कर सकैत छथि। छात्र सभक सटीक पिकअप समय सँ सूचित कएल जाइत अछि!",

    // How It Works
    "how_it_works.title": "ई कहिने काम करैत अछि",
    "how_it_works.subtitle": "इंतजार किए बिना अपन भोजन पाबैक लेल सरल कदम",

    // Features
    "features.title": "फीचर्स हाइलाइट्स",
    "features.subtitle": "एक सहज भोजन ऑर्डरिंग अनुभव खातिर अहाँक जे किछु चाही",

    // Testimonials
    "testimonials.title": "हमर उपयोगकर्ता की कहैत छथि",
    "testimonials.subtitle": "छात्र सभ आ एडमिन सँ वास्तविक फीडबैक",
    "testimonial.priya.name": "Priya Sharma",
    "testimonial.priya.role": "Computer Science Student",
    "testimonial.priya.content": "प्रक्रिया कतना तेज़ आ सुचारू छल, ई पसंद आएल! अब लंच ब्रेक के दौरान लाइन में खड़ा होए के जरूरत नहि।",
    "testimonial.rahul.name": "Rahul Patel",
    "testimonial.rahul.role": "Engineering Student",
    "testimonial.rahul.content": "ब्रेक के दौरान व्यस्त छात्र सभक लेल बिल्कुल सही। हम कक्षा सभक बीच ऑर्डर कर सकैत छी आ सुविधाजनक समय पर ले सकैत छी।",
    "testimonial.anita.name": "Anita Singh",
    "testimonial.anita.role": "MBA Student",
    "testimonial.anita.content": "अब लाइन में खड़ा होए के जरूरत नहि। बेहतरीन अनुभव! सूचना सभ बहुत मददगार छथि।",
    "testimonial.admin.name": "Admin Team",
    "testimonial.admin.role": "Canteen Management",
    "testimonial.admin.content": "ऑर्डर प्रबंधित करबा आ यथार्थवादी तैयारी समय निर्धारित करबा आसान अछि। छात्र सभक पारदर्शिता पसंद अछि!",

    // FAQ
    "faq.title": "अक्सर पूछल जाए वाला प्रश्न",
    "faq.subtitle": "क्विकबाइटक बारे मे अहाँक जे किछु जानबाक चाही",

    // CTA
    "cta.title": "कतार छोड़बाक लेल तैयार छी?",
    "cta.subtitle": "सैकड़ों छात्र सभ मे शामिल होऊ जे पहिने सँ परेशानी मुक्त भोजन ऑर्डरिंगक आनंद ले रहल छथि",

    // Footer
    "footer.tagline": "सभी खातिर कॉलेज डाइनिंग कऽ तेज आ अधिक सुविधाजनक बनाबैत।",
    "footer.campus_project": "कॉलेज कैंपस प्रोजेक्ट",
    "footer.quick_links": "त्वरित लिंक",
    "footer.home": "घर",
    "footer.login": "लॉगिन",
    "footer.admin_login": "एडमिन लॉगिन",
    "footer.menu": "मेन्यू",
    "footer.contact": "संपर्क",
    "footer.contact_title": "संपर्क",
    "footer.follow_us": "हमरा फॉलो करू",
    "footer.built_for_students": "छात्र सभ खातिर ❤️ सँ बनाएल गेल",
    "footer.copyright": "© 2025 क्विकबाइट। सभ अधिकार सुरक्षित। कॉलेज छात्र सभ खातिर ❤️ सँ बनाएल गेल।",

    // Cart Additional
    "cart.items_count": "आइटम",
    "cart.items_count_plural": "आइटम",
    "cart.student": "छात्र",
    "cart.subtotal_label": "उप-योग:",
    "cart.empty_cart": "कार्ट खाली अछि! 🛒",
    "cart.add_items_first": "पहिने अपन कार्ट मे किछु आइटम जोड़ू",
    "cart.not_authenticated": "प्रमाणित नहि",
    "cart.please_login": "कृपया ऑर्डर देबाक लेल लॉगिन करू",
    "cart.order_placed": "🎉 ऑर्डर सफलतापूर्वक देल गेल!",
    "cart.order_sent": "रसोई मे भेजल गेल अछि। तैयार होबाक बाद अहाँक सूचित कएल जाएत।",
    "cart.order_failed": "ऑर्डर विफल ❌",
    "cart.failed_desc": "ऑर्डर देब मे विफल। कृपया पुनः प्रयास करू।",

    // Features
    "features.secure_login": "सुरक्षित लॉगिन",
    "features.secure_login_desc": "ऑर्डर करबाक पहिने सुरक्षित प्रमाणीकरण",
    "features.one_click": "वन-क्लिक ऑर्डरिंग",
    "features.one_click_desc": "किछु क्लिक सँ त्वरित आ आसान भोजन ऑर्डरिंग",
    "features.admin_control": "एडमिन नियंत्रण",
    "features.admin_control_desc": "एडमिन-नियंत्रित भोजन स्थिति अपडेट आ समय प्रबंधन",
    "features.live_notifications": "लाइव सूचना",
    "features.live_notifications_desc": "जखन अहाँक भोजन पिकअपक लेल तैयार होए त रियल-टाइम अपडेट",

    // Steps
    "steps.signup.title": "साइन अप या लॉग इन करू",
    "steps.signup.desc": "ऑर्डरिंग सिस्टम तक पहुँचबाक लेल अपन खाता बनाउ या लॉग इन करू",
    "steps.browse.title": "मेन्यू ब्राउज़ करू आ आइटम जोड़ू",
    "steps.browse.desc": "हमर स्वादिष्ट मेन्यू देखू आ अपन पसंदीदा आइटम कार्ट मे जोड़ू",
    "steps.confirm.title": "ऑर्डरक पुष्टि करू",
    "steps.confirm.desc": "अपन ऑर्डरक समीक्षा करू आ एडमिन पुष्टिक लेल सबमिट करू",
    "steps.admin.title": "एडमिन स्थिति अपडेट करैत",
    "steps.admin.desc": "एडमिन समीक्षा करैत, ऑर्डर स्वीकार करैत आ तैयारीक समय निर्धारित करैत",
    "steps.notify.title": "सूचना पाबू",
    "steps.notify.desc": "जखन अहाँक भोजन पिकअपक लेल तैयार होए त सूचना पाबू",

    // Team Members
    "team.chef_ramesh.name": "शेफ रमेश",
    "team.chef_ramesh.role": "हेड शेफ",
    "team.chef_ramesh.experience": "2015 सँ छात्र सभक सेवा कऽ रहल छथि",
    "team.chef_ramesh.specialty": "उत्तर भारतीय व्यंजन",
    "team.admin_priya.name": "एडमिन प्रिया",
    "team.admin_priya.role": "ऑर्डर मैनेजर",
    "team.admin_priya.experience": "हर ऑर्डरक पुष्टि खुद करैत अछि",
    "team.admin_priya.specialty": "ग्राहक सेवा",
    "team.chef_sunita.name": "शेफ सुनीता",
    "team.chef_sunita.role": "दक्षिण भारतीय विशेषज्ञ",
    "team.chef_sunita.experience": "डोसा आ इडली मे विशेषज्ञ",
    "team.chef_sunita.specialty": "दक्षिण भारतीय व्यंजन",

    // Fun Facts
    "facts.orders_served": "हमनी 5,000 सँ अधिक ऑर्डर परोसल छी!",
    "facts.fastest_delivery": "हमर सबसँ तेज़ डिलीवरी 4 मिनट मे छल!",
    "facts.satisfaction": "98% ग्राहक संतुष्टि दर!",
    "facts.award": "'बेस्ट कैंपस फूड सर्विस 2024'क विजेता",

    // FAQ
    "faq.login_required.q": "की अहाँक ऑर्डर देबाक लेल लॉगिन करबाक पड़त?",
    "faq.login_required.a": "हाँ, अहाँक ऑर्डर देबाक लेल एक खाता बनाबाक आ लॉगिन करबाक पड़त। ई हमरा अहाँक ऑर्डर ट्रैक करबाक आ अहाँक सूचना भेजबाक मे मदद करैत अछि।",
    "faq.cancel_order.q": "की अहाँ ऑर्डर देबाक बाद एकरा रद्द कर सकैत छी?",
    "faq.cancel_order.a": "नहि, एक बेर एडमिन द्वारा ऑर्डरक पुष्टि होए जाएबाक बाद, एकरा रद्द नहि कएल जा सकैत। कृपया एकरा देबाक पहिने अपन ऑर्डरक सावधानी सँ समीक्षा करू।",
    "faq.who_prepares.q": "खाना कोन तैयार करैत अछि?",
    "faq.who_prepares.a": "खाना हमर प्रशिक्षित कैंटीन स्टाफ द्वारा तैयार कएल जाइत अछि जे एडमिन द्वारा नियुक्त कएल जाइत छथि। सभ स्वच्छता आ गुणवत्ता मानक कऽ बनाए राखल जाइत अछि।",
    "faq.prep_time.q": "खाना तैयार करबाक मे कतना समय लगैत अछि?",
    "faq.prep_time.a": "तैयारीक समय व्यंजन आ वर्तमान ऑर्डर वॉल्यूमक अनुसार भिन्न होइत अछि। एडमिन अहाँक ऑर्डर कऽ स्वीकार करैत समय एक अनुमानित समय निर्धारित करत।",
    "faq.payment.q": "कोन सी भुगतान विधि स्वीकार कएल जाइत अछि?",
    "faq.payment.a": "वर्तमान मे, हम पिकअपक समय नकद भुगतान स्वीकार करैत छी। डिजिटल भुगतान विकल्प जल्दी उपलब्ध होएत।",
    "faq.modify_order.q": "की अहाँ ऑर्डर देबाक बाद एकरा संशोधित कर सकैत छी?",
    "faq.modify_order.a": "सबमिट होएबाक बाद ऑर्डर संशोधन संभव नहि अछि। यदि अहाँक विशेष आवश्यकता अछि त कृपया सीधा कैंटीन स्टाफ सँ संपर्क करू।",

    // Common
    "common.free": "मुफ्त",
    "common.included": "शामिल",
    "common.minutes": "मिनट",
    "common.items": "आइटम",
    "common.item": "आइटम",
    "common.min": "मिन",
  },
  bho: {
    // Navigation
    "nav.title": "क्विकबाइट 🍽️",
    "nav.student": "छात्र लॉगिन",
    "nav.admin": "एडमिन लॉगिन",

    // Hero Section
    "hero.badge": "🚀 राउर कॉलेज कैंटीन में लाइव",
    "hero.title": "कतार छोड़ीं, खाना ना 🍔",
    "hero.subtitle": "कॉलेज कैंटीन से खाना पहिले ऑर्डर करीं, तैयार होखे पर सूचना पाईं, आ बस उठा लीं। अब लम्बा कतार में इंतजार ना!",
    "hero.cta1": "लॉगिन करीं आ ऑर्डर करीं",
    "hero.cta2": "एडमिन? इहाँ ऑर्डर मैनेज करीं",

    // Daily Specials
    "special.today": "आजु के स्पेशल",
    "special.off": "छूट",

    // Canteen Status
    "canteen.status.open": "कैंटीन अभी खुलल बा",
    "canteen.status.closed": "कैंटीन अभी बन्द बा",

    // Location
    "location.title": "हमनी के आसानी से खोजीं",
    "location.address": "ब्लॉक बी, ग्राउंड फ्लोर, कॉलेज कैंपस",

    // Feedback
    "feedback.title": "राउर पिछला खाना कइसन रहल?",
    "feedback.submit": "फीडबैक भेजीं",

    // Group Order
    "group.title": "क्लब मीटिंग या टीम खातिर ऑर्डर कर रहल बानी?",
    "group.subtitle": "ग्रुप ऑर्डरिंग अब उपलब्ध!",
    "group.cta": "ग्रुप ऑर्डर शुरू करीं",

    // Loyalty
    "loyalty.title": "हर ऑर्डर पर 1 पॉइंट कमाईं। फ्री स्नैक्स खातिर रिडीम करीं!",

    // Demo
    "demo.title": "डेमो ऑर्डर ट्राई करीं",
    "demo.subtitle": "बिना असली ऑर्डर के अनुभव टेस्ट करीं",
    "demo.activated": "डेमो मोड सक्रिय!",
    "demo.description": "ई एक डेमो ऑर्डर बा। कोनो असली खाना तैयार नइखे कइल जाई।",
    "group.coming_soon": "ग्रुप ऑर्डर फीचर जल्दी आवेला!",
    "group.coming_soon_desc": "हम बल्क ऑर्डर खातिर ई फीचर पर काम कर रहल बानी",

    // Student Dashboard
    "dashboard.greeting": "नमस्कार",
    "dashboard.question": "आज रउआ का खाए के मन बा?",
    "dashboard.search": "खाना के चीज खोजीं...",
    "dashboard.categories.all": "सब",
    "dashboard.categories.snacks": "स्नैक्स",
    "dashboard.categories.beverages": "पेय",
    "dashboard.categories.meals": "भोजन",
    "dashboard.add_to_cart": "कार्ट में डालीं",
    "dashboard.my_orders": "हमार ऑर्डर",
    "dashboard.cart": "कार्ट",
    "dashboard.logout": "लॉगआउट",
    "dashboard.added_to_cart": "कार्ट में जोड़ल गइल!",
    "dashboard.added_desc": "राउर कार्ट में जोड़ल गइल",
    "dashboard.logged_out": "सफलतापूर्वक लॉगआउट!",
    "dashboard.see_you": "फेर मिलीं",
    "dashboard.no_items": "कवनो आइटम नइखे मिलल",
    "dashboard.try_adjusting": "अपना खोज या श्रेणी फ़िल्टर के समायोजित करे के प्रयास करीं",

    // Cart
    "cart.title": "राउर कार्ट",
    "cart.empty.title": "राउर कार्ट खाली बा",
    "cart.empty.subtitle": "स्वादिष्ट भोजन खोजीं आ अपना कार्ट में डालीं!",
    "cart.empty.browse": "मेन्यू देखीं",
    "cart.order_items": "ऑर्डर आइटम",
    "cart.estimated": "अनुमानित: 10-15 मिनट",
    "cart.subtotal": "उप-योग",
    "cart.service_fee": "सेवा शुल्क",
    "cart.taxes": "कर",
    "cart.total": "कुल",
    "cart.payment_method": "भुगतान विधि",
    "cart.cash_pickup": "पिकअप पर नकद",
    "cart.estimated_time": "अनुमानित समय",
    "cart.admin_time": "एडमिन पुष्टि के बाद सटीक समय निर्धारित करी",
    "cart.place_order": "ऑर्डर करीं",
    "cart.placing_order": "ऑर्डर कर रहल बानी...",
    "cart.terms": "ई ऑर्डर करके, रउआ हमार नियम आ शर्त से सहमत बानी",
    "cart.item_removed": "आइटम हटा दिहल गइल!",
    "cart.removed_desc": "राउर कार्ट से हटा दिहल गइल बा",

    // Order Status
    "status.title": "ऑर्डर ट्रैकिंग",
    "status.subtitle": "अपना स्वादिष्ट भोजन ट्रैक करीं",
    "status.progress": "ऑर्डर प्रगति",
    "status.pending": "ऑर्डर लंबित",
    "status.pending_desc": "राउर ऑर्डर एडमिन के पुष्टि के इंतजार कर रहल बा। एह में आमतौर पर 1-2 मिनट लागेला।",
    "status.reviewing": "एडमिन राउर ऑर्डर के समीक्षा कर रहल बा...",
    "status.accepted": "ऑर्डर स्वीकार हो गइल!",
    "status.accepted_desc": "बहुत बढ़िया! राउर ऑर्डर स्वीकार हो गइल बा आ अब तैयार कइल जा रहल बा।",
    "status.estimated_time": "अनुमानित समय",
    "status.preparing": "खाना बन रहल बा",
    "status.preparing_desc": "हमार रसोइया राउर स्वादिष्ट भोजन तैयार करे में कड़ी मेहनत कर रहल बा!",
    "status.remaining": "बाकी",
    "status.ready": "🎉 ऑर्डर पिकअप खातिर तैयार!",
    "status.ready_desc": "राउर स्वादिष्ट भोजन तैयार बा! कृपया एकरा कैंटीन काउंटर से ले लीं।",
    "status.pickup_location": "पिकअप स्थान: ब्लॉक बी, ग्राउंड फ्लोर",
    "status.mark_picked": "पिक कइल गइल मार्क करीं",
    "status.complete": "ऑर्डर पूरा! 🎉",
    "status.complete_desc": "क्विकबाइट के उपयोग करे खातिर धन्यवाद! हमरा उम्मीद बा कि रउआ के अपना भोजन पसंद आइल।",
    "status.rate_experience": "अपना अनुभव रेट करीं:",
    "status.order_again": "फेर ऑर्डर करीं",
    "status.order_details": "ऑर्डर विवरण",
    "status.order_id": "ऑर्डर आईडी",
    "status.placed_at": "पर राखल गइल",
    "status.payment": "भुगतान",
    "status.need_help": "मदद चाहीं?",
    "status.call_canteen": "कैंटीन के कॉल करीं",
    "status.quick_actions": "त्वरित कार्य",
    "status.browse_menu": "मेन्यू देखीं",
    "status.order_history": "ऑर्डर इतिहास",
    "status.invalid_order": "अमान्य ऑर्डर",
    "status.order_id_missing": "ऑर्डर आईडी गायब बा",
    "status.error": "त्रुटि",
    "status.failed_load": "ऑर्डर विवरण लोड करे में विफल",
    "status.status_updated": "स्थिति अपडेट कइल गइल!",
    "status.order_complete": "ऑर्डर पूरा!",
    "status.thank_you": "क्विकबाइट के उपयोग करे खातिर धन्यवाद! कृपया अपना अनुभव रेट करीं।",
    "status.placed_by": "द्वारा राखल गइल",

    // Admin Dashboard
    "admin.title": "क्विकबाइट एडमिन 🍽️",
    "admin.manage_menu": "मेन्यू प्रबंधित करीं",
    "admin.logout": "लॉगआउट",
    "admin.order_queue": "ऑर्डर कतार 📋",
    "admin.manage_orders": "छात्र लोग से आवे वाला ऑर्डर प्रबंधित करीं",
    "admin.order_items": "ऑर्डर आइटम:",
    "admin.set_eta": "ETA सेट करीं",
    "admin.accept_order": "ऑर्डर स्वीकार करीं",
    "admin.mark_ready": "तैयार मार्क करीं",
    "admin.ready_pickup": "पिकअप खातिर तैयार",
    "admin.no_orders": "अभी तक कवनो ऑर्डर नइखे",
    "admin.orders_appear": "नया ऑर्डर इहाँ रियल-टाइम में देखाई",
    "admin.error_loading": "ऑर्डर लोड करे में त्रुटि",
    "admin.failed_fetch": "ऑर्डर प्राप्त करे में विफल। कृपया पृष्ठ के रीफ्रेश करीं।",
    "admin.new_order_received": "नया ऑर्डर प्राप्त होइल!",
    "admin.order_from": "ऑर्डर",
    "admin.from": "से",
    "admin.status_updated": "स्थिति अपडेट कइल गइल",
    "admin.status_updated_desc": "ऑर्डर स्थिति अपडेट कइल गइल। ग्राहक के सूचित कइल जाई।",
    "admin.error_updating": "अपडेट विफल",
    "admin.error_updating_desc": "ऑर्डर स्थिति अपडेट करे में विफल",
    "admin.set_eta_first": "कृपया पहिले ETA सेट करीं!",
    "admin.set_eta_first_desc": "ऑर्डर स्वीकार करे से पहिले राउर अनुमानित तैयारी समय सेट करे के पड़ी",
    "admin.order_accepted": "ऑर्डर स्वीकार होइल!",
    "admin.order_accepted_desc": "ऑर्डर स्वीकार होइल बा आ ग्राहक के सूचित कइल जाई।",
    "admin.error_accepting": "ऑर्डर स्वीकार करे में त्रुटि",
    "admin.error_accepting_desc": "ऑर्डर स्वीकार करे में विफल। कृपया पुनः प्रयास करीं।",
    "admin.logged_out": "सफलतापूर्वक लॉगआउट!",
    "admin.see_you": "फेर मिलीं!",
    "admin.fill_all_fields": "कृपया सभ फ़ील्ड भरीं",
    "admin.item_added": "आइटम जोड़ल गइल!",
    "admin.added_to_menu": "मेन्यू में जोड़ल गइल बा",
    "admin.item_updated": "आइटम अपडेट कइल गइल!",
    "admin.has_been_updated": "अपडेट कइल गइल बा",
    "admin.item_deleted": "आइटम हटा दिहल गइल!",
    "admin.menu_item_removed": "मेन्यू आइटम हटा दिहल गइल बा",
    "admin.manage_menu_title": "मेन्यू प्रबंधित करीं",
    "admin.add_item": "आइटम जोड़ीं",
    "admin.edit_item": "संपादित करीं",
    "admin.item_name": "आइटम नाम",
    "admin.item_price": "मूल्य (₹)",
    "admin.item_category": "श्रेणी",
    "admin.item_emoji": "इमोजी",
    "admin.save": "सहेजीं",
    "admin.cancel": "रद्द करीं",
    "admin.actions": "कार्रवाई",
    "admin.back_to_dashboard": "डैशबोर्ड पर वापस",
    "admin.add_new_item": "नया आइटम जोड़ीं",
    "admin.add_new_menu_item": "नया मेन्यू आइटम जोड़ीं",
    "admin.edit_menu_item": "मेन्यू आइटम संपादित करीं",
    "admin.update_item": "आइटम अपडेट करीं",
    "admin.select_category": "श्रेणी चुनीं",

    // Login
    "login.title": "क्विकबाइट में राउर स्वागत बा 🍽️",
    "login.student_title": "छात्र लॉगिन",
    "login.admin_title": "एडमिन लॉगिन - क्विकबाइट",
    "login.email": "ईमेल",
    "login.password": "पासवर्ड",
    "login.login": "लॉगिन",
    "login.logging_in": "लॉगिन हो रहल बा...",
    "login.logging_you_in": "राउर लॉगिन कइल जा रहल बा...",
    "login.demo_credentials": "डेमो क्रेडेंशियल भरीं",
    "login.demo_info": "डेमो क्रेडेंशियल:",
    "login.back_home": "घर वापस",
    "login.welcome_back": "वापसी पर स्वागत!",
    "login.login_to_order": "अपना पसंदीदा भोजन ऑर्डर करे खातिर लॉगिन करीं",
    "login.email_placeholder": "john@example.com",
    "login.password_placeholder": "अपना पासवर्ड दर्ज करीं",
    "login.admin_email_placeholder": "admin@example.com",
    "login.admin_only": "केवल एडमिन ई क्षेत्र तक पहुँच सकेला",
    "login.no_account": "खाता नइखे?",
    "login.register_here": "इहाँ रजिस्टर करीं",
    "login.success": "लॉगिन सफल! 🎉",
    "login.welcome_back_msg": "वापसी पर स्वागत!",
    "login.welcome_admin": "स्वागत बा, एडमिन!",
    "login.failed": "लॉगिन विफल ❌",
    "login.invalid_credentials": "अमान्य क्रेडेंशियल",
    "login.access_denied": "पहुँच अस्वीकृत",
    "login.not_admin": "रउआ एक एडमिन नइखीं।",

    // Hero Section Additional
    "hero.long_queue": "लम्बा कतार",
    "hero.students_waiting": "कतार में इंतजार कर रहल छात्र",
    "hero.quick_pickup": "त्वरित पिकअप",
    "hero.happy_student": "खाना के साथ खुश छात्र",
    "hero.how_to_order": "कइसे ऑर्डर करीं",

    // Location Additional
    "location.map_coming_soon": "इंटरैक्टिव मानचित्र जल्दी आवेला",
    "location.map_integration": "Google Maps एकीकरण इहाँ जोड़ल जाई",
    "location.block_b": "ब्लॉक बी, ग्राउंड फ्लोर",
    "location.main_campus": "मुख्य कैंपस भवन",
    "location.open_hours": "खुलल घंटा",
    "location.hours": "सुबह 8:00 - रात 8:00",

    // Stats
    "stats.title": "लाइव स्टैट्स",
    "stats.subtitle": "हमार कैंटीन सिस्टम से रियल-टाइम डेटा",
    "stats.total_orders": "आजु परोसल गइल कुल ऑर्डर",
    "stats.active_admins": "सक्रिय एडमिन",
    "stats.avg_prep_time": "औसत तैयारी समय",

    // Team
    "team.title": "हमार टीम से मिलीं",
    "team.subtitle": "ओ लोग जे राउर भोजन के अनुभव के अद्भुत बनावेला",

    // Top Picks
    "picks.title": "टॉप पिक्स",
    "picks.subtitle": "छात्र लोग के बीच सबसे लोकप्रिय व्यंजन",
    "picks.popular": "लोकप्रिय",
    "picks.login_to_order": "ऑर्डर करे खातिर लॉगिन करीं",
    // Food Items
    "food.chicken_biryani": "चिकन बिरयानी",
    "food.masala_dosa": "मसाला डोसा",
    "food.paneer_butter_masala": "पनीर बटर मसाला",
    "food.cold_coffee": "कोल्ड कॉफी",
    "food.veg_burger": "वेज बर्गर",
    "food.fresh_juice": "ताजा जूस",
    "food.paneer_wrap": "पनीर रैप",
    "food.veg_thali": "वेज थाली",
    "food.burger": "बर्गर",
    "food.french_fries": "फ्रेंच फ्राइज़",
    "food.samosa": "समोसा",
    "food.mango_juice": "आम के जूस",

    // Loyalty Additional
    "loyalty.program": "लॉयल्टी प्रोग्राम",
    "loyalty.order_point": "ऑर्डर = 1 पॉइंट",
    "loyalty.coming_soon": "जल्दी आवेला!",

    // Fun Facts
    "facts.title": "मजेदार तथ्य",
    "facts.subtitle": "का रउआ जानीं?",

    // Feedback Additional
    "feedback.helps_improve": "राउर फीडबैक हमरा सुधारे में मदद करेला",
    "feedback.rate_experience": "अपना अनुभव रेट करीं:",
    "feedback.poor": "खराब",
    "feedback.okay": "ठीक",
    "feedback.good": "निक",
    "feedback.excellent": "उत्कृष्ट",
    "feedback.placeholder": "अपना अनुभव के बारे में बताईं...",
    "feedback.please_provide": "कृपया रेटिंग आ फीडबैक प्रदान करीं",
    "feedback.thank_you": "राउर फीडबैक खातिर धन्यवाद! 🙏",
    "feedback.helps_improve_desc": "राउर फीडबैक हमार सेवा में सुधार करे में मदद करेला",

    // Dashboard Preview
    "dashboard_preview.title": "स्मार्ट डैशबोर्ड पूर्वावलोकन",
    "dashboard_preview.subtitle": "पारदर्शी ऑर्डर प्रबंधन प्रणाली",
    "dashboard_preview.admin_dashboard": "क्विकबाइट एडमिन डैशबोर्ड",
    "dashboard_preview.pending_orders": "लंबित ऑर्डर",
    "dashboard_preview.avg_wait": "औसत प्रतीक्षा समय",
    "dashboard_preview.active_admins": "सक्रिय एडमिन",
    "dashboard_preview.set_eta": "ETA सेट करीं",
    "dashboard_preview.accept": "स्वीकार करीं",
    "dashboard_preview.admin_control": "एडमिन पूर्ण नियंत्रण:",
    "dashboard_preview.admin_control_desc": "केवल एडमिन प्रत्येक ऑर्डर के समीक्षा के बाद तैयारी के समय निर्धारित कर सकेला। छात्र लोग के सटीक पिकअप समय से सूचित कइल जाई!",

    // How It Works
    "how_it_works.title": "ई कइसे काम करेला",
    "how_it_works.subtitle": "इंतजार किए बिना अपना भोजन पाबे खातिर सरल कदम",

    // Features
    "features.title": "फीचर्स हाइलाइट्स",
    "features.subtitle": "एक सहज भोजन ऑर्डरिंग अनुभव खातिर राउर जे कुछ चाहीं",

    // Testimonials
    "testimonials.title": "हमार उपयोगकर्ता का कहेला",
    "testimonials.subtitle": "छात्र लोग आ एडमिन से वास्तविक फीडबैक",
    "testimonial.priya.name": "Priya Sharma",
    "testimonial.priya.role": "Computer Science Student",
    "testimonial.priya.content": "प्रक्रिया कतना तेज़ आ सुचारू रहल, ई पसंद आइल! अब लंच ब्रेक के दौरान लाइन में खड़ा होए के जरूरत नइखे।",
    "testimonial.rahul.name": "Rahul Patel",
    "testimonial.rahul.role": "Engineering Student",
    "testimonial.rahul.content": "ब्रेक के दौरान व्यस्त छात्र लोग के खातिर बिल्कुल सही। हम कक्षा लोग के बीच ऑर्डर कर सकेला आ सुविधाजनक समय पर ले सकेला।",
    "testimonial.anita.name": "Anita Singh",
    "testimonial.anita.role": "MBA Student",
    "testimonial.anita.content": "अब लाइन में खड़ा होए के जरूरत नइखे। बेहतरीन अनुभव! सूचना लोग बहुत मददगार बा।",
    "testimonial.admin.name": "Admin Team",
    "testimonial.admin.role": "Canteen Management",
    "testimonial.admin.content": "ऑर्डर प्रबंधित करेला आ यथार्थवादी तैयारी समय निर्धारित करेला आसान बा। छात्र लोग के पारदर्शिता पसंद बा!",

    // FAQ
    "faq.title": "अक्सर पूछल जाए वाला प्रश्न",
    "faq.subtitle": "क्विकबाइट के बारे में राउर जे कुछ जानबाक चाहीं",

    // CTA
    "cta.title": "कतार छोड़े खातिर तैयार बानी?",
    "cta.subtitle": "सैकड़ों छात्र लोग में शामिल होईं जे पहिले से परेशानी मुक्त भोजन ऑर्डरिंग के आनंद ले रहल बानी",

    // Footer
    "footer.tagline": "सभी खातिर कॉलेज डाइनिंग के तेज आ अधिक सुविधाजनक बनावेला।",
    "footer.campus_project": "कॉलेज कैंपस प्रोजेक्ट",
    "footer.quick_links": "त्वरित लिंक",
    "footer.home": "घर",
    "footer.login": "लॉगिन",
    "footer.admin_login": "एडमिन लॉगिन",
    "footer.menu": "मेन्यू",
    "footer.contact": "संपर्क",
    "footer.contact_title": "संपर्क",
    "footer.follow_us": "हमरा फॉलो करीं",
    "footer.built_for_students": "छात्र लोग खातिर ❤️ से बनाएल गइल",
    "footer.copyright": "© 2025 क्विकबाइट। सभ अधिकार सुरक्षित। कॉलेज छात्र लोग खातिर ❤️ से बनाएल गइल।",

    // Cart Additional
    "cart.items_count": "आइटम",
    "cart.items_count_plural": "आइटम",
    "cart.student": "छात्र",
    "cart.subtotal_label": "उप-योग:",
    "cart.empty_cart": "कार्ट खाली बा! 🛒",
    "cart.add_items_first": "पहिले अपना कार्ट में कुछ आइटम जोड़ीं",
    "cart.not_authenticated": "प्रमाणित नइखे",
    "cart.please_login": "कृपया ऑर्डर देखातिर लॉगिन करीं",
    "cart.order_placed": "🎉 ऑर्डर सफलतापूर्वक देल गइल!",
    "cart.order_sent": "रसोई में भेजल गइल बा। तैयार होखे पर राउर सूचित कइल जाई।",
    "cart.order_failed": "ऑर्डर विफल ❌",
    "cart.failed_desc": "ऑर्डर देबे में विफल। कृपया पुनः प्रयास करीं।",

    // Features
    "features.secure_login": "सुरक्षित लॉगिन",
    "features.secure_login_desc": "ऑर्डर करे से पहिले सुरक्षित प्रमाणीकरण",
    "features.one_click": "वन-क्लिक ऑर्डरिंग",
    "features.one_click_desc": "कुछ क्लिक से त्वरित आ आसान भोजन ऑर्डरिंग",
    "features.admin_control": "एडमिन नियंत्रण",
    "features.admin_control_desc": "एडमिन-नियंत्रित भोजन स्थिति अपडेट आ समय प्रबंधन",
    "features.live_notifications": "लाइव सूचना",
    "features.live_notifications_desc": "जखन राउर भोजन पिकअप खातिर तैयार होखे त रियल-टाइम अपडेट",

    // Steps
    "steps.signup.title": "साइन अप या लॉग इन करीं",
    "steps.signup.desc": "ऑर्डरिंग सिस्टम तक पहुँचे खातिर अपना खाता बनाईं या लॉग इन करीं",
    "steps.browse.title": "मेन्यू ब्राउज़ करीं आ आइटम जोड़ीं",
    "steps.browse.desc": "हमार स्वादिष्ट मेन्यू देखीं आ अपना पसंदीदा आइटम कार्ट में जोड़ीं",
    "steps.confirm.title": "ऑर्डर के पुष्टि करीं",
    "steps.confirm.desc": "अपना ऑर्डर के समीक्षा करीं आ एडमिन पुष्टि खातिर सबमिट करीं",
    "steps.admin.title": "एडमिन स्थिति अपडेट करेला",
    "steps.admin.desc": "एडमिन समीक्षा करेला, ऑर्डर स्वीकार करेला आ तैयारी के समय निर्धारित करेला",
    "steps.notify.title": "सूचना पाईं",
    "steps.notify.desc": "जखन राउर भोजन पिकअप खातिर तैयार होखे त सूचना पाईं",

    // Team Members
    "team.chef_ramesh.name": "शेफ रमेश",
    "team.chef_ramesh.role": "हेड शेफ",
    "team.chef_ramesh.experience": "2015 से छात्र लोग के सेवा कर रहल बा",
    "team.chef_ramesh.specialty": "उत्तर भारतीय व्यंजन",
    "team.admin_priya.name": "एडमिन प्रिया",
    "team.admin_priya.role": "ऑर्डर मैनेजर",
    "team.admin_priya.experience": "हर ऑर्डर के पुष्टि खुद करेला",
    "team.admin_priya.specialty": "ग्राहक सेवा",
    "team.chef_sunita.name": "शेफ सुनीता",
    "team.chef_sunita.role": "दक्षिण भारतीय विशेषज्ञ",
    "team.chef_sunita.experience": "डोसा आ इडली में विशेषज्ञ",
    "team.chef_sunita.specialty": "दक्षिण भारतीय व्यंजन",

    // Fun Facts
    "facts.orders_served": "हमनी 5,000 से अधिक ऑर्डर परोसल बा!",
    "facts.fastest_delivery": "हमार सबसे तेज़ डिलीवरी 4 मिनट में रहल!",
    "facts.satisfaction": "98% ग्राहक संतुष्टि दर!",
    "facts.award": "'बेस्ट कैंपस फूड सर्विस 2024' के विजेता",

    // FAQ
    "faq.login_required.q": "का राउर ऑर्डर देखातिर लॉगिन करे के पड़ी?",
    "faq.login_required.a": "हाँ, राउर ऑर्डर देखातिर एक खाता बनाए के आ लॉगिन करे के पड़ी। ई हमरा राउर ऑर्डर ट्रैक करे में आ राउर सूचना भेजे में मदद करेला।",
    "faq.cancel_order.q": "का रउआ ऑर्डर देखे के बाद एकरा रद्द कर सकेला?",
    "faq.cancel_order.a": "ना, एक बेर एडमिन द्वारा ऑर्डर के पुष्टि होखे जाए के बाद, एकरा रद्द नइखे कइल जा सकेला। कृपया एकरा देखे से पहिले अपना ऑर्डर के सावधानी से समीक्षा करीं।",
    "faq.who_prepares.q": "खाना के तैयार करेला?",
    "faq.who_prepares.a": "खाना हमार प्रशिक्षित कैंटीन स्टाफ द्वारा तैयार कइल जाई जे एडमिन द्वारा नियुक्त कइल जाई। सभ स्वच्छता आ गुणवत्ता मानक के बनाए राखल जाई।",
    "faq.prep_time.q": "खाना तैयार करे में कतना समय लागेला?",
    "faq.prep_time.a": "तैयारी के समय व्यंजन आ वर्तमान ऑर्डर वॉल्यूम के अनुसार भिन्न होखेला। एडमिन राउर ऑर्डर के स्वीकार करेला समय एक अनुमानित समय निर्धारित करी।",
    "faq.payment.q": "कोन सी भुगतान विधि स्वीकार कइल जाई?",
    "faq.payment.a": "वर्तमान में, हम पिकअप के समय नकद भुगतान स्वीकार करेला। डिजिटल भुगतान विकल्प जल्दी उपलब्ध होखी।",
    "faq.modify_order.q": "का रउआ ऑर्डर देखे के बाद एकरा संशोधित कर सकेला?",
    "faq.modify_order.a": "सबमिट होखे के बाद ऑर्डर संशोधन संभव नइखे। यदि राउर विशेष आवश्यकता बा त कृपया सीधा कैंटीन स्टाफ से संपर्क करीं।",

    // Common
    "common.free": "मुफ्त",
    "common.included": "शामिल",
    "common.minutes": "मिनट",
    "common.items": "आइटम",
    "common.item": "आइटम",
    "common.min": "मिन",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("quickbite_language") as Language
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("quickbite_language", language)
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[Language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
