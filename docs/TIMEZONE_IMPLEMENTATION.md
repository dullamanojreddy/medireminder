# MedReminder+ Timezone Implementation Guide

## Overview
This document describes the complete timezone-aware reminder system implementation using Luxon and India Standard Time (IST/Asia/Kolkata).

---

## Phase 1: Database Cleanup

### Manual Cleanup (MongoDB Compass)

1. Open MongoDB Compass
2. Connect to `mongodb://127.0.0.1:27017/medreminder`
3. Delete collections (right-click → Delete):
   - caregivers
   - patients
   - medicines
   - reminders
   - medicationlogs
   - refills

**Result:** Empty `medreminder` database ready for fresh data.

---

## Phase 2: Architecture

### Timezone Flow

```
User Input (IST):
  25 July 2026, 6:30 PM IST
        ↓
Backend converts using Luxon:
  2026-07-25T13:00:00.000Z (UTC)
        ↓
MongoDB stores UTC:
  scheduledTime: ISODate("2026-07-25T13:00:00.000Z")
        ↓
Scheduler compares UTC:
  Query: { scheduledTime: { $lte: new Date() } }
        ↓
WhatsApp sends at correct IST time
```

### Key Principles

- **Storage:** All dates stored in MongoDB as UTC
- **Application:** IST conversion happens at boundaries (input/output)
- **Scheduler:** Compares UTC dates only
- **Default Timezone:** Asia/Kolkata (IST)

---

## Phase 3: Code Changes

### 1. Dependencies

**File:** `package.json`

```json
{
  "dependencies": {
    "luxon": "^3.5.0"
  }
}
```

**Installation:**
```bash
npm install luxon
```

---

### 2. Medicine Model

**File:** `backend/src/models/Medicine.js`

**Change:** Added `timezone` field

```javascript
timezone: {
  type: String,
  default: "Asia/Kolkata",
  required: true,
},
```

**Purpose:** Stores the timezone for each medicine's reminder times.

---

### 3. MedicationLog Model

**File:** `backend/src/models/MedicationLog.js`

**Changes:** Added `action` and `reminderId` fields

```javascript
action: {
  type: String,
  default: "TAKEN",
},
reminderId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Reminder",
  index: true,
},
```

**Purpose:** Links medication logs to specific reminders and captures the action type.

---

### 4. Medicine Validator

**File:** `backend/src/validators/medicineValidator.js`

**Change:** Added timezone validation

```javascript
body("timezone")
  .optional()
  .trim()
  .notEmpty()
  .withMessage("Timezone cannot be empty")
  .isString()
  .withMessage("Timezone must be a string"),
```

---

### 5. Medicine Service (Timezone Conversion)

**File:** `backend/src/services/MedicineService.js`

**Import Luxon:**
```javascript
import { DateTime } from "luxon";
```

**Updated `generateFutureReminders` method:**

```javascript
async generateFutureReminders(medicine) {
  try {
    const remindersToInsert = [];
    const start = new Date(medicine.startDate);
    const daysToSchedule = 7;
    const timezone = medicine.timezone || "Asia/Kolkata";
    
    const end = new Date(start);
    end.setDate(end.getDate() + daysToSchedule);

    if (medicine.endDate) {
      const parsedEnd = new Date(medicine.endDate);
      if (parsedEnd < end) {
        end = parsedEnd;
      }
    }

    // Loop over date range
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      for (const timeStr of medicine.times) {
        // Convert IST time to UTC using Luxon
        const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
        const scheduledTimeUTC = DateTime
          .fromFormat(`${dateStr} ${timeStr}`, "yyyy-MM-dd HH:mm", { zone: timezone })
          .toUTC()
          .toJSDate();

        // Only insert if future
        if (scheduledTimeUTC > new Date()) {
          remindersToInsert.push({
            medicineId: medicine._id,
            patientId: medicine.patientId,
            caregiverId: medicine.caregiverId,
            scheduledTime: scheduledTimeUTC, // UTC Date object
            status: "PENDING",
            attempt: 1,
          });
        }
      }
    }

    if (remindersToInsert.length > 0) {
      await Reminder.insertMany(remindersToInsert);
    }
  } catch (error) {
    console.error("Error generating future reminders:", error.message);
  }
}
```

