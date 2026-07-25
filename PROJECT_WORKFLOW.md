# Project Workflow Document: MedReminder+

> **NOT A README.** This document is for AI agents and developers who need to understand the current implementation state before modifying the project.

---

## 1. Project Overview

| Attribute | Value |
|-----------|-------|
| **Project Name** | MedReminder+ |
| **Project Purpose** | A caregiver-facing web application where caregivers register patients (elderly/chronic), create medication schedules with custom dosing times, and receive automated reminder delivery via Twilio WhatsApp messaging and optionally Twilio Voice calls. The system tracks adherence, manages refill alerts, and uses Gemini AI for multilingual reminder translation. |
| **Current Development Stage** | MVP — Functional prototype with core features complete. Twilio integration newly added (not yet tested with real credentials). |
| **Implementation Percentage Estimate** | ~85% core features complete. Twilio integration code is written but **untested end-to-end**. |
| **Language** | Frontend: TypeScript (React). Backend: JavaScript (Express.js, ES modules). |

---

## 2. Current Working Features

All features below have been **verified from source code**.

| Feature | Status | Files Involved | Working Flow |
|---------|--------|---------------|-------------|
| **Caregiver Authentication** | ✅ **Working** | `AuthController.js`, `AuthService.js`, `AuthRepository.js`, `authRoutes.js`, `authMiddleware.js` | Register → JWT issued → Protected routes verify token via header/cookie |
| **Patient CRUD** | ✅ **Working** | `PatientController.js`, `PatientService.js`, `PatientRepository.js`, `patientRoutes.js`, `Patient.js` (model) | Create/Read/Update/Delete patients with phone, language, emergency contact |
| **Medicine CRUD** | ✅ **Working** | `MedicineController.js`, `MedicineService.js`, `MedicineRepository.js`, `medicineRoutes.js`, `Medicine.js` (model) | Create/Read/Update/Delete medicines with dosage, timing schedules, stock tracking |
| **Reminder Listing & Actions** | ✅ **Working** | `ReminderController.js`, `ReminderService.js`, `ReminderRepository.js`, `reminderRoutes.js` | List reminders, handle actions: COMPLETED (decrements stock), SNOOZED (touch updatedAt), EXPIRED |
| **Automated Scheduler** | ✅ **Working** | `reminderScheduler.js`, `SchedulerService.js` | Polls every 60s. Creates reminders when dose time matches. Handles snooze cooldown (5min). Calculates refill alerts. |
| **Refill Status Tracking** | ✅ **Working** | `RefillController.js`, `RefillRepository.js`, `Refill.js` (model) | Tracks SAFE/WARNING/CRITICAL per medicine based on remaining quantity |
| **Adherence Logging** | ✅ **Working** | `MedicationLogController.js`, `MedicationLog.js` (model) | Log taken/missed/snoozed per dose with date/time |
| **Dashboard Stats** | ✅ **Working** | `DashboardController.js`, `dashboardRoutes.js` | Returns patient count, upcoming reminders, refill alerts, adherence rate |
| **Twilio WhatsApp Sending** | ✅ **Code Complete (Not tested with real credentials)** | `twilio.service.js` (sendWhatsAppReminder, sendWhatsAppMessage, sendSnoozeOptions) | Scheduler calls sendWhatsAppDoseReminder → twilio.service.sendWhatsAppReminder |
| **Twilio WhatsApp Webhook** | ✅ **Code Complete (Not tested with real credentials)** | `TwilioController.js` (handleWhatsAppWebhook), `twilioRoutes.js` | Receives patient replies, validates signature, processes TAKEN/SNOOZE, updates MongoDB |
| **Twilio Voice Calling** | ✅ **Code Complete (Not tested with real credentials)** | `twilio.service.js` (makeVoiceCall, generateVoiceTwiml), `TwilioController.js` (handleVoiceGather, handleVoiceSnooze) | Scheduler calls makeVoiceCallReminder → twilio.service.makeVoiceCall → TwiML generation → DTMF processing |
| **Twilio Delivery Status** | ✅ **Code Complete (Not tested)** | `TwilioController.js` (handleStatusCallback) | Receives call status updates, notifies caregiver on failure |
| **Gemini AI Translation** | ✅ **Code Complete (Requires API key)** | `twilio.service.js` (translateText) | Translates English reminder text to patient's preferred language |
| **Refill WhatsApp Alerts** | ✅ **Code Complete (Not tested)** | `SchedulerService.js` (sendRefillAlert) | Sends refill alert to caregiver + patient when WARNING or CRITICAL |

---

## 3. Current Non-Working / Incomplete Features

