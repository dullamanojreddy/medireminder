# AI Agent Context Document: MedReminder+

---

## AI Agent Instructions

### Before Coding

1. **Read this document completely** — understand the full architecture before making any changes.
2. **Inspect existing project structure** — use file listing tools to verify current state.
3. **Identify existing implementations** — search for existing services, models, routes, and utilities before creating new ones.
4. **Reuse existing services, components, utilities, and database models** — never create duplicate functionality.
5. **Never rewrite working code without justification** — prefer extending over replacing.
6. **Check the Decision Log** — understand past architecture decisions before proposing alternatives.

### Before Modifying Code

AI agent must provide in its response:

- **Implementation approach** — how the change will be made.
- **Files that will be modified** — complete list of new, modified, and deleted files.
- **Database changes** — any schema or collection changes.
- **API changes** — new endpoints or modifications.
- **Possible risks** — breaking changes, migration needs, dependency impacts.

### After Completing Changes

AI agent must update this document with:

- **New architecture changes** — any structural modifications.
- **New files** — newly created files and their purpose.
- **Modified files** — files changed and why.
- **New APIs** — endpoints added.
- **Database changes** — schema or index updates.
- **Completed tasks** — what was accomplished.
- **Remaining tasks** — what remains to be done.
- **Known issues** — bugs or technical debt introduced or discovered.

---

## Project Identity

- **Project Name**: MedReminder+
- **Project Type**: AI-powered medication adherence and reminder platform
- **Current Purpose**: A caregiver-facing web application where caregivers register patients (elderly/chronic), create medication schedules with custom dosing times, and receive automated reminder delivery via Twilio WhatsApp messaging and optionally Twilio Voice calls. The system tracks adherence, manages refill alerts, and uses Gemini AI for multilingual reminder translation.
- **Target Users**:
  - **Caregivers**: Primary users. Register, login, manage patients, create medicine schedules, view adherence reports.
  - **Patients**: End recipients. Receive WhatsApp/voice reminders, reply with TAKEN/SNOOZE. Do not use the app directly.
  - **Healthcare Support Users**: Future scope (doctor portal, analytics).
- **Main Objective**: Improve medication adherence using automated reminders, multilingual communication, and real-time tracking while storing minimal patient data.

---

## Current Project State

### Development Stage

Functional MVP with 80% backend completion. Frontend connected to backend API. Authentication, CRUD for patients/medicines, reminder scheduling, and adherence logging are operational. Twilio WhatsApp and voice integration is newly added. Gemini AI translation is integrated.

### Completed Features

- Caregiver authentication (register, login, logout, JWT-based)
- Patient CRUD with phone, language, emergency contact
- Medicine CRUD with dosage, timing schedules, stock tracking
- Automated reminder creation (scheduler polls every 1 minute)
- Reminder snooze progression (3 attempts max, 5-min cooldown)
- Refill alert calculation (WARNING ≤5 days, CRITICAL ≤2 days)
- Adherence logging (taken/missed/snoozed per dose)
- Medication stock decrement on dose completion
- Frontend dashboard with stats, patient list, reminder queue, refill queue
- Twilio WhatsApp reminders with TAKEN/SNOOZE replies
- Twilio Voice call reminders with DTMF input (1=Taken, 2=Snooze, 1=20min, 2=60min)
- Gemini AI-powered translation for 7 languages
- Refill alert WhatsApp notifications to caregiver + patient
- Delivery failure logging and caregiver notification
- Twilio webhook signature validation

### Currently Working On

- Production deployment readiness
- Environment configuration documentation

### Pending Features

- OCR prescription scanning (future module)
- Medicine recognition (future module)
- Advanced AI assistant (future module)
- Mobile application (future module)
- Doctor portal (future module)
- Analytics dashboard enhancements (future module)
- Twilio WhatsApp template approval for interactive buttons (currently using text-based replies)

### Known Bugs

- None reported. The scheduler operates on 1-minute polling; reminders may have up to 60-second latency.

---

## System Overview

```
Caregiver's Browser (React SPA)
        │
        │ HTTP / HTTPS
        ▼
Express.js Backend (server.js + backend/src/app.js)
        │
        ├── /api/auth ──────── Auth routes (JWT)
        ├── /api/patients ──── Patient CRUD
        ├── /api/medicines ─── Medicine CRUD
        ├── /api/reminders ─── Reminder listing & actions
        ├── /api/refills ───── Refill status tracking
        ├── /api/dashboard ─── Stats & summary
        ├── /api/twilio ────── WhatsApp/Voice webhooks
        └── /api/health ────── Health check
                │
                ▼
        Business Services Layer
        │
        ├── AuthService.js ──────── Auth logic
        ├── PatientService.js ───── Patient logic
        ├── MedicineService.js ──── Medicine logic
        ├── ReminderService.js ──── Reminder actions
        ├── RefillService.js ────── Refill logic
        ├── SchedulerService.js ─── Background job orchestration
        └── twilio.service.js ───── Twilio API + Voice + Translation
                │
                ▼
        MongoDB (via Mongoose)
        │
        ├── caregivers ──────── User accounts
        ├── patients ────────── Patient profiles
        ├── medicines ───────── Medication schedules
        ├── reminders ───────── Reminder instances
        ├── medicationlogs ──── Adherence logs
        └── refills ─────────── Refill status trackers
                │
                ▼
        External Services
        │
        ├── Twilio WhatsApp API ──── Send reminders, receive replies
        ├── Twilio Voice API ─────── Make voice calls, process DTMF
        └── Gemini AI API ────────── Translate reminders to regional languages
```

### External Services Responsibility

