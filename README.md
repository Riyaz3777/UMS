   # [UMS](https://ums-backend-8agv.onrender.com/)

A secure, modern, full-stack User Management System web application designed for Rixi Lab Project 4.

## 🌟 Technologies Used
- **Frontend**: HTML5, Modern CSS3 (Glassmorphism design system, dark mode, CSS Variables, Flexbox/Grid, dynamic animations), Vanilla JavaScript (ES6+).
- **Backend**: Node.js, Express.js API framework.
- **Database**: MongoDB Atlas (with automatic in-memory fallback for zero-config local testing).
- **Authentication & Security**: JSON Web Tokens (JWT), Password Hashing (`bcryptjs`), Role-Based Access Control (RBAC).

---

## 🚀 Key Features

### 👤 Normal User Features
1. **User Registration & Validation**: Form validation with live password strength indicator.
2. **Secure Login**: JWT token issuing with session persistence in `localStorage`.
3. **Profile Management**: Update full name, phone number, bio, and change password securely.
4. **Self-Service Password Reset**: 6-digit OTP generation and password reset verification flow.

### ⚡ Admin Features
1. **Admin Control Panel**: Real-time overview metrics (Total Users, Active Users, Administrators, New Registrations).
2. **User Management Table**:
   - Live search by Name or Email.
   - Filter by Role (`Admin`, `User`) and Status (`Active`, `Inactive`, `Suspended`).
   - Pagination support.
3. **User CRUD Actions**:
   - **Add New User**: Create accounts with role & status assignment.
   - **Edit User**: Modify details, roles, statuses, or reset passwords.
   - **Delete User**: Delete accounts with modal confirmation guard preventing self-deletion.

---

## 🛠️ Installation & Setup Instructions

### 1. Prerequisite
- [Node.js](https://nodejs.org/) (v16.0.0 or higher installed).

### 2. Quick Start Command
```bash
# Install dependencies
npm install

# Start the server
npm start
```

### 3. Database Configuration (MongoDB Atlas)
By default, the project is pre-configured with MongoDB Atlas connection string in `.env`.
If offline or credentials are not present, it will seamlessly fall back to an in-memory database server so it runs out-of-the-box without requiring complex setup.

To connect your own MongoDB Atlas cluster:
Edit `.env` and set your connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ums_database?retryWrites=true&w=majority
```

---

## 🔑 Pre-seeded Demo Accounts

Upon initial launch, the system automatically seeds default accounts if the database is empty:

| Account Type | Email Address | Password |
|---|---|---|
| **System Admin** | `admin@ums.com` | `AdminPassword123!` |
| **Normal User** | `user@ums.com` | `UserPassword123!` |

---

## 📁 Project Directory Structure

```
umsproject/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   └── server.js
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       ├── admin.js
│   │       ├── api.js
│   │       ├── auth.js
│   │       ├── profile.js
│   │       └── reset.js
│   └── views/
│       ├── admin-dashboard.html
│       ├── index.html
│       ├── login.html
│       ├── profile.html
│       ├── register.html
│       └── reset-password.html
├── .env
├── .env.example
├── package.json
├── PROJECT_REPORT.md
└── README.md
```
