# EsLatin local booking backend

The backend runs separately from the static Next.js frontend.

1. Copy `.env.local.example` to `.env.local` if needed.
2. Paste the DingTalk `Client Secret` into `DINGTALK_CLIENT_SECRET` locally.
3. Keep `DINGTALK_STAFF_NAMES=Amos,Guillermo`. Their UserIds are discovered from the app visible scope.
4. Set `DINGTALK_ORGANIZER_USER_ID` to a dedicated non-field account that will create every invitation.
5. Use `DINGTALK_MOCK=true` for a no-write UI test. Change it to `false` for the real DingTalk API.
6. The backend uses the dedicated organizer's writable primary calendar. It does not create or write to a subscribed/public calendar.
7. Add the `support@eslatin.com.co` Spacemail password to `SPACEMAIL_SMTP_PASSWORD`, set `BOOKING_CONFIRMATION_EMAIL_ENABLED=true`, and run `npm run backend:setup-email`.
8. Copy `backend/partner-config.example.json` to the path in `BOOKING_PARTNER_CONFIG_FILE` when deploying. The file stores cities, partner names, invitation-code hashes, salespeople, and partner portal password hashes; it must stay outside the public website directory.
9. Run `npm run backend`.

Every successful live booking:

- creates one event directly in the dedicated organizer's Spanish-language primary calendar;
- adds the assigned employee to that event as a required attendee with DingTalk chat and push notifications;
- sends a Spanish confirmation from `support@eslatin.com.co` with replies directed to `info@eslatin.com.co`;
- sends a Spanish lead notification to the selected partner salesperson when that salesperson has been configured;
- queries and assigns only the employees listed in `DINGTALK_STAFF_NAMES`.

Local endpoints:

- `GET /api/health`
- `GET /api/cities`
- `GET /api/partner/options`
- `GET /api/staff`
- `GET /api/sales?cityId=bogota` (requires a valid partner invitation token)
- `GET /api/availability?date=YYYY-MM-DD&cityId=bogota`
- `POST /api/bookings`

## Partner and city management

The public booking flow uses the partner invitation code first, then loads the
active salespeople for the selected city. The customer selects the salesperson
and sends that ID with the booking; the browser never receives invitation-code
hashes or DingTalk credentials.

EsLatin administrators can manage salespeople, cities, and partner portal
accounts at `/survey/admin/partners/` after signing in at `/survey/admin/`.
The same page can create a new partner, generate or replace its invitation code,
set the partner portal password, and add salespeople. No source-code or
environment-variable change is needed for a new partner.
Each partner can then use `/partner-portal/` to maintain its own active
salespeople and city assignments. The portal only exposes that partner's data.

For multiple cities, add an active city through the administration page and
assign the city IDs to salespeople in the partner portal. Technical staff can
be restricted to cities with `BOOKING_STAFF_CITY_ASSIGNMENTS`, for example:

```text
BOOKING_STAFF_CITY_ASSIGNMENTS=Amos:bogota,Guillermo:bogota|medellin
```

If a staff member is not listed in this variable, they remain available for all
active cities. The existing round-robin assignment then runs only among the
available staff for the requested city.

The server never sends the Client Secret to the browser and does not include it in logs.
