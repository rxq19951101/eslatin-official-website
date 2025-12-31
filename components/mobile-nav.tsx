"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher, type Language } from "@/components/language-switcher"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface MobileNavProps {
  lang: Language
  pathname: string
  translations: {
    services?: string
    solutions?: string
    platform?: string
    projects?: string
    about?: string
    contactUs?: string
    home?: string
  }
  onLanguageChange: (lang: Language) => void
}

export function MobileNav({ lang, pathname, translations, onLanguageChange }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  
  // 判断当前页面路径
  const isHomePage = pathname === "/"
  const isSolutionsPage = pathname === "/solutions"
  const isPlatformPage = pathname === "/platform"
  const isProjectsPage = pathname === "/projects"
  const isAboutPage = pathname === "/about"

  // 确保只在客户端渲染
  useEffect(() => {
    setMounted(true)
  }, [])

  // 阻止body滚动当菜单打开时
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleLinkClick = (href: string) => {
    setIsOpen(false)
    router.push(href)
  }

  // 菜单内容
  const overlay = isOpen ? (
    <div className="fixed inset-0 z-[9999] md:hidden">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      
      {/* 侧边栏菜单 */}
      <aside 
        className="absolute top-0 right-0 h-full w-[280px] bg-slate-950 border-l border-blue-500/20 shadow-2xl overflow-y-auto pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
            <div className="p-6">
              {/* 头部 */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-blue-500/20">
                <h2 className="text-lg font-bold text-white">{lang === "zh" ? "导航" : "Navegación"}</h2>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer touch-manipulation"
                  aria-label="关闭菜单"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 语言切换器 */}
              <div className="mb-6 pb-6 border-b border-blue-500/20">
                <p className="text-xs text-slate-400 mb-3">{lang === "zh" ? "语言" : "Idioma"}</p>
                <LanguageSwitcher currentLang={lang} onLanguageChange={onLanguageChange} />
              </div>

              {/* 导航链接列表 */}
              <nav className="space-y-3" role="navigation" aria-label="主导航">
                {/* 首页 - 始终显示 */}
                <button
                  type="button"
                  onClick={() => handleLinkClick("/")}
                  className={`w-full text-left px-4 py-4 rounded-lg transition-all cursor-pointer touch-manipulation select-none border ${
                    isHomePage
                      ? "text-emerald-400 font-semibold bg-emerald-400/10 border-emerald-400/30"
                      : "text-slate-200 hover:text-white hover:bg-blue-500/10 active:bg-blue-500/20 border-slate-700/50"
                  }`}
                  style={{ WebkitTapHighlightColor: 'transparent', minHeight: '48px' }}
                >
                  <span className="text-base font-medium">{lang === "zh" ? "首页" : "Inicio"}</span>
                </button>
                
                {/* 解决方案 - 始终显示 */}
                <button
                  type="button"
                  onClick={() => handleLinkClick("/solutions")}
                  className={`w-full text-left px-4 py-4 rounded-lg transition-all cursor-pointer touch-manipulation select-none border ${
                    isSolutionsPage
                      ? "text-emerald-400 font-semibold bg-emerald-400/10 border-emerald-400/30"
                      : "text-slate-200 hover:text-white hover:bg-blue-500/10 active:bg-blue-500/20 border-slate-700/50"
                  }`}
                  style={{ WebkitTapHighlightColor: 'transparent', minHeight: '48px' }}
                >
                  <span className="text-base font-medium">{translations.solutions || "Soluciones"}</span>
                </button>
                
                {/* 平台 - 始终显示 */}
                <button
                  type="button"
                  onClick={() => handleLinkClick("/platform")}
                  className={`w-full text-left px-4 py-4 rounded-lg transition-all cursor-pointer touch-manipulation select-none border ${
                    isPlatformPage
                      ? "text-emerald-400 font-semibold bg-emerald-400/10 border-emerald-400/30"
                      : "text-slate-200 hover:text-white hover:bg-blue-500/10 active:bg-blue-500/20 border-slate-700/50"
                  }`}
                  style={{ WebkitTapHighlightColor: 'transparent', minHeight: '48px' }}
                >
                  <span className="text-base font-medium">{translations.platform || "Plataforma"}</span>
                </button>
                
                {/* 项目 - 始终显示 */}
                <button
                  type="button"
                  onClick={() => handleLinkClick("/projects")}
                  className={`w-full text-left px-4 py-4 rounded-lg transition-all cursor-pointer touch-manipulation select-none border ${
                    isProjectsPage
                      ? "text-emerald-400 font-semibold bg-emerald-400/10 border-emerald-400/30"
                      : "text-slate-200 hover:text-white hover:bg-blue-500/10 active:bg-blue-500/20 border-slate-700/50"
                  }`}
                  style={{ WebkitTapHighlightColor: 'transparent', minHeight: '48px' }}
                >
                  <span className="text-base font-medium">{translations.projects || "Proyectos"}</span>
                </button>
                
                {/* 关于我们 - 始终显示 */}
                <button
                  type="button"
                  onClick={() => handleLinkClick("/about")}
                  className={`w-full text-left px-4 py-4 rounded-lg transition-all cursor-pointer touch-manipulation select-none border ${
                    isAboutPage
                      ? "text-emerald-400 font-semibold bg-emerald-400/10 border-emerald-400/30"
                      : "text-slate-200 hover:text-white hover:bg-blue-500/10 active:bg-blue-500/20 border-slate-700/50"
                  }`}
                  style={{ WebkitTapHighlightColor: 'transparent', minHeight: '48px' }}
                >
                  <span className="text-base font-medium">{translations.about || "Sobre Nosotros"}</span>
                </button>
                
                {/* 联系我们按钮 */}
                <div className="pt-4 mt-4 border-t border-blue-500/20">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10 bg-transparent cursor-pointer touch-manipulation py-4 text-base font-medium"
                    onClick={() => handleLinkClick("/about#contact")}
                  >
                    {translations.contactUs || "Contáctenos"}
                  </Button>
                </div>
              </nav>
            </div>
          </aside>
    </div>
  ) : null

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
        aria-label="打开菜单"
        aria-expanded={isOpen}
      >
        <Menu className="w-6 h-6" />
      </button>

      {mounted && typeof document !== 'undefined' ? createPortal(overlay, document.body) : null}
    </>
  )
}

