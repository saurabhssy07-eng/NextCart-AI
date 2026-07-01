# NextCart - Complete Windows Setup Guide
## Step-by-Step Project Initialization for VS Code Terminal

**Project:** NextCart AI - Enterprise E-Commerce Platform  
**Platform:** Windows 10/11  
**Terminal:** VS Code Integrated Terminal  
**Date:** June 18, 2026

---

## ⚠️ IMPORTANT: Before You Start

### Prerequisites (Install if needed)
1. **Node.js 18+** - Download from [nodejs.org](https://nodejs.org)
   - Run installer, accept defaults
   - Verify: `node --version` and `npm --version`

2. **Git for Windows** - Download from [git-scm.com](https://git-scm.com)
   - Run installer, accept defaults
   - Verify: `git --version`

3. **MongoDB Atlas Account** - Sign up at [mongodb.com](https://www.mongodb.com/cloud/atlas)
   - Free tier available

4. **VS Code** - Download from [code.visualstudio.com](https://code.visualstudio.com)
   - Already installed (you're using it!)

---

## 🚀 PHASE 1: PROJECT INITIALIZATION (30 minutes)

### Step 1: Open VS Code Terminal

```
1. Open your project folder in VS Code
   Path: c:\Users\Saurabh Singh Yadav\E_commerce_website

2. Open terminal: Ctrl + ` (backtick)
   
3. Verify you're in the correct directory:
   Command: cd
   You should see: c:\Users\Saurabh Singh Yadav\E_commerce_website
```

**Expected Output:**
```
PS C:\Users\Saurabh Singh Yadav\E_commerce_website>
```

---

### Step 2: Create Frontend Project with Vite

```powershell
# Command 1: Create Vite + React frontend
npm create vite@latest frontend -- --template react

# Press Enter when asked
# Wait for completion (~30 seconds)
```

**Expected Output:**
```
✔ Done. Now run:
  cd frontend
  npm install
  npm run dev
```

---

### Step 3: Install Frontend Dependencies

```powershell
# Command 2: Navigate to frontend folder
cd frontend

# Command 3: Install core dependencies
npm install

# Command 4: Install React Router and HTTP client
npm install react-router-dom axios

# Command 5: Install form management
npm install react-hook-form

# Command 6: Install toast notifications
npm install react-toastify

# Command 7: Install state management
npm install @reduxjs/toolkit react-redux redux

# Command 8: Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# Command 9: Initialize Tailwind
npx tailwindcss init -p

# Command 10: Navigate back to root
cd ..
```

**Expected Output After Each Command:**
- `added XXX packages` - indicates successful installation
- After `npx tailwindcss init -p`:
  - Created `tailwind.config.js`
  - Created `postcss.config.js`

---

### Step 4: Create Backend Project

```powershell
# Command 11: Create backend folder
mkdir backend

# Command 12: Navigate to backend
cd backend

# Command 13: Initialize Node.js project
npm init -y

# This creates package.json with default settings
```

**Expected Output:**
```
Created package.json
```

---

### Step 5: Install Backend Dependencies

```powershell
# Command 14: Install Express and core dependencies
npm install express dotenv cors

# Command 15: Install authentication
npm install bcryptjs jsonwebtoken

# Command 16: Install database
npm install mongoose

# Command 17: Install file upload
npm install multer

# Command 18: Install image storage
npm install cloudinary

# Command 19: Install email service
npm install nodemailer

# Command 20: Install validation
npm install joi

# Command 21: Install rate limiting
npm install express-rate-limit

# Command 22: Install development tools
npm install -D nodemon eslint

# Command 23: Navigate back to root
cd ..
```

**Expected Output:**
- Each command should show `added XXX packages`

---

## 📁 PHASE 2: FOLDER STRUCTURE CREATION (20 minutes)

### Step 6: Create Frontend Folder Structure

```powershell
# Command 24: Navigate to frontend src
cd frontend\src

# Create component folders
mkdir components
mkdir components\Atoms
mkdir components\Molecules
mkdir components\Organisms
mkdir components\Templates

# Create feature folders (Redux)
mkdir features
mkdir features\auth
mkdir features\products
mkdir features\cart
mkdir features\orders

# Create page folders
mkdir pages
mkdir pages\auth
mkdir pages\user
mkdir pages\admin

# Create utility folders
mkdir hooks
mkdir services
mkdir api
mkdir utils
mkdir styles
mkdir store

# Navigate back to root
cd ..\..\
```

**Expected Output:**
```
All folders created successfully
```

---

### Step 7: Create Backend Folder Structure

```powershell
# Command 25: Navigate to backend
cd backend

# Create config folder
mkdir config

# Create middleware folder
mkdir middleware

# Create models folder
mkdir models

# Create controllers folder
mkdir controllers

# Create services folder
mkdir services

# Create routes folder
mkdir routes

# Create validators folder
mkdir validators

# Create utilities folder
mkdir utils

# Create tests folder
mkdir tests

# Create logs folder
mkdir logs

# Navigate back to root
cd ..
```

**Expected Output:**
```
All folders created successfully
```

---

## ⚙️ PHASE 3: CONFIGURATION FILES (25 minutes)

### Step 8: Copy Frontend Configuration Files

I will provide you files to create. **Create each file as specified below:**

#### File 1: `frontend/package.json`
**Location:** `frontend\package.json`

Replace the existing content with the file from section "Frontend package.json" below.

#### File 2: `frontend/vite.config.js`
**Location:** `frontend\vite.config.js`

Create this file with content from section "Vite Config" below.

#### File 3: `frontend/tailwind.config.js`
**Location:** `frontend\tailwind.config.js`

Should already exist. Verify it matches the content below.

#### File 4: `frontend/postcss.config.js`
**Location:** `frontend\postcss.config.js`

Should already exist. Verify it matches the content below.

#### File 5: `frontend/.env.example`
**Location:** `frontend\.env.example`

Create this file with environment variables template.

#### File 6: `frontend/.env.local`
**Location:** `frontend\.env.local`

Create this file for local development (DO NOT COMMIT).

---

### Step 9: Copy Backend Configuration Files

#### File 7: `backend/server.js`
**Location:** `backend\server.js`

Create this file with the backend server configuration.

#### File 8: `backend/app.js`
**Location:** `backend\app.js`

Create this file with Express app setup.

#### File 9: `backend/config/db.js`
**Location:** `backend\config\db.js`

Create this file with MongoDB connection.

#### File 10: `backend/config/env.js`
**Location:** `backend\config\env.js`

Create this file with environment configuration.

#### File 11: `backend/package.json`
**Location:** `backend\package.json`

Replace existing content with backend package.json.

#### File 12: `backend/.env.example`
**Location:** `backend\.env.example`

Create this file with environment variables template.

#### File 13: `backend/.env.local`
**Location:** `backend\.env.local`

Create this file for local development (DO NOT COMMIT).

---

### Step 10: Create Root Configuration Files

#### File 14: `.gitignore`
**Location:** `.gitignore` (at project root)

Create this file to exclude files from Git.

#### File 15: `README.md`
**Location:** `README.md` (at project root)

Create project documentation.

#### File 16: `setup.bat`
**Location:** `setup.bat` (at project root)

Create Windows batch script for future setup.

---

## 📝 PHASE 4: FILE CONTENTS

### Frontend Configuration Files

#### `frontend/package.json`
```json
{
  "name": "nextcart-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .js,.jsx"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.0",
    "axios": "^1.4.0",
    "react-hook-form": "^7.45.0",
    "react-toastify": "^9.1.3",
    "@reduxjs/toolkit": "^1.9.5",
    "react-redux": "^8.1.1",
    "redux": "^4.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.14",
    "@types/react-dom": "^18.2.6",
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.3.9",
    "tailwindcss": "^3.3.2",
    "postcss": "^8.4.24",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.44.0",
    "eslint-plugin-react": "^7.32.2"
  }
}
```

#### `frontend/vite.config.js`
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

#### `frontend/tailwind.config.js`
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

#### `frontend/postcss.config.js`
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### `frontend/.env.example`
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=NextCart
VITE_ENABLE_RECOMMENDATIONS=true
VITE_ENABLE_ANALYTICS=true
```

#### `frontend/.env.local`
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=NextCart
VITE_ENABLE_RECOMMENDATIONS=true
VITE_ENABLE_ANALYTICS=true
```

---

### Backend Configuration Files

#### `backend/server.js`
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

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
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
});
```

#### `backend/app.js`
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
```

#### `backend/config/db.js`
```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined');
    }

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
```

#### `backend/config/env.js`
```javascript
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '1h',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
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

#### `backend/package.json`
```json
{
  "name": "nextcart-backend",
  "version": "1.0.0",
  "description": "NextCart Backend - Enterprise E-commerce API",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["ecommerce", "nextcart", "mern"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.2.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.1",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^1.36.2",
    "nodemailer": "^6.9.3",
    "joi": "^17.10.2",
    "express-rate-limit": "^6.8.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "eslint": "^8.44.0"
  }
}
```

#### `backend/.env.example`
```env
NODE_ENV=development
PORT=5000
HOST=localhost

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nextcart

JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=1h
JWT_REFRESH_SECRET=your_refresh_token_secret_here
JWT_REFRESH_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@nextcart.com

ADMIN_EMAIL=admin@nextcart.com
FRONTEND_URL=http://localhost:5173
```

#### `backend/.env.local`
```env
NODE_ENV=development
PORT=5000
HOST=localhost

MONGODB_URI=<YOUR_MONGODB_CONNECTION_STRING>

JWT_SECRET=dev_jwt_secret_key_12345_change_this
JWT_EXPIRE=1h
JWT_REFRESH_SECRET=dev_refresh_secret_key_12345_change_this
JWT_REFRESH_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
SMTP_FROM=noreply@nextcart.com

ADMIN_EMAIL=admin@nextcart.com
FRONTEND_URL=http://localhost:5173
```

---

### Root Configuration Files

#### `.gitignore`
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
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Misc
.cache/
```

#### `README.md`
```markdown
# NextCart - Enterprise E-Commerce Platform

NextCart is a production-ready, full-stack e-commerce platform built with modern web technologies.

## Project Structure

\`\`\`
nextcart/
├── frontend/    # React + Vite frontend
├── backend/     # Node + Express backend
└── docs/        # Documentation
\`\`\`

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Razorpay account

### Setup
1. Clone the repository
2. Follow Frontend Setup
3. Follow Backend Setup

### Frontend
- Development: \`npm run dev\`
- Build: \`npm run build\`

### Backend
- Development: \`npm run dev\`
- Start: \`npm start\`

## Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Redux Toolkit

**Backend:**
- Node.js + Express
- MongoDB
- JWT Auth

## Documentation

See MILESTONE_1_SETUP.md for detailed setup.
```

---

## 🔐 PHASE 5: ENVIRONMENT CONFIGURATION (15 minutes)

### Step 11: Create Environment Files

```powershell
# Command 26: Create frontend environment file
# Note: Use VS Code to create files - right-click in Explorer > New File

# File location: frontend\.env.local
# Copy content from "frontend/.env.local" section above

# File location: frontend\.env.example  
# Copy content from "frontend/.env.example" section above
```

```powershell
# Command 27: Create backend environment file
# File location: backend\.env.local
# Copy content from "backend/.env.local" section above

# File location: backend\.env.example
# Copy content from "backend/.env.example" section above
```

**IMPORTANT: .env.local files should NEVER be committed to Git**

---

## 🐙 PHASE 6: GIT INITIALIZATION (5 minutes)

### Step 12: Initialize Git Repository

```powershell
# Command 28: Verify you're in project root
cd c:\Users\Saurabh Singh Yadav\E_commerce_website

# Command 29: Initialize Git repository
git init

# Command 30: Create .gitignore file
# Use VS Code - right-click > New File > .gitignore
# Copy content from ".gitignore" section above

# Command 31: Check git status
git status

# Should show multiple untracked files including node_modules/
# but NOT .env.local files (they should be ignored)
```

**Expected Output:**
```
On branch master

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        frontend/
        backend/
        .gitignore
        README.md
```

---

### Step 13: Initial Git Commit

```powershell
# Command 32: Stage all files
git add .

# Command 33: Create initial commit
git commit -m "Initial commit: NextCart project structure and configuration"

# Command 34: Check git log
git log

# Should show your initial commit
```

**Expected Output:**
```
[master (root-commit) abc1234] Initial commit: NextCart project structure
 XX files changed, XXXX insertions(+)
```

---

## 🛢️ PHASE 7: MONGODB ATLAS SETUP (10 minutes)

### Step 14: Set Up MongoDB Atlas Cloud Database

**Part 1: Create MongoDB Account**
```
1. Open browser: https://www.mongodb.com/cloud/atlas
2. Click "Sign Up" or "Login"
3. Create account with email/password
4. Verify your email
5. Complete account setup
```

**Part 2: Create Free Cluster**
```
1. After login, click "Create a Deployment"
2. Select "M0 FREE" (Free tier)
3. Choose "AWS" as cloud provider
4. Select region closest to you
5. Click "Create Deployment"
6. Wait 2-3 minutes for cluster creation
```

**Part 3: Create Database User**
```
1. Go to "Database Access" section
2. Click "Add New Database User"
3. Username: nextcart_user
4. Password: Generate strong password (copy it!)
5. Click "Add User"
6. Click "Confirm"
```

**Part 4: Get Connection String**
```
1. Go to "Drivers" or click "Connect"
2. Select "Drivers" > "Node.js"
3. Copy connection string (it looks like):
   mongodb+srv://nextcart_user:PASSWORD@cluster0.mongodb.net/
4. Replace PASSWORD with your actual password
5. Add database name at end:
   mongodb+srv://nextcart_user:PASSWORD@cluster0.mongodb.net/nextcart?retryWrites=true&w=majority
```

**Part 5: Update Backend .env.local**
```
1. Open backend\.env.local in VS Code
2. Find line: MONGODB_URI=mongodb+srv://...
3. Paste your connection string
4. Save file (Ctrl+S)
```

**Example:**
```env
MONGODB_URI=mongodb+srv://nextcart_user:MyP@ssw0rd123@cluster0.mongodb.net/nextcart?retryWrites=true&w=majority
```

---

### Step 15: Enable Network Access

```
1. In MongoDB Atlas, go to "Network Access"
2. Click "Add IP Address"
3. For development: Enter "0.0.0.0/0" (allows all IPs)
4. Click "Confirm"
5. Wait for update to apply
```

**⚠️ Warning:** 0.0.0.0/0 is for development only. Use specific IPs in production.

---

## ✅ PHASE 8: VERIFICATION (15 minutes)

### Step 16: Verify Frontend Setup

```powershell
# Command 35: Navigate to frontend
cd frontend

# Command 36: Start development server
npm run dev

# Should show:
# ✓ Local: http://localhost:5173/
# ✓ press q to quit

# Test in browser: http://localhost:5173
# Should see Vite + React welcome page
```

**Expected Output:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press q to quit
```

**Action:** 
- Open browser to http://localhost:5173
- Should see React logo and "Vite + React"
- Press `q` in terminal to stop

---

### Step 17: Verify Backend Setup (New Terminal)

```powershell
# Command 37: Open new terminal (Ctrl+Shift+`)
# Keep frontend running in first terminal

# Command 38: Navigate to backend from root
cd backend

# Command 39: Start backend server
npm run dev

# Should show:
# ✅ Server running on http://localhost:5000
# 📝 Environment: development
```

**Expected Output:**
```
✅ Server running on http://localhost:5000
📝 Environment: development
```

---

### Step 18: Verify Backend Endpoints

```powershell
# Command 40: Test health endpoint (in PowerShell while backend runs)
curl http://localhost:5000/api/health

# Should return:
# {"status":"OK","timestamp":"2026-06-18T...","uptime":XX.XX}
```

**Expected Output:**
```json
{
  "status": "OK",
  "timestamp": "2026-06-18T10:30:45.123Z",
  "uptime": 5.234
}
```

---

### Step 19: Verify Database Connection

**In VS Code Terminal:**

```powershell
# The backend logs should show:
# ✅ MongoDB connected: cluster0-shard-00-00.xxxxx.mongodb.net

# If you see connection error:
# Check MONGODB_URI in backend\.env.local
# Verify username/password
# Ensure network access is enabled
```

---

## 📊 PHASE 9: FINAL VERIFICATION CHECKLIST

Create a file: `SETUP_VERIFICATION.md`

```markdown
# NextCart Setup Verification

## ✅ Frontend Verification
- [ ] Node.js installed (v18+)
- [ ] Frontend folder created
- [ ] npm install successful
- [ ] Tailwind CSS configured
- [ ] vite.config.js created
- [ ] npm run dev works (http://localhost:5173)
- [ ] React page loads

## ✅ Backend Verification
- [ ] Backend folder created
- [ ] npm install successful
- [ ] server.js created
- [ ] config/db.js created
- [ ] npm run dev works (http://localhost:5000)
- [ ] Health endpoint responds (/api/health)

## ✅ Environment Verification
- [ ] .env.local files created
- [ ] .env.example files created
- [ ] MONGODB_URI configured
- [ ] JWT secrets configured
- [ ] (Optional) Cloudinary configured
- [ ] (Optional) Razorpay configured

## ✅ Database Verification
- [ ] MongoDB Atlas account created
- [ ] Free cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string obtained
- [ ] MongoDB connected in backend logs

## ✅ Git Verification
- [ ] Git initialized (git init)
- [ ] .gitignore created
- [ ] .env.local in .gitignore
- [ ] Initial commit created (git commit)
- [ ] node_modules not committed

## ✅ Folder Structure Verification
### Frontend
- [ ] frontend/public/ exists
- [ ] frontend/src/ exists
- [ ] frontend/src/components/ exists
- [ ] frontend/src/pages/ exists
- [ ] frontend/src/features/ exists
- [ ] frontend/src/hooks/ exists
- [ ] frontend/src/services/ exists
- [ ] frontend/src/api/ exists
- [ ] frontend/src/utils/ exists
- [ ] frontend/src/styles/ exists
- [ ] frontend/src/store/ exists

### Backend
- [ ] backend/config/ exists
- [ ] backend/middleware/ exists
- [ ] backend/models/ exists
- [ ] backend/controllers/ exists
- [ ] backend/services/ exists
- [ ] backend/routes/ exists
- [ ] backend/validators/ exists
- [ ] backend/utils/ exists
- [ ] backend/tests/ exists

## 🎯 Status: Ready for Phase 2
If all checkboxes are checked, you're ready to proceed to authentication setup!
```

---

## 🚨 TROUBLESHOOTING

### Frontend Issues

**Problem: npm run dev fails**
```
Solution:
1. Delete node_modules folder
2. Run: npm install
3. Run: npm run dev
```

**Problem: Port 5173 already in use**
```
Solution:
1. Find process using port: netstat -ano | findstr :5173
2. Kill process: taskkill /PID <PID> /F
3. Or change port in vite.config.js
```

**Problem: Tailwind not working**
```
Solution:
1. Verify tailwind.config.js exists
2. Verify postcss.config.js exists
3. Verify src/index.css has @tailwind directives
4. Restart npm run dev
```

---

### Backend Issues

**Problem: npm run dev fails**
```
Solution:
1. Delete node_modules folder
2. Run: npm install
3. Run: npm run dev
```

**Problem: Port 5000 already in use**
```
Solution:
1. Find process: netstat -ano | findstr :5000
2. Kill process: taskkill /PID <PID> /F
3. Or change PORT in .env.local
```

**Problem: MongoDB connection fails**
```
Solution:
1. Verify MONGODB_URI in backend\.env.local
2. Check MongoDB Atlas network access (0.0.0.0/0)
3. Verify username/password in connection string
4. Restart backend
```

---

## 📋 COMMAND SUMMARY (Quick Reference)

```powershell
# Frontend Setup
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install react-router-dom axios react-hook-form react-toastify
npm install @reduxjs/toolkit react-redux redux
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
cd ..

# Backend Setup
mkdir backend
cd backend
npm init -y
npm install express dotenv cors bcryptjs jsonwebtoken mongoose multer cloudinary nodemailer joi express-rate-limit
npm install -D nodemon eslint
cd ..

# Git Setup
git init
git add .
git commit -m "Initial commit: NextCart setup"

# Run Frontend
cd frontend
npm run dev

# Run Backend (new terminal)
cd backend
npm run dev

# Test Backend
curl http://localhost:5000/api/health
```

---

## 🎯 SUCCESS CHECKLIST

When everything is set up correctly, you should have:

✅ **Frontend**
- React + Vite running on http://localhost:5173
- Tailwind CSS configured
- Redux store ready
- Folder structure complete

✅ **Backend**
- Express server running on http://localhost:5000
- MongoDB connection established
- Health endpoint responding
- Folder structure complete

✅ **Database**
- MongoDB Atlas cluster created
- Database user configured
- Connection string obtained
- Network access enabled

✅ **Git**
- Repository initialized
- Initial commit created
- .gitignore configured

✅ **Environment**
- .env.local files created
- No sensitive data in Git
- All dependencies installed

---

## 📞 Next Steps

Once you verify everything:

1. ✅ Confirm all items in verification checklist
2. ✅ Take screenshots of working frontend/backend
3. ✅ Verify git log shows initial commit
4. ✅ Contact for approval to proceed to Phase 2

### Phase 2: Authentication System
- User models
- Login/Register endpoints
- JWT tokens
- Password hashing

---

**Setup Guide Complete! 🚀**

**Status:** Ready for Windows Setup Execution

**Next Action:** Follow PHASE 1-9 commands in order

**Estimated Time:** 2-3 hours (first time)

---

*Document Version: 1.0*  
*Created: June 18, 2026*  
*Platform: Windows 10/11 with VS Code*
