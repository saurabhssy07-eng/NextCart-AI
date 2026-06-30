# Project Architecture
## NextCart - Advanced E-Commerce Platform

**Project Name:** NextCart  
**Version:** 2.0 (With Advanced Features)  
**Date:** June 2026

---

## 1. Architecture Overview

### 1.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER (Browser)                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  React.js + Vite (SPA)                                       │   │
│  │  - Components                                                │   │
│  │  - Pages                                                     │   │
│  │  - Redux Store                                               │   │
│  │  - Context API                                               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Tailwind CSS + Responsive Design                            │   │
│  │  - Mobile First                                              │   │
│  │  - Dark Mode Support                                         │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
                        ┌─────────────────┐
                        │   API Gateway   │
                        │  (Express.js)   │
                        └─────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND LAYER (Node.js)                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Express.js API                                              │   │
│  │  - Routes                                                    │   │
│  │  - Controllers                                               │   │
│  │  - Middleware (Auth, Validation, Error Handling)             │   │
│  │  - Services/Business Logic                                   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Authentication Layer                                        │   │
│  │  - JWT Generation/Verification                               │   │
│  │  - Role-Based Access Control (RBAC)                          │   │
│  │  - Session Management                                        │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Data Layer (Models & Repositories)                          │   │
│  │  - Mongoose ODM                                              │   │
│  │  - Data Validation                                           │   │
│  │  - Database Queries                                          │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
    ┌─────────┐         ┌──────────┐         ┌────────────┐
    │ MongoDB │         │Cloudinary│         │  Razorpay  │
    │ (Atlas) │         │  (Media) │         │ (Payments) │
    └─────────┘         └──────────┘         └────────────┘
         ↓                    ↓                    ↓
    ┌─────────────────────────────────────────────────────┐
    │         EXTERNAL SERVICES LAYER                     │
    │  - Database (NoSQL)                                 │
    │  - Image/Media Storage                              │
    │  - Payment Processing                               │
    └─────────────────────────────────────────────────────┘
```

### 1.2 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOYMENT                        │
│                                                                 │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │  Vercel          │              │   Render.com     │        │
│  │  (Frontend SPA)  │              │ (Backend API)    │        │
│  │                  │              │                  │        │
│  │ - Auto Deploy    │              │ - Auto Deploy    │        │
│  │ - Edge Caching   │              │ - Dyno (Node)    │        │
│  │ - CDN            │              │ - Environment    │        │
│  │ - Domain         │              │ - Logs           │        │
│  └──────────────────┘              └──────────────────┘        │
│           ↓                                 ↓                   │
│           │                                 │                   │
│           └─────────┬──────────────────────┘                    │
│                     ↓                                           │
│            ┌─────────────────────┐                              │
│            │  MongoDB Atlas      │                              │
│            │  (Cloud Database)   │                              │
│            │                     │                              │
│            │ - Multi-region      │                              │
│            │ - Auto Backups      │                              │
│            │ - Performance       │                              │
│            └─────────────────────┘                              │
│                                                                 │
│            ┌─────────────────────┐                              │
│            │  Cloudinary         │                              │
│            │  (Media Management) │                              │
│            │                     │                              │
│            │ - Image Optimization│                              │
│            │ - Transformations   │                              │
│            │ - CDN Delivery      │                              │
│            └─────────────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Architecture (React + Vite)

### 2.1 Component Architecture

#### Atomic Design Pattern
```
Components/
├── Atoms (Basic, reusable)
│   ├── Button
│   ├── Input
│   ├── Badge
│   ├── Card
│   └── Loader
├── Molecules (Atom combinations)
│   ├── FormField
│   ├── ProductCard
│   ├── ReviewCard
│   ├── AddressCard
│   └── CartItem
├── Organisms (Complex components)
│   ├── Header
│   ├── Navbar
│   ├── Footer
│   ├── ProductGrid
│   ├── FilterSidebar
│   └── CheckoutForm
└── Templates (Page layouts)
    ├── AuthLayout
    ├── MainLayout
    ├── AdminLayout
    └── CheckoutLayout
