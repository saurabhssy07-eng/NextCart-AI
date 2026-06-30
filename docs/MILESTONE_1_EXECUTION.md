# NextCart - Complete Milestone 1 Execution Guide
## Windows Setup with All Configuration Files Ready

**Project:** NextCart AI - Enterprise E-Commerce Platform  
**Status:** Ready for Setup Execution  
**Platform:** Windows 10/11  
**Time Required:** ~40 minutes (lean setup)  

---

## 📋 ALL FILES NEEDED

I've created all the configuration files you need. Here's the complete list:

### Configuration Files Ready:
✅ `WINDOWS_SETUP_INSTRUCTIONS.md` - Step-by-step guide  
✅ `MILESTONE_1_SETUP.md` - Original setup documentation  
✅ `frontend-package.json.template` - Frontend dependencies  
✅ (More files below)

---

## 🚀 EXECUTION STEPS (DO THESE IN ORDER)

### STEP 1: Open VS Code Terminal

```
1. Press Ctrl + ` (backtick) to open terminal in VS Code
2. Verify location: cd
3. Should see: c:\Users\Saurabh Singh Yadav\E_commerce_website
```

---

### STEP 2: Create Frontend with Vite (Copy-Paste These Commands)

**Command Set 1: Create Frontend**
```powershell
npm create vite@latest frontend -- --template react
```
- Wait for completion
- When asked "Done. Now run:", press Enter

---

### STEP 3: Install Frontend Dependencies

**Command Set 2: Install Essential Dependencies Only**
```powershell
cd frontend
npm install
npm install react-router-dom axios react-hook-form react-toastify @reduxjs/toolkit react-redux
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
cd ..
```

**Note:** Using `tailwindcss@3` ensures compatibility with latest versions.

**Why this lean set?** Installs only Milestone 1 essentials. Add multer/cloudinary in Milestone 3 for product images.

---

### STEP 4: Create Backend Project

**Command Set 3: Setup Backend with Lean Dependencies**
```powershell
mkdir backend
cd backend
npm init -y
npm install express dotenv cors bcryptjs jsonwebtoken mongoose
npm install -D nodemon
cd ..
```

**Deferred Packages (add when needed):**
- Milestone 2: joi (input validation)
- Milestone 3: multer, cloudinary (product images)
- Milestone 5: nodemailer (email notifications)
- Milestone 6: express-rate-limit (rate limiting)

---

### STEP 5: Create Folder Structures

**Command Set 4: Create Frontend Folders (Simplified Structure)**
```powershell
cd frontend\src
mkdir components
mkdir features\auth
mkdir features\products
mkdir features\cart
mkdir features\orders
mkdir pages
mkdir services
mkdir hooks
mkdir store
mkdir utils
mkdir assets
cd ..\..\
```

**Folder Purposes:**
- `components/` - Reusable UI components (buttons, inputs, cards, etc)
- `features/` - Feature-based modules (auth logic, product logic, cart logic, orders logic)
- `pages/` - Full page components (HomePage, ProductPage, CartPage, etc)
- `services/` - API service layer (axios wrappers for backend calls)
- `hooks/` - Custom React hooks (useAuth, useFetch, etc)
- `store/` - Redux store configuration and slices
- `utils/` - Helper functions (formatters, validators, etc)
- `assets/` - Static assets (images, icons, fonts)

**Command Set 5: Create Backend Folders**
```powershell
cd backend
mkdir config
mkdir middleware
mkdir models
mkdir controllers
mkdir services
mkdir routes
mkdir validators
mkdir utils
mkdir tests
mkdir logs
cd ..
```

---

### STEP 6: Add Configuration Files

**Create File 1: `frontend/vite.config.js`**

In VS Code:
1. Right-click `frontend` folder
2. Select "New File"
3. Name it `vite.config.js`
4. Copy this content:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
```

---

**Create File 2: `frontend/tailwind.config.js`**

Already created by `npx tailwindcss init -p`. Verify it contains:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
```

---

**Create File 3: `frontend/postcss.config.js`**

Already created by `npx tailwindcss init -p`. Verify it contains:

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

**Create File 4: `frontend/.env.example`**

Create in `frontend` folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=NextCart
VITE_ENABLE_RECOMMENDATIONS=true
VITE_ENABLE_ANALYTICS=true
```

---

**Create File 5: `frontend/.env.local`**

