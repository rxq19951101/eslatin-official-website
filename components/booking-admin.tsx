"use client"

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import {
  CalendarCheck2,
  Clock3,
  LogOut,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import { BOOKING_API_URL } from "@/lib/booking-api"

const ADMIN_TOKEN_KEY = "eslatin-booking-admin-token"

type Scope = "upcoming" | "past" | "all"

type BookingRecord = {
  id: string
  bookingCode: string
  createdAt: string
  status: "confirmed"
  date: string
  time: string
  endTime: string
  durationMinutes: number
  customer: {
    name: string
    address: string
    phone: string
    email: string
  }
  city?: {
    id: string
    name: string
    timezone?: string
  }
  assignedTo: {
    name: string
    userId: string
  }
  partner: null | {
    id: string
    name: string
  }
  salesperson?: null | {
    id: string
    name: string
    email: string
  }
  calendar: {
    invitationSent: boolean
  }
  confirmationEmail: {
    configured: boolean
    sent: boolean
    status: "pending" | "sent" | "failed"
  }
  salespersonEmail?: {
    configured: boolean
    sent: boolean
    status: "pending" | "sent" | "failed" | "not_required"
  }
}

type BookingListResponse = {
  bookings: BookingRecord[]
  total: number
  scope: Scope
  today: string
}

const copy = {
  es: {
    title: "Administración de reservas",
    subtitle: "Consulte las visitas técnicas confirmadas y el estado de cada notificación.",
    loginTitle: "Acceso restringido",
    loginDescription: "Ingrese la contraseña administrativa para consultar los datos de las reservas.",
    password: "Contraseña",
    enter: "Ingresar",
    entering: "Verificando…",
    invalidLogin: "La contraseña no es válida.",
    unavailable: "No se pudo conectar con el servicio de reservas.",
    notConfigured: "El acceso administrativo todavía no está configurado en el servidor.",
    sessionExpired: "La sesión venció. Ingrese nuevamente.",
    upcoming: "Próximas",
    past: "Anteriores",
    all: "Todas",
    refresh: "Actualizar",
    partnerConfig: "Configurar socios",
    logout: "Cerrar sesión",
    total: "reservas",
    noResults: "No hay reservas en esta sección.",
    booking: "Reserva",
    customer: "Cliente",
    assigned: "Técnico asignado",
    salesperson: "Asesor comercial",
    city: "Ciudad",
    source: "Origen interno",
    general: "General",
    calendarSent: "Invitación de calendario enviada",
    emailSent: "Correo de confirmación enviado",
    emailFailed: "Correo de confirmación no enviado",
    salespersonEmailSent: "Asesor notificado por correo",
    confirmed: "Confirmada",
    created: "Registrada",
  },
  zh: {
    title: "预约管理后台",
    subtitle: "查看已确认的现场勘查预约及各项通知状态。",
    loginTitle: "受限访问",
    loginDescription: "请输入管理密码以查看预约资料。",
    password: "管理密码",
    enter: "登录",
    entering: "验证中…",
    invalidLogin: "管理密码不正确。",
    unavailable: "暂时无法连接预约服务。",
    notConfigured: "服务器尚未配置管理后台。",
    sessionExpired: "登录已过期，请重新登录。",
    upcoming: "即将进行",
    past: "历史预约",
    all: "全部预约",
    refresh: "刷新",
    partnerConfig: "配置合作车企",
    logout: "退出",
    total: "条预约",
    noResults: "当前分类暂无预约。",
    booking: "预约编号",
    customer: "客户",
    assigned: "负责技术人员",
    salesperson: "销售顾问",
    city: "城市",
    source: "内部来源",
    general: "普通客户",
    calendarSent: "已发送日程邀请",
    emailSent: "已发送确认邮件",
    emailFailed: "确认邮件未发送",
    salespersonEmailSent: "已通过邮件通知销售",
    confirmed: "已确认",
    created: "提交时间",
  },
} as const

function formatDate(value: string, language: "es" | "zh") {
  const date = new Date(`${value}T12:00:00-05:00`)
  return new Intl.DateTimeFormat(language === "es" ? "es-CO" : "zh-CN", {
    dateStyle: "full",
    timeZone: "America/Bogota",
  }).format(date)
}

function formatCreatedAt(value: string, language: "es" | "zh") {
  return new Intl.DateTimeFormat(language === "es" ? "es-CO" : "zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Bogota",
  }).format(new Date(value))
}

