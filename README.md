

# 🛠️ Job Application Tracker - Backend (Express.js + MongoDB)

This is the backend service for the **Job Application Tracker** app, built using **Node.js**, **Express.js**, and **MongoDB**. It provides RESTful APIs for managing users, boards, jobs, and file uploads. Designed to work with a React frontend.

---

## 🚀 Features

- JWT-based authentication (Login/Register)
- CRUD APIs for:
  - Users
  - Boards (Job categories)
  - Jobs (Applications)
- File upload support (resumes, cover letters, etc.)
- MongoDB with Mongoose for flexible schema handling
- CORS support for cross-origin requests
- Modular codebase (routes, controllers, services)

---

## 📁 Project Structure

backend/
│
├── controllers/ # Request handlers
├── middleware/ # Auth, error handling
├── models/ # Mongoose schemas
├── routes/ # Express routes
├── uploads/ # Uploaded files
├── .env # Environment variables
├── app.js # Express app setup
└── server.js # Entry point


---

## 🧪 API Endpoints (Base: `/api`)

### 🔐 Auth
- `POST /auth/register` — Create a new user
- `POST /auth/login` — Authenticate and return JWT

### 📋 Boards
- `GET /boards` — Get all boards
- `POST /boards` — Create a new board
- `DELETE /boards/:id` — Delete a board

### 📌 Jobs
- `GET /jobs/:boardId` — Get jobs for a specific board
- `POST /jobs` — Add or update a job
- `DELETE /jobs/:id` — Delete a job

### 📁 File Uploads
- `POST /upload` — Upload resume, cover letter, or interview files

---

## 🧰 Tech Stack

- **Express.js** - Node.js Web Framework
- **MongoDB + Mongoose** - Database + ODM
- **Multer** - File Upload Handling
- **jsonwebtoken (JWT)** - Auth Tokens
- **dotenv** - Environment Variables

---

## 🛠️ Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/job-tracker-backend.git
cd job-tracker-backend

# 2. Install dependencies
npm install

# 3. Create `.env` file
touch .env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobtracker
JWT_SECRET=your_jwt_secret_key

# 4. Start the server
npm run dev

📦 Scripts
Script	Purpose
npm run dev	Start in dev mode with nodemon
npm start	Start in production

🌍 Deployment
You can deploy to:

Render.com

Heroku

Vercel (Serverless functions)

Railway

🤝 Contributing
Fork this repo

Create a branch: git checkout -b feature/your-feature-name

Commit your changes: git commit -m 'Add feature'

Push to your branch: git push origin feature/your-feature-name

Open a Pull Request ✅

📄 License
This project is licensed under the MIT License.

✨ Credits
Built by [Your Name]
Backend API for Job Application Tracker