**Key Change:** Uses Luxon to convert IST times to UTC before storing in MongoDB.

---

### 6. Scheduler Service

**File:** `backend/src/services/SchedulerService.js`

**Import Luxon:**
```javascript
import { DateTime } from "luxon";
```

**Updated `runSchedulerCycle` method:**

```javascript
async runSchedulerCycle() {
  Logger.info("Executing automated scheduler cycle...");
  try {
    await this.processDoseReminders();
    await this.processPendingReminders(); // NEW: Process pre-generated reminders
    await this.processSnoozedReminders();
    await this.processRefills();
    Logger.info("Scheduler cycle completed successfully.");
  } catch (error) {
    Logger.error("Scheduler cycle failed: " + error.message);
  }
}
```

**Updated `processDoseReminders` with logging:**

```javascript
async processDoseReminders() {
  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, "0");
  const currentMinutes = String(now.getMinutes()).padStart(2, "0");
  const currentTimeStr = currentHours + ":" + currentMinutes;

  Logger.info("Checking reminders at " + now.toISOString() + " (current time: " + currentTimeStr + ")");

  const activeMedicines = await Medicine.find({ status: "ACTIVE" });

  for (const medicine of activeMedicines) {
    if (medicine.endDate) {
      const end = new Date(medicine.endDate);
      if (now > end) {
        medicine.status = "EXPIRED";
        await medicine.save();
        continue;
      }
    }

    const matchesTime = medicine.times.includes(currentTimeStr);
    if (matchesTime) {
      const startOfMinute = new Date(now);
      startOfMinute.setSeconds(0, 0);
      const endOfMinute = new Date(now);
      endOfMinute.setSeconds(59, 999);

      const existingReminder = await Reminder.findOne({
        medicineId: medicine._id,
        scheduledTime: { $gte: startOfMinute, $lte: endOfMinute },
      });

      if (!existingReminder) {
        await Reminder.create({
          medicineId: medicine._id,
          patientId: medicine.patientId,
          caregiverId: medicine.caregiverId,
          scheduledTime: now,
          status: "PENDING",
          attempt: 1,
        });
        Logger.info(
          'Created new reminder for medicine "' +
            medicine.medicineName +
            '" at ' +
            currentTimeStr
        );

        // Send WhatsApp reminder to patient
        await this.sendWhatsAppDoseReminder(medicine);

        // Optionally make a voice call as backup (if enabled via env var)
        if (process.env.TWILIO_VOICE_ENABLED === "true") {
          await this.makeVoiceCallReminder(medicine);
        }
      }
    }
  }
}
```

**NEW: `processPendingReminders` method:**

```javascript
async processPendingReminders() {
  const now = new Date();
  Logger.info("Searching reminders before: " + now.toISOString());

  const pendingReminders = await Reminder.find({
    status: "PENDING",
    scheduledTime: { $lte: now },
  });

  Logger.info("Found " + pendingReminders.length + " pending reminders");

  for (const reminder of pendingReminders) {
    try {
      const medicine = await Medicine.findById(reminder.medicineId);
      if (!medicine) {
        Logger.warn("Medicine not found for reminder " + reminder._id);
        continue;
      }

      Logger.info("Sending WhatsApp for reminder " + reminder._id + " (medicine: " + medicine.medicineName + ")");

      await this.sendWhatsAppDoseReminder(medicine);

      // Update reminder status to SENT
      reminder.status = "SENT";
      await reminder.save();

      Logger.info("Reminder " + reminder._id + " marked as SENT");
    } catch (error) {
      Logger.error("Failed to process reminder " + reminder._id + ": " + error.message);
    }
  }
}
```

**Purpose:** Processes pre-generated reminders that are due (scheduledTime <= now).

