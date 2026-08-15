import { createServer } from "node:http"
import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto"
import { mkdir, readFile, rename, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import {
  confirmationEmailStatus,
  sendConfirmationEmail,
  verifyConfirmationEmail,
} from "./confirmation-email.mjs"

const PORT = Number(process.env.PORT || process.env.BOOKING_BACKEND_PORT || 3002)
const HOST = process.env.BOOKING_BACKEND_HOST?.trim() || (process.env.PORT ? "0.0.0.0" : "127.0.0.1")
const BOOKING_BASE_PATH = normalizeBasePath(process.env.BOOKING_BASE_PATH || "")
const BOGOTA_TIME_ZONE = "America/Bogota"
const SLOT_HOURS = Array.from({ length: 9 }, (_, index) => 8 + index)
const MAX_BOOKING_DAYS = 10
const MAX_BODY_BYTES = 32_768
const MOCK_MODE = process.env.DINGTALK_MOCK !== "false"
const BOOKING_RECORDS_FILE = process.env.BOOKING_RECORDS_FILE?.trim()
  || join(process.cwd(), "backend", ".booking-records.json")
const allowedOrigins = new Set(
  (process.env.BOOKING_ALLOWED_ORIGINS || "http://127.0.0.1:3001,http://localhost:3001")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
)
const staffNameAllowlist = (process.env.DINGTALK_STAFF_NAMES || "")
  .split(",")
  .map((name) => name.trim())
  .filter(Boolean)
const explicitStaffIds = (process.env.DINGTALK_STAFF_USER_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean)
const organizerUserId = process.env.DINGTALK_ORGANIZER_USER_ID?.trim()
const organizerName = process.env.DINGTALK_ORGANIZER_NAME?.trim()
const INVITE_REQUIRED = process.env.BOOKING_INVITE_REQUIRED === "true"
const INVITE_TOKEN_TTL_SECONDS = Math.min(
  3_600,
  Math.max(300, Number(process.env.BOOKING_INVITE_TOKEN_TTL_SECONDS || 1_800)),
)
const inviteTokenSecret = process.env.BOOKING_INVITE_TOKEN_SECRET?.trim() || ""
const PARTNER_DEFINITIONS = {
  FAW: { id: "faw", name: "FAW" },
  ICAR: { id: "icar", name: "iCAR" },
}
const partnerInviteHashes = parsePartnerInviteHashes(process.env.BOOKING_PARTNER_INVITE_HASHES || "")
const adminPasswordHash = process.env.BOOKING_ADMIN_PASSWORD_HASH?.trim().toLowerCase() || ""
const adminTokenSecret = process.env.BOOKING_ADMIN_TOKEN_SECRET?.trim() || ""
const ADMIN_TOKEN_TTL_SECONDS = Math.min(
  86_400,
  Math.max(900, Number(process.env.BOOKING_ADMIN_TOKEN_TTL_SECONDS || 43_200)),
)

let tokenCache = null
let staffCache = null
let organizerCache = null
let organizerCalendarCache = null
let nextAssignmentIndex = 0
const mockBookings = []
const bookingLocks = new Set()
const inviteAttempts = new Map()
const adminLoginAttempts = new Map()
let bookingRecordWriteQueue = Promise.resolve()

class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message)
    this.status = status
    this.code = code
    this.details = details
  }
}

function parsePartnerInviteHashes(value) {
  const entries = new Map()
  for (const item of String(value || "").split(",")) {
    const separator = item.indexOf(":")
    if (separator < 1) continue
    const key = item.slice(0, separator).trim().toUpperCase()
    const hash = item.slice(separator + 1).trim().toLowerCase()
    if (!PARTNER_DEFINITIONS[key] || !/^[a-f0-9]{64}$/.test(hash)) continue
    entries.set(key, { ...PARTNER_DEFINITIONS[key], hash })
  }
  return entries
}

function assertInviteConfigured() {
  if (inviteTokenSecret.length < 32 || partnerInviteHashes.size !== Object.keys(PARTNER_DEFINITIONS).length) {
    throw new ApiError(
      503,
      "INVITE_SYSTEM_NOT_CONFIGURED",
      "Partner invitation access is not configured correctly.",
    )
  }
}

function inviteClientKey(request) {
  const forwarded = request.headers["cf-connecting-ip"] || request.headers["x-forwarded-for"]
  return String(Array.isArray(forwarded) ? forwarded[0] : forwarded || request.socket.remoteAddress || "unknown")
    .split(",")[0]
    .trim()
}

function checkInviteRateLimit(request) {
  const key = inviteClientKey(request)
  const now = Date.now()
  const current = inviteAttempts.get(key)
  if (!current || current.resetAt <= now) {
    inviteAttempts.set(key, { count: 0, resetAt: now + 15 * 60 * 1000 })
    return key
  }
  if (current.count >= 10) {
    throw new ApiError(429, "INVITE_RATE_LIMITED", "Too many invitation code attempts. Try again later.")
  }
  return key
}

function recordInviteFailure(key) {
  const current = inviteAttempts.get(key) || { count: 0, resetAt: Date.now() + 15 * 60 * 1000 }
  inviteAttempts.set(key, { ...current, count: current.count + 1 })
}

function hashInviteCode(value) {
  return createHash("sha256").update(value).digest()
}

function normalizeInviteCode(value) {
  const normalized = String(value || "").trim().toUpperCase()
  if (!/^[A-Z0-9-]{6,64}$/.test(normalized)) {
    throw new ApiError(401, "INVITE_INVALID", "Invitation code is invalid.")
  }
  return normalized
}

