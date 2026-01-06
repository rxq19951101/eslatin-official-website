"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Zap } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"
import { solutionsTranslations } from "@/lib/solutions-translations"
import type { Product } from "@/lib/products-data"

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { lang } = useLanguage()
  const t = solutionsTranslations[lang]

  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <Link
          href="/solutions/products"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToProducts}</span>
        </Link>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 w-full bg-gradient-to-br from-blue-600/20 to-emerald-600/20 rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.name[lang]}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.jpg';
                }}
              />
              <div className="absolute top-4 right-4">
                <span className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                  {product.power}
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {product.name[lang]}
              </h1>
              <p className="text-xl text-slate-300 mb-6 leading-relaxed">
                {product.description[lang]}
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {product.features[lang].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white group">
                {t.getQuote}
                <ArrowLeft className="ml-2 w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-emerald-400" />
                <h2 className="text-2xl font-bold text-white">{t.specificationsTitle}</h2>
              </div>
              <div className="space-y-0">
                {Object.entries(product.specifications[lang]).map(([key, value], index) => (
                  <div 
                    key={key} 
                    className={`flex py-3 ${
                      index !== Object.entries(product.specifications[lang]).length - 1 
                        ? 'border-b border-blue-500/10' 
                        : ''
                    }`}
                  >
                    <div className="text-slate-400 font-medium w-[200px] md:w-[220px] flex-shrink-0 pr-4">{key}:</div>
                    <div className="text-white flex-1">{value}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-slate-900/50 border-emerald-500/20 backdrop-blur-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">{t.useCasesTitle}</h2>
              </div>
              <ul className="space-y-3">
                {product.useCases[lang].map((useCase, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{useCase}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
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
              <ArrowLeft className="ml-2 w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
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
    </>
  )
}