| Service | Purpose |
|---------|---------|
| Twilio WhatsApp | Send medication reminders as WhatsApp messages; receive patient TAKEN/SNOOZE replies via webhook |
| Twilio Voice | Make AI voice calls with TTS; process DTMF key presses (1=Taken, 2=Snooze, 1=20min, 2=60min) |
| Gemini AI | Translate English reminder text to patient's preferred language (Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi) |

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^19.0.1 | UI framework |
| Vite | ^6.2.3 | Build tool and dev server |
| TypeScript | ~5.8.2 | Type safety |
| React Router DOM | ^7.18.1 | Client-side routing |
| Axios | ^1.18.1 | HTTP client for API communication |
| Lucide React | ^0.546.0 | Icon library |
| Recharts | ^3.10.0 | Charting for adherence graphs |
| Motion | ^12.23.24 | Animation library |
| Tailwind CSS (v4) | ^4.1.14 | Utility-first CSS |
| @tailwindcss/vite | ^4.1.14 | Tailwind Vite integration |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | - | JavaScript runtime |
| Express | ^4.21.2 | Web framework |
| TypeScript (tsx) | ^4.21.0 | TypeScript execution |
| JWT (jsonwebtoken) | ^9.0.3 | Authentication tokens |
| bcryptjs | ^3.0.3 | Password hashing |
| cookie-parser | ^1.4.7 | Cookie parsing |
| cors | ^2.8.6 | CORS middleware |
| helmet | ^8.3.0 | Security headers |
| morgan | ^1.11.0 | HTTP request logging |
| express-validator | ^7.3.2 | Input validation |
| dotenv | ^17.2.3 | Environment variables |

### Database

| Technology | Purpose |
|------------|---------|
| MongoDB | Document store |
| Mongoose | ^9.8.0 | ODM with schema validation |
| Collections: | caregivers, patients, medicines, reminders, medicationlogs, refills |

### AI & Communication Services

| Service | SDK/Library | Purpose |
|---------|-------------|---------|
| Twilio | twilio (npm) | WhatsApp messaging + Voice calling |
| Google Generative AI | @google/genai ^2.4.0 | Text translation for multilingual reminders |

### Development Tools

| Tool | Purpose |
|------|---------|
| npm | Package manager |
| Git | Version control |
| tsx | TypeScript execution for backend |
| Vite | Frontend build and HMR |

---

## Architecture Rules

### Backend Architecture (Strict Layer Separation)

```
Request Flow:
  HTTP Request
    → Route (routes/*.js) — URL matching, validation middleware
    → Controller (controllers/*.js) — HTTP handling, request parsing, response formatting
    → Service (services/*.js) — Business logic, orchestration
    → Repository (repositories/*.js) — Database queries, data access
    → Model (models/*.js) — Mongoose schema, field validation, indexes
    → MongoDB
```

**Rules:**

- **Controllers**: Handle HTTP request/response only. Never contain business logic. Always wrap in try-catch and forward errors via `next(error)`.
- **Services**: Contain business logic. Call repositories for data. Throw `ApiError` for known error cases.
- **Repositories**: Database access layer. Encapsulate Mongoose queries. Return plain objects or documents.
- **Models**: Define schemas, validation, indexes, and relationships only. No business logic.
- **Middleware**: Authentication (`authMiddleware.js`), error handling (`errorMiddleware.js`), validation (validators/).
- **Validators**: Express-validator based. Located in `validators/` directory.
- **Utils**: Reusable helpers like `ApiError`, `ApiResponse`, `Logger`.
- **Scheduler**: Background job that runs on 60-second interval. Orchestrates reminder creation, snooze handling, and refill calculations.

### Frontend Architecture

```
src/
├── components/       — Reusable UI components (Button, Card, Modal, Toast, etc.)
│   ├── common/       — Badge, ConfirmModal, EmptyState, SearchBar
│   ├── layout/       — Sidebar, Topbar
│   ├── patients/     — Patient-specific components (AdherenceGraph, MedicineModal, etc.)
│   └── stats/        — StatCard
├── pages/            — Page-level components (Dashboards, Patient pages, etc.)
├── services/         — API service layer (api.ts, authService.ts, patientService.ts, etc.)
├── context/          — React context providers
├── layouts/          — Layout wrappers
├── routes/           — Protected route logic
└── mock/             — Mock data (mockPatients.ts, mockReminders.ts)
```

**Rules:**

- **Feature-based organization** within components/patients/, components/stats/, etc.
- **Reusable components** — keep components small and focused.
- **Separate API service layer** — all API calls go through `src/services/` files using the axios instance from `api.ts`.
- **Proper state management** — use React context for shared state, component state for local UI.
- **Loading and error handling** — every data-fetching component must handle loading and error states.
- **Form validation** — validate inputs before sending to API.
- **Avoid**: large monolithic components, duplicate API calls, business logic inside UI components.
- **API communication**: Always use the axios instance from `src/services/api.ts` which has:
  - Base URL: `/api`
  - Credentials: `withCredentials: true`
  - Auth interceptor: automatically attaches `Bearer` token from `localStorage.getItem("authToken")`

---

## Folder Structure Knowledge

