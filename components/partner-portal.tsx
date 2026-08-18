"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import { LogOut, Mail, Plus, RefreshCw, Save, ShieldCheck, Trash2, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { BOOKING_API_URL } from "@/lib/booking-api"

const PARTNER_TOKEN_KEY = "eslatin-partner-manager-token"
const PARTNER_ID_KEY = "eslatin-partner-manager-id"

type City = { id: string; name: string; timezone: string; startHour: number; endHour: number }
type Salesperson = { id: string; name: string; email: string; cityIds: string[]; active: boolean }
type Partner = { id: string; name: string; sales: Salesperson[] }
type PartnerOption = { id: string; name: string; hasInviteCode: boolean }

const copy = {
  es: {
    title: "Portal de asesores comerciales",
    subtitle: "Administre los asesores que recibirán la información de sus reservas.",
    partner: "Empresa asociada",
    password: "Contraseña de acceso",
    login: "Ingresar",
    logging: "Verificando…",
    loginError: "No se pudo iniciar sesión. Verifique la empresa y la contraseña.",
    name: "Nombre del asesor",
    email: "Correo del asesor",
    cities: "Ciudades asignadas",
    add: "Agregar asesor",
    save: "Guardar",
    saved: "Guardado",
    remove: "Desactivar",
    refresh: "Actualizar",
    logout: "Cerrar sesión",
    required: "Complete el nombre, el correo y al menos una ciudad.",
    noSales: "Aún no hay asesores registrados.",
    noCities: "No hay ciudades disponibles.",
  },
  zh: {
    title: "销售顾问管理",
    subtitle: "管理接收客户预约信息的销售顾问。",
    partner: "合作车企",
    password: "管理密码",
    login: "登录",
    logging: "验证中…",
    loginError: "登录失败，请检查车企和密码。",
    name: "销售姓名",
    email: "销售邮箱",
    cities: "负责城市",
    add: "添加销售",
    save: "保存",
    saved: "已保存",
    remove: "停用",
    refresh: "刷新",
    logout: "退出",
    required: "请填写姓名、邮箱并至少选择一个城市。",
    noSales: "暂时没有销售人员。",
    noCities: "暂时没有可用城市。",
  },
} as const

