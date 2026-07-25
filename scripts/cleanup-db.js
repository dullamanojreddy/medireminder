import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/medreminder";

const collectionsToClean = [
  "caregivers",
  "patients",
  "medicines",
  "reminders",
  "medicationlogs",
  "refills"
];

async function cleanupDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const db = mongoose.connection.db;
    
    console.log("🗑️  Deleting all documents from collections...\n");

    for (const collectionName of collectionsToClean) {
      try {
        const result = await db.collection(collectionName).deleteMany({});
        console.log(`✓ ${collectionName}: Deleted ${result.deletedCount} documents`);
      } catch (error) {
        console.log(`✗ ${collectionName}: Error - ${error.message}`);
      }
    }

    console.log("\n✅ Database cleanup completed!");
    console.log("\nRemaining collections:");
    const collections = await db.listCollections().toArray();
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`  - ${col.name}: ${count} documents`);
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
    process.exit(0);
  }
}

// IIFE to handle top-level await
(async () => {
  await cleanupDatabase();
})();
