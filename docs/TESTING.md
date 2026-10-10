# Testing guide

Run on Node.js 24.x and npm 12.x from the repository root.

```powershell
npm install
npm run validate:content
npm run validate:assets
npm audit --audit-level=high
npm test
npm run typecheck
npm run lint
npm run build
```

`npm run check` runs the content validators, typecheck, lint, tests, and production build. The security audit is run separately because it needs a generated lockfile and registry advisory data.

## Verification status of the delivered archive

The archive was structurally inspected and the JSON content/assets validators and Node built-in tests can run without downloading dependencies. This build environment had no usable npm registry access, so dependency installation, audit, TypeScript, ESLint, and Next.js build have not been executed here. Run all commands above locally before deploying.
