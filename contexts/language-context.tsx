"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import type { Language } from "@/components/language-switcher"

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // 初始值始终为 "es"，确保服务器端和客户端首次渲染一致
  const [lang, setLangState] = useState<Language>("es")
  const [mounted, setMounted] = useState(false)

  // 从localStorage加载保存的语言（仅在客户端 mounted 后）
  useEffect(() => {
    setMounted(true)
    // 只在客户端执行
    const savedLang = localStorage.getItem("eslatin-language") as Language | null
    if (savedLang && (savedLang === "es" || savedLang === "zh")) {
      setLangState(savedLang)
    }
  }, [])

  // 监听localStorage变化（跨标签页同步）
  useEffect(() => {
    if (!mounted) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "eslatin-language") {
        const newLang = e.newValue as Language | null
        if (newLang && (newLang === "es" || newLang === "zh")) {
          setLangState(newLang)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [mounted])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    // 只在客户端执行
    if (mounted) {
      localStorage.setItem("eslatin-language", newLang)
      // 触发自定义事件，通知当前标签页的其他组件
      window.dispatchEvent(new Event("languagechange"))
    }
  }

  // 监听自定义事件（当前标签页内的语言变化）
  useEffect(() => {
    if (!mounted) return

    const handleLanguageChange = () => {
      const savedLang = localStorage.getItem("eslatin-language") as Language | null
      if (savedLang && (savedLang === "es" || savedLang === "zh")) {
        setLangState(savedLang)
      }
    }

    window.addEventListener("languagechange", handleLanguageChange)
    return () => window.removeEventListener("languagechange", handleLanguageChange)
  }, [mounted])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}


