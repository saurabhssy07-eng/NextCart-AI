# Folder Structure
## NextCart - Complete Project Organization

**Project Name:** NextCart  
**Version:** 2.0 (With Advanced Features)  
**Updated:** June 2026

---

## 1. Root Directory Structure

```
E_commerce_website/
├── frontend/                    # React.js + Vite application
├── backend/                     # Node.js + Express API
├── docs/                        # Project documentation
├── .gitignore
├── README.md
└── package.json                 # Root package.json for scripts
```

---

## 2. Frontend Structure (React + Vite)

```
frontend/
│
├── public/                      # Static assets (not processed by Vite)
│   ├── favicon.ico
│   ├── logo.png
│   ├── manifest.json            # PWA manifest (optional)
│   └── robots.txt
│
├── src/
│   │
│   ├── index.css                # Global styles
│   ├── App.jsx                  # Root component
│   ├── main.jsx                 # Entry point
│   │
│   ├── api/                     # API integration
│   │   ├── axiosInstance.js     # Axios config with interceptors
│   │   ├── endpoints/
│   │   │   ├── auth.js          # Auth endpoints
│   │   │   ├── products.js      # Product endpoints
│   │   │   ├── categories.js    # Category endpoints
│   │   │   ├── cart.js          # Cart endpoints
│   │   │   ├── orders.js        # Order endpoints
│   │   │   ├── users.js         # User endpoints
│   │   │   ├── reviews.js       # Review endpoints
│   │   │   ├── wishlist.js      # Wishlist endpoints
│   │   │   ├── addresses.js     # Address endpoints
│   │   │   └── admin.js         # Admin endpoints
│   │   └── helpers/
│   │       ├── errorHandler.js
│   │       ├── responseFormatter.js
│   │       └── tokenManager.js
│   │
│   ├── components/              # Reusable components (Atomic Design)
│   │   ├── atoms/               # Basic components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── Skeleton.jsx
│   │   │
│   │   ├── molecules/           # Composed components
│   │   │   ├── FormField.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ReviewCard.jsx
│   │   │   ├── AddressCard.jsx
│   │   │   ├── CartItem.jsx
│   │   │   ├── RatingStars.jsx
│   │   │   ├── PriceDisplay.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── FilterChip.jsx
│   │   │
│   │   ├── organisms/           # Complex components
│   │   │   ├── Header/
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Header.css
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Navbar.css
│   │   │   ├── Footer/
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Footer.css
│   │   │   ├── ProductGrid/
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   └── ProductGrid.css
│   │   │   ├── FilterSidebar/
│   │   │   │   ├── FilterSidebar.jsx
│   │   │   │   └── FilterSidebar.css
│   │   │   ├── CheckoutForm/
│   │   │   │   ├── CheckoutForm.jsx
│   │   │   │   └── CheckoutForm.css
│   │   │   └── AdminSidebar/
│   │   │       ├── AdminSidebar.jsx
│   │   │       └── AdminSidebar.css
│   │   │
│   │   └── templates/           # Page layouts
│   │       ├── AuthLayout.jsx
│   │       ├── MainLayout.jsx
│   │       ├── AdminLayout.jsx
│   │       └── CheckoutLayout.jsx
│   │
│   ├── features/                # Feature modules (Redux slices)
│   │   ├── auth/
│   │   │   ├── authSlice.js
│   │   │   ├── authThunks.js
│   │   │   └── authSelectors.js
│   │   ├── cart/
│   │   │   ├── cartSlice.js
│   │   │   └── cartSelectors.js
│   │   ├── wishlist/
│   │   │   ├── wishlistSlice.js
│   │   │   └── wishlistSelectors.js
│   │   ├── products/
│   │   │   ├── productsSlice.js
│   │   │   ├── productsThunks.js
│   │   │   └── productsSelectors.js
│   │   ├── orders/
│   │   │   ├── ordersSlice.js
│   │   │   ├── ordersThunks.js
│   │   │   └── ordersSelectors.js
│   │   ├── admin/
│   │   │   ├── adminSlice.js
│   │   │   ├── adminThunks.js
│   │   │   └── adminSelectors.js
│   │   └── ui/
│   │       ├── uiSlice.js
│   │       └── uiSelectors.js
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useWishlist.js
│   │   ├── useProducts.js
│   │   ├── usePagination.js
│   │   ├── useFilters.js
│   │   ├── useTheme.js
│   │   ├── useLocalStorage.js
│   │   ├── useDebounce.js
│   │   ├── useResponsive.js
│   │   └── useForm.js
│   │
│   ├── pages/                   # Page components
│   │   ├── public/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductListPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CategoryPage.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── Error500Page.jsx
│   │   │   └── TOSPage.jsx
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   └── ResetPasswordPage.jsx
│   │   ├── user/
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── AddressesPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── OrderDetailPage.jsx
│   │   │   ├── WishlistPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage/
│   │   │   │   ├── CheckoutPage.jsx
│   │   │   │   ├── StepAddress.jsx
│   │   │   │   ├── StepShipping.jsx
│   │   │   │   ├── StepPayment.jsx
│   │   │   │   └── StepReview.jsx
│   │   │   └── CheckoutSuccessPage.jsx
│   │   └── admin/
│   │       ├── AdminDashboardPage.jsx
│   │       ├── AdminProductsPage.jsx
│   │       ├── AdminProductEditPage.jsx
│   │       ├── AdminProductCreatePage.jsx
│   │       ├── AdminCategoriesPage.jsx
│   │       ├── AdminOrdersPage.jsx
│   │       ├── AdminUsersPage.jsx
│   │       ├── AdminAnalyticsPage.jsx
│   │       └── AdminSettingsPage.jsx
│   │
│   ├── services/                # Business logic services
│   │   ├── authService.js
│   │   ├── cartService.js
│   │   ├── productService.js
│   │   ├── orderService.js
│   │   ├── userService.js
│   │   ├── reviewService.js
│   │   ├── uploadService.js     # Image upload to Cloudinary
│   │   └── paymentService.js    # Razorpay integration
│   │
│   ├── store/                   # Redux store
│   │   └── index.js
│   │
│   ├── styles/                  # Global and shared styles
│   │   ├── tailwind.css         # Tailwind config
│   │   ├── variables.css        # CSS variables
│   │   ├── animations.css       # Global animations
│   │   ├── dark-mode.css        # Dark mode styles
│   │   └── utilities.css        # Utility classes
│   │
│   ├── utils/                   # Utility functions
│   │   ├── constants.js         # App constants, API URLs
│   │   ├── validators.js        # Input validation functions
│   │   ├── formatters.js        # Data formatting functions
│   │   ├── errorMessages.js     # Error message constants
│   │   ├── localStorage.js      # localStorage wrapper
│   │   ├── notification.js      # Toast/notification helper
│   │   ├── api-helpers.js       # API response parsing
│   │   ├── storage.js           # Cloudinary helpers
│   │   └── time.js              # Time/date utilities
│   │
│   ├── context/                 # Context API (if used)
│   │   ├── ThemeContext.jsx     # Theme provider
│   │   ├── AuthContext.jsx      # Auth provider (optional, Redux replaces this)
│   │   └── NotificationContext.jsx
│   │
│   ├── middleware/              # Custom middleware
│   │   ├── authMiddleware.js    # Protected route middleware
│   │   ├── adminMiddleware.js   # Admin route middleware
│   │   └── errorBoundary.jsx    # Error boundary component
│   │
│   ├── assets/                  # Images, icons, fonts
│   │   ├── images/
│   │   │   ├── logo.png
│   │   │   ├── hero-banner.jpg
│   │   │   └── placeholder.png
│   │   ├── icons/
│   │   │   ├── cart.svg
│   │   │   ├── heart.svg
│   │   │   └── menu.svg
│   │   └── fonts/
│   │       └── fonts.css
│   │
│   ├── __tests__/               # Test files
│   │   ├── unit/
│   │   ├── integration/
│   │   ├── e2e/
│   │   └── fixtures/
│   │
│   └── config/
│       ├── routes.jsx           # Route configuration
│       └── theme.js             # Theme configuration
│
├── .env.example                 # Example env variables
├── .env.local                   # Local env variables (git ignored)
├── .eslintrc.cjs               # ESLint config
├── .prettierrc                  # Prettier config
├── index.html                   # HTML template
├── package.json
├── package-lock.json
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── vite.config.js               # Vite configuration
└── README.md
```

