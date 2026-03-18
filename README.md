# React 18 + TypeScript + Vite — MSW API Mocking Boilerplate

This boilerplate is a working setup to mock API requests in **the browser** and in **unit tests** using:

- **MSW (Mock Service Worker)** for intercepting `fetch`/Axios requests
- **Vitest + Testing Library** for test execution
- **@msw/data + Zod** (optional but included) for data-driven mocks (list/search/create flows)
- **ESLint + Husky (lint-staged)** for consistent code quality

It is designed for POCs and for development/homolog environments where the backend is missing or incomplete.

---

## What’s included

### Browser mocking (MSW worker)
- `src/mocks/browser.ts`: MSW worker setup (browser)
- `src/mocks/handlers.ts`: aggregated handlers (with filtering by config)
- `src/mocks/config/`: per-domain mock configuration
  - `src/mocks/config/user.ts`
  - `src/mocks/config/reports.ts`
  - `src/mocks/config/index.ts`: environment rules + flattening into a `Set` of enabled mock ids
- `public/mockServiceWorker.js`: generated MSW service worker file
- `src/main.tsx`: starts the MSW worker before rendering React

### Test mocking (Vitest)
- `vitest.setup.ts`: starts/stops MSW server for tests
- `src/mocks/server.ts`: MSW server setup (Node)
- `src/mocks/handlers.ts`: same handler registry as the browser

---

## Quick start

Install:

```bash
npm install
```

Dev:

```bash
npm run dev
```

Tests:

```bash
npm test
```

Lint:

```bash
npm run lint
```

Notes:
- A small helper script (`scripts/ensure-msw-env.cjs`) can create `.env.local` with `VITE_USE_MSW=true` for local dev convenience.
- Which endpoints are mocked is controlled by `src/mocks/config/index.ts` via `import.meta.env.VITE_ENV` (fallback to `import.meta.env.MODE`).

---

## How mock enabling works (best-practice)

Handlers are grouped per domain:

- `src/mocks/handlers/reports.ts` (reports endpoints)
- `src/mocks/handlers.ts` (aggregates all enabled domain handlers)

Each handler has a logical id (e.g. `reports:list`, `reports:detail`). The final `handlers: RequestHandler[]` is produced by:

1. Computing which mock ids are enabled for the current environment in `src/mocks/config/index.ts`
2. Filtering the aggregated tagged handlers accordingly

This keeps handlers “pure” and avoids sprinkling `if (USE_MOCKS)` throughout the codebase.

---

## Environment setup (DEV / UAT / PROD)

The demo/boilerplate behavior is controlled by:

- `VITE_ENV` (preferred)
- fallback: `import.meta.env.MODE`

Current default mapping example implemented in `src/mocks/config/index.ts`:

- `VITE_ENV=uat`:
  - mock `user:getUser`
  - mock `reports:list`
  - do **not** mock `reports:detail` and `reports:create`
- `VITE_ENV=prod` (or `VITE_ENV=production`):
  - mock nothing (handlers are filtered out)
- other values (local dev / test):
  - use base domain configs (enable all current mocks)

### Vercel tip (POC)
- When deploying to Vercel for a POC that needs mocks, set `VITE_ENV=uat` as a project environment variable (Preview environment is enough for typical POCs).

---

## Debugging checklist

If a request fails or isn’t intercepted:

1. Open browser DevTools:
   - **Network**: verify the request URL + method
   - **Application → Service Workers**: verify `mockServiceWorker.js` is registered
2. Check for MSW warnings like:
   - “intercepted a request without a matching request handler”
3. Ensure the mock is enabled in `src/mocks/config/index.ts` for the current `VITE_ENV`.

---

## Adding a new mocked endpoint

High level steps:

1. Create a new handler in `src/mocks/handlers/<domain>.ts`
2. Add a logical handler id (e.g. `reports:update`)
3. Add the id to the corresponding domain config in `src/mocks/config/<domain>.ts`
4. Ensure `src/mocks/config/index.ts` environment rules include the id (directly or via domain config)

---

## Credits

MSW adoption was suggested by an internal teammate from another project.

