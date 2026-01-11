# 🍽️ QickBite - College Canteen Food Ordering System

A modern, full-stack food ordering application for college canteens built with Next.js, featuring real-time order management, multi-language support, and role-based access control.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-8.16-green?style=flat-square&logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-black?style=flat-square&logo=socket.io)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Project Structure](#-project-structure)
- [User Types](#-user-types)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Recent Fixes](#-recent-fixes)
- [Contributing](#-contributing)

## ✨ Features

### 🎯 Core Features
- **Multi-User System**: Support for Students, Teachers/Staff, and Admins
- **Real-Time Order Management**: Live order updates using Socket.IO
- **Multi-Language Support**: English, Hindi, Maithili, and Bhojpuri
- **Shopping Cart**: Add items, manage quantities, and place orders
- **Order Tracking**: Real-time status updates (Pending → Accepted → Preparing → Ready → Completed)
- **Order History**: View past orders with ratings and reviews
- **Review System**: Rate and review completed orders with images
- **Admin Dashboard**: Manage orders, update status, and view analytics
- **Email Notifications**: Order confirmation and status update emails
- **Image Upload**: Cloudinary integration for menu items and reviews
- **Dark Mode**: Full dark mode support
- **Responsive Design**: Mobile-first, works on all devices

### 🔐 Authentication
- Secure login with NextAuth.js
- JWT-based session management
- Password hashing with bcrypt
- Role-based access control
- Protected routes with middleware

### 📱 User Experience
- Beautiful, modern UI with Tailwind CSS
- Smooth animations and transitions
- Toast notifications for user feedback
- Loading states and error handling
- Optimistic UI updates

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Next-Auth** - Authentication library
- **Socket.IO Client** - Real-time communication

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - WebSocket server for real-time features
- **NextAuth.js** - Authentication middleware
- **bcryptjs** - Password hashing
- **Nodemailer** - Email sending
- **Cloudinary** - Image upload and management

### Infrastructure
- **Vercel** - Frontend deployment
- **Render/Railway** - Socket.IO server hosting
- **MongoDB Atlas** - Cloud database

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** or **yarn** or **pnpm**
- **MongoDB Atlas** account (or local MongoDB)
- **Cloudinary** account (for image uploads)
- **Email service** (Gmail, SendGrid, etc.)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd QickBite
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   See [Environment Variables](#-environment-variables) section for details.

4. **Initialize the database**
   ```bash
   npm run init-db
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Start the Socket.IO server** (in a separate terminal)
   ```bash
   npm run dev:socket
   ```

The application will be available at `http://localhost:3000`

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required Variables

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-minimum-32-characters

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickbite?retryWrites=true&w=majority

# Socket.IO Server (for production)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Generating NEXTAUTH_SECRET

```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Production Variables

For production deployment, update:
- `NEXTAUTH_URL` to your production URL (e.g., `https://your-app.vercel.app`)
- `NEXT_PUBLIC_SOCKET_URL` to your Socket.IO server URL
- All other variables should match your production services

## 🏃 Running the Project

### Development Mode

1. **Start Next.js development server**
   ```bash
   npm run dev
   ```

2. **Start Socket.IO server** (separate terminal)
   ```bash
   npm run dev:socket
   ```

3. **Access the application**
   - Frontend: `http://localhost:3000`
   - Socket.IO: `http://localhost:3001`

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Available Scripts

```bash
npm run dev          # Start Next.js dev server
npm run dev:socket   # Start Socket.IO server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run init-db      # Initialize database
npm run test-db      # Test database connection
```

## 📁 Project Structure

```
QickBite/
├── app/                      # Next.js App Router
│   ├── admin/               # Admin routes
│   │   ├── dashboard/       # Admin dashboard
│   │   ├── login/           # Admin login
│   │   └── menu/            # Menu management
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── orders/          # Order endpoints
│   │   ├── menu/            # Menu endpoints
│   │   └── reviews/         # Review endpoints
│   ├── student/             # Student routes
│   │   ├── dashboard/       # Student dashboard
│   │   ├── cart/            # Shopping cart
│   │   ├── orders/          # Order history
│   │   └── review/          # Review orders
│   ├── teacher/             # Teacher routes
│   │   ├── dashboard/       # Teacher dashboard
│   │   └── orders/          # Teacher orders
│   ├── login/               # Login page
│   └── register/            # Registration page
├── components/               # React components
│   ├── ui/                  # UI components (Radix UI)
│   └── providers.tsx        # Context providers
├── contexts/                # React contexts
│   ├── auth-context.tsx     # Authentication context
│   ├── cart-context.tsx     # Shopping cart context
│   └── language-context.tsx # Multi-language support
├── lib/                     # Utility libraries
│   ├── models/              # Mongoose models
│   ├── auth.ts              # Authentication utilities
│   ├── mongodb.ts           # Database connection
│   └── email.ts              # Email utilities
├── hooks/                   # Custom React hooks
│   └── useSocket.ts         # Socket.IO hook
├── middleware.ts            # Next.js middleware
├── server.js                # Socket.IO server
└── socket-server/           # Socket.IO server code
```

## 👥 User Types

### Student
- Browse menu items
- Add items to cart
- Place orders
- View order history
- Rate and review orders
- Track order status

**Routes**: `/student/dashboard`, `/student/cart`, `/student/orders`, `/student/review`

### Teacher/Staff
- Same features as students
- Uses student dashboard interface
- Separate route structure (`/teacher/*`)

**Routes**: `/teacher/dashboard`, `/teacher/orders`

### Admin
- View all orders
- Update order status
- Manage menu items
- View analytics
- Accept/reject orders

**Routes**: `/admin/dashboard`, `/admin/menu`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints
- `GET /api/auth/me` - Get current user

### Orders
- `GET /api/orders` - Get orders (user's orders or all for admin)
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order by ID
- `POST /api/orders/[id]/complete` - Mark order as completed

### Menu
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create menu item (admin)
- `GET /api/menu/[id]` - Get menu item by ID
- `GET /api/menu/most-ordered` - Get most ordered items

### Reviews
- `GET /api/reviews` - Get reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/stats` - Get review statistics

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/profile/password` - Change password

## 🚀 Deployment

### Frontend (Vercel)

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Import project to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. **Set environment variables**
   - Add all required environment variables
   - Set `NEXTAUTH_URL` to your Vercel URL
   - Set `NEXT_PUBLIC_SOCKET_URL` to your Socket.IO server URL

4. **Deploy**
   - Vercel will automatically deploy on push

### Socket.IO Server (Render/Railway)

1. **Deploy to Render**
   - Create new Web Service
   - Connect your repository
   - Set build command: `cd socket-server && npm install`
   - Set start command: `cd socket-server && node index.js`
   - Add environment variables

2. **Update frontend**
   - Set `NEXT_PUBLIC_SOCKET_URL` to your Render URL

### MongoDB Atlas

1. **Create cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster

2. **Configure**
   - Whitelist your IP addresses
   - Create database user
   - Get connection string

3. **Update environment**
   - Set `MONGODB_URI` in your deployment

### Important Notes

- **Socket.IO cannot run on Vercel** - Use Render, Railway, or similar
- **Environment variables** must be set in both Vercel and Socket.IO server
- **CORS** must be configured for Socket.IO server
- **NEXTAUTH_URL** must match your production domain exactly

See [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) for detailed deployment guide.

## 🐛 Troubleshooting

### Common Issues

#### Login not working in production
- **Check**: `NEXTAUTH_URL` matches your Vercel URL exactly
- **Check**: `NEXTAUTH_SECRET` is set and 32+ characters
- **Check**: Cookies are being set (DevTools → Application → Cookies)
- **See**: [PRODUCTION_LOGIN_FIX.md](./PRODUCTION_LOGIN_FIX.md)

#### Teacher orders not showing
- **Check**: User type is "teacher" in session
- **Check**: Orders API returns teacher's orders
- **Check**: Orders page allows teachers
- **See**: [TEACHER_ORDERS_FIX.md](./TEACHER_ORDERS_FIX.md)

#### Socket.IO connection issues
- **Check**: Socket.IO server is running
- **Check**: `NEXT_PUBLIC_SOCKET_URL` is correct
- **Check**: CORS is configured on Socket.IO server
- **See**: [SOCKET_TROUBLESHOOTING.md](./SOCKET_TROUBLESHOOTING.md)

#### Database connection errors
- **Check**: MongoDB Atlas IP whitelist
- **Check**: Connection string is correct
- **Check**: Database user has proper permissions
- **Run**: `npm run test-db` to test connection

#### Image upload not working
- **Check**: Cloudinary credentials are correct
- **Check**: API key has upload permissions
- **See**: [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)

### Debug Commands

```bash
# Test database connection
npm run test-db

# Test MongoDB configuration
npm run verify-mongodb

# Test registration endpoint
npm run test-registration

# Initialize database
npm run init-db
```

## 🔧 Recent Fixes

### Production Login Fix
- Fixed cookie configuration for production
- Added session retry logic
- Fixed redirect timing issues
- **See**: [PRODUCTION_LOGIN_FIX.md](./PRODUCTION_LOGIN_FIX.md)

### Teacher Login Fix
- Fixed teacher redirect after login
- Updated all student routes to allow teachers
- **See**: [TEACHER_LOGIN_FIX.md](./TEACHER_LOGIN_FIX.md)

### Teacher Orders Fix
- Fixed order history for teachers
- Created teacher routes (`/teacher/orders`)
- Fixed API queries for teachers
- **See**: [TEACHER_ORDERS_FIX.md](./TEACHER_ORDERS_FIX.md)

### Socket.IO Deployment
- Separated Socket.IO server
- Configured for Render/Railway deployment
- **See**: [SOCKET_DEPLOYMENT_SUMMARY.md](./SOCKET_DEPLOYMENT_SUMMARY.md)

## 📚 Additional Documentation

- [Production Deployment Guide](./PRODUCTION_DEPLOYMENT.md)
- [Socket.IO Setup](./SOCKET_IO_SETUP.md)
- [Email Setup](./EMAIL_SETUP.md)
- [Cloudinary Setup](./CLOUDINARY_SETUP.md)
- [Vercel Deployment Fix](./VERCEL_DEPLOYMENT_FIX.md)
- [Environment Variables Guide](./VERCEL_ENV_VARIABLES.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for college canteens

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB Atlas for database hosting
- Vercel for deployment platform
- All contributors and users

---

**Need Help?** Check the [Troubleshooting](#-troubleshooting) section or open an issue on GitHub.

**Happy Ordering! 🍽️**

