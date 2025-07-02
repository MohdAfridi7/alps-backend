# 🧠 Alps CRM - Backend

This is the complete backend server for the **Alps CRM System**, built with **Node.js**, **Express**, and **MongoDB**. It supports role-based authentication, project & ticket management, file uploads, and dynamic dashboard analytics for Admin and Client roles.

---

## 🚀 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (JSON Web Token)
- **File Uploads:** Multer (for PDF/Image upload)
- **Password Security:** Bcrypt
- **Role Management:** Admin & Client based access control
- **Dashboard Analytics:** Custom stats APIs (projects, tickets, users)

---

## 📁 Project Structure

backend/
│
├── models/ # Mongoose models (User, Project, Ticket)
├── controllers/ # API logic for auth, project, ticket, dashboard
├── routes/ # Route handlers
├── middlewares/ # Auth middleware (JWT + Role check)
├── uploads/ # Uploaded files (PDFs & Images)
├── .env # Environment variables (PORT, DB, JWT_SECRET)
├── server.js # Entry point
└── package.json # Dependencies & scripts


---

## 🔐 Authentication (JWT)

- User receives JWT on successful login or registration.
- Token payload includes: `id`, `email`, `role`
- Two separate token keys in frontend: `admToken` (Admin) & `clntToken` (Client)
- Protected routes using middleware:
  - `authMiddleware`: Checks for valid token
  - `adminOnly`: Ensures only Admin can access

---

## 👤 User Roles

- **Admin**
  - Register/login
  - Manage clients (CRUD)
  - Manage projects (CRUD + Assign clients)
  - Create tickets for projects
  - View all tickets
  - Dashboard analytics
  - Change password

- **Client**
  - Login
  - View assigned projects
  - View their tickets
  - Update ticket status
  - Add comments on tickets
  - Change password

---

## 📂 API Endpoints Overview

### 🔑 Auth APIs (`/api/auth`)

| Method | Endpoint                | Description                      |
|--------|-------------------------|----------------------------------|
| POST   | `/register`             | Register a new user              |
| POST   | `/login`                | Login and get JWT token          |
| GET    | `/users?role=Client`    | Get all users by role (Admin only) |
| GET    | `/users/:id`            | Get user by ID                   |
| PUT    | `/users/:id`            | Update user by ID                |
| DELETE | `/users/:id`            | Delete user by ID                |
| PUT    | `/users/:id/password`   | Change user password             |

---

### 📁 Project APIs (`/api/projects`)

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| POST   | `/`                   | Create a project (Admin only)      |
| GET    | `/`                   | Get all projects (Admin only)      |
| PUT    | `/assign`             | Assign project to client           |
| GET    | `/my`                 | Get projects assigned to client    |
| GET    | `/:id`                | Get single project by ID           |
| PUT    | `/:id`                | Update project                     |
| DELETE | `/:id`                | Delete project                     |

---

### 🎫 Ticket APIs (`/api/tickets`)

| Method | Endpoint                       | Description                        |
|--------|--------------------------------|------------------------------------|
| POST   | `/`                            | Create ticket (Admin only)         |
| GET    | `/`                            | Get all tickets (Admin only)       |
| GET    | `/my`                          | Get tickets for logged-in client   |
| GET    | `/:id`                         | Get ticket by ID                   |
| PUT    | `/:id`                         | Update ticket (Admin only)         |
| DELETE | `/:id`                         | Delete ticket (Admin only)         |
| POST   | `/:id/comment`                 | Add comment to ticket              |
| PUT    | `/:id/status`                  | Update ticket status (Client only) |

---

### 📎 Upload API (`/api/upload/ticket/:id`)

- Supports single file upload (PDF or Image)
- Stored in `uploads/` directory
- Saved with timestamp filenames to prevent conflicts

---

### 📊 Dashboard APIs (`/api/dashboard`)

| Method | Endpoint                     | Description                      |
|--------|------------------------------|----------------------------------|
| GET    | `/stats`                     | Summary stats (users, tickets)   |
| GET    | `/tickets-last-7-days`       | Daily ticket count (last 7 days) |
| GET    | `/clients-last-7-days`       | Daily client signup trend        |
| GET    | `/projects-by-status`        | Project count by status          |
| GET    | `/tickets-by-priority`       | Ticket count by priority         |

---

## 🔧 Environment Variables (`.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/alps-crm
JWT_SECRET=your_secret_key
