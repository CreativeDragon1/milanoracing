# Private Milano team workspace

The `/admin` entry point is intentionally absent from public navigation. Its sign-in screen is public, but the dashboard renders only after a verified Supabase account passes the server-side allowlist check. Every read and write is also protected by PostgreSQL row-level security; hiding the page is not the security boundary.

## Features

- Team tasks: titles, owners, dates, priority, status, notes, search and filters.
- Twelve initial sustainability goals across environmental, social and economic categories, with evidence required for achieved goals.
- Editable RACI responsibilities, including prompts for missing accountable/responsible roles.
- Environmental impact register: fifteen activity templates, tonnes of CO₂, consequence/probability (1–10), automatic scores and evidence notes. No reference-team emissions values are claimed as Milano measurements. Risk bands are local planning conventions: Low 1–19, Medium 20–49, High 50–100.
- Shared database persistence. Per-row revisions reject stale updates and deletions. Refresh retrieves other members' changes; no silent last-write-wins overwrite.

## Infrastructure

Supabase project: `aowyhsubhhhzzkryyyxj` (Milano Racing Admin), owned by the user's Milano Racing organisation. `src/admin/config.json` contains only the public URL and publishable browser key. Those values deliberately ship in the browser and confer no private-data access without a verified approved session. The website can therefore deploy through the existing GitHub/Vercel integration without needing new Vercel environment variables. Optional `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` overrides support isolated environments. Never put a service-role key, database password, Gmail app password or member email list in this file or Git.

Apply migrations in order on a fresh database:

1. `supabase/migrations/202610290001_admin.sql`
2. `supabase/migrations/202610290002_allowlist_hook.sql`

The initial production migration was applied through Supabase's SQL editor. Do not rerun it against existing tables. Track future changes as new migrations.

The exact six approved addresses are stored only in `private.admin_members`. There is no client-readable member directory or client-controlled role flag. Add/remove members as the database owner; authenticated app users cannot alter the list. Removing a member denies their next database request immediately. The dashboard also rechecks access on focus and every minute and clears its mounted workspace when access is denied. Previously viewed information cannot be recalled from a person's device.

Configure Authentication > Auth Hooks > Before User Created to use `public.before_milano_user_created`. This allows only listed emails to create accounts through the email-link flow. Keep email confirmation enabled and anonymous sign-in disabled. The browser calls `signInWithOtp` with PKCE and `shouldCreateUser: true`; the hook controls first-time registration, while RLS independently controls data access.

Production site URL: `https://www.milanoracing.team/admin`. Permitted redirect URLs: that URL, `https://milanoracing.team/admin`, and the local development callback `http://127.0.0.1:5194/admin`. Remove the local callback after development if no longer needed. Avoid broad wildcard redirect URLs. PKCE links must be opened in the same browser that requested them.

Email links use the owner-configured custom Gmail SMTP sender. Supabase's default mail service cannot deliver to arbitrary app users. SMTP credentials live only in Supabase's encrypted settings; the browser and repository never receive them. Gmail can impose sending limits; monitor actual delivery and migrate to a transactional mail provider if needed.

The session is persisted by Supabase's browser SDK under `milano-admin-session`. Sign out removes this browser's session. Private routes are excluded from Vercel analytics and marked noindex/noarchive, with no-store and no-referrer headers on Vercel. The static public site remains available without authentication.

## Verification

`npm run test:admin` executes the actual migrations in embedded PostgreSQL (PGlite). It checks anonymous, unapproved, unverified and revoked users, all four tables, private membership data, hook permissions, input constraints and revision conflicts. This is database-policy evidence, not proof of production email delivery.

`npm run build` checks TypeScript and creates the production site. `npm run dev -- --port 5194` starts development. `/admin?preview=1` is an in-memory design preview compiled only in development. It uses no real team records and resets on reload; the production build has no preview path or preview seed chunk. Do not use development preview as evidence of live account access or persistence.

Before release, verify live anonymous API denial, rejected unapproved signup, an approved user's email-link sign-in, persisted edits after refresh, sign-out, and the actual production deployment. Never send sign-in emails to other members as a test without their authorization.
