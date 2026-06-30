# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-rc1] - 2026-06-29
### Added
- **AI Product Assistant (Phase 7.1)**:
  - Deployed stateless AI Q&A chat and quick insights summaries inside product detail pages.
  - Built visual summary panels highlighting pros, cons, target customer recommendations, and database alternatives.
- **Conversational Hybrid AI Search (Phase 7.2)**:
  - Deployed synonym dictionaries and canonical singular normalization filters.
  - Built an AI-independent intent parser extracting category, brand, budget bounds, and keywords.
  - Created relevance-scoring engine applying configurable weights (`keyword: 0.4, category: 0.3, budget: 0.2, rating: 0.1`) and budget overage penalties.
  - Deployed index-based Gemini 1.5 ranking provider with local rule fallbacks and output validation checks.
  - Deployed dynamic Node-Cache invalidation using Catalog Version tracking.
  - Designed interactive multi-turn ChatGPT-style console pages with sequential loading progress status bars and budget limit suggests cards.
- **Razorpay Payment Integration (Phase 6)**:
  - Integrated secure server-side verification and signatures check.
  - Created a robust Razorpay payment retry gateway allowing users to retry failed checkout sessions.
- **Catalog Management (Phase 5)**:
  - Added support for complex attributes, color selections, and variant pricing.
  - Deployed user reviews system with average ratings tracking.
- **User Accounts & Checkouts (Phase 4)**:
  - Profile editors and shipping address book controls.
  - Persistent shopping carts, wishlist toggles, and side-by-side comparison tables.

## [0.1.0] - Foundation & Authentication (Milestones 1-3)
### Added
- **Project Structure**: Set up frontend (React + Vite) and backend (Node.js + Express) architecture.
- **Database**: Integrated MongoDB Atlas with Mongoose models (`User`, `Product`, `Category`, `Order`).
- **Authentication System**:
  - Secure JWT authentication with HttpOnly cookies.
  - Refresh Token mechanism for seamless sessions.
  - Google OAuth integration.
  - Rate limiting for login and password reset routes.
- **Email Verification & Password Reset**:
  - Email sending utility using Ethereal Email.
  - Verification tokens and expiration handling.
  - Forgot/Reset password flows.
- **Frontend UI & State**:
  - Redux Toolkit setup for state management (`authSlice`).
  - React Router DOM for routing and `ProtectedRoute` components.
  - Responsive layout with Tailwind CSS.
  - Toast notifications for user feedback.
- **State Persistence**: Securely fetching user profile (`/api/auth/me`) on app initialization.
- **Development Scripts**: Added `start_servers.bat` for easy local startup.

### Fixed
- Fixed backend environment variables pointing to incorrect ports.
- Fixed session persistence on page refresh by introducing `AuthInit` component.
