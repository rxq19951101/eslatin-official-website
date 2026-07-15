/** Centralized contact info — update here only */
export const CONTACT = {
  email: "info@eslatin.com.co",
  /** Digits only, with country code (for wa.me) */
  whatsappNumber: "573161807466",
  whatsappDisplay: "+57 316 180 7466",
} as const

export const whatsappUrl = `https://wa.me/${CONTACT.whatsappNumber}`
export const mailtoUrl = `mailto:${CONTACT.email}`
