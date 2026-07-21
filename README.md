# 💊 MedReminder+  
### Smart Medication Management & Caregiver Monitoring System

MedReminder+ is a smart healthcare application designed to help patients manage their daily medications while allowing caregivers to monitor medication adherence. The platform provides personalized reminders, medication tracking, and visual insights to improve consistency and reduce missed doses.

The system bridges the gap between patients and caregivers by providing an organized way to manage medicines and monitor medication activity.

---

# 🚀 Features

## 👤 Patient Module

- Create and manage medication schedules
- Add medicines with:
  - Medicine name
  - Start date
  - End date
  - Custom reminder times
  - Number of tablets/doses
- Receive medication reminders
- Mark medicines as **Taken**
- Snooze medication reminders
- View medication history
- Track daily medication progress

---

## 👨‍⚕️ Caregiver Module

- Connect caregivers with patients
- Monitor patient medication adherence
- View medication activity through a dashboard
- Track taken and snoozed medicines
- Analyze patient medication consistency

---

# 📊 Medication Tracking System

MedReminder+ provides a visual medication tracking system that makes adherence patterns easy to understand.

### Status Indicators

🟩 **Taken**  
🟥 **Snoozed**  
⬜ **No Medication Scheduled**

The tracking view allows patients and caregivers to quickly identify medication consistency over time.

---

# 🏗️ System Architecture

```
                ┌──────────────┐
                │   Patient    │
                │   Interface  │
                └──────┬───────┘
                       │
                       │
                ┌──────▼───────┐
                │   Backend    │
                │  REST APIs   │
                └──────┬───────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
 ┌──────▼──────┐              ┌───────▼──────┐
 │  Database   │              │ Caregiver UI │
 │             │              │  Dashboard   │
 └─────────────┘              └──────────────┘
```

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Tailwind CSS
- Responsive UI Design
- Data Visualization Components

## Backend
- Node.js
- Express.js
- REST API Architecture

## Database
- MongoDB
- Mongoose ODM

## Authentication & Security
- JWT Authentication
- Role-Based Access Control
- Secure API Protection

## Development Tools
- Git & GitHub
- Postman
- VS Code

---

# 📂 Project Structure

```
MedReminder+
│
├── client
│   ├── src
│   ├── components
│   ├── pages
│   └── services
│
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   └── config
│
├── README.md
└── package.json
```

---

# ⚙️ Installation & Setup

Follow these steps to run MedReminder+ locally.

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/MedReminder.git

cd MedReminder
```

---

# Backend Setup

## 2. Navigate to Backend Directory

```bash
cd server
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Configure Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

## 5. Start Backend Server

Development mode:

```bash
npm run dev
```

Backend will run on:

```
http://localhost:5000
```

---

# Frontend Setup

## 6. Navigate to Frontend Directory

Open another terminal:

```bash
cd client
```

## 7. Install Dependencies

```bash
npm install
```

## 8. Start Frontend Application

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

# 📌 Prerequisites

Ensure the following are installed before running the project:

- Node.js (v18 or above)
- npm package manager
- MongoDB database
- Git

---

# 🔄 Application Workflow

1. User registers and authenticates into the system.
2. Patient creates medication schedules.
3. Medicines are stored with custom timings and dosage details.
4. Patients receive reminders according to their schedule.
5. Patients mark medication as taken or snoozed.
6. Caregivers monitor adherence through the dashboard.

---

# 🔐 Security Features

- Secure authentication system
- Password encryption
- JWT-based authorization
- Protected patient information
- Role-based permissions

---

# 🎯 Problem Statement

Managing multiple medications daily can be challenging, especially for elderly patients and individuals requiring continuous care. Missed doses and lack of monitoring can affect treatment effectiveness.

MedReminder+ addresses this challenge by providing:

- Timely medication reminders
- Medication history tracking
- Patient adherence monitoring
- Better caregiver visibility
- Organized medicine management

---

# 👨‍💻 Developer

**Manoj Reddy Dulla**  

Full Stack Developer | AI & Healthcare Technology Enthusiast

---

# 📜 License

This project is developed for educational and research purposes.
---

# ⭐ Support

If you find MedReminder+ useful, consider giving this project a ⭐ star on GitHub.  
Your support helps improve the project and encourages further development.