```
medreminder+/
├── server.js                          # Entry point — starts Vite dev/prod + Express backend
├── package.json                       # Project dependencies and scripts
├── tsconfig.json                      # TypeScript configuration
├── vite.config.ts                     # Vite build configuration
├── index.html                         # Vite entry HTML
├── .env                               # Environment variables (gitignored)
├── .env.example                       # Example env file
├── AI_CONTEXT.md                      # THIS FILE — AI agent context
│
├── src/                               # FRONTEND (React SPA)
│   ├── App.tsx                        # Root component with router setup
│   ├── main.tsx                       # Entry point
│   ├── index.css                      # Global styles (Tailwind)
│   ├── types.ts                       # Shared TypeScript types
│   │
│   ├── components/                    # Reusable UI components
│   │   ├── Button.tsx, Card.tsx, Input.tsx, Modal.tsx, Toast.tsx, etc.
│   │   ├── common/                    # Badge, ConfirmModal, EmptyState, SearchBar
│   │   ├── layout/                    # Sidebar, Topbar
│   │   ├── patients/                  # MedicineModal, PatientCard, PatientTable, etc.
│   │   └── stats/                     # StatCard
│   │
│   ├── pages/                         # Page components (one per route)
│   │   ├── Dashboard.tsx              # Main caregiver dashboard
│   │   ├── Patients.tsx               # Patient list
│   │   ├── AddPatient.tsx             # Add patient form
│   │   ├── EditPatient.tsx            # Edit patient form
│   │   ├── PatientDetails.tsx         # Single patient view with medicines
│   │   ├── ReminderQueue.tsx          # Reminder list
│   │   ├── SettingsPage.tsx           # Settings
│   │   ├── LandingPage.tsx            # Public landing
│   │   ├── LoginPage.tsx              # Login form
│   │   ├── RegisterPage.tsx           # Register form
│   │   └── NotFoundPage.tsx           # 404
│   │
│   ├── services/                      # API service layer
│   │   ├── api.ts                     # Axios instance with auth interceptor
│   │   ├── authService.ts             # Authentication API calls
│   │   ├── patientService.ts          # Patient CRUD + medicine mapping
│   │   ├── medicineService.ts         # Medicine CRUD + adherence logging
│   │   ├── reminderService.ts         # Reminder listing + status updates
│   │   └── refillService.ts           # Refill status API calls
│   │
│   ├── context/                       # React context providers
│   │   └── PatientContext.tsx          # Shared patient state
│   │
│   ├── layouts/                       # Layout components
│   │   └── MainLayout.tsx             # Main app layout wrapper
│   │
│   ├── routes/                        # Route guards
│   │   └── ProtectedRoute.tsx         # Auth check wrapper
│   │
│   └── mock/                          # Static mock data (for development/reference)
│       ├── mockPatients.ts            # 12 sample patients with medicines
│       └── mockReminders.ts           # 30 sample reminders
│
├── backend/                           # BACKEND (Express.js)
│   ├── server.js                      # Duplicate entry (legacy, not used in dev)
│   │
│   └── src/
│       ├── app.js                     # Express app setup, middleware, route mounting
│       │
│       ├── config/
│       │   └── db.js                  # MongoDB connection via Mongoose
│       │
│       ├── controllers/               # HTTP request handlers
│       │   ├── AuthController.js      # Register, login, logout, profile
│       │   ├── PatientController.js   # CRUD + summary
│       │   ├── MedicineController.js  # CRUD
│       │   ├── ReminderController.js  # List, get, handle action (taken/snooze/expired)
│       │   ├── MedicationLogController.js # Adherence log intake + history
│       │   ├── DashboardController.js # Dashboard stats
│       │   ├── RefillController.js    # Refill status
│       │   └── TwilioController.js    # WhatsApp webhook, Voice TwiML, DTMF, status
│       │
│       ├── services/                  # Business logic
│       │   ├── AuthService.js         # Registration, login, JWT generation
│       │   ├── PatientService.js      # Patient business logic
│       │   ├── MedicineService.js     # Medicine business logic
│       │   ├── ReminderService.js     # Reminder action handling + stock decrement
│       │   ├── RefillService.js       # Refill business logic
│       │   ├── SchedulerService.js    # Background job orchestration (dose reminders, snooze, refills, Twilio)
│       │   └── twilio.service.js      # All Twilio logic: WhatsApp, Voice, Translation, Webhooks
│       │
│       ├── models/                    # Mongoose schemas
│       │   ├── Caregiver.js           # name, email, phone, password (hashed)
│       │   ├── Patient.js             # name, dob, gender, phone, language, emergencyContact
│       │   ├── Medicine.js            # medicineName, dosage, quantity, times, timings, dates, status
│       │   ├── Reminder.js            # medId, patientId, caregiverId, scheduledTime, attempt, status
│       │   ├── MedicationLog.js       # patientId, medicineId, date, time, status (taken/missed/snoozed)
│       │   └── Refill.js              # medicineId, remainingQuantity, estimatedRefillDate, status
│       │
│       ├── repositories/              # Data access layer
│       │   ├── AuthRepository.js      # Caregiver queries
│       │   ├── PatientRepository.js   # Patient queries
│       │   ├── MedicineRepository.js  # Medicine queries
│       │   ├── ReminderRepository.js  # Reminder queries
│       │   └── RefillRepository.js    # Refill queries
│       │
│       ├── routes/                    # Express route definitions
│       │   ├── authRoutes.js          # /api/auth
│       │   ├── patientRoutes.js       # /api/patients
│       │   ├── medicineRoutes.js      # /api/medicines
│       │   ├── reminderRoutes.js      # /api/reminders
│       │   ├── refillRoutes.js        # /api/refills
│       │   ├── dashboardRoutes.js     # /api/dashboard
│       │   └── twilioRoutes.js        # /api/twilio (webhooks)
│       │
│       ├── middleware/
│       │   ├── authMiddleware.js      # JWT verification, attaches req.caregiver
│       │   └── errorMiddleware.js     # Global error handler
│       │
│       ├── validators/
│       │   ├── authValidator.js       # Registration/login validation
│       │   ├── medicineValidator.js   # Medicine creation/update validation
│       │   └── patientValidator.js    # Patient creation/update validation
│       │
│       ├── scheduler/
│       │   └── reminderScheduler.js   # Starts polling interval (60s)
│       │
│       └── utils/
│           ├── ApiError.js            # Custom error class with statusCode
│           ├── ApiResponse.js         # Standardized success response
│           └── Logger.js              # Logging utility
│
├── assets/                            # Static assets
├── dist/                              # Vite build output (production)
└── node_modules/                      # Dependencies
```

---

## Database Context

### Collections

#### `caregivers` (Users)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | String | Yes | Trimmed |
| email | String | Yes | Unique, lowercase, trimmed |
| phone | String | Yes | E.164 format recommended |
| password | String | Yes | Hashed with bcryptjs |
| timestamps | Auto | - | createdAt, updatedAt |

