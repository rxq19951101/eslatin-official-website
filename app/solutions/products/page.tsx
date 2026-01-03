"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, CheckCircle2, Zap } from "lucide-react"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"
import { products } from "@/lib/products-data"
import { solutionsTranslations } from "@/lib/solutions-translations"

export default function ProductsPage() {
  const { lang } = useLanguage()
  const t = solutionsTranslations[lang]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToSolutions}</span>
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold text-white text-balance leading-tight">
            {t.productsTitle}
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto text-pretty leading-relaxed">
            {t.productsSubtitle}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm overflow-hidden hover:border-emerald-400/40 transition-all group"
            >
              <Link href={`/solutions/products/${product.id}`}>
                <div className="relative h-64 w-full bg-gradient-to-br from-blue-600/20 to-emerald-600/20 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name[lang]}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                      {product.power}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {product.name[lang]}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    {product.description[lang]}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.features[lang].slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium group-hover:gap-3 transition-all">
                    <span>{t.viewDetails}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border-emerald-500/30 backdrop-blur-sm p-12 md:p-16 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">{t.ctaTitle}</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">{t.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white group">
              {t.getQuote}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 bg-transparent"
            >
              {t.talkExpert}
            </Button>
          </div>
        </Card>
      </section>
    </div>
  )
}

