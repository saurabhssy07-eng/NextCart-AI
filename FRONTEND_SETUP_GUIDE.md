# NextCart AI Frontend Setup & Documentation

## Project Overview
NextCart AI is a full-stack e-commerce platform built with:
- **Frontend**: React + Vite + Redux Toolkit + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB + JWT

---

## Frontend Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create `.env.local` file:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_APP_NAME=NextCart AI
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Orders.jsx
│   │   └── OrderDetails.jsx
│   ├── services/           # API services
│   │   └── api.js
│   ├── store/              # Redux store
│   │   ├── index.js
│   │   ├── authSlice.js
│   │   ├── productSlice.js
│   │   ├── cartSlice.js
│   │   └── orderSlice.js
│   ├── hooks/              # Custom hooks (to be created)
│   ├── utils/              # Utility functions (to be created)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.local              # Environment variables
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## Key Features Implemented

### 1. **Authentication System**
- User Registration
- User Login
- JWT Token Management (Access & Refresh)
- Protected Routes
- Auto Login Check

**Files**:
- `src/pages/Login.jsx` - Login page
- `src/pages/Register.jsx` - Registration page
- `src/store/authSlice.js` - Auth state management
- `src/components/ProtectedRoute.jsx` - Route protection

### 2. **Product Management**
- Featured Products Display
- Product Details Page
- Product Search & Filtering
- Add to Cart
- Quantity Selection

**Files**:
- `src/pages/Home.jsx` - Homepage with featured products
- `src/pages/ProductDetails.jsx` - Product detail page
- `src/store/productSlice.js` - Product state

### 3. **Shopping Cart**
- View Cart Items
- Add/Remove Items
- Update Quantities
- Cart Totals & Discounts
- Clear Cart
- Apply Coupons

**Files**:
- `src/pages/Cart.jsx` - Shopping cart page
- `src/store/cartSlice.js` - Cart state management

### 4. **Checkout & Orders**
- Shipping Address Form
- Payment Method Selection
- Order Placement
- Order History
- Order Tracking
- Order Details
- Cancel Orders

**Files**:
- `src/pages/Checkout.jsx` - Checkout page
- `src/pages/Orders.jsx` - Orders list
- `src/pages/OrderDetails.jsx` - Order details page
- `src/store/orderSlice.js` - Orders state

### 5. **Navigation & Layout**
- Responsive Navbar
- Footer
- Protected Routes
- Error Handling
- Toast Notifications

**Files**:
- `src/components/Navbar.jsx` - Navigation bar
- `src/components/Footer.jsx` - Footer
- `src/App.jsx` - Main app with routing

---

## API Integration

### Service Layer (`src/services/api.js`)

The API service layer provides methods for:

#### Authentication
```javascript
authService.register(userData)
authService.login(credentials)
authService.refreshToken(refreshToken)
authService.getCurrentUser(token)
```

#### Products
```javascript
productService.getAllProducts(params)
productService.getProductById(id)
productService.getFeaturedProducts()
productService.getProductsByCategory(categoryId, params)
productService.createProduct(data, token)
productService.updateProduct(id, data, token)
productService.deleteProduct(id, token)
```

#### Categories
```javascript
categoryService.getAllCategories()
categoryService.getCategoryById(id)
categoryService.createCategory(data, token)
categoryService.updateCategory(id, data, token)
categoryService.deleteCategory(id, token)
```

#### Cart
```javascript
cartService.getCart(token)
cartService.addToCart(productId, quantity, token)
cartService.updateCartItem(productId, quantity, token)
cartService.removeFromCart(productId, token)
cartService.clearCart(token)
cartService.applyCoupon(code, discount, token)
```

#### Orders
```javascript
orderService.createOrder(data, token)
orderService.getUserOrders(params, token)
orderService.getOrderById(id, token)
orderService.cancelOrder(id, token)
orderService.getAllOrders(params, token)
orderService.updateOrderStatus(id, data, token)
```

---

## State Management (Redux)

### Auth Slice
Manages:
- User authentication state
- Access & refresh tokens
- Loading state
- Error messages

