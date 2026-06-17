@echo off
REM NextCart - Windows Automation Setup Script
REM This script automates the Milestone 1 setup process
REM Run from project root: setup.bat

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║       NextCart - Windows Setup Automation Script          ║
echo ║              Project: Enterprise E-Commerce               ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

setlocal enabledelayedexpansion

REM ===== PHASE 1: VERIFY PREREQUISITES =====
echo.
echo [PHASE 1] Verifying Prerequisites...
echo.

node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found! Please install Node.js 18+
    echo Download from: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js found: %cd%

npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm not found!
    pause
    exit /b 1
)
echo ✅ npm found

git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git not found! Please install Git
    echo Download from: https://git-scm.com
    pause
    exit /b 1
)
echo ✅ Git found

echo.
echo ===== PHASE 1 COMPLETE: All prerequisites installed =====
echo.

REM ===== PHASE 2: CREATE FRONTEND =====
echo.
echo [PHASE 2] Creating Frontend Project...
echo.

if exist frontend (
    echo ✅ Frontend folder already exists
) else (
    echo Creating Vite + React frontend...
    call npm create vite@latest frontend -- --template react
    if errorlevel 1 (
        echo ❌ Failed to create frontend
        pause
        exit /b 1
    )
    echo ✅ Frontend created
)

echo.
echo ===== PHASE 2 COMPLETE: Frontend created =====
echo.

REM ===== PHASE 3: INSTALL FRONTEND DEPENDENCIES =====
echo.
echo [PHASE 3] Installing Frontend Dependencies...
echo.

cd frontend

echo Installing npm packages for frontend...
call npm install
call npm install react-router-dom axios react-hook-form react-toastify
call npm install @reduxjs/toolkit react-redux redux
call npm install -D tailwindcss postcss autoprefixer
call npx tailwindcss init -p

if errorlevel 1 (
    echo ❌ Frontend installation failed
    cd ..
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed

cd ..

echo.
echo ===== PHASE 3 COMPLETE: Frontend dependencies installed =====
echo.

REM ===== PHASE 4: CREATE BACKEND =====
echo.
echo [PHASE 4] Creating Backend Project...
echo.

if exist backend (
    echo ✅ Backend folder already exists
) else (
    echo Creating backend folder...
    mkdir backend
    echo ✅ Backend folder created
)

echo.
echo ===== PHASE 4 COMPLETE: Backend folder created =====
echo.

REM ===== PHASE 5: INSTALL BACKEND DEPENDENCIES =====
echo.
echo [PHASE 5] Installing Backend Dependencies...
echo.

cd backend

if not exist "package.json" (
    echo Initializing backend package.json...
    call npm init -y
)

echo Installing npm packages for backend...
call npm install express dotenv cors bcryptjs jsonwebtoken mongoose multer cloudinary nodemailer joi express-rate-limit
call npm install -D nodemon eslint

if errorlevel 1 (
    echo ❌ Backend installation failed
    cd ..
    pause
    exit /b 1
)

echo ✅ Backend dependencies installed

cd ..

echo.
echo ===== PHASE 5 COMPLETE: Backend dependencies installed =====
echo.

REM ===== PHASE 6: CREATE FOLDER STRUCTURES =====
echo.
echo [PHASE 6] Creating Folder Structures...
echo.

echo Creating frontend folder structure...

cd frontend\src
mkdir components\Atoms
mkdir components\Molecules
mkdir components\Organisms
mkdir components\Templates
mkdir features\auth
mkdir features\products
mkdir features\cart
mkdir features\orders
mkdir pages\auth
mkdir pages\user
mkdir pages\admin
mkdir hooks
mkdir services
mkdir api
mkdir utils
mkdir styles
mkdir store
cd ..\..\

echo ✅ Frontend folders created

echo Creating backend folder structure...

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

echo ✅ Backend folders created

echo.
echo ===== PHASE 6 COMPLETE: Folder structures created =====
echo.

REM ===== PHASE 7: INITIALIZE GIT =====
echo.
echo [PHASE 7] Initializing Git Repository...
echo.

if exist ".git" (
    echo ✅ Git repository already initialized
) else (
    git init
    git add .
    git commit -m "Initial commit: NextCart project structure and configuration"
    echo ✅ Git repository initialized and committed
)

echo.
echo ===== PHASE 7 COMPLETE: Git initialized =====
echo.

REM ===== SUMMARY =====
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║               SETUP COMPLETE - NEXT STEPS                 ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo ✅ Frontend folder created with Vite + React
echo ✅ Backend folder created with Express
echo ✅ All dependencies installed
echo ✅ Folder structures created
echo ✅ Git repository initialized
echo.
echo MANUAL CONFIGURATION REQUIRED:
echo.
echo 1. Add Configuration Files:
echo    - frontend/vite.config.js
echo    - frontend/tailwind.config.js
echo    - frontend/.env.local
echo    - backend/server.js
echo    - backend/config/db.js
echo    - backend/.env.local
echo    (See MILESTONE_1_EXECUTION.md for content)
echo.
echo 2. Setup MongoDB Atlas:
echo    - Create account at https://www.mongodb.com/cloud/atlas
echo    - Create free cluster
echo    - Create database user (nextcart_user)
echo    - Get connection string
echo    - Update backend/.env.local
echo.
echo 3. Test Frontend:
echo    cd frontend
echo    npm run dev
echo    (Should open http://localhost:5173)
echo.
echo 4. Test Backend (new terminal):
echo    cd backend
echo    npm run dev
echo    (Should run on http://localhost:5000)
echo.
echo 5. Test API:
echo    curl http://localhost:5000/api/health
echo.
echo ====================================================
echo For detailed instructions, see:
echo - WINDOWS_SETUP_INSTRUCTIONS.md
echo - MILESTONE_1_EXECUTION.md
echo ====================================================
echo.

pause
