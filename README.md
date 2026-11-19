# Spendwise — MERN Expense Tracker

Full-stack expense tracker built with React + TypeScript, Express + TypeScript, MongoDB/Mongoose and **first-party JWT authentication only**. No Google API, Google OAuth, Passport or external identity provider is used.

## Features
- Email/password registration and login
- bcrypt password hashing
- JWT stored in an HTTP-only, SameSite=Lax cookie (never localStorage)
- Protected dashboard and expense APIs
- MongoDB expenses with server-side pagination, category filtering and search
- Responsive login, registration and expense dashboard

## Requirements
- Node.js 20+
- MongoDB 6+ (local or Atlas)

## Run locally

### Backend configuration
Copy `backend/.env.example` to `backend/.env` and configure:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/expense_tracker
JWT_SECRET=use-a-cryptographically-random-secret-of-at-least-32-characters
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Generate a strong secret with `openssl rand -base64 48`.

### Start API
```bash
cd backend
npm install
npm run dev
```

### Start React app (second terminal)
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Open `http://localhost:5173`.

## JWT authentication flow
1. User registers or logs in using email and password.
2. Backend validates credentials and verifies the bcrypt password hash.
3. Backend signs a JWT using `JWT_SECRET`.
4. JWT is set as an HTTP-only cookie; browser JavaScript cannot read it.
5. Axios sends API requests with `withCredentials: true`.
6. `requireAuth` verifies the JWT and resolves the user for protected endpoints.
7. Logout clears the cookie.

## API endpoints
| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Sign in and issue JWT cookie |
| POST | `/api/auth/logout` | No | Clear JWT cookie |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/expenses?page=1&limit=8&category=Food&search=lunch` | Yes | Paginated/filterable expenses |
| POST | `/api/expenses` | Yes | Create expense |
| DELETE | `/api/expenses/:id` | Yes | Delete own expense |
| GET | `/api/health` | No | Health check |

## Production security checklist
- Serve frontend/API over HTTPS and set `NODE_ENV=production` so secure cookies are enabled.
- Use a strong private JWT secret and store it in a deployment secret manager. Never commit `.env`.
- Configure exact allowed frontend origins.
- Add CSRF protection for cookie-authenticated state-changing requests; SameSite=Lax and CORS are not a complete CSRF strategy.
- Consider short-lived access tokens and refresh-token rotation/session revocation for production.
- Add email verification, password reset, account lockout policy, audit logs, monitoring, backups and automated tests.
- Restrict MongoDB network access and credentials; enable TLS for remote connections.
- Review and update dependencies regularly.

Passwords are hashed using bcrypt (12 rounds). Expense queries are scoped to the authenticated user's ID.
