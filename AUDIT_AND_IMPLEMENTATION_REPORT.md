# Roshan Digital Website Audit & Implementation Report

Date: 2026-09-09

## Executive summary

The Vite/React application builds successfully. The highest-risk findings were client-bundled Supabase credentials, hardcoded client-side admin credential hashes, and documentation that described unauthenticated write policies as acceptable. This pass removes source fallbacks, preserves environment-only configuration, improves cloud cache invalidation, and converts the FAQ interaction to an accessible keyboard-friendly button pattern.

## Implemented findings

| Severity | Finding | Root cause | Affected files | Fix | Verification |
|---|---|---|---|---|---|
| Critical | Supabase project URL and publishable key were hardcoded in source | Production configuration was embedded as a fallback | `src/supabase.ts` | Reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`/`VITE_SUPABASE_ANON_KEY` only; missing configuration disables the client | TypeScript/build passed; source fallback removed |
| High | Admin hashes had hardcoded fallback values | Client-only authentication had usable credentials even without deployment configuration | `src/admin/auth.ts` | Empty environment defaults now fail closed instead of shipping credentials | TypeScript/build passed; no literal hash fallback remains |
| High | Cloud sync comments endorsed public writes | RLS model was documented with `using (true)` insert/update policies | `src/cloudSync.ts` | Documentation now requires authenticated, authorized write policies and warns that the publishable browser client cannot bypass RLS | Live policy verification remains external/manual |
| Medium | Freshly published data could remain in the in-memory batch cache | Successful writes did not invalidate the request cache | `src/cloudSync.ts` | Clears `queryCache` after successful settings/data writes | TypeScript/build passed |
| Medium | FAQ questions were clickable non-semantic containers | Interaction relied on `div` click handlers without expanded state | `src/App.tsx`, `src/App.css` | Uses real buttons with `aria-expanded`, `aria-controls`, keyboard support, and button styling | TypeScript/build passed |

## Build observations

- `npm run build`: passed.
- Vite output: 91 modules transformed.
- Largest gzip output: admin panel JavaScript, approximately 74.35 kB gzip.
- Main CSS output: approximately 13.27 kB gzip.
- The existing admin bundle is lazy-loaded, limiting initial public-page cost.

## Remaining security and operational follow-ups

1. Configure `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (or the legacy anon key), `VITE_ADMIN_EMAIL_HASH`, and `VITE_ADMIN_PASSWORD_HASH` in the deployment environment. Do not place them in source control.
2. Replace the client-side hash gate with Supabase Auth plus a server-enforced admin role before treating the admin portal as production-secure. Client-side hashes and localStorage sessions are not sufficient authorization boundaries.
3. In Supabase, enable RLS on `cloud_data` and storage objects. Allow public `SELECT` only where intended; restrict insert/update/delete to authenticated, authorized admins. Never use `using (true)` for writes.
4. Verify the `media` bucket read/upload/delete policies, allowed MIME types, and APK size limits in the connected Supabase project.
5. Run browser smoke tests against the deployed environment for public home, legal routes, direct refresh, admin entry, media upload, APK download, and mobile layout. The static build cannot verify remote RLS, storage, or deployment environment behavior.
6. Review CSP/security headers at the hosting layer for this Vite deployment and add a restrictive policy only after confirming the Supabase and storage origins that must remain reachable.

## Limitations

No live database policy mutation was performed because the repository is a static client application and the source does not establish a verified admin authorization model. The application now fails closed when required public configuration is absent, but authenticated write protection must be completed in Supabase and exercised through the runtime.

## Verification status

Completed: source audit, targeted hardening, TypeScript compilation, production Vite build.

Pending: live Supabase RLS/storage verification and real-browser smoke tests against the deployed environment.

## Files changed

- `src/supabase.ts`
- `src/admin/auth.ts`
- `src/cloudSync.ts`
- `src/App.tsx`
- `src/App.css`
- `AUDIT_AND_IMPLEMENTATION_REPORT.md`

This report intentionally distinguishes local build verification from external production checks.
