# 💊 MedReminder+

<div align="center">

# Smart Medication Management & Caregiver Monitoring Platform

### **AI-Powered Medication Adherence • WhatsApp Reminders • Caregiver Dashboard • Intelligent Medication Tracking**

<p align="center">

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
<img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript" />
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js" />
<img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb" />
<img src="https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss" />
<img src="https://img.shields.io/badge/Twilio-WhatsApp-F22F46?style=for-the-badge&logo=twilio" />
<img src="https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge" />
<img src="https://img.shields.io/badge/Luxon-Timezone-orange?style=for-the-badge" />

</p>

<p align="center">

**Helping patients never miss a dose while empowering caregivers with real-time medication adherence monitoring.**

</p>

---

### 🌟 Key Highlights

🩺 Smart Medication Scheduling • 📱 WhatsApp Reminders • 👨‍⚕️ Caregiver Dashboard • 📊 Adherence Analytics • 🌍 Timezone Aware • ☎️ E.164 Phone Normalization • 🔒 JWT Authentication

---

> **MedReminder+** is a production-ready healthcare platform that automates medication reminders, enables caregivers to monitor adherence, and improves treatment consistency through intelligent scheduling, secure communication, and modern full-stack technologies.

</div>

---

# 📚 Table of Contents

* Overview
* Problem Statement
* Solution
* Features
* Screenshots
* Architecture
* Technology Stack
* Project Structure
* Core Modules
* Database Design
* Reminder Lifecycle
* REST API Overview
* Authentication
* WhatsApp Integration
* Timezone Handling
* Phone Number Normalization
* Security
* Installation
* Environment Variables
* Running the Application
* Testing Workflow
* Logging
* Performance & Scalability
* Deployment
* Roadmap
* Contributing
* Project Highlights
* Learning Outcomes
* Developer
* Acknowledgements
* License

---

# 🌍 Overview

Medication adherence remains one of the biggest challenges in healthcare. Patients often miss medications due to busy schedules, memory-related issues, complex prescriptions, or a lack of proper monitoring. These missed doses can significantly impact recovery, increase hospitalization rates, and reduce treatment effectiveness.

Traditional reminder applications typically provide simple alarms without caregiver involvement, medication history, refill prediction, or intelligent scheduling.

**MedReminder+** was built to solve these limitations by combining medication management, caregiver collaboration, automated WhatsApp reminders, and adherence tracking into a single platform.

The application enables caregivers to register patients, manage medications, schedule reminders, monitor adherence, and receive real-time insights into medication activity.

---

# ❗ Problem Statement

Medication non-adherence affects millions of patients worldwide.

Common challenges include:

* Forgetting medication timings
* Managing multiple medicines daily
* Lack of caregiver visibility
* Missing refill schedules
* Manual medication tracking
* Poor adherence reporting
* Difficulty monitoring elderly patients
* No centralized medication history

Healthcare providers and family members often struggle to determine whether patients have taken their prescribed medicines, resulting in delayed interventions and poorer health outcomes.

---

# 💡 Solution

MedReminder+ provides an intelligent medication management platform that combines:

* Secure caregiver authentication
* Centralized patient management
* Automated medication scheduling
* WhatsApp reminder delivery
* Medication adherence tracking
* Snooze functionality
* Refill prediction
* Timezone-aware reminder generation
* International phone number normalization
* Comprehensive caregiver dashboard
* Secure REST APIs
* Responsive modern user interface

The system bridges the communication gap between caregivers and patients while reducing manual effort through automation.

---

# ✨ Core Features

## 👨‍⚕️ Caregiver Management

* Secure caregiver registration
* JWT-based authentication
* Login & logout
* Dashboard overview
* Patient onboarding
* Medication monitoring
* Adherence insights
* Caregiver profile management

---

## 👤 Patient Management

Create and manage patients with:

* Full name
* Date of birth
* Gender
* Phone number
* Preferred language
* Emergency contact
* Relationship details
* Medical profile

Features include:

* Create patient
* Update patient
* Delete patient
* View patient details
* Medication history
* Activity timeline

---

## 💊 Medication Management

