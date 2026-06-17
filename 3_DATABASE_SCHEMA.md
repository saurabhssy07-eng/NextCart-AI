# Database Schema
## NextCart - Advanced E-Commerce Platform MongoDB Collections

**Project Name:** NextCart  
**Version:** 2.0 (With Advanced Features)  
**Database Name:** nextcart_db  
**Type:** NoSQL (MongoDB)

---

## 1. Users Collection

### Schema

```javascript
{
  _id: ObjectId,
  
  // Basic Information
  firstName: String (required, 2-50 chars),
  lastName: String (required, 2-50 chars),
  email: String (required, unique, lowercase),
  phone: String (optional, unique format validation),
  password: String (required, hashed with bcrypt),
  
  // Profile
  profilePicture: String (URL from Cloudinary, optional),
  dateOfBirth: Date (optional),
  gender: String (enum: ["Male", "Female", "Other"]),
  
  // Account Status
  status: String (enum: ["active", "inactive", "suspended"], default: "active"),
  emailVerified: Boolean (default: false),
  emailVerificationToken: String (optional),
  emailVerificationExpire: Date (optional),
  
  // Preferences
  preferences: {
    newsletter: Boolean (default: true),
    notifications: Boolean (default: true),
    darkMode: Boolean (default: false),
    language: String (default: "en")
  },
  
  // Role & Permissions
  role: String (enum: ["user", "admin", "manager"], default: "user"),
  permissions: [String] (array of permission strings),
  
  // Authentication
  resetPasswordToken: String (optional),
  resetPasswordExpire: Date (optional),
  lastLogin: Date (optional),
  twoFactorEnabled: Boolean (default: false),
  twoFactorSecret: String (optional, encrypted),
  
  // Timestamps
  createdAt: Date (default: Date.now, indexed),
  updatedAt: Date (default: Date.now),
  deletedAt: Date (optional, soft delete)
}
```

### Indexes

```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ phone: 1 }, { sparse: true, unique: true })
db.users.createIndex({ createdAt: -1 })
db.users.createIndex({ role: 1 })
db.users.createIndex({ status: 1 })
```

---

## 2. Products Collection

### Schema

```javascript
{
  _id: ObjectId,
  
  // Basic Information
  name: String (required, 3-200 chars),
  slug: String (required, unique, lowercase),
  description: String (required, 10-5000 chars),
  shortDescription: String (optional, max 200 chars),
  
  // Categorization
  categoryId: ObjectId (required, ref: "categories"),
  subcategoryId: ObjectId (optional, ref: "categories"),
  tags: [String] (array of search tags, optional),
  
  // Images
  images: [
    {
      url: String (Cloudinary URL),
      publicId: String (Cloudinary public ID),
      alt: String (optional, alt text),
      order: Number (display order)
    }
  ],
  thumbnail: String (Cloudinary URL, main product image),
  
  // Pricing
  originalPrice: Number (required, >= 0),
  salePrice: Number (required, <= originalPrice),
  discount: Number (calculated: (originalPrice - salePrice) / originalPrice * 100),
  tax: Number (optional, percentage),
  
  // Inventory
  sku: String (required, unique, stock keeping unit),
  quantity: Number (required, >= 0),
  reorderLevel: Number (optional, alert threshold),
  
  // Specifications
  specifications: {
    [key: String]: String (dynamic key-value pairs)
    // Example: { "color": "red", "size": "M", "material": "cotton" }
  },
  attributes: [
    {
      name: String,
      values: [String]
    }
  ],
  
  // Ratings & Reviews
  averageRating: Number (default: 0, 0-5),
  totalReviews: Number (default: 0),
  ratingDistribution: {
    5: Number (default: 0),
    4: Number (default: 0),
    3: Number (default: 0),
    2: Number (default: 0),
    1: Number (default: 0)
  },
  
  // Shipping
  weight: Number (optional, in kg),
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: String (enum: ["cm", "inch"], default: "cm")
  },
  shippingClass: String (enum: ["standard", "fragile", "oversized"]),
  
  // Status
  isActive: Boolean (default: true),
  isFeatured: Boolean (default: false),
  isNew: Boolean (default: true for 30 days),
  
  // SEO
  metaTitle: String (optional, max 60 chars),
  metaDescription: String (optional, max 160 chars),
  metaKeywords: [String] (optional),
  
  // Vendor/Admin Info
  createdBy: ObjectId (ref: "users", admin who created),
  updatedBy: ObjectId (optional, ref: "users", admin who updated),
  
  // Analytics
  views: Number (default: 0),
  purchases: Number (default: 0),
  
  // Timestamps
  createdAt: Date (default: Date.now, indexed),
  updatedAt: Date (default: Date.now),
  deletedAt: Date (optional, soft delete)
}
```

