# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

Supabase integration
--------------------

1. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
2. Install dependency: `npm install` (already added `@supabase/supabase-js`).
3. Use `.env.example` to create `.env.local` and fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (do NOT commit `.env.local`).
4. Quick test: run `npm run test:supabase` to verify the env vars and a simple `SELECT` from the `log` table.
5. The app uses `src/supabase.js` and `src/composables/useAuth.js` for auth. Login sends email/password to Supabase.

Important: If your `log` table has Row Level Security (RLS) enabled, ensure there's a policy that allows `SELECT` for the `anon` role or adjust it for your testing environment. If you see permission errors, add a temporary policy `USING (true)` for `SELECT` while debugging (remove it once you configure proper RLS rules).

Database table (userdata)
-------------------------

Create the `userdata` table in your Supabase Postgres database using this SQL:

```sql
create table public.userdata (
  uid text not null,
  name text not null,
  pin text not null,
  status text not null default ''::text,
  constraint userdata_pkey primary key (uid)
) TABLESPACE pg_default;
```

The app expects `userdata` to have at least `uid`, `name`, `pin`, and `status` columns. Status values used in the UI are `active` and `nonActive` (update existing rows accordingly). Optionally add an insert timestamp column (e.g. `created_at`) if you want `dateAdded` to be available in the UI.