**Purpose**: Caregiver accounts for authentication. One caregiver manages many patients.

#### `patients`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| caregiverId | ObjectId (ref: Caregiver) | Yes | Indexed |
| name | String | Yes | Trimmed |
| dob | String | Yes | Date of birth |
| gender | String | Yes | Enum: Female, Male, Other |
| phone | String | Yes | Primary phone for WhatsApp/Voice |
| preferredLanguage | String | Yes | Enum: English, Hindi, Telugu, Tamil, Kannada, Marathi, Malayalam |
| emergencyContactName | String | Yes | Emergency contact person name |
| emergencyContactPhone | String | No | Optional secondary phone |
| relationship | String | Yes | Relationship to caregiver |
| timestamps | Auto | - | createdAt, updatedAt |

**Purpose**: Patient profiles linked to a caregiver. Each patient can have multiple medicines.

#### `medicines`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| patientId | ObjectId (ref: Patient) | Yes | Indexed |
| caregiverId | ObjectId (ref: Caregiver) | Yes | Indexed |
| medicineName | String | Yes | Trimmed, text-indexed |
| dosage | String | Yes | e.g. "500mg", "10 Units" |
| quantity | Number | Yes | Total quantity dispensed |
| remainingQuantity | Number | Yes | Decremented on dose taken |
| tabletsPerDose | Number | Default: 1 | Tablets per single dose |
| totalStock | Number | Default: 30 | Initial stock |
| timings | Array | No | [{ time: "08:00", enabled: true }] |
| times | [String] | Yes | At least one required. e.g. ["08:00", "14:00", "20:00"] |
| startDate | String | Yes | Treatment start |
| endDate | String | No | Treatment end (empty = ongoing) |
| status | String | Enum: ACTIVE, COMPLETED, EXPIRED | Default: ACTIVE |

**Purpose**: Medication schedule for a patient. Stores dosage timing, stock tracking.

#### `reminders`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| medicineId | ObjectId (ref: Medicine) | Yes | Indexed |
| patientId | ObjectId (ref: Patient) | Yes | Indexed |
| caregiverId | ObjectId (ref: Caregiver) | Yes | Indexed |
| scheduledTime | Date | Yes | When reminder fires |
| attempt | Number | Min: 1, Max: 3 | Counter for snooze attempts |
| status | String | Enum: PENDING, SNOOZED, COMPLETED, EXPIRED | Default: PENDING |
| timestamps | Auto | - | createdAt, updatedAt (updatedAt used for snooze cooldown) |

**Purpose**: Individual reminder instance created by scheduler when dose time matches. Tracks status through its lifecycle.

#### `medicationlogs`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| patientId | ObjectId (ref: Patient) | Yes | Indexed |
| medicineId | ObjectId (ref: Medicine) | Yes | Indexed |
| caregiverId | ObjectId (ref: Caregiver) | Yes | Indexed |
| medicineName | String | No | Denormalized for display |
| date | String | Yes | Format: YYYY-MM-DD |
| time | String | Yes | e.g. "08:00 AM" |
| status | String | Yes | Enum: taken, missed, snoozed |
| timestamps | Auto | - | |
| Compound Index | { patientId: 1, date: 1 } | - | For adherence queries |

**Purpose**: Adherence log entries recording each dose event.

#### `refills`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| medicineId | ObjectId (ref: Medicine) | Yes | Unique (one per medicine) |
| patientId | ObjectId (ref: Patient) | Yes | Indexed |
| caregiverId | ObjectId (ref: Caregiver) | Yes | Indexed |
| remainingQuantity | Number | Yes | Current stock |
| estimatedRefillDate | Date | Yes | Calculated: today + daysRemaining |
| status | String | Enum: SAFE, WARNING, CRITICAL | Default: SAFE |
| timestamps | Auto | - | |

**Purpose**: Refill status tracker per medicine. WARNING ≤ 5 days, CRITICAL ≤ 2 days remaining.

### Data Relationships

```
Caregiver (1) ────── has many ────── Patients (N)
Patient (1) ──────── has many ────── Medicines (N)
Medicine (1) ─────── has many ────── Reminders (N)
Medicine (1) ─────── has one ─────── Refill (1)
Patient (1) ───────── has many ────── MedicationLogs (N)
```

---

## API Context

### Authentication APIs (`/api/auth`)

| Method | Endpoint | Auth | Purpose | Request Body | Response |
|--------|----------|------|---------|-------------|----------|
| POST | /api/auth/register | No | Register caregiver | `{ name, email, phone, password }` | `{ token, caregiver }` |
| POST | /api/auth/login | No | Login caregiver | `{ email, password }` | `{ token, caregiver }` |
| POST | /api/auth/logout | No | Logout | - | Success message |
| GET | /api/auth/profile | Yes | Get caregiver profile | - | Caregiver object |

**Related files**: `routes/authRoutes.js`, `controllers/AuthController.js`, `services/AuthService.js`, `repositories/AuthRepository.js`

### Patient APIs (`/api/patients`) — All require auth

| Method | Endpoint | Purpose | Request Body / Query |
|--------|----------|---------|---------------------|
| GET | /api/patients | List patients | `?page=&limit=&search=&sort=` |
| POST | /api/patients | Create patient | `{ name, dob, gender, phone, preferredLanguage, emergencyContactName, relationship }` |
| GET | /api/patients/:id | Get patient | - |
| PUT | /api/patients/:id | Update patient | Same as create |
| DELETE | /api/patients/:id | Delete patient + cascading medicines/reminders/refills | - |
| GET | /api/patients/:id/summary | Patient details summary | - |
| GET | /api/patients/:id/adherence | Adherence history | - |
| POST | /api/patients/:id/logs | Log intake status | `{ medicineId, medicineName, date, time, status }` |

