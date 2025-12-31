"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import { LanguageSwitcher, type Language } from "@/components/language-switcher"
import { MobileNav } from "@/components/mobile-nav"
import { translations } from "@/lib/translations"

export function Navbar() {
  const pathname = usePathname()
  const [lang, setLang] = useState<Language>("es")
  
  // 从localStorage加载保存的语言
  useEffect(() => {
    const savedLang = localStorage.getItem("eslatin-language") as Language | null
    if (savedLang && (savedLang === "es" || savedLang === "zh")) {
      setLang(savedLang)
    }
  }, [])

  const t = translations[lang]

  // 判断当前页面路径
  const isHomePage = pathname === "/"
  const isSolutionsPage = pathname === "/solutions"
  const isPlatformPage = pathname === "/platform"
  const isProjectsPage = pathname === "/projects"
  const isAboutPage = pathname === "/about"

  return (
    <header className="border-b border-blue-500/20 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="w-8 h-8 text-emerald-400" />
          <span className="text-2xl font-bold text-white">EsLatin</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#services" className={isHomePage ? "text-slate-300 hover:text-white transition-colors" : "hidden"}>
            {t.services}
          </a>
          <Link 
            href="/solutions" 
            className={isSolutionsPage ? "text-emerald-400 font-semibold" : "text-slate-300 hover:text-white transition-colors"}
          >
            {t.solutions}
          </Link>
          <Link 
            href="/platform" 
            className={isPlatformPage ? "text-emerald-400 font-semibold" : "text-slate-300 hover:text-white transition-colors"}
          >
            {t.platform}
          </Link>
          <Link 
            href="/projects" 
            className={isProjectsPage ? "text-emerald-400 font-semibold" : "text-slate-300 hover:text-white transition-colors"}
          >
            {t.projects}
          </Link>
          <Link 
            href="/about" 
            className={isAboutPage ? "text-emerald-400 font-semibold" : "text-slate-300 hover:text-white transition-colors"}
          >
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
  )
}

