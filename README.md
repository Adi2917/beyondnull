# BeyondNull

React + Vite website and admin panel for BeyondNull.

## Admin Access

Admin login page:

```text
/admin
```

Admin numbers:

```text
7485875137
6205475866
```

Admin PIN:

```text
112233
```

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

## Supabase Setup

If the Supabase project has no tables, open:

```text
supabase-setup.sql
```

Then run the full SQL in:

```text
Supabase Dashboard -> SQL Editor -> New query -> Run
```

This creates the `admins` and `clients` tables and inserts the two admin numbers with PIN `112233`.
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
