import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { LanguageProvider } from "@/contexts/language-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "EsLatin | Infraestructura de recarga para vehículos eléctricos",
  description:
    "Soluciones integrales de recarga para vehículos eléctricos en América Latina: instalación, equipos y plataforma de gestión.",
  icons: {
    icon: [
      {
        url: "/brand/eslatin-app-icon.png",
        type: "image/png",
      },
    ],
    apple: "/brand/eslatin-app-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <LanguageProvider>
          {children}
          <WhatsAppFloat />
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}
