# Trommelberg Brand Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the unverified demonstration name «Русская техника» with the confirmed automotive-service equipment brand Trommelberg on the homepage.

**Architecture:** Keep the existing data-driven brand grid unchanged and update only its local source array. Extend the existing homepage E2E coverage so the intended brand is visible and the removed name cannot regress.

**Tech Stack:** React 19, TypeScript, Vite, Playwright, GitHub Pages

## Global Constraints

- Preserve the existing card position, neutral graphic placeholder, dimensions, grid, and responsive behavior.
- Keep the internal brand-link generation mechanism unchanged; `Trommelberg` must produce `/brands/trommelberg`.
- Do not add a proprietary logo or rebuild the rest of the brand list.
- Do not add a brand detail page or backend data.

---

### Task 1: Replace the homepage demonstration brand

**Files:**
- Modify: `prototype/e2e/homepage.spec.ts`
- Modify: `prototype/src/data/prototypeData.ts:18`

**Interfaces:**
- Consumes: the existing `prototypeData.home.brands` array and its lowercase slug generation.
- Produces: a homepage brand card named `Trommelberg` with `href` equal to `/brands/trommelberg`.

- [ ] **Step 1: Write the failing regression assertion**

Add these assertions to the homepage content test after opening `/`:

```ts
await expect(page.getByText('Trommelberg', { exact: true })).toBeVisible()
await expect(page.getByText('Русская техника', { exact: true })).toHaveCount(0)
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```bash
npx playwright test e2e/homepage.spec.ts --grep "homepage exposes" --project=desktop
```

Expected: FAIL because `Trommelberg` is not present.

- [ ] **Step 3: Make the minimal data change**

In `prototype/src/data/prototypeData.ts`, change the brand array entry:

```ts
brands: ['Nordberg', 'Trommelberg', 'JTC', 'Rupes', 'WiederKraft', 'Jonnesway', 'Sivik', 'Car-Tool'].map((name) => ({ id: name.toLowerCase().replaceAll(' ', '-'), name, href: `/brands/${encodeURIComponent(name.toLowerCase())}` })),
```

- [ ] **Step 4: Run the focused test to verify it passes**

Run:

```bash
npx playwright test e2e/homepage.spec.ts --grep "homepage exposes" --project=desktop
```

Expected: 1 passed.

- [ ] **Step 5: Run the complete project verification**

Run:

```bash
npm run test:run
npm run build:pages
npm run test:e2e
```

Expected: 27 unit tests pass, the Pages build exits with code 0, and all E2E tests pass.

- [ ] **Step 6: Commit the implementation**

```bash
git add prototype/e2e/homepage.spec.ts prototype/src/data/prototypeData.ts
git commit -m "fix: replace unverified homepage brand"
```

### Task 2: Publish and verify GitHub Pages

**Files:**
- No source files modified.

**Interfaces:**
- Consumes: branch `codex/homepage-prototype` and workflow `.github/workflows/deploy-prototype-pages.yml`.
- Produces: the updated public homepage at `https://kcska18051-crypto.github.io/garage/`.

- [ ] **Step 1: Push the feature branch**

```bash
git push origin codex/homepage-prototype
```

Expected: the remote branch advances to the implementation commit.

- [ ] **Step 2: Wait for the Pages workflow**

```bash
$runId = gh run list --workflow deploy-prototype-pages.yml --branch codex/homepage-prototype --limit 1 --json databaseId --jq '.[0].databaseId'
gh run watch $runId --exit-status
```

Expected: the build and deploy jobs complete successfully.

- [ ] **Step 3: Verify the public homepage**

Open `https://kcska18051-crypto.github.io/garage/` and verify:

```text
Trommelberg is visible in the Popular Brands section.
Русская техника is absent.
The brand grid has no horizontal overflow at 1920, 1440, 390, and 360 px.
```
