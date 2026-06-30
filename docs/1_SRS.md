# Software Requirements Specification (SRS)
## NextCart - Advanced E-Commerce Platform

**Project Name:** NextCart  
**Version:** 2.0 (With Advanced Features)  
**Date:** June 2026  
**Status:** Ready for Development

---

## 1. Executive Summary

This document outlines the comprehensive requirements for a production-ready, full-stack e-commerce platform designed for resume, portfolio, and interview demonstration. The platform will showcase modern web development practices, scalable architecture, and best-in-class user experience.

---

## 2. Project Overview

### 2.1 Objective
Build **NextCart**, a fully functional e-commerce platform demonstrating:
- **Enterprise-level architecture** with advanced patterns
- **AI-powered features** (recommendations, personalization)
- **Complete feature set** (User, Product, Admin, Payment, Analytics systems)
- **Advanced inventory management** and coupon system
- **Email notification system** and order tracking
- **Role-Based Access Control** with admin dashboard
- **Production-grade code quality** and security
- **Responsive design** and modern UX
- **Deployment readiness** with scalability

### 2.2 Scope
- **In Scope:** User authentication, product catalog, shopping cart, orders, admin dashboard, payment integration, search/filters, reviews, wishlist, **AI product recommendations, recently viewed products, advanced coupon system, inventory management, email notifications, order tracking, sales dashboard, role-based access control**
- **Out of Scope:** Marketplace (multi-vendor), live chat, mobile app, social login
- **Future Scope:** Multi-language support, subscription products, affiliate system, advanced ML models, video reviews

### 2.3 Technology Stack
| Layer | Technology |
|-------|------------|
| Frontend | React.js (Vite), Tailwind CSS, React Router v6 |
| State Management | Redux Toolkit |
| Backend | Node.js, Express.js |
| Database | MongoDB (NoSQL) |
| Authentication | JWT (access + refresh tokens) |
| Image Storage | Cloudinary |
| Payment Gateway | Razorpay, COD |
| Deployment | Vercel (Frontend), Render (Backend), MongoDB Atlas |

---

## 3. Functional Requirements

### 3.1 User Management

#### 3.1.1 Authentication
- **FR-AUTH-001:** Users can register with email and password
- **FR-AUTH-002:** Password must meet security criteria (8+ chars, uppercase, lowercase, number, special char)
- **FR-AUTH-003:** Users can login with credentials
- **FR-AUTH-004:** JWT tokens (access: 1h, refresh: 7d) issued on login
- **FR-AUTH-005:** Users can logout (invalidate tokens)
- **FR-AUTH-006:** Forgot password with email verification
- **FR-AUTH-007:** Password reset with secure token
- **FR-AUTH-008:** Email verification on signup (optional for MVP)
- **FR-AUTH-009:** Session management on logout
- **FR-AUTH-010:** Rate limiting on login attempts (5 attempts/15 min)

#### 3.1.2 User Profile
- **FR-PROF-001:** Users can view their profile
- **FR-PROF-002:** Users can update profile (name, email, phone, profile picture)
- **FR-PROF-003:** Users can upload profile picture (via Cloudinary)
- **FR-PROF-004:** Users can view their account creation date
- **FR-PROF-005:** Users can view last login information
- **FR-PROF-006:** Users can delete their account (soft delete)
- **FR-PROF-007:** Two-factor authentication option (optional)

#### 3.1.3 Address Management
- **FR-ADDR-001:** Users can add multiple addresses
- **FR-ADDR-002:** Users can edit addresses
- **FR-ADDR-003:** Users can delete addresses
- **FR-ADDR-004:** Users can set default delivery address
- **FR-ADDR-005:** Address validation (pincode, city, state)
- **FR-ADDR-006:** Maximum 5 addresses per user

### 3.2 Product Management

#### 3.2.1 Product Listing
- **FR-PROD-001:** Display paginated product list (12 products per page)
- **FR-PROD-002:** Product card shows: image, name, price, rating, discount
- **FR-PROD-003:** "Out of Stock" indicator when inventory = 0
- **FR-PROD-004:** Quick view feature (modal with basic details)
- **FR-PROD-005:** Add to cart from product list
- **FR-PROD-006:** Add to wishlist from product list
- **FR-PROD-007:** View product details page

