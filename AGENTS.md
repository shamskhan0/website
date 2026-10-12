# AGENTS.md — working notes for this repo in the Base44 sandbox

## What this app is
Frontend-only **Vite + React 19 SPA** (`src/`, entry `index.html` → `src/main.tsx`).
There is **no server, API, or database of its own** in the repo — no backend service is needed in compose.

## How it runs here
`docker-compose.base44.yml` starts a single `web` service:
`node:22-bookworm-slim`, repo bind-mounted at `/app`, running
`npm ci --no-audit --no-fund --prefer-offline && npm run dev -- --host 0.0.0.0 --port 3000`.
Host port **3000** is the web entry point (`http://localhost:3000/`).

- Source is served live by the Vite dev server (look for `/@vite/client` and unhashed `/src/*.tsx` module
  requests). If port 3000 ever serves a bundled/hashed build, the edit loop is broken.
- Preview host allowlisting is handled by the platform-provided
  `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`, passed through as a bare compose `environment:` entry —
  no Vite config change is required.
- No sandbox-only source override exists yet; the bind address comes from CLI flags, not config.

## External services (all optional at runtime)
Cloud features are configured through `VITE_*` variables:
- **Firebase** (`src/firebase.ts`) — admin login (`signInWithEmailAndPassword`), Firestore content
  (`cloud_data` collection) and Storage uploads (images + APK). Needs all six
  `VITE_FIREBASE_*` values; `firebaseEnabled` is false if any is missing (or the placeholder was rejected).
- **Supabase** — public image storage and shared content sync. Needs `VITE_SUPABASE_URL` +
  `VITE_SUPABASE_PUBLISHABLE_KEY` (+ optional `VITE_SUPABASE_STORAGE_BUCKET`, default `media`).
  Only the publishable/anon key belongs in frontend env — never a `service_role` secret.

Without any of them the app still boots and the whole public site works from `src/data.ts` defaults plus
localStorage persistence. What does **not** work without credentials: admin panel login, cloud content
sync, image/APK uploads.

Credentials are delivered by the platform to `/run/base44/app.env`, listed as the **last**
`env_file:` entry in compose. Never move these keys under compose `environment:` — that would permanently
outrank a value the user sets later in the dashboard. Vite picks `VITE_*` values up from the process
environment (verified), so no repo-root `.env` is needed.

## Verifying the app works
- `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/` → `200`
- `docker compose -f docker-compose.base44.yml logs --tail 30 web` → `VITE v8.2.2 ready`
- Home route renders the hero (`h1` = "Roshan Digital."), feature/news/FAQ sections, and the footer.
  Expected clean console (no errors) and no failed network requests when cloud config is absent.

## Non-obvious details
- The admin panel is **state-based, not a URL route**: it opens from the footer's admin link
  (`onOpenAdmin` in `src/App.tsx`). Reaching the dashboard requires a valid Firebase admin account, so it
  cannot be exercised end-to-end without the user's Firebase credentials.
- Legal pages `/privacy` and `/terms` are static files in `public/`; `vite.config.ts` injects
  Supabase env values with `define`, so restart the `web` service after changing them (`npm run dev` reads
  env at startup — Vite HMR does not re-read env for already-defined values).
- `.env.vercel.example` documents the browser-safe Supabase keys used by the Vercel deployment; the repo
  itself intentionally ships no `.env`.
