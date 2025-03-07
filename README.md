# Attendance Management System - Backend Documentation

## 📌 Overview

The Attendance Management System backend is a Node.js and Express-based API that allows employees and students to check in/out while enabling administrators to generate attendance reports and manage users efficiently.

## 🛠️ Technologies Used

- **Node.js** - Backend runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **fast-csv** - Exporting attendance data to CSV

## 🚀 Installation

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/Arslanamin404/AttendanceManagementSystem-API.git
cd attendance-management
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4️⃣ Start the Server

```sh
npm start
```

---

## 📂 API Endpoints

### 🧑‍💻 **Authentication**

#### 🔹 Register a User

```http
POST /auth/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "student" // or "admin"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here"
}
```

#### 🔹 Login

```http
POST /auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "jwt_token_here"
}
```

### 🕒 **Attendance**

#### 🔹 Mark Check-in

```http
POST /attendance/check-in
Authorization: Bearer {token}
```

**Response:**

```json
{
  "message": "Check-in recorded",
  "timestamp": "2024-03-06T08:00:00Z"
}
```

#### 🔹 Mark Check-out

```http
POST /attendance/check-out
Authorization: Bearer {token}
```

**Response:**

```json
{
  "message": "Check-out recorded",
  "timestamp": "2024-03-06T17:00:00Z"
}
```

### 📊 **Reports**

#### 🔹 Export Attendance Report (CSV)

```http
GET /reports/export?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
Authorization: Bearer {token}
```

**Response:** Downloads an `attendance.csv` file.

### 🔹 Admin-Specific Endpoints

#### 🏷️ Get All Users

```http
GET /admin/users
Authorization: Bearer {admin_token}
```

**Response:**

```json
[
  {
    "id": "12345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
]
```

#### 🔹 Delete a User

```http
DELETE /admin/users/:id
Authorization: Bearer {admin_token}
```

**Response:**

```json
{
  "message": "User deleted successfully"
}
```

#### 🔹 Change User Role

```http
PATCH /admin/users/:id/role
Authorization: Bearer {admin_token}
```

**Request Body:**

```json
{
  "role": "admin" // or "student"
}
```

**Response:**

```json
{
  "message": "User role updated successfully"
}
```

---

## 🔐 Authentication & Security

- Uses **JWT tokens** for authentication.
- Secures passwords using **bcrypt**.
- Implements **role-based access control (RBAC)** to differentiate **admin** and **student** roles.

---

## 📌 Future Improvements

- Add **real-time notifications** for late check-ins.
- Provide **graphical attendance analytics**.

---
