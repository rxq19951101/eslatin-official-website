"use client"

import { BookingAdmin } from "@/components/booking-admin"
import { Navbar } from "@/components/navbar"

export default function BookingAdminPage() {
  return (
    <div className="min-h-screen bg-grid-pattern bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950">
      <Navbar />
      <main>
        <BookingAdmin />
      </main>
    </div>
  )
}