---

## 3. Backend Structure (Node.js + Express)

```
backend/
│
├── config/                      # Configuration files
│   ├── database.js              # MongoDB connection setup
│   ├── cloudinary.js            # Cloudinary configuration
│   ├── razorpay.js              # Razorpay configuration
│   ├── email.js                 # Email service configuration
│   └── env.js                   # Environment variables validation
│
├── middleware/                  # Express middleware
│   ├── authMiddleware.js        # JWT verification
│   ├── errorHandler.js          # Global error handler
│   ├── validation.js            # Request validation (Joi)
│   ├── rateLimiter.js           # API rate limiting
│   ├── corsHandler.js           # CORS configuration
│   ├── requestLogger.js         # Request/response logging
│   ├── adminAuth.js             # Admin role check
│   └── upload.js                # File upload middleware
│
├── models/                      # Mongoose schemas
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Cart.js
│   ├── Order.js
│   ├── Review.js
│   ├── Wishlist.js
│   ├── Address.js
│   ├── Payment.js
│   ├── Coupon.js
│   └── Analytics.js
│
├── controllers/                 # Route controllers
│   ├── authController.js        # Auth endpoints
│   ├── productController.js     # Product endpoints
│   ├── categoryController.js    # Category endpoints
│   ├── cartController.js        # Cart endpoints
│   ├── orderController.js       # Order endpoints
│   ├── reviewController.js      # Review endpoints
│   ├── userController.js        # User endpoints
│   ├── wishlistController.js    # Wishlist endpoints
│   ├── addressController.js     # Address endpoints
│   ├── paymentController.js     # Payment endpoints
│   ├── couponController.js      # Coupon endpoints
│   └── adminController.js       # Admin endpoints
│
├── services/                    # Business logic layer
│   ├── authService.js           # Auth business logic
│   │   ├── register()
│   │   ├── login()
│   │   ├── generateTokens()
│   │   └── verifyToken()
│   ├── emailService.js          # Email sending
│   │   ├── sendWelcomeEmail()
│   │   ├── sendOrderConfirmation()
│   │   └── sendPasswordReset()
│   ├── paymentService.js        # Payment processing
│   │   ├── createPaymentOrder()
│   │   ├── verifyPayment()
│   │   └── refundPayment()
│   ├── imageService.js          # Cloudinary integration
│   │   ├── uploadImage()
│   │   ├── deleteImage()
│   │   └── optimizeImage()
│   ├── orderService.js          # Order processing
│   │   ├── createOrder()
│   │   ├── updateOrderStatus()
│   │   └── processRefund()
│   ├── productService.js        # Product operations
│   │   ├── getProducts()
│   │   ├── searchProducts()
│   │   └── updateProductRating()
│   ├── cartService.js           # Cart operations
│   │   ├── addToCart()
│   │   ├── updateCart()
│   │   └── calculateTotal()
│   ├── userService.js           # User operations
│   ├── reviewService.js         # Review operations
│   ├── wishlistService.js       # Wishlist operations
│   └── analyticsService.js      # Analytics & reporting
│
├── routes/                      # API routes
│   ├── auth.js                  # /api/auth/*
│   ├── products.js              # /api/products/*
│   ├── categories.js            # /api/categories/*
│   ├── cart.js                  # /api/cart/*
│   ├── orders.js                # /api/orders/*
│   ├── reviews.js               # /api/reviews/*
│   ├── users.js                 # /api/users/*
│   ├── wishlist.js              # /api/wishlist/*
│   ├── addresses.js             # /api/addresses/*
│   ├── payments.js              # /api/payments/*
│   ├── coupons.js               # /api/coupons/*
│   └── admin.js                 # /api/admin/*
│
├── validators/                  # Request validation schemas
│   ├── authValidator.js
│   │   ├── registerSchema
│   │   └── loginSchema
│   ├── productValidator.js
│   ├── orderValidator.js
│   ├── reviewValidator.js
│   ├── userValidator.js
│   └── couponValidator.js
│
├── utils/                       # Utility functions
│   ├── errorHandler.js          # Custom error classes
│   │   ├── ValidationError
│   │   ├── AuthenticationError
│   │   ├── AuthorizationError
│   │   └── NotFoundError
│   ├── logger.js                # Logging utility
│   │   ├── info()
│   │   ├── error()
│   │   ├── warn()
│   │   └── debug()
│   ├── helpers.js               # General helpers
│   │   ├── generateOrderId()
│   │   ├── calculateTax()
│   │   └── formatResponse()
│   ├── constants.js             # App constants
│   └── validators.js            # Reusable validators
│
├── tests/                       # Test files
│   ├── unit/
│   │   ├── authService.test.js
│   │   ├── productService.test.js
│   │   └── orderService.test.js
│   ├── integration/
│   │   ├── auth.integration.test.js
│   │   ├── products.integration.test.js
│   │   └── orders.integration.test.js
│   ├── e2e/
│   │   ├── checkout.e2e.test.js
│   │   └── payment.e2e.test.js
│   └── fixtures/
│       ├── users.json
│       ├── products.json
│       └── orders.json
│
├── migrations/                  # Database migrations (optional)
│   └── 001_initial_schema.js
│
├── seeds/                       # Database seeds (optional)
│   ├── seedUsers.js
│   ├── seedProducts.js
│   ├── seedCategories.js
│   └── seedAll.js
│
├── app.js                       # Express app configuration
│   ├── Middleware setup
│   ├── Routes mounting
│   ├── Error handling
│   └── Server setup
│
├── server.js                    # Entry point
│   ├── Environment validation
│   ├── Database connection
│   ├── Server start
│   └── Graceful shutdown
│
├── .env.example
├── .env                         # Git ignored
├── .eslintrc.json
├── .prettierrc
├── jest.config.js               # Jest test configuration
├── package.json
├── package-lock.json
└── README.md
```

