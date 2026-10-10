# Windows 11 setup — Node.js 24 and npm 12

This guide is for the reported environment: Node.js `24.21.0`, npm `12.1.0`, and Git for Windows `2.55.0.windows.5`.

## 1. Extract and open the project

Extract `langspot-learning-studio.zip`, then open PowerShell in the extracted `langspot-learning-studio` folder. Confirm that `package.json`, `app/`, `components/`, and `public/` are in the current directory:

```powershell
Get-Location
Get-ChildItem
node -v
npm -v
git --version
```

## 2. Do a clean dependency install

Back up any local edits before removing generated dependencies. The archive intentionally does not contain `package-lock.json`, because the build environment could not reach the npm registry.

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
npm cache verify
npm install
```

`npm install` should create a new `package-lock.json`. Keep it; review and commit it. Subsequent clean installs should use `npm ci`.

## 3. Interpret the messages

### “134 packages are looking for funding”

This is informational. It means dependencies publish funding links. It does not indicate an installation failure or a vulnerability. Inspect links with `npm fund` if desired; no action is required to run the app.

### “8 vulnerabilities”

Do not ignore the report and do not assume a framework version bump automatically fixes every transitive package. Run:

```powershell
npm audit
npm audit --omit=dev
npm ls next postcss react react-dom eslint typescript-eslint sharp user-resolver
```

The project pins Next.js to `15.5.27`, React/React DOM to `19.2.6`, ESLint to `10.12.0`, and `typescript-eslint` to `8.71.1`. It also scopes a PostCSS override (`8.5.29`) to Next.js because your audit identifies Next.js’ nested PostCSS dependency as the source of the four advisories. After reinstalling, verify the actual tree and audit results; do not assume an override worked without checking.

If vulnerabilities remain, read each advisory and its affected/patched ranges. Prefer a compatible patched direct dependency update and then regenerate/review the lockfile. Do not run `npm audit fix --force` blindly: it may install breaking major versions. If `npm audit fix` proposes compatible non-breaking fixes, inspect its proposed changes before accepting them.

### “Install scripts blocked: user-resolver@1.12.2, sharp@0.34.5”

npm 12 blocks unapproved dependency lifecycle scripts by default. This is a security control. The project explicitly approves only `sharp@0.34.5` in `package.json`, pinned to that version. Do not approve all scripts.

The reported `user-resolver@1.12.2` is not a declared direct dependency in this project. The previous `eslint-config-next` dependency has been removed from the lint configuration to simplify the dependency tree. After a clean install, if `user-resolver` still appears, do not approve its script without identifying why it is present. Run:

```powershell
npm explain user-resolver
npm view user-resolver@1.12.2 name version description repository maintainers time --json
```

If `npm explain` identifies a parent package, inspect whether that parent is required and whether a patched replacement exists. If the registry metadata is missing or suspicious, stop and share the output for review. Do not use `npm approve-scripts --all` or `--dangerously-allow-all-scripts`.

If the install still reports `sharp` as blocked despite the pinned `allowScripts` entry, check the exact installed version with `npm ls sharp`. A different version will not match the version-pinned approval; review it before changing the allowlist. Then run `npm install` again after the allowlist change so npm can apply the decision.

## 4. Run checks

The `dev` script uses `next dev` without `--webpack`. In this project’s pinned Next.js 15 CLI, `--webpack` is not accepted; removing that unsupported flag uses the standard development bundler. The ESLint config also ignores `next-env.d.ts`, because Next.js generates that file and its triple-slash references should not be linted as handwritten source.

```powershell
npm run validate:content
npm run validate:assets
npm audit --audit-level=high
npm test
npm run typecheck
npm run lint
npm run build
```

Only continue to deployment after these commands pass. To start the development server:

```powershell
npm run dev
```

Open `http://localhost:3000`; stop the server with `Ctrl+C`.

## 5. Commit the lockfile

```powershell
git status
git add package.json package-lock.json eslint.config.mjs docs
git commit -m "chore: establish LangSpot v0.0.0 baseline"
```

Review `git status` before committing and ensure no `.env` files, `node_modules`, or build output are staged.
