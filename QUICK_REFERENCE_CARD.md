# NextCart AI – Quick Reference Card
## Print This or Keep Open While Executing

---

## 📍 3 EXECUTION PATHS AT A GLANCE

| Path | Time | Experience | When | File |
|------|------|-----------|------|------|
| **A: Incremental** | 40 min | First-time | Build & test each phase | MILESTONE_1_FIXED_INCREMENTAL.md |
| **B: Quick** | 40 min | Experienced | Copy-paste all commands | QUICK_COMMANDS.md |
| **C: Comprehensive** | 60 min | Learning | Detailed explanations | MILESTONE_1_EXECUTION.md |

👉 **RECOMMENDED:** Path A (incremental)

---

## ⚡ THE 4 CRITICAL FIXES

### ✅ Fix 1: Add to backend/package.json
```json
"type": "module"
```
Without this → `import` statements fail

### ✅ Fix 2: Add to backend/package.json scripts
```json
"scripts": {
  "dev": "nodemon server.js"
}
```
Without this → `npm run dev` fails

### ✅ Fix 3: Use explicit Tailwind version
```powershell
npm install -D tailwindcss@3
```
Prevents version conflicts

### ✅ Fix 4: Modern MongoDB connection
```javascript
await mongoose.connect(mongoURI);
```
Remove `useNewUrlParser` & `useUnifiedTopology`

---

## 🚀 QUICKEST START

```powershell
# 1. Create project folder
mkdir nextcart_ai && cd nextcart_ai

# 2. Create frontend
npm create vite@latest frontend -- --template react

# 3. Install frontend deps (8 packages)
cd frontend && npm install
npm install react-router-dom axios react-hook-form react-toastify @reduxjs/toolkit react-redux
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
cd ..

# 4. Test frontend
cd frontend && npm run dev
# Open http://localhost:5173
# Then press q to quit
cd ..

# 5. Create backend
mkdir backend && cd backend && npm init -y

# 6. Edit backend/package.json - ADD THIS:
{
  "type": "module",
  "scripts": {
    "dev": "nodemon server.js"
  }
}

# 7. Install backend deps (6 packages)
npm install express dotenv cors bcryptjs jsonwebtoken mongoose
npm install -D nodemon

# 8. Create folders
mkdir config && mkdir middleware && mkdir models && mkdir controllers && mkdir services && mkdir routes

# 9. Create config/db.js and server.js (see guides)

# 10. Test backend
npm run dev
# Should show: ✅ Server running on http://localhost:5000
```

---

## 📁 CRITICAL FILES TO CREATE

### Frontend (2 files)
```
frontend/vite.config.js
frontend/.env.local
```

### Backend (4 files)
```
backend/server.js
backend/config/db.js
backend/config/env.js
backend/.env.local
```

### Root (2 files)
```
.gitignore
README.md
```

**Total: 8 files** (not 12, because some auto-created)

---

## ✅ VERIFICATION COMMANDS

```powershell
# Check Node
node --version              # Should be 18+

# Check npm
npm --version               # Should be 9+

# Check Git
git --version               # Should be 2.x+

# Test Frontend
cd frontend && npm run dev  # Opens http://localhost:5173

# Test Backend
cd backend && npm run dev   # Shows ✅ Server running...

# Test API (new terminal)
curl http://localhost:5000/api/health
# Should return JSON

# Test Git
git log                     # Should show initial commit
```

---

## 🎯 PHASE-BY-PHASE CHECKLIST

### PHASE 1: Frontend ✓
- [ ] `npm create vite frontend`
- [ ] `npm install` (8 packages)
- [ ] `tailwindcss@3 init -p`
- [ ] `npm run dev` works on localhost:5173
- [ ] Create `vite.config.js`
- [ ] Create `.env.local`

### PHASE 2: Backend ✓
- [ ] `mkdir backend`
- [ ] `npm init -y`
- [ ] EDIT `package.json` - add `"type": "module"` and scripts
- [ ] `npm install` (6 packages)
- [ ] Create `server.js`
- [ ] Create `config/db.js`
- [ ] Create `config/env.js`
- [ ] Create `.env.local`