---

## 4. Shared/Documentation Structure

```
docs/
├── API_DOCUMENTATION.md         # Complete API reference
│   ├── Authentication endpoints
│   ├── Product endpoints
│   ├── Order endpoints
│   ├── Admin endpoints
│   └── Examples for each endpoint
│
├── SETUP_GUIDE.md               # Development setup guide
│
├── DEPLOYMENT_GUIDE.md          # Deployment instructions
│   ├── Frontend deployment (Vercel)
│   ├── Backend deployment (Render)
│   └── Database setup (MongoDB Atlas)
│
├── ARCHITECTURE.md              # Architecture overview
│
├── DATABASE_SCHEMA.md           # Database documentation
│
├── CONTRIBUTING.md              # Contributing guidelines
│
├── TESTING_GUIDE.md             # Testing strategies
│
├── SECURITY.md                  # Security best practices
│
└── TROUBLESHOOTING.md           # Common issues & solutions
```

---

## 5. Typical Development Workflow

```
E_commerce_website/
├── git config
├── npm workspaces (optional, for monorepo)
│
├── Frontend Development
│   ├── npm run dev (start dev server)
│   ├── npm run build (production build)
│   └── npm run test (run tests)
│
├── Backend Development
│   ├── npm run dev (start with nodemon)
│   ├── npm run test (run tests)
│   └── npm run start (production start)
│
└── Shared Scripts
    ├── npm run setup (install all dependencies)
    ├── npm run lint (lint all code)
    ├── npm run format (format all code)
    └── npm run test (test all)
```

