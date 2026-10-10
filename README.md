# LangSpot Learning Studio

**An offline-first, open-source learning workspace for ten languages.** LangSpot is a Next.js App Router application exported as static files for free GitHub Pages hosting. Core content and local learning features do not require an account, paid service, AI API, or backend.

> **Content-quality note:** the initial release includes structured 120-day roadmaps for all ten languages, but the roadmap lessons are guided practice plans rather than 1,200 fully specialist-authored textbook chapters. The starter vocabulary set is intentionally small. Content is marked as an initial editorial draft and should receive qualified language-specialist review before being treated as authoritative.

## Supported languages

| ID | Language | Script focus | Speech synthesis |
|---|---|---|---|
| `en` | English | Latin | Browser voice when available |
| `hi` | Hindi | Devanagari | Browser voice when available |
| `zh` | Mandarin Chinese | Han + Pinyin | Mandarin voice when available; not Cantonese |
| `ja` | Japanese | Hiragana, Katakana, Kanji | Browser voice when available |
| `ko` | Korean | Hangul | Browser voice when available |
| `si` | Sinhala | Sinhala | Browser voice when available |
| `th` | Thai | Thai | Browser voice when available |
| `my` | Burmese | Myanmar | Browser voice when available |
| `pi` | Pāli | Roman Pāli with diacritics | Deliberately not synthesized without a suitable voice |
| `sa` | Sanskrit | Devanagari + IAST | Deliberately not synthesized without a suitable voice |

## Features

- Responsive learning workspace with light/dark theme.
- Language switcher for all ten language profiles.
- 120 sequential lessons per language, with objectives, practice activities, review and quiz feedback.
- Starter vocabulary, grammar foundation notes and reading guidance.
- Browser speech synthesis controls with voice/language caveats.
- Local content search across the active language's loaded vocabulary, grammar and lessons.
- Deterministic local tutor using bundled records; it is **not** an LLM.
- Local progress, bookmarks, lesson completion and JSON export/import.
- Conservative service worker and installable PWA manifest.
- Static JSON content with validation scripts, Node tests and GitHub Actions workflows.

## Requirements

- Node.js 24.x (the project CI uses Node 24).
- npm 12.x (install-script allowlist is configured in `package.json`).
- Git for publishing.

For the detailed Windows/npm 12 installation, audit, and install-script troubleshooting steps, see [Windows and npm 12 setup](docs/WINDOWS-NPM12-SETUP.md).

## Run locally

```bash
npm install
npm run dev
```

The archive does not contain `package-lock.json` because this build environment could not reach the npm registry. On your network-connected machine, run `npm install`; inspect and commit the generated `package-lock.json`. Once committed, use `npm ci` for repeatable installs. The first install may still report transitive audit findings; do not suppress them—inspect `npm audit` output and only accept a clean/high-severity-free result after reviewing it.

Open `http://localhost:3000`. To stop the development server, press `Ctrl+C`.

## Validate and build

```bash
npm run validate:content
npm run validate:assets
npm audit --audit-level=high
npm test
npm run typecheck
npm run lint
npm run build
```

The static output is generated in `out/`. `npm run check` runs the complete configured local checks. A successful static build does not mean browser/device accessibility, speech recognition, offline installation, or specialist content accuracy has been exhaustively verified.

## GitHub Pages deployment

1. Create a public repository named **`langspot-learning-studio`** under your GitHub account.
2. Extract this ZIP. In a terminal, enter the extracted project directory.
3. Check `git status`; do not overwrite an existing project or force-push an unrelated repository.
4. Initialize and push:

   ```bash
   git init
   git branch -M main
   git add .
   git commit -m "chore: initial LangSpot Learning Studio release"
   git remote add origin https://github.com/<GITHUB_USERNAME>/langspot-learning-studio.git
   git push -u origin main
   ```

   Replace `<GITHUB_USERNAME>` with your account. If `origin` already exists, inspect it using `git remote -v`; do not add a second origin blindly.
5. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **GitHub Actions**.
6. The included `deploy-pages.yml` builds with `GITHUB_REPOSITORY` and `GITHUB_ACTIONS` so Next.js uses the project subpath `/langspot-learning-studio` automatically. The workflow uploads `out/` and deploys it with the official Pages actions.
7. Open **Actions** and wait for the Pages workflow to succeed. The expected URL is `https://<GITHUB_USERNAME>.github.io/langspot-learning-studio/`.
8. Test the URL on desktop and mobile. Switch languages, open a lesson, refresh, try search, export progress, install the PWA if offered, then test offline after first visiting online.

### If the repository already has remote commits

