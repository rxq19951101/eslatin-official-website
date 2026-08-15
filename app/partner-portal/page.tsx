"use client"

import { Navbar } from "@/components/navbar"
import { PartnerPortal } from "@/components/partner-portal"

export default function PartnerPortalPage() {
  return (
    <div className="min-h-screen bg-grid-pattern bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950">
      <Navbar />
      <main><PartnerPortal /></main>
    </div>
  )
}