export function BookingAdmin() {
  const { lang } = useLanguage()
  const t = copy[lang]
  const [password, setPassword] = useState("")
  const [token, setToken] = useState("")
  const [scope, setScope] = useState<Scope>("upcoming")
  const [data, setData] = useState<BookingListResponse | null>(null)
  const [loginStatus, setLoginStatus] = useState<"idle" | "loading">("idle")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setToken(window.sessionStorage.getItem(ADMIN_TOKEN_KEY) || "")
  }, [])

  const logout = useCallback((message = "") => {
    window.sessionStorage.removeItem(ADMIN_TOKEN_KEY)
    setToken("")
    setData(null)
    setPassword("")
    setError(message)
  }, [])

  const loadBookings = useCallback(async (accessToken: string, selectedScope: Scope) => {
    if (!accessToken) return
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`${BOOKING_API_URL}/api/admin/bookings?scope=${selectedScope}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      })
      const result = await response.json().catch(() => ({}))
      if (response.status === 401) {
        logout(t.sessionExpired)
        return
      }
      if (!response.ok) throw new Error(result.error?.message || "Request failed")
      setData(result)
    } catch {
      setError(t.unavailable)
    } finally {
      setLoading(false)
    }
  }, [logout, t.sessionExpired, t.unavailable])

  useEffect(() => {
    if (token) void loadBookings(token, scope)
  }, [loadBookings, scope, token])

  async function login(event: FormEvent) {
    event.preventDefault()
    if (!password) return
    setLoginStatus("loading")
    setError("")
    try {
      const response = await fetch(`${BOOKING_API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(result.error?.code === "ADMIN_NOT_CONFIGURED" ? t.notConfigured : t.invalidLogin)
        return
      }
      window.sessionStorage.setItem(ADMIN_TOKEN_KEY, result.token)
      setToken(result.token)
      setPassword("")
    } catch {
      setError(t.unavailable)
    } finally {
      setLoginStatus("idle")
    }
  }

  const todayCount = useMemo(
    () => data?.bookings.filter((booking) => booking.date === data.today).length || 0,
    [data],
  )

  if (!token) {
    return (
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-3xl font-bold text-white">{t.title}</h1>
            <p className="mt-3 text-slate-400">{t.subtitle}</p>
          </div>
          <Card className="border-slate-700/70 bg-slate-900/80 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white">{t.loginTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{t.loginDescription}</p>
            <form onSubmit={login} className="mt-6 space-y-4">
              <div>
                <label htmlFor="booking-admin-password" className="mb-2 block text-sm font-medium text-slate-200">{t.password}</label>
                <Input
                  id="booking-admin-password"
                  type="password"
                  value={password}
                  onChange={(event) => { setPassword(event.target.value); setError("") }}
                  autoComplete="current-password"
                  required
                  className="border-blue-500/30 bg-slate-950/60 text-white"
                />
              </div>
              <Button type="submit" disabled={!password || loginStatus === "loading"} className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                {loginStatus === "loading" && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                {loginStatus === "loading" ? t.entering : t.enter}
              </Button>
              {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
            </form>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3 text-cyan-300">
              <CalendarCheck2 className="h-6 w-6" />
              <span className="text-sm font-semibold uppercase tracking-[0.2em]">EsLatin</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">{t.title}</h1>
            <p className="mt-2 text-slate-400">{t.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild type="button" variant="outline" className="border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white">
              <a href="/survey/admin/partners/">{t.partnerConfig}</a>
            </Button>
            <Button type="button" variant="outline" onClick={() => void loadBookings(token, scope)} disabled={loading} className="border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white">
              <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
              {t.refresh}
            </Button>
            <Button type="button" variant="outline" onClick={() => logout()} className="border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white">
              <LogOut className="mr-2 h-4 w-4" />
              {t.logout}
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {(["upcoming", "past", "all"] as Scope[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setScope(item)}
              className={cn(
                "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                scope === item
                  ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-200"
                  : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-200",
              )}
            >
              {t[item]}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <span className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5">
            {data?.total || 0} {t.total}
          </span>
          {todayCount > 0 && (
            <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-emerald-300">
              {todayCount} · {data?.today}
            </span>
          )}
        </div>

        {error && <div className="mt-5 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300" role="alert">{error}</div>}

        <div className="mt-6 space-y-4">
          {!loading && data?.bookings.length === 0 && (
            <Card className="border-dashed border-slate-700 bg-slate-900/40 p-10 text-center text-slate-400">
              {t.noResults}
            </Card>
          )}
          {data?.bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden border-slate-700/70 bg-slate-900/75 p-0 backdrop-blur-sm">
              <div className="flex flex-col gap-4 border-b border-slate-800 bg-slate-950/35 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{formatDate(booking.date, lang)}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-cyan-300">
                    <Clock3 className="h-4 w-4" />
                    {booking.time}–{booking.endTime}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">{t.confirmed}</span>
                  <span className="font-mono text-xs text-slate-500">{booking.bookingCode}</span>
                </div>
              </div>

              <div className="grid gap-5 p-5 lg:grid-cols-[1.2fr_1fr_1fr]">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.customer}</p>
                  <p className="flex items-start gap-2 text-sm font-medium text-slate-100"><UserRound className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />{booking.customer.name}</p>
                  <a href={`tel:${booking.customer.phone.replace(/\s/g, "")}`} className="flex items-start gap-2 text-sm text-slate-300 hover:text-cyan-200"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />{booking.customer.phone}</a>
                  <a href={`mailto:${booking.customer.email}`} className="flex min-w-0 items-start gap-2 text-sm text-slate-300 hover:text-cyan-200"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" /><span className="break-all">{booking.customer.email}</span></a>
                  <p className="flex items-start gap-2 text-sm leading-relaxed text-slate-300"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />{booking.customer.address}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.assigned}</p>
                  <p className="text-sm font-medium text-slate-100">{booking.assignedTo.name}</p>
                  <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{t.source}</p>
                  <p className="text-sm text-slate-300">{booking.partner?.name || t.general}</p>
                  {booking.city && <><p className="pt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{t.city}</p><p className="text-sm text-slate-300">{booking.city.name}</p></>}
                  {booking.salesperson && <><p className="pt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{t.salesperson}</p><p className="text-sm text-slate-300">{booking.salesperson.name}<br /><span className="text-xs text-slate-500">{booking.salesperson.email}</span></p></>}
                </div>

                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-2 text-emerald-300"><ShieldCheck className="h-4 w-4" />{t.calendarSent}</p>
                  <p className={cn("flex items-center gap-2", booking.confirmationEmail.sent ? "text-emerald-300" : "text-amber-300")}>
                    <Mail className="h-4 w-4" />
                    {booking.confirmationEmail.sent ? t.emailSent : t.emailFailed}
                  </p>
                  {booking.salesperson && <p className={cn("flex items-center gap-2", booking.salespersonEmail?.sent ? "text-emerald-300" : "text-amber-300")}><Mail className="h-4 w-4" />{booking.salespersonEmail?.sent ? t.salespersonEmailSent : t.emailFailed}</p>}
                  <p className="pt-2 text-xs leading-relaxed text-slate-500">{t.created}: {formatCreatedAt(booking.createdAt, lang)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
