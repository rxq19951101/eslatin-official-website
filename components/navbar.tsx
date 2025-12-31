"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import { LanguageSwitcher, type Language } from "@/components/language-switcher"
import { MobileNav } from "@/components/mobile-nav"
import { translations } from "@/lib/translations"

export function Navbar() {
  const [pathname, setPathname] = useState<string>("")
  const [lang, setLang] = useState<Language>("es")
  
  // 获取路径名和语言（仅在客户端）
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // 设置初始路径
    setPathname(window.location.pathname)
    
    // 从localStorage加载保存的语言
    const savedLang = localStorage.getItem("eslatin-language") as Language | null
    if (savedLang && (savedLang === "es" || savedLang === "zh")) {
      setLang(savedLang)
    }
    
    // 监听popstate（浏览器前进后退）
    const handlePopState = () => {
      setPathname(window.location.pathname)
    }
    
    window.addEventListener('popstate', handlePopState)
    
    // 监听Next.js路由变化（通过监听所有点击事件中的Link点击）
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href]')
      if (link && link.getAttribute('href')?.startsWith('/')) {
        // 延迟更新以确保路由已完成
        setTimeout(() => {
          setPathname(window.location.pathname)
        }, 0)
      }
    }
    
    document.addEventListener('click', handleClick, true)
    
    return () => {
      window.removeEventListener('popstate', handlePopState)
      document.removeEventListener('click', handleClick, true)
    }
  }, [])

  const t = translations[lang]

  // 判断当前页面路径
  const isHomePage = pathname === "/" || pathname === ""
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

