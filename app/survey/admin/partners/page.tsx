"use client"

import { Navbar } from "@/components/navbar"
import { PartnerConfigAdmin } from "@/components/partner-config-admin"

export default function PartnerConfigAdminPage() {
  return <div className="min-h-screen bg-grid-pattern bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950"><Navbar /><main><PartnerConfigAdmin /></main></div>
}
