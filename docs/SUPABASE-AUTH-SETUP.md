# Supabase Authentication setup

## What is included
- Email/password sign-up and sign-in UI, sign-out, user metadata username/bio updates.
- Optional `profiles` table with per-user row-level security, username, bio, preferred learning language and preferred appearance.
- Preferences can be extended in `profiles.preferences` JSONB.
- Static GitHub Pages deployment; no server-side secrets.

## Configure
1. Create a Supabase project and open Project Settings → API.
2. Copy the Project URL and publishable/anon key into a local `.env.local` based on `.env.example`. Do not use the `service_role` secret in client code.
3. Run `docs/supabase/schema.sql` in Supabase SQL Editor.
4. In Authentication → URL Configuration, add local URL `http://localhost:3000/**` and your published Pages URL `https://YOUR_GITHUB_USERNAME.github.io/langspot-learning-studio/**` to the allowed redirect URLs. Set Site URL to the production URL where appropriate.
5. Decide whether email confirmation is required. Configure SMTP for production email delivery; default test mail service has limits.
6. Restart `npm run dev`. Sign-up/sign-in appears under the Account workspace.
7. Add GitHub Actions repository variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` if the build requires them. These are public browser configuration values, not secrets. Never add a service-role key.

## Security notes
- Public static applications cannot protect secrets embedded in client-side JavaScript.
- Enable RLS for every user-owned table and write policies before adding sync features.
- Supabase Auth identity is not the same as an application admin role. If admin tools are added, implement trusted server-side authorization; do not grant roles based on editable user metadata.
- Password reset and OAuth flows need configured Supabase redirect URLs and additional UI before being advertised as supported.
- Username/bio are stored as user metadata; the profile table upsert requires the included SQL schema.
