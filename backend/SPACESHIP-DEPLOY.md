# EsLatin Reservas API — Spaceship

Upload the deployment ZIP into the Node.js application root:

`/home/ibscdiplbm/eslatin-reservas-backend`

After extraction, the application root must contain:

```text
package.json
backend/server.mjs
backend/confirmation-email.mjs
public/brand/eslatin-logo-horizontal.png
```

In **Setup Node.js App**:

1. Keep the startup file as `backend/server.mjs`.
2. Add every variable listed in `spaceship.env.example` using the Environment Variables section. Do not upload a `.env` file.
3. Click **Run NPM Install**.
4. Click **Restart**.
5. Open `https://eslatin.com.co/reservas-api/api/health`.

The health response must contain `"ok": true`, `"mode": "live"`,
`"dingTalkConfigured": true`, `"calendarWorkflow": "organizer-calendar-invitation"`,
and `"confirmationEmailConfigured": true`.

## Partner invitation codes

Reservations are gated by partner codes. Configure these four variables in
**Setup Node.js App → Environment Variables** before restarting the application:

```text
BOOKING_INVITE_REQUIRED=true
BOOKING_INVITE_TOKEN_SECRET=<a private random value of at least 32 characters>
BOOKING_PARTNER_INVITE_HASHES=FAW:<sha256>,ICAR:<sha256>
BOOKING_INVITE_TOKEN_TTL_SECONDS=1800
```

Only the SHA-256 hashes belong on the server. Give each partner its plain-text
code privately and never upload those plain-text codes with the website files.
Run `npm run backend:generate-invites` locally whenever both codes need to be
rotated. After changing a code or the token secret, restart the Node.js app.

The health response must also contain `"invitationRequired": true`,
`"invitationConfigured": true`, and `"invitationPartnerCount": 2`.

## Persistent booking records and administration

Add these variables in **Setup Node.js App → Environment Variables**:

```text
BOOKING_RECORDS_FILE=/home/your_cpanel_user/eslatin-reservas-data/bookings.json
BOOKING_ADMIN_PASSWORD_HASH=<sha256 of the private administrator password>
BOOKING_ADMIN_TOKEN_SECRET=<a private random value of at least 32 characters>
BOOKING_ADMIN_TOKEN_TTL_SECONDS=43200
```

The records file is created automatically with private permissions. Keeping it
outside the application root prevents a later application upload from replacing
the customer records. Do not upload this file into the public website directory.

After restarting, the health response must contain
`"bookingRecordsEnabled": true`, `"bookingAdminConfigured": true`, and
`"sameDayBookingAllowed": false`. The private administration page is available
at `https://eslatin.com.co/survey/admin/`.

The server accepts both `/api/...` and `/reservas-api/api/...` internally so it
works whether Passenger preserves or strips the application URI.
