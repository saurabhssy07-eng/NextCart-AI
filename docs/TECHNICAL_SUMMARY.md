# NextCart AI – Full Stack E-Commerce Platform
## Technical Summary (Pre-Execution)

## 1. COMPLETE FOLDER STRUCTURE (SIMPLIFIED)

### Frontend (src/)
```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page-level components (Home, Product, Cart, etc)
│   ├── features/          # Feature-based folders (auth, products, cart)
│   │   ├── auth/
│   │   ├── products/
│   │   ├── cart/
│   │   └── orders/
│   ├── services/          # API calls (axios wrappers)
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Redux store, slices
│   ├── utils/             # Helper functions
│   ├── assets/            # Images, icons, fonts
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .env.local
└── node_modules/
```

### Backend (root)
```
backend/
├── config/
│   ├── db.js
│   └── env.js
├── middleware/
├── models/
├── controllers/
├── services/
├── routes/
├── validators/
├── utils/
├── tests/
├── logs/
├── package.json
├── server.js
├── .env.example
├── .env.local
└── node_modules/
```

---

## 2. FRONTEND PACKAGE.JSON DEPENDENCIES

### Core Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.x | UI library |
| react-dom | 18.x | React DOM rendering |
| react-router-dom | 6.x | Client routing |
| axios | 1.4.x | HTTP requests |
| react-hook-form | 7.45.x | Form management |
| react-toastify | 9.1.x | Notifications |
| @reduxjs/toolkit | 1.9.5 | State management |
| react-redux | 8.x | Redux bindings |

### Dev Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| @vitejs/plugin-react | latest | Vite React plugin |
| vite | 4.3.9+ | Build tool |
| tailwindcss | 3.3.2 | CSS framework |
| postcss | latest | CSS processing |
| autoprefixer | latest | CSS vendor prefixes |
| eslint | latest | Linting |

---

## 3. BACKEND PACKAGE.JSON DEPENDENCIES

### Core Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| express | 4.18.2 | Web framework |
| mongoose | 7.2.0 | MongoDB ODM |
| dotenv | latest | Environment variables |
| cors | latest | CORS middleware |
| bcryptjs | 2.4.3 | Password hashing |
| jsonwebtoken | 9.0.1 | JWT tokens |
| multer | 1.4.5-lts.1 | File uploads |
| cloudinary | latest | Image optimization |
| nodemailer | 6.9.3 | Email sending |
| joi | 17.10.2 | Input validation |
| express-rate-limit | 6.8.0 | Rate limiting |

### Dev Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| nodemon | latest | Auto-restart |
| eslint | latest | Linting |

---

## 4. ENVIRONMENT VARIABLES

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=NextCart AI
```

### Backend (.env.local)
```
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb+srv://nextcart_user:PASSWORD@cluster0.mongodb.net/nextcart

JWT_SECRET=dev_jwt_secret_12345_change_in_production
JWT_EXPIRE=1h
JWT_REFRESH_SECRET=dev_refresh_secret_12345_change_in_production
JWT_REFRESH_EXPIRE=7d

FRONTEND_URL=http://localhost:5173
```

**Required (Milestone 1):** MONGODB_URI, NODE_ENV, PORT, JWT_SECRET, JWT_REFRESH_SECRET  
**Deferred (Milestone 3+):** Cloudinary, Razorpay, SMTP, Admin credentials

---

## 5. MONGODB ATLAS SETUP REQUIREMENTS

### Required Actions:
1. Create free MongoDB Atlas account (M0 tier)
2. Create new project/cluster
3. Create database user `nextcart_user` with password
4. Create database `nextcart`
5. Configure Network Access (allow all: 0.0.0.0/0 for development)
6. Get connection string format: `mongodb+srv://username:password@cluster.mongodb.net/database`

### Security Notes:
- Use strong password for nextcart_user
- Enable IP whitelist in production (0.0.0.0/0 is dev-only)
- Store credentials in .env.local (never commit)
- Regenerate credentials for production

### Collections to Create (Later - Milestone 2+):
- users
- products
- categories
- orders
- cart
- reviews
- coupons
- inventory
- recently_viewed
- recommendations
- payments
- notifications
- analytics
- settings

---

## 6. DISK SPACE REQUIREMENTS

| Component | Size | Notes |
|-----------|------|-------|
| Frontend node_modules | ~500 MB | After npm install |
| Backend node_modules | ~400 MB | After npm install |
| Vite build (dist/) | ~150 KB | Development build |
| Total for Development | ~900 MB | Approximate |
| Git repository (.git/) | ~20 MB | After init |

**Minimum Disk Space Needed:** 2 GB (including OS and other files)

---

## 7. PAID SERVICES INVOLVED

### Completely Free for Development:
- ✅ Node.js & npm - Free
- ✅ VS Code - Free
- ✅ Git - Free
- ✅ MongoDB Atlas (M0 tier) - Free
- ✅ Vite, React, Express - Free

