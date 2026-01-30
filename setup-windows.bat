@echo off
echo ========================================
echo FashionHiveAI Setup Script - Windows
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "frontend" (
    echo ERROR: Please run this script from the project root directory
    echo Current directory: %cd%
    pause
    exit /b 1
)

echo 🚀 Starting FashionHiveAI Setup...
echo.

REM Setup Frontend
echo 1/4 Setting up Frontend...
cd frontend
if exist "node_modules" (
    echo    Cleaning existing node_modules...
    rmdir /s /q node_modules
)
echo    Installing frontend dependencies...
npm install
if %errorlevel% neq 0 (
    echo    ERROR: Frontend setup failed
    pause
    exit /b 1
)
cd ..

REM Setup Backend
echo 2/4 Setting up Backend...
cd backend
if exist "node_modules" (
    echo    Cleaning existing node_modules...
    rmdir /s /q node_modules
)
echo    Installing backend dependencies...
npm install
if %errorlevel% neq 0 (
    echo    ERROR: Backend setup failed
    pause
    exit /b 1
)
cd ..

REM Setup Python Dependencies
echo 3/4 Setting up Python Dependencies...
cd backend/python/IDM-VTON
echo    Installing Python packages...
pip install torch torchvision transformers diffusers accelerate flask flask-cors pillow numpy opencv-python-headless matplotlib tqdm
if %errorlevel% neq 0 (
    echo    WARNING: Some Python packages may have failed to install
    echo    You may need to install them manually
)

REM Download Checkpoints
echo    Downloading model checkpoints...
python download_checkpoints.py
cd ../../..

REM Create .env file if it doesn't exist
echo 4/4 Creating configuration files...
cd backend
if not exist ".env" (
    echo PORT=5000 > .env
    echo MONGODB_URI=mongodb://localhost:27017/fashionhive >> .env
    echo NODE_ENV=development >> .env
    echo    Created .env configuration file
) else (
    echo    .env file already exists
)
cd ..

echo.
echo ========================================
echo ✅ Setup Complete!
echo ========================================
echo.
echo To run the project:
echo 1. Make sure MongoDB is running
echo 2. Open 3 terminal windows:
echo.
echo    Terminal 1 (Frontend):
echo    cd frontend
echo    npm start
echo.
echo    Terminal 2 (Backend):
echo    cd backend
echo    npm run dev
echo.
echo    Terminal 3 (Python API):
echo    cd backend/python/IDM-VTON
echo    python api/simple_server.py
echo.
echo Then visit: http://localhost:3000
echo.
pause