#### 3.2.2 Product Details
- **FR-PROD-008:** Display product images (multiple, carousel/gallery)
- **FR-PROD-009:** Show detailed description
- **FR-PROD-010:** Display specifications/attributes
- **FR-PROD-011:** Show availability status
- **FR-PROD-012:** Display pricing (original + discount)
- **FR-PROD-013:** Quantity selector (1-10)
- **FR-PROD-014:** Add to cart functionality
- **FR-PROD-015:** Add to wishlist functionality
- **FR-PROD-016:** Display reviews and ratings
- **FR-PROD-017:** Related products section
- **FR-PROD-018:** Breadcrumb navigation
- **FR-PROD-019:** Share product (social share buttons)

#### 3.2.3 Categories
- **FR-PROD-020:** Browse products by category
- **FR-PROD-021:** Category tree/hierarchy display
- **FR-PROD-022:** Subcategory filtering
- **FR-PROD-023:** Number of products in category badge

#### 3.2.4 Search & Filters
- **FR-PROD-024:** Search products by name/keyword
- **FR-PROD-025:** Real-time search suggestions
- **FR-PROD-026:** Filter by price range (min-max slider)
- **FR-PROD-027:** Filter by rating (1-5 stars)
- **FR-PROD-028:** Filter by category
- **FR-PROD-029:** Filter by availability (in stock/out of stock)
- **FR-PROD-030:** Sort by: relevance, price (asc/desc), newest, rating
- **FR-PROD-031:** Active filter badges with clear option
- **FR-PROD-032:** Remember search filters in URL
- **FR-PROD-033:** Filter persistence in session

#### 3.2.5 Reviews & Ratings
- **FR-PROD-034:** Authenticated users can leave reviews
- **FR-PROD-035:** Review must include rating (1-5 stars) and comment
- **FR-PROD-036:** Display average rating on product
- **FR-PROD-037:** Show rating distribution chart
- **FR-PROD-038:** Sort reviews by: helpful, recent, rating
- **FR-PROD-039:** Mark review as helpful (thumbs up/down)
- **FR-PROD-040:** Users can edit/delete their own reviews
- **FR-PROD-041:** Admin can delete inappropriate reviews
- **FR-PROD-042:** Review moderation flag (optional)

### 3.3 Shopping Cart

- **FR-CART-001:** Add products to cart
- **FR-CART-002:** Update quantity in cart
- **FR-CART-003:** Remove items from cart
- **FR-CART-004:** Clear entire cart
- **FR-CART-005:** Display subtotal, tax, total
- **FR-CART-006:** Apply discount/promo codes
- **FR-CART-007:** Cart persistence (localStorage + DB for logged users)
- **FR-CART-008:** Show out-of-stock items with warning
- **FR-CART-009:** Estimate shipping cost
- **FR-CART-010:** Cart item count badge in header
### 3.6 Recently Viewed Products

- **FR-VIEWED-001:** Track recently viewed products per user
- **FR-VIEWED-002:** Display recently viewed section on homepage
- **FR-VIEWED-003:** Store up to 20 recently viewed items
- **FR-VIEWED-004:** Clear viewing history
- **FR-VIEWED-005:** Sort by most recent
- **FR-VIEWED-006:** Persist across sessions

### 3.7 AI Product Recommendations

- **FR-AI-001:** Show recommended products based on viewing history
- **FR-AI-002:** Show recommended products based on purchase history
- **FR-AI-003:** Show recommended products based on category preferences
- **FR-AI-004:** Personalized recommendations on product detail page
- **FR-AI-005:** Recommended products section on homepage
- **FR-AI-006:** Recommendations based on similar products
- **FR-AI-007:** Machine learning model for collaborative filtering (optional)

### 3.8 Coupon System

- **FR-COUPON-001:** Admin can create discount coupons
- **FR-COUPON-002:** Percentage-based discounts
- **FR-COUPON-003:** Fixed amount discounts
- **FR-COUPON-004:** Minimum order value requirement
- **FR-COUPON-005:** Category-specific coupons
- **FR-COUPON-006:** Product-specific coupons
- **FR-COUPON-007:** Usage limit per coupon
- **FR-COUPON-008:** Usage limit per user
- **FR-COUPON-009:** Coupon expiration date
- **FR-COUPON-010:** Apply coupon at checkout
- **FR-COUPON-011:** Validate coupon before applying
- **FR-COUPON-012:** Display applicable coupons to users
### 3.4 Wishlist

