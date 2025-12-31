"use client"
import { Globe } from "lucide-react"
import { useEffect, useState } from "react"

export type Language = "es" | "zh"

export function LanguageSwitcher({
  currentLang,
  onLanguageChange,
}: {
  currentLang: Language
  onLanguageChange: (lang: Language) => void
}) {
  const [mounted, setMounted] = useState(false)
  
  // 从localStorage加载保存的语言（仅在客户端）
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem("eslatin-language") as Language | null
      if (savedLang && (savedLang === "es" || savedLang === "zh")) {
        onLanguageChange(savedLang)
      }
    }
  }, [onLanguageChange])

  const handleLanguageChange = (lang: Language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("eslatin-language", lang)
    }
    onLanguageChange(lang)
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-slate-400" />
      <button
        onClick={() => handleLanguageChange("es")}
        className={`px-2 py-1 text-sm transition-colors ${
          currentLang === "es" ? "text-emerald-400 font-semibold" : "text-slate-400 hover:text-white"
        }`}
      >
        ES
      </button>
      <span className="text-slate-600">|</span>
      <button
        onClick={() => handleLanguageChange("zh")}
        className={`px-2 py-1 text-sm transition-colors ${
          currentLang === "zh" ? "text-emerald-400 font-semibold" : "text-slate-400 hover:text-white"
        }`}
      >
        中文
      </button>
    </div>
  )
}