**Related files**: `routes/patientRoutes.js`, `controllers/PatientController.js`, `controllers/MedicationLogController.js`

### Medicine APIs (`/api/medicines`) — All require auth

| Method | Endpoint | Purpose | Request Body / Query |
|--------|----------|---------|---------------------|
| GET | /api/medicines | List medicines | `?patientId=&status=&page=&limit=&sort=` |
| POST | /api/medicines | Create medicine | `{ patientId, medicineName, dosage, tabletsPerDose, quantity, totalStock, times, timings, startDate, endDate }` |
| GET | /api/medicines/:id | Get medicine | - |
| PUT | /api/medicines/:id | Update medicine | Same fields as create |
| PATCH | /api/medicines/:id | Partial update | Partial fields |
| DELETE | /api/medicines/:id | Delete medicine + cascading reminders/refills | - |

### Reminder APIs (`/api/reminders`) — All require auth

| Method | Endpoint | Purpose | Request Body / Query |
|--------|----------|---------|---------------------|
| GET | /api/reminders | List reminders | `?patientId=&status=&page=&limit=&sort=` |
| GET | /api/reminders/:id | Get reminder | - |
| PUT | /api/reminders/:id/action | Handle action | `{ action: "COMPLETED" | "SNOOZED" | "EXPIRED" }` |

**Action handling**:
- `COMPLETED` / `TAKEN` → status=COMPLETED, decrement medicine.remainingQuantity by 1, recalculate refill
- `SNOOZED` / `SNOOZE` → status=SNOOZED, trigger `touch()` to update `updatedAt` for cooldown tracking
- `EXPIRED` → status=EXPIRED

### Refill APIs (`/api/refills`) — All require auth

| Method | Endpoint | Purpose | Query |
|--------|----------|---------|-------|
| GET | /api/refills | List refill status | `?patientId=&status=&page=&limit=&sort=` |
| GET | /api/refills/:id | Get refill | - |

### Dashboard API (`/api/dashboard`) — Requires auth

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/dashboard/stats | Get caregiver dashboard statistics (patients count, upcoming reminders, refill alerts, adherence rate) |

### Health API

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | /api/health | No | Health check → `{ status: "OK", timestamp }` |

### Twilio Webhook APIs (`/api/twilio`) — No auth (validated via Twilio signature)

| Method | Endpoint | Purpose | Called By |
|--------|----------|---------|-----------|
| POST | /api/twilio/whatsapp/webhook | Receive patient WhatsApp replies | Twilio (inbound webhook) |
| POST | /api/twilio/voice/webhook | Receive voice webhook events | Twilio |
| GET | /api/twilio/voice/twiml/:reminderId | Generate TwiML for voice call | Twilio (call URL) |
| POST | /api/twilio/voice/gather/:reminderId/:attempt | Process DTMF input (1=Taken, 2=Snooze) | Twilio (gather action) |
| POST | /api/twilio/voice/snooze/:reminderId/:attempt | Process snooze DTMF (1=20min, 2=60min) | Twilio (snooze gather action) |
| POST | /api/twilio/status | Receive call delivery status | Twilio (status callback) |

**WhatsApp Webhook Flow**:
1. Patient receives WhatsApp reminder with text + TAKEN/SNOOZE instructions
2. Patient replies "TAKEN" or "SNOOZE" (or "20" for snooze duration)
3. Twilio sends POST to `/api/twilio/whatsapp/webhook`
4. Controller validates Twilio signature, parses reply via `twilio.service.js` `handleIncomingReply()`
5. Finds patient by phone number, finds latest PENDING reminder
6. TAKEN → status=COMPLETED, sends confirmation
7. SNOOZE (no duration) → sends snooze options (20/60)
8. SNOOZE (with duration) → status=SNOOZED for current reminder, creates new PENDING reminder at future time, max 3 attempts then EXPIRED

---

## External Service Context

### Twilio

**Purpose**: Deliver medication reminders via WhatsApp and optionally Voice calls. Process patient responses.

**Environment Variables**:

| Variable | Required | Purpose |
|----------|----------|---------|
| TWILIO_ACCOUNT_SID | Yes | Twilio account identifier |
| TWILIO_AUTH_TOKEN | Yes | Twilio authentication secret |
| TWILIO_WHATSAPP_NUMBER | Yes | Twilio WhatsApp-enabled phone number (e.g., +14155238886) |
| TWILIO_PHONE_NUMBER | For Voice | Twilio voice-enabled phone number |
| TWILIO_VOICE_ENABLED | No | Set to "true" to enable voice call reminders as backup |

**Service Location**: `backend/src/services/twilio.service.js` (singleton, exported as default)

**Methods Available**:

| Method | Purpose |
|--------|---------|
| `initialize()` | Initializes Twilio client from env vars. Call at startup. |
| `isReady()` | Returns boolean if Twilio is configured |
| `sendWhatsAppMessage(to, body)` | Sends plain WhatsApp message |
| `sendWhatsAppReminder(to, reminderText)` | Sends reminder + TAKEN/SNOOZE options |
| `sendSnoozeOptions(to)` | Sends snooze duration options (20/60 min) |
| `sendTemplateMessage(to, body)` | Sends informational/template message |
| `makeVoiceCall(to, speechText, reminderId)` | Initiates voice call with TwiML URL |
| `generateVoiceTwiml(speechText, reminderId, attempt)` | Generates XML for voice reminder |
| `generateSnoozeTwiml(reminderId, attempt)` | Generates XML for snooze options |
| `translateText(text, language)` | Translates text via Gemini AI |
| `validateWebhookSignature(signature, url, params)` | Validates incoming Twilio webhook |
| `handleIncomingReply(from, body)` | Parses patient WhatsApp reply |

