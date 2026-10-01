const configuredApiUrl = process.env.NEXT_PUBLIC_BOOKING_API_URL?.trim() || ""

function isLocalApiUrl(value: string) {
  try {
    const hostname = new URL(value).hostname
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"
  } catch {
    return false
  }
}

// Static production builds must never ship a developer's localhost URL. The
// Spaceship deployment serves the API under the same origin at /reservas-api.
export const BOOKING_API_URL = process.env.NODE_ENV === "production" && (!configuredApiUrl || isLocalApiUrl(configuredApiUrl))
  ? "/reservas-api"
  : configuredApiUrl || "http://127.0.0.1:3002"
