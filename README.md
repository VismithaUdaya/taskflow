# TaskFlow — Intern Assignment: Task Manager App

A full-stack Task Manager application built with React, Node.js, Express, and MongoDB. Users can manage tasks across three Kanban stages: **Todo**, **In Progress**, and **Done**.

## 🔗 Live Links

- **Frontend (Vercel):** `https://taskflow-your-name.vercel.app`
- **Backend (Render):** `https://taskflow-api.onrender.com`

---

## ✨ Features

- **Authentication** — Register & Login with JWT-based sessions
- **Task CRUD** — Create, read, update, delete tasks
- **Kanban Board** — Three-column board (Todo → In Progress → Done)
- **Drag & Drop** — Native HTML5 drag to move tasks between columns
- **Quick Move** — Click "Move" button on each card for instant stage change
- **Priority Levels** — Low / Medium / High with color coding
- **Due Dates** — Optional due date with overdue detection
- **Search** — Real-time task search
- **Responsive** — Works on mobile, tablet, and desktop
- **Loading & Error States** — Proper UX for async operations

---

## 🛠 Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React 18, Vite, CSS Modules   |
| State     | Zustand                       |
| Routing   | React Router v6               |
| HTTP      | Axios                         |
| Backend   | Node.js, Express.js           |
| Database  | MongoDB Atlas + Mongoose      |
| Auth      | JWT (jsonwebtoken), bcryptjs  |
| Toasts    | react-hot-toast               |
| Deploy FE | Vercel                        |
| Deploy BE | Render.com                    |

---

## 📁 Folder Structure

```
taskflow/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js # Register, Login, GetMe
│   │   │   └── taskController.js # CRUD + stage move
│   │   ├── middleware/
│   │   │   ├── auth.js           # JWT protect middleware
│   │   │   └── errorHandler.js   # Global error handler
│   │   ├── models/
│   │   │   ├── User.js           # User schema
│   │   │   └── Task.js           # Task schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js     # /api/auth/*
│   │   │   └── taskRoutes.js     # /api/tasks/*
│   │   └── server.js             # Express app entry
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── tasks/
    │   │   │   ├── KanbanBoard.jsx  # Three-column board
    │   │   │   ├── TaskCard.jsx     # Individual task card
    │   │   │   └── TaskModal.jsx    # Create/edit modal
    │   │   └── ui/
    │   │       └── Navbar.jsx       # Top navigation
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── DashboardPage.jsx
    │   ├── services/api.js          # Axios + interceptors
    │   ├── store/
    │   │   ├── authStore.js         # Zustand auth state
    │   │   └── taskStore.js         # Zustand task state
    │   ├── App.jsx                  # Routes
    │   ├── main.jsx                 # Entry point
    │   └── index.css                # Global styles + CSS vars
    ├── .env.example
    └── package.json
```

---

## ⚡ API Routes

### Auth
| Method | Route              | Access  | Description     |
|--------|--------------------|---------|-----------------|
| POST   | /api/auth/register | Public  | Register user   |
| POST   | /api/auth/login    | Public  | Login user      |
| GET    | /api/auth/me       | Private | Get current user|

### Tasks
| Method | Route                 | Access  | Description         |
|--------|-----------------------|---------|---------------------|
| GET    | /api/tasks            | Private | Get all user tasks  |
| GET    | /api/tasks/:id        | Private | Get single task     |
| POST   | /api/tasks            | Private | Create task         |
| PUT    | /api/tasks/:id        | Private | Update task         |
| DELETE | /api/tasks/:id        | Private | Delete task         |
| PATCH  | /api/tasks/:id/stage  | Private | Quick stage change  |

---

## 🗄 Database Schema

### User
```js
{ name, email, password (hashed), timestamps }
```

### Task
```js
{
  title, description, stage (Todo|In Progress|Done),
  priority (Low|Medium|High), dueDate, user (ref → User),
  timestamps
}
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env: add your MONGODB_URI and a strong JWT_SECRET
npm install
npm run dev        # Starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm install
npm run dev        # Starts on http://localhost:5173
```

---

## 🌐 Deployment

### Backend → Render.com (Free)
1. Push backend folder to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect GitHub repo, set **Root Directory** to `backend`
4. Build: `npm install` | Start: `npm start`
5. Add environment variables: `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`

### Frontend → Vercel (Free)
1. Push frontend folder to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Set **Root Directory** to `frontend`
4. Add env var: `VITE_API_URL=https://your-render-url.onrender.com/api`
5. Deploy → copy URL → update `FRONTEND_URL` on Render

---

## 🔧 Assumptions & Decisions

1. **JWT over Sessions** — Stateless auth fits REST APIs better; no session store needed
2. **Zustand over Redux** — Lighter, less boilerplate for this scope
3. **CSS Modules** — Scoped styles without adding Tailwind/Styled-components as deps
4. **Native Drag & Drop** — HTML5 DnD is sufficient; avoided heavy DnD libraries
5. **Optimistic Updates** — Task stage moves update UI immediately, rollback on failure
6. **MongoDB** — Flexible schema, free Atlas tier, perfect for task data

---

## ⚙ Environment Variables

### Backend `.env`
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Frontend `.env`
```
VITE_API_URL=https://your-render-api.onrender.com/api
```

---

## 🧪 Testing Checklist

- [ ] Register new user
- [ ] Login with wrong password (should show error)
- [ ] Create task with all fields
- [ ] Create task with only title
- [ ] Edit a task
- [ ] Delete a task
- [ ] Drag task to another column
- [ ] Use "Move" button to change stage
- [ ] Search for a task
- [ ] Logout and verify redirect
- [ ] Try accessing /dashboard without login

---

Built with ❤️ as part of the INDPRO Intern Assignment.