| Problem | Location | Impact | Recommended Fix |
|---------|----------|--------|---------------|
| **Twilio credentials not configured** | `.env` lines 33-36 | Twilio will not send messages. `twilioService.isReady()` returns false. | Fill TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER from Twilio Console |
| **Gemini API key not set** | `.env` line 23 | `GEMINI_API_KEY=YOUR_GEMINI_API_KEY` — translation falls back to English | Get API key from Google AI Studio |
| **APP_URL may mismatch** | `.env` line 28, `server.js` line 15 | APP_URL uses port 5000 but server starts on port 3000. Twilio webhooks will hit wrong URL. | Set APP_URL=http://localhost:3000 OR change PORT=3000 |
| **Missing MedicationLogController import** | `backend/src/app.js` line 38-44 | `medication-logs` route and patient adherence/log routes work but imports are placed after middleware | **Low risk** — imports work despite being after middleware (hoisted) |
| **No frontend Twilio settings UI** | Frontend has no Twilio configuration page | Caregiver cannot enable/disable voice calls or configure Twilio from UI | Feature gap — controlled only via env vars |
| **No frontend notification of WhatsApp delivery** | Frontend doesn't show delivery status | Caregiver doesn't know if WhatsApp was delivered | Future enhancement |
| **Mock data unused in production** | `src/mock/mockPatients.ts`, `src/mock/mockReminders.ts` | Used only as reference/types. Frontend fetches from API. | Not a bug, but can cause confusion |
| **PORT mismatch between .env and server.js** | `.env: PORT=5000`, `server.js: const PORT = 3000` | Confusion about which port server runs on | Fix: either change .env PORT to 3000 or use `process.env.PORT` in server.js |
| **Reminder time format discrepancy** | Scheduler uses HH:mm (24h). Frontend mock uses hh:mm AM/PM (12h). Medicine times stored as 24h strings. | If frontend sends 12h time strings, scheduler may not match. | Verify all times stored as 24h HH:mm format |
| **No retry logic for failed Twilio sends** | `twilio.service.js` — returns null on failure, no retry | Temporary Twilio failures will silently drop reminders | Add retry with exponential backoff |
| **No rate limiting on Twilio webhooks** | `TwilioController.js` — no rate limiting | Potential for abuse or duplicate webhook processing | Add rate limiting middleware |
| **Voice calls not enabled by default** | `TWILIO_VOICE_ENABLED=false` | No voice calls unless caregiver configures | Documented choice |
| **No audio file for voice calls** | Voice calls use Twilio TTS only | Works, but no custom audio | TTS is sufficient for MVP |
| **X-Twilio-Signature check may fail on first test** | Signature validation requires correct APP_URL and auth token | Webhook will return 403 if URL mismatches | Use ngrok URL matching exactly |

---

## 4. Complete System Architecture (Verified from Code)

### Frontend Architecture

```
src/App.tsx (React Router - HashRouter)
  |
  +-- Public Routes (MainLayout wrapper)
  |   +-- / -> LandingPage.tsx
  |   +-- /login -> LoginPage.tsx
  |   +-- /register -> RegisterPage.tsx
  |
  +-- Protected Routes (ProtectedRoute wrapper)
      +-- /dashboard -> Dashboard.tsx
      +-- /patients -> Patients.tsx
      +-- /patients/add -> AddPatient.tsx
      +-- /patients/:id -> PatientDetails.tsx
      +-- /patients/:id/edit -> EditPatient.tsx
      +-- /reminders -> ReminderQueue.tsx
      +-- /settings -> SettingsPage.tsx

Data Flow:
  Component (UI)
    -> Service (src/services/*.ts) [business logic + API calls]
      -> api.ts (Axios instance) [baseURL: "/api", auth interceptor]
        -> Backend API (/api/*)

State Management:
  - React Context: PatientContext.tsx (shared patient list state)
  - Component state: useState, useEffect for local data
  - No Redux or external state management
```

### Backend Architecture

```
server.js (Entry point - starts Vite dev + Express)
  |
  +-- connectDB() -> MongoDB (via Mongoose)
  +-- startScheduler() -> 60s polling loop
  |
  +-- Proxy /api/* -> backend/src/app.js
        |
        +-- Global Middleware: helmet, cors, morgan, express.json, cookieParser
        |
        +-- /api/auth ------ authRoutes.js ---- AuthController.js ---- AuthService.js ---- AuthRepository.js ---- Caregiver.js
        +-- /api/patients -- patientRoutes.js - PatientController.js - PatientService.js - PatientRepository.js - Patient.js
        +-- /api/medicines - medicineRoutes.js - MedicineController.js - MedicineService.js - MedicineRepository.js - Medicine.js
        +-- /api/reminders - reminderRoutes.js - ReminderController.js - ReminderService.js - ReminderRepository.js - Reminder.js
        +-- /api/refills --- refillRoutes.js --- RefillController.js --- (uses RefillRepository directly) --- Refill.js
        +-- /api/dashboard - dashboardRoutes.js - DashboardController.js
        +-- /api/twilio ---- twilioRoutes.js --- TwilioController.js --- twilio.service.js
        +-- /api/health ---- (inline in app.js)
```

### External Services Flow

```
SchedulerService.js (60s loop)
  |
  +-- processDoseReminders()
  |   +-- Creates Reminder document (MongoDB)
  |   +-- SchedulerService.sendWhatsAppDoseReminder()
  |   |   +-- twilio.service.sendWhatsAppReminder()
  |   |       +-- Twilio WhatsApp API -> Patient's phone
  |   +-- (if TWILIO_VOICE_ENABLED) SchedulerService.makeVoiceCallReminder()
  |       +-- twilio.service.makeVoiceCall()
  |           +-- Twilio Voice API -> Patient's phone
  |
  +-- processSnoozedReminders()
  |   +-- Re-activates snoozed reminders after 5 min cooldown
  |
  +-- processRefills()
      +-- Calculates refill status (SAFE/WARNING/CRITICAL)
      +-- SchedulerService.sendRefillAlert()
          +-- twilio.service.sendTemplateMessage()
              +-- Twilio WhatsApp API -> Caregiver + Patient
```

### Component Responsibilities

