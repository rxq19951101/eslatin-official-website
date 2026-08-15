"use client"

import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { whatsappUrl } from "@/lib/contact"
import { useLanguage } from "@/contexts/language-context"

export function WhatsAppFloat() {
  const { lang } = useLanguage()
  const label = lang === "es" ? "Contactar por WhatsApp" : "通过 WhatsApp 联系我们"
  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label={label}
    >
      <div className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <MessageCircle className="w-6 h-6" />
        <span className="hidden sm:block font-semibold text-sm">WhatsApp</span>
      </div>
    </Link>
  )
}
