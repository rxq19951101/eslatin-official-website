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

Build the static website with `npm run build:webhost`. In production, the
browser automatically calls the same-origin API path `/reservas-api`; a local
`.env.local` value such as `http://127.0.0.1:3002` is ignored by the production
client and must never be uploaded as the live API address.

The health response must contain `"ok": true`, `"mode": "live"`,
`"dingTalkConfigured": true`, `"calendarWorkflow": "organizer-calendar-invitation"`,
and `"confirmationEmailConfigured": true`.

## Partner invitation codes

Reservations are gated by partner codes. The persistent partner configuration
file is the source of truth; administrators can add partners and rotate codes
from `/survey/admin/partners/` without editing code or environment variables.
Keep these variables configured in **Setup Node.js App → Environment Variables**:

```text
BOOKING_INVITE_REQUIRED=true
BOOKING_INVITE_TOKEN_SECRET=<a private random value of at least 32 characters>
BOOKING_PARTNER_INVITE_HASHES=FAW:<sha256>,ICAR:<sha256>
BOOKING_INVITE_TOKEN_TTL_SECONDS=1800
```

`BOOKING_PARTNER_INVITE_HASHES` is an optional bootstrap for the original FAW
and iCAR entries. New partners and all later code changes should be done in the
admin page; only SHA-256 hashes are stored in `partner-config.json`. The plain
text code is shown once after creation or rotation and must be shared privately
with that partner.

The health response must also contain `"invitationRequired": true` and
`"invitationConfigured": true`.

## Persistent booking records and administration

Add these variables in **Setup Node.js App → Environment Variables**:

```text
BOOKING_RECORDS_FILE=/home/your_cpanel_user/eslatin-reservas-data/bookings.json
BOOKING_ADMIN_PASSWORD_HASH=<sha256 of the private administrator password>
BOOKING_ADMIN_TOKEN_SECRET=<a private random value of at least 32 characters>
BOOKING_ADMIN_TOKEN_TTL_SECONDS=43200
BOOKING_PARTNER_CONFIG_FILE=/home/your_cpanel_user/eslatin-reservas-data/partner-config.json
BOOKING_PARTNER_MANAGER_TOKEN_SECRET=<a private random value of at least 32 characters>
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

## Partner sales and cities

After logging into `https://eslatin.com.co/survey/admin/`, open
`/survey/admin/partners/` to:

- create a partner with an ID and name; leave the invitation-code field empty
  to generate a code automatically;
- copy the generated invitation code and send it privately to that partner;
- set or rotate the partner portal password;
- add or edit a partner salesperson name and email;
- assign a salesperson to one or more active cities;
- set the partner portal password;
- add future service cities and their default 08:00–17:00 service window.

Share `/partner-portal/` and the partner's private password with each partner.
Each partner account can only read and edit its own salespeople. The booking
page uses the invitation code and city to show the matching sales list. The
selected salesperson receives a Spanish email with the customer details after
the booking is confirmed.
