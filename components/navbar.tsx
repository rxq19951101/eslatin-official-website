"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { LanguageSwitcher } from "@/components/language-switcher"
import { MobileNav } from "@/components/mobile-nav"
import { translations } from "@/lib/translations"
import { useLanguage } from "@/contexts/language-context"

export function Navbar() {
  const pathname = usePathname()
  const { lang, setLang } = useLanguage()
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
          <Image 
            src="/logo.png" 
            alt="EsLatin Logo" 
            width={32} 
            height={32} 
            className="w-8 h-8"
            priority
          />
          <span className="text-2xl font-bold text-white">EsLatin</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/" 
            className={isHomePage ? "text-emerald-400 font-semibold" : "text-slate-300 hover:text-white transition-colors"}
          >
            {t.home}
          </Link>
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
        
        <div className="md:hidden flex items-center gap-2">
          {/* 移动端语言切换器 - 在导航栏顶部显示 */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-0.5 border border-slate-700/50">
              <button
                onClick={() => {
                  setLang("es")
                }}
                className={`px-2 py-1.5 text-xs font-medium rounded transition-all ${
                  lang === "es"
                    ? "text-emerald-400 bg-emerald-400/10 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                ES
              </button>
              <div className="w-px h-3 bg-slate-600" />
              <button
                onClick={() => {
                  setLang("zh")
                }}
                className={`px-2 py-1.5 text-xs font-medium rounded transition-all ${
                  lang === "zh"
                    ? "text-emerald-400 bg-emerald-400/10 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                中
              </button>
            </div>
          </div>
          <MobileNav lang={lang} pathname={pathname} translations={t} onLanguageChange={setLang} />
        </div>
      </div>
    </header>
  )
}

