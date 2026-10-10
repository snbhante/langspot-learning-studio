# Release readiness — v0.0.0

## Status

Initial project baseline; not a production-completion claim.

## Included

- Ten language datasets and structured 120-day roadmap records.
- Responsive Next.js learning workspace, local progress and bookmarks, local tutor, search, speech synthesis where suitable, PWA assets, validators, tests, documentation, and Pages workflows.
- Security-minded dependency baseline: Next.js 15.5.27, React 19.2.6, ESLint 10.12.0, typescript-eslint 8.71.1, a scoped Next.js PostCSS override to 8.5.29, and a version-pinned sharp script approval for npm 12.

## Must pass before a public deployment

- `npm install` and review/commit `package-lock.json`.
- `npm audit --audit-level=high` with no high/critical vulnerabilities.
- Content and asset validators.
- Node tests, TypeScript typecheck, ESLint, and Next.js static production build.
- Browser smoke test on desktop and mobile; check Pages subpath assets, data loading, local storage, PWA and offline behavior.

## Not yet verified in this delivery environment

The npm registry was unreachable, so the resolved lockfile, audit report, dependency install scripts, typecheck, lint, production build, and live GitHub Pages deployment could not be executed here. Do not describe those checks as passed until CI reports success.
