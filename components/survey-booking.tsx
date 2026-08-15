"use client"

import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { format } from "date-fns"
import { es, zhCN } from "date-fns/locale"
import { CalendarCheck2, CalendarDays, Check, Clock, KeyRound, Loader2, MapPin, ShieldCheck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useLanguage } from "@/contexts/language-context"
import { aboutTranslations } from "@/lib/about-translations"
import { whatsappUrl } from "@/lib/contact"
import { cn } from "@/lib/utils"

const BOOKING_API_URL = process.env.NEXT_PUBLIC_BOOKING_API_URL || "http://127.0.0.1:3002"
const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY?.trim() || ""
const BOGOTA_FILTER = "rect:-74.223,4.471,-73.986,4.837|countrycode:co"
const BOGOTA_BIAS = "proximity:-74.0721,4.711"
const TIMES = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]

type Slot = {
  time: string
  available: boolean
  availableStaffCount: number
}

type AvailabilityResponse = {
  slots: Slot[]
  staffCount: number
  mode: "mock" | "live"
}

type BookingResponse = {
  bookingId: string
  assignedTo: string
  mode: "mock" | "live"
  calendarInvitationSent?: boolean
  organizerCalendarUpdated?: boolean
  confirmationEmailSent?: boolean
  confirmationEmailConfigured?: boolean
  partner?: Partner
}

type Partner = {
  id: string
  name: string
}

type InviteAccess = {
  partner: Partner
  token: string
  expiresAt: string
}

type ContactField = "name" | "address" | "phone" | "email"
type ContactErrors = Partial<Record<ContactField, string>>

type AddressSuggestion = {
  place_id: string
  formatted: string
  address_line1?: string
  address_line2?: string
  city?: string
  country_code?: string
}

function normalizeColombianPhone(value: string) {
  let digits = value.replace(/\D/g, "")
  if (digits.startsWith("0057") && digits.length > 10) digits = digits.slice(4)
  if (digits.startsWith("57") && digits.length > 10) digits = digits.slice(2)
  return digits
}

function getBogotaBoundary(offsetDays: number) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date())
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value)
  // Keep the boundary at local midnight. The calendar works with calendar
  // dates, not timestamps; using noon here would incorrectly reject tomorrow
  // because a selected date is represented at local midnight.
  return new Date(value("year"), value("month") - 1, value("day") + offsetDays)
}

function toIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function endTime(time: string) {
  return `${String(Number(time.slice(0, 2)) + 1).padStart(2, "0")}:00`
}

