# BeyondNull

React + Vite website with a private Google Sheets powered admin panel.

## Admin Backend

The backend uses this Google Sheet:

```text
1RvuUQ-vat4j8Ml7QI0TxX2eUwqzI7eRAEswioxx7tPY
```

Admin data is handled by `apps-script-mailer.gs`. PINs, OTPs, and session tokens are stored only as SHA-256 hashes. Employee receipts are kept in a private Google Drive folder and are downloaded through an authenticated admin request.

### First-time setup

1. Open the Sheet using `beyoondnull@gmail.com`.
2. Open `Extensions -> Apps Script`.
3. Replace the editor code with `apps-script-mailer.gs`.
4. Select and run `setupBeyondNullDatabase` once.
5. Approve the requested Sheets, Drive, and Mail permissions.
6. Choose `Deploy -> Manage deployments -> Edit`.
7. Select `New version`, set `Execute as: Me`, and access to `Anyone`.
8. Deploy and copy the `/exec` Web App URL.
9. If the URL changed, replace `SHEETS_API_URL` in `src/services/authService.js`.

The setup creates these tabs automatically:

```text
Clients
Client Services
Employees
Payouts
Sessions
PIN Resets
Resources
```

The initial six-digit admin PIN is `111111`. Change it using Forgot PIN after setup.

## Admin Features

- Secure email and PIN login with 12-hour sessions
- Rate-limited OTP reset sent to the official email
- Client and service records with billing, platforms, dates, and statuses
- Employee profiles with job and salary details
- Monthly payout history and private receipt uploads
- Resource publishing with optional logos, covers, galleries, and article sections
- Published resource images stored in a dedicated public-view Google Drive folder
- Desktop and mobile admin layouts

## Commands

```bash
npm install
npm run dev
npm run build
```
