const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("========================================");
console.log("FashionHiveAI Setup Script");
console.log("========================================");
console.log();

if (!fs.existsSync("frontend") || !fs.existsSync("backend")) {
  console.error(
    "❌ ERROR: Please run this script from the project root directory"
  );
  console.error("Current directory:", process.cwd());
  process.exit(1);
}

console.log("🚀 Starting FashionHiveAI Setup...\n");

try {
  console.log("1/4 Setting up Frontend...");
  process.chdir("frontend");

  if (fs.existsSync("node_modules")) {
    console.log("   Cleaning existing node_modules...");
    fs.rmSync("node_modules", { recursive: true, force: true });
  }

  console.log("   Installing frontend dependencies...");
  execSync("npm install", { stdio: "inherit" });
  process.chdir("..");
  console.log("   ✅ Frontend setup complete\n");

  console.log("2/4 Setting up Backend...");
  process.chdir("backend");

  if (fs.existsSync("node_modules")) {
    console.log("   Cleaning existing node_modules...");
    fs.rmSync("node_modules", { recursive: true, force: true });
  }

  console.log("   Installing backend dependencies...");
  execSync("npm install", { stdio: "inherit" });

  const envPath = ".env";
  if (!fs.existsSync(envPath)) {
    console.log("   Creating .env configuration file...");
    const envContent = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/fashionhive
NODE_ENV=development`;
    fs.writeFileSync(envPath, envContent);
    console.log("   ✅ .env file created");
  } else {
    console.log("   ✅ .env file already exists");
  }

  process.chdir("..");
  console.log("   ✅ Backend setup complete\n");

  console.log("3/4 Setting up Python Dependencies...");
  process.chdir("backend/python/IDM-VTON");

  console.log("   Installing Python packages...");
  try {
    execSync(
      "pip install torch torchvision transformers diffusers accelerate flask flask-cors pillow numpy opencv-python-headless matplotlib tqdm",
      { stdio: "inherit" }
    );
    console.log("   ✅ Python packages installed\n");
  } catch (error) {
    console.log("   ⚠️  Some Python packages may have failed to install");
    console.log("   You may need to install them manually\n");
  }

  console.log("   Downloading model checkpoints...");
  try {
    execSync("python download_checkpoints.py", { stdio: "inherit" });
    console.log("   ✅ Model checkpoints downloaded\n");
  } catch (error) {
    console.log("   ⚠️  Checkpoint download may have failed");
    console.log('   You can run "python download_checkpoints.py" manually\n');
  }

  process.chdir("../../../..");
  console.log("   ✅ Python setup complete\n");

  console.log("4/4 Finalizing setup...");
  console.log("   Installing concurrently for easy development...");
  try {
    execSync("npm install -g concurrently", { stdio: "inherit" });
    console.log("   ✅ concurrently installed globally\n");
  } catch (error) {
    console.log("   ⚠️  Could not install concurrently globally");
    console.log(
      "   You can install it later with: npm install -g concurrently\n"
    );
  }

  console.log("========================================");
  console.log("✅ Setup Complete!");
  console.log("========================================");
  console.log();
  console.log("To run the project:");
  console.log("1. Make sure MongoDB is running");
  console.log("2. Run all services with one command:");
  console.log("   npm run dev");
  console.log();
  console.log("Or run services separately:");
  console.log("   Terminal 1: npm run start-frontend");
  console.log("   Terminal 2: npm run start-backend");
  console.log("   Terminal 3: npm run start-python");
  console.log();
  console.log("Then visit: http://localhost:3000");
  console.log();
} catch (error) {
  console.error("\n❌ Setup failed:", error.message);
  console.error("Please check the error above and try again.");
  process.exit(1);
}
