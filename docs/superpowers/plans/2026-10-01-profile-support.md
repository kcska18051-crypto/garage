# Profile Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add working Documents, Help, Recovery, and shared Address management to the account prototype.

**Architecture:** Hoist `ProfileProvider` to the app provider tree, implement four focused profile components, and let checkout consume shared addresses. Existing Profile CSS and dialog patterns remain the visual base.

**Tech Stack:** React 19, TypeScript, React Router, Vitest/Testing Library, Playwright, CSS.

**Spec:** `docs/superpowers/specs/2026-10-01-profile-support-design.md`

## Global Constraints

- Demonstration data only; no claim of backend integrations.
- No document-level overflow at 1440, 1024, 390, or 360 px.
- Public recovery must not require the account shell.
- Saved addresses must be the single source used by account and checkout.
- All production behavior is introduced test-first.

## Review Focus

- Empty document filters render a purposeful state and preserve controls.
- Form validation focuses actionable errors without false success.
- Deleting or changing a primary address always leaves one valid primary.
- Checkout never retains a removed saved address as its selected value.
- Mobile dialogs and CTAs remain above the bottom navigation.

---

### Task 1: Routes, navigation, and shared profile state

**Files:** Modify `prototype/src/app/App.tsx`, `prototype/src/app/routes.tsx`, `prototype/src/features/profile/ProfileShell.tsx`, `prototype/src/pages/ProfilePages.tsx`, `prototype/src/state/ProfileState.tsx`; test `prototype/src/pages/ProfilePages.test.tsx`.

- [ ] Write failing route/navigation tests for Documents, Help, Addresses, and public Recovery.
- [ ] Hoist `ProfileProvider`, add route exports, and add account menu links.
- [ ] Run route tests and commit-ready verification.

### Task 2: Documents and Help

**Files:** Create `prototype/src/features/profile/ProfileDocuments.tsx`, `prototype/src/features/profile/ProfileHelp.tsx`, `prototype/src/data/profileSupportData.ts`; modify `prototype/src/features/profile/Profile.css`; create focused tests.

- [ ] Write failing tests for filters, preview, unavailable downloads, help search/accordion, and request validation/success.
- [ ] Implement compact interactive pages with demo states.
- [ ] Run focused tests.

### Task 3: Recovery

**Files:** Create `prototype/src/features/profile/ProfileRecovery.tsx`; modify `prototype/src/features/profile/ProfileAuth.tsx`; create recovery tests.

- [ ] Write failing tests for direct entry, neutral unknown-number state, invalid/expired/success codes, resend, and help fallback.
- [ ] Implement the phone-based recovery flow and auth entry point.
- [ ] Run focused tests.

### Task 4: Address CRUD and checkout synchronization

**Files:** Create `prototype/src/features/profile/ProfileAddresses.tsx`; modify `prototype/src/state/ProfileState.tsx`, `prototype/src/features/profile/ProfileSections.tsx`, `prototype/src/pages/CheckoutPages.tsx`, and CSS; create address and checkout tests.

- [ ] Write failing tests for add/edit/delete/primary/map/validation and checkout address synchronization.
- [ ] Implement structured shared address state and checkout selection.
- [ ] Run focused tests.

### Task 5: E2E, responsive review, and publication

**Files:** Modify `prototype/e2e/profile.spec.ts` and `prototype/e2e/commerce-search.spec.ts`.

- [ ] Add desktop/mobile journeys and overflow assertions.
- [ ] Run unit, E2E, and build.
- [ ] Inspect desktop/mobile visually, commit, push, wait for Pages, and verify direct public URLs.
