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
    <div className="flex items-center gap-3">
      <Globe className="w-5 h-5 text-slate-400 flex-shrink-0" />
      <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
        <button
          onClick={() => handleLanguageChange("es")}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-all min-w-[3rem] ${
            currentLang === "es"
              ? "text-emerald-400 bg-emerald-400/10 font-semibold"
              : "text-slate-300 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          ES
        </button>
        <div className="w-px h-4 bg-slate-600" />
        <button
          onClick={() => handleLanguageChange("zh")}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-all min-w-[3rem] ${
            currentLang === "zh"
              ? "text-emerald-400 bg-emerald-400/10 font-semibold"
              : "text-slate-300 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          中文
        </button>
      </div>
    </div>
  )
}