function verifyPartnerInviteCode(value, request) {
  assertInviteConfigured()
  const clientKey = checkInviteRateLimit(request)
  let normalized
  try {
    normalized = normalizeInviteCode(value)
  } catch (error) {
    recordInviteFailure(clientKey)
    throw error
  }
  const candidate = hashInviteCode(normalized)
  for (const partner of partnerInviteHashes.values()) {
    const expected = Buffer.from(partner.hash, "hex")
    if (expected.length === candidate.length && timingSafeEqual(expected, candidate)) {
      inviteAttempts.delete(clientKey)
      return { id: partner.id, name: partner.name }
    }
  }
  recordInviteFailure(clientKey)
  throw new ApiError(401, "INVITE_INVALID", "Invitation code is invalid.")
}

function createInviteToken(partner) {
  assertInviteConfigured()
  const expiresAt = Math.floor(Date.now() / 1000) + INVITE_TOKEN_TTL_SECONDS
  const encoded = Buffer.from(JSON.stringify({ v: 1, partnerId: partner.id, exp: expiresAt })).toString("base64url")
  const signature = createHmac("sha256", inviteTokenSecret).update(encoded).digest("base64url")
  return { token: `${encoded}.${signature}`, expiresAt }
}

function verifyInviteToken(token) {
  assertInviteConfigured()
  const [encoded, signature, extra] = String(token || "").split(".")
  if (!encoded || !signature || extra) {
    throw new ApiError(401, "INVITE_TOKEN_INVALID", "Invitation access is invalid.")
  }
  const expected = createHmac("sha256", inviteTokenSecret).update(encoded).digest()
  let received
  try {
    received = Buffer.from(signature, "base64url")
  } catch {
    throw new ApiError(401, "INVITE_TOKEN_INVALID", "Invitation access is invalid.")
  }
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    throw new ApiError(401, "INVITE_TOKEN_INVALID", "Invitation access is invalid.")
  }
  let payload
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"))
  } catch {
    throw new ApiError(401, "INVITE_TOKEN_INVALID", "Invitation access is invalid.")
  }
  if (payload.v !== 1 || !Number.isInteger(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000)) {
    throw new ApiError(401, "INVITE_TOKEN_EXPIRED", "Invitation access has expired.")
  }
  const partner = [...partnerInviteHashes.values()].find((item) => item.id === payload.partnerId)
  if (!partner) throw new ApiError(401, "INVITE_TOKEN_INVALID", "Invitation access is invalid.")
  return { id: partner.id, name: partner.name }
}

function invitationFromRequest(request) {
  const authorization = request.headers.authorization || ""
  const match = /^Bearer\s+(.+)$/i.exec(String(authorization))
  if (!match) {
    if (INVITE_REQUIRED) throw new ApiError(401, "INVITE_REQUIRED", "A valid invitation code is required.")
    return null
  }
  return verifyInviteToken(match[1])
}

function assertAdminConfigured() {
  if (!/^[a-f0-9]{64}$/.test(adminPasswordHash) || adminTokenSecret.length < 32) {
    throw new ApiError(503, "ADMIN_NOT_CONFIGURED", "Booking administration is not configured correctly.")
  }
}

function checkAdminLoginRateLimit(request) {
  const key = inviteClientKey(request)
  const now = Date.now()
  const current = adminLoginAttempts.get(key)
  if (!current || current.resetAt <= now) {
    adminLoginAttempts.set(key, { count: 0, resetAt: now + 15 * 60 * 1000 })
    return key
  }
  if (current.count >= 5) {
    throw new ApiError(429, "ADMIN_LOGIN_RATE_LIMITED", "Too many login attempts. Try again later.")
  }
  return key
}

function verifyAdminPassword(value, request) {
  assertAdminConfigured()
  const clientKey = checkAdminLoginRateLimit(request)
  const candidate = createHash("sha256").update(String(value || "")).digest()
  const expected = Buffer.from(adminPasswordHash, "hex")
  if (candidate.length !== expected.length || !timingSafeEqual(candidate, expected)) {
    const current = adminLoginAttempts.get(clientKey)
      || { count: 0, resetAt: Date.now() + 15 * 60 * 1000 }
    adminLoginAttempts.set(clientKey, { ...current, count: current.count + 1 })
    throw new ApiError(401, "ADMIN_LOGIN_INVALID", "Administrator password is invalid.")
  }
  adminLoginAttempts.delete(clientKey)
}

function createAdminToken() {
  assertAdminConfigured()
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_TOKEN_TTL_SECONDS
  const encoded = Buffer.from(JSON.stringify({ v: 1, kind: "booking-admin", exp: expiresAt })).toString("base64url")
  const signature = createHmac("sha256", adminTokenSecret).update(encoded).digest("base64url")
  return { token: `${encoded}.${signature}`, expiresAt }
}

function verifyAdminToken(token) {
  assertAdminConfigured()
  const [encoded, signature, extra] = String(token || "").split(".")
  if (!encoded || !signature || extra) {
    throw new ApiError(401, "ADMIN_TOKEN_INVALID", "Administrator access is invalid.")
  }
  const expected = createHmac("sha256", adminTokenSecret).update(encoded).digest()
  const received = Buffer.from(signature, "base64url")
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    throw new ApiError(401, "ADMIN_TOKEN_INVALID", "Administrator access is invalid.")
  }
  let payload
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"))
  } catch {
    throw new ApiError(401, "ADMIN_TOKEN_INVALID", "Administrator access is invalid.")
  }
  if (
    payload.v !== 1
    || payload.kind !== "booking-admin"
    || !Number.isInteger(payload.exp)
    || payload.exp <= Math.floor(Date.now() / 1000)
  ) {
    throw new ApiError(401, "ADMIN_TOKEN_EXPIRED", "Administrator access has expired.")
  }
  return payload
}

