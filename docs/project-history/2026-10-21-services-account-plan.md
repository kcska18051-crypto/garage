# Services Account Implementation Plan

> Исполнение в текущем изолированном worktree; согласованный сценарий реализуется без повторного вопроса о том же scope. Для auth — независимый агент по контракту; одна общая публикация после интеграции. Используются executing-plans/TDD и финальный read-only review.

**Goal:** Форма услуг→локальная заявка→единый ЛК с телефонной демо-identity и устойчивой историей.
**Architecture:** ProfileState владеет массивом; отдельный pure serviceRequests store валидирует/пишет записи. AuthState сообщает identity, существующий AuthDialog подтверждает телефон. Services success/list/detail используют одну запись. Статический query-detail entry для Pages.
**Tech Stack:** React/TypeScript/React Router/localStorage/sessionStorage/Vitest/Playwright, без новых dependencies.
**Spec:** [ТЗ](2026-10-21-services-account-spec.md).

## Global constraints

Только локальная демонстрация; фото/base64 не сохранять; другие заявки/PII гостю не раскрывать; корзину и меню не менять; обычный вход/выход сохраняет прежний UX. Проверка телефона — не безопасный реальный auth.

## Review focus

1. Password-demo не присваивает гостевые записи без кода.
2. Владелец записи не меняется из-за контактного телефона или входа другого номера.
3. Quota/corruptJSON: нет ложного успеха/перезаписи истории; doubleclick не дублирует.
4. Logout/прямой URL/другой профиль не раскрывают контакт/детали.
5. Query-detail даёт HTTP200 после refresh для произвольногоID; фото disclaimer честен.

## Task1 — auth identity (агент)

Files: AuthState.tsx/AuthDialog.tsx, utils/phoneIdentity.ts, релевантные auth tests. Контракт: `AuthIdentity={phone:string;phoneConfirmed:boolean}`; `useAuth().identity:AuthIdentity|null`; `openAuth(intent?,{returnTo?,requirePhoneConfirmation?})`; `completeAuth(message,identity?)`. Legacyactive/password-demo identity79000000000/false; SMS/registration/recoverycode identity normalized/true. Session reload и logout чистят/восстанавливают единое состояние. Forced confirmation оставляет SMS без password-bypass. Остальные компоненты не менять.

- [ ] RED→GREEN tests identity/default/forceSMS/returnTo/reload/logout; existing auth tests.
- [ ] Возврат отчёта без отдельного release.

## Task2 — общий store/ProfileState

Files: state/serviceRequests.ts/tests, ProfileState.tsx, serviceTypes при необходимости.
Interfaces: `createServiceRequest(input,ownerPhone):{ok:true;record}|{ok:false;error}`; `claimServiceRequests(identity)`; `serviceRequests`/storagewarning в useProfile. Поля из ТЗ, submissionId обязателен для idempotency; только разрешённые поля сериализуются, defaults из старыхprofileData.serviceRequests. Store не зависит от React или auth UI.

- [ ] RED→GREEN stable IDs/dedupe/reload/owner/claim/denial/quota/corrupt/fieldlimits.
- [ ] Persist-before-success, ref защищает двойную отправку; использовать существующий ProfileProvider.

## Task3 — UI integration

Files: ServiceRequestDialog +tests/CSS; новый features/profile/ProfileServiceRequests.tsx/CSS/tests; убрать старую дублирующую историю ProfileSections; ProfilePages wrapper/routes/publicRoutes/ProfileShell/App identity sync.

- [ ] RED→GREEN формы создают запись и CTA; guest CTA закрывает одну модалку до auth, сохраняет exact returnTo, без вложенных overlays.
- [ ] Единый список и query-detail с безопасным denial/unknown, fields/исторические статусы/timeline; никакого согласования менеджером.
- [ ] Фото onlyflag+explicittext, storage errors retaininputs, а11y/focus/mobile safearea.
- [ ] Обновить старые тесты/дисклеймеры по новой спецификации, не ослаблять поведение.

## Task4 — acceptance/release

- [ ] E2E3forms/reload/list/detail; matching/mismatch/forcedSMS/logout;doubleclick/storageerror;360/390/1440/1920/screenshots.
- [ ] Read-only review, исправления важного с RED→GREEN, fullsuite CI/build/publicHTTP/reload/flow.
- [ ] Один code release, отчёт/links/SHA, browserclose; независимая приёмка отдельно.

## Progress ledger

Старт24dda82; worktree чистый. Предварительные интерфейсы сверены: Task1 identity→Task2 claim и Task3 guards; Task2 record→Task3success/list/detail; Task3queryroute→Task4manifest HTTP. Противоречий нет. Фото сознательно только ephemeral+flag по разрешённому варианту ТЗ; query-detail нужен из-за статического Pages, не отдельный backend.