### Indexes

```javascript
db.products.createIndex({ name: "text", description: "text" })
db.products.createIndex({ slug: 1 }, { unique: true })
db.products.createIndex({ categoryId: 1 })
db.products.createIndex({ sku: 1 }, { unique: true })
db.products.createIndex({ createdAt: -1 })
db.products.createIndex({ salePrice: 1 })
db.products.createIndex({ averageRating: -1 })
db.products.createIndex({ isActive: 1 })
```

---

## 3. Categories Collection

### Schema

```javascript
{
  _id: ObjectId,
  
  // Basic Information
  name: String (required, 2-50 chars, unique),
  slug: String (required, unique, lowercase),
  description: String (optional),
  
  // Hierarchy
  parentId: ObjectId (optional, ref: "categories", null for root categories),
  level: Number (0 for root, calculated),
  
  // Image
  image: String (Cloudinary URL, optional),
  publicId: String (Cloudinary public ID),
  
  // SEO
  metaTitle: String (optional),
  metaDescription: String (optional),
  metaKeywords: [String] (optional),
  
  // Status
  isActive: Boolean (default: true),
  displayOrder: Number (optional, for sorting),
  
  // Analytics
  productCount: Number (default: 0, denormalized),
  
  // Timestamps
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Indexes

```javascript
db.categories.createIndex({ name: 1 }, { unique: true })
db.categories.createIndex({ slug: 1 }, { unique: true })
db.categories.createIndex({ parentId: 1 })
db.categories.createIndex({ isActive: 1 })
```

---

## 4. Cart Collection (Session-based)

### Schema

```javascript
{
  _id: ObjectId,
  
  // Ownership
  userId: ObjectId (optional, null for guest cart),
  sessionId: String (for guest carts),
  
  // Cart Items
  items: [
    {
      productId: ObjectId (ref: "products", required),
      quantity: Number (required, 1-10),
      price: Number (product salePrice at time of add),
      discount: Number (percentage discount),
      total: Number (calculated: quantity * price)
    }
  ],
  
  // Totals
  subtotal: Number (calculated),
  tax: Number (calculated based on items),
  shippingCost: Number (estimated, 0 initially),
  discount: Number (applied coupon discount),
  couponCode: String (optional),
  total: Number (calculated: subtotal + tax + shipping - discount),
  
  // Status
  status: String (enum: ["active", "abandoned"], default: "active"),
  
  // Timestamps
  createdAt: Date (default: Date.now, TTL index: 30 days),
  updatedAt: Date (default: Date.now),
  expiresAt: Date (30 days from creation, for TTL)
}
```

### Indexes

```javascript
db.carts.createIndex({ userId: 1 })
db.carts.createIndex({ sessionId: 1 })
db.carts.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

---

## 5. Orders Collection

### Schema

```javascript
{
  _id: ObjectId,
  
  // Order Information
  orderNumber: String (required, unique, format: "ORD-YYYYMMDD-XXXXX"),
  userId: ObjectId (required, ref: "users"),
  status: String (enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"], default: "pending"),
  
  // Items
  items: [
    {
      productId: ObjectId (ref: "products"),
      productName: String,
      quantity: Number,
      price: Number (unit price at order time),
      discount: Number,
      tax: Number,
      total: Number
    }
  ],
  
  // Pricing
  subtotal: Number,
  tax: Number,
  shippingCost: Number,
  discountAmount: Number,
  couponCode: String (optional),
  total: Number,
  
  // Shipping Information
  shippingAddress: {
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    landmark: String (optional)
  },
  shippingMethod: String (enum: ["standard", "express", "overnight"]),
  trackingNumber: String (optional),
  estimatedDelivery: Date,
  actualDelivery: Date (optional),
  
  // Payment Information
  paymentMethod: String (enum: ["credit_card", "debit_card", "razorpay", "upi", "cod"]),
  paymentStatus: String (enum: ["pending", "completed", "failed", "refunded"], default: "pending"),
  paymentId: String (Razorpay payment ID, optional),
  paymentDate: Date (optional),
  
  // Order Notes & History
  notes: String (optional),
  adminNotes: String (optional),
  
  // Timeline
  timeline: [
    {
      status: String,
      timestamp: Date,
      comment: String (optional)
    }
  ],
  
  // Return & Refund
  returnRequested: Boolean (default: false),
  returnReason: String (optional),
  returnDate: Date (optional),
  refundStatus: String (enum: ["none", "initiated", "completed", "failed"]),
  refundAmount: Number (optional),
  
  // Timestamps
  createdAt: Date (default: Date.now, indexed),
  updatedAt: Date (default: Date.now),
  deletedAt: Date (optional, soft delete)
}
```

