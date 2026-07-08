# SyncSpace

A collaborative workspace for teams to manage projects and tasks efficiently.

SyncSpace is a MERN stack application that lets small teams create a shared workspace, organize their work into projects, and track tasks on a Kanban-style board — without the clutter of a heavyweight project management tool.

Built as a full-stack learning project to practice real-world patterns: JWT authentication, protected routes, Mongoose relationships, and a component-based React frontend.

---

## Overview

SyncSpace is built around a simple flow:

1. **Sign up** and create your account.
2. **Create a team** (or join one with an invite code).
3. **Create a project** under that team.
4. **Add tasks** to the project and move them across a Todo → In Progress → Done board.

Everything in the app is scoped to teams — you only ever see the teams, projects, and tasks you actually belong to.

---

## Features

### Authentication
- Register and log in with email + password
- Passwords hashed with bcrypt
- JWT-based session, stored on the client and sent on every request
- Protected routes on both the frontend (route guards) and backend (middleware)

### Teams
- Create a team and become its owner
- Auto-generated, unique invite code for each team
- Join an existing team using an invite code
- View team members
- Leave a team (team owners cannot leave their own team)

### Projects
- Create a project under any team you belong to
- Track a start date and a deadline
- See who created the project and which team it belongs to

### Tasks
- Create, edit, and delete tasks under a project
- Assign a task to any member of the project's team
- Set a priority (Low / Medium / High) and an optional due date
- Drag and drop tasks across a Kanban board with three fixed statuses: **Todo**, **In Progress**, **Done**

### Dashboard
- Welcome banner with the signed-in user's name
- Stat cards for total teams, total projects, total tasks, and completed tasks
- Quick actions to create a team, create a project, or join a team
- A simple recent activity feed of recently created tasks

---

## Tech Stack

**Frontend:** React (Vite), React Router DOM, Axios, Context API, React Hot Toast, React Icons, plain modular CSS

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, express-validator

**Database:** MongoDB Atlas

---

## Folder Structure

```
SyncSpace/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── api/             # Axios instance + interceptors
│   │   ├── components/      # Reusable UI components (common, team, project, task)
│   │   ├── context/         # AuthContext
│   │   ├── hooks/           # Custom data-fetching hooks
│   │   ├── layouts/         # DashboardLayout (sidebar + navbar)
│   │   ├── pages/           # Route-level pages
│   │   ├── routes/          # AppRoutes, ProtectedRoute
│   │   ├── services/        # API service functions per resource
│   │   └── styles/          # Modular CSS files
│   └── ...
│
├── server/                  # Express + MongoDB backend
│   ├── config/               # DB connection
│   ├── controllers/          # Route handlers
│   ├── middleware/           # Auth + error handling
│   ├── models/                # Mongoose schemas
│   ├── routes/                # Express routers
│   ├── validators/            # express-validator rules
│   ├── utils/                 # Invite code generator
│   └── server.js
│
├── package.json              # Root convenience scripts
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (or a local MongoDB instance)

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/syncspace.git
cd syncspace
npm run install:all
```

This installs dependencies for both `client/` and `server/`.

### 2. Configure environment variables

**server/.env** (copy from `server/.env.example`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/syncspace
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

**client/.env** (copy from `client/.env.example`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run the app

From the project root, run both servers together:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1
npm run server     # http://localhost:5000

# Terminal 2
npm run client      # http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## Environment Variables Reference

| Variable | Location | Description |
|---|---|---|
| `PORT` | server | Port the Express API runs on |
| `NODE_ENV` | server | `development` or `production` |
| `MONGO_URI` | server | MongoDB Atlas connection string |
| `JWT_SECRET` | server | Secret used to sign JWTs |
| `JWT_EXPIRE` | server | Token expiry, e.g. `7d` |
| `CLIENT_URL` | server | Frontend origin, used for CORS |
| `VITE_API_BASE_URL` | client | Base URL of the backend API |

---

## API Overview

All routes except register/login require an `Authorization: Bearer <token>` header.

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET | `/api/auth/me` | Get the current logged-in user |

### Teams
| Method | Route | Description |
|---|---|---|
| GET | `/api/teams` | Get all teams the user belongs to |
| POST | `/api/teams` | Create a new team |
| POST | `/api/teams/join` | Join a team via invite code |
| GET | `/api/teams/:id` | Get a single team's details |
| DELETE | `/api/teams/:id/leave` | Leave a team |

### Projects
| Method | Route | Description |
|---|---|---|
| GET | `/api/projects` | Get projects (optionally `?team=<teamId>`) |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects/:id` | Get a single project's details |

### Tasks
| Method | Route | Description |
|---|---|---|
| GET | `/api/tasks?project=<projectId>` | Get tasks for a project |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update task details |
| PUT | `/api/tasks/:id/status` | Update only a task's status (Kanban drag) |
| DELETE | `/api/tasks/:id` | Delete a task |

All responses follow the same shape:

```json
{
  "success": true,
  "message": "Optional message",
  "data": { }
}
```

---

## Screenshots

> _Add screenshots of the Dashboard, Kanban board, and Team page here before publishing the repo._

- `docs/screenshot-dashboard.png`
- `docs/screenshot-board.png`
- `docs/screenshot-teams.png`

---

## Deployment

### Backend (Render)
1. Push the repo to GitHub.
2. Create a new **Web Service** on Render, pointing at the `server/` directory.
3. Set the build command to `npm install` and the start command to `npm start`.
4. Add the environment variables from `server/.env.example` in the Render dashboard.

### Frontend (Vercel)
1. Import the repo into Vercel and set the root directory to `client/`.
2. Set the `VITE_API_BASE_URL` environment variable to your deployed Render API URL.
3. Deploy — Vercel will detect the Vite build automatically.

Remember to update `CLIENT_URL` on the backend to your deployed Vercel URL so CORS keeps working.

---

## Future Improvements

- Real-time updates with Socket.io (so a teammate moving a task shows up live)
- Comments and activity history on individual tasks
- Email notifications when a task is assigned
- File attachments on tasks
- Role-based permissions beyond "owner" vs "member"
- Dark mode

---

## License

This project was built for learning purposes and is free to use as a reference or a starting point for your own projects.
