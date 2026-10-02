# Demo Password Entry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Разрешить явно обозначенный вход в демонстрационный личный кабинет по пустой password-форме, не меняя остальные способы авторизации.

**Architecture:** Экспортируем один флаг `DEMO_PASSWORD_ENTRY_ENABLED` из отдельного auth-конфига. `AuthDialog` использует его только в password-ветке и завершает вход через существующий `onComplete`, сохраняя маршрутизацию `returnTo`.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, Playwright.

## Global Constraints

- Не хранить телефон или пароль.
- Не менять SMS, регистрацию и восстановление.
- Не подключать backend.
- Сохранить возврат в `/profile` и checkout.

---

### Task 1: Тест и реализация demo-входа

**Files:**
- Create: `prototype/src/features/auth/authDemoConfig.ts`
- Modify: `prototype/src/features/auth/AuthDialog.tsx`
- Modify: `prototype/src/features/auth/AuthDialog.test.tsx`
- Modify: `prototype/e2e/profile.spec.ts`

**Interfaces:**
- Produces: `DEMO_PASSWORD_ENTRY_ENABLED: boolean`
- Consumes: существующий `onComplete(message: string): void`

- [x] **Step 1: Write failing tests** — проверить подсказку, пустой вход в `/profile` и возврат в checkout.
- [x] **Step 2: Verify RED** — запустить только `AuthDialog.test.tsx` и профильные E2E-тесты; ожидать отказ текущей обязательной валидации.
- [x] **Step 3: Implement minimal behavior** — добавить флаг, подсказку и условную password-ветку без валидации.
- [x] **Step 4: Verify GREEN** — повторить точечные unit/E2E проверки на desktop/mobile.
- [ ] **Step 5: Review, build, commit and publish** — проверить diff, собрать Pages, отправить ветку и проверить публичный сценарий.