```

### 2.2 State Management (Redux Toolkit)

#### Redux Store Structure
```
Store/
├── slices/
│   ├── authSlice (user, token, loading, error)
│   ├── cartSlice (items, total, discount)
│   ├── wishlistSlice (items)
│   ├── productsSlice (items, filters, pagination)
│   ├── ordersSlice (userOrders, current)
│   ├── adminSlice (stats, data, permissions)
│   └── uiSlice (theme, notifications, modals)
├── store.js (configure store)
└── hooks.js (custom hooks: useAppDispatch, useAppSelector)
```

#### Async Thunks
```
- fetchProducts
- fetchProductDetails
- fetchUserProfile
- fetchOrders
- createOrder
- updateCart
- fetchAddresses
- etc.
```

### 2.3 Routing Architecture (React Router v6)

```
Routes/
├── Public Routes
│   ├── /
│   ├── /auth/login
│   ├── /auth/register
│   ├── /auth/forgot-password
│   ├── /products
│   ├── /products/:id
│   ├── /category/:categoryId
│   └── /search
├── Protected Routes
│   ├── /profile
│   ├── /addresses
│   ├── /orders
│   ├── /orders/:id
│   ├── /wishlist
│   ├── /cart
│   └── /checkout
└── Admin Routes
    ├── /admin/dashboard
    ├── /admin/products
    ├── /admin/products/new
    ├── /admin/products/:id/edit
    ├── /admin/categories
    ├── /admin/orders
    ├── /admin/users
    └── /admin/analytics
```

### 2.4 HTTP Client Architecture

```
API/
├── axiosInstance.js (base config, interceptors)
├── endpoints/
│   ├── auth.js
│   ├── products.js
│   ├── categories.js
│   ├── cart.js
│   ├── orders.js
│   ├── users.js
│   ├── reviews.js
│   └── admin.js
└── helpers/
    ├── errorHandler.js
    ├── responseFormatter.js
    └── tokenManager.js
```

### 2.5 Custom Hooks

```
hooks/
├── useAuth.js (auth state, login, logout, register)
├── useCart.js (cart operations)
├── useWishlist.js (wishlist operations)
├── useProducts.js (fetch, filter, sort products)
├── usePagination.js (pagination logic)
├── useFilters.js (search, filter management)
├── useTheme.js (dark/light mode)
├── useLocalStorage.js (localStorage wrapper)
└── useDebounce.js (debounced search)
```

### 2.6 Utilities & Helpers

```
utils/
├── constants.js (API URLs, error messages, constants)
├── validators.js (email, password, phone validation)
├── formatters.js (currency, date, number formatting)
├── localStorage.js (wrapper for localStorage)
├── notification.js (toast notifications)
├── api-helpers.js (API response parsing)
└── storage.js (Cloudinary upload helpers)
```

---

## 3. Backend Architecture (Node.js + Express)

### 3.1 Layered Architecture

```
Backend/
├── config/
│   ├── database.js (MongoDB connection)
│   ├── cloudinary.js (Image service config)
│   ├── razorpay.js (Payment gateway config)
│   └── env.js (environment variables)
├── middleware/
│   ├── authMiddleware.js (JWT verification)
│   ├── errorHandler.js (global error handling)
│   ├── validation.js (request validation)
│   ├── rateLimiter.js (API rate limiting)
│   ├── corsHandler.js (CORS configuration)
│   └── requestLogger.js (request/response logging)
├── models/ (MongoDB schemas)
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Cart.js
│   ├── Order.js
│   ├── Review.js
│   ├── Wishlist.js
│   └── Address.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── categoryController.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── reviewController.js
│   ├── userController.js
│   ├── wishlistController.js
│   ├── addressController.js
│   └── adminController.js
├── services/
│   ├── authService.js (JWT, password hashing)
│   ├── emailService.js (email notifications)
│   ├── paymentService.js (Razorpay integration)
│   ├── imageService.js (Cloudinary operations)
│   ├── orderService.js (order processing)
│   ├── productService.js (product operations)
│   ├── couponService.js (coupon management & validation)
│   ├── inventoryService.js (inventory tracking & alerts)
│   ├── recommendationService.js (AI-powered product recommendations)
│   ├── viewedProductService.js (recently viewed products tracking)
│   └── analyticsService.js (business analytics & reporting)
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── categories.js
│   ├── cart.js
│   ├── orders.js
│   ├── reviews.js
│   ├── users.js
│   ├── wishlist.js
│   ├── addresses.js
│   ├── coupons.js (coupon endpoints)
│   ├── inventory.js (inventory management endpoints)
│   ├── recommendations.js (AI recommendation endpoints)
│   ├── viewed-products.js (recently viewed products)
│   ├── email.js (email notification endpoints)
│   └── admin.js
├── validators/
│   ├── authValidator.js (registration, login validation)
│   ├── productValidator.js
│   ├── orderValidator.js
│   ├── reviewValidator.js
│   └── userValidator.js
├── utils/
│   ├── errorHandler.js (custom error classes)
│   ├── logger.js (logging utility)
│   ├── helpers.js (utility functions)
│   ├── constants.js
│   └── validators.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── app.js (Express app setup)
├── server.js (entry point)
└── .env (environment variables)
```

### 3.2 Request-Response Flow

```
HTTP Request
    ↓