function requireAdmin(request) {
  const authorization = request.headers.authorization || ""
  const match = /^Bearer\s+(.+)$/i.exec(String(authorization))
  if (!match) throw new ApiError(401, "ADMIN_REQUIRED", "Administrator access is required.")
  return verifyAdminToken(match[1])
}

async function readBookingRecordStore() {
  try {
    const parsed = JSON.parse(await readFile(BOOKING_RECORDS_FILE, "utf8"))
    return {
      version: 1,
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
    }
  } catch (error) {
    if (error?.code === "ENOENT") return { version: 1, bookings: [] }
    throw error
  }
}

async function writeBookingRecordStore(store) {
  await mkdir(dirname(BOOKING_RECORDS_FILE), { recursive: true })
  const temporaryFile = `${BOOKING_RECORDS_FILE}.${randomUUID()}.tmp`
  await writeFile(temporaryFile, `${JSON.stringify(store, null, 2)}\n`, { mode: 0o600 })
  await rename(temporaryFile, BOOKING_RECORDS_FILE)
}

function mutateBookingRecordStore(mutator) {
  const operation = bookingRecordWriteQueue.then(async () => {
    const store = await readBookingRecordStore()
    const result = await mutator(store)
    await writeBookingRecordStore(store)
    return result
  })
  bookingRecordWriteQueue = operation.catch(() => {})
  return operation
}

function saveBookingRecord(record) {
  return mutateBookingRecordStore((store) => {
    const index = store.bookings.findIndex((item) => item.id === record.id)
    if (index >= 0) store.bookings[index] = { ...store.bookings[index], ...record }
    else store.bookings.push(record)
    return record
  })
}

async function listBookingRecords(url) {
  await bookingRecordWriteQueue.catch(() => {})
  const store = await readBookingRecordStore()
  const scope = ["upcoming", "past", "all"].includes(url.searchParams.get("scope"))
    ? url.searchParams.get("scope")
    : "upcoming"
  const today = bogotaDate(0)
  const filtered = store.bookings.filter((booking) => {
    if (scope === "upcoming") return booking.date >= today
    if (scope === "past") return booking.date < today
    return true
  })
  filtered.sort((left, right) => {
    const direction = scope === "past" ? -1 : 1
    return `${left.date}T${left.time}`.localeCompare(`${right.date}T${right.time}`) * direction
  })
  return { bookings: filtered.slice(0, 500), total: filtered.length, scope, today }
}

function normalizeBasePath(value) {
  const trimmed = String(value || "").trim()
  if (!trimmed || trimmed === "/") return ""
  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`
}

function routePath(pathname) {
  if (!BOOKING_BASE_PATH) return pathname
  if (pathname === BOOKING_BASE_PATH) return "/"
  if (pathname.startsWith(`${BOOKING_BASE_PATH}/`)) {
    return pathname.slice(BOOKING_BASE_PATH.length)
  }
  return pathname
}

function jsonResponse(response, status, data, origin) {
  if (origin && allowedOrigins.has(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin)
    response.setHeader("Vary", "Origin")
  }
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  })
  response.end(JSON.stringify(data))
}

function htmlResponse(response, status, html) {
  response.writeHead(status, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  })
  response.end(html)
}

function bogotaDate(offsetDays = 0) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BOGOTA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date())
  const value = (type) => Number(parts.find((part) => part.type === type)?.value)
  return new Date(Date.UTC(value("year"), value("month") - 1, value("day") + offsetDays))
    .toISOString()
    .slice(0, 10)
}

function assertFutureDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) {
    throw new ApiError(400, "INVALID_DATE", "Date must use YYYY-MM-DD.")
  }
  const parsed = new Date(`${date}T00:00:00Z`)
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date ||
    date < bogotaDate(1) ||
    date > bogotaDate(MAX_BOOKING_DAYS)
  ) {
    throw new ApiError(
      400,
      "DATE_OUT_OF_RANGE",
      `The appointment date must be between tomorrow and the next ${MAX_BOOKING_DAYS} days in Bogotá.`,
    )
  }
}

function slotRange(date, time) {
  if (!SLOT_HOURS.some((hour) => `${String(hour).padStart(2, "0")}:00` === time)) {
    throw new ApiError(400, "INVALID_TIME", "Time must be an hourly slot from 08:00 through 16:00.")
  }
  const hour = Number(time.slice(0, 2))
  const start = new Date(`${date}T${String(hour).padStart(2, "0")}:00:00-05:00`)
  const end = new Date(start.getTime() + 60 * 60 * 1000)
  return { start, end }
}

function formatDingTalkUtc(date) {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z")
}

async function parseBody(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) {
      throw new ApiError(413, "BODY_TOO_LARGE", "Request body is too large.")
    }
    chunks.push(chunk)
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}")
  } catch {
    throw new ApiError(400, "INVALID_JSON", "Request body must be valid JSON.")
  }
}

function validateBooking(input) {
  const required = ["name", "address", "phone", "email", "date", "time"]
  for (const field of required) {
    if (typeof input[field] !== "string" || !input[field].trim()) {
      throw new ApiError(400, "MISSING_FIELD", `Missing required field: ${field}.`)
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    throw new ApiError(400, "INVALID_EMAIL", "Email address is invalid.")
  }
  let localPhone = input.phone.replace(/\D/g, "")
  if (localPhone.startsWith("0057") && localPhone.length > 10) localPhone = localPhone.slice(4)
  if (localPhone.startsWith("57") && localPhone.length > 10) localPhone = localPhone.slice(2)
  if (localPhone.length < 7 || localPhone.length > 10) {
    throw new ApiError(400, "INVALID_PHONE", "Enter a valid Colombian phone number.")
  }
  assertFutureDate(input.date)
  slotRange(input.date, input.time)
  return {
    name: input.name.trim().slice(0, 120),
    address: input.address.trim().slice(0, 300),
    phone: localPhone,
    formattedPhone: `+57 ${localPhone}`,
    email: input.email.trim().slice(0, 200),
    date: input.date,
    time: input.time,
  }
}

function createBookingCode(date) {
  const datePart = date.replaceAll("-", "").slice(2)
  const randomPart = randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase()
  return `ESL-${datePart}-${randomPart}`
}

async function getAccessToken() {
  const clientId = process.env.DINGTALK_CLIENT_ID?.trim()
  const clientSecret = process.env.DINGTALK_CLIENT_SECRET?.trim()
  if (!clientId || !clientSecret) {
    throw new ApiError(
      503,
      "DINGTALK_NOT_CONFIGURED",
      "DingTalk Client ID or Client Secret is missing from .env.local.",
    )
  }
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.value

  const response = await fetch("https://api.dingtalk.com/v1.0/oauth2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ appKey: clientId, appSecret: clientSecret }),
    signal: AbortSignal.timeout(12_000),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data.accessToken) {
    throw new ApiError(
      502,
      "DINGTALK_AUTH_FAILED",
      data.message || "DingTalk authentication failed.",
      { dingTalkCode: data.code },
    )
  }
  tokenCache = {
    value: data.accessToken,
    expiresAt: Date.now() + Math.max(60, Number(data.expireIn || 7200) - 300) * 1000,
  }
  return tokenCache.value
}

async function dingTalkRequest(path, { method = "GET", body, clientToken } = {}) {
  const token = await getAccessToken()
  const response = await fetch(`https://api.dingtalk.com${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-acs-dingtalk-access-token": token,
      ...(clientToken ? { "x-client-token": clientToken } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(12_000),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.code) {
    throw new ApiError(
      response.status >= 400 && response.status < 500 ? response.status : 502,
      "DINGTALK_API_ERROR",
      data.message || data.errmsg || "DingTalk API request failed.",
      { dingTalkCode: data.code || data.errcode },
    )
  }
  return data
}

