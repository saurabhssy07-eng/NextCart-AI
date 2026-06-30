# NextCart AI Architecture

This document describes the high-level architecture and technology stack of the NextCart AI project.

## 🏗️ Overview
NextCart AI is a modern E-commerce web application built using the MERN stack (MongoDB, Express, React, Node.js). The application is split into two primary layers: a React frontend client and an Express Node.js API backend.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js with Vite for fast bundling and hot-module replacement.
- **Styling**: Tailwind CSS for utility-first styling and responsive design.
- **State Management**: Redux Toolkit (RTK) for global state (Authentication, Cart, etc.).
- **Routing**: React Router DOM v6.
- **HTTP Client**: Native `fetch` API wrapped in custom services with automatic Refresh Token rotation.
- **Authentication**: Google OAuth integration (`@react-oauth/google`) & JWT via HttpOnly cookies.

### Backend
- **Environment**: Node.js
- **Framework**: Express.js (REST API)
- **Database**: MongoDB Atlas (Cloud database)
- **ODM**: Mongoose for schema definitions and data validation.
- **Authentication**: 
  - JWT (JSON Web Tokens) with separate Access (15m) and Refresh (30d) tokens.
  - bcryptjs for password hashing.
  - Secure HttpOnly cookies to mitigate XSS attacks.
- **Security**: 
  - `express-rate-limit` for DDoS and brute-force protection.
  - `express-validator` for input sanitization and validation.
- **Email Service**: Nodemailer (currently using Ethereal for dev).

### Future Integrations (Planned)
- **Cloudinary**: For product and profile image hosting.
- **Razorpay/Stripe**: For secure payment processing.
- **Google Gemini / OpenAI**: For AI Shopping Assistant features.
- **Redis**: For caching and performance optimization.

## 📂 Directory Structure

### `/frontend`
- `/src/components`: Reusable UI components (Navbar, Footer, Buttons).
- `/src/pages`: Top-level route components (Home, Login, Register, Profile).
- `/src/store`: Redux slices (`authSlice.js`).
- `/src/services`: API communication layer (`api.js`).
- `/src/context`: React Context providers (ThemeContext).

### `/backend`
- `/controllers`: Request handlers and business logic.
- `/models`: Mongoose database schemas (`User.js`, `Product.js`, `Order.js`).
- `/routes`: Express route definitions connecting endpoints to controllers.
- `/middleware`: Custom middleware (Auth protection, validation, rate limiting).
- `/utils`: Helper functions and utilities (Email service).
- `/config`: Environment variable loading and configuration.

## 🔐 Security & Authentication Flow
1. **Login**: Client sends credentials. Backend verifies and issues `accessToken` and `refreshToken` as secure, HttpOnly cookies.
2. **Persistence**: On page reload, the frontend calls `/api/auth/me`. The browser automatically includes the HttpOnly cookies, allowing the backend to authenticate the user and return their profile to Redux.
3. **Refresh Token**: If the `accessToken` expires, API calls return a `401 Unauthorized`. The frontend API interceptor automatically catches this, calls `/api/auth/refresh-token` to get a new token, and retries the original request.
