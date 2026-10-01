# Profile Support Design

## Goal

Extend the existing account prototype with real Documents, Help, Recovery, and Addresses journeys while preserving the current neutral visual system and keeping saved addresses synchronized with checkout.

## Architecture

`ProfileProvider` moves from `ProfileShell` to the application provider tree, inside `CommerceProvider`. Profile-only state remains in `ProfileState`, while checkout reads the same address collection through `useProfile`. This avoids a second address store and preserves state across account and checkout routes.

Focused components own each journey: `ProfileDocuments`, `ProfileHelp`, `ProfileRecovery`, and `ProfileAddresses`. Auth and recovery are public profile routes outside the authenticated shell; documents, help, and addresses render inside `ProfileShell`. `/profile/data` links to address management instead of duplicating CRUD.

## Documents

The page provides account-shell navigation, tabs, organization/type/period filters, number search, compact document rows, status-aware actions, preview dialog, simulated preparation feedback, and filter empty state. Demonstration data contains no real client requisites.

## Help and recovery

Help uses category navigation, searchable accordions, quick actions, and a validated request form. Successful submission produces a demonstration request number and links to `/profile/services`. Recovery reuses the established demo codes: `1234` succeeds, `0000` expires, other codes fail; resend resets the code and timer message. The unknown-number message does not reveal account existence, and loss of phone access routes to Help.

## Addresses

Address records have stable ids, labels, structured fields, `isPrimary`, and derived display text. CRUD, primary assignment, confirmation before deletion, validation, suggestions, and a map dialog are implemented on `/profile/addresses`. The only primary address cannot be deleted; another address may become primary first. Checkout courier delivery offers saved addresses and keeps the selected address synchronized after profile changes.

## Responsive behavior

Existing profile container, sidebar, panels, form controls, and dialogs are reused. New grids collapse to one column; document rows become cards; local tabs/chips may scroll without document-level overflow; dialog and save actions remain above mobile navigation.

## Verification

Unit/integration tests cover filters, preview/download states, help search/accordion/form, recovery states, complete address CRUD, primary rules, and checkout synchronization. E2E covers account navigation, main flows, recovery, CRUD, checkout address selection, and overflow at 1440/1024/390/360.
