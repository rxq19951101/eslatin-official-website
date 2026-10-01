"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import { Building2, KeyRound, MapPin, Plus, RefreshCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { BOOKING_API_URL } from "@/lib/booking-api"

const ADMIN_TOKEN_KEY = "eslatin-booking-admin-token"

type City = { id: string; name: string; timezone: string; startHour: number; endHour: number; active: boolean }
type CitySuggestion = { id: string; name: string }
type Partner = { id: string; name: string; active: boolean; hasInviteCode: boolean }

const copy = {
  es: {
    loginTitle: "Inicie sesión en Administración de reservas",
    loginHint: "Abra /survey/admin, inicie sesión y vuelva a esta página para administrar socios y ciudades.",
    title: "Configuración de socios",
    subtitle: "Administre socios, contraseñas del portal y ciudades de servicio.",
    refresh: "Actualizar",
    partnerCreateTitle: "Crear o actualizar socio",
    partnerCreateHint: "Los cambios se guardan en el servidor. Si deja el código vacío, se generará automáticamente.",
    partnerId: "ID, por ejemplo partner-a",
    partnerName: "Nombre del socio",
    inviteCode: "Código de invitación (opcional)",
    savePartner: "Guardar socio",
    inviteNotice: (code: string) => `Socio guardado. Código de invitación: ${code}`,
    partnerSaved: "Socio guardado.",
    partnerSaveError: "No se pudo guardar el socio.",
    partnerLoadError: "No se pudo cargar la configuración. Inicie sesión primero en Administración de reservas.",
    partnerNameRequired: "Ingrese el nombre del socio.",
    selectPartner: "Empresa asociada",
    portalPassword: "Contraseña del portal",
    portalPasswordHint: "El socio puede administrar sus asesores en /partner-portal.",
    salesPortalTitle: "Gestión de asesores",
    salesPortalHint: "La empresa asociada agrega, edita y desactiva sus propios asesores desde /partner-portal.",
    passwordPlaceholder: "Mínimo 10 caracteres",
    update: "Actualizar",
    passwordSaved: "Contraseña del portal actualizada.",
    passwordTooShort: "La contraseña debe tener al menos 10 caracteres.",
    passwordError: "No se pudo actualizar la contraseña.",
    citiesTitle: "Ciudades de servicio",
    cityPlaceholder: "Escriba una ciudad de Colombia, por ejemplo Medellín",
    saveCity: "Guardar",
    cityRequired: "Escriba o seleccione una ciudad de Colombia.",
    citySaved: "Ciudad de servicio guardada.",
    citySaveError: "No se pudo guardar la ciudad.",
    cityLookupLoading: "Buscando ciudades de Colombia…",
    cityLookupError: "La búsqueda automática no está disponible. Puede escribir la ciudad manualmente.",
    cityLookupHint: "Búsqueda gratuita de ciudades; seleccione una sugerencia para conservar un ID estable.",
    deleteCityConfirm: (name: string) => `¿Desea eliminar la ciudad de servicio “${name}”? Las reservas históricas no se eliminarán.`,
    cityDeleted: "Ciudad eliminada. Las reservas históricas no se eliminaron.",
    cityDeleteError: "No se pudo eliminar la ciudad.",
  },
  zh: {
    loginTitle: "请先登录预约管理后台",
    loginHint: "打开 /survey/admin 登录后，再访问本页面管理合作车企和城市。",
    title: "合作车企配置",
    subtitle: "维护合作车企、门户密码和服务城市。",
    refresh: "刷新",
    partnerCreateTitle: "新增或更新合作车企",
    partnerCreateHint: "保存后会写入服务器配置，不需要修改环境变量。邀请码留空时系统会自动生成。",
    partnerId: "ID，例如 partner-a",
    partnerName: "车企名称",
    inviteCode: "邀请码（可留空自动生成）",
    savePartner: "保存车企",
    inviteNotice: (code: string) => `车企已保存。邀请码：${code}`,
    partnerSaved: "车企已保存。",
    partnerSaveError: "车企保存失败。",
    partnerLoadError: "无法加载合作车企配置，请先在预约后台登录。",
    partnerNameRequired: "请填写车企名称。",
    selectPartner: "合作车企",
    portalPassword: "车企门户密码",
    portalPasswordHint: "车企可通过 /partner-portal 自行维护销售。",
    salesPortalTitle: "销售人员管理",
    salesPortalHint: "销售人员由车企自行在 /partner-portal 中新增、编辑和停用。",
    passwordPlaceholder: "至少 10 个字符",
    update: "更新",
    passwordSaved: "车企门户密码已更新。",
    passwordTooShort: "车企管理密码至少需要 10 个字符。",
    passwordError: "密码更新失败。",
    citiesTitle: "服务城市",
    cityPlaceholder: "输入哥伦比亚城市，例如 Medellín",
    saveCity: "保存",
    cityRequired: "请填写或选择哥伦比亚服务城市。",
    citySaved: "服务城市已保存。",
    citySaveError: "城市保存失败。",
    cityLookupLoading: "正在查询哥伦比亚城市…",
    cityLookupError: "自动补全暂时不可用，可继续手动输入。",
    cityLookupHint: "使用免费城市搜索服务，选择建议项可保持城市 ID 稳定。",
    deleteCityConfirm: (name: string) => `确定删除服务城市“${name}”吗？删除后不会影响历史预约。`,
    cityDeleted: "服务城市已删除。历史预约记录不会被删除。",
    cityDeleteError: "城市删除失败。",
  },
} as const

