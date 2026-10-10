# Changelog

All notable changes to LangSpot Learning Studio are documented here.

## 0.0.0 — 2026-10-10

Initial working project baseline. This is an ongoing, incomplete application—not a claim of full feature completion or production certification.

- Preserve the initial Polyglot Learning Studio implementation under the LangSpot name.
- Add ten language profiles and 120-day structured roadmap records per language.
- Include local learning progress, starter vocabulary, grammar/reading guides, search, tutor rules, PWA assets, validators, tests, and GitHub Pages workflows.
- Pin Next.js’ nested PostCSS dependency to 8.5.29 via a scoped npm override to address the advisories reported by the project owner.
- Fix `npm run dev` by removing the unsupported `--webpack` option.
- Exclude generated `next-env.d.ts` from ESLint to avoid a false-positive triple-slash-reference error.
- Upgrade React/React DOM to 19.2.6.
- Replace the ESLint 9 / `eslint-config-next` combination with ESLint 10.12.0 and `typescript-eslint` 8.71.1 to avoid the ESLint 9 end-of-life line and simplify the lint dependency tree after the reported `user-resolver` install-script warning. The package is not auto-approved; if it remains in the resolved tree, its parent must be investigated.
- Add a pinned npm 12 install-script approval for `sharp@0.34.5`, whose install script checks/builds its native optional image-processing component. The approval is version-pinned; review it again if the resolved version changes.
- Update CI and Pages workflows to Node.js 24 and include an audit gate.

### Known limitations

- A `package-lock.json` is not included because this build environment cannot reach the npm registry. Run `npm install` once on a network-connected machine, review the generated lockfile, and commit it.
- Dependency installation, `npm audit`, typecheck, ESLint, Next.js build, and browser tests must be run on the maintainer's machine/CI before calling this baseline verified.
- The structured roadmaps are not 1,200 specialist-authored chapters; the initial vocabulary set is small and requires expert review.
