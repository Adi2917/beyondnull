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
https://wrvwpqxrmxgbaslkvspr.supabase.co
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

## Commands

```bash
npm install
npm run dev
npm run build
```
