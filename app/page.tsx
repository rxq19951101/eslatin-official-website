"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Zap, ShoppingCart, Monitor, Shield, CheckCircle2, Sparkles } from "lucide-react"
import { LanguageSwitcher, type Language } from "@/components/language-switcher"
import { MobileNav } from "@/components/mobile-nav"
import { translations } from "@/lib/translations"
import Link from "next/link"

export default function Home() {
  const [lang, setLang] = useState<Language>("es")
  
  // 从localStorage加载保存的语言
  useEffect(() => {
    const savedLang = localStorage.getItem("eslatin-language") as Language | null
    if (savedLang && (savedLang === "es" || savedLang === "zh")) {
      setLang(savedLang)
    }
  }, [])

  const t = translations[lang]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950">
      {/* Header */}
      <header className="border-b border-blue-500/20 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-emerald-400" />
            <span className="text-2xl font-bold text-white">EsLatin</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-slate-300 hover:text-white transition-colors">
              {t.services}
            </a>
            <Link href="/solutions" className="text-slate-300 hover:text-white transition-colors">
              {t.solutions}
            </Link>
            <Link href="/platform" className="text-slate-300 hover:text-white transition-colors">
              {t.platform}
            </Link>
            <a href="#trust" className="text-slate-300 hover:text-white transition-colors">
              {t.whyUs}
            </a>
            <Link href="/projects" className="text-slate-300 hover:text-white transition-colors">
              {t.projects}
            </Link>
            <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
              {t.about}
            </Link>
            <Link href="/about#contact">
              <Button
                variant="outline"
                className="border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10 bg-transparent"
              >
                {t.contactUs}
              </Button>
            </Link>
            <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
          </nav>
          <div className="md:hidden flex items-center gap-4">
            <MobileNav lang={lang} translations={t} onLanguageChange={setLang} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white text-balance leading-tight">
            {t.heroTitle}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
              {t.heroTitleHighlight}
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto text-pretty leading-relaxed">{t.heroSubtitle}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/about#contact">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white group">
                {t.partnerWithUs}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/solutions">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 bg-transparent"
              >
                {t.exploreSolutions}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Business Sections */}
      <section id="services" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.ourSolutions}</h2>
          <p className="text-slate-400 text-lg">{t.ourSolutionsSubtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Charger Installation */}
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-8 hover:border-emerald-400/40 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t.installationTitle}</h3>
            <p className="text-slate-400 leading-relaxed mb-6">{t.installationDesc}</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.installationFeature1}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.installationFeature2}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.installationFeature3}</span>
              </li>
            </ul>
          </Card>

          {/* Charger Sales */}
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-8 hover:border-emerald-400/40 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t.salesTitle}</h3>
            <p className="text-slate-400 leading-relaxed mb-6">{t.salesDesc}</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.salesFeature1}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.salesFeature2}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.salesFeature3}</span>
              </li>
            </ul>
          </Card>

          {/* Charging Platform */}
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-8 hover:border-emerald-400/40 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Monitor className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t.platformTitle}</h3>
            <p className="text-slate-400 leading-relaxed mb-6">{t.platformDesc}</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.platformFeature1}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.platformFeature2}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.platformFeature3}</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Trust Section */}
      <section id="trust" className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-slate-900/80 to-blue-950/80 border-blue-500/30 backdrop-blur-sm p-12 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-8 h-8 text-emerald-400" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">{t.whyChoose}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="text-emerald-400 font-semibold text-lg">{t.complianceTitle}</div>
              <p className="text-slate-300 leading-relaxed">{t.complianceDesc}</p>
            </div>

            <div className="space-y-3">
              <div className="text-blue-400 font-semibold text-lg">{t.supplyChainTitle}</div>
              <p className="text-slate-300 leading-relaxed">{t.supplyChainDesc}</p>
            </div>

            <div className="space-y-3">
              <div className="text-emerald-400 font-semibold text-lg">{t.turnkeyTitle}</div>
              <p className="text-slate-300 leading-relaxed">{t.turnkeyDesc}</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Projects Section */}
      <section id="projects" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.recentProjects}</h2>
          <p className="text-slate-400 text-lg">{t.recentProjectsSubtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm overflow-hidden group">
            <div className="relative h-48 w-full bg-gradient-to-br from-blue-600/20 to-emerald-600/20 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=800&q=80"
                alt="Commercial EV charging station"
                fill
                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{t.project1Title}</h3>
              <p className="text-slate-400 mb-4 leading-relaxed">{t.project1Desc}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                  {t.commercial}
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
                  {t.fastCharging}
                </span>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm overflow-hidden group">
            <div className="relative h-48 w-full bg-gradient-to-br from-emerald-600/20 to-blue-600/20 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80"
                alt="Fleet EV charging network"
                fill
                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{t.project2Title}</h3>
              <p className="text-slate-400 mb-4 leading-relaxed">{t.project2Desc}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
                  {t.fleet}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                  {t.smartCharging}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border-emerald-500/30 backdrop-blur-sm p-12 md:p-16 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">{t.ctaTitle}</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">{t.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/about#contact">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white group">
                {t.contactUsToday}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/about#contact">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 bg-transparent"
              >
                {t.becomePartner}
              </Button>
            </Link>
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
                  <a href="#" className="hover:text-white transition-colors">
                    {t.footerInstallation}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t.footerSales}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t.footerPlatform}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">{t.footerCompany}</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t.footerAbout}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t.footerProjects}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t.footerContact}
                  </a>
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