Do not force-push. First inspect `git status`, `git log --oneline --graph --decorate -8`, and `git remote -v`. Fetch the remote and compare branches. If the remote contains only a README/license you want to retain, merge or rebase deliberately after backing up the folder. Resolve conflicts, rerun checks, then push normally.

## Version tags and releases

```bash
npm run check
git status
git add .
git commit -m "chore: baseline LangSpot v0.0.0"
git tag -a v0.0.0 -m "LangSpot Learning Studio v0.0.0 baseline"
git push origin main
git push origin v0.0.0
```

Then open **GitHub → Releases → Draft a new release**, select tag `v0.0.0`, add release notes from `CHANGELOG.md`, and publish. Do not create the tag until all checks you require have passed.

## Content architecture

- `public/data/manifest.json`: content version and dataset inventory.
- `public/data/languages.json`: language profiles and learning sequence metadata.
- `public/data/languages/<id>.json`: 120 lessons plus starter vocabulary, grammar and reading guide for each language.
- `public/data/shared.json`: introductory family notes, levels and source registry.
- `scripts/validate-content.mjs`: IDs, day count, required fields and manifest checks.
- `scripts/validate-assets.mjs`: PWA manifest and icon presence/syntax checks.

Stable IDs are designed to survive file organization changes. Keep original script text intact. Search normalization must never replace stored source text or silently remove meaningful tones, vowel length or diacritics.

## npm 12 install-script policy and dependency security

- `next` is pinned to `15.5.27`; a scoped npm override pins its nested `postcss` to `8.5.29` to address the advisories in the supplied audit log. Verify with `npm ls next postcss` and `npm audit` after installation.
- The development script uses `next dev` (no unsupported `--webpack` flag), and generated `next-env.d.ts` is excluded from ESLint.
- `react` and `react-dom` are pinned to `19.2.6`.
- ESLint uses `10.12.0`; the ESLint 9 line is no longer the supported line. TypeScript linting is handled by `typescript-eslint` `8.71.1`, which supports ESLint 10.
- The previous `eslint-config-next` dependency was removed. This avoids the dependency path that surfaced the unrecognized `user-resolver@1.12.2` install script in the reported install. If `user-resolver` still appears after a clean install, stop and investigate with `npm explain user-resolver` and `npm view user-resolver@1.12.2`; do not approve it blindly.
- npm 12 blocks unapproved dependency lifecycle scripts. `package.json` contains a version-pinned approval for `sharp@0.34.5` only. Do not use `npm approve-scripts --all`. If npm reports a different version, inspect the package provenance and purpose before changing the allowlist.
- Run `npm audit` after installation. The CI workflow blocks deployment when high/critical vulnerabilities remain. A package version pin is not a permanent guarantee; repeat audit checks when dependencies change.

### Clean reinstall on Windows PowerShell

```powershell
# From the project root, after backing up any local changes
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
npm cache verify
npm install
npm audit
npm run check
```

After the first successful install, keep `package-lock.json` and use `npm ci` on subsequent installs. Do not delete the lockfile again unless you intend to re-resolve the dependency tree.

## Local data and privacy

Progress is stored in `localStorage` on the current browser profile. It is not synced between devices and may be lost if browser storage is cleared. Use **Progress → Export progress JSON** to back up your data. Import replaces the current local progress. No analytics or remote AI provider is configured by default.

## Speech, voice and AI limitations

- Speech synthesis relies on voices installed/provided by the browser and operating system; availability and quality vary.
- Pāli and Sanskrit are not passed to an unrelated voice and presented as accurate pronunciation.
- Browser speech recognition is not included in this first release; microphone capture and voice chat are not implemented.
- The local tutor uses deterministic keyword matching and bundled content; it is not a general-purpose AI.
- Private AI API keys must never be put in a static GitHub Pages application. A future AI adapter must call a separately deployed server-side proxy.
- Offline support is best-effort. A first online visit is required, browsers can evict caches, and no recorded audio packs are bundled in this release.
- GitHub Pages is static hosting: no server actions, server API routes, user accounts or cross-device sync.

## Accessibility and performance

The UI uses semantic controls, focus-visible styles, responsive layouts and reduced-motion support. These are not proof of WCAG 2.2 AA conformance. Complete manual keyboard/screen-reader checks and automated browser accessibility scans before claiming conformance. The app loads only the selected language dataset after selection.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Every language example should include source/provenance where applicable and receive a qualified review before it is labeled expert-verified.

## License

Application code: MIT. Original starter learning notes: CC BY 4.0 unless a dataset record states otherwise. Third-party reference links are not redistributed content; the original rights holder's terms apply. See `LICENSE`, `docs/CONTENT-PROVENANCE.md` and `THIRD-PARTY-NOTICES.md`.
