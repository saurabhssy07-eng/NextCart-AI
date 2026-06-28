# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Planned
- **Milestone 4: User Management** (Profiles, Addresses, Wishlist, History, Settings)
- **Milestone 5: Product Management** (Admin CRUD, Inventory)
- **Milestone 6: Cart & Checkout** (Addresses, Coupons, Summaries)
- **Milestone 7: Payments** (Razorpay Integration)

## [0.1.0] - Foundation & Authentication (Milestones 1-3)
### Added
- **Project Structure**: Set up frontend (React + Vite) and backend (Node.js + Express) architecture.
- **Database**: Integrated MongoDB Atlas with Mongoose models (`User`, `Product`, `Category`, `Order`).
- **Authentication System**:
  - Secure JWT authentication with HttpOnly cookies.
  - Refresh Token mechanism for seamless sessions.
  - Google OAuth integration.
  - Rate limiting for login and password reset routes to prevent brute-force attacks.
- **Email Verification & Password Reset**:
  - Email sending utility using Ethereal Email (Development mode).
  - Verification tokens and expiration handling.
  - Forgot/Reset password flows.
- **Frontend UI & State**:
  - Redux Toolkit setup for state management (`authSlice`).
  - React Router DOM for routing and `ProtectedRoute` components for authenticated views.
  - Responsive layout with Tailwind CSS.
  - Toast notifications for user feedback.
- **State Persistence**: Fixed Redux state loss on page refresh by securely fetching user profile (`/api/auth/me`) on app initialization.
- **Development Scripts**: Added `start_servers.bat` for easy local startup.

### Fixed
- Fixed backend environment variables pointing to incorrect ports.
- Fixed session persistence on page refresh by introducing `AuthInit` component.
