"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowRight,
  Monitor,
  Activity,
  BarChart3,
  Wrench,
  Network,
  Scale,
  Layers,
  CheckCircle2,
  Zap,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { platformTranslations } from "@/lib/platform-translations"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

export default function PlatformPage() {
  const { lang } = useLanguage()
  const t = platformTranslations[lang]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white text-balance leading-tight">
            {t.heroTitle}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
              {t.heroTitleHighlight}
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto text-pretty leading-relaxed">{t.heroSubtitle}</p>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-slate-900/80 to-blue-950/80 border-blue-500/30 backdrop-blur-sm p-12 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Monitor className="w-8 h-8 text-emerald-400" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">{t.overviewTitle}</h2>
          </div>
          <p className="text-slate-300 leading-relaxed text-lg mb-6">{t.overviewDesc1}</p>
          <p className="text-slate-300 leading-relaxed text-lg">{t.overviewDesc2}</p>
        </Card>
      </section>

      {/* Core Capabilities */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.capabilitiesTitle}</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t.capabilitiesSubtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Remote Monitoring */}
          <Card className="bg-slate-900/50 border-emerald-500/20 backdrop-blur-sm p-6 hover:border-emerald-400/40 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t.monitoringTitle}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">{t.monitoringDesc}</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.monitoringFeature1}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.monitoringFeature2}</span>
              </li>
            </ul>
          </Card>

          {/* Charger Management */}
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-6 hover:border-blue-400/40 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t.managementTitle}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">{t.managementDesc}</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.managementFeature1}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.managementFeature2}</span>
              </li>
            </ul>
          </Card>

          {/* Analytics */}
          <Card className="bg-slate-900/50 border-emerald-500/20 backdrop-blur-sm p-6 hover:border-emerald-400/40 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t.analyticsTitle}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">{t.analyticsDesc}</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.analyticsFeature1}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.analyticsFeature2}</span>
              </li>
            </ul>
          </Card>

          {/* Maintenance Support */}
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-6 hover:border-blue-400/40 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Wrench className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t.maintenanceTitle}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">{t.maintenanceDesc}</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.maintenanceFeature1}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.maintenanceFeature2}</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Technology Foundation */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.technologyTitle}</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t.technologySubtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* OCPP Architecture */}
          <Card className="bg-slate-900/50 border-emerald-500/20 backdrop-blur-sm p-8 hover:border-emerald-400/40 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Network className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t.ocppTitle}</h3>
            <p className="text-slate-400 leading-relaxed mb-6">{t.ocppDesc}</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.ocppFeature1}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.ocppFeature2}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.ocppFeature3}</span>
              </li>
            </ul>
          </Card>

          {/* Scalable System */}
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-8 hover:border-blue-400/40 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Scale className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t.scalableTitle}</h3>
            <p className="text-slate-400 leading-relaxed mb-6">{t.scalableDesc}</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.scalableFeature1}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.scalableFeature2}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.scalableFeature3}</span>
              </li>
            </ul>
          </Card>

          {/* Multi-vendor Compatibility */}
          <Card className="bg-slate-900/50 border-emerald-500/20 backdrop-blur-sm p-8 hover:border-emerald-400/40 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t.compatibilityTitle}</h3>
            <p className="text-slate-400 leading-relaxed mb-6">{t.compatibilityDesc}</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.compatibilityFeature1}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.compatibilityFeature2}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.compatibilityFeature3}</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Data Analytics Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.analyticsSectionTitle}</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t.analyticsSectionSubtitle}</p>
        </div>

        <Card className="bg-slate-900/80 border-blue-500/30 backdrop-blur-sm p-8 md:p-12 max-w-6xl mx-auto">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">{t.chartTitle}</h3>
            <p className="text-slate-400">{t.chartDescription}</p>
          </div>
          
          <div className="h-[400px] w-full">
            <ChartContainer
              config={{
                charging: {
                  label: t.chartChargingLabel,
                  color: "hsl(142, 76%, 36%)", // emerald-500
                },
                users: {
                  label: t.chartUsersLabel,
                  color: "hsl(217, 91%, 60%)", // blue-500
                },
                devices: {
                  label: t.chartDevicesLabel,
                  color: "hsl(142, 76%, 36%)", // emerald-400
                },
              }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { month: t.month1, charging: 1200, users: 450, devices: 85 },
                    { month: t.month2, charging: 1900, users: 680, devices: 120 },
                    { month: t.month3, charging: 2800, users: 920, devices: 165 },
                    { month: t.month4, charging: 3500, users: 1150, devices: 210 },
                    { month: t.month5, charging: 4200, users: 1380, devices: 255 },
                    { month: t.month6, charging: 5100, users: 1620, devices: 300 },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="rgba(148, 163, 184, 0.5)"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="rgba(148, 163, 184, 0.5)"
                    style={{ fontSize: '12px' }}
                  />
                  <ChartTooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-blue-500/30 bg-slate-900/95 p-3 shadow-lg backdrop-blur-sm">
                            <div className="mb-2 text-sm font-medium text-white">{label}</div>
                            <div className="grid gap-2">
                              {payload.map((item, index) => (
                                <div key={index} className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-2">
                                    <div 
                                      className="h-2.5 w-2.5 rounded-full" 
                                      style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm text-slate-300">
                                      {item.name === 'charging' ? t.chartChargingLabel :
                                       item.name === 'users' ? t.chartUsersLabel :
                                       t.chartDevicesLabel}
                                    </span>
                                  </div>
                                  <span className="font-semibold text-white">
                                    {typeof item.value === 'number' 
                                      ? item.name === 'charging' 
                                        ? `${(item.value / 1000).toFixed(1)}k kWh`
                                        : item.name === 'users'
                                        ? `${item.value.toLocaleString()}`
                                        : `${item.value}`
                                      : item.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="charging" 
                    stroke="hsl(142, 76%, 36%)" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(142, 76%, 36%)", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="hsl(217, 91%, 60%)" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(217, 91%, 60%)", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="devices" 
                    stroke="hsl(142, 76%, 50%)" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ fill: "hsl(142, 76%, 50%)", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-blue-500/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">5.1M+</div>
              <div className="text-slate-400 text-sm">{t.chartStat1}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">1,620+</div>
              <div className="text-slate-400 text-sm">{t.chartStat2}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">300+</div>
              <div className="text-slate-400 text-sm">{t.chartStat3}</div>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border-emerald-500/30 backdrop-blur-sm p-12 md:p-16 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">{t.ctaTitle}</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">{t.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white group">
              {t.requestDemo}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 bg-transparent"
            >
              {t.talkExpert}
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/20 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-emerald-400" />
                <span className="text-xl font-bold text-white">EsLatin</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{t.footerTagline}</p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">{t.footerServices}</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <Link href="/solutions#installation" className="hover:text-white transition-colors">
                    {t.footerInstallation}
                  </Link>
                </li>
                <li>
                  <Link href="/solutions#sales" className="hover:text-white transition-colors">
                    {t.footerSales}
                  </Link>
                </li>
                <li>
                  <Link href="/platform" className="hover:text-white transition-colors">
                    {t.footerPlatform}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">{t.footerCompany}</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    {t.footerHome}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    {t.footerAbout}
                  </Link>
                </li>
                <li>
                  <Link href="/about#contact" className="hover:text-white transition-colors">
                    {t.footerContact}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">{t.footerConnect}</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t.footerLinkedIn}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t.footerEmail}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t.footerSupport}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-500/20 pt-8 text-center text-slate-400 text-sm">
            <p>{t.footerCopyright}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
