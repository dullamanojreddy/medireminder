# Phone Number Normalization System

## Architecture

MedReminder+ uses a centralized phone number normalization system to ensure all phone numbers are stored in E.164 format for consistent processing and Twilio compatibility.

### E.164 Format
- **Format**: `+[country code][number]`
- **Example**: `+919966007804` (India)
- **Benefits**: 
  - Works reliably with Twilio WhatsApp, SMS, and voice calls
  - Consistent database storage
  - No ambiguity in international numbers

## Validation Flow

```
User Input (9966007804 or +919966007804)
    ↓
Frontend: normalizePhone() - Optional pre-validation
    ↓
Backend: validateAndNormalize() - Required validation
    ↓
1. Trim whitespace
2. Remove all non-digit characters (except leading +)
3. Normalize to E.164:
   - If starts with +, keep as +[digits]
   - If 10 digits, add +91 (Indian number)
   - If starts with 0, remove 0 and add +91
   - Otherwise, prepend +
4. Validate E.164 format (+ followed by 6-14 digits)
    ↓
MongoDB: Store normalized number
    ↓
Twilio: Use stored number directly (no conversion needed)
```

## Files Changed

### Core Utility
- **`backend/src/utils/phone.util.js`** - Phone normalization utility
  - `sanitizePhone()` - Remove non-digit characters
  - `isValidE164()` - Validate E.164 format
  - `normalizePhone()` - Convert to E.164
  - `validateAndNormalize()` - Validate and normalize (throws on error)

### Backend Services
- **`backend/src/services/PatientService.js`** - Patient phone normalization
  - `createPatient()` - Normalizes phone and emergency contact phone
  - `updatePatient()` - Normalizes phone numbers on update

- **`backend/src/services/AuthService.js`** - Caregiver phone normalization
  - `register()` - Normalizes caregiver phone number

### Frontend
- **`src/pages/AddPatient.tsx`** - Patient registration form
  - Added `normalizePhone()` function
  - Normalizes phone before submission
  - Users can enter: `9966007804` or `+919966007804`

### Migration
- **`backend/src/utils/migrate-phones.js`** - One-time migration script
  - Updates all existing phone numbers to E.164
  - Processes patients and caregivers
  - Logs all changes

### Tests
- **`backend/src/utils/phone.util.test.js`** - Unit tests
  - 14 test cases covering all scenarios
  - All tests passing ✅

## Usage Examples

### Valid Inputs
```
9966007804        → +919966007804 (10-digit Indian)
+919966007804     → +919966007804 (already normalized)
09960007804       → +919966007804 (leading 0 removed)
+91-9966-0078-04  → +919966007804 (formatted)
(996) 600-7804    → +919966007804 (formatted)
919966007804      → +919966007804 (12-digit without +)
14155238886       → +14155238886 (US number)
```

### Invalid Inputs (Returns 400 Error)
```
""                → Error: Phone number is required
"123"             → Error: Invalid phone number format
"+91"             → Error: Invalid phone number format
"abc"             → Error: Invalid phone number format
```

## Migration

### Running the Migration

```bash
# Make sure the server is NOT running
# Then execute:
node backend/src/utils/migrate-phones.js
```

### Migration Output Example
```
============================================================
Phone Number Migration to E.164 Format
Version: 1.0.0
============================================================

✅ Connected to MongoDB

Migrating Patients...
Found 1 patients

  ✓ Patient 6a64a121897e249c3b160f69: 9966007804 → +919966007804

Migrating Caregivers...
Found 1 caregivers

  ✓ Caregiver 6a5f39e2ab5fb440ce5c4e9a (manoj@example.com): 9876543210 → +919876543210

============================================================
MIGRATION SUMMARY
============================================================
PATIENTS:
  Total: 1
  Migrated: 1
  Skipped (already normalized): 0
  Errors: 0

CAREGIVERS:
  Total: 1
  Migrated: 1
  Skipped (already normalized): 0
  Errors: 0
============================================================

✅ Disconnected from MongoDB

Migration completed successfully!
```

## Test Results

```
Running Phone Normalization Tests...

============================================================
✅ PASS: sanitizePhone: removes all non-digit characters
✅ PASS: sanitizePhone: handles empty/null input
✅ PASS: isValidE164: validates correct E.164 numbers
✅ PASS: isValidE164: rejects invalid formats
✅ PASS: normalizePhone: converts 10-digit Indian numbers to E.164
✅ PASS: normalizePhone: handles numbers with formatting
✅ PASS: normalizePhone: leaves already normalized numbers unchanged
✅ PASS: normalizePhone: handles numbers starting with 0
✅ PASS: normalizePhone: handles 12-digit Indian numbers without +
✅ PASS: normalizePhone: handles international numbers
✅ PASS: normalizePhone: handles edge cases
✅ PASS: normalizePhone: prevents duplicate normalization
✅ PASS: validateAndNormalize: normalizes valid numbers
✅ PASS: validateAndNormalize: throws error for invalid numbers
============================================================

Test Results: 14 passed, 0 failed, 14 total

✅ All tests passed!
```

## Integration Points

### Twilio Service
The Twilio service (`backend/src/services/twilio.service.js`) uses phone numbers directly from the database without additional conversion:

```javascript
// SchedulerService.js:228
const result = await twilioService.sendWhatsAppReminder(patient.phone, reminderText);

// Twilio service automatically prepends "whatsapp:" prefix
// to: "whatsapp:+919966007804"
```

### Scheduler
The scheduler creates reminders and sends WhatsApp messages using stored E.164 numbers:

```javascript
// SchedulerService.js:181-228
async sendWhatsAppDoseReminder(medicine) {
  const patient = await Patient.findById(medicine.patientId);
  // patient.phone is already in E.164 format
  const result = await twilioService.sendWhatsAppReminder(patient.phone, reminderText);
}
```

## Benefits

1. **User-Friendly**: Users can enter `9966007804` or `+919966007804`
2. **Consistent**: All numbers stored in E.164 format
3. **Twilio-Ready**: No conversion needed before sending
4. **Validated**: Invalid numbers rejected with clear error messages
5. **Maintainable**: Single source of truth for phone normalization
6. **Tested**: 14 unit tests covering all scenarios

## Future Enhancements

- Add phone number validation per country (not just India)
- Support for phone number parsing libraries (libphonenumber-js)
- Add phone number type detection (mobile/landline)
- Implement phone number verification via OTP