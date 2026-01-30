import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/brands";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(MONGO_URI);
    isConnected = true;

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);

    return conn.connection;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const getBrandCollections = async () => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    return collections
      .map((col) => col.name)
      .filter((name) => !name.startsWith("system."));
  } catch (error) {
    console.error("Error getting collections:", error);
    return [];
  }
};

const getCollection = (collectionName) => {
  return mongoose.connection.db.collection(collectionName);
};

export { connectDB, getBrandCollections, getCollection };
