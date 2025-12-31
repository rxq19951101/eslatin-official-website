"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Shield, Globe2, Users, Target, MessageCircle, Mail, Send } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { aboutTranslations } from "@/lib/about-translations"
import Link from "next/link"
import { useState, useEffect } from "react"
import type { Language } from "@/components/language-switcher"

export default function AboutPage() {
  const [lang, setLang] = useState<Language>("es")
  
  useEffect(() => {
    const savedLang = localStorage.getItem("eslatin-language") as Language | null
    if (savedLang && (savedLang === "es" || savedLang === "zh")) {
      setLang(savedLang)
    }
  }, [])

  const t = aboutTranslations[lang]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-balance leading-tight">{t.heroTitle}</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto text-pretty leading-relaxed">{t.heroSubtitle}</p>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-8 h-8 text-emerald-400" />
              <h2 className="text-3xl md:text-4xl font-bold text-white">{t.whoWeAreTitle}</h2>
            </div>

            <div className="space-y-6 text-slate-300 leading-relaxed">
              <p className="text-lg">{t.whoWeAreParagraph1}</p>
              <p className="text-lg">{t.whoWeAreParagraph2}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-10 pt-10 border-t border-blue-500/20">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold text-lg">{t.installationFocus}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{t.installationFocusDesc}</p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Globe2 className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold text-lg">{t.salesFocus}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{t.salesFocusDesc}</p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold text-lg">{t.platformFocus}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{t.platformFocusDesc}</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Why EsLatin Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.whyEsLatinTitle}</h2>
            <p className="text-slate-400 text-lg">{t.whyEsLatinSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-8 hover:border-emerald-400/40 transition-all">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t.executionTitle}</h3>
              <p className="text-slate-300 leading-relaxed">{t.executionDesc}</p>
            </Card>

            <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-8 hover:border-emerald-400/40 transition-all">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t.complianceTitle}</h3>
              <p className="text-slate-300 leading-relaxed">{t.complianceDesc}</p>
            </Card>

            <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-8 hover:border-emerald-400/40 transition-all">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6">
                <Globe2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t.supplyChainTitle}</h3>
              <p className="text-slate-300 leading-relaxed">{t.supplyChainDesc}</p>
            </Card>

            <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-8 hover:border-emerald-400/40 transition-all">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t.visionTitle}</h3>
              <p className="text-slate-300 leading-relaxed">{t.visionDesc}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.contactTitle}</h2>
            <p className="text-slate-400 text-lg">{t.contactSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Methods */}
            <div className="space-y-6">
              <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-2">{t.whatsappTitle}</h3>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">{t.whatsappDesc}</p>
                    <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white group w-full sm:w-auto">
                      <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {t.whatsappButton}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-2">{t.emailTitle}</h3>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">{t.emailDesc}</p>
                    <a
                      href="mailto:info@eslatin.com.co"
                      className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                    >
                      info@eslatin.com.co
                    </a>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-6">
              <h3 className="text-white font-semibold text-xl mb-6">{t.formTitle}</h3>
              <form className="space-y-4">
                <div>
                  <Input
                    placeholder={t.formName}
                    className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder={t.formEmail}
                    className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <Input
                    placeholder={t.formCompany}
                    className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder={t.formMessage}
                    rows={4}
                    className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-slate-500 resize-none"
                  />
                </div>
                <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white w-full group">
                  <Send className="w-4 h-4 mr-2" />
                  {t.formSubmit}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/20 bg-slate-950/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-slate-400 text-sm">
          <p>{t.footerCopyright}</p>
        </div>
      </footer>
    </div>
  )
}
