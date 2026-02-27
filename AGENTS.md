# Repository Guidelines

## Project Structure & Module Organization
- `pages/` for Next.js routes and page components.
- `components/` for reusable UI parts; `lib/` for shared utilities and data access.
- `styles/` and `public/` for global styles and static assets.
- `prisma/` for the Prisma schema and DB tooling.
- `data/`, `blog/`, `docs/` for site content and supporting files; `scripts/` for batch jobs.

## Build, Test, and Development Commands
- `npm run dev` local dev server with hot reload.
- `npm run build` runs `prisma generate` then builds.
- `npm run start` serves the production build locally.
- `npm run lint` runs Next.js ESLint checks.
- `npm run migrate:deploy` applies Prisma migrations.
- `make up` / `make down` controls Docker compose.
- `make psql` opens Postgres using `.env.local`.

## Coding Style & Naming Conventions
- TypeScript + React (Next.js 13.4).
- `PascalCase` for React components, `camelCase` for functions/vars.
- Prefer small components in `components/` and shared helpers in `lib/`.
- Run `npm run lint` before PRs.

## Testing Guidelines
- No dedicated test framework is configured.
- If you add tests, keep them close to targets (e.g., `__tests__/` or `*.test.ts`) and document how to run them here.

## Content & Community Focus
- This is an information site about theater and plays; it does not host or publish full scripts.
- The product goal is active comments and performance reports. Favor changes that improve posting UX, safety, and moderation readiness.

## Commit & Pull Request Guidelines
- History mixes Japanese and English summaries (e.g., `記事追加: ...`, `feat: ...`, `fix: ...`, `perf: ...`).
- Keep messages short and action-oriented; add a prefix when helpful.
- PRs should include a concise description, the reason for the change, and screenshots for UI changes.
- Link related issues or tasks when applicable.

## Configuration & Data Notes
- Prisma schema lives at `prisma/schema.prisma`; run `npm run migrate:deploy` for production migration.
- Environment-specific settings are expected via `.env.local` and `.env.production` (used by Make targets).