export function PartnerPortal() {
  const { lang } = useLanguage()
  const t = copy[lang]
  const [partnerId, setPartnerId] = useState("")
  const [partnerOptions, setPartnerOptions] = useState<PartnerOption[]>([])
  const [password, setPassword] = useState("")
  const [token, setToken] = useState("")
  const [partner, setPartner] = useState<Partner | null>(null)
  const [cities, setCities] = useState<City[]>([])
  const [loginLoading, setLoginLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [cityIds, setCityIds] = useState<string[]>([])

  const editingLabel = useMemo(() => editingId ? t.save : t.add, [editingId, t.add, t.save])

  useEffect(() => {
    void fetch(`${BOOKING_API_URL}/api/partner/options`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        const options = Array.isArray(data.partners) ? data.partners : []
        setPartnerOptions(options)
        setPartnerId((current) => current || options[0]?.id || "")
      })
      .catch(() => setPartnerOptions([]))
  }, [])

  useEffect(() => {
    const storedToken = window.sessionStorage.getItem(PARTNER_TOKEN_KEY) || ""
    const storedPartner = window.sessionStorage.getItem(PARTNER_ID_KEY) || ""
    if (storedToken && storedPartner) {
      setToken(storedToken)
      setPartnerId(storedPartner)
    }
  }, [])

  async function loadPortal(accessToken = token) {
    if (!accessToken) return
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`${BOOKING_API_URL}/api/partner/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error?.message || "Request failed")
      setPartner(data.partner)
      setCities(data.cities || [])
    } catch {
      setToken("")
      setPartner(null)
      setError(t.loginError)
      window.sessionStorage.removeItem(PARTNER_TOKEN_KEY)
      window.sessionStorage.removeItem(PARTNER_ID_KEY)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) void loadPortal(token)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function login(event: FormEvent) {
    event.preventDefault()
    setLoginLoading(true)
    setError("")
    try {
      const response = await fetch(`${BOOKING_API_URL}/api/partner/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId, password }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error?.message || "Login failed")
      window.sessionStorage.setItem(PARTNER_TOKEN_KEY, data.token)
      window.sessionStorage.setItem(PARTNER_ID_KEY, partnerId)
      setToken(data.token)
      setPassword("")
    } catch {
      setError(t.loginError)
    } finally {
      setLoginLoading(false)
    }
  }

  function startNew() {
    setEditingId(null)
    setName("")
    setEmail("")
    setCityIds(cities[0] ? [cities[0].id] : [])
    setError("")
  }

  function editSalesperson(salesperson: Salesperson) {
    setEditingId(salesperson.id)
    setName(salesperson.name)
    setEmail(salesperson.email)
    setCityIds(salesperson.cityIds)
    setError("")
  }

  async function saveSalesperson(event: FormEvent) {
    event.preventDefault()
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !cityIds.length) {
      setError(t.required)
      return
    }
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`${BOOKING_API_URL}/api/partner/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: editingId, name: name.trim(), email: email.trim(), cityIds, active: true }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error?.message || "Save failed")
      setPartner(data.partner)
      startNew()
    } catch {
      setError(t.required)
    } finally {
      setLoading(false)
    }
  }

  async function deactivateSalesperson(salesperson: Salesperson) {
    setLoading(true)
    try {
      const response = await fetch(`${BOOKING_API_URL}/api/partner/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...salesperson, active: false }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error("Deactivate failed")
      setPartner(data.partner)
    } catch {
      setError(t.loginError)
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    window.sessionStorage.removeItem(PARTNER_TOKEN_KEY)
    window.sessionStorage.removeItem(PARTNER_ID_KEY)
    setToken("")
    setPartner(null)
  }

  if (!token || !partner) {
    return (
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-cyan-300" />
            <h1 className="mt-5 text-3xl font-bold text-white">{t.title}</h1>
            <p className="mt-3 text-slate-400">{t.subtitle}</p>
          </div>
          <Card className="border-slate-700/70 bg-slate-900/80 p-6">
            <form onSubmit={login} className="space-y-4">
              <div>
                <label htmlFor="partner-id" className="mb-2 block text-sm text-slate-200">{t.partner}</label>
                <select id="partner-id" value={partnerId} onChange={(event) => setPartnerId(event.target.value)} className="h-11 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-white" disabled={!partnerOptions.length}>
                  {!partnerOptions.length && <option value="">Cargando empresas…</option>}
                  {partnerOptions.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="partner-password" className="mb-2 block text-sm text-slate-200">{t.password}</label>
                <Input id="partner-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="border-slate-700 bg-slate-950 text-white" />
              </div>
              <Button type="submit" disabled={loginLoading || !partnerId} className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                {loginLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}{loginLoading ? t.logging : t.login}
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
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><p className="text-sm uppercase tracking-[0.2em] text-cyan-300">{partner.name}</p><h1 className="mt-2 text-3xl font-bold text-white">{t.title}</h1><p className="mt-2 text-slate-400">{t.subtitle}</p></div>
          <div className="flex gap-2"><Button type="button" variant="outline" onClick={() => void loadPortal()} disabled={loading} className="border-slate-700 bg-slate-900 text-slate-200"><RefreshCw className="mr-2 h-4 w-4" />{t.refresh}</Button><Button type="button" variant="outline" onClick={logout} className="border-slate-700 bg-slate-900 text-slate-200"><LogOut className="mr-2 h-4 w-4" />{t.logout}</Button></div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Card className="border-slate-700/70 bg-slate-900/80 p-6">
            <div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-white">{editingLabel}</h2><Button type="button" size="sm" variant="outline" onClick={startNew} className="border-slate-700 bg-transparent text-slate-200"><Plus className="mr-1 h-4 w-4" />{t.add}</Button></div>
            <form onSubmit={saveSalesperson} className="mt-5 space-y-4">
              <div><label htmlFor="sales-name" className="mb-2 block text-sm text-slate-200">{t.name}</label><Input id="sales-name" value={name} onChange={(event) => setName(event.target.value)} className="border-slate-700 bg-slate-950 text-white" /></div>
              <div><label htmlFor="sales-email" className="mb-2 block text-sm text-slate-200">{t.email}</label><Input id="sales-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="border-slate-700 bg-slate-950 text-white" /></div>
              <fieldset><legend className="mb-2 text-sm text-slate-200">{t.cities}</legend><div className="space-y-2">{cities.map((city) => <label key={city.id} className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={cityIds.includes(city.id)} onChange={(event) => setCityIds((current) => event.target.checked ? [...new Set([...current, city.id])] : current.filter((id) => id !== city.id))} />{city.name}</label>)}</div></fieldset>
              <Button type="submit" disabled={loading || !cities.length} className="w-full bg-emerald-500 text-white hover:bg-emerald-600"><Save className="mr-2 h-4 w-4" />{t.save}</Button>
              {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
            </form>
          </Card>
          <Card className="border-slate-700/70 bg-slate-900/80 p-6"><h2 className="text-lg font-semibold text-white">{t.name}</h2><div className="mt-4 space-y-3">{partner.sales.filter((salesperson) => salesperson.active).map((salesperson) => <div key={salesperson.id} className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="flex items-center gap-2 font-medium text-white"><UserRound className="h-4 w-4 text-cyan-300" />{salesperson.name}</p><p className="mt-1 flex items-center gap-2 text-sm text-slate-400"><Mail className="h-4 w-4" />{salesperson.email}</p><p className="mt-2 text-xs text-slate-500">{salesperson.cityIds.map((cityId) => cities.find((city) => city.id === cityId)?.name || cityId).join(" · ")}</p></div><div className="flex gap-2"><Button type="button" size="sm" variant="outline" onClick={() => editSalesperson(salesperson)} className="border-slate-700 bg-transparent text-slate-200">{t.save}</Button><Button type="button" size="sm" variant="outline" onClick={() => void deactivateSalesperson(salesperson)} className="border-red-500/30 bg-transparent text-red-300"><Trash2 className="mr-1 h-4 w-4" />{t.remove}</Button></div></div>)}{!partner.sales.some((salesperson) => salesperson.active) && <p className="py-8 text-center text-sm text-slate-500">{t.noSales}</p>}</div></Card>
        </div>
      </div>
    </section>
  )
}