**Webhook Flow**:
```
Scheduler (60s polling)
  → SchedulerService.processDoseReminders()
    → Creates Reminder document (status: PENDING)
    → SchedulerService.sendWhatsAppDoseReminder()
      → twilio.service.sendWhatsAppReminder()
        → Twilio WhatsApp API → Patient's phone
    → (if TWILIO_VOICE_ENABLED) SchedulerService.makeVoiceCallReminder()
      → twilio.service.makeVoiceCall()
        → Twilio Voice API → Patient's phone

Patient replies "TAKEN" or "SNOOZE"
  → Twilio → POST /api/twilio/whatsapp/webhook
  → TwilioController.handleWhatsAppWebhook()
    → Updates Reminder document in MongoDB
    → Sends confirmation/snooze options back to patient
```

**Key Behaviors**:
- Delivery failure (Twilio error, invalid number) → caregiver notified via WhatsApp
- Patient non-response → no caregiver notification (privacy-focused design)
- Snooze max 3 attempts → status becomes EXPIRED

### Gemini AI

**Purpose**: Translate medication reminder text into the patient's preferred language.

**Environment Variable**:

| Variable | Required | Purpose |
|----------|----------|---------|
| GEMINI_API_KEY | For translations | Google AI API key |

**Where AI is used**:
- `twilio.service.js` → `translateText()` method
- Called when building WhatsApp reminders and voice call speech text
- Only called if patient's `preferredLanguage` is not "English"

**Where AI should NOT be used**:
- Not for any medical diagnosis
- Not for decision-making about medication
- Not for analyzing patient health data
- Only for text translation

**Supported Languages**: English (fallback), Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi

---

## Environment Configuration

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| PORT | No | 3000 | Server port |
| APP_URL | Yes | http://localhost:5000 | Public URL (used for Twilio webhook callbacks) |
| MONGODB_URI | Yes | mongodb://127.0.0.1:27017/medreminder | MongoDB connection string |
| JWT_SECRET | Yes | (has fallback) | JWT signing secret |
| JWT_EXPIRES_IN | No | 7d | JWT token expiry |
| NODE_ENV | No | development | Environment mode |
| TZ | No | Asia/Kolkata | Server timezone |
| GEMINI_API_KEY | No | - | Google AI API key for translations |
| TWILIO_ACCOUNT_SID | Yes | - | Twilio account SID |
| TWILIO_AUTH_TOKEN | Yes | - | Twilio auth token |
| TWILIO_WHATSAPP_NUMBER | Yes | - | Twilio WhatsApp number |
| TWILIO_PHONE_NUMBER | For Voice | - | Twilio voice number |
| TWILIO_VOICE_ENABLED | No | false | Enable voice call reminders |

**Rules**:
- Never hardcode secrets in code.
- Never commit `.env` to version control.
- Use `.env.example` to document required variables.
- Access via `process.env.VARIABLE_NAME`.

---

## Coding Standards

### Backend

- **Clean Architecture**: Controllers → Services → Repositories → Models
- **Controllers**: Keep lightweight. Parse request, call service, send response. Wrap in try-catch with `next(error)`.
- **Services**: Business logic only. Throw `ApiError` for known errors. Use `Logger` for logging.
- **Repositories**: Database queries only. Return documents or null.
- **Models**: Mongoose schema with validation, indexes, and relationships. No business logic.
- **Validation**: Use express-validator in validator files. Apply as middleware in routes.
- **Error Handling**: `errorMiddleware.js` catches all errors. `ApiError` class for structured errors.
- **Logging**: Use `Logger.js` utility. Log meaningful messages with context.
- **Naming**: PascalCase for classes/files, camelCase for variables/functions. File names match exported class name.
- **Imports**: Use ES modules (`import`/`export`). Always include `.js` extension in import paths.

### Frontend

- **Components**: Reusable, small, focused. One component per file.
- **Separation**: UI in components, logic in services, state in context.
- **API Calls**: All through `src/services/` using the `api.ts` axios instance.
- **Loading/Error**: Every data-fetching component must handle loading spinner and error display.
- **Forms**: Validate inputs before submission. Show validation errors.
- **Accessibility**: Use semantic HTML, aria labels, keyboard navigation.
- **Naming**: PascalCase for components/files, camelCase for functions/variables.

### Database

- **Indexes**: Add indexes for frequently queried fields (caregiverId, patientId, status, scheduledTime).
- **Consistency**: Maintain schema consistency. Don't add ad-hoc fields without model updates.
- **Queries**: Avoid N+1 queries. Use population and projection efficiently.

---

## Security Guidelines

- **API Keys**: Never hardcode. Always use environment variables.
- **Input Validation**: Use express-validator for all POST/PUT/PATCH endpoints.
- **Authentication**: JWT-based. `authMiddleware.js` verifies token on protected routes.
- **Authorization**: All queries filter by `caregiverId` to ensure multi-tenant isolation.
- **Twilio Webhooks**: Validate `x-twilio-signature` header using `twilioService.validateWebhookSignature()`.
- **Data Privacy**: Minimize patient data stored. No sensitive health records.
- **Secrets**: Never expose SID, Token, Phone Numbers in frontend code or logs.
- **Password**: Hashed with bcryptjs. Never stored in plain text.
- Helmet middleware sets security headers (CSP, X-Frame-Options, etc.).
- CORS is configured to allow credentials from any origin (can be restricted in production).

---

## Testing Context

### Backend Tests (Not yet implemented)

- **API Tests**: Test all endpoints for correct status codes, response structure, and error handling.
- **Service Tests**: Test business logic in isolation (AuthService, ReminderService, SchedulerService).
- **Repository Tests**: Test database queries with in-memory MongoDB.

### Frontend Tests (Not yet implemented)

- **Component Tests**: Test UI components render correctly.
- **User Workflow Tests**: Test full flows (login → create patient → add medicine → view reminders).

### Critical Flows to Test

