# BeyondNull

React + Vite website and admin panel for BeyondNull.

## Admin Access

Admin login page:

```text
/admin
```

Admin email, admin numbers, PINs, and reset OTP records are stored in Supabase. Do not show admin credentials on the public site or commit private PINs in frontend code.

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
Email + PIN login
Token based admin session
Supabase backend service layer
```

Security mode:

```text
Only the two registered BeyondNull admins can login.
Client records are blocked by RLS and can be accessed only through a valid admin session token.
Forgot PIN reset works only with the official email and the two registered admin numbers.
```

OTP email uses the existing Google Apps Script mail bridge. The React app sends `subject`, `plainMessage`, and `htmlMessage` fields for the professional security email.

If Gmail still shows `New Website Lead`, the deployed Apps Script is still using the old contact-form template. Open the Apps Script project, replace its code with:

```text
apps-script-mailer.gs
```

Then deploy it as a Web App again. If Google gives a new Web App URL, update `CONTACT_SCRIPT_URL` in `src/services/authService.js`.

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
