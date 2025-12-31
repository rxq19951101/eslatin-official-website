"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher, type Language } from "@/components/language-switcher"
import Link from "next/link"

interface MobileNavProps {
  lang: Language
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

export function MobileNav({ lang, translations, onLanguageChange }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-300 hover:text-white transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          <nav className="fixed top-0 right-0 h-full w-64 bg-slate-950/95 backdrop-blur-md border-l border-blue-500/20 z-50 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-bold text-white">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {translations.services && (
                <Link
                  href="/#services"
                  className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-blue-500/10 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {translations.services}
                </Link>
              )}
              {translations.solutions && (
                <Link
                  href="/solutions"
                  className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-blue-500/10 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {translations.solutions}
                </Link>
              )}
              {translations.platform && (
                <Link
                  href="/platform"
                  className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-blue-500/10 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {translations.platform}
                </Link>
              )}
              {translations.projects && (
                <Link
                  href="/projects"
                  className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-blue-500/10 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {translations.projects}
                </Link>
              )}
              {translations.about && (
                <Link
                  href="/about"
                  className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-blue-500/10 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {translations.about}
                </Link>
              )}
              {translations.home && (
                <Link
                  href="/"
                  className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-blue-500/10 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {translations.home}
                </Link>
              )}
              
              {(translations.contactUs || translations.home) && (
                <div className="pt-4 border-t border-blue-500/20">
                  <Link href="/about#contact">
                    <Button
                      variant="outline"
                      className="w-full border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10 bg-transparent"
                      onClick={() => setIsOpen(false)}
                    >
                      {translations.contactUs || "Contact"}
                    </Button>
                  </Link>
                </div>
              )}

              <div className="pt-4 border-t border-blue-500/20 flex justify-center">
                <LanguageSwitcher currentLang={lang} onLanguageChange={onLanguageChange} />
              </div>
            </div>
          </nav>
        </>
      )}
    </div>
  )
}