Manage medicines with complete scheduling support.

Each medicine includes:

* Medicine name
* Dosage
* Tablets per dose
* Quantity
* Total stock
* Remaining stock
* Start date
* End date
* Multiple reminder times
* Timezone
* Current status

Supported medication states:

* ACTIVE
* EXPIRED

---

## ⏰ Automated Reminder Engine

The scheduler automatically:

* Generates reminders
* Creates future reminder records
* Sends WhatsApp reminders
* Tracks reminder status
* Handles snooze actions
* Creates medication logs
* Updates adherence history

---

## 📱 Twilio WhatsApp Integration

MedReminder+ integrates with Twilio WhatsApp Sandbox (or Production API) to provide automated medication reminders.

Capabilities include:

* WhatsApp reminders
* Interactive replies
* TAKEN confirmation
* SNOOZE support
* Delivery tracking
* Webhook processing
* Confirmation messages

---

## 📊 Medication Adherence Tracking

Track medication consistency using visual indicators.

Supported actions include:

🟩 Taken
🟨 Pending
🟥 Snoozed
⬜ No Medication Scheduled

Dashboard provides:

* Daily adherence
* Weekly adherence
* Medication history
* Timeline view
* Patient progress
* Consistency analysis

---

## 📦 Refill Monitoring

Automatically estimates refill requirements using remaining stock and dosage information.

Features include:

* Remaining quantity
* Estimated refill date
* Refill prediction
* Low stock alerts
* Refill status

---

## 🌍 Timezone-Aware Scheduling

