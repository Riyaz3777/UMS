# PROJECT REPORT: USER MANAGEMENT SYSTEM (UMS)

**Domain:** Web Development  
**Project Title:** User Management System (UMS)  
**Organization / Lab:** Rixi Lab - Project 4  
**Date:** September 2026  

---

## 1. Executive Summary
The **User Management System (UMS)** is a secure, responsive full-stack web application built to facilitate centralized user administration, role-based authorization, self-service account management, and password recovery mechanisms. 

The application implements a decoupled architecture utilizing a **Node.js & Express** RESTful API server, a **MongoDB Atlas** cloud database, and a dynamic **HTML5/CSS3/JavaScript** frontend with glassmorphism UI principles.

---

## 2. Technical Stack Specifications

### 2.1 Backend Architecture
- **Runtime Environment:** Node.js (v22+)
- **Web Framework:** Express.js (v4.21+)
- **Database Layer:** MongoDB Atlas (Cloud NoSQL Database via `mongoose` Object Data Modeling)
- **Authentication:** JSON Web Tokens (JWT) using `jsonwebtoken`
- **Security & Cryptography:** Password hashing using `bcryptjs` with salt rounds = 10
- **Environment Management:** `dotenv` for configuration separation

### 2.2 Frontend Architecture
- **Markup:** Semantic HTML5 structure
- **Styling:** Custom CSS3 styling system incorporating CSS Variables, Glassmorphism backdrop-filters, Flexbox/Grid responsive layouts, and HSL/Hex theme styling.
- **Client Logic:** Modular Vanilla JavaScript (ES6+) utilizing standard Fetch API with Bearer token authentication headers.

---

## 3. Key Feature Implementation Breakdown

| Task No. | Task Name | Implementation Details |
|---|---|---|
| 1 | **Project Structure Setup** | Folder separation into `backend/` (config, controllers, models, routes, middleware) and `frontend/` (views, assets/css, assets/js). |
| 2 | **Registration & Login Pages** | Client-side and server-side form validation, email regex validation, live password strength meter. |
| 3 | **Authentication System** | Password encryption via `bcryptjs`, JWT token signing and verification middleware (`protect`). |
| 4 | **User Roles (RBAC)** | Role assignment (`Admin`, `User`) and authorization guard (`authorizeRoles`). |
| 5 | **User Profile Page** | View profile, update name, phone, bio, and change password securely with current password check. |
| 6 | **Admin Dashboard** | Real-time overview metrics (Total Users, Active, Admins, New), full user CRUD operations. |
| 7 | **Search & Filter Functionality** | Debounced real-time search across Name and Email, dropdown filter by Role and Status, pagination. |
| 8 | **Password Reset System** | 6-digit OTP code generation with 15-minute expiration timer and password reset handler. |
| 9 | **Responsive UI Design** | Custom Glassmorphic theme, status badges, toast notifications, interactive modals. |
| 10 | **Testing & Running** | Express static server serving frontend and API routes locally at port 5000. |

---

## 4. API Endpoints Specification

### Auth Endpoints (`/api/auth`)
- `POST /api/auth/register` - Register a new account
- `POST /api/auth/login` - Authenticate credentials & return JWT
- `POST /api/auth/forgot-password` - Request 6-digit OTP for password recovery
- `POST /api/auth/reset-password` - Verify OTP and update password
- `GET /api/auth/me` - Fetch currently authenticated user profile

### User Endpoints (`/api/users`)
- `PUT /api/users/profile` - Update user personal profile
- `PUT /api/users/change-password` - Change security password

### Admin Endpoints (`/api/admin`)
- `GET /api/admin/stats` - Get system analytics summary
- `GET /api/admin/users` - Fetch user list with search, filter, and pagination
- `GET /api/admin/users/:id` - Fetch single user details
- `POST /api/admin/users` - Admin creates new user account
- `PUT /api/admin/users/:id` - Admin updates user role, status, or details
- `DELETE /api/admin/users/:id` - Admin deletes user account (with self-deletion guard)

---

## 5. Security Measures
1. **Password Protection:** Passwords are never stored in plaintext and are excluded from query results by default (`select: false`).
2. **Access Control:** Middleware prevents unauthorized users from calling `/api/admin/*` routes or viewing admin UI pages.
3. **Session Verification:** Stored JWT tokens are validated on every protected API call.
4. **Self-Deletion Guard:** System prevents administrators from accidentally deleting their own logged-in account.

---

## 6. Conclusion
The User Management System meets all requirements set forth in the Project 4 statement. The project features clean, modular, maintainable code, robust error handling, responsive UI design, and complete MongoDB Atlas integration.