| Component | Responsibility | Verdict |
|-----------|---------------|---------|
| Routes (routes/*.js) | Define endpoints, apply middleware (auth, validation) | Clean |
| Controllers (controllers/*.js) | Parse HTTP requests, call services, format responses | Lightweight |
| Services (services/*.js) | Business logic, orchestration, throw ApiError | Proper separation |
| Repositories (repositories/*.js) | Database queries, encapsulate Mongoose | Proper data access layer |
| Models (models/*.js) | Mongoose schemas, validation, indexes only | No business logic |
| Middleware (middleware/*.js) | Auth (JWT), error handling | Proper |
| Validators (validators/*.js) | Express-validator based | Proper |

---

## 5. Actual Folder Structure (Verified)

```
medreminder+/
|
+-- server.js                           # Entry point -- starts Vite + Express
+-- package.json                        # Dependencies, scripts
+-- tsconfig.json                       # TypeScript config
+-- vite.config.ts                      # Vite build config
+-- index.html                          # Vite HTML entry
+-- .env                                # Environment variables (gitignored)
+-- .env.example                        # Example env vars
+-- AI_CONTEXT.md                       # AI agent context document
|
+-- src/                                # FRONTEND (React SPA)
|   +-- App.tsx                         # Root -- HashRouter, routes, providers
|   +-- main.tsx                        # Entry -- renders App
|   +-- index.css                       # Tailwind imports
|   +-- types.ts                        # Shared TypeScript types
|   |
|   +-- components/                     # Reusable UI
|   |   +-- Button.tsx, Card.tsx, Input.tsx, Modal.tsx, Toast.tsx
|   |   +-- Navbar.tsx, Footer.tsx, LanguageDropdown.tsx
|   |   +-- LoadingSpinner.tsx, MedicalIllustration.tsx
|   |   +-- common/                     # Badge, ConfirmModal, EmptyState, SearchBar
|   |   +-- layout/                     # Sidebar, Topbar
|   |   +-- patients/                   # AdherenceGraph, MedicationLogTable, MedicineModal, MedicinePreview, PatientCard, PatientInfo, PatientTable
|   |   +-- stats/                      # StatCard
|   |
|   +-- pages/                          # Page components
|   |   +-- Dashboard.tsx, Patients.tsx, AddPatient.tsx, EditPatient.tsx
|   |   +-- PatientDetails.tsx, ReminderQueue.tsx, RefillQueue.tsx
|   |   +-- SettingsPage.tsx, LandingPage.tsx, LoginPage.tsx
|   |   +-- RegisterPage.tsx, NotFoundPage.tsx
|   |
|   +-- services/                       # API communication
|   |   +-- api.ts                      # Axios instance (baseURL: /api, auth interceptor)
|   |   +-- authService.ts              # Auth API calls
|   |   +-- patientService.ts           # Patient + medicine mapping
|   |   +-- medicineService.ts          # Medicine CRUD + adherence
|   |   +-- reminderService.ts          # Reminder listing + actions
|   |   +-- refillService.ts            # Refill API calls
|   |
|   +-- context/                        # React context
|   |   +-- PatientContext.tsx           # Shared patient state
|   |
|   +-- layouts/                        # Layout wrappers
|   |   +-- MainLayout.tsx              # Main layout
|   |
|   +-- routes/                         # Guards
|   |   +-- ProtectedRoute.tsx          # Auth check wrapper
|   |
|   +-- mock/                           # Mock data (DEV ONLY)
|       +-- mockPatients.ts             # 12 sample patients
|       +-- mockReminders.ts            # 30 sample reminders
|
+-- backend/                            # BACKEND (Express.js)
|   +-- server.js                       # Legacy entry (unused)
|   |
|   +-- src/
|       +-- app.js                      # Express setup + routes
|       +-- config/db.js                # Mongoose connection
|       |
|       +-- controllers/                # HTTP handlers
|       |   +-- AuthController.js       # register, login, logout, profile
|       |   +-- PatientController.js    # CRUD + summary
|       |   +-- MedicineController.js   # CRUD
|       |   +-- ReminderController.js   # List, get, handleAction
|       |   +-- MedicationLogController.js # Adherence logs
|       |   +-- DashboardController.js  # Dashboard stats
|       |   +-- RefillController.js     # Refill list
|       |   +-- TwilioController.js     # WhatsApp webhook, Voice TwiML, DTMF, status
|       |
|       +-- services/                   # Business logic
|       |   +-- AuthService.js          # Auth logic, JWT
|       |   +-- PatientService.js       # Patient logic
|       |   +-- MedicineService.js      # Medicine logic
|       |   +-- ReminderService.js      # Action handling + stock decrement
|       |   +-- RefillService.js        # Refill logic
|       |   +-- SchedulerService.js     # Background job orchestration + Twilio integration
|       |   +-- twilio.service.js       # Twilio WhatsApp, Voice, Translation, Webhooks
|       |
|       +-- models/                     # Mongoose schemas
|       |   +-- Caregiver.js            # name, email, phone, password (hashed)
|       |   +-- Patient.js              # name, dob, gender, phone, language, emergencyContact
|       |   +-- Medicine.js             # medicineName, dosage, quantity, times, timings, dates, status
|       |   +-- Reminder.js             # medicineId, patientId, caregiverId, scheduledTime, attempt, status
|       |   +-- MedicationLog.js        # patientId, medicineId, date, time, status
|       |   +-- Refill.js               # medicineId, remainingQuantity, estimatedRefillDate, status
|       |
|       +-- repositories/               # Data access
|       |   +-- AuthRepository.js
|       |   +-- PatientRepository.js
|       |   +-- MedicineRepository.js
|       |   +-- ReminderRepository.js
|       |   +-- RefillRepository.js
|       |
|       +-- routes/                     # Express routes
|       |   +-- authRoutes.js           # /api/auth
|       |   +-- patientRoutes.js        # /api/patients
|       |   +-- medicineRoutes.js       # /api/medicines
|       |   +-- reminderRoutes.js       # /api/reminders
|       |   +-- refillRoutes.js         # /api/refills
|       |   +-- dashboardRoutes.js      # /api/dashboard
|       |   +-- twilioRoutes.js         # /api/twilio (webhooks)
|       |
|       +-- middleware/
|       |   +-- authMiddleware.js       # JWT verification
|       |   +-- errorMiddleware.js      # Global error handler
|       |
|       +-- validators/
|       |   +-- authValidator.js
|       |   +-- medicineValidator.js
|       |   +-- patientValidator.js
|       |
|       +-- scheduler/
|       |   +-- reminderScheduler.js    # Starts 60s polling interval
|       |
|       +-- utils/
|           +-- ApiError.js             # Custom error class
|           +-- ApiResponse.js          # Standardized response
|           +-- Logger.js               # Logging utility
|
+-- assets/                             # Static assets
+-- dist/                               # Vite build output (production)
+-- node_modules/                       # Dependencies
```

---

## 6. Frontend Analysis

| Aspect | Detail |
|--------|--------|
| **Framework** | React 19.0.1 |
| **Build Tool** | Vite 6.2.3 |
| **Language** | TypeScript 5.8 |
| **UI Libraries** | Tailwind CSS v4, Lucide React (icons), Recharts (charts), Motion (animations) |
| **State Management** | React Context (PatientContext.tsx) + component-level useState |
| **Routing** | React Router DOM v7 (HashRouter) |
| **API Communication** | Axios via `src/services/api.ts` (baseURL: /api, withCredentials, Bearer token interceptor) |

### Key Frontend Observations

1. **RefillQueue.tsx page exists** but is NOT imported or routed in `App.tsx`. It's a dead/unreachable page.
2. **No Twilio-related frontend code** exists. All Twilio configuration is backend-only via env vars.
3. **Mock data** (`mockPatients.ts`, `mockReminders.ts`) is used for TypeScript type definitions but actual data comes from API.
4. **PatientContext.tsx** provides shared patient state across components.
5. **All API calls** go through service files that use the shared `api.ts` Axios instance.

---

## 7. Backend Analysis

| Aspect | Detail |
|--------|--------|
| **Runtime** | Node.js (via tsx for TypeScript execution) |
| **Framework** | Express 4.21.2 |
| **Entry Point** | `server.js` (root) |
| **Middleware** | helmet, cors, morgan, express.json, cookieParser, authMiddleware, errorMiddleware |
| **Database** | MongoDB via Mongoose 9.8.0 |
| **Auth** | JWT (jsonwebtoken 9.0.3), bcryptjs for password hashing |
| **Validation** | express-validator 7.3.2 |
| **Scheduler** | Custom setInterval-based (60s polling) |

### Architecture Quality Assessment

| Criteria | Verdict |
|----------|---------|
| Controllers lightweight? | Yes — they parse request, call service, send response |
| Business logic separated? | Yes — in services/ directory |
| Services reusable? | Yes — no HTTP coupling |
| Error handling centralized? | Yes — errorMiddleware.js catches all |
| Validation present? | Yes — express-validator in validators/ |
| Repository pattern used? | Yes — repositories/ encapsulate DB queries |
| Logging present? | Yes — Logger.js utility used throughout |

---

## 8. Database Analysis

### Collections

#### caregivers
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | String | Yes | Trimmed |
| email | String | Yes | Unique, lowercase, trimmed |
| phone | String | Yes | E.164 format recommended |
| password | String | Yes | Hashed with bcryptjs |
| timestamps | Auto | - | createdAt, updatedAt |

#### patients
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| caregiverId | ObjectId (ref: Caregiver) | Yes | Indexed |
| name | String | Yes | Trimmed |
| dob | String | Yes | Date of birth |
| gender | String | Yes | Enum: Female, Male, Other |
| phone | String | Yes | Primary phone for WhatsApp/Voice |
| preferredLanguage | String | Yes | Used for translation |
| emergencyContactName | String | Yes | Emergency contact person name |
| emergencyContactPhone | String | No | Optional secondary phone |
| relationship | String | Yes | Relationship to caregiver |
| timestamps | Auto | - | createdAt, updatedAt |

#### medicines
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| patientId | ObjectId (ref: Patient) | Yes | Indexed |
| caregiverId | ObjectId (ref: Caregiver) | Yes | Indexed |
| medicineName | String | Yes | Trimmed, text-indexed |
| dosage | String | Yes | e.g. "500mg" |
| quantity | Number | Yes | Total quantity dispensed |
| remainingQuantity | Number | Yes | Decremented on dose taken |
| tabletsPerDose | Number | Default: 1 | Tablets per single dose |
| totalStock | Number | Default: 30 | Initial stock |
| timings | Array | No | [{ time: "08:00", enabled: true }] |
| times | [String] | Yes | At least one required. e.g. ["08:00", "14:00"] |
| startDate | String | Yes | Treatment start |
| endDate | String | No | Treatment end (empty = ongoing) |
| status | String | Enum: ACTIVE, COMPLETED, EXPIRED | Default: ACTIVE |

#### reminders
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| medicineId | ObjectId (ref: Medicine) | Yes | Indexed |
| patientId | ObjectId (ref: Patient) | Yes | Indexed |
| caregiverId | ObjectId (ref: Caregiver) | Yes | Indexed |
| scheduledTime | Date | Yes | When reminder fires |
| attempt | Number | Min: 1, Max: 3 | Counter for snooze attempts |
| status | String | Enum: PENDING, SNOOZED, COMPLETED, EXPIRED | Default: PENDING |
| timestamps | Auto | - | createdAt, updatedAt |

#### medicationlogs
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| patientId | ObjectId (ref: Patient) | Yes | Indexed |
| medicineId | ObjectId (ref: Medicine) | Yes | Indexed |
| caregiverId | ObjectId (ref: Caregiver) | Yes | Indexed |
| medicineName | String | No | Denormalized for display |
| date | String | Yes | Format: YYYY-MM-DD |
| time | String | Yes | e.g. "08:00 AM" |
| status | String | Yes | Enum: taken, missed, snoozed |
| Compound Index | { patientId: 1, date: 1 } | - | For adherence queries |

#### refills
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| medicineId | ObjectId (ref: Medicine) | Yes | Unique (one per medicine) |
| patientId | ObjectId (ref: Patient) | Yes | Indexed |
| caregiverId | ObjectId (ref: Caregiver) | Yes | Indexed |
| remainingQuantity | Number | Yes | Current stock |
| estimatedRefillDate | Date | Yes | Calculated: today + daysRemaining |
| status | String | Enum: SAFE, WARNING, CRITICAL | Default: SAFE |

### Relationship Diagram

```
Caregiver (1) ------ has many ------ Patients (N)
Patient (1) -------- has many ------ Medicines (N)
Medicine (1) -------- has many ------ Reminders (N)
Medicine (1) -------- has one ------- Refill (1)
Patient (1) --------- has many ------ MedicationLogs (N)
```

---

## 9. API Documentation (Verified from Routes)

### Authentication APIs (/api/auth)

| Method | Endpoint | Auth | Purpose | Request Body |
|--------|----------|------|---------|-------------|
| POST | /api/auth/register | No | Register caregiver | { name, email, phone, password } |
| POST | /api/auth/login | No | Login caregiver | { email, password } |
| POST | /api/auth/logout | No | Logout | - |
| GET | /api/auth/profile | Yes | Get caregiver profile | - |

### Patient APIs (/api/patients) -- All require auth

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/patients | List patients (?page=&limit=&search=&sort=) |
| POST | /api/patients | Create patient |
| GET | /api/patients/:id | Get patient |
| PUT | /api/patients/:id | Update patient |
| DELETE | /api/patients/:id | Delete patient + cascading |
| GET | /api/patients/:id/summary | Patient details summary |
| GET | /api/patients/:id/adherence | Adherence history |
| POST | /api/patients/:id/logs | Log intake status |

### Medicine APIs (/api/medicines) -- All require auth

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/medicines | List medicines (?patientId=&status=&page=&limit=&sort=) |
| POST | /api/medicines | Create medicine |
| GET | /api/medicines/:id | Get medicine |
| PUT | /api/medicines/:id | Update medicine |
| PATCH | /api/medicines/:id | Partial update |
| DELETE | /api/medicines/:id | Delete medicine + cascading |

### Reminder APIs (/api/reminders) -- All require auth

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/reminders | List reminders (?patientId=&status=&page=&limit=&sort=) |
| GET | /api/reminders/:id | Get reminder |
| PUT | /api/reminders/:id/action | Handle action ({ action: "COMPLETED" | "SNOOZED" | "EXPIRED" }) |

### Refill APIs (/api/refills) -- All require auth

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/refills | List refill status (?patientId=&status=&page=&limit=&sort=) |
| GET | /api/refills/:id | Get refill |

### Dashboard API (/api/dashboard) -- Requires auth

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/dashboard/stats | Dashboard statistics |

### Twilio Webhook APIs (/api/twilio) -- No auth (Twilio signature validation)

| Method | Endpoint | Purpose | Called By |
|--------|----------|---------|-----------|
| POST | /api/twilio/whatsapp/webhook | Receive patient WhatsApp replies | Twilio |
| POST | /api/twilio/voice/webhook | Receive voice webhook events | Twilio |
| GET | /api/twilio/voice/twiml/:reminderId | Generate TwiML for voice call | Twilio |
| POST | /api/twilio/voice/gather/:reminderId/:attempt | Process DTMF (1=Taken, 2=Snooze) | Twilio |
| POST | /api/twilio/voice/snooze/:reminderId/:attempt | Process snooze DTMF (1=20min, 2=60min) | Twilio |
| POST | /api/twilio/status | Receive call delivery status | Twilio |

### Health API

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | /api/health | No | Health check -> { status: "OK", timestamp } |

---

## 10. Twilio Integration Analysis

### Files

| File | Purpose | Status |
|------|---------|--------|
| `backend/src/services/twilio.service.js` | Core Twilio service (377 lines) | Code complete |
| `backend/src/controllers/TwilioController.js` | Webhook handlers (418 lines) | Code complete |
| `backend/src/routes/twilioRoutes.js` | 6 webhook endpoints (24 lines) | Code complete |
| `backend/src/services/SchedulerService.js` | Twilio integration in scheduler (374 lines) | Code complete |
| `backend/src/app.js` | Mounts twilioRoutes, initializes service | Code complete |

### Environment Variables Required

| Variable | Set? | Purpose |
|----------|------|---------|
| TWILIO_ACCOUNT_SID | Empty | Twilio account identifier |
| TWILIO_AUTH_TOKEN | Empty | Twilio authentication secret |
| TWILIO_WHATSAPP_NUMBER | Empty | Twilio WhatsApp-enabled number |
| TWILIO_PHONE_NUMBER | Empty | Twilio voice-enabled number |
| TWILIO_VOICE_ENABLED | false | Enable voice call reminders |

### Implementation Verification

| Capability | Status | Evidence |
|------------|--------|----------|
| WhatsApp sending implemented? | Yes | `twilio.service.js` sendWhatsAppReminder() at line 136 |
| Webhook endpoint exists? | Yes | `POST /api/twilio/whatsapp/webhook` in twilioRoutes.js |
| Signature validation exists? | Yes | `validateWebhookSignature()` at line 340 |
| TAKEN handling exists? | Yes | `TwilioController.js` line 69-78 |
| SNOOZE handling exists? | Yes | `TwilioController.js` line 79-134 |
| Voice calling implemented? | Yes | `twilio.service.js` makeVoiceCall() at line 218 |
| Voice DTMF processing exists? | Yes | `TwilioController.js` handleVoiceGather() at line 219 |
| Voice snooze processing exists? | Yes | `TwilioController.js` handleVoiceSnooze() at line 279 |
| Delivery status callback exists? | Yes | `TwilioController.js` handleStatusCallback() at line 371 |
| Scheduler triggers Twilio? | Yes | `SchedulerService.js` line 70-75 |
| Refill alerts via Twilio? | Yes | `SchedulerService.js` sendRefillAlert() at line 303 |

### Flow Verification

```
Scheduler (60s polling)
  -> processDoseReminders()
    -> Creates Reminder (MongoDB)
    -> sendWhatsAppDoseReminder()
      -> twilio.service.sendWhatsAppReminder()
        -> Twilio WhatsApp API
    -> (if enabled) makeVoiceCallReminder()
      -> twilio.service.makeVoiceCall()
        -> Twilio Voice API

Patient replies "TAKEN" or "SNOOZE"
  -> Twilio -> POST /api/twilio/whatsapp/webhook
  -> TwilioController.handleWhatsAppWebhook()
    -> Validates signature
    -> Parses reply via handleIncomingReply()
    -> Finds patient by phone
    -> Finds latest PENDING reminder
    -> TAKEN: status=COMPLETED, send confirmation
    -> SNOOZE (no duration): send snooze options
    -> SNOOZE (with duration): status=SNOOZED, create new PENDING reminder
```

---

## 11. Gemini AI Integration Analysis

| Aspect | Detail |
|--------|--------|
| **File** | `backend/src/services/twilio.service.js` |
| **Method** | `translateText(text, language)` at line 66 |
| **Model** | gemini-2.0-flash |
| **API Key** | GEMINI_API_KEY from .env |
| **Supported Languages** | English (fallback), Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi |
| **Error Handling** | Falls back to English on failure |
| **Usage Location** | WhatsApp reminders (SchedulerService line 196), Voice call speech (TwilioController line 198) |

### Verification

| Capability | Status |
|------------|--------|
| Translation implemented? | Yes |
| Supported languages defined? | Yes (via patient.preferredLanguage field) |
| Error handling present? | Yes -- try/catch, falls back to English |
| Fallback behavior? | Returns original English text on failure |
| API key configurable? | Yes via .env |

---

## 12. Environment Configuration

| Variable | Required | Current Value | Used By |
|----------|----------|---------------|---------|
| PORT | No | 5000 | server.js (but hardcoded to 3000) |
| APP_URL | Yes | http://localhost:5000 | Twilio webhook callbacks |
| MONGODB_URI | Yes | mongodb://127.0.0.1:27017/medreminder | db.js |
| JWT_SECRET | Yes | (set) | authMiddleware.js |
| JWT_EXPIRES_IN | No | 7d | AuthService.js |
| NODE_ENV | No | development | server.js |
| TZ | No | Asia/Kolkata | Server timezone |
| GEMINI_API_KEY | For translations | YOUR_GEMINI_API_KEY | twilio.service.js |
| TWILIO_ACCOUNT_SID | For Twilio | (empty) | twilio.service.js |
| TWILIO_AUTH_TOKEN | For Twilio | (empty) | twilio.service.js |
| TWILIO_WHATSAPP_NUMBER | For WhatsApp | (empty) | twilio.service.js |
| TWILIO_PHONE_NUMBER | For Voice | (empty) | twilio.service.js |
| TWILIO_VOICE_ENABLED | No | false | SchedulerService.js |

**Critical Issue**: PORT is set to 5000 in .env but server.js hardcodes `const PORT = 3000`. APP_URL points to port 5000. This mismatch will break Twilio webhooks.

---

## 13. Current Testing Status

| Feature | Testing Method | Status |
|---------|---------------|--------|
| Login | Manual via frontend | Can test |
| Patient creation | Manual via frontend | Can test |
| Medicine creation | Manual via frontend | Can test |
| Scheduler | Requires MongoDB + running server | Can test |
| WhatsApp sending | Requires Twilio credentials + ngrok | **Cannot test yet** |
| Webhook response | Requires ngrok + Twilio sandbox | **Cannot test yet** |
| Snooze flow | Requires Twilio credentials | **Cannot test yet** |
| Taken flow | Requires Twilio credentials | **Cannot test yet** |
| Voice calls | Requires Twilio voice number | **Cannot test yet** |
| Database updates | Requires MongoDB | Can test |
| Gemini translation | Requires GEMINI_API_KEY | **Cannot test yet** |

---

## 14. Twilio Testing Readiness

**Can this project currently send WhatsApp reminders?**
- **No.** The code is complete, but:
  1. TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER are empty in .env
  2. No public URL is configured for webhooks
  3. APP_URL points to port 5000 but server runs on port 3000

**Can Twilio receive patient replies?**
- **No.** The webhook endpoint exists (`POST /api/twilio/whatsapp/webhook`) but:
  1. Twilio sandbox needs to be configured with a public URL
  2. No ngrok tunnel is running
  3. APP_URL mismatch will cause signature validation to fail

**What is missing for testing?**
1. Fill Twilio credentials in .env
2. Fix PORT mismatch (server.js uses 3000, .env says 5000)
3. Install and run ngrok to expose localhost
4. Configure Twilio WhatsApp Sandbox with ngrok URL
5. Patient must send join code to Twilio WhatsApp number

---

## 15. Current Problems Before Deployment

### Code Issues
1. **PORT mismatch**: .env says PORT=5000, server.js hardcodes PORT=3000
2. **RefillQueue.tsx not routed**: Page exists but not imported in App.tsx
3. **MedicationLogController import after middleware**: Works due to hoisting but unconventional
4. **No retry logic for Twilio failures**: Failed sends are silently dropped

### Architecture Issues
1. **No rate limiting on webhooks**: Twilio could send duplicate webhooks
2. **No frontend Twilio configuration**: All settings are env-var only
3. **No delivery status UI**: Caregiver cannot see if WhatsApp was delivered

### Security Issues
1. **No input sanitization on webhook body**: Body is used directly in logs
2. **CORS allows any origin**: `origin: true` in production is permissive

### Configuration Issues
1. **Twilio credentials empty**: Must be filled before any Twilio feature works
2. **Gemini API key placeholder**: Must be replaced with real key
3. **APP_URL mismatch with actual port**: Will break webhook callbacks

### Testing Gaps
1. **No automated tests**: Zero test files exist in the project
2. **No test scripts in package.json**: No jest, mocha, or vitest configured
3. **Twilio integration untested**: All Twilio code is written but never executed with real credentials

### Deployment Blockers
1. **PORT mismatch must be fixed**
2. **Twilio credentials must be configured**
3. **APP_URL must be set to the correct public URL**
4. **For production**: MongoDB must be accessible, env vars configured on hosting platform

---

## 16. Changes Made (Final Fixes Applied)

| # | Issue | File | Change | Status |
|---|-------|------|--------|--------|
| 1 | PORT hardcoded to 3000 | `server.js` line 15 | Changed to `const PORT = process.env.PORT \|\| 3000;` | ✅ Fixed |
| 2 | PORT=5000 in .env | `.env` line 7 | Changed to `PORT=3000` | ✅ Fixed |
| 3 | APP_URL pointed to port 5000 | `.env` line 28 | Changed to `https://express-reconfirm-superior.ngrok-free.dev` | ✅ Fixed |
| 4 | Twilio credentials empty | `.env` lines 33-35 | TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER filled | ✅ Fixed |
| 5 | Gemini API key placeholder | `.env` line 23 | Still placeholder — needs real key from Google AI Studio | ⚠️ Pending |
| 6 | Env vars not loaded before Twilio init | `server.js` line 3 | Changed `import dotenv from "dotenv"` + `dotenv.config()` to `import "dotenv/config"` — fixes ES module import hoisting issue where `app.js` was evaluated before env vars were loaded | ✅ Fixed |
| 7 | TWILIO_PHONE_NUMBER required in warning | `twilio.service.js` line 24-28 | Changed validation to only require `accountSid` and `authToken`. Added separate checks for `whatsappNumber` and `phoneNumber` with appropriate warnings | ✅ Fixed |
| 8 | No startup logs for Twilio | `twilio.service.js` initialize() | Added 5 startup log lines: Twilio initialized, WhatsApp enabled/disabled, Voice enabled/disabled, Gemini AI enabled/disabled, APP_URL | ✅ Fixed |
| 9 | Syntax errors from git merge markers | `twilio.service.js` | Removed all `>>>>>>>` markers left from diff operations | ✅ Fixed |
>>>>>>>


---

## 17. Current Configuration

| Setting | Value |
|---------|-------|
| **Backend Port** | 3000 (from .env PORT) |
| **MongoDB** | mongodb://127.0.0.1:27017/medreminder |
| **Scheduler** | Enabled — runs every 60 seconds |
| **Twilio WhatsApp** | Enabled (credentials configured) |
| **Twilio Voice** | Disabled (TWILIO_VOICE_ENABLED=false, no phone number) |
| **Gemini Translation** | Disabled (API key not set) |
| **APP_URL (local)** | http://localhost:3000 |
| **APP_URL (ngrok)** | Not yet configured |
| **Timezone** | Asia/Kolkata (IST) |

---

## 18. End-to-End Workflow

```
Caregiver opens browser
  -> Navigates to http://localhost:3000
  -> Registers / Logs in (JWT issued)
  -> Dashboard loads with stats

Caregiver adds patient
  -> Clicks "Add Patient"
  -> Fills: name, DOB, gender, phone (+919XXXXXXXXX), language, emergency contact
  -> Patient saved to MongoDB

Caregiver adds medicine
  -> Selects patient -> "Add Medicine"
  -> Fills: name, dosage, tablets per dose, times (24h HH:mm format), start date, end date
  -> Medicine saved to MongoDB (status: ACTIVE)

Scheduler (runs every 60 seconds)
  -> Fetches all ACTIVE medicines
  -> Compares current time (HH:mm) with medicine.times[]
  -> If match found AND no duplicate reminder exists:
      -> Creates Reminder document (status: PENDING)
      -> Calls sendWhatsAppDoseReminder()
        -> Fetches patient + caregiver from DB
        -> Builds reminder text in English
        -> If patient language != English: translates via Gemini AI
        -> Calls twilio.service.sendWhatsAppReminder()
          -> Sends WhatsApp message to patient
          -> Sends follow-up with TAKEN/SNOOZE options
      -> If TWILIO_VOICE_ENABLED=true: calls makeVoiceCallReminder()
        -> Initiates Twilio Voice call with TwiML

Patient receives WhatsApp
  -> Sees: "MedReminder+ Hello [name], it's time to take [medicine]..."
  -> Sees: "Reply TAKEN or SNOOZE"

Patient replies "TAKEN"
  -> Twilio sends POST to /api/twilio/whatsapp/webhook
  -> TwilioController.handleWhatsAppWebhook()
    -> Validates X-Twilio-Signature
    -> Parses reply -> action = "TAKEN"
    -> Finds patient by phone number
    -> Finds latest PENDING reminder
    -> Sets reminder.status = "COMPLETED"
    -> Sends confirmation: "Thank you! Your dose has been recorded."
    -> (ReminderService.handleAction also decrements medicine stock)

Patient replies "SNOOZE"
  -> Twilio sends POST to webhook
  -> Controller parses reply -> action = "SNOOZE" (no duration)
  -> Sends snooze options: "Reply 20 for 20 minutes, 60 for 1 hour"

Patient replies "20"
  -> Twilio sends POST to webhook
  -> Controller parses reply -> action = "SNOOZE", snoozeMinutes = 20
  -> Sets reminder.status = "SNOOZED"
  -> Creates new Reminder (status: PENDING, scheduledTime: now + 20 min)
  -> Sends confirmation: "Reminder snoozed for 20 minutes."

After 20 minutes
  -> Scheduler detects new PENDING reminder
  -> Sends WhatsApp again (attempt 2)
  -> If snoozed 3 times total: status = EXPIRED

Dashboard updates
  -> Caregiver refreshes dashboard
  -> Stats reflect: completed reminders, adherence rate, refill status
  -> Reminder queue shows updated statuses

Refill tracking
  -> Scheduler calculates: daysRemaining = remainingQuantity / dailyDoseCount
  -> If <= 5 days: status = WARNING -> sends WhatsApp alert to caregiver + patient
  -> If <= 2 days: status = CRITICAL -> sends urgent WhatsApp alert
```

---

## 19. Recommended Next Steps (Ordered)

1. ~~Fix PORT mismatch~~ ✅ **DONE**
2. ~~Fill Twilio credentials~~ ✅ **DONE**
3. **Fill Gemini API key**: Get GEMINI_API_KEY from Google AI Studio
4. **Run local server**: `npm run dev` and verify it starts on port 3000
5. **Install ngrok**: `npm install -g ngrok` or download from ngrok.com
6. **Expose backend**: `ngrok http 3000` and copy the HTTPS URL
7. **Update APP_URL**: Set `.env` APP_URL to the ngrok HTTPS URL
8. **Configure Twilio Sandbox**: In Twilio Console -> Messaging -> Try it out -> Send a WhatsApp message, set "WHEN A MESSAGE COMES IN" to `https://your-ngrok-url.ngrok.io/api/twilio/whatsapp/webhook`
9. **Join Twilio Sandbox**: From your phone, send `join rocket-whale` to `+1 415 523 8886`
10. **Test WhatsApp sending**: Create a patient with a real phone number, create a medicine with a time matching the current minute, wait for scheduler to fire
11. **Test TAKEN response**: Reply "TAKEN" to the WhatsApp message, verify reminder status changes to COMPLETED in MongoDB
12. **Test SNOOZE response**: Reply "SNOOZE" then "20", verify new reminder created 20 minutes later
13. **Test voice calls**: Set TWILIO_VOICE_ENABLED=true, configure TWILIO_PHONE_NUMBER, test voice call flow
14. **Test Gemini translation**: Set GEMINI_API_KEY, create patient with non-English language, verify translated message
15. **Add basic error handling**: Add retry logic for Twilio failures
16. **Add rate limiting**: Add express-rate-limit for webhook endpoints

---

## 17. AI Agent Rules

When modifying this project:

1. **Read this document first** -- understand the full implementation state before making changes.
2. **Verify existing implementation** -- search for existing services, models, routes before creating new ones.
3. **Do not recreate existing features** -- all features listed in Section 2 are already implemented.
4. **Do not replace working code** -- prefer extending over rewriting.
5. **Update this document after major changes** -- keep the workflow document current.
6. **Mention files changed before coding** -- state approach, files, risks before modifying.
7. **Preserve current architecture** -- follow the established Controller -> Service -> Repository -> Model pattern.
8. **Never hardcode secrets** -- always use environment variables.
9. **Check the Decision Log in AI_CONTEXT.md** for prior architecture decisions.
10. **Do not implement roadmap features** (OCR, mobile app, doctor portal, etc.) unless explicitly requested.