### Indexes

```javascript
db.orders.createIndex({ orderNumber: 1 }, { unique: true })
db.orders.createIndex({ userId: 1 })
db.orders.createIndex({ status: 1 })
db.orders.createIndex({ createdAt: -1 })
db.orders.createIndex({ paymentStatus: 1 })
```

---

## 6. Reviews Collection

### Schema

```javascript
{
  _id: ObjectId,
  
  // Ownership
  productId: ObjectId (required, ref: "products"),
  userId: ObjectId (required, ref: "users"),
  orderId: ObjectId (optional, ref: "orders", for verified purchases),
  
  // Review Content
  rating: Number (required, 1-5),
  title: String (optional, max 100 chars),
  comment: String (required, 10-2000 chars),
  
  // Review Details
  verified: Boolean (default: false, true if purchased),
  images: [String] (optional, array of image URLs from Cloudinary),
  
  // Engagement
  helpful: Number (default: 0, helpful votes),
  unhelpful: Number (default: 0, unhelpful votes),
  
  // Moderation
  status: String (enum: ["pending", "approved", "rejected"], default: "pending"),
  flaggedReason: String (optional),
  rejectionReason: String (optional),
  
  // User Information (denormalized for performance)
  userName: String (denormalized from user),
  userProfilePicture: String (optional),
  
  // Timestamps
  createdAt: Date (default: Date.now, indexed),
  updatedAt: Date (default: Date.now),
  deletedAt: Date (optional, soft delete)
}
```

### Indexes

```javascript
db.reviews.createIndex({ productId: 1 })
db.reviews.createIndex({ userId: 1 })
db.reviews.createIndex({ rating: -1 })
db.reviews.createIndex({ createdAt: -1 })
db.reviews.createIndex({ status: 1 })
```

---

## 7. Wishlist Collection

### Schema