async function oapiRequest(path, body) {
  const token = await getAccessToken()
  const url = new URL(`https://oapi.dingtalk.com${path}`)
  url.searchParams.set("access_token", token)
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(12_000),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || Number(data.errcode || 0) !== 0) {
    throw new ApiError(
      response.status >= 400 && response.status < 500 ? response.status : 502,
      "DINGTALK_API_ERROR",
      data.errmsg || "DingTalk API request failed.",
      { dingTalkCode: data.errcode },
    )
  }
  return data
}

async function getUserDetails(userId) {
  const data = await oapiRequest("/topapi/v2/user/get", { userid: userId, language: "zh_CN" })
  const result = data.result || {}
  if (!result.unionid) {
    throw new ApiError(502, "DINGTALK_CALENDAR_ID_NOT_FOUND", "DingTalk did not return the employee UnionId.")
  }
  return {
    userId: result.userid || userId,
    calendarUserId: result.unionid,
    name: result.name || userId,
    active: result.active !== false,
  }
}

async function searchStaffByAllowedNames() {
  const employees = []
  for (const name of staffNameAllowlist) {
    const result = await dingTalkRequest("/v1.0/contact/users/search", {
      method: "POST",
      body: { queryWord: name, offset: 0, size: 20, fullMatchField: 1 },
    })
    const userIds = Array.isArray(result.list) ? result.list : []
    if (userIds.length === 1) {
      const employee = await getUserDetails(userIds[0])
      employees.push({ ...employee, name })
    } else if (userIds.length > 1) {
      throw new ApiError(
        409,
        "AMBIGUOUS_STAFF_NAME",
        `More than one DingTalk employee matched the configured name: ${name}.`,
      )
    }
  }
  return employees
}

async function listUsersInDepartment(departmentId) {
  const employees = []
  let cursor = 0
  for (let page = 0; page < 20; page += 1) {
    const data = await oapiRequest("/topapi/v2/user/list", {
      dept_id: departmentId,
      cursor,
      size: 100,
      contain_access_limit: true,
      language: "en_US",
    })
    const result = data.result || {}
    for (const employee of result.list || []) {
      employees.push({
        userId: employee.userid,
        calendarUserId: employee.unionid,
        name: employee.name || employee.userid,
        active: employee.active !== false,
      })
    }
    if (!result.has_more) break
    cursor = Number(result.next_cursor || 0)
  }
  return employees
}

async function listVisibleStaffFromDepartments() {
  const queue = [1]
  const visited = new Set()
  const employees = []
  while (queue.length && visited.size < 200) {
    const departmentId = queue.shift()
    if (visited.has(departmentId)) continue
    visited.add(departmentId)
    employees.push(...await listUsersInDepartment(departmentId))
    try {
      const data = await oapiRequest("/topapi/v2/department/listsubid", { dept_id: departmentId })
      for (const childId of data.result?.dept_id_list || []) {
        if (!visited.has(childId)) queue.push(childId)
      }
    } catch (error) {
      if (departmentId === 1 && employees.length === 0) throw error
    }
  }
  return employees
}

