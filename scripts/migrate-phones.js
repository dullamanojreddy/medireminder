/**
 * One-time Migration Script: Normalize Phone Numbers to E.164
 * 
 * This script updates all existing phone numbers in MongoDB to E.164 format.
 * Run this script once after deploying the phone normalization system.
 * 
 * Usage: node backend/src/utils/migrate-phones.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { normalizePhone } from "./phone.util.js";

// Load environment variables
dotenv.config();

// Import models
import Patient from "../models/Patient.js";
import Caregiver from "../models/Caregiver.js";

const MIGRATION_VERSION = "1.0.0";

/**
 * Migrate a single document's phone field
 */
async function migratePhone(doc, fieldName) {
  const currentPhone = doc[fieldName];
  
  if (!currentPhone) {
    return { migrated: false, reason: "No phone number" };
  }

  const normalized = normalizePhone(currentPhone);
  
  if (normalized === currentPhone) {
    return { migrated: false, reason: "Already normalized" };
  }

  doc[fieldName] = normalized;
  await doc.save();
  
  return { 
    migrated: true, 
    oldValue: currentPhone, 
    newValue: normalized 
  };
}

/**
 * Main migration function
 */
async function runMigration() {
  console.log("=".repeat(60));
  console.log("Phone Number Migration to E.164 Format");
  console.log("Version:", MIGRATION_VERSION);
  console.log("=".repeat(60));
  console.log("");

  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/medreminder");
    console.log("✅ Connected to MongoDB\n");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }

  const stats = {
    patients: { total: 0, migrated: 0, skipped: 0, errors: 0 },
    caregivers: { total: 0, migrated: 0, skipped: 0, errors: 0 },
  };

  // Migrate Patients
  console.log("Migrating Patients...");
  try {
    const patients = await Patient.find({});
    stats.patients.total = patients.length;
    console.log(`Found ${patients.length} patients\n`);

    for (const patient of patients) {
      try {
        // Migrate primary phone
        const primaryResult = await migratePhone(patient, "phone");
        if (primaryResult.migrated) {
          console.log(`  ✓ Patient ${patient._id}: ${primaryResult.oldValue} → ${primaryResult.newValue}`);
          stats.patients.migrated++;
        } else {
          stats.patients.skipped++;
        }

        // Migrate emergency contact phone if exists
        if (patient.emergencyContactPhone) {
          const emergencyResult = await migratePhone(patient, "emergencyContactPhone");
          if (emergencyResult.migrated) {
            console.log(`  ✓ Patient ${patient._id} (emergency): ${emergencyResult.oldValue} → ${emergencyResult.newValue}`);
            stats.patients.migrated++;
          }
        }
      } catch (error) {
        console.error(`  ✗ Error migrating patient ${patient._id}:`, error.message);
        stats.patients.errors++;
      }
    }
  } catch (error) {
    console.error("❌ Error migrating patients:", error.message);
    stats.patients.errors++;
  }

  console.log("");

  // Migrate Caregivers
  console.log("Migrating Caregivers...");
  try {
    const caregivers = await Caregiver.find({});
    stats.caregivers.total = caregivers.length;
    console.log(`Found ${caregivers.length} caregivers\n`);

    for (const caregiver of caregivers) {
      try {
        const result = await migratePhone(caregiver, "phone");
        if (result.migrated) {
          console.log(`  ✓ Caregiver ${caregiver._id} (${caregiver.email}): ${result.oldValue} → ${result.newValue}`);
          stats.caregivers.migrated++;
        } else {
          stats.caregivers.skipped++;
        }
      } catch (error) {
        console.error(`  ✗ Error migrating caregiver ${caregiver._id}:`, error.message);
        stats.caregivers.errors++;
      }
    }
  } catch (error) {
    console.error("❌ Error migrating caregivers:", error.message);
    stats.caregivers.errors++;
  }

  console.log("");
  console.log("=".repeat(60));
  console.log("MIGRATION SUMMARY");
  console.log("=".repeat(60));
  console.log("PATIENTS:");
  console.log(`  Total: ${stats.patients.total}`);
  console.log(`  Migrated: ${stats.patients.migrated}`);
  console.log(`  Skipped (already normalized): ${stats.patients.skipped}`);
  console.log(`  Errors: ${stats.patients.errors}`);
  console.log("");
  console.log("CAREGIVERS:");
  console.log(`  Total: ${stats.caregivers.total}`);
  console.log(`  Migrated: ${stats.caregivers.migrated}`);
  console.log(`  Skipped (already normalized): ${stats.caregivers.skipped}`);
  console.log(`  Errors: ${stats.caregivers.errors}`);
  console.log("=".repeat(60));

  // Disconnect from MongoDB
  await mongoose.disconnect();
  console.log("\n✅ Disconnected from MongoDB");
  console.log("\nMigration completed successfully!");
}

// Run migration
runMigration().catch((error) => {
  console.error("❌ Migration failed:", error);
  process.exit(1);
});