### Product Slice
Manages:
- Products list
- Featured products
- Current product
- Categories
- Loading & error states

### Cart Slice
Manages:
- Cart items
- Totals (price, discount, final)
- Coupon codes
- Loading & error states

### Order Slice
Manages:
- User orders
- Current order details
- Order status updates
- Loading & error states

---

## Routing Map

| Route | Component | Protected | Description |
|-------|-----------|-----------|-------------|
| `/` | Home | No | Homepage with featured products |
| `/login` | Login | No | User login page |
| `/register` | Register | No | User registration page |
| `/products/:id` | ProductDetails | No | Product detail page |
| `/cart` | Cart | Yes | Shopping cart |
| `/checkout` | Checkout | Yes | Checkout page |
| `/orders` | Orders | Yes | User orders list |
| `/orders/:id` | OrderDetails | Yes | Order details page |
| `*` | 404 Page | No | Page not found |

---

## Environment Variables

### `.env.local`
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=NextCart AI
```

---

## Components Overview

### Navbar.jsx
- Logo & branding
- Navigation links
- Auth status display
- Cart counter
- Mobile responsive menu
- User dropdown (when logged in)

### Footer.jsx
- Company info
- Quick links
- Customer service links
- Social media links
- Legal links

### ProtectedRoute.jsx
- Route protection
- Redirect to login if not authenticated
- Token verification

---

## Key Technologies

- **React 19** - UI framework
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **React Toastify** - Notifications
- **Axios** - HTTP client (optional, using Fetch now)

---

## Running the Frontend

### Development Mode
```bash
cd frontend
npm install
npm run dev
```
Server runs on `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

### Linting
```bash
npm run lint
```

---

## Testing the Application

### 1. Register a new user
```
Navigate to: http://localhost:5173/register
Fill in the form and submit
```

### 2. Login
```
Navigate to: http://localhost:5173/login
Enter credentials and submit
```

### 3. Browse products
```
On homepage, view featured products
Click "View Details" for more info
```

### 4. Add to cart
```
Enter quantity and click "Add to Cart"
Navigate to /cart to view cart
```

### 5. Checkout
```
Go to cart and click "Proceed to Checkout"
Fill in shipping address and payment method
Click "Place Order"
```

### 6. View orders
```
Navigate to /orders
Click "View Details" on any order
```

---

## Future Enhancements

1. **Advanced Search & Filtering**
   - Search by category
   - Price range filter
   - Rating filter
   - Sort options

2. **Product Reviews & Ratings**
   - Submit reviews
   - View reviews
   - Rate products

3. **User Profile Management**
   - Update profile info
   - Manage addresses
   - Wishlist
   - Notifications

4. **Admin Dashboard**
   - Product management
   - Order management
   - User management
   - Analytics

5. **Payment Integration**
   - Stripe integration
   - PayPal integration
   - Multiple payment gateways

6. **Advanced Features**
   - Real-time notifications
   - Live chat support
   - Product recommendations
   - Wishlist functionality

7. **Performance Optimization**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Caching strategies

---

## Troubleshooting

### CORS Errors
Make sure backend is running on `http://localhost:5000` and CORS is properly configured.

### Token Expiration
Tokens are stored in localStorage and automatically refreshed when expired.

### Cart Empty After Refresh
Cart data is stored in Redux state. Implement localStorage persistence for persistence.

### API Connection Errors
Check:
- Backend is running on correct port
- `.env.local` has correct API URL
- Network connectivity
- Firewall/proxy settings

---

## Important Notes

1. **Tokens Storage**: Access and Refresh tokens are stored in localStorage
2. **Authentication Flow**: 
   - Register → Get tokens → Auto login → Redirect to home
   - Login → Get tokens → Redirect to home
3. **Protected Routes**: Automatically redirect to login if not authenticated
4. **Error Handling**: All errors show toast notifications
5. **Loading States**: UI shows loading indicators during API calls

---

## Quick Start Command Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

---

## Support & Documentation

For backend API documentation, see `API_DOCUMENTATION.md` in the root directory.

For project structure overview, see `0_PROJECT_PLANNING_SUMMARY.md` and related files.