CORS Middleware
    ↓
Rate Limiter Middleware
    ↓
Request Logger Middleware
    ↓
Route Handler
    ↓
Authentication Middleware (if protected)
    ↓
Request Validation (Joi/Yup)
    ↓
Controller
    ↓
Service Layer (Business Logic)
    ↓
Database Layer (Models/Queries)
    ↓
Response Processing
    ↓
Error Handler (if error occurs)
    ↓
Response Headers + JSON
    ↓
HTTP Response
```

### 3.3 API Response Format

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

Error Response:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 3.4 Authentication Flow

```
User Registration/Login
    ↓
Validate Credentials
    ↓
Generate JWT Tokens
    - Access Token (1 hour expiry)
    - Refresh Token (7 days expiry)
    ↓
Send Tokens to Client
    ↓
Client Stores:
    - Access Token (Memory/SessionStorage)
    - Refresh Token (HttpOnly Cookie)
    ↓
Protected API Request
    ↓
Verify Access Token
    ↓
If Expired → Use Refresh Token to Get New Access Token
    ↓
Process Request
```

### 3.5 Error Handling Strategy

```
Error Types:
├── Validation Errors (400)
├── Authentication Errors (401)
├── Authorization Errors (403)
├── Not Found Errors (404)
├── Conflict Errors (409)
├── Rate Limit Errors (429)
├── Server Errors (500)
└── Service Unavailable (503)

Error Handling:
├── Input Validation (Joi schemas)
├── Try-Catch Blocks
├── Custom Error Classes
├── Global Error Handler Middleware
├── Error Logging
└── User-Friendly Error Messages
```

---

## 4. Database Architecture (MongoDB)

### 4.1 Database Collections Overview

```
E-Commerce DB
├── users
├── products
├── categories
├── carts
├── orders
├── reviews
├── wishlist
├── addresses
├── payments
└── analytics
```

### 4.2 Relationships Diagram

```
┌─────────────┐
│    User     │ (1:Many) → Orders
│             │ (1:Many) → Reviews
│             │ (1:Many) → Addresses
│             │ (1:1)   → Wishlist
│             │ (1:1)   → Cart
└─────────────┘
       ↓ (1:Many)
┌─────────────┐
│   Orders    │ (1:Many) → Order Items
│             │ (Many:1) → Payment
└─────────────┘
       ↓
┌─────────────┐      ┌──────────────┐
│ Order Items │ ←──→ │   Products   │ (Many:Many via Order Items)
└─────────────┘      └──────────────┘
                            ↓ (Many:1)
                     ┌─────────────────┐
                     │   Categories    │
                     └─────────────────┘

