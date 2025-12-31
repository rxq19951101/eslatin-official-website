"use client"

import { MessageCircle } from "lucide-react"
import Link from "next/link"

export function WhatsAppFloat() {
  return (
    <Link
      href="https://wa.me/573001234567"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Contact us on WhatsApp"
    >
      <div className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <MessageCircle className="w-6 h-6" />
        <span className="hidden sm:block font-semibold text-sm">WhatsApp</span>
      </div>
    </Link>
  )
}

