# BeyondNull

React + Vite website and admin panel for BeyondNull.

## Admin Access

Admin login page:

```text
/admin
```

Admin numbers and PINs are stored in Supabase. Do not show admin credentials on the public site or commit private PINs in frontend code.

## Database

Database provider:

```text
Supabase
```

Project URL used by the app:

```text
https://anovwnwddqlhljkymrvw.supabase.co
```

Tables used by the app:

```text
admins
clients
```

The admin panel uses Supabase as the live backend. It also has a demo-safe local fallback so the dashboard can still be shown if Supabase tables or permissions are not ready during a presentation.

Backend features currently wired:

```text
Admin login
Protected admin routes
Client create/read/update/delete
Client search
Client profile
Call/WhatsApp actions
Supabase + local demo fallback
```

## Supabase Setup

If the Supabase project has no tables, open:

```text
supabase-setup.sql
```

Then run the full SQL in:

```text
Supabase Dashboard -> SQL Editor -> New query -> Run
```

This creates/updates the `admins` and `clients` tables and inserts the configured admin accounts.
It also grants frontend read/write access for the current direct-Supabase admin panel.

Important: run this SQL in the same Supabase project used by the app. The project ref in the app URL is:

```text
anovwnwddqlhljkymrvw
```

If you created a different Supabase project, update these environment variables in your hosting dashboard:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Or update `src/services/supabaseClient.js` with the new Project URL and anon public key.

## Commands

```bash
npm install
npm run dev
npm run build
```
