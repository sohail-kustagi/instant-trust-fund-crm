# 🚀 Instant Trust Fund CRM — Vercel Demo Deployment Plan

This document tracks the execution phases for preparing the frontend UI/UX of **Instant Trust Fund CRM** for client presentation and deployment to Vercel.

---

## 🎯 Primary Goal
Deliver a showcase-grade, production-quality frontend demo deployed on Vercel where the client and stakeholders can navigate, interact with, and evaluate every UI/UX component, portal, and user journey across the CRM without encountering missing backend dependencies, auth roadblocks, or empty placeholder screens.

---

## 📅 Execution Roadmap

### [x] Phase 1: File Structure & Repository Clean-Up
- [x] Create `server/data/imports/` and relocate root `.xlsx` spreadsheets (`NAZNEEN_BANU_OLD.xlsx`, `PRAVEEN.xlsx`, `SEVAKK_DATA_ENTRY.xlsx`, `eabfa07b-f885-4158-8227-c682e1fd71d7.xlsx`).
- [x] Update `server/scripts/importCustomers.ts` paths for backward compatibility.
- [x] Delete loose customer PDFs (`9729582924.pdf`, `Faheem Airtel 2.pdf`, `Vidya 9844847836.pdf`) and `dist.zip`.
- [x] Delete `src/components/instant-trust-funds-main.code-workspace`.
- [x] Resolve `PropertyMap.jsx` vs `PropertyMap.tsx` duplication (standardized on typed SSR-safe `PropertyMap.tsx`).
- [x] Untrack `.env` from git tracking and harden `.gitignore`.

### [x] Phase 2: Route Protection & Type Safety Fixes
- [x] Fix `input-otp.tsx` (`hasCaret` -> `hasFakeCaret`).
- [x] Fix loader typing in `insurance.$slug.tsx` & `loans.$slug.tsx`.
- [x] Expand public routes in `src/routes/__root.tsx` (`/loans`, `/insurance`, `/cibil`, `/policybazaar`, `/properties`).
- [x] Support client demo session detection in `__root.tsx`.
- [x] Verify `npx tsc --noEmit` passes with 0 errors across the entire repository.

### [x] Phase 3: Client Demo Mode & Mock Data Layer
- [x] Create `src/lib/demo-data.ts` containing realistic data for all portals (Admin, Assistant, Customer, Products, CIBIL, Properties).
- [x] Enhance `src/lib/api.ts` with transparent mock fallback when backend is unreachable or demo mode is active.
- [x] Enhance `src/hooks/useAuth.tsx` with `loginAsDemo()` and `localStorage` session persistence.
- [x] Add 1-Click Demo Login options on `/login`, `/admin/login`, and `/assistant/login`.
- [x] Add interactive `DemoSwitcher` floating bar for effortless role switching during client walkthroughs.

### [x] Phase 4: Elevate Under-Populated UI Pages
- [x] Elevate `/admin/analytics` with `DashboardCharts` (Recharts) and KPI metrics.
- [x] Elevate `/admin/tasks` with operational task cards, priorities, and status filters.
- [x] Elevate `/admin/notifications` with real-time alert feed.
- [x] Elevate `/admin/referrals` with partner metrics, commission tiers, and payout logs.
- [x] Elevate `/properties` with verified real estate listing cards and location badges.

### [x] Phase 5: Vercel Configuration & Build Verification
- [x] Create `vercel.json` with build settings and routing config.
- [x] Add `"build:vercel"` and `"typecheck"` scripts in `package.json`.
- [x] Build with `NITRO_PRESET=vercel` and verify `.vercel/output` conforms to Vercel Build Output API v3.

### [x] Phase 6: Automated Testing & Verification
- [x] Ran full typecheck (`npx tsc --noEmit` -> 0 errors).
- [x] Ran SSR build & test server.
- [x] Curled all 18+ routes verifying HTTP 200 on all public product pages and clean redirects on protected routes.
- [x] Validated `.vercel/output` prebuilt deployment readiness (`npx nitro deploy --prebuilt` / Vercel CLI).