```javascript
{
  _id: ObjectId,
  
  // Ownership
  userId: ObjectId (required, unique, ref: "users"),
  
  // Wishlist Items
  items: [
    {
      productId: ObjectId (ref: "products"),
      addedAt: Date,
      priceAtAdd: Number (optional, for price tracking),
      notifyOnDiscount: Boolean (default: false)
    }
  ],
  
  // Timestamps
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Indexes

```javascript
db.wishlists.createIndex({ userId: 1 }, { unique: true })
```

---

## 8. Addresses Collection

### Schema

```javascript
{
  _id: ObjectId,
  
  // Ownership
  userId: ObjectId (required, ref: "users", indexed),
  
  // Address Information
  firstName: String (required),
  lastName: String (required),
  phone: String (required),
  email: String (required),
  
  // Location Details
  address: String (required),
  landmark: String (optional),
  city: String (required),
  state: String (required),
  pincode: String (required, validation),
  country: String (default: "India"),
  
  // Address Type
  type: String (enum: ["home", "work", "other"], default: "home"),
  
  // Status
  isDefault: Boolean (default: false),
  
  // Timestamps
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Indexes

```javascript
db.addresses.createIndex({ userId: 1 })
db.addresses.createIndex({ userId: 1, isDefault: 1 })
```

---

## 9. Payments Collection

### Schema

```javascript
{
  _id: ObjectId,
  
  // Reference
  orderId: ObjectId (required, unique, ref: "orders"),
  userId: ObjectId (required, ref: "users"),
  
  // Payment Details
  amount: Number (required),
  currency: String (default: "INR"),
  paymentMethod: String (enum: ["razorpay", "cod", "wallet"]),
  
  // Razorpay Details
  razorpayOrderId: String (optional),
  razorpayPaymentId: String (optional),
  razorpaySignature: String (optional),
  
  // Payment Status
  status: String (enum: ["pending", "completed", "failed", "cancelled"], default: "pending"),
  
  // Refund
  refundStatus: String (enum: ["none", "initiated", "completed", "failed"], default: "none"),
  refundAmount: Number (optional),
  refundDate: Date (optional),
  refundReason: String (optional),
  
  // Error Handling
  failureReason: String (optional),
  attemptCount: Number (default: 1),
  
  // Timestamps
  createdAt: Date (default: Date.now, indexed),
  updatedAt: Date (default: Date.now),
  completedAt: Date (optional)
}
```

### Indexes

```javascript
db.payments.createIndex({ orderId: 1 }, { unique: true })
db.payments.createIndex({ userId: 1 })
db.payments.createIndex({ status: 1 })
db.payments.createIndex({ razorpayOrderId: 1 })
```

---

## 10. Analytics Collection (Optional, for reporting)

### Schema

```javascript
{
  _id: ObjectId,
  
  // Date
  date: Date (daily aggregation),
  
  // Order Metrics
  totalOrders: Number,
  totalRevenue: Number,
  averageOrderValue: Number,
  
  // Product Metrics
  topProducts: [
    {
      productId: ObjectId,
      productName: String,
      sales: Number,
      revenue: Number
    }
  ],
  
  // User Metrics
  newUsers: Number,
  returningUsers: Number,
  
  // Category Performance
  topCategories: [
    {
      categoryId: ObjectId,
      categoryName: String,
      sales: Number,
      revenue: Number
    }
  ],
  
  // Payment Methods
  paymentMethodStats: {
    cod: Number,
    razorpay: Number,
    other: Number
  },
  
  // Timestamps
  createdAt: Date (default: Date.now)
}
```

### Indexes

```javascript
db.analytics.createIndex({ date: -1 })
```

---

## 11. Coupons Collection (Optional)

### Schema

```javascript
{
  _id: ObjectId,
  
  // Coupon Details
  code: String (required, unique, uppercase),
  description: String (optional),
  
  // Discount
  discountType: String (enum: ["percentage", "fixed"], required),
  discountValue: Number (required),
  maxDiscount: Number (optional, for percentage discounts),
  
  // Conditions
  minOrderAmount: Number (optional),
  usageLimit: Number (optional, -1 for unlimited),
  usagePerUser: Number (default: 1),
  
  // Categories/Products (if applicable)
  applicableCategories: [ObjectId] (optional),
  applicableProducts: [ObjectId] (optional),
  
  // Validity
  validFrom: Date (required),
  validUntil: Date (required),
  
  // Status
  isActive: Boolean (default: true),
  usedCount: Number (default: 0),
  
  // Timestamps
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Indexes

```javascript
db.coupons.createIndex({ code: 1 }, { unique: true })
db.coupons.createIndex({ isActive: 1 })
db.coupons.createIndex({ validUntil: 1 })
```

---

## 12. Recently Viewed Products Collection

### Schema

```javascript
{
  _id: ObjectId,
  
  // Ownership
  userId: ObjectId (required, unique, ref: "users"),
  
  // Viewed Items
  viewedProducts: [
    {
      productId: ObjectId (ref: "products"),
      viewedAt: Date (timestamp of view),
      duration: Number (time spent in seconds),
      position: Number (order in history, most recent first)
    }
  ],
  
  // Settings
  maxItems: Number (default: 20, max to store),
  
  // Timestamps
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Indexes

```javascript
db.viewedProducts.createIndex({ userId: 1 }, { unique: true })
```

---

## 13. Inventory Management Collection

### Schema

```javascript
{
  _id: ObjectId,
  
  // Reference
  productId: ObjectId (required, unique, ref: "products"),
  
  // Stock Levels
  currentStock: Number (required, >= 0),
  reservedStock: Number (default: 0, items in pending orders),
  availableStock: Number (calculated: currentStock - reservedStock),
  minStockLevel: Number (required, reorder alert threshold),
  maxStockLevel: Number (optional, warehouse capacity),
  
  // Stock History
  lastRestocked: Date (optional),
  restockQuantity: Number (last restock amount),
  
  // Alerts
  lowStockAlert: Boolean (default: false),
  outOfStockAlert: Boolean (default: false),
  
  // Supplier Info (optional)
  supplierId: ObjectId (optional),
  leadTimeDays: Number (optional, days to restock),
  
  // Stock Movements
  movements: [
    {
      type: String (enum: ["purchase", "return", "restock", "damage"]),
      quantity: Number,
      reason: String,
      timestamp: Date,
      reference: String (order ID or other reference)
    }
  ],
  
  // Timestamps
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Indexes

```javascript
db.inventory.createIndex({ productId: 1 }, { unique: true })
db.inventory.createIndex({ lowStockAlert: 1 })
db.inventory.createIndex({ outOfStockAlert: 1 })
```

---

## 14. Product Recommendations Collection

### Schema

```javascript
{
  _id: ObjectId,
  
  // Recommendation Metadata
  userId: ObjectId (required, ref: "users"),
  
  // Recommended Products
  recommendations: [
    {
      productId: ObjectId (ref: "products"),
      score: Number (0-100, recommendation confidence),
      reason: String (enum: ["browsing_history", "purchase_history", "category_preference", "similar_products", "trending"]),
      addedAt: Date
    }
  ],
  
  // Algorithm Info
  algorithm: String (type of recommendation algorithm used),
  version: Number (algorithm version),
  
  // Timestamps
  generatedAt: Date (when recommendations were generated),
  expiresAt: Date (TTL for cache expiration, 7 days)
}
```

### Indexes

```javascript
db.recommendations.createIndex({ userId: 1 })
db.recommendations.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

---

## 15. Email Templates Collection

### Schema

```javascript
{
  _id: ObjectId,
  
  // Template Info
  name: String (required, unique, e.g., "order_confirmation"),
  subject: String (required, email subject line),
  
  // Content
  htmlTemplate: String (required, HTML email body),
  textTemplate: String (optional, plain text fallback),
  
  // Variables
  variables: [String] (array of template variables, e.g., {{userName}}, {{orderNumber}}),
  
  // Status
  isActive: Boolean (default: true),
  type: String (enum: ["transactional", "promotional", "notification"]),
  
  // Metadata
  description: String (optional),
  createdBy: ObjectId (ref: "users"),
  
  // Timestamps
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Indexes

```javascript
db.emailTemplates.createIndex({ name: 1 }, { unique: true })
db.emailTemplates.createIndex({ type: 1 })
db.emailTemplates.createIndex({ isActive: 1 })
```

---

## 16. Email Notifications Log Collection

### Schema

```javascript
{
  _id: ObjectId,
  
  // Recipient
  userId: ObjectId (required, ref: "users"),
  recipientEmail: String (required),
  
  // Email Content
  templateName: String (required),
  subject: String (required),
  
  // Delivery Status
  status: String (enum: ["pending", "sent", "delivered", "failed", "bounced"], default: "pending"),
  sentAt: Date (optional),
  deliveredAt: Date (optional),
  failureReason: String (optional),
  
  // Email Metrics (if supported)
  opened: Boolean (default: false),
  openedAt: Date (optional),
  clicked: Boolean (default: false),
  clickedAt: Date (optional),
  
  // Reference
  relatedOrderId: ObjectId (optional, ref: "orders"),
  relatedUserId: ObjectId (optional, ref: "users"),
  
  // Timestamps
  createdAt: Date (default: Date.now)
}
```

### Indexes

```javascript
db.emailNotifications.createIndex({ userId: 1 })
db.emailNotifications.createIndex({ status: 1 })
db.emailNotifications.createIndex({ createdAt: -1 })
```

---

## 12. Data Validation Rules

### User Validation

| Field | Validation |
|-------|-----------|
| email | Valid email format, unique |
| password | Min 8 chars, uppercase, lowercase, number, special char |
| phone | 10 digits, unique |
| firstName/lastName | 2-50 characters, alphabets only |

### Product Validation

| Field | Validation |
|-------|-----------|
| name | 3-200 characters |
| originalPrice | >= 0, number |
| salePrice | 0 <= salePrice <= originalPrice |
| quantity | >= 0, integer |
| sku | Unique, alphanumeric |

### Order Validation

| Field | Validation |
|-------|-----------|
| items | At least 1 item |
| total | > 0, must match calculated total |
| shippingAddress | All required fields filled |
| pincode | 6 digits for India |

---

## 27. Migration Strategy

### Phase 1: Core Collections
1. Users
2. Categories
3. Products
4. Addresses

### Phase 2: Transaction Collections
5. Orders
6. Payments
7. Cart

### Phase 3: Enhancement Collections
8. Reviews
9. Wishlist
10. Coupons

### Phase 4: Advanced Features
11. ViewedProducts
12. Inventory
13. ProductRecommendations
14. EmailTemplates
15. EmailNotifications

### Phase 5: Reporting
16. Analytics

---

## 14. Backup & Recovery

- **Backup Frequency:** Daily automated backups via MongoDB Atlas
- **Retention Period:** 35 days
- **Recovery Time Objective (RTO):** < 1 hour
- **Recovery Point Objective (RPO):** < 15 minutes

---

## 15. Performance Optimization

### Query Optimization Tips

1. Use projection to fetch only required fields
2. Always paginate large result sets
3. Use aggregation pipeline for complex queries
4. Index frequently queried fields
5. Denormalize commonly accessed relationships
6. Use TTL indexes for temporary data (cart, sessions)

### Denormalization Strategy

To balance normalization with performance:
- Store category name in products (for display)
- Store user name in reviews (for display)
- Store product details in orders (historical record)
- Maintain product count in categories (analytics)

---

## 16. End of Database Schema Document