┌─────────────┐
│   Reviews   │ (Many:1) ← User
│             │ (Many:1) ← Product
└─────────────┘

┌──────────────┐
│   Wishlist   │ (1:1) ← User
│              │ (Many:Many) → Products
└──────────────┘

┌───────────────┐
│   Addresses   │ (Many:1) ← User
└───────────────┘
```

### 4.3 Indexing Strategy

```
Users:
  - _id (primary)
  - email (unique)
  - createdAt

Products:
  - _id (primary)
  - categoryId
  - name (text search)
  - createdAt

Orders:
  - _id (primary)
  - userId
  - status
  - createdAt

Reviews:
  - _id (primary)
  - productId
  - userId
  - createdAt

Categories:
  - _id (primary)
  - name (unique)
  - parentId

Wishlist:
  - userId (primary)
  - productIds (array)

Payments:
  - _id (primary)
  - orderId (unique)
  - status
```

---

## 5. Security Architecture

### 5.1 Authentication & Authorization

```
┌────────────────────────────────────────────────┐
│ Authentication (Who are you?)                  │
│ - Registration with email/password             │
│ - Login with credentials                       │
│ - JWT Token Generation                         │
│ - Token Refresh Mechanism                      │
│ - Logout (Token Invalidation)                  │
└────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────┐
│ Authorization (What can you do?)               │
│ - Role-Based Access Control (RBAC)             │
│   * User Role                                  │
│   * Admin Role                                 │
│   * Manager Role                               │
│ - Resource Ownership Verification              │
│ - Middleware-based Permission Checks           │
└────────────────────────────────────────────────┘
```

### 5.2 Data Security Measures

- **Password Hashing:** bcrypt (10+ rounds)
- **Transmission:** HTTPS/TLS only
- **Tokens:** Signed JWT with secret key
- **Sensitive Data:** Encrypted in database (payment info)
- **API Rate Limiting:** 100 requests/15 min per IP
- **Input Validation:** Server-side Joi schemas
- **SQL Injection Prevention:** MongoDB (no SQL), parameterized queries
- **XSS Protection:** Content Security Policy headers
- **CORS:** Whitelist specific origins
- **CSRF:** Token-based protection

---

## 6. Deployment Architecture

### 6.1 Frontend Deployment (Vercel)

```
GitHub Repository
    ↓ (Push to main)
    ↓
Vercel Auto-Deploy
    ↓
Build Process (Vite)
    ↓
Static File Generation
    ↓
CDN Distribution
    ↓
Global Edge Caching
    ↓
Production URL
```

### 6.2 Backend Deployment (Render)

```
GitHub Repository
    ↓ (Push to main)
    ↓
Render Auto-Deploy
    ↓
Install Dependencies (npm install)
    ↓
Build Process (if applicable)
    ↓
Start Service (node server.js)
    ↓
Health Check
    ↓
Production URL + Environment Variables
```

### 6.3 Database Deployment (MongoDB Atlas)

```
MongoDB Atlas Cloud
    ↓
Multi-Region Cluster
    ↓
Automatic Backups
    ↓
Performance Monitoring
    ↓
Security Controls (IP Whitelist, Auth)
    ↓
Connection String to Backend
```

---

## 7. Integration Points

### 7.1 Third-Party Integrations

```
Frontend
    ↓
Backend API (Express)
    ├── → MongoDB Atlas (Data Storage)
    ├── → Cloudinary API (Image Management)
    │   ├── Image Upload
    │   ├── Image Optimization
    │   └── CDN Delivery
    └── → Razorpay API (Payment Processing)
        ├── Create Payment Order
        ├── Verify Payment
        └── Refund Processing
```

### 7.2 Webhook Handling

```
Razorpay Payment Events
    ↓
Backend Webhook Endpoint (/api/payment/webhook)
    ↓
Verify Webhook Signature
    ↓
Update Order Status
    ↓
Update Payment Status
    ↓
Send Confirmation Email
    ↓