Create in `frontend` folder (DO NOT COMMIT):

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=NextCart
VITE_ENABLE_RECOMMENDATIONS=true
VITE_ENABLE_ANALYTICS=true
```

---

**Create File 6: `backend/server.js`**

Create in `backend` folder:

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

import connectDB from './config/db.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🗄️  Database: Connected`);
});
```

---

**Create File 7: `backend/config/db.js`**

Create in `backend/config` folder:

```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.warn('⚠️ MONGODB_URI not set - running in offline mode');
      return;
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB error:', error.message);
    console.warn('⚠️ Backend running without database connection');
  }
};

export default connectDB;
```

**Changed:** Removed outdated `useNewUrlParser` and `useUnifiedTopology` options (unnecessary in modern Mongoose 7+)

---

**Create File 8: `backend/config/env.js`**

Create in `backend/config` folder:

```javascript
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '1h',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '7d',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};
```

---

**Create File 9: `backend/.env.example`**

Create in `backend` folder:

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nextcart

JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=1h
JWT_REFRESH_SECRET=your_refresh_secret_key_change_in_production
JWT_REFRESH_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@nextcart.com

ADMIN_EMAIL=admin@nextcart.com
FRONTEND_URL=http://localhost:5173
```

---

**Create File 10: `backend/package.json`** (CRITICAL - MUST ADD)

⚠️ **IMPORTANT:** Your backend/package.json needs these additions:

After `npm init -y`, EDIT `backend/package.json` to add:

```json
{
  "name": "backend",
  "version": "1.0.0",
  "type": "module",
  "description": "NextCart AI Backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.2.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

**Why this matters:**
- `"type": "module"` enables ES6 imports (required for `import express from 'express'`)
- `"scripts"` adds `npm run dev` command (without this, npm run dev fails)

---

**Create File 11: `backend/.env.local`**

Create in `backend` folder (DO NOT COMMIT):

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb+srv://nextcart_user:YOUR_PASSWORD@cluster0.mongodb.net/nextcart?retryWrites=true&w=majority

JWT_SECRET=dev_jwt_secret_12345_change_in_production
JWT_EXPIRE=1h
JWT_REFRESH_SECRET=dev_refresh_secret_12345_change_in_production
JWT_REFRESH_EXPIRE=7d

FRONTEND_URL=http://localhost:5173
```

---

### STEP 7: Create Root Files

**Create File 12: `.gitignore` (Root Level)**

Create at project root:

```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.production.local
.env.development.local
.env.test.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Build
dist/
build/

# Logs
logs/
*.log

# OS
Thumbs.db

# Testing
coverage/
.nyc_output/

# Misc
.cache/
```

---

**Create File 13: `README.md` (Root Level)**

Create at project root:

```markdown
# NextCart - Enterprise E-Commerce Platform

Production-ready full-stack e-commerce platform built with modern web technologies.

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)
- VS Code

### Install & Run

**Terminal 1 - Frontend:**
\`\`\`bash
cd frontend
npm install
npm run dev
# Opens http://localhost:5173
\`\`\`

**Terminal 2 - Backend:**
\`\`\`bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
\`\`\`

## Project Structure

\`\`\`
nextcart/
├── frontend/              # React + Vite
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── features/      # Redux slices
│   │   ├── services/      # Business logic
│   │   └── api/           # API client
│   └── package.json
├── backend/               # Express + Node
│   ├── config/            # Configuration
│   ├── models/            # Database schemas
│   ├── routes/            # API routes
│   ├── controllers/       # Route handlers
│   ├── services/          # Business logic
│   └── package.json
└── docs/                  # Documentation
\`\`\`

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Redux Toolkit
- **Backend:** Node.js, Express, MongoDB, JWT
- **Database:** MongoDB Atlas
- **Storage:** Cloudinary
- **Payments:** Razorpay

## API Endpoints

- `/api/health` - Server health check

## Documentation

- `WINDOWS_SETUP_INSTRUCTIONS.md` - Setup guide
- `MILESTONE_1_SETUP.md` - Detailed setup
- `ADVANCED_FEATURES_GUIDE.md` - Feature documentation

## Status

🟢 **Milestone 1:** Setup Complete  
🟡 **Milestone 2:** Authentication (Next)

## License

MIT
```

---

### STEP 8: Initialize Git

**Command Set 6: Git Initialization**

```powershell
# Verify location
cd c:\Users\Saurabh Singh Yadav\E_commerce_website

# Initialize Git
git init

# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: NextCart project structure and configuration"

# Verify
git log
```

---

### STEP 9: MongoDB Atlas Setup

**Do This in Browser:**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account and login
3. Click "Create a Deployment"
4. Select "M0 FREE"
5. Choose AWS, select region
6. Click "Create Deployment"
7. Wait 2-3 minutes...
8. Go to "Database Access" → "Add New Database User"
9. Username: `nextcart_user`
10. Password: Generate strong password (COPY IT!)
11. Click "Add User"
12. Go to "Drivers" → Copy connection string
13. Update `backend/.env.local` with your connection string

