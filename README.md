# NextCart AI – Full Stack E-Commerce Platform

A modern, production-ready MERN (MongoDB, Express, React, Node.js) e-commerce platform with AI-powered recommendations and advanced features.

## 🚀 Features

- **Authentication & Authorization**: JWT-based secure authentication with RBAC (Role-Based Access Control)
- **Product Management**: Browse, search, and filter products by categories
- **Shopping Cart**: Add/remove products with persistent cart state
- **Order Management**: Complete order workflow with order tracking
- **Recently Viewed**: Track and display user's recently viewed products
- **AI Recommendations**: Smart product recommendations based on user behavior
- **Coupon System**: Apply discount codes to orders
- **Inventory Management**: Real-time stock tracking and updates
- **Email Notifications**: Order confirmations and status updates
- **Sales Dashboard**: Analytics and sales insights for admins

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite v4.3.9 (Fast HMR development)
- **Tailwind CSS 3** for styling
- **Redux Toolkit** for state management
- **React Router v6** for navigation
- **Axios** for HTTP requests
- **React Hook Form** for form handling
- **React Toastify** for notifications

### Backend
- **Node.js 18+** with Express.js v4.18.2
- **MongoDB** with Mongoose v7.2.0 ODM
- **JWT** for authentication (1h access tokens, 7d refresh tokens)
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests
- **Nodemon** for development

## 📋 Prerequisites

- Node.js v18+ and npm v9+
- MongoDB Atlas account (free M0 cluster)
- Git

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd E_commerce_website
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on: `http://localhost:5173`

### 3. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend will run on: `http://localhost:5000`

### 4. Environment Variables

**Frontend** (`frontend/.env.local`):
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=NextCart AI
```

**Backend** (`backend/.env.local`):
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://nextcart_user:PASSWORD@cluster0.mongodb.net/nextcart?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
FRONTEND_URL=http://localhost:5173
APP_NAME=NextCart AI
```

## 📊 Project Structure

### Frontend (`frontend/src/`)
```
src/
├── components/       # Reusable UI components
├── features/         # Feature-specific code (auth, products, cart, orders)
├── pages/            # Page components
├── services/         # API service calls
├── hooks/            # Custom React hooks
├── store/            # Redux store and slices
├── utils/            # Utility functions
└── assets/           # Images, fonts, static files
```

### Backend (`backend/`)
```
backend/
├── config/           # Configuration files (database, environment)
├── middleware/       # Express middleware (auth, validation, etc.)
├── models/           # MongoDB schemas (User, Product, Order, etc.)
├── controllers/      # Route controllers
├── services/         # Business logic
├── routes/           # API routes
├── validators/       # Request validation schemas
├── utils/            # Utility functions
├── tests/            # Test files
└── logs/             # Application logs
```

## 🔗 API Endpoints

### Health Check
- `GET /api/health` - Server status and uptime

### Authentication (To Be Implemented)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token

### Products (To Be Implemented)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/search` - Search products

### Cart (To Be Implemented)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add product to cart
- `DELETE /api/cart/:id` - Remove product from cart

### Orders (To Be Implemented)
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run test
```

### Backend Tests
```bash
cd backend
npm run test
```

## 📈 MongoDB Collections

The following collections are planned:
- **users** - User accounts and profiles
- **products** - Product catalog
- **categories** - Product categories
- **orders** - Customer orders
- **cart** - Shopping carts
- **reviews** - Product reviews
- **coupons** - Discount coupons
- **inventory** - Stock levels
- **recently_viewed** - User's recently viewed products
- **recommendations** - AI recommendations
- **payments** - Payment records
- **notifications** - Email notifications log
- **analytics** - Sales analytics
- **settings** - Application settings

## 🔐 Security Features

- JWT authentication with access and refresh tokens
- bcryptjs password hashing (10+ salt rounds)
- CORS protection with specific allowed origins
- Environment variables for sensitive data
- Input validation on both client and server
- Role-Based Access Control (RBAC)

## 📚 Milestones

### Milestone 1: Setup & Infrastructure ✅
- Project scaffolding
- Dependencies configuration
- Folder structure
- Configuration files
- Git initialization

### Milestone 2: Authentication System
- User registration
- Login/logout
- JWT token management
- Protected routes

### Milestone 3: Product Management
- Product catalog
- Search and filters
- Category management

### Milestone 4: Shopping Cart & Orders
- Cart management
- Order creation
- Order tracking

### Milestone 5: Advanced Features
- AI Recommendations
- Recently Viewed Products
- Coupon System
- Inventory Management
- Email Notifications

### Milestone 6: Admin Dashboard
- Sales analytics
- User management
- Product management
- Order management

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Push to Vercel
```

### Backend (Heroku/Railway)
```bash
cd backend
npm run build
# Deploy to your hosting platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see LICENSE file for details.

## 👨‍💻 Author

Saurabh Singh Yadav

## 📧 Support

For support, email: support@nextcart.ai

---

**Happy Coding!** 🎉
