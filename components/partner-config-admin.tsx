"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import { Building2, KeyRound, MapPin, Plus, RefreshCw, Save, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const BOOKING_API_URL = process.env.NEXT_PUBLIC_BOOKING_API_URL || "http://127.0.0.1:3002"
const ADMIN_TOKEN_KEY = "eslatin-booking-admin-token"

type City = { id: string; name: string; timezone: string; startHour: number; endHour: number; active: boolean }
type Salesperson = { id: string; name: string; email: string; cityIds: string[]; active: boolean }
type Partner = { id: string; name: string; active: boolean; hasInviteCode: boolean; sales: Salesperson[] }

export function PartnerConfigAdmin() {
  const [token, setToken] = useState("")
  const [partners, setPartners] = useState<Partner[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [partnerId, setPartnerId] = useState("faw")
  const [newPartnerId, setNewPartnerId] = useState("")
  const [newPartnerName, setNewPartnerName] = useState("")
  const [newPartnerInviteCode, setNewPartnerInviteCode] = useState("")
  const [generatedInviteCode, setGeneratedInviteCode] = useState("")
  const [salespersonId, setSalespersonId] = useState("")
  const [salesName, setSalesName] = useState("")
  const [salesEmail, setSalesEmail] = useState("")
  const [salesCityIds, setSalesCityIds] = useState<string[]>([])
  const [managerPassword, setManagerPassword] = useState("")
  const [cityName, setCityName] = useState("")
  const [cityId, setCityId] = useState("")
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
      if (!salesCityIds.length && data.cities?.[0]) setSalesCityIds([data.cities[0].id])
    } catch {
      setError("无法加载合作车企配置，请先在预约后台登录。")
    } finally {
      setLoading(false)
    }
  }, [salesCityIds.length])

  useEffect(() => {
    const accessToken = window.sessionStorage.getItem(ADMIN_TOKEN_KEY) || ""
    setToken(accessToken)
    if (accessToken) void load(accessToken)
  }, [load])

  async function request(path: string, init: RequestInit) {
    const response = await fetch(`${BOOKING_API_URL}${path}`, { ...init, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(init.headers || {}) } })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.error?.message || "Request failed")
    return data
  }

  async function savePartner(event: FormEvent) {
    event.preventDefault()
    if (!newPartnerName.trim()) {
      setError("请填写车企名称。")
      return
    }
    setLoading(true)
    setError("")
    setGeneratedInviteCode("")
    try {
      const data = await request("/api/admin/partners", {
        method: "POST",
        body: JSON.stringify({ id: newPartnerId || undefined, name: newPartnerName, inviteCode: newPartnerInviteCode || undefined, active: true }),
      })
      setPartners(data.partners || [])
      setPartnerId(data.partner?.id || newPartnerId)
      setNewPartnerId("")
      setNewPartnerName("")
      setNewPartnerInviteCode("")
      setGeneratedInviteCode(data.inviteCode || "")
      setMessage(data.inviteCode ? `车企已保存。邀请码：${data.inviteCode}` : "车企已保存。")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "车企保存失败。")
    } finally {
      setLoading(false)
    }
  }

  function editSalesperson(salesperson: Salesperson) {
    setSalespersonId(salesperson.id)
    setSalesName(salesperson.name)
    setSalesEmail(salesperson.email)
    setSalesCityIds(salesperson.cityIds)
    setMessage("")
  }

  async function saveSalesperson(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError("")
    try {
      const data = await request(`/api/admin/partners/${partnerId}/sales`, { method: "POST", body: JSON.stringify({ id: salespersonId || undefined, name: salesName, email: salesEmail, cityIds: salesCityIds, active: true }) })
      setPartners((current) => current.map((partner) => partner.id === partnerId ? data.partner : partner))
      setSalespersonId("")
      setSalesName("")
      setSalesEmail("")
      setMessage("销售资料已保存。")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "保存失败。")
    } finally {
      setLoading(false)
    }
  }

  async function savePassword(event: FormEvent) {
    event.preventDefault()
    if (managerPassword.length < 10) {
      setError("车企管理密码至少需要 10 个字符。")
      return
    }
    setLoading(true)
    try {
      await request(`/api/admin/partners/${partnerId}/password`, { method: "POST", body: JSON.stringify({ password: managerPassword }) })
      setManagerPassword("")
      setMessage("车企门户密码已更新。")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "密码更新失败。")
    } finally {
      setLoading(false)
    }
  }

  async function saveCity(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    try {
      const data = await request("/api/admin/cities", { method: "POST", body: JSON.stringify({ id: cityId || undefined, name: cityName, startHour: 8, endHour: 17, timezone: "America/Bogota", active: true }) })
      setCities(data.cities || [])
      setCityName("")
      setCityId("")
      setMessage("服务城市已保存。")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "城市保存失败。")
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return <section className="container mx-auto px-4 py-20"><Card className="mx-auto max-w-xl border-amber-500/25 bg-slate-900/80 p-8 text-center"><KeyRound className="mx-auto h-8 w-8 text-amber-300" /><h1 className="mt-4 text-2xl font-bold text-white">请先登录预约管理后台</h1><p className="mt-3 text-slate-400">打开 /survey/admin 登录后，再访问本页面管理合作车企和城市。</p></Card></section>
  }

  const selectedPartner = partners.find((partner) => partner.id === partnerId)
  return (
    <section className="container mx-auto px-4 py-12 md:py-20"><div className="mx-auto max-w-6xl"><div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="text-sm uppercase tracking-[0.2em] text-cyan-300">EsLatin</p><h1 className="mt-2 text-3xl font-bold text-white">合作车企配置</h1><p className="mt-2 text-slate-400">维护销售邮箱、门户密码和服务城市。</p></div><Button type="button" variant="outline" onClick={() => void load(token)} disabled={loading} className="border-slate-700 bg-slate-900 text-slate-200"><RefreshCw className="mr-2 h-4 w-4" />刷新</Button></div>
      <Card className="mt-8 border-cyan-400/25 bg-slate-900/80 p-6"><div className="flex items-center gap-3"><Building2 className="h-5 w-5 text-cyan-300" /><h2 className="text-lg font-semibold text-white">新增或更新合作车企</h2></div><p className="mt-2 text-sm text-slate-400">保存后会写入服务器配置，不需要修改环境变量。邀请码留空时系统会自动生成。</p><form onSubmit={savePartner} className="mt-4 grid gap-4 md:grid-cols-4"><Input value={newPartnerId} onChange={(event) => setNewPartnerId(event.target.value)} placeholder="ID，例如 partner-a" className="border-slate-700 bg-slate-950 text-white" /><Input value={newPartnerName} onChange={(event) => setNewPartnerName(event.target.value)} placeholder="车企名称" className="border-slate-700 bg-slate-950 text-white" /><Input value={newPartnerInviteCode} onChange={(event) => setNewPartnerInviteCode(event.target.value)} placeholder="邀请码（可留空自动生成）" className="border-slate-700 bg-slate-950 text-white" /><Button type="submit" disabled={loading} className="bg-cyan-500 text-slate-950 hover:bg-cyan-400"><Plus className="mr-2 h-4 w-4" />保存车企</Button></form>{generatedInviteCode && <p className="mt-3 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">请将此邀请码发送给对应车企：{generatedInviteCode}</p>}</Card>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]"><Card className="border-slate-700/70 bg-slate-900/80 p-6"><div className="flex items-center gap-3"><Building2 className="h-5 w-5 text-cyan-300" /><h2 className="text-lg font-semibold text-white">销售人员</h2></div><div className="mt-4 flex gap-2"><select value={partnerId} onChange={(event) => setPartnerId(event.target.value)} className="h-11 flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 text-white">{partners.map((partner) => <option key={partner.id} value={partner.id}>{partner.name}</option>)}</select><Button type="button" size="sm" variant="outline" onClick={() => { setSalespersonId(""); setSalesName(""); setSalesEmail(""); setSalesCityIds(cities[0] ? [cities[0].id] : []) }} className="border-slate-700 bg-transparent text-slate-200"><Plus className="mr-1 h-4 w-4" />新建</Button></div><p className="mt-3 text-xs text-slate-500">当前邀请码状态：{selectedPartner?.hasInviteCode ? "已配置" : "未配置"}</p><form onSubmit={saveSalesperson} className="mt-5 grid gap-4 sm:grid-cols-2"><div><label className="mb-2 block text-sm text-slate-300">姓名</label><Input value={salesName} onChange={(event) => setSalesName(event.target.value)} className="border-slate-700 bg-slate-950 text-white" /></div><div><label className="mb-2 block text-sm text-slate-300">邮箱</label><Input type="email" value={salesEmail} onChange={(event) => setSalesEmail(event.target.value)} className="border-slate-700 bg-slate-950 text-white" /></div><fieldset className="sm:col-span-2"><legend className="mb-2 text-sm text-slate-300">负责城市</legend><div className="flex flex-wrap gap-3">{cities.map((city) => <label key={city.id} className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={salesCityIds.includes(city.id)} onChange={(event) => setSalesCityIds((current) => event.target.checked ? [...new Set([...current, city.id])] : current.filter((id) => id !== city.id))} />{city.name}</label>)}</div></fieldset><div className="sm:col-span-2"><Button type="submit" disabled={loading} className="bg-emerald-500 text-white hover:bg-emerald-600"><Save className="mr-2 h-4 w-4" />保存销售</Button></div></form><div className="mt-6 space-y-2">{selectedPartner?.sales.filter((salesperson) => salesperson.active).map((salesperson) => <button key={salesperson.id} type="button" onClick={() => editSalesperson(salesperson)} className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-3 text-left hover:border-cyan-400/40"><span><span className="block font-medium text-white"><UserRound className="mr-2 inline h-4 w-4 text-cyan-300" />{salesperson.name}</span><span className="mt-1 block text-xs text-slate-500">{salesperson.email}</span></span><span className="text-xs text-slate-500">{salesperson.cityIds.join(", ")}</span></button>)}</div></Card><div className="space-y-6"><Card className="border-slate-700/70 bg-slate-900/80 p-6"><div className="flex items-center gap-3"><KeyRound className="h-5 w-5 text-amber-300" /><h2 className="text-lg font-semibold text-white">车企门户密码</h2></div><p className="mt-2 text-sm text-slate-400">车企可通过 /partner-portal 自行维护销售。</p><form onSubmit={savePassword} className="mt-4 flex gap-2"><Input type="password" value={managerPassword} onChange={(event) => setManagerPassword(event.target.value)} placeholder="至少 10 个字符" className="border-slate-700 bg-slate-950 text-white" /><Button type="submit" disabled={loading} className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">更新</Button></form></Card><Card className="border-slate-700/70 bg-slate-900/80 p-6"><div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-emerald-300" /><h2 className="text-lg font-semibold text-white">服务城市</h2></div><form onSubmit={saveCity} className="mt-4 flex gap-2"><Input value={cityName} onChange={(event) => setCityName(event.target.value)} placeholder="例如 Medellín, Colombia" className="border-slate-700 bg-slate-950 text-white" /><Button type="submit" disabled={loading} className="bg-emerald-500 text-white hover:bg-emerald-600">保存</Button></form><div className="mt-4 space-y-2">{cities.map((city) => <p key={city.id} className="rounded-md border border-slate-800 px-3 py-2 text-sm text-slate-300">{city.name} · {String(city.startHour).padStart(2, "0")}:00–{String(city.endHour).padStart(2, "0")}:00</p>)}</div></Card></div></div>{message && <p className="mt-5 text-sm text-emerald-300">{message}</p>}{error && <p className="mt-5 text-sm text-red-300" role="alert">{error}</p>}</div></section>
  )
}