- **FR-WISH-001:** Add products to wishlist
- **FR-WISH-002:** Remove from wishlist
- **FR-WISH-003:** View wishlist (dedicated page)
- **FR-WISH-004:** Move to cart from wishlist
- **FR-WISH-005:** Wishlist persistence
- **FR-WISH-006:** Share wishlist (optional)
- **FR-WISH-007:** Track price drops on wishlist items

### 3.5 Checkout & Orders

#### 3.5.1 Checkout Process
- **FR-CHCK-001:** Multi-step checkout (cart → address → payment → confirmation)
- **FR-CHCK-002:** Address selection/modification
- **FR-CHCK-003:** Shipping method selection
- **FR-CHCK-004:** Payment method selection
- **FR-CHCK-005:** Order review before final submission
- **FR-CHCK-006:** Apply promo codes at checkout
- **FR-CHCK-007:** Estimate delivery date
- **FR-CHCK-008:** Track order after placement

#### 3.5.2 Order Management
- **FR-ORDER-001:** Create order from cart
- **FR-ORDER-002:** Generate unique order ID
- **FR-ORDER-003:** Order confirmation email
- **FR-ORDER-004:** View order history (paginated)
- **FR-ORDER-005:** View order details
- **FR-ORDER-006:** Order status tracking (Pending → Confirmed → Shipped → Delivered)
- **FR-ORDER-007:** Cancel order (only in Pending/Confirmed status)
- **FR-ORDER-008:** Return request (within 30 days)
- **FR-ORDER-009:** Download invoice/receipt
- **FR-ORDER-010:** Track shipment status
- **FR-ORDER-011:** Estimated delivery date

### 3.6 Payment

- **FR-PAY-001:** Cash on Delivery (COD) option
- **FR-PAY-002:** Razorpay payment gateway integration
- **FR-PAY-003:** Payment success/failure handling
- **FR-PAY-004:** Secure payment processing
- **FR-PAY-005:** Transaction receipt generation
- **FR-PAY-006:** Payment retry mechanism
- **FR-PAY-007:** Order confirmation after successful payment
- **FR-PAY-008:** Payment status tracking

---

## 4. Admin Features

### 4.1 Dashboard
- **FR-ADMIN-001:** Overview statistics (total revenue, orders, users, products)
- **FR-ADMIN-002:** Sales charts (daily/weekly/monthly)
- **FR-ADMIN-003:** Recent orders list
- **FR-ADMIN-004:** Recent customers list
- **FR-ADMIN-005:** Quick action buttons
- **FR-ADMIN-006:** Top products by sales
- **FR-ADMIN-007:** Sales comparison (current vs previous period)

### 4.2 Product Management
- **FR-ADMIN-008:** Create new product (with details, images, pricing, inventory)
- **FR-ADMIN-009:** Edit existing products
- **FR-ADMIN-010:** Delete products
- **FR-ADMIN-011:** Bulk operations (edit/delete multiple)
- **FR-ADMIN-012:** Upload images (single/multiple to Cloudinary)
- **FR-ADMIN-013:** Manage product variants/options
- **FR-ADMIN-014:** Set inventory levels
- **FR-ADMIN-015:** View product performance

### 4.3 Category Management
- **FR-ADMIN-016:** Create categories
- **FR-ADMIN-017:** Edit categories
- **FR-ADMIN-018:** Delete categories
- **FR-ADMIN-019:** Set parent categories (hierarchy)
- **FR-ADMIN-020:** Upload category images

### 4.4 Order Management
- **FR-ADMIN-021:** View all orders
- **FR-ADMIN-022:** Filter orders (by status, date, amount)
- **FR-ADMIN-023:** Update order status
- **FR-ADMIN-024:** View order details
- **FR-ADMIN-025:** Generate order reports
- **FR-ADMIN-026:** Handle refunds/returns
- **FR-ADMIN-027:** Manage shipping information

### 4.5 User Management
- **FR-ADMIN-028:** View all users
- **FR-ADMIN-029:** Search users
- **FR-ADMIN-030:** View user details
- **FR-ADMIN-031:** Deactivate/ban users
- **FR-ADMIN-032:** View user orders
- **FR-ADMIN-033:** Manage admin roles (Owner, Admin, Manager)

### 4.6 Analytics
- **FR-ADMIN-034:** Revenue analytics
- **FR-ADMIN-035:** Product performance analysis
- **FR-ADMIN-036:** Customer analytics
- **FR-ADMIN-037:** Sales trends
- **FR-ADMIN-038:** Inventory reports
- **FR-ADMIN-039:** Export reports (PDF/CSV)

