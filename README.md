# Taskr — Full Stack Todo Application

A production-ready full stack Todo app with JWT authentication, a RESTful API, and a polished React frontend.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, React Router v6  |
| HTTP Client| Axios (with JWT interceptors)                   |
| Backend    | Node.js, Express 4                              |
| Auth       | JWT (`jsonwebtoken`) + `bcryptjs`               |
| Validation | `express-validator`                             |
| Security   | `helmet`, `cors`, `express-rate-limit`          |
| Database   | In-memory Map (swap for MongoDB/PostgreSQL)     |

---

## Project Structure

```
todo-app/
├── backend/
│   ├── src/
│   │   ├── server.js              # Express app entry point
│   │   ├── models/index.js        # UserModel + TodoModel (in-memory DB)
│   │   ├── middleware/auth.js     # JWT verification middleware
│   │   └── routes/
│   │       ├── auth.js            # /api/auth/* endpoints
│   │       └── todos.js           # /api/todos/* endpoints (CRUD)
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── main.jsx               # React entry point
    │   ├── App.jsx                # Router + protected routes
    │   ├── index.css              # Tailwind + custom styles
    │   ├── api/index.js           # Axios client
    │   ├── context/
    │   │   └── AuthContext.jsx    # Global auth state (login/register/logout)
    │   ├── hooks/
    │   │   └── useTodos.js        # All CRUD operations + state management
    │   ├── pages/
    │   │   ├── AuthPage.jsx       # Login + Register pages
    │   │   └── DashboardPage.jsx  # Main todo dashboard
    │   └── components/
    │       ├── TodoItem.jsx       # Individual todo row
    │       ├── TodoForm.jsx       # Create/Edit modal
    │       ├── FilterBar.jsx      # Search + filter + sort controls
    │       └── StatsBar.jsx       # Stats cards + progress bar
    ├── index.html
    ├── vite.config.js             # Vite dev server + API proxy
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## Getting Started

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env — set a strong JWT_SECRET (min 32 chars)
npm install
npm run dev
# API running at http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:3000
```

Vite proxies `/api` → `http://localhost:5000` automatically — no CORS issues during development.

---

## API Reference

### Auth Endpoints

| Method | Endpoint             | Body                              | Response              |
|--------|----------------------|-----------------------------------|-----------------------|
| POST   | `/api/auth/register` | `{username, email, password}`     | `{token, user}`       |
| POST   | `/api/auth/login`    | `{email, password}`               | `{token, user}`       |
| GET    | `/api/auth/me`       | —                                 | `{user}`              |

### Todo Endpoints (all require `Authorization: Bearer <token>`)

| Method | Endpoint          | Params / Body                     | Response              |
|--------|-------------------|-----------------------------------|-----------------------|
| GET    | `/api/todos`      | `?completed&priority&search&sortBy&sortDir` | `{todos, count}` |
| GET    | `/api/todos/stats`| —                                 | `{total, completed, pending, byPriority}` |
| GET    | `/api/todos/:id`  | —                                 | `{todo}`              |
| POST   | `/api/todos`      | `{title, description?, priority?, dueDate?}` | `{todo}`   |
| PATCH  | `/api/todos/:id`  | any todo fields                   | `{todo}`              |
| DELETE | `/api/todos/:id`  | —                                 | `{message}`           |
| DELETE | `/api/todos`      | —                                 | Bulk delete completed |

---

## Security Features

- **Password hashing** — bcrypt with cost factor 12
- **JWT expiry** — configurable, default 7 days
- **Rate limiting** — 100 req/15min globally, 20 auth requests/hour
- **Helmet** — sets secure HTTP headers
- **Input validation** — all fields validated/sanitized server-side
- **Authorization** — users can only access their own todos
- **Token blacklisting** — 401 responses auto-clear token client-side

---

## Migrating to a Real Database

The `backend/src/models/index.js` file is the only thing to replace. The routes layer calls `UserModel` and `TodoModel` — swap these with Mongoose documents or Prisma clients without touching any route files.

Example Mongoose migration:
```js
// models/User.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
```

Then in `server.js`, add:
```js
mongoose.connect(process.env.MONGO_URI);
```

---

## Environment Variables

```env
PORT=5000
JWT_SECRET=change_this_to_a_long_random_string_at_least_32_chars
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```
