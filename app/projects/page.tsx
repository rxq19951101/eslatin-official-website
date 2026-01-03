"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Building2, Home, Factory, PackageCheck, Wrench, Globe, CheckCircle2, Zap } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { projectsTranslations } from "@/lib/projects-translations"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function ProjectsPage() {
  const { lang } = useLanguage()
  const t = projectsTranslations[lang]

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

      {/* Project Philosophy */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">{t.philosophyTitle}</h2>
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-8 md:p-12">
            <p className="text-slate-300 text-lg leading-relaxed mb-6">{t.philosophyPara1}</p>
            <p className="text-slate-300 text-lg leading-relaxed">{t.philosophyPara2}</p>
          </Card>
        </div>
      </section>

      {/* China Operations */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.chinaOpsTitle}</h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">{t.chinaOpsSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-8 hover:border-emerald-400/40 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <PackageCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t.supplyChainTitle}</h3>
              <p className="text-slate-400 leading-relaxed">{t.supplyChainDesc}</p>
            </Card>

            <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-8 hover:border-emerald-400/40 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t.engineeringTitle}</h3>
              <p className="text-slate-400 leading-relaxed">{t.engineeringDesc}</p>
            </Card>

            <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-8 hover:border-emerald-400/40 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t.pilotProjectsTitle}</h3>
              <p className="text-slate-400 leading-relaxed">{t.pilotProjectsDesc}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Selected Projects */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.selectedProjectsTitle}</h2>
            <p className="text-slate-400 text-lg">{t.selectedProjectsSubtitle}</p>
          </div>

          <div className="space-y-8">
            {/* DC Fast Charging Pilots */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Factory className="w-7 h-7 text-blue-400" />
                {t.dcPilotsTitle}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-6 hover:border-blue-400/40 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{t.project1Title}</h4>
                      <p className="text-slate-400 leading-relaxed">{t.project1Desc}</p>
                    </div>
                  </div>
                  <div className="space-y-2 ml-16">
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm">{t.project1Feature1}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm">{t.project1Feature2}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm">{t.project1Feature3}</span>
                    </div>
                  </div>
                </Card>

                <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-6 hover:border-blue-400/40 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Factory className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{t.project2Title}</h4>
                      <p className="text-slate-400 leading-relaxed">{t.project2Desc}</p>
                    </div>
                  </div>
                  <div className="space-y-2 ml-16">
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm">{t.project2Feature1}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm">{t.project2Feature2}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm">{t.project2Feature3}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Residential and Light Commercial */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Home className="w-7 h-7 text-emerald-400" />
                {t.residentialTitle}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-6 hover:border-emerald-400/40 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Home className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{t.project3Title}</h4>
                      <p className="text-slate-400 leading-relaxed">{t.project3Desc}</p>
                    </div>
                  </div>
                  <div className="space-y-2 ml-16">
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm">{t.project3Feature1}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm">{t.project3Feature2}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm">{t.project3Feature3}</span>
                    </div>
                  </div>
                </Card>

                <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-6 hover:border-emerald-400/40 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{t.project4Title}</h4>
                      <p className="text-slate-400 leading-relaxed">{t.project4Desc}</p>
                    </div>
                  </div>
                  <div className="space-y-2 ml-16">
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm">{t.project4Feature1}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm">{t.project4Feature2}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm">{t.project4Feature3}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border-emerald-500/30 backdrop-blur-sm p-12 md:p-16 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">{t.ctaTitle}</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">{t.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white group">
              {t.discussProject}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 bg-transparent"
            >
              {t.viewSolutions}
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
                  <Link href="/solutions" className="hover:text-white transition-colors">
                    {t.footerInstallation}
                  </Link>
                </li>
                <li>
                  <Link href="/solutions" className="hover:text-white transition-colors">
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
                  <Link href="/about" className="hover:text-white transition-colors">
                    {t.footerAbout}
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="hover:text-white transition-colors">
                    {t.footerProjects}
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