function filterAndDedupeStaff(employees) {
  const byId = new Map()
  for (const employee of employees) {
    if (!employee.userId || employee.active === false) continue
    if (
      staffNameAllowlist.length &&
      !staffNameAllowlist.some((name) => name.toLocaleLowerCase() === employee.name.toLocaleLowerCase())
    ) continue
    byId.set(employee.userId, employee)
  }
  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name))
}

async function getStaff({ refresh = false } = {}) {
  if (MOCK_MODE) {
    return (staffNameAllowlist.length ? staffNameAllowlist : ["Amos", "Guillermo"]).map((name, index) => ({
      userId: `mock-${index + 1}`,
      calendarUserId: `mock-${index + 1}`,
      name,
      active: true,
    }))
  }
  if (!refresh && staffCache && Date.now() < staffCache.expiresAt) return staffCache.value

  let employees = []
  if (explicitStaffIds.length) {
    employees = await Promise.all(explicitStaffIds.map(getUserDetails))
  } else if (staffNameAllowlist.length) {
    employees = filterAndDedupeStaff(await searchStaffByAllowedNames())
  } else {
    employees = await listVisibleStaffFromDepartments()
    employees = filterAndDedupeStaff(employees)
  }

  employees = filterAndDedupeStaff(employees)
  if (!employees.length) {
    throw new ApiError(
      503,
      "NO_ASSIGNABLE_STAFF",
      "No assignable employee was found in the app visible scope.",
    )
  }
  staffCache = { value: employees, expiresAt: Date.now() + 5 * 60 * 1000 }
  return employees
}

async function getOrganizer({ refresh = false } = {}) {
  if (MOCK_MODE) {
    return {
      userId: "mock-organizer",
      calendarUserId: "mock-organizer",
      name: organizerName || "EsLatin Reservas",
      active: true,
    }
  }
  if (!refresh && organizerCache && Date.now() < organizerCache.expiresAt) {
    return organizerCache.value
  }

  let organizer
  if (organizerUserId) {
    organizer = await getUserDetails(organizerUserId)
  } else if (organizerName) {
    const result = await dingTalkRequest("/v1.0/contact/users/search", {
      method: "POST",
      body: { queryWord: organizerName, offset: 0, size: 20, fullMatchField: 1 },
    })
    const userIds = Array.isArray(result.list) ? result.list : []
    if (userIds.length !== 1) {
      throw new ApiError(
        userIds.length ? 409 : 503,
        userIds.length ? "AMBIGUOUS_ORGANIZER_NAME" : "INVITATION_ORGANIZER_NOT_FOUND",
        userIds.length
          ? `More than one DingTalk employee matched the organizer name: ${organizerName}.`
          : `The DingTalk invitation organizer was not found: ${organizerName}.`,
      )
    }
    organizer = await getUserDetails(userIds[0])
  } else {
    throw new ApiError(
      503,
      "INVITATION_ORGANIZER_NOT_CONFIGURED",
      "DINGTALK_ORGANIZER_USER_ID or DINGTALK_ORGANIZER_NAME must be configured.",
    )
  }

  if (!organizer.active) {
    throw new ApiError(503, "INVITATION_ORGANIZER_INACTIVE", "The DingTalk invitation organizer is inactive.")
  }
  organizerCache = { value: organizer, expiresAt: Date.now() + 5 * 60 * 1000 }
  return organizer
}

function mockSchedule(staff, start, end) {
  return staff.map((employee) => ({
    userId: employee.userId,
    scheduleItems: mockBookings
      .filter((booking) => booking.userId === employee.userId && booking.start < end && booking.end > start)
      .map((booking) => ({
        start: { dateTime: booking.start.toISOString() },
        end: { dateTime: booking.end.toISOString() },
        status: "BUSY",
      })),
  }))
}

async function querySchedule(staff, start, end) {
  if (MOCK_MODE) return mockSchedule(staff, start, end)
  const operatorId = staff[0].calendarUserId
  const result = await dingTalkRequest(
    `/v1.0/calendar/users/${encodeURIComponent(operatorId)}/querySchedule`,
    {
      method: "POST",
      body: {
        userIds: staff.map((employee) => employee.calendarUserId),
        startTime: formatDingTalkUtc(start),
        endTime: formatDingTalkUtc(end),
      },
    },
  )
  return result.scheduleInformation || []
}

function itemRange(item) {
  if (item.status?.toUpperCase() === "FREE") return null
  const startValue = item.start?.dateTime || (item.start?.date ? `${item.start.date}T00:00:00-05:00` : null)
  const endValue = item.end?.dateTime || (item.end?.date ? `${item.end.date}T00:00:00-05:00` : null)
  if (!startValue || !endValue) return null
  const start = new Date(startValue)
  const end = new Date(endValue)
  return Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) ? null : { start, end }
}

function isEmployeeFree(schedule, employee, slotStart, slotEnd) {
  const employeeSchedule = schedule.find((item) => item.userId === employee.calendarUserId)
  if (employeeSchedule?.error) return false
  const busyRanges = (employeeSchedule?.scheduleItems || [])
    .map(itemRange)
    .filter((range) => range && range.start < slotEnd && range.end > slotStart)
  return busyRanges.length === 0
}

