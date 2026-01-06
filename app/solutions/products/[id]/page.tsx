import React from "react"
import { Navbar } from "@/components/navbar"
import { products } from "@/lib/products-data"
import { notFound } from "next/navigation"
import { ProductDetailClient } from "./product-detail-client"

// 为静态导出生成所有产品ID
export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const product = products.find((p) => p.id === resolvedParams.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950">
      <Navbar />
      <ProductDetailClient product={product} />
    </div>
  )
}

