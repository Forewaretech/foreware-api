# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

Express + Prisma backend for the Foreware platform. Serves both the public marketing site (`../foreware`) and the admin dashboard (`../foreware-insights-hub`). All routes are mounted under `/api/*`. CORS is locked to two specific origins (`CLIENT_URL`, `ADMIN_URL`) — adding a third caller means editing `src/config/cors.config.ts`.

## Commands

```bash
npm run dev     # tsx watch src/server.ts — hot-reloads TS directly
npm run build   # tsc → ./dist (entry: dist/server.js)
npm run start   # node dist/server.js
npm run lint    # tsc --noEmit (type-check only; there is no eslint config)
```

**Prisma:**

```bash
npx prisma migrate dev --name <description>   # create + apply a migration
npx prisma migrate deploy                     # apply migrations in prod
npx prisma generate                           # regenerate client (output: src/generated/prisma)
npx tsx prisma/seed.ts                        # seed (also wired via prisma.config.ts)
```

Prisma uses the new `prisma.config.ts` (Prisma 7) — not `package.json#prisma`. The generated client lives in `src/generated/prisma`, **not** `node_modules/@prisma/client`. Imports use `../../generated/prisma/client.js` (see `src/config/db.ts`).

## Required env vars

- `DATABASE_URL` — Postgres connection string. SSL is forced on (`rejectUnauthorized: false`) for Supabase/Render.
- `ACCESS_SECRET`, `REFRESH_SECRET` — JWT signing secrets (must be different).
- `ADMIN_URL`, `CLIENT_URL` — exact origins allowed by CORS.
- `ADMIN_EMAIL`, `ADMIN_DEFAULT_PASS` — consumed by `prisma/seed.ts` to upsert the initial `SUPER_ADMIN`.
- `PORT` (default `3030`), `HOST` (default `http://localhost`), `NODE_ENV`.
- AWS creds for `@aws-sdk/client-s3` (see `src/config/aws.config.ts`).

## Architecture

**Stack:** Express 5, TypeScript ESM (`"type": "module"`), Prisma 7 with `@prisma/adapter-pg` over a `pg.Pool`, JWT (cookie + Bearer), Zod 4 validation, bcrypt, Multer-less S3 uploads via presigned URLs, Nodemailer.

**ESM gotcha:** `tsconfig.json` uses `module: nodenext` + `verbatimModuleSyntax: true`. **Relative imports MUST end in `.js`** even when importing a `.ts` source file (e.g. `import app from "./app.js"`). Type-only imports must use `import type`. `tsx` and Node both enforce this.

**Feature-based layout** under `src/features/<name>/`:
```
<name>.routes.ts       — Express Router; mounted in src/app.ts
<name>.controller.ts   — req/res handlers; throw AppError, never res.status(500)
<name>.service.ts      — business logic; talks to prisma
<name>.validation.ts   — Zod schemas (or validators/ subfolder for auth)
```
Current features: `auth`, `users`, `blog` (posts), `form`, `submission`, `lead`, `tracking`, `storage` (S3), `activity`, `contact`, `emailto`, `emailService`, `dashboard`. To add a new resource, create the folder, export a `Router`, and mount it in `src/app.ts` under `/api/<resource>`.

**Auth flow** (`src/features/auth/`):
- Login issues an **access token** (15 min, see `constants.ts`) and **refresh token** (7 day cookie age, but `REFRESH_EXPIRES_IN` JWT TTL is currently set to `15m` — known mismatch in `constants.ts`).
- Both go out as **httpOnly cookies** (`accessToken`, `refreshToken`) via `configureCookieOptions`. In production: `secure: true`, `sameSite: "none"` (required because Vercel client → Render API is cross-site).
- The refresh token is stored **sha256-hashed** in the `RefreshToken` table; rotation deletes prior tokens for the user (`saveRefreshToken` in `jwt.service.ts`).
- `authenticate` middleware (`src/middlewares/authenticate.middleware.ts`) reads `req.cookies.accessToken` first, then falls back to `Authorization: Bearer ...`. It attaches `req.user = { id }` — typed via `src/@types/express/`.

**Errors:** Throw `AppError(message, statusCode)` from `src/utils/AppError.ts` anywhere in services/controllers. The terminal `errorHandler` middleware (`src/middlewares/error.middleware.ts`) is registered last in `src/app.ts` and converts these into `{ status, message }` JSON. Stack traces only leak when `NODE_ENV === "development"`.

**Validation:** Wrap routes with `validate(schema)` from `src/middlewares/validate.middleware.ts`. The schema receives `{ body, query, params }`, so Zod schemas must mirror that shape (see `auth.controller` callers / existing validators).

**Database access:** Always import `prisma` from `src/config/db.ts` — it's the single shared `PrismaClient` wired through `PrismaPg(pool)`. Don't `new PrismaClient()` elsewhere; the pool is sized at 10 connections and tuned for Render/Supabase.

**Response shape:** Successful endpoints return `{ success: true, data: ... }`. The frontend `createResourceApi` factory (in both client apps) depends on this — breaking it breaks every consumer.

## Conventions worth respecting

- Add new migrations with `prisma migrate dev`; never edit applied SQL files in `prisma/migrations/`.
- Keep controllers thin — push DB / business work into `*.service.ts`. `auth.service.ts` is the canonical example.
- Activity logging: when a sensitive action succeeds (password reset, etc.), call `logActivity({ action, detail, metadata, userId })` from `features/activity/activity.service.ts`.
- The Prisma schema uses Postgres-native arrays (`String[]`) for `Form.targetEmails` / `assignedPages` — keep this in mind if you ever swap providers.
