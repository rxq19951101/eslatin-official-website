"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowRight,
  Home,
  Building2,
  ShoppingBag,
  Users,
  Store,
  Warehouse,
  ParkingCircle,
  BuildingIcon,
  CheckCircle2,
  Zap,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { solutionsTranslations } from "@/lib/solutions-translations"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function SolutionsPage() {
  const { lang } = useLanguage()
  const t = solutionsTranslations[lang]

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

      {/* EV Charger Installation Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.installationTitle}</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t.installationSubtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Residential */}
          <Card className="bg-slate-900/50 border-emerald-500/20 backdrop-blur-sm p-8 hover:border-emerald-400/40 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Home className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t.residentialTitle}</h3>
            <p className="text-slate-400 leading-relaxed mb-6">{t.residentialDesc}</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.residentialFeature1}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.residentialFeature2}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.residentialFeature3}</span>
              </li>
            </ul>
          </Card>

          {/* Commercial */}
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-8 hover:border-blue-400/40 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t.commercialTitle}</h3>
            <p className="text-slate-400 leading-relaxed mb-6">{t.commercialDesc}</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.commercialFeature1}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.commercialFeature2}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.commercialFeature3}</span>
              </li>
            </ul>
          </Card>

          {/* Turnkey */}
          <Card className="bg-slate-900/50 border-emerald-500/20 backdrop-blur-sm p-8 hover:border-emerald-400/40 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t.turnkeyTitle}</h3>
            <p className="text-slate-400 leading-relaxed mb-6">{t.turnkeyDesc}</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.turnkeyFeature1}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.turnkeyFeature2}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.turnkeyFeature3}</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* EV Charger Sales Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.salesTitle}</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t.salesSubtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Distributors */}
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-8 hover:border-blue-400/40 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Warehouse className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t.distributorsTitle}</h3>
            <p className="text-slate-400 leading-relaxed mb-6">{t.distributorsDesc}</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.distributorsFeature1}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.distributorsFeature2}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.distributorsFeature3}</span>
              </li>
            </ul>
          </Card>

          {/* End Users */}
          <Card className="bg-slate-900/50 border-emerald-500/20 backdrop-blur-sm p-8 hover:border-emerald-400/40 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t.endUsersTitle}</h3>
            <p className="text-slate-400 leading-relaxed mb-6">{t.endUsersDesc}</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.endUsersFeature1}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.endUsersFeature2}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.endUsersFeature3}</span>
              </li>
            </ul>
          </Card>

          {/* AC & DC Options */}
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-8 hover:border-blue-400/40 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t.chargingOptionsTitle}</h3>
            <p className="text-slate-400 leading-relaxed mb-6">{t.chargingOptionsDesc}</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.chargingOptionsFeature1}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.chargingOptionsFeature2}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.chargingOptionsFeature3}</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Deployment Scenarios */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.scenariosTitle}</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t.scenariosSubtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Shopping Malls */}
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-6 hover:border-emerald-400/40 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Store className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t.mallsTitle}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{t.mallsDesc}</p>
          </Card>

          {/* Office Buildings */}
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-6 hover:border-blue-400/40 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BuildingIcon className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t.officesTitle}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{t.officesDesc}</p>
          </Card>

          {/* Parking Facilities */}
          <Card className="bg-slate-900/50 border-emerald-500/20 backdrop-blur-sm p-6 hover:border-emerald-400/40 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ParkingCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t.parkingTitle}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{t.parkingDesc}</p>
          </Card>

          {/* Residential Communities */}
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-6 hover:border-blue-400/40 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Home className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t.residentialCommunitiesTitle}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{t.residentialCommunitiesDesc}</p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border-emerald-500/30 backdrop-blur-sm p-12 md:p-16 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">{t.ctaTitle}</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">{t.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white group">
              {t.getQuote}
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
              <h4 className="text-white font-semibold mb-4">{t.footerSolutions}</h4>
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
                  <Link href="/solutions#scenarios" className="hover:text-white transition-colors">
                    {t.footerScenarios}
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
