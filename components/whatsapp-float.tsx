"use client"

import { Mail } from "lucide-react"
import Link from "next/link"
import { mailtoUrl } from "@/lib/contact"
import { useLanguage } from "@/contexts/language-context"

export function WhatsAppFloat() {
  const { lang } = useLanguage()
  const label = lang === "es" ? "Escribir a EsLatin" : "通过邮件联系 EsLatin"
  return (
    <Link
      href={`${mailtoUrl}?subject=${encodeURIComponent("Consulta EsLatin")}`}
      className="fixed bottom-6 right-6 z-50 group"
      aria-label={label}
    >
      <div className="flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-full px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <Mail className="w-6 h-6" />
        <span className="hidden sm:block font-semibold text-sm">info@eslatin.com.co</span>
      </div>
    </Link>
  )
}