1. Patient creation with phone and language
2. Medicine scheduling with multiple dose times
3. Scheduler detecting dose time and creating reminder
4. Twilio WhatsApp reminder delivery (requires real credentials)
5. WhatsApp webhook processing (TAKEN → COMPLETED, SNOOZE → options → reschedule)
6. Voice call DTMF processing (1=Taken, 2=Snooze, 1=20min, 2=60min)
7. Snooze max attempts (3 → EXPIRED)
8. Refill alert thresholds (WARNING ≤ 5 days, CRITICAL ≤ 2 days)
9. Stock decrement on dose completion
10. Caregiver notification on delivery failure

---

## Deployment Context

### Development

- `npm run dev` → starts server.js which initializes Vite dev server + Express backend
- Local MongoDB preferred (`mongodb://127.0.0.1:27017/medreminder`)
- Twilio webhooks require public URL (use ngrok: `ngrok http 3000`)
- Set `APP_URL` to ngrok URL for webhook callbacks

### Production

- `npm run build` → Vite builds frontend to `dist/`
- `npm start` → Sets `NODE_ENV=production`, serves `dist/` as static files
- Requires:
  - MongoDB (Atlas or self-hosted)
  - Backend hosting (render.com, railway.app, fly.io, etc.)
  - Environment variables configured in hosting platform
  - Twilio webhook URL configured in Twilio Console → Messaging → Sandbox → "WHEN A MESSAGE COMES IN"
  - For WhatsApp: Patient must send join code to Twilio WhatsApp number to activate sandbox

---

## Development History

| Date | Change | Files Modified | Reason | Impact |
|------|--------|---------------|--------|--------|
| Current | Initial Twilio WhatsApp + Voice integration | See "Recently Changed Files" | Add automated medication reminders via Twilio and multilingual translation via Gemini | New external dependencies; env vars required |

---

## Recently Changed Files

| File | Change | Reason |
|------|--------|--------|
| `backend/src/services/twilio.service.js` | **NEW** | Core Twilio service: WhatsApp messaging, voice calls, TwiML generation, Gemini translation, webhook validation, reply parsing |
| `backend/src/controllers/TwilioController.js` | **NEW** | Webhook handlers: WhatsApp replies, voice DTMF, TwiML generation, snooze handling, status callbacks |
| `backend/src/routes/twilioRoutes.js` | **NEW** | 6 webhook endpoints under `/api/twilio/` |
| `backend/src/app.js` | Modified | Mounted twilioRoutes at `/api/twilio`, added `twilioService.initialize()` at startup |
| `backend/src/services/SchedulerService.js` | Modified | Integrated WhatsApp reminders, voice calls, and refill alerts into scheduler cycle |
| `.env` | Modified | Added Twilio configuration variables |

---

## New Features Added

| Feature | Implementation Location |
|---------|------------------------|
| Twilio WhatsApp reminders | `SchedulerService.sendWhatsAppDoseReminder()` → `twilio.service.sendWhatsAppReminder()` |
| Twilio Voice call reminders | `SchedulerService.makeVoiceCallReminder()` → `twilio.service.makeVoiceCall()` |
| WhatsApp patient response handling | `TwilioController.handleWhatsAppWebhook()` → `twilio.service.handleIncomingReply()` |
| Voice DTMF processing | `TwilioController.handleVoiceGather()`, `handleVoiceSnooze()` |
| Multilingual translation (Gemini AI) | `twilio.service.translateText()` |
| Refill alert WhatsApp notifications | `SchedulerService.sendRefillAlert()` → `twilio.service.sendTemplateMessage()` |
| Delivery failure caregiver notification | `TwilioController.handleStatusCallback()`, SchedulerService error paths |
| Twilio webhook signature validation | `twilio.service.validateWebhookSignature()` |

---

## Database Changes

No schema changes required for Twilio integration. Existing `patient.phone` and `patient.preferredLanguage` fields are used for WhatsApp delivery and translation. Existing `reminder` model status lifecycle is used.

---

## API Changes

| Endpoint | Method | Change |
|----------|--------|--------|
| `/api/twilio/whatsapp/webhook` | POST | NEW — Twilio WhatsApp inbound webhook |
| `/api/twilio/voice/webhook` | POST | NEW — Twilio voice webhook |
| `/api/twilio/voice/twiml/:reminderId` | GET | NEW — TwiML for voice calls |
| `/api/twilio/voice/gather/:reminderId/:attempt` | POST | NEW — DTMF gather response |
| `/api/twilio/voice/snooze/:reminderId/:attempt` | POST | NEW — DTMF snooze response |
| `/api/twilio/status` | POST | NEW — Call status callback |

---

## Decision Log

| Decision | Reason | Alternatives Considered | Tradeoff |
|----------|--------|------------------------|----------|
| Use MongoDB instead of SQL | Flexible medicine schedule structure (array of times) | PostgreSQL, MySQL | Requires careful relationship management |
| Use Twilio WhatsApp (text-based) over interactive buttons | WhatsApp template approval process is complex and slow | Template-based interactive messages | Text replies require user to type response |
| Use Gemini AI for translation | Already have GEMINI_API_KEY in project; avoids additional dependency | Google Translate API, hardcoded translations | API cost for each translation; fallback to English on failure |
| Scheduler polls every 60 seconds | Simple, reliable, no external job queue needed | Cron jobs, Bull/Redis queue | Up to 60s latency in reminder delivery |
| Caregiver notified only on technical failures | Privacy-focused design; patient non-response is not a technical failure | Notify on all non-response | Some missed doses may go unnoticed |
| Separate Twilio service file | All Twilio logic in one place; controllers never call Twilio SDK directly | Inline Twilio calls in controllers | Single file can become large |
| Voice calls as optional (env flag) | Voice is more intrusive; caregivers should opt-in | Always call | Requires env configuration |

---

## Roadmap Awareness

### Possible Future Modules (Do NOT implement unless explicitly requested)

