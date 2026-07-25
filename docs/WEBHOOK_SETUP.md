# Twilio WhatsApp Webhook Configuration Guide

## Current Status

✅ **Outbound WhatsApp** - WORKING
- Scheduler finds reminders
- Sends WhatsApp messages
- Updates status to SENT

⏳ **Inbound Webhook** - NEEDS CONFIGURATION
- Twilio is not calling your backend yet
- Replies from patients are not being processed

---

## Step 1: Configure Twilio Sandbox Webhook

### 1.1 Open Twilio Console

1. Go to https://console.twilio.com
2. Navigate to **Messaging** → **Try it out** → **Send a WhatsApp message**
3. Scroll down to **Sandbox settings**

### 1.2 Configure Inbound URL

Find the section:

```
WHEN A MESSAGE COMES IN
```

Set the following:

**URL:**
```
https://express-reconfirm-superior.ngrok-free.dev/api/twilio/whatsapp/webhook
```

**Method:**
```
POST
```

**Save** the settings.

---

## Step 2: Verify Webhook is Working

### 2.1 Check Your Backend Terminal

After configuring the webhook, send a message from your WhatsApp to the Twilio sandbox number.

Your backend terminal should show:

```
[INFO] WhatsApp webhook received from +919966007804: TAKEN
[INFO] Reminder <reminder_id> marked as COMPLETED by patient via WhatsApp
[INFO] Medication log created for patient <patient_id> (medicine: paracetamol)
[INFO] Thank you! Your dose has been recorded. Stay healthy!
```

### 2.2 Check MongoDB

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

## Step 3: Clean Up Duplicate Reminders

### 3.1 Stop the Server

Press `Ctrl + C` in your terminal to stop the server.

### 3.2 Delete Old Spam Reminders

In MongoDB Compass:

1. Connect to `mongodb://127.0.0.1:27017/medreminder`
2. Go to **reminders** collection
3. Delete all documents with `status: "PENDING"` or run:

```javascript
db.reminders.deleteMany({ status: "PENDING" })
```

### 3.3 Restart Server

```bash
npm run dev
```

---

## Step 4: Test Complete Flow

### 4.1 Create New Test Data

**Register Caregiver:**
```bash
POST /api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "+919876543210",
  "password": "password123"
}
```

**Create Patient:**
```bash
POST /api/patients
{
  "name": "Test Patient",
  "dob": "1990-01-01",
  "gender": "Male",
  "phone": "9966007804",
  "language": "English",
  "emergencyContact": "Emergency Contact",
  "relationship": "Father"
}
```

**Add Medicine (2 minutes from now):**
```bash
POST /api/medicines
{
  "patientId": "<patient_id>",
  "medicineName": "Test Medicine",
  "dosage": "1 tablet",
  "times": ["<current_time_plus_2_minutes>"],
  "timezone": "Asia/Kolkata",
  "totalStock": 30,
  "startDate": "2026-07-25"
}
```

Example: If current time is 18:20, use `"18:22"`

### 4.2 Wait for Scheduler

The scheduler runs every 60 seconds. Watch the terminal for:

```
[INFO] Executing automated scheduler cycle...
[INFO] Found 1 pending reminders
[INFO] Processing reminders: <reminder_id>
[INFO] Sending WhatsApp for reminder <reminder_id> (medicine: Test Medicine)
[INFO] WhatsApp reminder sent to +919966007804 (SID: SM...)
[INFO] Reminder <reminder_id> marked as SENT
[INFO] Scheduler cycle completed successfully.
```

### 4.3 Receive WhatsApp

You should receive:

```
MedReminder+

Hello Test Patient,

It's time to take your medicine.

Medicine:
Test Medicine 1 tablet

Dose:
1 Tablet(s)

Please choose one option below.

Reply TAKEN or SNOOZE
```

### 4.4 Reply TAKEN

Send `TAKEN` from your WhatsApp.

**Expected Backend Logs:**
```
[INFO] WhatsApp webhook received from +919966007804: TAKEN
[INFO] Reminder <reminder_id> marked as COMPLETED by patient via WhatsApp
[INFO] Medication log created for patient <patient_id> (medicine: Test Medicine)
[INFO] Thank you! Your dose has been recorded. Stay healthy!
```