Medication reminders are fully timezone-aware, implemented using Luxon with UTC storage and Asia/Kolkata as the default timezone. See [Timezone Handling](#-timezone-handling) below for the full conversion workflow.

---

## ☎ Phone Number Normalization

All phone numbers are normalized into E.164 format before storage. See [Phone Number Normalization](#-phone-number-normalization) below for supported formats.

---

## 🔐 Authentication & Authorization

Authentication is powered using JWT.

Security features include:

* Secure login
* Password hashing
* JWT access tokens
* Protected APIs
* Role-based authorization
* Secure middleware
* Token validation
* Unauthorized request blocking

---

## 📈 Dashboard Analytics

Caregiver dashboard provides:

* Total Patients
* Active Medicines
* Pending Reminders
* Today's Adherence
* Recently Registered Patients
* Medication Activity
* Reminder Statistics

---

# 🖼 Application Screenshots

> Replace these placeholders with actual screenshots from your project.

| Module              | Screenshot                          |
| -------------------- | ----------------------------------- |
| Dashboard           | `docs/screenshots/dashboard.png`    |
| Login               | `docs/screenshots/login.png`        |
| Register            | `docs/screenshots/register.png`     |
| Patient List        | `docs/screenshots/patients.png`     |
| Add Patient         | `docs/screenshots/add-patient.png`  |
| Medicine List       | `docs/screenshots/medicines.png`    |
| Add Medicine        | `docs/screenshots/add-medicine.png` |
| Medication Tracking | `docs/screenshots/tracking.png`     |
| WhatsApp Reminder   | `docs/screenshots/whatsapp.png`     |

---

# 🏗 System Architecture

```text
                                   ┌──────────────────────────────┐
                                   │      Caregiver Dashboard     │
                                   │ React + TypeScript + Vite    │
                                   └──────────────┬───────────────┘
                                                  │
                                                  │ HTTPS
                                                  ▼
                              ┌─────────────────────────────────────┐
                              │        Express REST API Server      │
                              └─────────────────┬───────────────────┘
                                                │
              ┌─────────────────────────────────┼──────────────────────────────────┐
              │                                 │                                  │
              ▼                                 ▼                                  ▼
      Authentication                    Scheduler Service                  Twilio Service
      JWT Middleware                  Reminder Processing               WhatsApp Messaging
              │                                 │                                  │
              └─────────────────────────────────┼──────────────────────────────────┘
                                                │
                                                ▼
                                     MongoDB + Mongoose ODM

                      caregivers
                      patients
                      medicines
                      reminders
                      medicationlogs
                      refills
```

---

# ⚙ Technology Stack

## Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Axios
* Context API
* Responsive Design

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Luxon
* Twilio SDK
* REST APIs
* Scheduler Service
* Logger Service

## Database

MongoDB Collections

* caregivers
* patients
* medicines
* reminders
* medicationlogs
* refills

## Dev Tools

* Git
* GitHub
* VS Code
* MongoDB Compass
* Postman
* npm

---

# 📂 Project Structure

```text
MedReminder+
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── scheduler/
│   │   └── logs/
│   │
│   ├── package.json
│   └── server.js
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── App.tsx
│
├── public/
│
├── docs/
│   └── screenshots/
│
├── package.json
├── vite.config.ts
├── README.md
└── LICENSE
```

---

# 🧩 Core Application Modules

The platform is organized into independent modules to improve scalability and maintainability.

| Module               | Description                               |
| -------------------- | ----------------------------------------- |
| Authentication       | Secure caregiver registration & login     |
| Patient Management   | CRUD operations for patients              |
| Medicine Management  | Create and manage medication schedules    |
| Reminder Engine      | Automated reminder generation             |
| Scheduler            | Processes medication reminders            |
| WhatsApp Integration | Sends reminders and receives replies      |
| Medication Logs      | Tracks patient adherence                  |
| Refill Prediction    | Estimates medicine refill dates           |
| Dashboard            | Visualizes adherence and patient activity |

---

# 🗄 Database Design

MedReminder+ follows a normalized MongoDB schema where each collection has a single responsibility while maintaining relationships through ObjectIds.

## Database Collections

| Collection     | Purpose                                 |
| -------------- | ---------------------------------------- |
| caregivers     | Stores authenticated caregiver accounts |
| patients       | Stores patient profiles                 |
| medicines      | Stores medication schedules             |
| reminders      | Stores generated reminder events        |
| medicationlogs | Stores adherence history                |
| refills        | Stores refill prediction data           |

---

## Entity Relationship Diagram

```text
                         ┌──────────────────────┐
                         │     Caregiver        │
                         └──────────┬───────────┘
                                    │
                          One Caregiver
                                    │
                                   Many
                                    │
                         ┌──────────▼───────────┐
                         │       Patient        │
                         └──────────┬───────────┘
                                    │
                          One Patient
                                    │
                                   Many
                                    │
                         ┌──────────▼───────────┐
                         │      Medicine        │
                         └──────────┬───────────┘
                     ┌──────────────┴──────────────┐
                     │                             │
                  Many                          One
                     │                             │
         ┌───────────▼──────────┐      ┌──────────▼──────────┐
         │      Reminder        │      │      Refill         │
         └──────────┬───────────┘      └─────────────────────┘
                    │
                 One Reminder
                    │
                   Many
                    │
          ┌─────────▼──────────┐
          │  Medication Log    │
          └────────────────────┘
```

---

## Database Schema Overview

### Caregiver

Responsible for authentication and managing patients.

```json
{
  "_id": "...",
  "name": "Dulla Manoj Reddy",
  "email": "example@gmail.com",
  "phone": "+919876543210",
  "password": "hashed_password"
}
```

### Patient

Stores patient demographic and contact information.

```json
{
  "_id": "...",
  "caregiverId": "...",
  "name": "Ramesh",
  "dob": "1990-01-01",
  "gender": "Male",
  "phone": "+919966007804",
  "preferredLanguage": "English",
  "emergencyContactName": "Suman",
  "emergencyContactPhone": "+919876543211"
}
```

### Medicine

Stores medicine schedules.

```json
{
  "_id": "...",
  "patientId": "...",
  "caregiverId": "...",
  "medicineName": "Paracetamol",
  "dosage": "1 Tablet",
  "times": [
      "09:00",
      "18:30"
  ],
  "timezone": "Asia/Kolkata",
  "startDate": "2026-07-25",
  "endDate": "2026-08-25",
  "status": "ACTIVE"
}
```

### Reminder

Represents a scheduled reminder.

```json
{
  "_id": "...",
  "medicineId": "...",
  "patientId": "...",
  "caregiverId": "...",
  "scheduledTime": "2026-07-25T13:00:00Z",
  "status": "PENDING",
  "attempt": 1
}
```

### Medication Log

Stores patient medication activity.

```json
{
  "_id": "...",
  "patientId": "...",
  "medicineId": "...",
  "caregiverId": "...",
  "action": "TAKEN",
  "timestamp": "2026-07-25T13:01:00Z",
  "reminderId": "..."
}
```

### Refill

Tracks remaining medicine quantity.

```json
{
  "_id": "...",
  "medicineId": "...",
  "remainingQuantity": 12,
  "estimatedRefillDate": "2026-08-04",
  "status": "SAFE"
}
```

---

# 🔄 Reminder Lifecycle

```text
Caregiver Creates Medicine
            │
            ▼
Generate Future Reminders (UTC)
            │
            ▼
Store in MongoDB
            │
            ▼
Scheduler Checks Every Minute
            │
            ▼
Pending Reminder Found
            │
            ▼
Send WhatsApp Reminder
            │
            ▼
Reminder Status → SENT
            │
            ▼
Patient Replies
      │              │
      ▼              ▼
   TAKEN         SNOOZE
      │              │
      ▼              ▼
COMPLETED     New Reminder Created
      │              │
      └──────┬───────┘
             ▼
Medication Logs Updated
             │
             ▼
Caregiver Dashboard Updated
```

### Reminder Status Flow

```text
PENDING
   │
   ▼
SENT
   │
   ├─────────────┐
   ▼             ▼
COMPLETED     SNOOZED
                  │
                  ▼
           New Pending Reminder
```

| Status    | Description                  |
| --------- | ---------------------------- |
| PENDING   | Waiting for scheduled time   |
| SENT      | WhatsApp reminder delivered  |
| COMPLETED | Patient confirmed medication |
| SNOOZED   | Reminder postponed           |

---

# 📡 REST API Overview

The backend follows RESTful architecture with modular routing and controller separation.

## Authentication

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| POST   | `/api/auth/register` | Register caregiver |
| POST   | `/api/auth/login`    | Login caregiver    |
| GET    | `/api/auth/profile`  | Get profile        |

## Patients

| Method | Endpoint             |
| ------ | --------------------- |
| GET    | `/api/patients`      |
| GET    | `/api/patients/:id`  |
| POST   | `/api/patients`      |
| PUT    | `/api/patients/:id`  |
| DELETE | `/api/patients/:id`  |

## Medicines

| Method | Endpoint              |
| ------ | ---------------------- |
| GET    | `/api/medicines`      |
| GET    | `/api/medicines/:id`  |
| POST   | `/api/medicines`      |
| PUT    | `/api/medicines/:id`  |
| DELETE | `/api/medicines/:id`  |

## Reminders

| Method | Endpoint              |
| ------ | ---------------------- |
| GET    | `/api/reminders`      |
| GET    | `/api/reminders/:id`  |

## Medication Logs

| Method | Endpoint                          |
| ------ | ---------------------------------- |
| GET    | `/api/medication-logs`            |
| GET    | `/api/medication-logs/:patientId` |

## Refills

| Method | Endpoint                  |
| ------ | -------------------------- |
| GET    | `/api/refills`            |
| GET    | `/api/refills/:patientId` |

## Twilio Webhooks

| Method | Endpoint                       |
| ------ | -------------------------------- |
| POST   | `/api/twilio/whatsapp/webhook` |

---

# 🔐 Authentication

Authentication is powered by JWT.

```text
Register
      │
      ▼
Password Hashing (bcrypt)
      │
      ▼
Stored in MongoDB
      │
      ▼
Login
      │
      ▼
Password Verification
      │
      ▼
JWT Generated
      │
      ▼
Frontend Stores Token
      │
      ▼
Protected API Requests
      │
      ▼
JWT Middleware
      │
      ▼
Authorized Response
```

---

# 📱 WhatsApp Reminder System

MedReminder+ integrates with **Twilio WhatsApp API** for automated medication reminders.

## Features

* Automated reminder delivery
* Interactive patient replies
* Reminder confirmation
* Snooze requests
* Webhook processing
* Delivery logging

## Reminder Message

```text
💊 MedReminder+

Hello Ramesh,

It's time to take your medicine.

Medicine:
Paracetamol

Dose:
1 Tablet

Reply

TAKEN

or

SNOOZE
```

## Webhook Flow

```text
Patient Reply
        │
        ▼
Twilio
        │
        ▼
Webhook Endpoint
        │
        ▼
Patient Lookup
        │
        ▼
Reminder Lookup
        │
        ▼
Update Reminder Status
        │
        ▼
Create Medication Log
        │
        ▼
Confirmation Message
```

Supported replies:

| Reply  | Action                                       |
| ------ | ---------------------------------------------- |
| TAKEN  | Marks reminder as completed                  |
| SNOOZE | Creates a new reminder after snooze duration |

---

# 🌍 Timezone Handling

The application uses **Luxon** for timezone-aware scheduling. All reminder timestamps are stored in **UTC**, while user input and display use **Asia/Kolkata (IST)** by default.

### Why UTC?

Using UTC internally prevents issues caused by:

* daylight saving changes
* server timezone differences
* deployment across regions
* inconsistent reminder delivery

### Workflow

```text
User Selects

25 Jul 2026
6:30 PM IST

        │
        ▼

Luxon Converts

2026-07-25T13:00:00Z

        │
        ▼

Stored in MongoDB

        │
        ▼

Scheduler compares UTC

        │
        ▼

WhatsApp delivered exactly at
6:30 PM IST
```

---

# ☎ Phone Number Normalization

All phone numbers are normalized into **E.164** format before database storage.

| User Input      | Stored        |
| --------------- | ------------- |
| 9966007804      | +919966007804 |
| 09966007804     | +919966007804 |
| +91 9966 007804 | +919966007804 |
| +919966007804   | +919966007804 |

Benefits:

* Twilio compatibility
* Consistent storage
* International support
* Easier validation
* Better maintainability

---

# 🔒 Security

MedReminder+ follows modern backend security best practices.

### Authentication

* JWT Authentication
* Password hashing with bcrypt
* Protected routes
* Token verification middleware
* Role-based authorization

### API Security

* Request validation
* Input sanitization
* Authorization checks
* Proper HTTP status codes
* Phone and time validation

### Database Security

* Parameterized queries through Mongoose
* Schema validation
* Indexed collections
* Normalized phone numbers
* UTC timestamp storage

### Environment Security

Never commit:

```text
.env
JWT Secret
MongoDB Credentials
Twilio Auth Token
API Keys
Production URLs
```

---

# ⚙ Installation

## Prerequisites

* Node.js 18+
* npm
* MongoDB Community Edition
* Git

## Clone Repository

```bash
git clone https://github.com/dullamanojreddy/medireminder.git

cd medireminder
```

## Install Dependencies

### Backend

```bash
npm install
```

### Frontend

```bash
cd frontend

npm install
```

---

# ⚡ Environment Variables

Create a `.env` file in the project root.

```env
NODE_ENV=development

PORT=3000

MONGODB_URI=mongodb://127.0.0.1:27017/medreminder

JWT_SECRET=your_jwt_secret

TWILIO_ACCOUNT_SID=

TWILIO_AUTH_TOKEN=

TWILIO_WHATSAPP_NUMBER=

TWILIO_PHONE_NUMBER=

TWILIO_VOICE_ENABLED=false

APP_URL=your ngrok url

GEMINI_API_KEY=
```

---

# ▶ Running the Application

### Start MongoDB

```bash
mongod
```

or start the MongoDB Windows Service.

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm run dev
```

### Production

```bash
npm start
```

### Open Application

Frontend

```text
http://localhost:5173
```

Backend API

```text
http://localhost:3000
```

---

# 🧪 Recommended Testing Workflow

1. Register a caregiver.
2. Add a patient.
3. Create a medicine schedule.
4. Verify reminders are generated.
5. Wait for the scheduler.
6. Receive the WhatsApp reminder.
7. Reply with **TAKEN**.
8. Confirm medication logs are created.
9. Verify dashboard updates.
10. Check refill predictions.

The project also includes testing for phone normalization, scheduler logic, reminder generation, authentication, API validation, and service utilities. Future improvements include integration testing, end-to-end testing, webhook automation tests, load testing, and performance benchmarking.

---

# 📊 Logging

Application logging captures:

* scheduler execution
* WhatsApp delivery
* webhook activity
* authentication
* validation failures
* database errors
* API requests

Logging levels:

```text
INFO
WARN
ERROR
DEBUG
```

---

# 📈 Performance & Scalability

Current optimizations include:

* MongoDB indexing
* Lean database queries where applicable
* Service-based architecture
* Centralized validation
* Modular controllers
* Scheduled reminder batching
* UTC storage
* Phone normalization
* Minimal API payloads
* Stateless JWT authentication
* Centralized logging

Possible future scaling improvements:

* Redis caching
* Queue-based reminder processing
* Horizontal backend scaling
* Load balancing
* Microservices
* Event-driven architecture
* Dedicated notification service
* Analytics service
* Audit logging
* Distributed schedulers

---

# 🚀 Deployment Guide

## Recommended Production Stack

```text
Ubuntu Server
      ↓
Node.js LTS
      ↓
MongoDB
      ↓
Nginx Reverse Proxy
      ↓
PM2 Process Manager
      ↓
Twilio
      ↓
HTTPS (SSL)
```

## Production Checklist

* Configure HTTPS
* Enable MongoDB authentication
* Store secrets in environment variables
* Configure firewall
* Enable automatic backups
* Configure PM2 auto restart
* Configure reverse proxy
* Configure SSL certificate
* Configure Twilio Production WhatsApp number
* Configure production webhook URL

## Build Application

```bash
npm install

npm run build

npm start
```

## Suggested Deployment Options

| Service       | Purpose               |
| ------------- | ---------------------- |
| Render        | Backend Hosting        |
| Railway       | Backend Hosting        |
| DigitalOcean  | VPS                     |
| AWS EC2       | Production Server      |
| Azure         | Cloud Infrastructure   |
| Google Cloud  | Compute Engine         |
| MongoDB Atlas | Cloud Database          |
| Cloudflare    | DNS + CDN               |
| Nginx         | Reverse Proxy           |

## Production Architecture

```text
                    Users
                      │
                      ▼
             HTTPS / Nginx
                      │
                      ▼
          MedReminder+ Backend
                      │
      ┌───────────────┼───────────────┐
      ▼               ▼               ▼
 MongoDB         Scheduler        Twilio APIs
      │                               │
      └───────────────┬───────────────┘
                      ▼
              WhatsApp Messages
```

## Monitoring

| Tool            | Purpose              |
| --------------- | --------------------- |
| PM2             | Process Monitoring    |
| Grafana         | Dashboards             |
| Prometheus      | Metrics                |
| Sentry          | Error Tracking         |
| MongoDB Compass | Database Inspection   |
| Twilio Console  | Message Monitoring     |


# 💡 Project Highlights

✔ Full Stack Healthcare Application
✔ JWT Authentication
✔ MongoDB Database
✔ WhatsApp Medication Reminders
✔ Automated Reminder Scheduler
✔ Timezone-aware Reminder Processing
✔ E.164 Phone Number Normalization
✔ Caregiver Dashboard
✔ Medication Adherence Tracking
✔ RESTful API Architecture
✔ Modular Service Layer
✔ Production-ready Backend Structure

---

# 📚 Learning Outcomes

This project demonstrates practical implementation of:

* Full Stack Web Development
* REST API Design
* MongoDB Data Modeling
* Authentication & Authorization
* Background Job Scheduling
* Third-party API Integration
* WhatsApp Automation
* Timezone Management
* Healthcare Data Processing
* Software Architecture
* Error Handling
* Production Deployment

---

# 👨‍💻 Developer

## Dulla Manoj Reddy

**Full Stack Developer | AI Engineer | Healthcare Technology Enthusiast**

---

# 📜 License

This project is developed for educational and research purposes.
---

# ⭐ Support

If you find MedReminder+ useful, consider giving this project a ⭐ star on GitHub.  
Your support helps improve the project and encourages further development.