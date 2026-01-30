import mongoose from "mongoose";
import path from "path";

const MONGO_URI = "mongodb://127.0.0.1:27017/brands";

import mariaB from "../data/data/mariaB.json";
import limelight from "../data/data/limelight.json";
import sapphire from "../data/data/sapphire.json";
import gulAhmed from "../data/data/gulAhmed.json";
import edenrobe from "../data/data/edenrobe.json";
import beechtree from "../data/data/beechtree.json";
import junaidJamshed from "../data/data/junaidJamshed.json";
import bonanza from "../data/data/bonanza.json";
import khaadi from "../data/data/khaadi.json";
import outfitters from "../data/data/outfitters.json";

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const brandsData = [
      { name: "Maria B", data: mariaB, collection: "MariaB" },
      { name: "limelight", data: limelight, collection: "Limelight" },
      { name: "sapphire", data: sapphire, collection: "Sapphire" },
      { name: "Gul Ahmed", data: gulAhmed, collection: "GulAhmed" },
      { name: "edenrobe", data: edenrobe, collection: "Edenrobe" },
      { name: "Beechtree", data: beechtree, collection: "Beechtree" },
      {
        name: "Junaid Jumshaid",
        data: junaidJamshed,
        collection: "JunaidJamshed",
      },
      { name: "bonanza", data: bonanza, collection: "Bonanza" },
      { name: "khaadi", data: khaadi, collection: "Khaadi" },
      { name: "outfitters", data: outfitters, collection: "Outfitters" },
    ];

    for (const brand of brandsData) {
      console.log(`📦 Processing ${brand.name}...`);

      // Get the collection
      const collection = mongoose.connection.db.collection(brand.collection);

      // Clear existing data
      await collection.deleteMany({});
      console.log(`  🗑️  Cleared existing data in ${brand.collection}`);

      // Transform data to match expected format
      const transformedData = brand.data.map((product, index) => ({
        ...product,
        _id: new mongoose.Types.ObjectId(),
        brand: brand.collection, // Use collection name as brand identifier
        price: product.price || product.sale_price || product.original_price,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      // Insert data
      if (transformedData.length > 0) {
        await collection.insertMany(transformedData);
        console.log(
          `  ✅ Inserted ${transformedData.length} products into ${brand.collection}`
        );
      } else {
        console.log(`  ⚠️  No data found for ${brand.name}`);
      }
    }

    console.log("\n🎉 Seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`  - MariaB: ${mariaB.length} products`);
    console.log(`  - Limelight: ${limelight.length} products`);
    console.log(`  - Sapphire: ${sapphire.length} products`);
    console.log(`  - GulAhmed: ${gulAhmed.length} products`);
    console.log(`  - Edenrobe: ${edenrobe.length} products`);
    console.log(`  - Beechtree: ${beechtree.length} products`);
    console.log(`  - JunaidJamshed: ${junaidJamshed.length} products`);
    console.log(`  - Bonanza: ${bonanza.length} products`);
    console.log(`  - Khaadi: ${khaadi.length} products`);
    console.log(`  - Outfitters: ${outfitters.length} products`);

    // Show collections in database
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const userCollections = collections
      .map((col) => col.name)
      .filter((name) => !name.startsWith("system."));

    console.log("\n📚 Collections in database:");
    userCollections.forEach((col) => console.log(`  - ${col}`));
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Disconnected from MongoDB");
    process.exit(0);
  }
};

// Run the seeding
seedDatabase();
