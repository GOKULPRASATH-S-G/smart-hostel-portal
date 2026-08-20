# 🏨 Smart Hostel Room Allocation Portal

A modern **full-stack MERN application** designed to simplify and automate hostel room allocation and approval workflows. The platform provides role-based dashboards, room availability management, student applications, and an efficient allocation process.

## 🚀 Live Demo

**Live Application:** https://smart-hostel-portal.onrender.com

## 📌 Overview

The Smart Hostel Room Allocation Portal is a web-based application developed to reduce the manual effort involved in hostel room allocation.

Students can view available rooms and submit allocation requests, while authorized users can review applications, manage room availability, and approve or reject requests through dedicated dashboards.

The system provides a centralized platform for managing the hostel allocation process with authentication, role-based access control, REST APIs, and a responsive user interface.

## ✨ Key Features

### 👨‍🎓 Student

* Secure user registration and login
* JWT-based authentication
* View available hostel rooms
* Filter rooms based on availability and requirements
* Submit room allocation requests
* Track application status
* View allocated room details

### 👨‍💼 Admin / Management

* Role-based dashboard
* View and manage student applications
* Approve or reject room allocation requests
* Manage hostel rooms and availability
* Monitor room allocation status
* Manage student information

### 🔐 Security

* JWT authentication
* Role-based access control
* Protected API routes
* Secure password handling
* Authorization middleware

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB
* MongoDB Atlas

### Authentication & Deployment

* JWT
* Git & GitHub
* Render

## 🏗️ Project Structure

```text
smart-hostel-portal/
│
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                 # Node.js + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── package.json
│
└── README.md
```

## 🔄 Application Workflow

```text
Student Registration/Login
          ↓
     Authentication
          ↓
   View Available Rooms
          ↓
    Apply for a Room
          ↓
   Admin Reviews Request
          ↓
     Approve / Reject
          ↓
   Room Allocation Updated
          ↓
 Student Views Allocation
```

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/GOKULPRASATH-S-G/smart-hostel-portal.git
cd smart-hostel-portal
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add any other environment variables required by your local configuration.

### 5. Run the Backend

```bash
cd server
npm start
```

### 6. Run the Frontend

```bash
cd client
npm run dev
```

The frontend will be available at the local development URL shown by Vite.

## 🔑 Authentication

The application uses **JSON Web Tokens (JWT)** for authentication.

The authentication flow is:

```text
Login
  ↓
Server validates credentials
  ↓
JWT token generated
  ↓
Token stored by client
  ↓
Token sent with protected requests
  ↓
Server verifies token
  ↓
Authorized resource returned
```

## 📡 REST API

The backend follows a RESTful architecture for communication between the frontend and server.

The APIs handle operations such as:

* User authentication
* Room management
* Room allocation requests
* Application approval
* Student information
* Room availability

## 🌐 Deployment

The application is deployed using **Render**.

**Live URL:** https://smart-hostel-portal.onrender.com

## 🎯 Project Objectives

* Digitize the hostel room allocation process
* Reduce manual administrative work
* Provide transparent allocation status
* Implement secure role-based access
* Provide real-time room availability information
* Build a scalable full-stack web application

## 🔮 Future Enhancements

* Email notifications for allocation updates
* Automated room allocation based on predefined rules
* Hostel fee management
* Complaint and maintenance management
* Student attendance tracking
* Analytics dashboard
* Notification system

## 👨‍💻 Author

**Gokulprasath S G**

B.Tech — Artificial Intelligence and Machine Learning
Bannari Amman Institute of Technology

* GitHub: https://github.com/GOKULPRASATH-S-G
* LinkedIn: https://www.linkedin.com/in/gokulprasath-s-g/

## ⭐ Project

If you find this project useful, consider giving the repository a ⭐.