---

### 7. Twilio Controller (Webhook)

**File:** `backend/src/controllers/TwilioController.js`

**Import MedicationLog:**
```javascript
import MedicationLog from "../models/MedicationLog.js";
```

**Updated `handleWhatsAppWebhook` - TAKEN action:**

```javascript
if (action === "TAKEN") {
  reminder.status = "COMPLETED";
  await reminder.save();
  Logger.info("Reminder " + reminder._id + " marked as COMPLETED by patient via WhatsApp");

  // Create medication log entry
  try {
    const medicine = await Medicine.findById(reminder.medicineId);
    if (medicine) {
      await MedicationLog.create({
        patientId: patient._id,
        medicineId: medicine._id,
        caregiverId: medicine.caregiverId,
        action: "TAKEN",
        timestamp: new Date(),
        reminderId: reminder._id,
      });
      Logger.info("Medication log created for patient " + patient._id + " (medicine: " + medicine.medicineName + ")");
    }
  } catch (error) {
    Logger.error("Failed to create medication log: " + error.message);
  }

  // Send confirmation
  await twilioService.sendWhatsAppMessage(
    phoneNumber,
    "Thank you! Your dose has been recorded. Stay healthy!"
  );
}
```

**Purpose:** Creates a medication log entry when patient replies "TAKEN".

---

### 8. Patient Validator (Phone Number Fix)

**File:** `backend/src/validators/patientValidator.js`

**Change:**
```javascript
body("phone")
  .trim()
  .notEmpty()
  .withMessage("Primary phone number is required")
  .isLength({ min: 10, max: 16 })
  .withMessage("Phone number must be 10-16 digits (with optional country code)"),
```

**Purpose:** Accepts E.164 format phone numbers (e.g., +919966007804).

---

### 9. Frontend Validation

**File:** `src/pages/AddPatient.tsx`

**Change:**
```javascript
if (!form.phone) {
  tempErrors.phone = "Phone number is required.";
} else if (!/^\d{10}$/.test(form.phone) && !/^\+[1-9]\d{6,14}$/.test(form.phone)) {
  tempErrors.phone = "Phone number must be 10 digits or valid E.164 format (e.g., +919966007804).";
}
```

**Purpose:** Accepts both 10-digit and E.164 format phone numbers.

---

## Phase 4: Twilio WhatsApp Integration

### Configuration