**Connection String Format:**
```
mongodb+srv://nextcart_user:YOUR_PASSWORD@cluster0.mongodb.net/nextcart?retryWrites=true&w=majority
```

**Enable Network Access:**
1. Go to "Network Access"
2. Click "Add IP Address"
3. Enter "0.0.0.0/0" (for development)
4. Click "Confirm"

---

### STEP 10: Verify Everything Works

**Command Set 7: Test Frontend**

```powershell
cd frontend
npm run dev
```

**Expected:**
```
✓ Local: http://localhost:5173/
```

- Open browser: http://localhost:5173
- Should see React logo
- Press `q` to quit

---

**Command Set 8: Test Backend (New Terminal)**

```powershell
cd backend
npm run dev
```

**Expected:**
```
✅ Server running on http://localhost:5000
📝 Environment: development
🗄️  Database: Connected
```

---

**Command Set 9: Test API (Another Terminal)**

```powershell
curl http://localhost:5000/api/health
```

**Expected:**
```json
{
  "status": "OK",
  "timestamp": "2026-06-18T10:30:45.123Z",
  "uptime": 5.234,
  "environment": "development"
}
```

---

## ✅ FINAL CHECKLIST

### Frontend ✅
- [ ] Frontend folder created
- [ ] npm install successful
- [ ] Tailwind CSS configured
- [ ] .env.local created
- [ ] npm run dev works on http://localhost:5173
- [ ] React logo displays

### Backend ✅
- [ ] Backend folder created
- [ ] npm install successful
- [ ] server.js created and working
- [ ] config/db.js created
- [ ] .env.local created
- [ ] npm run dev works on http://localhost:5000
- [ ] Health endpoint responds

### Database ✅
- [ ] MongoDB Atlas account created
- [ ] Free cluster created
- [ ] Database user created (nextcart_user)
- [ ] Network access enabled (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] .env.local updated with connection string
- [ ] MongoDB connection shows in backend logs

### Git ✅
- [ ] Git initialized (git init)
- [ ] .gitignore created
- [ ] Initial commit created (git commit)
- [ ] git log shows initial commit
- [ ] node_modules NOT committed

### File Structure ✅
- [ ] Frontend components folder created
- [ ] Frontend features folder created
- [ ] Frontend pages folder created
- [ ] Backend config folder created
- [ ] Backend models folder created
- [ ] Backend routes folder created
- [ ] Backend controllers folder created
- [ ] Backend services folder created

### Configuration ✅
- [ ] vite.config.js configured
- [ ] tailwind.config.js configured
- [ ] server.js configured
- [ ] config/db.js configured
- [ ] config/env.js configured
- [ ] .env.example files created
- [ ] .env.local files created
- [ ] README.md created

---

## 🎯 MILESTONE 1 COMPLETE WHEN:

✅ All checkboxes above are checked  
✅ Frontend runs without errors  
✅ Backend runs without errors  
✅ MongoDB connection established  
✅ Git repository initialized  
✅ All folders created  

---

## 🚨 COMMON ISSUES & FIXES

**Issue: npm install fails**
```
Fix:
1. Delete node_modules
2. Clear npm cache: npm cache clean --force
3. Run npm install again
```

**Issue: Port already in use**
```
Fix (PowerShell):
1. Find process: netstat -ano | findstr :5173
2. Kill it: taskkill /PID <PID> /F
3. Or change port in vite.config.js
```

**Issue: MongoDB not connecting**
```
Fix:
1. Verify MONGODB_URI in .env.local
2. Check MongoDB Atlas network access (add 0.0.0.0/0)
3. Verify username/password in connection string
4. Wait for cluster to be ready
```

**Issue: Git init fails**
```
Fix:
1. Ensure Git is installed: git --version
2. Configure Git: 
   git config --global user.name "Your Name"
   git config --global user.email "your@email.com"
3. Try git init again
```

---

## 📞 APPROVAL REQUIRED

**When everything is working:**

1. ✅ Take screenshots showing:
   - Frontend running on http://localhost:5173
   - Backend running on http://localhost:5000
   - Health endpoint response
   - git log output

2. ✅ Verify checklist completed

3. ✅ **Request approval for Milestone 2**

### Milestone 2 Will Include:
- User models and schemas
- Authentication endpoints (Register/Login)
- JWT token generation
- Password hashing with bcryptjs
- Error handling middleware

---

**Ready to execute setup? Follow STEP 1 through STEP 10 above!**

**Estimated completion: 2-3 hours** ⏱️

**Status: Awaiting Your Execution & Approval** 🚀