### 4.7 Role-Based Access Control
- **FR-ADMIN-040:** Define user roles (Admin, Manager, User)
- **FR-ADMIN-041:** Role-based dashboard access
- **FR-ADMIN-042:** Permission-based feature access
- **FR-ADMIN-043:** Manager can view analytics but not delete
- **FR-ADMIN-044:** Admin can manage users and roles
- **FR-ADMIN-045:** Restrict sensitive operations by role

### 4.8 Inventory Management
- **FR-ADMIN-046:** Track product stock levels
- **FR-ADMIN-047:** Set low stock alerts
- **FR-ADMIN-048:** Automatic stock updates on order
- **FR-ADMIN-049:** Reorder point configuration
- **FR-ADMIN-050:** Stock history tracking
- **FR-ADMIN-051:** Inventory forecasting (optional)

### 4.9 Email Notifications
- **FR-ADMIN-052:** Configure email templates
- **FR-ADMIN-053:** Send promotional emails
- **FR-ADMIN-054:** Newsletter management
- **FR-ADMIN-055:** Email scheduling
- **FR-ADMIN-056:** Track email analytics (opens, clicks)

---

## 5. Email Notification Features

### 5.1 Transactional Emails
- **FR-EMAIL-001:** Registration confirmation email
- **FR-EMAIL-002:** Password reset email
- **FR-EMAIL-003:** Order confirmation email
- **FR-EMAIL-004:** Order shipped notification
- **FR-EMAIL-005:** Order delivered notification
- **FR-EMAIL-006:** Order cancelled notification
- **FR-EMAIL-007:** Refund processed notification
- **FR-EMAIL-008:** Review reminder email

### 5.2 Promotional Emails
- **FR-EMAIL-009:** Newsletter subscription
- **FR-EMAIL-010:** Promotional offers email
- **FR-EMAIL-011:** Abandoned cart reminder
- **FR-EMAIL-012:** Price drop notification
- **FR-EMAIL-013:** Back in stock notification
- **FR-EMAIL-014:** Personalized recommendations email

### 5.3 Email Management (Admin)
- **FR-EMAIL-015:** Email template management
- **FR-EMAIL-016:** Email analytics dashboard
- **FR-EMAIL-017:** Unsubscribe management
- **FR-EMAIL-018:** Email log viewing

---

## 6. Order Tracking Features

### 6.1 Real-Time Tracking
- **FR-TRACK-001:** Display order status in real-time
- **FR-TRACK-002:** Show tracking number when shipped
- **FR-TRACK-003:** Display estimated delivery date
- **FR-TRACK-004:** Show delivery address
- **FR-TRACK-005:** Contact information for support
- **FR-TRACK-006:** Timeline of order events
- **FR-TRACK-007:** Last location update

### 6.2 Tracking Notifications
- **FR-TRACK-008:** Email notification on status change
- **FR-TRACK-009:** SMS notification option (future)
- **FR-TRACK-010:** In-app notification on status update
- **FR-TRACK-011:** Notification preferences management

---

## 5. Non-Functional Requirements

### 5.1 Performance
- **NFR-PERF-001:** Page load time < 2 seconds (Core Web Vitals)
- **NFR-PERF-002:** API response time < 500ms
- **NFR-PERF-003:** Image optimization (lazy loading, WebP format)
- **NFR-PERF-004:** Code splitting and bundle optimization
- **NFR-PERF-005:** CDN usage for static assets
- **NFR-PERF-006:** Database query optimization (indexing)

### 5.2 Security
- **NFR-SEC-001:** HTTPS/SSL encryption
- **NFR-SEC-002:** Password hashing (bcrypt, 10+ rounds)
- **NFR-SEC-003:** JWT token security (signed, expiring)
- **NFR-SEC-004:** CORS configuration
- **NFR-SEC-005:** Input validation and sanitization
- **NFR-SEC-006:** SQL injection prevention (using ORM)
- **NFR-SEC-007:** XSS protection
- **NFR-SEC-008:** CSRF protection
- **NFR-SEC-009:** Rate limiting on APIs
- **NFR-SEC-010:** Secure password reset flow
- **NFR-SEC-011:** PCI DSS compliance for payments

