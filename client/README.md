# 🏨 Smart Hostel Room Allocation Portal

A modern, full-stack MERN (MongoDB, Express, React, Node.js) application designed to automate and streamline the process of hostel room management and student allocation.

## 🚀 Live Demo
Deploying on Render*

---

## 💎 Features

### 👨‍🎓 For Students
- **Smart Onboarding:** Registration collects Name, Email, Year of Study, and Phone Number.
- **Interactive Directory:** Browse available cots with real-time status updates (Green for Available, Red for Booked).
- **Advanced Filtering:** Filter cots by Floor, Cot Type (Single/Double), and Monthly Budget.
- **Request System:** Instant "Application Pending" status upon booking to prevent double-booking.
- **Personalized View:** Once approved, students see only their allocated unit details for privacy.

### 👨‍💼 For Administrators
- **Command Center:** Categorized dashboard showing "Action Required," "Inventory," and "Resident Log."
- **Collapsible Management:** High-end UI with accordion-style sections for better focus.
- **One-Click Approval:** Review student details (Year & Phone) and approve/decline requests instantly.
- **Booking Cancellation:** Power to cancel active stays and reset cot availability in real-time.
- **Inventory Control:** Dynamic modal to add new cots with automatic capacity handling (Single = 1, Double = 2).

---

## 🛠 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **MongoDB Atlas** | Cloud database for persistent storage of users and room data. |
| **Express.js** | Backend API framework for handling routing and logic. |
| **React.jsx** | Frontend library for building a dynamic, role-based user interface. |
| **Node.js** | Runtime environment for the server-side logic. |
| **Tailwind CSS v4** | Premium styling for a modern, bespoke "Startup" aesthetic. |
| **JWT & Bcrypt** | Secure authentication and password hashing. |

---

## 📁 Project Structure

```text
smart-hostel-portal/
├── client/           # Frontend React Application (Vite)
│   ├── src/pages/    # Home, Login, Signup, Dashboard
│   └── src/App.jsx   # Client-side routing
└── server/           # Backend Node.js API
    ├── models/       # Database Schemas (User, Room)
    ├── routes/       # API Endpoints (Auth, Rooms)
    └── index.js      # Server entry point