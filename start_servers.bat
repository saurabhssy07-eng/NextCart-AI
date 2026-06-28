@echo off
cd /d "C:\Users\Saurabh Singh Yadav\OneDrive\Desktop\E_commerce_website\backend"
start "Backend" cmd /c "node server.js"
cd /d "C:\Users\Saurabh Singh Yadav\OneDrive\Desktop\E_commerce_website\frontend"
start "Frontend" cmd /c "npm run dev"
echo Servers started!
pause
