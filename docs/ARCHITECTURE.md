# Architecture

- **Runtime:** Next.js App Router + React + TypeScript; `output: 'export'` produces static HTML/assets in `out/`.
- **Hosting:** GitHub Pages via official Pages Actions. In Actions builds, `GITHUB_REPOSITORY` supplies the repository slug for `basePath` and `assetPrefix`.
- **Content:** versioned JSON under `public/data`; active language JSON is fetched on selection rather than loading all language lessons into the first render.
- **State:** localStorage stores compact progress, bookmarks and theme. It is not a cross-device database.
- **Pronunciation:** Web Speech API synthesis only when available; no false claim of native quality. Pāli/Sanskrit synthesis is withheld by default.
- **Offline:** service worker performs conservative cache-first reads for cached assets and network-first fetches for uncached same-origin content. Offline behavior is best effort.
- **Security:** no API secrets, analytics, auth or server-side endpoints. Optional AI must use a separately deployed server-side proxy.

## Static-hosting constraints

GitHub Pages cannot run Next.js server rendering, route handlers, server actions, a database or secret-bearing API proxy. The current application is a single static route with client-side workspace sections to avoid dynamic-route refresh failures. If route-per-lesson URLs are introduced, generate all paths at build time or add and test a deliberate static fallback strategy.
