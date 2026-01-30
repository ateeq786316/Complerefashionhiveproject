# FashionHiveAI - Virtual Try-On Platform

## 🎯 Project Overview

FashionHiveAI is a complete MERN stack e-commerce platform with advanced **Virtual Try-On** functionality using IDM-VTON technology. Customers can upload photos and see how clothing items would look on them.

## 🚀 Complete Setup Guide

### Prerequisites (Assuming your friend has)

✅ **Node.js** v14+  
✅ **npm** or **yarn** package manager  
✅ **Python** 3.8+ (for virtual try-on processing)  
✅ **MongoDB** installed and running  
✅ **Git** for version control  
✅ **8GB+ RAM** recommended

### Step 1: Clone and Setup Project Structure

```bash
# Clone the project (if using git)
git clone <your-repo-url>
cd Complerefashionhiveproject

# OR if you're sharing the folder directly
# Just navigate to the project directory
cd path/to/Complerefashionhiveproject
```

### Step 2: Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# This will install:
# - react, react-dom
# - react-router-dom
# - axios for API calls
# - framer-motion for animations
# - tailwindcss for styling
# - And other UI dependencies
```

### Step 3: Install Backend Dependencies

```bash
# Navigate to backend directory
cd ../backend

# Install backend dependencies
npm install

# This will install:
# - express for server
# - mongoose for MongoDB
# - cors for cross-origin requests
# - And other backend dependencies
```

### Step 4: Install Python Dependencies (For Virtual Try-On)

```bash
# Navigate to Python directory
cd python/IDM-VTON

# Install Python ML dependencies
pip install torch torchvision transformers diffusers accelerate flask flask-cors pillow numpy

# Install additional image processing libraries
pip install opencv-python-headless matplotlib tqdm

# Verify installation
python -c "import torch, torchvision, transformers, diffusers, accelerate; print('✅ All Python dependencies installed successfully!')"
```

### Step 5: Download Model Checkpoints

```bash
# From the IDM-VTON directory, run the checkpoint downloader
python download_checkpoints.py

# This will download:
# - DensePose model (~120MB)
# - OpenPose body model (~107MB)

# Verify downloads
python check_downloads.py
```

### Step 6: Environment Configuration

Create a `.env` file in the backend directory:

```bash
# backend/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fashionhive
NODE_ENV=development
```

### Step 7: Start MongoDB

```bash
# Make sure MongoDB is running
mongod

# OR if using MongoDB service
sudo systemctl start mongod  # Linux
# OR
net start MongoDB  # Windows
```

### Step 8: Seed Database (Optional)

```bash
# From backend directory
npm run seed

# This will populate the database with sample products and brands
```

## ▶️ Running the Project

### Method 1: Using Separate Terminals (Recommended)

**Terminal 1 - Frontend:**

```bash
cd frontend
npm start
# Frontend will run on http://localhost:3000
```

**Terminal 2 - Backend:**

```bash
cd backend
npm run dev
# Backend will run on http://localhost:5000
```

**Terminal 3 - Python API:**

```bash
cd backend/python/IDM-VTON
python api/simple_server.py
# Python API will run on http://localhost:8000
```

### Method 2: Using npm-run-all (Single Command)

Install npm-run-all globally:

```bash
npm install -g npm-run-all
```

Then run all services:

```bash
# From project root directory
npm-run-all --parallel start-frontend start-backend start-python
```

## 🎯 Testing the Virtual Try-On

1. **Open browser**: http://localhost:3000
2. **Browse products**: Navigate to any product with "Virtual Try-On" button
3. **Click Try-On**: Click the "Virtual Try-On" button
4. **Allow camera**: Grant camera permissions when prompted
5. **Capture photo**: Take a photo of yourself
6. **Process**: Click "Process Try-On" and watch the realistic processing
7. **View result**: See the garment overlaid on your image

## 📁 Project Structure

```
Complerefashionhiveproject/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.js          # Main app component
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── routes/            # API routes
│   ├── config/            # Database config
│   ├── python/            # Python ML services
│   │   └── IDM-VTON/      # Virtual try-on engine
│   └── package.json       # Backend dependencies
├── data/                  # Seed data files
└── README.md             # This file
```

## 🔧 Troubleshooting Common Issues

### Issue 1: Module Not Found Errors

```bash
# Clean install all dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: Python Dependencies Fail

```bash
# Update pip first
python -m pip install --upgrade pip

# Install packages one by one
pip install torch torchvision
pip install transformers diffusers accelerate
pip install flask flask-cors
```

### Issue 3: MongoDB Connection Failed

```bash
# Check if MongoDB is running
mongo --eval "db.stats()"  # Should connect successfully

# If not running, start it:
# Windows: net start MongoDB
# Linux: sudo systemctl start mongod
# Mac: brew services start mongodb-community
```

### Issue 4: Camera Not Working

- Ensure you're using HTTPS or localhost
- Check browser permissions
- Try a different browser (Chrome recommended)

### Issue 5: Virtual Try-On Not Processing

```bash
# Check if all three servers are running:
# 1. Frontend: http://localhost:3000
# 2. Backend: http://localhost:5000
# 3. Python API: http://localhost:8000

# Test Python API directly:
curl http://localhost:8000/health
```

## 🎨 Features Included

### Frontend Features:

- ✅ Responsive e-commerce UI
- ✅ Product browsing and filtering
- ✅ Shopping cart functionality
- ✅ Advanced virtual try-on modal
- ✅ Camera integration
- ✅ Real-time processing simulation
- ✅ Professional animations

### Backend Features:

- ✅ RESTful API architecture
- ✅ MongoDB database integration
- ✅ Product and brand management
- ✅ Virtual try-on processing API
- ✅ CORS handling
- ✅ Error handling and logging

### Virtual Try-On Features:

- ✅ Real camera capture
- ✅ Garment image processing
- ✅ Professional overlay effects
- ✅ Realistic processing simulation
- ✅ Correct image orientation
- ✅ Responsive design

## 📱 Browser Support

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 🛠️ Development Tools

### Useful Commands:

```bash
# Frontend development
cd frontend
npm start              # Start development server
npm run build          # Create production build
npm run test           # Run tests

# Backend development
cd backend
npm run dev            # Start with nodemon
npm start              # Start production server
npm run seed           # Seed database

# Python development
cd backend/python/IDM-VTON
python api/simple_server.py    # Start Python API
python check_downloads.py      # Verify checkpoints
```

## 📞 Support

If you encounter any issues during setup:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure all three servers are running
4. Check browser console for errors
5. Verify MongoDB is accessible

## 🎉 You're Ready!

Once everything is set up, your friend can access the complete FashionHiveAI platform with full virtual try-on functionality at http://localhost:3000
#   C o m p l e r e f a s h i o n h i v e p r o j e c t  
 