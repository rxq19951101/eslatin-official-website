"use client"

import { Navbar } from "@/components/navbar"
import { SurveyBooking } from "@/components/survey-booking"

export default function SurveyPage() {
  return (
    <div className="min-h-screen bg-grid-pattern bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950">
      <Navbar />
      <main>
        <SurveyBooking />
      </main>
    </div>
  )
}
