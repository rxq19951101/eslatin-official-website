# EsLatin local booking backend

The backend runs separately from the static Next.js frontend.

1. Copy `.env.local.example` to `.env.local` if needed.
2. Paste the DingTalk `Client Secret` into `DINGTALK_CLIENT_SECRET` locally.
3. Keep `DINGTALK_STAFF_NAMES=Amos,Guillermo`. Their UserIds are discovered from the app visible scope.
4. Set `DINGTALK_ORGANIZER_USER_ID` to a dedicated non-field account that will create every invitation.
5. Use `DINGTALK_MOCK=true` for a no-write UI test. Change it to `false` for the real DingTalk API.
6. The backend uses the dedicated organizer's writable primary calendar. It does not create or write to a subscribed/public calendar.
7. Add the `support@eslatin.com.co` Spacemail password to `SPACEMAIL_SMTP_PASSWORD`, set `BOOKING_CONFIRMATION_EMAIL_ENABLED=true`, and run `npm run backend:setup-email`.
8. Run `npm run backend`.

Every successful live booking:

- creates one event directly in the dedicated organizer's Spanish-language primary calendar;
- adds the assigned employee to that event as a required attendee with DingTalk chat and push notifications;
- sends a Spanish confirmation from `support@eslatin.com.co` with replies directed to `info@eslatin.com.co`;
- queries and assigns only the employees listed in `DINGTALK_STAFF_NAMES`.

Local endpoints:

- `GET /api/health`
- `GET /api/staff`
- `GET /api/availability?date=YYYY-MM-DD`
- `POST /api/bookings`

The server never sends the Client Secret to the browser and does not include it in logs.