async function getAvailability(date) {
  assertFutureDate(date)
  const staff = await getStaff()
  const firstSlot = `${String(SLOT_HOURS[0]).padStart(2, "0")}:00`
  const dayStart = slotRange(date, firstSlot).start
  const dayEnd = new Date(dayStart.getTime() + SLOT_HOURS.length * 60 * 60 * 1000)
  const schedule = await querySchedule(staff, dayStart, dayEnd)
  const slots = SLOT_HOURS.map((hour) => {
    const time = `${String(hour).padStart(2, "0")}:00`
    const { start, end } = slotRange(date, time)
    const availableStaff = staff.filter((employee) => isEmployeeFree(schedule, employee, start, end))
    return { time, available: availableStaff.length > 0, availableStaffCount: availableStaff.length }
  })
  return { date, slots, staffCount: staff.length }
}

function calendarEventBody(booking, employee, { shared = false } = {}) {
  const partnerLabel = booking.partner ? ` — ${booking.partner.name}` : ""
  return {
    summary: shared
      ? `Reserva EsLatin${partnerLabel} — ${booking.name} — ${employee.name}`
      : `Visita técnica EsLatin${partnerLabel} — ${booking.name}`,
    description: [
      "Reserva recibida desde eslatin.co",
      ...(booking.partner ? [`Empresa asociada: ${booking.partner.name}`] : []),
      `Técnico asignado: ${employee.name}`,
      `Cliente: ${booking.name}`,
      `Teléfono/WhatsApp: ${booking.formattedPhone}`,
      `Correo: ${booking.email}`,
      `Dirección: ${booking.address}`,
      `Fecha y hora: ${booking.date}, ${booking.time}–${String(Number(booking.time.slice(0, 2)) + 1).padStart(2, "0")}:00`,
      "Duración: 1 hora",
      `Número de reserva: ${booking.code}`,
    ].join("\n"),
    start: { dateTime: `${booking.date}T${booking.time}:00-05:00`, timeZone: BOGOTA_TIME_ZONE },
    end: {
      dateTime: `${booking.date}T${String(Number(booking.time.slice(0, 2)) + 1).padStart(2, "0")}:00:00-05:00`,
      timeZone: BOGOTA_TIME_ZONE,
    },
    location: { displayName: booking.address },
    freeBusyStatus: "busy",
    reminders: [{ method: "dingtalk", minutes: 30 }],
  }
}

async function getOrganizerCalendar({ refresh = false } = {}) {
  const organizer = await getOrganizer()
  if (MOCK_MODE) {
    return {
      calendarId: "mock-shared",
      ownerUnionId: organizer.calendarUserId,
      type: "primary",
      mock: true,
    }
  }
  if (!refresh && organizerCalendarCache) return organizerCalendarCache
  const result = await dingTalkRequest(
    `/v1.0/calendar/users/${encodeURIComponent(organizer.calendarUserId)}/calendars`,
  )
  const calendars = result.response?.calendars || result.calendars || []
  const primary = calendars.find((calendar) => calendar.type === "primary" && calendar.id)
  if (!primary) {
    throw new ApiError(
      503,
      "ORGANIZER_PRIMARY_CALENDAR_NOT_FOUND",
      "DingTalk did not return a writable primary calendar for the invitation organizer.",
    )
  }
  organizerCalendarCache = {
    calendarId: primary.id,
    ownerUnionId: organizer.calendarUserId,
    type: primary.type,
    privilege: primary.privilege,
  }
  return organizerCalendarCache
}

async function createSharedCalendarInvitation(staff, employee, booking, start, end) {
  if (MOCK_MODE) {
    const id = `mock-shared-invitation-${randomUUID()}`
    mockBookings.push({ id, userId: employee.userId, start, end })
    return {
      id,
      calendarId: "mock-shared",
      organizer: organizerName || "EsLatin Reservas",
      invitedEmployee: employee.name,
    }
  }
  const organizer = await getOrganizer()
  const organizerCalendar = await getOrganizerCalendar()
  const invitationBody = {
    ...calendarEventBody(booking, employee, { shared: true }),
    summary: `Visita técnica EsLatin${booking.partner ? ` — ${booking.partner.name}` : ""} — ${booking.name} — ${employee.name}`,
    freeBusyStatus: "busy",
  }
  const event = await dingTalkRequest(
    `/v1.0/calendar/users/${encodeURIComponent(organizer.calendarUserId)}/calendars/${encodeURIComponent(organizerCalendar.calendarId)}/events`,
    {
      method: "POST",
      clientToken: randomUUID(),
      body: invitationBody,
    },
  )
  if (!event.id) {
    throw new ApiError(502, "INVITATION_EVENT_ID_MISSING", "DingTalk did not return the invitation event ID.")
  }

  try {
    await dingTalkRequest(
      `/v1.0/calendar/users/${encodeURIComponent(organizer.calendarUserId)}/calendars/${encodeURIComponent(organizerCalendar.calendarId)}/events/${encodeURIComponent(event.id)}/attendees`,
      {
        method: "POST",
        clientToken: randomUUID(),
        body: {
          attendeesToAdd: [{ id: employee.calendarUserId, isOptional: false }],
          chatNotification: true,
          pushNotification: true,
        },
      },
    )
  } catch (error) {
    await dingTalkRequest(
      `/v1.0/calendar/users/${encodeURIComponent(organizer.calendarUserId)}/calendars/${encodeURIComponent(organizerCalendar.calendarId)}/events/${encodeURIComponent(event.id)}`,
      { method: "DELETE", clientToken: randomUUID() },
    ).catch((rollbackError) => {
      console.error("Could not roll back organizer calendar event:", rollbackError.message)
    })
    throw error
  }

  return {
    ...event,
    calendarId: organizerCalendar.calendarId,
    organizer: organizer.name,
    invitedEmployee: employee.name,
  }
}

