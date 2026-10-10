# LangSpot Learning Studio v0.1.0 — Windows, Supabase ও GitHub Pages নির্দেশিকা

## ১. ZIP থেকে প্রজেক্ট খুলুন

1. ZIP Extract করে `langspot-learning-studio` folder খুলুন।
2. PowerShell/VS Code terminal-এ project root-এ যান:

```powershell
cd C:\Users\YOUR_USERNAME\VSCodeProjects\langspot-learning-studio
node -v
npm -v
git --version
```

Node.js 24 এবং npm 12 ব্যবহার করুন।

## ২. Dependency install ও local run

```powershell
npm cache verify
npm install
```

প্রথম `npm install`-এ `package-lock.json` তৈরি হলে সেটি review করে Git-এ commit করুন। পরবর্তী clean install-এ `npm ci` ব্যবহার করুন।

```powershell
npm run dev
```

তারপর `http://localhost:3000` খুলুন। Development server বন্ধ করতে `Ctrl+C` চাপুন।

## ৩. Validation ও test

```powershell
npm run validate:content
npm run validate:assets
npm test
npm run typecheck
npm run lint
npm audit --audit-level=high
npm run build
```

সবগুলো সফল না হওয়া পর্যন্ত Release-কে verified বলবেন না। `npm audit fix --force` চালানোর আগে audit report এবং dependency tree যাচাই করুন; force fix major-version পরিবর্তন করতে পারে।

## ৪. Supabase Auth configure করুন

1. Supabase-এ project তৈরি করুন।
2. Project Settings → API থেকে Project URL এবং publishable/anon key নিন।
3. `.env.example`-এর কপি `.env.local` নামে তৈরি করুন।
4. `NEXT_PUBLIC_SUPABASE_URL` ও `NEXT_PUBLIC_SUPABASE_ANON_KEY`-এ আপনার public project values দিন।
5. Supabase SQL Editor-এ `docs/supabase/schema.sql` চালান।
6. Authentication → URL Configuration-এ local এবং production GitHub Pages URL allow করুন।
7. `npm run dev` বন্ধ করে আবার চালান। Workspace-এর নিচের **Account** থেকে sign-up/sign-in, profile, username, bio ও preferences পরীক্ষা করুন।
8. Email confirmation চালু থাকলে mail delivery/SMTP সেটিংস যাচাই করুন।

**নিরাপত্তা:** `service_role` secret কখনো `.env.local`-এর `NEXT_PUBLIC_...` variable-এ, frontend code-এ বা GitHub repository-তে দেবেন না। GitHub Pages static frontend-এ `NEXT_PUBLIC_` values browser-এ দৃশ্যমান হয়; এখানে কেবল Supabase publishable/anon key ব্যবহার করুন এবং সব user-owned table-এ RLS চালু রাখুন।

## ৫. GitHub repository তৈরি ও push

GitHub-এ Public repository `langspot-learning-studio` তৈরি করুন। README, `.gitignore` বা License GitHub থেকে auto-generate না করে ZIP-এর ফাইল ব্যবহার করুন।

```powershell
git init
git branch -M main
git add .
git status
git commit -m "feat: add LangSpot v0.1.0 PWA and account foundation"
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/langspot-learning-studio.git
git push -u origin main
```

`YOUR_GITHUB_USERNAME` পরিবর্তন করুন। `git remote -v`-তে `origin` আগে থেকে থাকলে `git remote add origin` আবার চালাবেন না। Push করার আগে `git status`-এ `.env.local`, `node_modules`, `.next` বা `out` stage হয়নি নিশ্চিত করুন।

## ৬. GitHub Actions variables

Repository → Settings → Secrets and variables → Actions → **Variables**-এ এই variables যোগ করুন:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

এগুলো browser-side public configuration values। এখানে `service_role` key যোগ করবেন না। Authentication এখনই configure না করলে variables খালি রাখা যায়; Account panel setup instructions দেখাবে।

## ৭. GitHub Pages deploy

1. Repository → Settings → Pages খুলুন।
2. Build and deployment → Source হিসেবে **GitHub Actions** নির্বাচন করুন।
3. Actions tab-এ `Deploy LangSpot to GitHub Pages` workflow খুলুন।
4. Build job-এ dependency install, audit, validation, typecheck, lint, tests ও static build সফল হওয়া চাই।
5. Deploy job সফল হলে URL হবে `https://YOUR_GITHUB_USERNAME.github.io/langspot-learning-studio/`।
6. About → Website field-এ এই live URL বসান।

## ৮. PWA যাচাই

1. Live HTTPS URL খুলে ব্রাউজার থেকে app install করুন, যদি ব্রাউজার install সমর্থন করে।
2. manifest, icons, service worker এবং shortcut routes-এর 404 আছে কি না দেখুন।
3. App shortcuts, share target, audio file handler ও custom protocol handler সমর্থিত ব্রাউজারে আলাদাভাবে পরীক্ষা করুন। সব browser/OS এই সব feature সমর্থন করে না।
4. একবার online অবস্থায় page খুলে তারপর offline mode পরীক্ষা করুন।
5. Settings → Voice availability-তে browser/OS যে voices প্রকাশ করে সেগুলো দেখা যাবে। অনুপস্থিত voice webpage থেকে স্বয়ংক্রিয়ভাবে install করা যায় না; OS/browser language pack install করতে হবে। Pāḷi/Sanskrit-এর জন্য নির্ভুল system voice নাও থাকতে পারে।

## ৯. Release tag

সব checks ও live-site পরীক্ষা সফল হওয়ার পরে GitHub → Releases → Draft a new release থেকে tag `v0.1.0` দিন। Release notes-এ বাস্তবে যাচাই না করা কোনো feature বা test সফল হয়েছে বলে দাবি করবেন না।

## ১০. v0.1.0-এর সীমাবদ্ধতা

- Supabase account সুবিধা আপনার নিজের Supabase project, Auth settings, profile SQL এবং build-time public configuration না দিলে সক্রিয় হবে না।
- User profile/preferences সংরক্ষণের জন্য `profiles` table ও RLS policy প্রয়োজন।
- PWA advanced features browser/OS-dependent।
- Voice availability browser speech synthesis থেকে শনাক্ত হয়; gender filtering best-effort, কারণ browser voice names-এ gender metadata নির্ভরযোগ্য নয়।
- Manifest screenshots এই প্যাকেজে illustrative SVG preview; release-এর আগে চাইলে বাস্তব desktop/mobile screenshot দিয়ে প্রতিস্থাপন করুন।
- GitHub Pages static hosting server-side admin panel বা secret-protected backend চালায় না। ভবিষ্যতে admin roles/API যোগ করলে trusted backend ও server-side authorization দরকার হবে।