export function SurveyBooking() {
  const { lang } = useLanguage()
  const t = aboutTranslations[lang]
  const calendarLocale = lang === "zh" ? zhCN : es
  const [name, setName] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  const [inviteAccess, setInviteAccess] = useState<InviteAccess | null>(null)
  const [inviteStatus, setInviteStatus] = useState<"idle" | "verifying" | "verified" | "error">("idle")
  const [inviteError, setInviteError] = useState("")
  const [address, setAddress] = useState("")
  const [selectedAddress, setSelectedAddress] = useState("")
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([])
  const [addressLookupStatus, setAddressLookupStatus] = useState<"idle" | "loading" | "ready" | "error">("idle")
  const [addressListOpen, setAddressListOpen] = useState(false)
  const [activeAddressIndex, setActiveAddressIndex] = useState(-1)
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [date, setDate] = useState<Date>()
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [dateError, setDateError] = useState("")
  const [timeError, setTimeError] = useState("")
  const [contactErrors, setContactErrors] = useState<ContactErrors>({})
  const [time, setTime] = useState("")
  const minimumDate = useMemo(() => getBogotaBoundary(1), [])
  const maximumDate = useMemo(() => getBogotaBoundary(10), [])
  const isoDate = date ? toIsoDate(date) : ""
  const minimumDateKey = useMemo(() => toIsoDate(minimumDate), [minimumDate])
  const maximumDateKey = useMemo(() => toIsoDate(maximumDate), [maximumDate])
  const [slots, setSlots] = useState<Slot[] | null>(null)
  const [availabilityStatus, setAvailabilityStatus] = useState<"idle" | "loading" | "ready" | "error">("idle")
  const [bookingStatus, setBookingStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [bookingResult, setBookingResult] = useState<BookingResponse | null>(null)
  const [bookingError, setBookingError] = useState("")
  const submittingRef = useRef(false)

  const validateContactField = (field: ContactField, value: string) => {
    const trimmed = value.trim()
    if (field === "name") return trimmed ? "" : t.surveyNameError
    if (field === "address") return trimmed.length >= 6 ? "" : t.surveyAddressError
    if (field === "phone") {
      const digits = normalizeColombianPhone(value)
      return digits.length >= 7 && digits.length <= 10 ? "" : t.surveyPhoneError
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? "" : t.surveyEmailError
  }

  const validateContact = (field: ContactField, value: string) => {
    const message = validateContactField(field, value)
    setContactErrors((current) => ({ ...current, [field]: message }))
    return !message
  }

  const clearContactError = (field: ContactField) => {
    setContactErrors((current) => ({ ...current, [field]: "" }))
    setBookingError("")
    setBookingStatus("idle")
  }

  const verifyInvite = async () => {
    const code = inviteCode.trim().toUpperCase()
    if (code.length < 6) {
      setInviteError(t.surveyInviteInvalid)
      setInviteStatus("error")
      return
    }
    setInviteStatus("verifying")
    setInviteError("")
    try {
      const response = await fetch(`${BOOKING_API_URL}/api/invitations/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.token || !data.partner) {
        const message = data.error?.code === "INVITE_RATE_LIMITED"
          ? t.surveyInviteRateLimited
          : data.error?.code === "INVITE_SYSTEM_NOT_CONFIGURED"
            ? t.surveyInviteUnavailable
            : t.surveyInviteInvalid
        setInviteError(message)
        setInviteStatus("error")
        return
      }
      setInviteAccess(data as InviteAccess)
      setInviteStatus("verified")
      setBookingError("")
      setBookingStatus("idle")
    } catch {
      setInviteError(t.surveyInviteUnavailable)
      setInviteStatus("error")
    }
  }

  const resetInvite = () => {
    setInviteCode("")
    setInviteAccess(null)
    setInviteStatus("idle")
    setInviteError("")
    setDate(undefined)
    setTime("")
    setSlots(null)
    setAvailabilityStatus("idle")
    setBookingResult(null)
    setBookingStatus("idle")
    setBookingError("")
  }

  useEffect(() => {
    const query = address.trim()
    if (!GEOAPIFY_API_KEY || query.length < 3 || query === selectedAddress) {
      setAddressSuggestions([])
      setAddressLookupStatus("idle")
      setAddressListOpen(false)
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setAddressLookupStatus("loading")
      try {
        const params = new URLSearchParams({
          text: query,
          format: "json",
          lang: "es",
          limit: "5",
          filter: BOGOTA_FILTER,
          bias: BOGOTA_BIAS,
          apiKey: GEOAPIFY_API_KEY,
        })
        const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?${params}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error("Geoapify request failed")
        const data = await response.json() as { results?: AddressSuggestion[] }
        const results = (data.results || []).filter(
          (item) => item.formatted && item.country_code?.toLowerCase() === "co",
        )
        setAddressSuggestions(results)
        setAddressLookupStatus("ready")
        setAddressListOpen(true)
        setActiveAddressIndex(results.length ? 0 : -1)
      } catch (error) {
        if ((error as Error).name === "AbortError") return
        setAddressSuggestions([])
        setAddressLookupStatus("error")
        setAddressListOpen(false)
      }
    }, 350)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [address, selectedAddress])

  const selectAddress = (suggestion: AddressSuggestion) => {
    setAddress(suggestion.formatted)
    setSelectedAddress(suggestion.formatted)
    setAddressSuggestions([])
    setAddressLookupStatus("idle")
    setAddressListOpen(false)
    setActiveAddressIndex(-1)
    clearContactError("address")
  }

  const handleAddressKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!addressListOpen || !addressSuggestions.length) return
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveAddressIndex((current) => (current + 1) % addressSuggestions.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveAddressIndex((current) => (current <= 0 ? addressSuggestions.length - 1 : current - 1))
    } else if (event.key === "Enter" && activeAddressIndex >= 0) {
      event.preventDefault()
      selectAddress(addressSuggestions[activeAddressIndex])
    } else if (event.key === "Escape") {
      setAddressListOpen(false)
    }
  }

  useEffect(() => {
    if (!isoDate || !inviteAccess?.token) {
      setSlots(null)
      setAvailabilityStatus("idle")
      return
    }

    const controller = new AbortController()
    setAvailabilityStatus("loading")
    setBookingStatus("idle")
    setBookingResult(null)
    setBookingError("")
    setTime("")
    setTimeError("")

    const loadAvailability = async () => {
      try {
        const response = await fetch(`${BOOKING_API_URL}/api/availability?date=${encodeURIComponent(isoDate)}`, {
          headers: { Authorization: `Bearer ${inviteAccess.token}` },
          signal: controller.signal,
        })
        const data = await response.json()
        if (!response.ok) {
          if (["INVITE_REQUIRED", "INVITE_TOKEN_INVALID", "INVITE_TOKEN_EXPIRED"].includes(data.error?.code)) {
            setInviteAccess(null)
            setInviteStatus("error")
            setInviteError(t.surveyInviteExpired)
          }
          throw new Error(data.error?.message || "Availability request failed")
        }
        setSlots((data as AvailabilityResponse).slots)
        setAvailabilityStatus("ready")
      } catch (error) {
        if ((error as Error).name === "AbortError") return
        setSlots(null)
        setAvailabilityStatus("error")
      }
    }
    void loadAvailability()
    return () => controller.abort()
  }, [inviteAccess?.token, isoDate, t.surveyInviteExpired])

  const chooseDate = (selected?: Date) => {
    setDate(selected)
    setDateError("")
    setDatePickerOpen(false)
  }

  const submitBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submittingRef.current) return
    if (!inviteAccess?.token) {
      setInviteError(t.surveyInviteRequired)
      setInviteStatus("error")
      return
    }

    const values: Record<ContactField, string> = { name, address, phone, email }
    const nextContactErrors = Object.fromEntries(
      Object.entries(values).map(([field, value]) => [
        field,
        validateContactField(field as ContactField, value),
      ]),
    ) as ContactErrors
    setContactErrors(nextContactErrors)

    const hasContactError = Object.values(nextContactErrors).some(Boolean)
    const dateWithinWindow = Boolean(
      date && isoDate >= minimumDateKey && isoDate <= maximumDateKey,
    )
    if (!dateWithinWindow) {
      setDateError(t.surveyDateError)
    } else {
      setDateError("")
    }

    const selectedSlot = slots?.find((slot) => slot.time === time)
    if (!time || availabilityStatus !== "ready" || selectedSlot?.available !== true) {
      setTimeError(t.surveyTimeError)
    } else {
      setTimeError("")
    }

    if (
      hasContactError ||
      !dateWithinWindow ||
      !time ||
      availabilityStatus !== "ready" ||
      selectedSlot?.available !== true
    ) {
      setBookingError(t.surveyFormError)
      setBookingStatus("error")
      return
    }

    setDateError("")
    setTimeError("")
    setBookingStatus("submitting")
    setBookingResult(null)
    setBookingError("")
    submittingRef.current = true
    try {
      const response = await fetch(`${BOOKING_API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${inviteAccess.token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          address: address.trim(),
          phone: normalizeColombianPhone(phone),
          email: email.trim(),
          date: isoDate,
          time,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        const code = data.error?.code
        if (code === "INVALID_PHONE") {
          setContactErrors((current) => ({ ...current, phone: t.surveyPhoneError }))
          setBookingError(t.surveyFormError)
        } else if (code === "INVALID_EMAIL") {
          setContactErrors((current) => ({ ...current, email: t.surveyEmailError }))
          setBookingError(t.surveyFormError)
        } else if (code === "SLOT_UNAVAILABLE" || code === "SLOT_CHANGED") {
          setTimeError(t.surveySlotChangedError)
          setBookingError(t.surveySlotChangedError)
        } else if (code === "DATE_OUT_OF_RANGE" || code === "INVALID_DATE") {
          setDateError(t.surveyDateError)
          setBookingError(t.surveyFormError)
        } else if (["INVITE_REQUIRED", "INVITE_TOKEN_INVALID", "INVITE_TOKEN_EXPIRED"].includes(code)) {
          setInviteAccess(null)
          setInviteStatus("error")
          setInviteError(t.surveyInviteExpired)
          setBookingError(t.surveyInviteExpired)
        } else {
          setBookingError(t.surveyBookingError)
        }
        setBookingStatus("error")
        return
      }
      setBookingResult(data as BookingResponse)
      setBookingStatus("success")
    } catch {
      setBookingError(t.surveyNetworkError)
      setBookingStatus("error")
    } finally {
      submittingRef.current = false
    }
  }

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
            <MapPin className="h-4 w-4" />
            {t.surveyAvailability}
          </div>
          <h1 className="mt-5 text-4xl font-bold text-white md:text-6xl">{t.surveyTitle}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">{t.surveySubtitle}</p>
        </div>

        <Card className="border-emerald-500/25 bg-gradient-to-br from-slate-900/80 to-emerald-950/30 p-6 backdrop-blur-sm md:p-8">
          <form className="grid gap-6 md:grid-cols-2" onSubmit={submitBooking} noValidate>
            <div className="grid gap-3 rounded-xl border border-slate-700/60 bg-slate-950/35 p-4 sm:grid-cols-3 md:col-span-2">
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="h-5 w-5 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-xs text-slate-500">{t.surveyLocationLabel}</p>
                  <p className="font-medium">{t.surveyLocationValue}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Clock className="h-5 w-5 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-xs text-slate-500">{t.surveyTimeLabel}</p>
                  <p className="font-medium">08:00–17:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <CalendarDays className="h-5 w-5 shrink-0 text-emerald-400" />
                <p className="text-sm leading-relaxed text-slate-400">{t.surveyScheduleNote}</p>
              </div>
            </div>

            <div className="rounded-xl border border-cyan-400/25 bg-cyan-400/5 p-5 md:col-span-2">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-cyan-400/10 p-2 text-cyan-300">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-white">{t.surveyInviteTitle}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">{t.surveyInviteDescription}</p>
                </div>
              </div>

              {!inviteAccess && (
                <div className="mt-4 grid gap-2 rounded-lg border border-slate-700/60 bg-slate-950/35 p-4 text-sm leading-relaxed text-slate-300">
                  <p>
                    <span className="mr-2 font-semibold text-cyan-300">1.</span>
                    {t.surveyInvitePartnerInstruction}
                  </p>
                  <p>
                    <span className="mr-2 font-semibold text-cyan-300">2.</span>
                    {t.surveyInviteGeneralInstruction}{" "}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-emerald-300 underline decoration-emerald-400/40 underline-offset-4 transition-colors hover:text-emerald-200"
                    >
                      {t.surveyInviteWhatsapp}
                    </a>
                  </p>
                </div>
              )}

              {inviteAccess ? (
                <div className="mt-4 flex flex-col gap-3 rounded-lg border border-emerald-400/25 bg-emerald-400/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 text-emerald-200">
                    <ShieldCheck className="h-5 w-5 shrink-0" />
                    <p>{t.surveyInviteVerified}</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={resetInvite} className="border-emerald-400/30 bg-transparent text-emerald-100 hover:bg-emerald-400/10 hover:text-white">
                    {t.surveyInviteChange}
                  </Button>
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Input
                    id="survey-invite-code"
                    value={inviteCode}
                    onChange={(event) => {
                      setInviteCode(event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))
                      setInviteError("")
                      setInviteStatus("idle")
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault()
                        void verifyInvite()
                      }
                    }}
                    placeholder={t.surveyInvitePlaceholder}
                    autoComplete="off"
                    autoCapitalize="characters"
                    maxLength={64}
                    aria-label={t.surveyInviteTitle}
                    aria-invalid={Boolean(inviteError)}
                    aria-describedby="survey-invite-help"
                    className={cn("border-cyan-400/30 bg-slate-950/50 font-mono uppercase tracking-wider text-white placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-500", inviteError && "border-red-400/70")}
                  />
                  <Button type="button" onClick={() => void verifyInvite()} disabled={inviteStatus === "verifying"} className="shrink-0 bg-cyan-500 text-slate-950 hover:bg-cyan-400 sm:min-w-40">
                    {inviteStatus === "verifying" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {inviteStatus === "verifying" ? t.surveyInviteVerifying : t.surveyInviteVerify}
                  </Button>
                </div>
              )}
              <div id="survey-invite-help" className="mt-3 min-h-5 text-xs" aria-live="polite">
                {inviteError
                  ? <p className="text-red-400">{inviteError}</p>
                  : !inviteAccess && <p className="text-slate-500">{t.surveyInvitePartners}</p>}
              </div>
            </div>

            {inviteAccess && <>
            <div>
              <label htmlFor="survey-name" className="mb-2 block text-sm font-medium text-slate-200">{t.formName}</label>
              <Input
                id="survey-name"
                value={name}
                onChange={(event) => { setName(event.target.value); clearContactError("name") }}
                onBlur={() => validateContact("name", name)}
                autoComplete="name"
                aria-invalid={Boolean(contactErrors.name)}
                aria-describedby={contactErrors.name ? "survey-name-error" : undefined}
                required
                className={cn("border-blue-500/30 bg-slate-800/50 text-white", contactErrors.name && "border-red-400/70 focus-visible:ring-red-400/30")}
              />
              {contactErrors.name && <p id="survey-name-error" className="mt-2 text-xs text-red-400">{contactErrors.name}</p>}
            </div>
            <div className="relative">
              <label htmlFor="survey-address" className="mb-2 block text-sm font-medium text-slate-200">{t.surveyAddressLabel}</label>
              <Input
                id="survey-address"
                value={address}
                onChange={(event) => {
                  setAddress(event.target.value)
                  setSelectedAddress("")
                  clearContactError("address")
                }}
                onFocus={() => addressSuggestions.length && setAddressListOpen(true)}
                onBlur={() => {
                  window.setTimeout(() => setAddressListOpen(false), 150)
                  validateContact("address", address)
                }}
                onKeyDown={handleAddressKeyDown}
                placeholder={t.surveyAddressPlaceholder}
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={addressListOpen}
                aria-controls="survey-address-suggestions"
                aria-activedescendant={activeAddressIndex >= 0 ? `survey-address-option-${activeAddressIndex}` : undefined}
                aria-invalid={Boolean(contactErrors.address)}
                aria-describedby={contactErrors.address ? "survey-address-error survey-address-hint" : "survey-address-hint"}
                required
                className={cn("border-blue-500/30 bg-slate-800/50 text-white placeholder:text-slate-500", contactErrors.address && "border-red-400/70 focus-visible:ring-red-400/30")}
              />
              {addressListOpen && addressSuggestions.length > 0 && (
                <ul
                  id="survey-address-suggestions"
                  role="listbox"
                  className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-2xl shadow-black/40"
                >
                  {addressSuggestions.map((suggestion, index) => (
                    <li
                      id={`survey-address-option-${index}`}
                      key={suggestion.place_id || `${suggestion.formatted}-${index}`}
                      role="option"
                      aria-selected={activeAddressIndex === index}
                    >
                      <button
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => selectAddress(suggestion)}
                        onMouseEnter={() => setActiveAddressIndex(index)}
                        className={cn(
                          "flex w-full gap-3 border-b border-slate-800 px-4 py-3 text-left last:border-b-0",
                          activeAddressIndex === index ? "bg-emerald-500/15" : "hover:bg-slate-900",
                        )}
                      >
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-slate-100">
                            {suggestion.address_line1 || suggestion.formatted}
                          </span>
                          {(suggestion.address_line2 || suggestion.city) && (
                            <span className="mt-0.5 block truncate text-xs text-slate-400">
                              {suggestion.address_line2 || suggestion.city}
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {contactErrors.address && <p id="survey-address-error" className="mt-2 text-xs text-red-400">{contactErrors.address}</p>}
              <p id="survey-address-hint" className={cn(
                "mt-2 flex min-h-4 items-center gap-1.5 text-xs",
                addressLookupStatus === "error" ? "text-amber-300" : "text-slate-500",
                selectedAddress && "text-emerald-300",
              )}>
                {addressLookupStatus === "loading" && <Loader2 className="h-3 w-3 animate-spin" />}
                {selectedAddress && <Check className="h-3 w-3" />}
                {selectedAddress
                  ? t.surveyAddressSelected
                  : addressLookupStatus === "loading"
                    ? t.surveyAddressSearching
                    : addressLookupStatus === "error"
                      ? t.surveyAddressLookupError
                      : addressLookupStatus === "ready" && addressSuggestions.length === 0
                        ? t.surveyAddressNoResults
                        : GEOAPIFY_API_KEY
                          ? t.surveyAddressAutocompleteHint
                          : t.surveyAddressManualHint}
              </p>
            </div>
            <div>
              <label htmlFor="survey-phone" className="mb-2 block text-sm font-medium text-slate-200">{t.surveyPhoneLabel}</label>
              <Input
                id="survey-phone"
                type="tel"
                value={phone}
                onChange={(event) => { setPhone(event.target.value); clearContactError("phone") }}
                onBlur={() => validateContact("phone", phone)}
                placeholder={t.surveyPhonePlaceholder}
                inputMode="tel"
                autoComplete="tel"
                aria-invalid={Boolean(contactErrors.phone)}
                aria-describedby={contactErrors.phone ? "survey-phone-error survey-phone-hint" : "survey-phone-hint"}
                maxLength={20}
                required
                className={cn("border-blue-500/30 bg-slate-800/50 text-white placeholder:text-slate-500", contactErrors.phone && "border-red-400/70 focus-visible:ring-red-400/30")}
              />
              {contactErrors.phone && <p id="survey-phone-error" className="mt-2 text-xs text-red-400">{contactErrors.phone}</p>}
              <p id="survey-phone-hint" className="mt-2 text-xs text-slate-500">{t.surveyPhoneHint}</p>
            </div>
            <div>
              <label htmlFor="survey-email" className="mb-2 block text-sm font-medium text-slate-200">{t.formEmail}</label>
              <Input
                id="survey-email"
                type="email"
                value={email}
                onChange={(event) => { setEmail(event.target.value); clearContactError("email") }}
                onBlur={() => validateContact("email", email)}
                inputMode="email"
                autoComplete="email"
                aria-invalid={Boolean(contactErrors.email)}
                aria-describedby={contactErrors.email ? "survey-email-error" : undefined}
                required
                className={cn("border-blue-500/30 bg-slate-800/50 text-white", contactErrors.email && "border-red-400/70 focus-visible:ring-red-400/30")}
              />
              {contactErrors.email && <p id="survey-email-error" className="mt-2 text-xs text-red-400">{contactErrors.email}</p>}
            </div>

            <div>
              <label id="survey-date-label" className="mb-2 block text-sm font-medium text-slate-200">{t.surveyDateLabel}</label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="survey-date"
                    type="button"
                    variant="outline"
                    aria-labelledby="survey-date-label survey-date"
                    aria-invalid={Boolean(dateError)}
                    className={cn(
                      "h-11 w-full justify-start border-blue-500/30 bg-slate-800/50 px-3 text-left font-normal text-white hover:bg-slate-800 hover:text-white",
                      !date && "text-slate-500",
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4 text-emerald-400" />
                    {date ? format(date, lang === "zh" ? "PPP" : "PPP", { locale: calendarLocale }) : t.surveyDatePlaceholder}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto border-slate-700 bg-slate-900 p-0 text-white">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={chooseDate}
                    defaultMonth={minimumDate}
                    startMonth={minimumDate}
                    endMonth={maximumDate}
                    disabled={{ before: minimumDate, after: maximumDate }}
                    locale={calendarLocale}
                    showOutsideDays={false}
                    initialFocus
                    className="bg-slate-900"
                    classNames={{
                      today: "rounded-md border border-emerald-400/50",
                      selected: "rounded-md bg-emerald-500 text-white",
                    }}
                  />
                </PopoverContent>
              </Popover>
              <p className="mt-2 text-xs text-slate-500">{t.surveyDateHint}</p>
              {dateError && <p className="mt-2 text-xs text-red-400">{dateError}</p>}
            </div>

            <div>
              <p className="mb-2 block text-sm font-medium text-slate-200">{t.surveyTimeLabel}</p>
              <div className="min-h-11 text-sm" aria-live="polite">
                {!date && <div className="flex h-11 items-center rounded-md border border-dashed border-slate-700 px-3 text-slate-500">{t.surveySelectDateFirst}</div>}
                {availabilityStatus === "loading" && <div className="flex h-11 items-center gap-2 rounded-md border border-slate-700 px-3 text-sky-300"><Loader2 className="h-4 w-4 animate-spin" />{t.surveyLoadingSlots}</div>}
                {availabilityStatus === "error" && <div className="flex min-h-11 items-center rounded-md border border-red-500/25 bg-red-500/10 px-3 text-red-300">{t.surveyBackendError}</div>}
                {availabilityStatus === "ready" && slots?.every((slot) => !slot.available) && <div className="flex min-h-11 items-center rounded-md border border-amber-500/25 bg-amber-500/10 px-3 text-amber-200">{t.surveySlotsUnavailable}</div>}
                {availabilityStatus === "ready" && slots?.some((slot) => slot.available) && <p className="flex h-11 items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-3 text-xs text-emerald-200"><Users className="h-4 w-4" />{t.surveyTeamAvailability}</p>}
              </div>
            </div>

            <fieldset className="md:col-span-2" disabled={availabilityStatus !== "ready"}>
              <legend className="mb-3 text-sm font-medium text-slate-200">{t.surveyChooseTime}</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                {TIMES.map((slotTime) => {
                  const slot = slots?.find((item) => item.time === slotTime)
                  const isFull = slot?.available === false
                  const isSelected = time === slotTime
                  return (
                    <button
                      key={slotTime}
                      type="button"
                      disabled={!slot?.available}
                      onClick={() => { setTime(slotTime); setTimeError(""); setBookingError(""); setBookingStatus("idle") }}
                      className={cn(
                        "relative min-h-16 rounded-lg border px-3 py-2 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
                        !slot && "cursor-not-allowed border-slate-800 bg-slate-900/30 text-slate-600",
                        slot?.available && !isSelected && "border-slate-700 bg-slate-900/65 text-slate-200 hover:border-emerald-400/60 hover:bg-emerald-500/10",
                        isSelected && "border-emerald-400 bg-emerald-500/20 text-white shadow-[0_0_0_1px_rgba(52,211,153,0.2)]",
                        isFull && "cursor-not-allowed border-red-500/20 bg-red-500/5 text-slate-500",
                      )}
                    >
                      <span className="flex items-center justify-between gap-1 font-medium">
                        {slotTime}–{endTime(slotTime)}
                        {isSelected && <Check className="h-4 w-4 text-emerald-300" />}
                      </span>
                      <span className={cn("mt-1 block text-[11px]", isFull ? "font-medium text-red-300" : "text-slate-500")}>
                        {isFull ? t.surveySlotFull : slot?.available ? t.surveySlotAvailable : "—"}
                      </span>
                    </button>
                  )
                })}
              </div>
              {timeError && <p className="mt-3 text-xs text-red-400">{timeError}</p>}
            </fieldset>

            <div className="pt-2 md:col-span-2">
              <Button type="submit" size="lg" disabled={bookingStatus === "submitting" || bookingStatus === "success"} className="w-full bg-emerald-500 text-white hover:bg-emerald-600 sm:w-auto">
                {bookingStatus === "submitting" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarCheck2 className="mr-2 h-4 w-4" />}
                {bookingStatus === "submitting" ? t.surveySubmitting : t.surveySubmit}
              </Button>
              <div className="mt-4 min-h-6 text-sm" aria-live="polite">
                {bookingStatus === "success" && bookingResult && (
                  <div className="rounded-lg border border-emerald-400/25 bg-emerald-400/10 p-4 text-emerald-200">
                    <p>{t.surveySuccess} <strong>{bookingResult.assignedTo}</strong></p>
                    {bookingResult.mode === "live" && bookingResult.calendarInvitationSent && <p className="mt-1 text-xs text-emerald-300">{t.surveyDingTalkConfirmed}</p>}
                    {bookingResult.mode === "live" && !bookingResult.calendarInvitationSent && <p className="mt-1 text-xs text-amber-200">{t.surveyDingTalkWarning}</p>}
                    {bookingResult.mode === "live" && bookingResult.confirmationEmailSent && <p className="mt-1 text-xs text-emerald-300">{t.surveyEmailConfirmed}</p>}
                    {bookingResult.mode === "live" && bookingResult.confirmationEmailConfigured && !bookingResult.confirmationEmailSent && <p className="mt-1 text-xs text-amber-200">{t.surveyEmailWarning}</p>}
                    {bookingResult.mode === "mock" && <p className="mt-1 text-xs text-amber-200">{t.surveyMockNotice}</p>}
                  </div>
                )}
                {bookingStatus === "error" && bookingError && <p className="text-red-400">{bookingError}</p>}
              </div>
            </div>
            </>}
          </form>
        </Card>
      </div>
    </section>
  )
}
