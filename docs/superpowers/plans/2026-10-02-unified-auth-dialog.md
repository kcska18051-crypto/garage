# Unified Auth Dialog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one accessible adaptive modal for login, registration, company onboarding, and password recovery while preserving the source page.

**Architecture:** Add an application-level auth context that owns opening, closing, focus restoration, and success feedback. Keep the auth flow state inside a focused dialog component; use route bridges for legacy direct URLs and local-only demo validation for SMS/password fields.

**Tech Stack:** React, TypeScript, React Router, Vitest, Testing Library, Playwright, CSS.

**Spec:** `docs/superpowers/specs/2026-10-02-unified-auth-dialog-design.md`

## Global Constraints

- No real SMS, backend, password persistence, logs, or external organization lookup.
- Preserve the current visual system and current page/checkout URL after successful auth.
- Codes: `1234` succeeds, `0000` expires, other values fail.
- Direct `/profile/auth` and `/profile/recovery` must open the modal without dead ends.
- Desktop and mobile must support keyboard focus, closing, scrolling, and focus return.

## Review Focus

- Password values must never reach storage or URL.
- Reopening the dialog must not expose a previous secret.
- Existing-phone registration must not continue as a new account.
- Route bridges must not loop when replacing the direct route.
- Focus restoration must tolerate an opener removed during navigation.

---

### Task 1: Auth state and modal journeys

**Files:**
- Create: `prototype/src/state/AuthState.tsx`
- Create: `prototype/src/features/auth/AuthDialog.tsx`
- Create: `prototype/src/features/auth/AuthDialog.test.tsx`
- Create: `prototype/src/features/auth/AuthDialog.css`
- Modify: `prototype/src/app/App.tsx`

**Interfaces:**
- Produces: `useAuth(): { openAuth(options?), closeAuth(), isOpen, status }`.
- Consumes: React Router navigation for Help only.

- [x] Write failing tests for SMS/password login, registration, company INN, existing phone, both forgot-password branches, errors, resend, back-state, secret cleanup, and dialog focus.
- [x] Run the focused test and confirm failures are caused by the missing provider/dialog.
- [x] Implement the provider, state machine, validation, timer, focus trap, and responsive styling.
- [x] Run the focused test and confirm all journeys pass.

### Task 2: Entry points and route bridges

**Files:**
- Modify: `prototype/src/features/header/DesktopHeader.tsx`
- Modify: `prototype/src/features/header/MobileBottomNav.tsx`
- Modify: `prototype/src/features/profile/ProfileShell.tsx`
- Modify: `prototype/src/pages/CheckoutPages.tsx`
- Modify: `prototype/src/app/routes.tsx`
- Modify: `prototype/src/pages/ProfilePages.tsx`
- Modify: corresponding header/profile/checkout tests.

**Interfaces:**
- Consumes: `useAuth().openAuth`.
- Produces: header, mobile nav, profile, checkout and direct-route entry points.

- [x] Write failing integration tests for each entry point and route bridge.
- [x] Replace legacy navigation with modal triggers and add route bridge components.
- [x] Verify success closes the dialog without changing the source route.

### Task 3: Documentation, E2E, build and publication

**Files:**
- Modify: `docs/superpowers/specs/2026-09-17-profile-prototype-design.md`
- Modify: `docs/superpowers/specs/2026-10-01-profile-support-design.md`
- Modify: `prototype/e2e/profile.spec.ts`

- [x] Update requirements to describe both login methods and required backend security support.
- [x] Add desktop/mobile E2E coverage for the modal journeys and preserved checkout URL.
- [x] Run auth/profile/checkout tests, production build, and relevant Playwright scenarios.
- [ ] Review diff, commit, push, wait for Pages, and verify the public URL.
