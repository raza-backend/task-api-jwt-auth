# Task API — Node.js + TypeScript + JWT Auth

Production-style REST API with access/refresh token authentication, per-user data isolation, input validation and rate limiting.

**Live:** `<LIVE_URL>` · **Health:** `<LIVE_URL>/health`

## Stack
Express 5 · TypeScript · Prisma 6 · PostgreSQL (Neon) · Zod · JWT · bcrypt · Helmet · express-rate-limit

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | – | Create account, returns tokens |
| POST | /api/auth/login | – | Login (rate-limited: 10 / 15 min) |
| POST | /api/auth/refresh | – | Exchange refresh token for new pair |
| GET | /api/auth/me | Bearer | Current user |
| GET | /api/tasks | Bearer | List own tasks (`?status=&page=&limit=`) |
| POST | /api/tasks | Bearer | Create task |
| GET | /api/tasks/:id | Bearer | Get own task |
| PATCH | /api/tasks/:id | Bearer | Update own task |
| DELETE | /api/tasks/:id | Bearer | Delete own task |
| GET | /health | – | Uptime check |

## Auth flow
1. `register` / `login` return a short-lived **access token** (15 min) and a long-lived **refresh token** (7 days), signed with separate secrets.
2. Protected routes expect `Authorization: Bearer <accessToken>`.
3. When the access token expires, call `refresh` to get a new pair.
4. Tasks are scoped to the authenticated user — another user's task returns `404`, not `403`, so resource existence is never leaked.

## Error format
```json
{ "error": "Validation failed", "details": [{ "path": "email", "message": "Invalid email address" }] }
```

## Run locally
```bash
npm install
cp .env.example .env        # fill in values
npx prisma migrate dev
npm run dev
```

## Environment variables
| Name | Purpose |
|---|---|
| DATABASE_URL | Pooled Postgres connection string |
| DIRECT_URL | Direct connection (migrations) |
| JWT_ACCESS_SECRET | 32+ random bytes |
| JWT_REFRESH_SECRET | 32+ random bytes, different from above |
| PORT | Default 3000 |

## Postman
Import `postman/task-api.postman_collection.json`. Login response auto-sets the `accessToken` collection variable.

## Notes
- First request after idle may take 2–4 s (Neon free tier scales to zero).
- bcrypt cost factor 12.