### Optional Paid Services (NOT Required for Setup):
| Service | Usage | Cost | Status |
|---------|-------|------|--------|
| Cloudinary | Image hosting | Free tier: 25GB/month | Optional |
| Razorpay | Payments | Pay per transaction | Optional |
| Gmail SMTP | Email sending | Free with app password | Optional |
| MongoDB Atlas (Paid) | Database storage | $57+/month | Start: Free M0 |

**Recommendation:** All development/setup can be done with zero costs. Paid services only needed for production.

---

## 8. PORTS & CONNECTIONS

| Service | Port | URL | Status |
|---------|------|-----|--------|
| Frontend (Vite) | 5173 | http://localhost:5173 | Development |
| Backend (Express) | 5000 | http://localhost:5000 | Development |
| MongoDB Atlas | 27017 | Cloud connection | Network |
| Git | N/A | Local only | Version control |

---

## 9. CONFIGURATION FILES (Total: 12)

| File | Location | Purpose | Required |
|------|----------|---------|----------|
| vite.config.js | frontend/ | Vite build config | Yes |
| tailwind.config.js | frontend/ | Tailwind CSS config | Yes |
| postcss.config.js | frontend/ | PostCSS config | Yes |
| .env.example | frontend/ | Template (commit) | Yes |
| .env.local | frontend/ | Local dev (ignore) | Yes |
| server.js | backend/ | Express entry point | Yes |
| config/db.js | backend/ | MongoDB connection | Yes |
| config/env.js | backend/ | Config management | Yes |
| .env.example | backend/ | Template (commit) | Yes |
| .env.local | backend/ | Local dev (ignore) | Yes |
| .gitignore | root/ | Git ignore rules | Yes |
| README.md | root/ | Project documentation | Yes |

---

## 10. QUICK REFERENCE

### Terminal Commands
```powershell
# Frontend
npm create vite@latest frontend -- --template react
cd frontend
npm install

# Backend
mkdir backend
cd backend
npm init -y
npm install [all packages listed above]

# Folder structures
[See above for mkdir commands for each folder]

# Run development
cd frontend && npm run dev  # Terminal 1: localhost:5173
cd backend && npm run dev   # Terminal 2: localhost:5000
```

### Verification Commands
```powershell
node --version              # Should be v18+
npm --version               # Should be 9+
git --version               # Should be 2.x+
curl http://localhost:5000/api/health  # Backend health check
```

---

## 11. EXECUTION TIME BREAKDOWN (SIMPLIFIED)

| Phase | Time | What Happens |
|-------|------|--------------|
| Frontend creation | 3 min | npm create vite |
| Frontend dependencies | 4 min | npm install (8 packages) |
| Backend creation | 2 min | mkdir + npm init |
| Backend dependencies | 3 min | npm install (6 packages) |
| Folder structures | 2 min | mkdir commands |
| Configuration files | 10 min | Create 12 files |
| MongoDB setup | 10 min | Atlas account + cluster |
| Git init | 2 min | git init + commit |
| Verification | 5 min | Test all systems |
| **Total** | **~40 minutes** | **First time (lean setup)** |

---

## 12. SYSTEM REQUIREMENTS

### Minimum Hardware:
- RAM: 8 GB (4 GB usable for development)
- Storage: 2 GB free
- CPU: Any modern processor
- Internet: Required (npm packages, MongoDB Atlas)

### Required Software:
- Windows 10 or 11
- Node.js 18+ (includes npm)
- Git 2.x+
- VS Code (optional but recommended)
- Browser (for frontend testing)

### Network:
- Internet connection required for:
  - npm package downloads (~500 MB)
  - MongoDB Atlas cloud connection
  - npm registry access

---

## 13. MILESTONE 1 COMPLETION CRITERIA

Setup is complete when all of these work:

✅ Frontend running on localhost:5173  
✅ Backend running on localhost:5000  
✅ Backend /api/health returns JSON response  
✅ MongoDB Atlas connection established  
✅ Git repository initialized with initial commit  
✅ npm run dev works (both frontend & backend)  
✅ No console errors  

## 14. READY FOR NEXT MILESTONES

After Milestone 1 complete, proceed with:

**Milestone 2: Authentication**
- User registration endpoint
- User login endpoint
- JWT token generation
- Protected route middleware
- Install: joi (input validation)

**Milestone 3: Products**
- Product model & CRUD endpoints
- Category system
- Search & filters
- Install: multer, cloudinary (for images)

**Milestone 4: Cart & Wishlist**
- Add to cart logic
- Cart persistence

**Milestone 5: Orders & Payments**
- Order creation
- Razorpay integration
- Email notifications (nodemailer)

**Milestone 6: Admin Dashboard**
- Admin user role
- Analytics charts
- Rate limiting (express-rate-limit)

---

## READY TO EXECUTE?

Reference this document while following: **QUICK_COMMANDS.md** or **MILESTONE_1_EXECUTION.md**
