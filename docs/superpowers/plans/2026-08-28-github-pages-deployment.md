# GitHub Pages Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the homepage and every implemented catalog route at `https://kcska18051-crypto.github.io/garage/`.

**Architecture:** Keep local development rooted at `/`, but pass Vite's `BASE_URL` to `BrowserRouter` so a Pages build rooted at `/garage/` resolves internal links correctly. Build a static SPA artifact with an `index.html` fallback copied to `404.html`, then deploy that artifact with the official GitHub Pages Actions workflow.

**Tech Stack:** React 19, React Router 7, TypeScript, Vite 8, Vitest, Playwright, GitHub Actions, GitHub Pages.

## Global Constraints

- Work only in `C:\Users\Admin\garage-work\garage` on `codex/homepage-prototype`.
- Preserve the existing local commands and root-relative local routes.
- Publish under the repository prefix `/garage/`.
- Use only official GitHub Pages actions.
- Do not store generated `prototype/dist` files in Git.
- Verify the real public HTTPS routes before declaring the deployment complete.

---

### Task 1: Make the router repository-prefix aware

**Files:**
- Modify: `prototype/src/app/App.tsx`
- Modify: `prototype/src/app/App.test.tsx`

**Interfaces:**
- Consumes: Vite `import.meta.env.BASE_URL`.
- Produces: `routerBasename(baseUrl: string): string`, used by `BrowserRouter`.

- [ ] **Step 1: Write the failing basename test**

```tsx
import { App, routerBasename } from './App'

it('normalizes the GitHub Pages base URL for BrowserRouter', () => {
  expect(routerBasename('/garage/')).toBe('/garage')
  expect(routerBasename('/')).toBe('/')
})
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- --run src/app/App.test.tsx`

Expected: failure because `routerBasename` is not exported.

- [ ] **Step 3: Implement the minimal router base support**

```tsx
export function routerBasename(baseUrl: string) {
  return baseUrl === '/' ? '/' : `/${baseUrl.replace(/^\/+|\/+$/g, '')}`
}

export function App() {
  const content = <CommerceProvider><AppContent /></CommerceProvider>
  return useInRouterContext() ? content : <BrowserRouter basename={routerBasename(import.meta.env.BASE_URL)}>{content}</BrowserRouter>
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- --run src/app/App.test.tsx`

Expected: all tests in `App.test.tsx` pass.

- [ ] **Step 5: Commit the router change**

```powershell
git add -- prototype/src/app/App.tsx prototype/src/app/App.test.tsx
git commit -m "feat: support repository base path"
```

### Task 2: Add a reproducible Pages build

**Files:**
- Create: `prototype/scripts/create-spa-fallback.mjs`
- Modify: `prototype/package.json`
- Modify: `prototype/README.md`

**Interfaces:**
- Consumes: `prototype/dist/index.html` produced by Vite.
- Produces: `npm run build:pages`, `prototype/dist/404.html`, and assets rooted at `/garage/`.

- [ ] **Step 1: Add the Pages build command and fallback script**

`prototype/package.json`:

```json
"build:pages": "tsc -b && vite build --base=/garage/ && node scripts/create-spa-fallback.mjs"
```

`prototype/scripts/create-spa-fallback.mjs`:

```js
import { copyFile } from 'node:fs/promises'

await copyFile(new URL('../dist/index.html', import.meta.url), new URL('../dist/404.html', import.meta.url))
```

- [ ] **Step 2: Build the Pages artifact**

Run: `npm run build:pages`

Expected: exit 0; `dist/index.html` and `dist/404.html` exist.

- [ ] **Step 3: Verify artifact paths and fallback**

Run:

```powershell
$index = Get-Content -Raw -LiteralPath 'dist\index.html'
$fallback = Get-Content -Raw -LiteralPath 'dist\404.html'
if ($index -ne $fallback -or $index -notmatch '/garage/assets/') { throw 'Invalid Pages artifact' }
```

Expected: exit 0.

- [ ] **Step 4: Document the public build command and URL**

Add `npm run build:pages` and `https://kcska18051-crypto.github.io/garage/` to `prototype/README.md`.

- [ ] **Step 5: Commit the Pages build**

```powershell
git add -- prototype/package.json prototype/scripts/create-spa-fallback.mjs prototype/README.md
git commit -m "feat: add GitHub Pages build"
```

### Task 3: Add and run the GitHub Pages deployment workflow

**Files:**
- Create: `.github/workflows/deploy-prototype-pages.yml`

**Interfaces:**
- Consumes: the `prototype` npm project and `npm run build:pages`.
- Produces: a `github-pages` deployment at the repository Pages URL.

- [ ] **Step 1: Create the official Pages workflow**

```yaml
name: Deploy prototype to GitHub Pages

on:
  push:
    branches: [codex/homepage-prototype]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: github-pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: prototype/package-lock.json
      - uses: actions/configure-pages@v5
      - run: npm ci
        working-directory: prototype
      - run: npm test -- --run
        working-directory: prototype
      - run: npm run build:pages
        working-directory: prototype
      - uses: actions/upload-pages-artifact@v4
        with:
          path: prototype/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Run local verification before push**

Run: `npm test -- --run`, `npm run build`, `npm run build:pages`, and `npm run test:e2e` from `prototype/`.

Expected: every command exits 0.

- [ ] **Step 3: Commit and push the workflow**

```powershell
git add -- .github/workflows/deploy-prototype-pages.yml
git commit -m "ci: deploy prototype to GitHub Pages"
git push origin codex/homepage-prototype
```

- [ ] **Step 4: Enable workflow-based GitHub Pages**

Run:

```powershell
gh api --method POST repos/kcska18051-crypto/garage/pages -f build_type=workflow
```

If the site already exists, update it instead:

```powershell
gh api --method PUT repos/kcska18051-crypto/garage/pages -f build_type=workflow
```

Expected: Pages reports `build_type` as `workflow`.

- [ ] **Step 5: Watch the deployment to completion**

Run: `gh run list --workflow deploy-prototype-pages.yml --branch codex/homepage-prototype --limit 1`, then `gh run watch <run-id> --exit-status`.

Expected: the workflow concludes with `success`.

- [ ] **Step 6: Verify the public routes**

Request these URLs and require HTTP 200 plus the prototype title:

```text
https://kcska18051-crypto.github.io/garage/
https://kcska18051-crypto.github.io/garage/catalog
https://kcska18051-crypto.github.io/garage/catalog/compressor-equipment
https://kcska18051-crypto.github.io/garage/catalog/compressor-equipment/screw-compressors
```

Expected: all pages load the interactive prototype and internal navigation remains inside `/garage/`.