export function PartnerConfigAdmin() {
  const { lang } = useLanguage()
  const t = copy[lang]
  const [token, setToken] = useState("")
  const [partners, setPartners] = useState<Partner[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [partnerId, setPartnerId] = useState("faw")
  const [newPartnerId, setNewPartnerId] = useState("")
  const [newPartnerName, setNewPartnerName] = useState("")
  const [newPartnerInviteCode, setNewPartnerInviteCode] = useState("")
  const [generatedInviteCode, setGeneratedInviteCode] = useState("")
  const [managerPassword, setManagerPassword] = useState("")
  const [cityName, setCityName] = useState("")
  const [cityId, setCityId] = useState("")
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([])
  const [cityLookupStatus, setCityLookupStatus] = useState<"idle" | "loading" | "ready" | "error">("idle")
  const [cityListOpen, setCityListOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const load = useCallback(async (accessToken: string) => {
    if (!accessToken) return
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`${BOOKING_API_URL}/api/admin/partners`, { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error?.message || "Request failed")
      setPartners(data.partners || [])
      setCities(data.cities || [])
    } catch {
      setError(t.partnerLoadError)
    } finally {
      setLoading(false)
    }
  }, [t.partnerLoadError])

  useEffect(() => {
    const accessToken = window.sessionStorage.getItem(ADMIN_TOKEN_KEY) || ""
    setToken(accessToken)
    if (accessToken) void load(accessToken)
  }, [load])

  useEffect(() => {
    const query = cityName.trim()
    if (query.length < 2 || cityId) {
      setCitySuggestions([])
      setCityListOpen(false)
      setCityLookupStatus("idle")
      return
    }
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setCityLookupStatus("loading")
      try {
        const response = await fetch(`${BOOKING_API_URL}/api/city-suggestions?q=${encodeURIComponent(query)}`, { signal: controller.signal, cache: "no-store" })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error("City suggestions failed")
        const suggestions = Array.isArray(data.suggestions) ? data.suggestions : []
        setCitySuggestions(suggestions)
        setCityListOpen(suggestions.length > 0)
        setCityLookupStatus("ready")
      } catch (caught) {
        if ((caught as Error).name === "AbortError") return
        setCitySuggestions([])
        setCityListOpen(false)
        setCityLookupStatus("error")
      }
    }, 280)
    return () => { window.clearTimeout(timer); controller.abort() }
  }, [cityId, cityName])

  async function request(path: string, init: RequestInit = {}) {
    const response = await fetch(`${BOOKING_API_URL}${path}`, { ...init, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(init.headers || {}) } })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.error?.message || "Request failed")
    return data
  }

  async function savePartner(event: FormEvent) {
    event.preventDefault()
    if (!newPartnerName.trim()) { setError(t.partnerNameRequired); return }
    setLoading(true); setError(""); setMessage(""); setGeneratedInviteCode("")
    try {
      const data = await request("/api/admin/partners", { method: "POST", body: JSON.stringify({ id: newPartnerId || undefined, name: newPartnerName, inviteCode: newPartnerInviteCode || undefined, active: true }) })
      setPartners(data.partners || []); setPartnerId(data.partner?.id || newPartnerId); setNewPartnerId(""); setNewPartnerName(""); setNewPartnerInviteCode(""); setGeneratedInviteCode(data.inviteCode || "")
      setMessage(data.inviteCode ? t.inviteNotice(data.inviteCode) : t.partnerSaved)
    } catch (caught) { setError(caught instanceof Error ? caught.message : t.partnerSaveError) }
    finally { setLoading(false) }
  }

  async function savePassword(event: FormEvent) {
    event.preventDefault()
    if (managerPassword.length < 10) { setError(t.passwordTooShort); setMessage(""); return }
    setLoading(true); setError(""); setMessage("")
    try { await request(`/api/admin/partners/${partnerId}/password`, { method: "POST", body: JSON.stringify({ password: managerPassword }) }); setManagerPassword(""); setMessage(t.passwordSaved) }
    catch (caught) { setError(caught instanceof Error ? caught.message : t.passwordError) }
    finally { setLoading(false) }
  }

  function selectCitySuggestion(suggestion: CitySuggestion) {
    setCityName(suggestion.name); setCityId(suggestion.id); setCitySuggestions([]); setCityListOpen(false); setCityLookupStatus("idle")
  }

  async function saveCity(event: FormEvent) {
    event.preventDefault()
    if (!cityName.trim()) { setError(t.cityRequired); return }
    setLoading(true); setError(""); setMessage("")
    try {
      const data = await request("/api/admin/cities", { method: "POST", body: JSON.stringify({ id: cityId || undefined, name: cityName, startHour: 8, endHour: 17, timezone: "America/Bogota", active: true }) })
      setCities(data.cities || []); setCityName(""); setCityId(""); setCitySuggestions([]); setCityListOpen(false); setMessage(t.citySaved)
    } catch (caught) { setError(caught instanceof Error ? caught.message : t.citySaveError) }
    finally { setLoading(false) }
  }

  async function deleteCity(city: City) {
    if (!window.confirm(t.deleteCityConfirm(city.name))) return
    setLoading(true); setError(""); setMessage("")
    try {
      const data = await request(`/api/admin/cities/${encodeURIComponent(city.id)}`, { method: "DELETE" })
      setCities(data.cities || []); setMessage(t.cityDeleted)
    } catch (caught) { setError(caught instanceof Error ? caught.message : t.cityDeleteError) }
    finally { setLoading(false) }
  }

  if (!token) return <section className="container mx-auto px-4 py-20"><Card className="mx-auto max-w-xl border-amber-500/25 bg-slate-900/80 p-8 text-center"><KeyRound className="mx-auto h-8 w-8 text-amber-300" /><h1 className="mt-4 text-2xl font-bold text-white">{t.loginTitle}</h1><p className="mt-3 text-slate-400">{t.loginHint}</p></Card></section>

  return <section className="container mx-auto px-4 py-12 md:py-20"><div className="mx-auto max-w-6xl"><div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="text-sm uppercase tracking-[0.2em] text-cyan-300">EsLatin</p><h1 className="mt-2 text-3xl font-bold text-white">{t.title}</h1><p className="mt-2 text-slate-400">{t.subtitle}</p></div><Button type="button" variant="outline" onClick={() => void load(token)} disabled={loading} className="border-slate-700 bg-slate-900 text-slate-200"><RefreshCw className="mr-2 h-4 w-4" />{t.refresh}</Button></div>
    <Card className="mt-8 border-cyan-400/25 bg-slate-900/80 p-6"><div className="flex items-center gap-3"><Building2 className="h-5 w-5 text-cyan-300" /><h2 className="text-lg font-semibold text-white">{t.partnerCreateTitle}</h2></div><p className="mt-2 text-sm text-slate-400">{t.partnerCreateHint}</p><form onSubmit={savePartner} className="mt-4 grid gap-4 md:grid-cols-4"><Input value={newPartnerId} onChange={(event) => setNewPartnerId(event.target.value)} placeholder={t.partnerId} className="border-slate-700 bg-slate-950 text-white" /><Input value={newPartnerName} onChange={(event) => setNewPartnerName(event.target.value)} placeholder={t.partnerName} className="border-slate-700 bg-slate-950 text-white" /><Input value={newPartnerInviteCode} onChange={(event) => setNewPartnerInviteCode(event.target.value)} placeholder={t.inviteCode} className="border-slate-700 bg-slate-950 text-white" /><Button type="submit" disabled={loading} className="bg-cyan-500 text-slate-950 hover:bg-cyan-400"><Plus className="mr-2 h-4 w-4" />{t.savePartner}</Button></form>{generatedInviteCode && <p className="mt-3 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">{t.inviteNotice(generatedInviteCode)}</p>}</Card>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]"><div className="space-y-6"><Card className="border-slate-700/70 bg-slate-900/80 p-6"><div className="flex items-center gap-3"><KeyRound className="h-5 w-5 text-amber-300" /><h2 className="text-lg font-semibold text-white">{t.portalPassword}</h2></div><p className="mt-2 text-sm text-slate-400">{t.portalPasswordHint}</p><label className="mt-4 block text-sm text-slate-300">{t.selectPartner}</label><select value={partnerId} onChange={(event) => setPartnerId(event.target.value)} className="mt-2 h-11 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-white">{partners.map((partner) => <option key={partner.id} value={partner.id}>{partner.name}</option>)}</select><form onSubmit={savePassword} className="mt-4 flex gap-2"><Input type="password" value={managerPassword} onChange={(event) => { setManagerPassword(event.target.value); setError("") }} placeholder={t.passwordPlaceholder} className="border-slate-700 bg-slate-950 text-white" /><Button type="submit" disabled={loading} className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">{t.update}</Button></form></Card><Card className="border-slate-700/70 bg-slate-900/80 p-6"><div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-emerald-300" /><h2 className="text-lg font-semibold text-white">{t.citiesTitle}</h2></div><form onSubmit={saveCity} className="mt-4"><div className="relative flex gap-2"><Input value={cityName} onChange={(event) => { setCityName(event.target.value); setCityId(""); setError("") }} onFocus={() => citySuggestions.length && setCityListOpen(true)} onBlur={() => window.setTimeout(() => setCityListOpen(false), 150)} placeholder={t.cityPlaceholder} className="border-slate-700 bg-slate-950 text-white" autoComplete="off" /><Button type="submit" disabled={loading} className="shrink-0 bg-emerald-500 text-white hover:bg-emerald-600">{t.saveCity}</Button>{cityListOpen && citySuggestions.length > 0 && <div className="absolute left-0 right-20 top-12 z-30 overflow-hidden rounded-lg border border-slate-700 bg-slate-950 shadow-2xl">{citySuggestions.map((suggestion) => <button key={suggestion.id} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => selectCitySuggestion(suggestion)} className="block w-full border-b border-slate-800 px-3 py-2 text-left text-sm text-slate-200 last:border-0 hover:bg-slate-800">{suggestion.name}</button>)}</div>}</div></form><p className="mt-2 min-h-4 text-xs text-slate-500">{cityLookupStatus === "loading" ? t.cityLookupLoading : cityLookupStatus === "error" ? t.cityLookupError : t.cityLookupHint}</p><div className="mt-4 space-y-2">{cities.map((city) => <div key={city.id} className="flex items-center justify-between gap-3 rounded-md border border-slate-800 px-3 py-2 text-sm text-slate-300"><span>{city.name} · {String(city.startHour).padStart(2, "0")}:00–{String(city.endHour).padStart(2, "0")}:00</span><Button type="button" size="sm" variant="ghost" onClick={() => void deleteCity(city)} disabled={loading} className="text-red-300 hover:bg-red-500/10 hover:text-red-200"><Trash2 className="h-4 w-4" /></Button></div>)}</div></Card></div><Card className="border-slate-700/70 bg-slate-950/30 p-6"><h2 className="text-lg font-semibold text-white">{t.salesPortalTitle}</h2><p className="mt-3 text-sm leading-relaxed text-slate-400">{t.salesPortalHint}</p></Card></div>{message && <p className="mt-5 text-sm text-emerald-300" role="status">{message}</p>}{error && <p className="mt-5 text-sm text-red-300" role="alert">{error}</p>}</div></section>
}
