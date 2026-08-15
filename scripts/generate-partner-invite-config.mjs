import { createHash, randomBytes } from "node:crypto"

const partners = ["FAW", "ICAR"]
const codes = partners.map((partner) => ({
  partner,
  code: `${partner}-BOG-${randomBytes(5).toString("hex").toUpperCase()}`,
}))

const hashes = codes.map(({ partner, code }) => (
  `${partner}:${createHash("sha256").update(code).digest("hex")}`
))

console.log("Códigos para entregar a los socios (guárdelos de forma privada):")
for (const { partner, code } of codes) {
  console.log(`${partner}: ${code}`)
}

console.log("\nVariables para el backend:")
console.log("BOOKING_INVITE_REQUIRED=true")
console.log(`BOOKING_INVITE_TOKEN_SECRET=${randomBytes(32).toString("hex")}`)
console.log(`BOOKING_PARTNER_INVITE_HASHES=${hashes.join(",")}`)
console.log("BOOKING_INVITE_TOKEN_TTL_SECONDS=1800")
