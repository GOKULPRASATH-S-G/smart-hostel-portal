# 🏨 Smart Hostel Room Allocation Portal

A premium, full-stack MERN (MongoDB, Express, React, Node.js) application designed to modernize hostel management. This portal replaces manual paperwork with an automated, role-based workflow for room inventory, student applications, and admin approvals.

**🚀 Live Demo:** [https://smart-hostel-portal.onrender.com](https://smart-hostel-portal.onrender.com)  
*(Note: As this is hosted on a free tier, please allow 30 seconds for the backend to wake up on the first load.)*

---

## 💎 Features

### 👨‍💼 For Administrators (The Command Center)
- **Categorized Management:** Distinct sections for **Action Required** (Pending Requests), **Inventory** (Available Cots), and **Resident Log** (Occupied Units).
- **Collapsible UI:** High-end accordion-style sections to maintain focus on priority tasks.
- **Smart Capacity Logic:** Handle Single and Double cot configurations. The system tracks occupancy levels (e.g., 1/2 filled) and only marks a room "Full" when capacity is met.
- **One-Click Approval/Decline:** Review student profiles including **Name, Year of Study, and Phone Number** before granting access.
- **Stay Cancellation:** Full authority to cancel active bookings and instantly reset cot availability.
- **Instant Inventory Updates:** Add new cots via a glassmorphism modal with automatic capacity assignment.

### 👨‍🎓 For Students (The Resident Experience)
- **Smart Onboarding:** Registration captures academic details (Year) and contact info (Phone) required for verification.
- **Real-Time Resident Catalog:** Browse cots with clear visual status indicators (**Green for Available**, **Red for Booked**).
- **Advanced Filtering:** Quickly find cots by **Floor, Layout Type (Single/Double), or Monthly Budget (₹).**
- **Personalized "Lock" View:** Once a student's booking is approved, the directory hides and shows **only** their allocated room details for privacy and security.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.jsx, Vite, Tailwind CSS v4 (Premium UI) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (NoSQL Cloud Storage) |
| **Security** | JWT (JSON Web Tokens), BcryptJS (Password Hashing) |
| **Deployment** | Render (CI/CD via GitHub) |

---

## 🧩 Novelty & "Smart" Logic
What makes this project stand out from standard booking apps:
1. **Multi-Resident Capacity:** A single "Room" entity can manage multiple "User" entities simultaneously, perfect for shared hostel environments.
2. **Tri-Stage Lifecycle:** Rooms flow dynamically through `Available` → `Action Required` → `Occupied` based on backend logic.
3. **State-Persistent Privacy:** The interface adapts based on the student's allocation status, preventing unauthorized access to other residents' data.
4. **Network Access:** Optimized to run across multiple devices (Mobile/Laptop) on the same local network during development.

---

## 📁 Project Structure

```text
smart-hostel-portal/
├── client/           # React Frontend (Tailwind v4)
│   ├── src/pages/    # Home, Login, Signup, Dashboard
│   └── vite.config.js # Network/Host configuration
└── server/           # Node.js Backend API
    ├── models/       # Schemas (User.js, Room.js)
    ├── routes/       # API Endpoints (Auth, Rooms)
    ├── seed.js       # Auto-generation script for 30 rooms
    └── index.js      # Server Entry Point