### 5.3 Scalability
- **NFR-SCAL-001:** Architecture supports 10,000+ concurrent users
- **NFR-SCAL-002:** Horizontal scaling capability
- **NFR-SCAL-003:** Database replication support
- **NFR-SCAL-004:** CDN integration for global reach
- **NFR-SCAL-005:** Stateless backend services

### 5.4 Reliability
- **NFR-REL-001:** 99% uptime SLA
- **NFR-REL-002:** Graceful error handling
- **NFR-REL-003:** Comprehensive logging and monitoring
- **NFR-REL-004:** Backup and disaster recovery plan
- **NFR-REL-005:** Database transaction rollback on failure

### 5.5 Usability
- **NFR-USE-001:** Responsive design (mobile, tablet, desktop)
- **NFR-USE-002:** Mobile-first approach
- **NFR-USE-003:** Accessibility (WCAG 2.1 AA compliance)
- **NFR-USE-004:** Loading skeletons for better UX
- **NFR-USE-005:** Toast notifications for feedback
- **NFR-USE-006:** Dark mode support
- **NFR-USE-007:** Intuitive navigation
- **NFR-USE-008:** Fast search and autocomplete

### 5.6 Maintainability
- **NFR-MAINT-001:** Clean code architecture
- **NFR-MAINT-002:** Modular component structure
- **NFR-MAINT-003:** Comprehensive documentation
- **NFR-MAINT-004:** Consistent coding standards
- **NFR-MAINT-005:** Unit and integration tests (80%+ coverage)
- **NFR-MAINT-006:** CI/CD pipeline setup
- **NFR-MAINT-007:** Version control best practices

### 5.7 Compatibility
- **NFR-COMPAT-001:** Browser support (Chrome, Firefox, Safari, Edge - latest 2 versions)
- **NFR-COMPAT-002:** Mobile browser support
- **NFR-COMPAT-003:** Backward compatibility with older APIs

---

## 6. Data Requirements

### 6.1 Data Volume
- Expected Users: 50,000 (initial), 500,000 (year 1)
- Expected Products: 5,000-10,000
- Expected Orders: 100,000+ (first year)
- Expected Reviews: 500,000+

### 6.2 Data Retention
- User data: Retained indefinitely (with consent)
- Order data: Retained for 7 years (compliance)
- Review data: Retained indefinitely
- Log data: Retained for 90 days
- Backup data: Retained for 30 days (incremental)

---

## 7. Constraints & Assumptions

### 7.1 Constraints
- Budget: Development only (no paid external services except Razorpay, Cloudinary, hosting)
- Timeline: 12-16 weeks for MVP
- Team: Solo development
- Infrastructure: Limited to serverless/PaaS offerings

### 7.2 Assumptions
- Users have modern browsers
- Internet connectivity available
- Email delivery service available
- Third-party API availability (Razorpay, Cloudinary)
- MongoDB Atlas availability

---

## 8. Success Criteria

1. ✅ All functional requirements implemented (100+ features)
2. ✅ Zero critical security vulnerabilities
3. ✅ 80%+ code test coverage
4. ✅ Lighthouse score > 90 (all metrics)
5. ✅ SEO optimized (meta tags, sitemap, robots.txt)
6. ✅ Deployed and accessible on production URLs
7. ✅ Complete API documentation
8. ✅ Admin features fully functional with RBAC
9. ✅ Payment integration working (test mode)
10. ✅ Email notification system working
11. ✅ AI recommendations engine functional
12. ✅ Inventory management working
13. ✅ Coupon system fully operational
14. ✅ Order tracking in real-time
15. ✅ Responsive design verified across devices

---

## 9. Glossary

| Term | Definition |
|------|-----------|
| JWT | JSON Web Token - stateless authentication method |
| COD | Cash on Delivery - payment method |
| SPA | Single Page Application |
| SEO | Search Engine Optimization |
| WCAG | Web Content Accessibility Guidelines |
| API | Application Programming Interface |
| MVP | Minimum Viable Product |
| CDN | Content Delivery Network |
| RBAC | Role-Based Access Control - permission system |
| AI/ML | Artificial Intelligence / Machine Learning |
| RTR | Real-Time Recommendation |
| UX | User Experience |
| UI | User Interface |

---

## 10. Sign-Off

**Document Status:** Ready for Review and Approval

**Next Steps:**
1. Project review and feedback
2. Architecture design
3. Database schema finalization
4. Folder structure creation
5. Implementation roadmap
6. Development kickoff