async function bookAppointment(input, partner) {
  const booking = { ...validateBooking(input), code: createBookingCode(input.date), partner }
  const lockKey = `${booking.date}-${booking.time}`
  if (bookingLocks.has(lockKey)) {
    throw new ApiError(409, "SLOT_CHANGED", "This time is being booked. Please choose another slot.")
  }
  bookingLocks.add(lockKey)
  try {
    const staff = await getStaff()
    const { start, end } = slotRange(booking.date, booking.time)
    const schedule = await querySchedule(staff, start, end)
    const available = staff.filter((employee) => isEmployeeFree(schedule, employee, start, end))
    if (!available.length) {
      throw new ApiError(409, "SLOT_UNAVAILABLE", "This time is no longer available.")
    }
    const employee = available[nextAssignmentIndex % available.length]
    nextAssignmentIndex += 1
    const invitationResult = await createSharedCalendarInvitation(staff, employee, booking, start, end)
    const createdAt = new Date().toISOString()
    const record = {
      id: invitationResult.id,
      bookingCode: booking.code,
      createdAt,
      status: "confirmed",
      date: booking.date,
      time: booking.time,
      endTime: `${String(Number(booking.time.slice(0, 2)) + 1).padStart(2, "0")}:00`,
      durationMinutes: 60,
      customer: {
        name: booking.name,
        address: booking.address,
        phone: booking.formattedPhone,
        email: booking.email,
      },
      assignedTo: {
        name: employee.name,
        userId: employee.userId,
      },
      partner: booking.partner ? { id: booking.partner.id, name: booking.partner.name } : null,
      calendar: {
        eventId: invitationResult.id,
        calendarId: invitationResult.calendarId,
        organizer: invitationResult.organizer,
        invitationSent: true,
      },
      confirmationEmail: {
        configured: confirmationEmailStatus().configured,
        sent: false,
        status: "pending",
      },
    }
    await saveBookingRecord(record)
    const emailResult = await Promise.resolve()
      .then(() => sendConfirmationEmail(booking, employee))
      .then(
        (value) => ({ status: "fulfilled", value }),
        (reason) => ({ status: "rejected", reason }),
      )
    if (emailResult.status === "rejected") {
      console.error("Confirmation email failed:", emailResult.reason?.message || emailResult.reason)
    }
    const emailStatus = confirmationEmailStatus()
    const confirmationEmailSent = emailResult.status === "fulfilled" && emailResult.value.sent
    await saveBookingRecord({
      ...record,
      confirmationEmail: {
        configured: emailStatus.configured,
        sent: confirmationEmailSent,
        status: confirmationEmailSent ? "sent" : "failed",
      },
    }).catch((error) => {
      console.error("Could not update booking email status:", error.message)
    })
    return {
      bookingId: invitationResult.id,
      bookingCode: booking.code,
      date: booking.date,
      time: booking.time,
      durationMinutes: 60,
      assignedTo: employee.name,
      partner,
      mode: MOCK_MODE ? "mock" : "live",
      calendarWorkflow: "organizer-calendar-invitation",
      organizerCalendarUpdated: true,
      calendarInvitationSent: true,
      invitationOrganizer: invitationResult.organizer,
      confirmationEmailSent,
      confirmationEmailConfigured: emailStatus.configured,
      bookingRecordSaved: true,
    }
  } finally {
    bookingLocks.delete(lockKey)
  }
}

