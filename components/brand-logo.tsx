import Image from "next/image"
import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
  priority?: boolean
}

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/brand/eslatin-logo-horizontal.png"
      alt="EsLatin"
      width={1082}
      height={326}
      className={cn("h-10 w-auto object-contain", className)}
      priority={priority}
    />
  )
}