- OCR Prescription Scanning: Extract medicine info from prescription images
- Medicine Recognition: Identify pills from photos
- Advanced AI Assistant: Conversational AI for medication guidance
- Mobile Application: Native iOS/Android apps
- Doctor Portal: Healthcare provider access to patient adherence data
- Analytics Dashboard: Advanced reporting, adherence trends, predictive refill alerts
- Pharmacy Integration: Direct refill ordering with partnered pharmacies

---

## Final AI Agent Behavior

The AI agent must behave as:

- **Senior software engineer** — writes production-quality code with proper error handling, logging, and security.
- **Existing code maintainer** — preserves existing architecture, doesn't refactor unnecessarily.
- **Architecture-aware developer** — understands the full system before making changes.

The AI agent must:

- **Understand before coding** — read relevant files, search for existing implementations.
- **Plan before modifying** — state approach, files, risks before changing code.
- **Reuse before creating** — use existing services, components, utilities instead of creating new ones.
- **Keep documentation updated** — update this file when making significant changes.
- **Preserve existing architecture** — follow the established patterns and conventions.
- **Avoid unnecessary refactoring** — don't change working code without justification.
- **Avoid introducing random dependencies** — don't add npm packages without clear necessity.
- **Prioritize maintainability and production readiness** — write clean, documented, testable code.

### Before Coding Checklist

- [ ] Read this document (AI_CONTEXT.md)
- [ ] Inspect existing project structure with file listing tools
- [ ] Search for existing implementations before creating new files
- [ ] Verify no duplicate functionality exists
- [ ] Check Decision Log for prior architecture decisions

### Before Each Code Change

- [ ] State: implementation approach
- [ ] List: files to modify (new, changed, deleted)
- [ ] Describe: any database or API changes
- [ ] Identify: potential risks

---

## Production Stabilization Cleanup (2026)

### Summary

Completed a full production stabilization pass on the MedReminder+ codebase. The goal was to remove dead code, fix a critical webhook bug, and improve code quality without introducing any behavioral changes.

### Cleanup Completed

| Category | Item | Action |
|----------|------|--------|
| **Dead page** | `src/pages/RefillQueue.tsx` | Removed (not imported/routed anywhere) |
| **Dead entry** | `backend/server.js` | Removed (legacy; root `server.js` is the entry point) |
| **Unused types** | `FeatureCard`, `ToastMessage` from `src/types.ts` | Removed (zero references) |
| **Unused mock data** | `initialPatients[]` in `mockPatients.ts` | Removed (kept all type interfaces) |
| **Unused mock data** | `initialReminders[]` in `mockReminders.ts` | Removed (kept `Reminder` interface) |
| **Unused mock data** | `initialRefills[]` in `mockRefills.ts` | Removed (kept `Refill` interface) |
| **Console.error** | `src/context/PatientContext.tsx` line 35 | Removed (non-401 errors silently handled) |
| **Console.error** | `src/pages/AddPatient.tsx` line 113 | Removed (error already shown via toast) |
| **Console.error** | `src/pages/PatientDetails.tsx` line 40 | Removed (silent catch; UI shows empty state) |
| **Fake org name** | `src/components/layout/Topbar.tsx` | Changed from "MedReminder+ Health Services" to "Caregiver Dashboard" |
| **Webhook bug fix** | `backend/src/controllers/TwilioController.js` | Changed status query from `"PENDING"` to `$in: ["PENDING", "SENT"]` to ensure patient replies are processed after scheduler marks reminders as SENT |

### Files Removed (3)

1. `src/pages/RefillQueue.tsx` — Dead un-routed page
2. `backend/server.js` — Unused legacy entry point
3. (Trimmed data from 3 mock files — files themselves preserved for types)

### Files Modified (6)

1. `src/types.ts` — Removed `FeatureCard` and `ToastMessage` interfaces
2. `src/mock/mockPatients.ts` — Removed `initialPatients[]` array
3. `src/mock/mockReminders.ts` — Removed `initialReminders[]` array
4. `src/mock/mockRefills.ts` — Removed `initialRefills[]` array
5. `src/context/PatientContext.tsx` — Removed `console.error`
6. `src/pages/AddPatient.tsx` — Removed `console.error`
7. `src/pages/PatientDetails.tsx` — Removed `console.error` (silent catch)
8. `src/components/layout/Topbar.tsx` — Updated fake org name
9. `backend/src/controllers/TwilioController.js` — Fixed webhook status query

### Bug Fix Detail

**Critical bug**: The WhatsApp webhook in `TwilioController.handleWhatsAppWebhook()` queried reminders with `status: "PENDING"` only. However, the scheduler's `processPendingReminders()` method changes reminders to `SENT` after sending. This meant patient replies arriving after the scheduler cycle would not match any reminder, causing the reply to be silently ignored.

**Fix**: Changed the query to `status: { $in: ["PENDING", "SENT"] }` to accept both states.

### Remaining Technical Debt

1. **Duplicate WhatsApp sends**: `processDoseReminders()` sends WhatsApp immediately after creating the reminder, and `processPendingReminders()` sends WhatsApp again for the same reminder. The first send in `processDoseReminders()` is redundant.
2. **Refill calculation duplication**: Refill calculation logic (daysRemaining, status determination) is duplicated across `MedicineService.calculateRefillAlert()`, `ReminderService.handleAction()`, `RefillService.recordRefill()`, and `SchedulerService.processRefills()`.
3. **No rate limiting on Twilio webhooks**: Webhook endpoints have no rate limiting, which could allow duplicate processing.
4. **Reminder status enum mismatch**: `Reminder` model has `status: ["PENDING", "SENT", "FAILED", "SNOOZED", "COMPLETED", "EXPIRED"]` but the `ReminderRepository` only filters by `PENDING` for some queries.
5. **Mock files still present**: `mockPatients.ts`, `mockReminders.ts`, `mockRefills.ts` still exist for type definitions. Could be consolidated into a single `types/` directory in a future refactor.

### Last Cleanup Date

2026 (Production Stabilization Phase)