Update Frontend (WebSocket/Polling)
```

---

## 8. Development & Testing Architecture

### 8.1 Environment Configuration

```
.env.local (Frontend)
  - VITE_API_URL
  - VITE_CLOUDINARY_NAME
  - VITE_APP_VERSION

.env (Backend)
  - MONGODB_URI
  - JWT_SECRET
  - JWT_EXPIRE
  - RAZORPAY_KEY_ID
  - RAZORPAY_KEY_SECRET
  - CLOUDINARY_NAME
  - CLOUDINARY_API_KEY
  - CLOUDINARY_API_SECRET
  - NODE_ENV
  - PORT
```

### 8.2 Testing Strategy

```
Frontend:
  - Unit Tests (Jest + React Testing Library)
  - Component Tests
  - Integration Tests
  - E2E Tests (Cypress/Playwright)

Backend:
  - Unit Tests (Jest)
  - Integration Tests
  - API Tests (Supertest)
  - Database Tests (MongoDB Memory Server)
```

---

## 9. Monitoring & Logging

### 9.1 Frontend Monitoring

- Error Tracking (Sentry integration optional)
- Performance Metrics (Google Analytics)
- User Analytics
- Core Web Vitals

### 9.2 Backend Logging

```
Logging Levels:
  - ERROR: Critical issues
  - WARN: Warning messages
  - INFO: General information
  - DEBUG: Development debugging

Log Categories:
  - API Requests/Responses
  - Authentication Events
  - Database Operations
  - Payment Processing
  - Errors and Exceptions
  - Business Events
```

---

## 10. Performance Optimization

### 10.1 Frontend Optimization

- Code Splitting (Route-based)
- Lazy Loading (Images, Components)
- Bundle Size Optimization
- Caching Strategy
- Image Optimization (WebP, compression)
- Minification and Compression
- Tree Shaking

### 10.2 Backend Optimization

- Database Indexing
- Query Optimization
- Pagination for List Endpoints
- Caching (Redis optional for future)
- API Response Compression
- Efficient Serialization
- Connection Pooling

### 10.3 Database Optimization

- Proper Indexing Strategy
- Query Optimization
- Connection Pooling
- Data Archival Strategy
- Backup & Recovery

---

## 11. Scalability Considerations

### 11.1 Horizontal Scaling

- Stateless Backend Services
- Load Balancing (Vercel/Render handle this)
- Database Replication
- CDN for Static Assets

### 11.2 Vertical Scaling

- Upgrade Database Plans
- Increase Server Resources
- Optimize Code and Queries

### 11.3 Future Scalability

- Microservices Architecture (Phase 2)
- Message Queues (Bull, RabbitMQ)
- Caching Layer (Redis)
- Search Service (Elasticsearch)
- Real-time Features (Socket.io)

---

## Architecture Decision Records (ADRs)

### ADR-001: React + Vite for Frontend
**Decision:** Use React with Vite build tool  
**Rationale:** Fast development, rapid HMR, optimized production builds, industry standard

### ADR-002: Redux Toolkit for State Management
**Decision:** Redux Toolkit over Context API for complex state  
**Rationale:** Better DevTools, middleware support, predictable state management at scale

### ADR-003: MongoDB for Database
**Decision:** MongoDB (NoSQL) over PostgreSQL  
**Rationale:** Schema flexibility, document-based data structure, MongoDB Atlas cloud option, easier horizontal scaling

### ADR-004: JWT for Authentication
**Decision:** JWT tokens with Access + Refresh pattern  
**Rationale:** Stateless, scalable, industry standard, better for distributed systems

### ADR-005: Cloudinary for Image Storage
**Decision:** Cloudinary instead of local storage or S3  
**Rationale:** Image optimization, CDN delivery, transformation capabilities, free tier generous

### ADR-006: Vercel + Render for Deployment
**Decision:** Vercel (Frontend) + Render (Backend)  
**Rationale:** Easy GitHub integration, auto-deploy, no DevOps overhead, perfect for portfolio projects

---

## End of Architecture Document