async function route(request, response) {
  const origin = request.headers.origin
  if (origin && !allowedOrigins.has(origin)) {
    return jsonResponse(response, 403, { error: { code: "ORIGIN_NOT_ALLOWED", message: "Origin not allowed." } })
  }
  if (request.method === "OPTIONS") {
    response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    return jsonResponse(response, 204, null, origin)
  }

  const url = new URL(request.url, `http://${request.headers.host || "127.0.0.1"}`)
  const pathname = routePath(url.pathname)
  if (request.method === "GET" && pathname === "/") {
    return htmlResponse(
      response,
      200,
      '<!doctype html><html lang="es"><head><meta charset="utf-8"><title>EsLatin Reservas API</title></head><body><h1>EsLatin Reservas API</h1><p>Servicio activo.</p></body></html>',
    )
  }
  if (request.method === "GET" && pathname === "/api/health") {
    const email = confirmationEmailStatus()
    return jsonResponse(response, 200, {
      ok: true,
      mode: MOCK_MODE ? "mock" : "live",
      basePath: BOOKING_BASE_PATH || "/",
      dingTalkConfigured: Boolean(process.env.DINGTALK_CLIENT_ID && process.env.DINGTALK_CLIENT_SECRET),
      calendarWorkflow: "organizer-calendar-invitation",
      bookingWindowDays: MAX_BOOKING_DAYS,
      sameDayBookingAllowed: false,
      timeZone: BOGOTA_TIME_ZONE,
      confirmationEmailEnabled: email.enabled,
      confirmationEmailConfigured: email.configured,
      invitationRequired: INVITE_REQUIRED,
      invitationConfigured: inviteTokenSecret.length >= 32 && partnerInviteHashes.size === Object.keys(PARTNER_DEFINITIONS).length,
      invitationPartnerCount: partnerInviteHashes.size,
      bookingRecordsEnabled: true,
      bookingAdminConfigured: /^[a-f0-9]{64}$/.test(adminPasswordHash) && adminTokenSecret.length >= 32,
    }, origin)
  }
  if (request.method === "POST" && pathname === "/api/admin/login") {
    const input = await parseBody(request)
    verifyAdminPassword(input.password, request)
    const access = createAdminToken()
    return jsonResponse(response, 200, {
      token: access.token,
      expiresAt: new Date(access.expiresAt * 1000).toISOString(),
    }, origin)
  }
  if (request.method === "GET" && pathname === "/api/admin/bookings") {
    requireAdmin(request)
    return jsonResponse(response, 200, await listBookingRecords(url), origin)
  }
  if (request.method === "POST" && pathname === "/api/invitations/verify") {
    const input = await parseBody(request)
    const partner = verifyPartnerInviteCode(input.code, request)
    const access = createInviteToken(partner)
    return jsonResponse(response, 200, {
      partner,
      token: access.token,
      expiresAt: new Date(access.expiresAt * 1000).toISOString(),
    }, origin)
  }
  if (request.method === "GET" && pathname === "/api/staff") {
    const staff = await getStaff({ refresh: url.searchParams.get("refresh") === "1" })
    const organizer = await getOrganizer({ refresh: url.searchParams.get("refresh") === "1" })
    return jsonResponse(response, 200, {
      mode: MOCK_MODE ? "mock" : "live",
      staff: staff.map((employee) => ({ name: employee.name, userId: employee.userId })),
      count: staff.length,
      invitationOrganizer: { name: organizer.name, userId: organizer.userId },
    }, origin)
  }
  if (request.method === "GET" && pathname === "/api/availability") {
    const partner = invitationFromRequest(request)
    const availability = await getAvailability(url.searchParams.get("date"))
    return jsonResponse(response, 200, { ...availability, partner, mode: MOCK_MODE ? "mock" : "live" }, origin)
  }
  if (request.method === "POST" && pathname === "/api/bookings") {
    const partner = invitationFromRequest(request)
    const result = await bookAppointment(await parseBody(request), partner)
    return jsonResponse(response, 201, result, origin)
  }
  return jsonResponse(response, 404, { error: { code: "NOT_FOUND", message: "Endpoint not found." } }, origin)
}

const server = createServer(async (request, response) => {
  try {
    await route(request, response)
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500
    if (!(error instanceof ApiError)) console.error("Booking backend error:", error)
    jsonResponse(response, status, {
      error: {
        code: error instanceof ApiError ? error.code : "INTERNAL_ERROR",
        message: error instanceof ApiError ? error.message : "Unexpected backend error.",
        ...(error instanceof ApiError && error.details ? { details: error.details } : {}),
      },
    }, request.headers.origin)
  }
})

async function runCommand() {
  if (process.argv.includes("--setup-email")) {
    const email = await verifyConfirmationEmail()
    console.log(`Confirmation email ready: ${email.sender}`)
    console.log(`Reply-to address: ${email.replyTo}`)
    return true
  }
  if (process.argv.includes("--setup-dingtalk")) {
    const staff = await getStaff({ refresh: true })
    const organizer = await getOrganizer({ refresh: true })
    const calendar = await getOrganizerCalendar({ refresh: true })
    console.log(`DingTalk organizer calendar ready: ${calendar.calendarId}`)
    console.log(`Visible staff: ${staff.map((employee) => employee.name).join(", ")}`)
    console.log(`Invitation organizer: ${organizer.name}`)
    return true
  }
  if (process.argv.includes("--create-organizer-calendar")) {
    const staff = await getStaff({ refresh: true })
    const organizer = await getOrganizer({ refresh: true })
    const calendar = await getOrganizerCalendar({ refresh: true })
    console.log(`DINGTALK_ORGANIZER_CALENDAR_ID=${calendar.calendarId}`)
    console.log(`Calendar owner: ${organizer.name}`)
    console.log(`Visible staff: ${staff.map((employee) => employee.name).join(", ")}`)
    return true
  }
  if (process.argv.includes("--verify-shared-calendar")) {
    const staff = await getStaff({ refresh: true })
    const organizer = await getOrganizer({ refresh: true })
    const calendar = await getOrganizerCalendar({ refresh: true })
    console.log(`Organizer calendar ready: ${calendar.calendarId}`)
    console.log(`Calendar type: ${calendar.type}`)
    console.log(`Calendar privilege: ${calendar.privilege || "unknown"}`)
    console.log(`Invitation organizer: ${organizer.name}`)
    console.log(`Visible staff: ${staff.map((employee) => employee.name).join(", ")}`)
    return true
  }
  return false
}

if (await runCommand().catch((error) => {
  console.error(
    JSON.stringify({
      error: {
        code: error instanceof ApiError ? error.code : "SETUP_FAILED",
        message: error.message,
        ...(error instanceof ApiError && error.details ? { details: error.details } : {}),
      },
    }, null, 2),
  )
  process.exitCode = 1
  return true
})) {
  // One-off command completed; do not start the HTTP server.
} else {
  server.listen(PORT, HOST, () => {
    console.log(`EsLatin booking backend: http://${HOST}:${PORT}${BOOKING_BASE_PATH}`)
    console.log(`DingTalk mode: ${MOCK_MODE ? "mock (no calendar writes)" : "live"}`)
    if (!MOCK_MODE && !process.env.DINGTALK_CLIENT_SECRET) {
      console.warn("DINGTALK_CLIENT_SECRET is missing; live requests will fail until it is added to .env.local.")
    }
  })
}
