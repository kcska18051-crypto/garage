# Cookie, Legal Pages and Form Consents Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить глобальный versioned cookie-выбор, пустые юридические страницы и два независимых обязательных согласия во все реально работающие формы обратной связи.

**Architecture:** `CookiePreferenceProvider` владеет только выбором cookie и безопасной работой с localStorage; баннер подключён один раз в `App`. `LegalDocumentPage` обслуживает три явных маршрута. `FormLegalConsents` является контролируемым UI-компонентом, а каждое обращение хранит checkbox локально и не наследует их между формами.

**Tech Stack:** React 19, TypeScript, React Router, Vitest, Testing Library, Playwright, Vite.

## Global Constraints

- Не добавлять реальные трекеры и backend.
- Не считать localStorage доказательством юридического согласия.
- Не смешивать cookie-выбор с согласиями формы.
- Не добавлять согласия в поиск, фильтры и CRUD адресов.
- Сохранить auth, checkout и существующие пользовательские данные.

---

### Task 1: Cookie preference state and global banner

**Files:**
- Create: `prototype/src/state/CookiePreferenceState.tsx`
- Create: `prototype/src/features/cookie/CookieBanner.tsx`
- Create: `prototype/src/features/cookie/CookieBanner.css`
- Create: `prototype/src/features/cookie/CookieBanner.test.tsx`
- Modify: `prototype/src/app/App.tsx`
- Modify: `prototype/src/features/footer/Footer.tsx`

**Interfaces:**
- Produces: `CookieChoice = 'all' | 'necessary'`, `useCookiePreference()` with `choice`, `isOpen`, `choose`, `openSettings`.
- Storage: `garage-cookie-preference` and schema `{version: 1, choice}`.

- [x] Write failing tests for first visit, both choices, reload, failed storage and reopening settings.
- [x] Run `npm test -- --run src/features/cookie/CookieBanner.test.tsx` and confirm failures are caused by missing UI/state.
- [x] Implement the provider, banner, footer trigger and responsive layer rules.
- [x] Re-run the targeted test and confirm it passes.

### Task 2: Legal document routes and footer links

**Files:**
- Create: `prototype/src/pages/LegalDocumentPage.tsx`
- Create: `prototype/src/pages/LegalDocumentPage.css`
- Create: `prototype/src/pages/LegalDocumentPage.test.tsx`
- Modify: `prototype/src/app/routes.tsx`
- Modify: `prototype/src/features/footer/Footer.tsx`

**Interfaces:**
- Produces: routes `/privacy`, `/user-agreement`, `/personal-data-consent`.

- [x] Write failing route/link tests for three H1 values, breadcrumbs and placeholder-only bodies.
- [x] Run the legal page and footer unit tests and confirm the current placeholders fail.
- [x] Implement explicit routes and footer links without legal boilerplate.
- [x] Re-run targeted tests and confirm they pass.

### Task 3: Two independent consents in feedback forms

**Files:**
- Create: `prototype/src/features/forms/FormLegalConsents.tsx`
- Create: `prototype/src/features/forms/FormLegalConsents.css`
- Modify: `prototype/src/features/forms/ContactDialog.tsx`
- Modify: `prototype/src/features/profile/ProfileHelp.tsx`
- Modify: `prototype/src/pages/ContactsPage.test.tsx`
- Modify: `prototype/src/features/home/LowerSections.test.tsx`
- Modify: `prototype/src/features/profile/ProfileSupport.test.tsx`

**Interfaces:**
- Consumes: controlled booleans `personalDataAccepted`, `agreementAccepted` and change callbacks.
- Produces: two accessible checkbox labels, three legal links and independent error messages.

- [x] Write failing tests for 0/1/2 checkbox states in each real form component and link behavior.
- [x] Run only the three relevant unit test files and confirm expected failures.
- [x] Implement the shared controlled component and local per-request state.
- [x] Re-run targeted tests and confirm all modes pass without persisting checkbox state.

### Task 4: Responsive E2E, build and deployment

**Files:**
- Create: `prototype/e2e/legal-consent.spec.ts`
- Modify only if tests expose an in-scope defect.

- [x] Add E2E for direct `/contacts`, both cookie branches, reload/transitions/settings, legal routes, form links, 0/1/2 checkboxes, auth/checkout smoke and widths 1920/1440/1024/390/360.
- [x] Run the new E2E file for desktop/mobile.
- [x] Run targeted unit tests and `npm run build:pages`.
- [ ] Review `git diff --check`, commit, push, wait for Pages and verify the public deployment.