### PHASE 3: Folders ✓
- [ ] Frontend: components, features, pages, services, hooks, store, utils, assets
- [ ] Backend: config, middleware, models, controllers, services, routes

### PHASE 4: Git ✓
- [ ] Create `.gitignore`
- [ ] Create `README.md`
- [ ] `git init`
- [ ] `git add .`
- [ ] `git commit -m "Initial commit..."`

### PHASE 5: MongoDB ✓
- [ ] Create Atlas account
- [ ] Create cluster (M0 free)
- [ ] Create user `nextcart_user`
- [ ] Enable network access (0.0.0.0/0)
- [ ] Copy connection string
- [ ] Update `.env.local` MONGODB_URI

---

## 🔥 COMMON ERRORS

| Error | Fix |
|-------|-----|
| "Cannot use import statement" | Add `"type": "module"` to package.json |
| "`npm run dev` not found" | Add scripts section to package.json |
| "Port 5000 in use" | `taskkill /PID <PID> /F` or change PORT in .env |
| "MONGODB_URI not set" | Create `backend/.env.local` with connection string |
| "Tailwind not working" | Use `tailwindcss@3` explicitly |
| "Cannot find module express" | Run `npm install` in backend folder |

---

## 📊 DEPENDENCIES (LEAN SET)

### Frontend (8 packages)
```
react, react-dom
react-router-dom, axios
react-hook-form, react-toastify
@reduxjs/toolkit, react-redux
```

### Backend (6 packages)
```
express, mongoose
dotenv, cors
bcryptjs, jsonwebtoken
+ nodemon (dev)
```

**Deferred to later milestones:**
- joi (M2)
- multer, cloudinary (M3)
- nodemailer (M5)
- express-rate-limit (M6)

---

## 🎯 FINAL VERIFICATION

**When everything is done:**

```powershell
# Terminal 1: Frontend
cd frontend && npm run dev
# See: http://localhost:5173

# Terminal 2: Backend
cd backend && npm run dev
# See: ✅ Server running on http://localhost:5000

# Terminal 3: Test API
curl http://localhost:5000/api/health
# Should return JSON with status: OK

# Check Git
git log
# Should show: Initial commit: NextCart...
```

✅ When all 4 terminals show success = **Milestone 1 Complete**

---

## 📞 NEXT STEPS AFTER SETUP

1. Take screenshots of all 4 terminals ✓
2. Run `git log` and screenshot ✓
3. Send screenshots + completion checklist ✓
4. **Request approval for Milestone 2** ✓

---

## 🎓 MILESTONE ROADMAP

```
✅ Milestone 1: Setup & Infrastructure (40 min) ← YOU ARE HERE
   ↓
🟡 Milestone 2: Authentication (User model, Register, Login, JWT)
   ↓
🟡 Milestone 3: Products (CRUD, Categories, Search)
   ↓
🟡 Milestone 4: Cart & Wishlist
   ↓
🟡 Milestone 5: Orders & Payments
   ↓
🟡 Milestone 6: Admin Dashboard
```

---

## 💡 PRO TIPS

1. **Use incremental guide** - Test each phase before moving on
2. **Keep 3 terminals open** - Frontend, Backend, Testing
3. **Don't install extra packages** - Stick to the lean list
4. **Update .env.local values** - Especially MongoDB URI
5. **Never commit .env files** - They contain secrets
6. **Take screenshots** - For milestone approval

---

## 🚀 YOU'RE READY!

Pick a guide:
- **MILESTONE_1_FIXED_INCREMENTAL.md** (Recommended)
- **QUICK_COMMANDS.md** (Fast)
- **MILESTONE_1_EXECUTION.md** (Detailed)

**Expected Time:** 40 minutes  
**Expected Result:** Working MERN stack  
**Next Gate:** Milestone 2 approval  

---

**Let's go! Start with Phase 1 now.** 🚀
