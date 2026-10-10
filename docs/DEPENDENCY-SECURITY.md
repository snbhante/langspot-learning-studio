# Dependency security and npm 12

## Baseline

- Next.js `15.5.27` — selected from the patched 15.5 release line. The upstream release list identifies this release as containing the September 30, 2026 security fixes.
- React / React DOM `19.2.6`.
- A scoped npm override pins Next.js’ transitive PostCSS dependency to `8.5.29`, which is newer than the affected `8.5.22` ceiling shown in the reported audit output. This is a compatibility/security override; re-check the tree with `npm ls next postcss` and `npm audit` after installation.
- ESLint `10.12.0` and `typescript-eslint` `8.71.1`.
- Node.js `24.x` and npm `12.x`.

## npm install scripts

npm 12 defaults to blocking dependency lifecycle scripts unless explicitly approved. This is a security control, not necessarily an install failure. The project approves only `sharp@0.34.5`, pinned to the reviewed version. Its install script performs the native image-processing setup/check. Do not approve all scripts globally.

The reported `user-resolver@1.12.2` is not part of the declared dependency list. The former `eslint-config-next` dependency was removed from this baseline to reduce the lint dependency tree. If the package still appears after removing `node_modules` and regenerating the lockfile, do not approve it without investigating the parent dependency and registry metadata. Use `npm explain user-resolver` and `npm view user-resolver@1.12.2`.

## Required verification

```powershell
npm install
npm ls next postcss react react-dom eslint typescript-eslint sharp user-resolver
npm audit
npm run validate:content
npm run validate:assets
npm test
npm run typecheck
npm run lint
npm run build
```

A clean audit result cannot be asserted before the registry has resolved the actual transitive dependency graph and `npm audit` has run. The CI pipeline includes `npm audit --audit-level=high` and will stop on high/critical findings.

## PostCSS override

The project applies a scoped override only to the PostCSS dependency nested under Next.js: `"overrides": { "next": { "postcss": "8.5.29" } }`. This avoids forcing unrelated packages to use the same PostCSS version. After a clean install, confirm that the nested version is `8.5.29` and that `npm audit` no longer reports the four PostCSS advisories from the supplied log. If the audit reports a different advisory, evaluate that advisory independently rather than suppressing it.