---

## 6. File Naming Conventions

### JavaScript/JSX Files
- Components: PascalCase (e.g., `ProductCard.jsx`)
- Hooks: camelCase prefixed with `use` (e.g., `useCart.js`)
- Services: camelCase with `Service` suffix (e.g., `authService.js`)
- Utils: camelCase (e.g., `validators.js`)

### CSS/Tailwind Files
- Global styles: kebab-case (e.g., `global-styles.css`)
- Component styles: Match component name (e.g., `ProductCard.css`)
- Tailwind: Use utility-first approach

### Configuration Files
- Kebab-case for config files (e.g., `.eslintrc`, `.prettierrc`)

---

## 7. Environment Files

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_NAME=your_cloudinary_name
VITE_APP_VERSION=1.0.0
```

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://...
JWT_SECRET=your_secret_key
JWT_EXPIRE=1h
RAZORPAY_KEY_ID=key_id
RAZORPAY_KEY_SECRET=key_secret
CLOUDINARY_NAME=name
CLOUDINARY_API_KEY=key
CLOUDINARY_API_SECRET=secret
```

---

## 8. Important Notes

1. **Separation of Concerns:** Each layer has a specific responsibility
2. **Modularity:** Components and services are independent and reusable
3. **Scalability:** Structure allows easy addition of new features
4. **Maintainability:** Clear organization aids future maintenance
5. **Testing:** Dedicated test directories for each layer
6. **Documentation:** Each major component should have comments
7. **Git Ignore:** Never commit .env, node_modules, build outputs
8. **Branch Strategy:** Use feature/bugfix/hotfix branch naming

---

## End of Folder Structure Document