**Environment Variables (.env):**

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
TWILIO_PHONE_NUMBER=+14155238886  # For voice calls
APP_URL=https://your-domain.com
```

### Message Flow

**From Number:** `whatsapp:+14155238886`
**To Number:** `whatsapp:+919966007804` (patient's phone)

### Logging

All Twilio messages log the Message SID:

```javascript
Logger.info("WhatsApp reminder sent to " + to + " (SID: " + message.sid + ")");
```

---

## Phase 5: Testing Flow

### Step 1: Register Caregiver

**Endpoint:** `POST /api/auth/register`

```json
{
  "name": "Manoj",
  "email": "test@gmail.com",
  "phone": "+919876543210",
  "password": "password123"
}
```

**Expected:** Caregiver created in `caregivers` collection.

---

### Step 2: Create Patient

**Endpoint:** `POST /api/patients`

```json
{
  "name": "Ramesh",
  "dob": "1990-05-15",
  "gender": "Male",
  "phone": "9966007804",
  "language": "English",
  "emergencyContact": "Suman",
  "relationship": "Father"
}
```

**Expected:** 
- Patient created in `patients` collection
- Phone normalized to `+919966007804`

---

### Step 3: Add Medicine

**Endpoint:** `POST /api/medicines`

```json
{
  "patientId": "<patient_id>",
  "medicineName": "Paracetamol",
  "dosage": "1 tablet",
  "times": ["18:30"],
  "timezone": "Asia/Kolkata",
  "totalStock": 30,
  "startDate": "2026-07-25"
}
```

**Expected:**
- Medicine created in `medicines` collection
- 7 days of reminders generated in `reminders` collection
- Reminder `scheduledTime` stored in UTC (e.g., `2026-07-25T13:00:00.000Z` for 6:30 PM IST)

---

### Step 4: Verify Reminders in MongoDB

**Query in MongoDB Compass:**

```javascript
db.reminders.find({ medicineId: "<medicine_id>" })
```

**Expected Output:**
```json
{
  "_id": "...",
  "medicineId": "...",
  "patientId": "...",
  "caregiverId": "...",
  "scheduledTime": ISODate("2026-07-25T13:00:00.000Z"),
  "status": "PENDING",
  "attempt": 1,
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

---

### Step 5: Wait for Scheduler

**Terminal Output (every 60 seconds):**

```
[INFO] Executing automated scheduler cycle...
[INFO] Checking reminders at 2026-07-25T12:55:00.000Z (current time: 12:55)
[INFO] Searching reminders before: 2026-07-25T12:55:00.000Z
[INFO] Found 1 pending reminders
[INFO] Sending WhatsApp for reminder <reminder_id> (medicine: Paracetamol)
[INFO] WhatsApp dose reminder sent to patient Ramesh for Paracetamol
[INFO] Reminder <reminder_id> marked as SENT
[INFO] Scheduler cycle completed successfully.
```

---

### Step 6: Receive WhatsApp

**Patient receives:**
```
MedReminder+

Hello Ramesh,

It's time to take your medicine.

Medicine:
Paracetamol 1 tablet

Dose:
1 Tablet(s)

Please choose one option below.

Reply TAKEN or SNOOZE
```

---

### Step 7: Reply TAKEN

**Patient replies:** `TAKEN`

**Webhook Logs:**
```
[INFO] WhatsApp webhook received from +919966007804: TAKEN
[INFO] Reminder <reminder_id> marked as COMPLETED by patient via WhatsApp
[INFO] Medication log created for patient <patient_id> (medicine: Paracetamol)
[INFO] Thank you! Your dose has been recorded. Stay healthy!
```

**MongoDB Updates:**

**reminders collection:**
```json
{
  "_id": "<reminder_id>",
  "status": "COMPLETED",
  ...
}
```

**medicationlogs collection:**
```json
{
  "_id": "...",
  "patientId": "<patient_id>",
  "medicineId": "<medicine_id>",
  "caregiverId": "<caregiver_id>",
  "action": "TAKEN",
  "reminderId": "<reminder_id>",
  "status": "taken",
  "timestamp": ISODate("2026-07-25T13:00:00.000Z"),
  "createdAt": ISODate("...")
}
```

---

## Phase 6: Troubleshooting

### Issue: Reminders not sending

**Check:**
1. Scheduler logs show "Found X pending reminders"
2. Twilio is initialized (check startup logs)
3. Patient phone number is in E.164 format
4. Reminder `scheduledTime` is in UTC and <= current time

### Issue: Wrong timezone

**Verify:**
1. Medicine has `timezone: "Asia/Kolkata"` field
2. Luxon conversion in `generateFutureReminders` is correct
3. Check MongoDB: `scheduledTime` should be UTC (5.5 hours behind IST)

### Issue: Webhook not creating medication logs

**Check:**
1. Webhook endpoint is accessible (APP_URL is correct)
2. Twilio signature validation passes
3. Patient is found by phone number
4. Reminder is found with status "PENDING"

---

## Phase 7: Database Schema

### caregivers
```json
{
  "_id": ObjectId("..."),
  "name": "Manoj",
  "email": "test@gmail.com",
  "phone": "+919876543210",
  "password": "hashed_password",
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

### patients
```json
{
  "_id": ObjectId("..."),
  "caregiverId": ObjectId("..."),
  "name": "Ramesh",
  "dob": "1990-05-15",
  "gender": "Male",
  "phone": "+919966007804",
  "preferredLanguage": "English",
  "emergencyContactName": "Suman",
  "emergencyContactPhone": "",
  "relationship": "Father",
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

### medicines
```json
{
  "_id": ObjectId("..."),
  "patientId": ObjectId("..."),
  "caregiverId": ObjectId("..."),
  "medicineName": "Paracetamol",
  "dosage": "1 tablet",
  "quantity": 30,
  "remainingQuantity": 30,
  "tabletsPerDose": 1,
  "totalStock": 30,
  "timings": [{ "time": "18:30", "enabled": true }],
  "times": ["18:30"],
  "startDate": "2026-07-25",
  "endDate": "",
  "status": "ACTIVE",
  "timezone": "Asia/Kolkata",
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

### reminders
```json
{
  "_id": ObjectId("..."),
  "medicineId": ObjectId("..."),
  "patientId": ObjectId("..."),
  "caregiverId": ObjectId("..."),
  "scheduledTime": ISODate("2026-07-25T13:00:00.000Z"),
  "attempt": 1,
  "status": "PENDING",
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

### medicationlogs
```json
{
  "_id": ObjectId("..."),
  "patientId": ObjectId("..."),
  "medicineId": ObjectId("..."),
  "caregiverId": ObjectId("..."),
  "medicineName": "Paracetamol",
  "date": "2026-07-25",
  "time": "06:30 PM",
  "status": "taken",
  "action": "TAKEN",
  "reminderId": ObjectId("..."),
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

### refills
```json
{
  "_id": ObjectId("..."),
  "medicineId": ObjectId("..."),
  "patientId": ObjectId("..."),
  "caregiverId": ObjectId("..."),
  "remainingQuantity": 30,
  "estimatedRefillDate": ISODate("2026-08-24T..."),
  "status": "SAFE",
  "lastAlertDate": null,
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

---

## Phase 8: Summary of Changes

### Files Modified

1. **backend/src/models/Medicine.js** - Added `timezone` field
2. **backend/src/models/MedicationLog.js** - Added `action` and `reminderId` fields
3. **backend/src/services/MedicineService.js** - Luxon timezone conversion in `generateFutureReminders`
4. **backend/src/services/SchedulerService.js** - Added `processPendingReminders`, enhanced logging
5. **backend/src/controllers/TwilioController.js** - Create medication logs on TAKEN action
6. **backend/src/validators/medicineValidator.js** - Added timezone validation
7. **backend/src/validators/patientValidator.js** - Accept E.164 phone format
8. **src/pages/AddPatient.tsx** - Accept E.164 phone format
9. **package.json** - Added `luxon` dependency

### New Dependencies

```bash
npm install luxon
```

---

## Phase 9: Test Checklist

- [ ] Delete all MongoDB collections
- [ ] Register new caregiver
- [ ] Create new patient with phone number
- [ ] Add medicine with timezone "Asia/Kolkata" and time "18:30"
- [ ] Verify reminders created in MongoDB with UTC times
- [ ] Wait for scheduler to run (check logs)
- [ ] Receive WhatsApp message at correct IST time
- [ ] Reply "TAKEN" to WhatsApp
- [ ] Verify reminder status changed to "COMPLETED"
- [ ] Verify medication log created in MongoDB
- [ ] Check all logs for proper timezone handling

---

## Phase 10: Production Deployment

### Environment Variables

```env
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/medreminder
JWT_SECRET=your_jwt_secret

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
TWILIO_PHONE_NUMBER=+14155238886
TWILIO_VOICE_ENABLED=false

# App
APP_URL=https://your-domain.com
PORT=3000

# Optional: Gemini AI for translations
GEMINI_API_KEY=your_gemini_api_key
```

### Deployment Steps

1. Install dependencies: `npm install`
2. Build frontend: `npm run build`
3. Start server: `npm start`
4. Verify scheduler logs
5. Test with one patient/medicine
6. Monitor Twilio delivery reports

---

## Support

For issues or questions, check:
- Scheduler logs in terminal
- Twilio console for message delivery status
- MongoDB Compass for database state
- Application logs for errors