**Expected MongoDB Updates:**

**reminders:**
```json
{
  "status": "COMPLETED"
}
```

**medicationlogs:**
```json
{
  "patientId": "<patient_id>",
  "medicineId": "<medicine_id>",
  "caregiverId": "<caregiver_id>",
  "action": "TAKEN",
  "reminderId": "<reminder_id>",
  "status": "taken"
}
```

---

## Step 5: Test SNOOZE (Optional)

Reply `SNOOZE` to the reminder.

**Expected Backend Logs:**
```
[INFO] WhatsApp webhook received from +919966007804: SNOOZE
[INFO] Reminder <reminder_id> snoozed for 20 minutes. Attempt: 2/3
[INFO] Reminder <reminder_id> snoozed 20 min via WhatsApp
```

**Expected MongoDB Updates:**

**reminders (old):**
```json
{
  "status": "SNOOZED",
  "attempt": 2
}
```

**reminders (new):**
```json
{
  "status": "PENDING",
  "scheduledTime": ISODate("2026-07-25T13:20:00.000Z"),
  "attempt": 2
}
```

---

## Troubleshooting

### Issue: Webhook not receiving messages

**Check:**
1. Twilio sandbox webhook URL is configured correctly
2. URL is accessible from the internet (use ngrok for local development)
3. Backend server is running
4. No firewall blocking port 3000

**Test webhook manually:**
```bash
curl -X POST https://express-reconfirm-superior.ngrok-free.dev/api/twilio/whatsapp/webhook \
  -d "From=whatsapp:+919966007804" \
  -d "Body=TAKEN" \
  -d "SmsMessageSid=SM123"
```

### Issue: Duplicate reminders

**Solution:**
1. Stop server
2. Delete all PENDING reminders in MongoDB
3. Restart server
4. Create new reminders with future times

### Issue: Reminder status not updating

**Check:**
1. Reminder model has "SENT" in enum (it does)
2. Mongoose validation errors in logs
3. Database connection is working

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPLETE MEDREMINDER+ FLOW                │
└─────────────────────────────────────────────────────────────┘

1. Caregiver creates medicine with time "18:30"
   ↓
2. Backend converts IST 18:30 → UTC 13:00
   ↓
3. Reminder created with scheduledTime: 2026-07-25T13:00:00Z
   ↓
4. Scheduler runs every 60 seconds
   ↓
5. Scheduler finds reminder where scheduledTime <= now
   ↓
6. Scheduler sends WhatsApp via Twilio
   ↓
7. Reminder status updated to SENT
   ↓
8. Patient receives WhatsApp
   ↓
9. Patient replies "TAKEN"
   ↓
10. Twilio calls webhook: POST /api/twilio/whatsapp/webhook
   ↓
11. Backend processes reply
   ↓
12. Reminder status → COMPLETED
   ↓
13. Medication log created
   ↓
14. Patient receives confirmation: "Thank you! Your dose has been recorded."
```

---

## Environment Variables Required

```env
# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886

# App
APP_URL=https://express-reconfirm-superior.ngrok-free.dev
PORT=3000

# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/medreminder
```

---

## Success Criteria

✅ Outbound WhatsApp messages sent
✅ Scheduler runs every 60 seconds
✅ Reminders found and processed
✅ Twilio webhook configured
✅ Inbound replies received
✅ Reminder status updates (PENDING → SENT → COMPLETED)
✅ Medication logs created
✅ No duplicate reminders

---

## Next Steps After Success

1. **Production Deployment**
   - Replace ngrok with real domain
   - Update APP_URL in .env
   - Configure Twilio webhook with production URL
   - Deploy to cloud server

2. **Enhanced Features**
   - Add multiple timezone support
   - Implement snooze logic fully
   - Add refill alerts
   - Add adherence tracking dashboard

3. **Monitoring**
   - Add health check endpoint
   - Monitor Twilio delivery reports
   - Log all webhook events
   - Set up alerts for failed reminders