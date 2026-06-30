# NextCart AI – Full Stack E-Commerce Platform
## Quick Commands Reference (Milestone 1)

**Last Updated:** June 18, 2026  
**Platform:** Windows 10/11  
**Terminal:** VS Code Integrated Terminal (PowerShell)  
**Time to Complete:** ~40 minutes

---

## 🚀 QUICK START (Copy Each Section)

### Section 1: Create Frontend (Copy Everything Below)

```powershell
npm create vite@latest frontend -- --template react
```

Wait for completion, then copy next section.

---

### Section 2: Install Frontend Dependencies (Lean - 8 Packages)

```powershell
cd frontend
npm install
npm install react-router-dom axios react-hook-form react-toastify @reduxjs/toolkit react-redux
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
cd ..
```

**Note:** Installing only essential packages for Milestone 1. Add multer & cloudinary in Milestone 3.

---

### Section 3: Create Backend (Lean - 6 Packages)

```powershell
mkdir backend
cd backend
npm init -y
npm install express dotenv cors bcryptjs jsonwebtoken mongoose
npm install -D nodemon
cd ..
```

**Note:** Installing only essential packages for Milestone 1:
- Deferred to Milestone 2: joi (validation)
- Deferred to Milestone 3: multer, cloudinary
- Deferred to Milestone 5: nodemailer
- Deferred to Milestone 6: express-rate-limit

---

### Section 4: Create Frontend Folder Structure (Simplified)

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

**Structure:**
- `components/` - Reusable UI components
- `features/` - Feature-based folders (auth, products, cart, orders)
- `pages/` - Page-level components
- `services/` - API calls with axios
- `hooks/` - Custom React hooks
- `store/` - Redux store & slices
- `utils/` - Helper functions
- `assets/` - Images, icons, fonts

---

### Section 5: Create Backend Folder Structure

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

### Section 6: Initialize Git

```powershell
git init
git add .
git commit -m "Initial commit: NextCart project structure and configuration"
```

---

### Section 7: Verify Installation (Frontend)

**Terminal 1:**

```powershell
cd frontend
npm run dev
```

**Expected Output:**
```
✓ Local: http://localhost:5173/
```

**Action:** Open browser to http://localhost:5173  
Press `q` to quit after verification.

---

### Section 8: Verify Installation (Backend)

**Terminal 2 (New Terminal):**

```powershell
cd backend
npm run dev
```

**Expected Output:**
```
✅ Server running on http://localhost:5000
```

---

### Section 9: Test Health Endpoint

**Terminal 3 (Another New Terminal):**

```powershell
curl http://localhost:5000/api/health
```

**Expected Output:**
```json
{
  "status": "OK",
  "timestamp": "2026-06-18T...",
  "uptime": X.XXX,
  "environment": "development"
}
```

---

## 📁 Folder Structure Check

After setup, verify these folders exist:

**Frontend:**
```
frontend/src/
├── components/    (Atoms, Molecules, Organisms, Templates)
├── features/      (auth, products, cart, orders)
├── pages/         (auth, user, admin)
├── hooks/
├── services/
├── api/
├── utils/
├── styles/
└── store/
```

**Backend:**
```
backend/
├── config/
├── middleware/
├── models/
├── controllers/
├── services/
├── routes/
├── validators/
├── utils/
├── tests/
└── logs/
```

---

## 📝 Configuration Files to Create

### File 1: `frontend/vite.config.js`

Path: `frontend\vite.config.js`

[See MILESTONE_1_EXECUTION.md for content]

---

### File 2: `frontend/.env.local`

Path: `frontend\.env.local`

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=NextCart
VITE_ENABLE_RECOMMENDATIONS=true
VITE_ENABLE_ANALYTICS=true
```

---

### File 3: `backend/server.js`

Path: `backend\server.js`

[See MILESTONE_1_EXECUTION.md for content]

---

### File 4: `backend/.env.local`

Path: `backend\.env.local`

Update with your MongoDB connection string:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://nextcart_user:YOUR_PASSWORD@cluster0.mongodb.net/nextcart?retryWrites=true&w=majority
JWT_SECRET=dev_jwt_secret_12345
JWT_REFRESH_SECRET=dev_refresh_secret_12345
FRONTEND_URL=http://localhost:5173
```

---

## 🔄 Common Commands

### Navigation
```powershell
cd frontend          # Go to frontend
cd backend           # Go to backend
cd ..                # Go up one level
ls                   # List files
```

### Installation
```powershell
npm install          # Install dependencies
npm install <pkg>    # Install specific package
npm list             # Show installed packages
```

### Running
```powershell
npm run dev          # Start development server
npm start            # Start production server
npm run build        # Build for production
npm run preview      # Preview build
```

### Testing
```powershell
curl http://localhost:5000/api/health   # Test backend
curl http://localhost:5173              # Test frontend
```

### Git
```powershell
git init             # Initialize repository
git add .            # Stage all changes
git commit -m "msg"  # Commit changes
git log              # Show commit history
git status           # Show current status
```

---

## 🔌 MongoDB Connection String Example

After getting connection string from MongoDB Atlas:

```
mongodb+srv://nextcart_user:PASSWORD@cluster0.mongodb.net/?retryWrites=true&w=majority
```

Add database name at the end:

```
mongodb+srv://nextcart_user:PASSWORD@cluster0.mongodb.net/nextcart?retryWrites=true&w=majority
```

Update in `backend/.env.local`:

```env
MONGODB_URI=mongodb+srv://nextcart_user:PASSWORD@cluster0.mongodb.net/nextcart?retryWrites=true&w=majority
```

---

## 🚨 Troubleshooting Commands

### Clear npm cache
```powershell
npm cache clean --force
```

### Reinstall dependencies
```powershell
rm -r node_modules
npm install
```

### Kill process on port
```powershell
# Find process on port 5173
netstat -ano | findstr :5173

# Kill by PID
taskkill /PID <PID> /F
```

### Check Node version
```powershell
node --version
npm --version
```

### Check if Git installed
```powershell
git --version
```

---

## ✅ Verification Checklist

After following all commands:

- [ ] `cd frontend` and `npm run dev` works
- [ ] Browser shows React app on http://localhost:5173
- [ ] `cd backend` and `npm run dev` works
- [ ] Backend shows "Server running on http://localhost:5000"
- [ ] `curl http://localhost:5000/api/health` returns JSON
- [ ] `git log` shows initial commit
- [ ] All folders in frontend/src exist
- [ ] All folders in backend exist
- [ ] `.env.local` files created (not committed)
- [ ] MongoDB connection string configured

---

## 📞 Full Documentation

For detailed explanations, see:
- **WINDOWS_SETUP_INSTRUCTIONS.md** - Complete Windows guide
- **MILESTONE_1_EXECUTION.md** - Step-by-step execution
- **MILESTONE_1_SETUP.md** - Original documentation

---

## 🎯 Next: Approval

When all commands work:
1. ✅ Take screenshots of working frontend/backend
2. ✅ Complete verification checklist
3. ✅ **Request approval for Milestone 2**

---

**Version:** 1.0  
**Last Updated:** June 18, 2026  
**Status:** Ready for Use
