# GitHub Pages deployment checklist

1. Use Node.js 22 and npm 10.
2. Run `npm install` in a network-connected environment. This should create `package-lock.json`; commit it after verifying the dependency tree.
3. Run `npm run validate:content`, `npm run validate:assets`, `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`.
4. Create a GitHub repository named `langspot-learning-studio`, push `main`, and set **Settings → Pages → Build and deployment → GitHub Actions**.
5. Confirm the deployment workflow completes. It builds with the repo slug as the Next.js `basePath`.
6. Visit `https://<GITHUB_USERNAME>.github.io/langspot-learning-studio/` and verify CSS, JS, JSON, manifest and icons load. Confirm no 404s in browser devtools.
7. On mobile, test language selection, keyboard/touch operation, progress export/import and the offline flow after an online visit.
8. Do not announce the site as live until the URL has actually been deployed and verified.
