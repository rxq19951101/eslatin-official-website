import { join } from "node:path"
import nodemailer from "nodemailer"

const BOGOTA_TIME_ZONE = "America/Bogota"
const DEFAULT_SMTP_HOST = "mail.spacemail.com"
const DEFAULT_SMTP_PORT = 465
const DEFAULT_SENDER = "support@eslatin.com.co"
const DEFAULT_REPLY_TO = "info@eslatin.com.co"

let transportCache = null

function envBoolean(value, fallback = false) {
  if (value == null || value === "") return fallback
  return value.toLowerCase() === "true"
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function emailConfig() {
  const port = Number(process.env.SPACEMAIL_SMTP_PORT || DEFAULT_SMTP_PORT)
  return {
    enabled: envBoolean(process.env.BOOKING_CONFIRMATION_EMAIL_ENABLED),
    host: process.env.SPACEMAIL_SMTP_HOST?.trim() || DEFAULT_SMTP_HOST,
    port,
    secure: envBoolean(process.env.SPACEMAIL_SMTP_SECURE, port === 465),
    user: process.env.SPACEMAIL_SMTP_USER?.trim() || DEFAULT_SENDER,
    password: process.env.SPACEMAIL_SMTP_PASSWORD || "",
    from: process.env.BOOKING_EMAIL_FROM?.trim() || DEFAULT_SENDER,
    replyTo: process.env.BOOKING_EMAIL_REPLY_TO?.trim() || DEFAULT_REPLY_TO,
  }
}

function getTransport() {
  if (transportCache) return transportCache
  const config = emailConfig()
  if (!config.enabled) return null
  if (!config.password) {
    throw new Error("SPACEMAIL_SMTP_PASSWORD is required when confirmation email is enabled.")
  }
  transportCache = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.password },
  })
  return transportCache
}

function formatDate(date) {
  return new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: BOGOTA_TIME_ZONE,
  }).format(new Date(`${date}T12:00:00-05:00`))
}

function endTime(time) {
  return `${String(Number(time.slice(0, 2)) + 1).padStart(2, "0")}:00`
}

export function confirmationEmailStatus() {
  const config = emailConfig()
  return {
    enabled: config.enabled,
    configured: config.enabled && Boolean(config.password),
    sender: config.from,
    replyTo: config.replyTo,
  }
}

export function buildConfirmationEmail(booking, employee) {
  const config = emailConfig()
  const dateLabel = formatDate(booking.date)
  const timeEnd = endTime(booking.time)
  const subject = `Confirmación de visita técnica — ${dateLabel} a las ${booking.time}`
  const logoPath = join(process.cwd(), "public", "brand", "eslatin-logo-horizontal.png")
  const safe = {
    name: escapeHtml(booking.name),
    address: escapeHtml(booking.address),
    employee: escapeHtml(employee.name),
    partner: escapeHtml(booking.partner?.name || ""),
    code: escapeHtml(booking.code),
    date: escapeHtml(dateLabel),
    start: escapeHtml(booking.time),
    end: escapeHtml(timeEnd),
    replyTo: escapeHtml(config.replyTo),
  }

  const text = [
    `Hola, ${booking.name}:`,
    "",
    "Tu visita técnica con EsLatin ha sido confirmada correctamente. Nuestro equipo ya recibió la información de la reserva.",
    "",
    "Detalles de la visita",
    ...(booking.partner ? [`Empresa asociada: ${booking.partner.name}`] : []),
    `Fecha: ${dateLabel}`,
    `Horario: ${booking.time}–${timeEnd} (hora de Bogotá)`,
    "Duración estimada: 1 hora",
    `Dirección: ${booking.address}, Bogotá`,
    `Especialista asignado: ${employee.name}`,
    `Número de reserva: ${booking.code}`,
    "",
    "Durante la visita, nuestro especialista evaluará las condiciones del lugar y recopilará la información necesaria para recomendarte la solución de carga más adecuada.",
    "",
    "Antes de la visita",
    "Por favor, asegúrate de que nuestro especialista pueda acceder al área donde se instalaría el cargador. Si cuentas con información sobre la instalación eléctrica o el estacionamiento, puedes tenerla disponible durante la visita.",
    "",
    `Si necesitas corregir la dirección, cambiar la fecha o cancelar la reserva, escríbenos lo antes posible a ${config.replyTo}, indicando tu número de reserva.`,
    "",
    "Gracias por confiar en EsLatin.",
    "",
    "Equipo EsLatin",
    "Infraestructura de recarga para vehículos eléctricos",
    config.replyTo,
    "www.eslatin.com.co",
    "",
    "Este correo fue enviado automáticamente como confirmación de una reserva realizada en el sitio web de EsLatin. Si no realizaste esta solicitud o necesitas ayuda, escríbenos a info@eslatin.com.co.",
  ].join("\n")

  const html = `<!doctype html>
<html lang="es">
  <body style="margin:0;background:#020617;font-family:Arial,Helvetica,sans-serif;color:#dbeafe">
    <div style="display:none;max-height:0;overflow:hidden">Tu visita técnica con EsLatin ha sido confirmada.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#020617">
      <tr>
        <td align="center" style="padding:32px 16px">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#0f172a;border:1px solid #1e3a5f;border-radius:18px;overflow:hidden">
            <tr>
              <td style="padding:28px 32px;background:linear-gradient(135deg,#071426,#06352f)">
                <img src="cid:eslatin-logo" alt="EsLatin" width="180" style="display:block;width:180px;height:auto">
              </td>
            </tr>
            <tr>
              <td style="padding:34px 32px">
                <p style="margin:0 0 12px;color:#94a3b8;font-size:14px">Hola, ${safe.name}:</p>
                <h1 style="margin:0 0 14px;color:#ffffff;font-size:28px;line-height:1.25">Tu visita técnica está confirmada</h1>
                <p style="margin:0 0 28px;color:#cbd5e1;font-size:16px;line-height:1.65">Nuestro equipo ya recibió la información de la reserva.</p>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#07111f;border:1px solid #1e3a5f;border-radius:14px">
                  <tr><td style="padding:22px 24px 8px;color:#34d399;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em">Detalles de la visita</td></tr>
                  ${booking.partner ? `<tr><td style="padding:6px 24px;color:#e2e8f0"><strong>Empresa asociada:</strong> ${safe.partner}</td></tr>` : ""}
                  <tr><td style="padding:6px 24px;color:#e2e8f0"><strong>Fecha:</strong> ${safe.date}</td></tr>
                  <tr><td style="padding:6px 24px;color:#e2e8f0"><strong>Horario:</strong> ${safe.start}–${safe.end} <span style="color:#94a3b8">(hora de Bogotá)</span></td></tr>
                  <tr><td style="padding:6px 24px;color:#e2e8f0"><strong>Duración estimada:</strong> 1 hora</td></tr>
                  <tr><td style="padding:6px 24px;color:#e2e8f0"><strong>Dirección:</strong> ${safe.address}, Bogotá</td></tr>
                  <tr><td style="padding:6px 24px;color:#e2e8f0"><strong>Especialista asignado:</strong> ${safe.employee}</td></tr>
                  <tr><td style="padding:6px 24px 22px;color:#e2e8f0"><strong>Número de reserva:</strong> ${safe.code}</td></tr>
                </table>

                <h2 style="margin:30px 0 10px;color:#ffffff;font-size:18px">Antes de la visita</h2>
                <p style="margin:0 0 18px;color:#cbd5e1;font-size:15px;line-height:1.65">Por favor, asegúrate de que nuestro especialista pueda acceder al área donde se instalaría el cargador. Si cuentas con información sobre la instalación eléctrica o el estacionamiento, puedes tenerla disponible durante la visita.</p>
                <p style="margin:0;color:#cbd5e1;font-size:15px;line-height:1.65">Si necesitas corregir la dirección, cambiar la fecha o cancelar la reserva, escríbenos lo antes posible a <a href="mailto:${safe.replyTo}" style="color:#34d399">${safe.replyTo}</a>, indicando tu número de reserva.</p>

                <p style="margin:30px 0 0;color:#ffffff;font-size:15px;line-height:1.6">Gracias por confiar en EsLatin.<br><strong>Equipo EsLatin</strong></p>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 32px;border-top:1px solid #1e293b;color:#64748b;font-size:12px;line-height:1.6">
                Este correo fue enviado automáticamente como confirmación de una reserva realizada en el sitio web de EsLatin. Si no realizaste esta solicitud o necesitas ayuda, escríbenos a <a href="mailto:info@eslatin.com.co" style="color:#94a3b8">info@eslatin.com.co</a>.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  return {
    from: { name: "EsLatin Reservas", address: config.from },
    replyTo: config.replyTo,
    to: booking.email,
    subject,
    text,
    html,
    attachments: [{ filename: "eslatin.png", path: logoPath, cid: "eslatin-logo" }],
  }
}

export async function sendConfirmationEmail(booking, employee) {
  const transport = getTransport()
  if (!transport) return { sent: false, skipped: true }
  const result = await transport.sendMail(buildConfirmationEmail(booking, employee))
  return { sent: true, messageId: result.messageId }
}

export function buildSalesNotificationEmail(booking, technicalEmployee, salesperson) {
  const config = emailConfig()
  const dateLabel = formatDate(booking.date)
  const timeEnd = endTime(booking.time)
  const safe = {
    salesName: escapeHtml(salesperson.name),
    customerName: escapeHtml(booking.name),
    address: escapeHtml(booking.address),
    phone: escapeHtml(booking.formattedPhone),
    email: escapeHtml(booking.email),
    city: escapeHtml(booking.cityName || "Bogotá, Colombia"),
    date: escapeHtml(dateLabel),
    start: escapeHtml(booking.time),
    end: escapeHtml(timeEnd),
    technician: escapeHtml(technicalEmployee.name),
    partner: escapeHtml(booking.partner?.name || ""),
    code: escapeHtml(booking.code),
  }
  const subject = `Nueva reserva de visita técnica — ${dateLabel} a las ${booking.time}`
  const text = [
    `Hola, ${salesperson.name}:`,
    "",
    "Se ha registrado una nueva reserva relacionada con tu cartera comercial.",
    "",
    "Datos del cliente",
    `Cliente: ${booking.name}`,
    `Teléfono: ${booking.formattedPhone}`,
    `Correo: ${booking.email}`,
    `Ciudad: ${booking.cityName || "Bogotá, Colombia"}`,
    `Dirección: ${booking.address}`,
    `Fecha: ${dateLabel}`,
    `Horario: ${booking.time}–${timeEnd} (hora de Bogotá)`,
    `Técnico asignado: ${technicalEmployee.name}`,
    `Número de reserva: ${booking.code}`,
    ...(booking.partner ? [`Empresa asociada: ${booking.partner.name}`] : []),
    "",
    "La invitación de calendario se ha enviado al técnico asignado. Este correo es informativo; cualquier cambio debe coordinarse con EsLatin.",
    "",
    "Equipo EsLatin",
    config.replyTo,
  ].join("\n")
  const html = `<!doctype html>
<html lang="es">
  <body style="margin:0;background:#020617;font-family:Arial,Helvetica,sans-serif;color:#dbeafe">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#020617">
      <tr><td align="center" style="padding:32px 16px">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#0f172a;border:1px solid #1e3a5f;border-radius:18px;overflow:hidden">
          <tr><td style="padding:28px 32px;background:linear-gradient(135deg,#071426,#06352f)"><img src="cid:eslatin-logo" alt="EsLatin" width="180" style="display:block;width:180px;height:auto"></td></tr>
          <tr><td style="padding:34px 32px">
            <p style="margin:0 0 12px;color:#94a3b8;font-size:14px">Hola, ${safe.salesName}:</p>
            <h1 style="margin:0 0 14px;color:#ffffff;font-size:26px;line-height:1.25">Nueva reserva de visita técnica</h1>
            <p style="margin:0 0 24px;color:#cbd5e1;font-size:16px;line-height:1.65">Se ha registrado un cliente asociado a tu gestión comercial.</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#07111f;border:1px solid #1e3a5f;border-radius:14px">
              <tr><td style="padding:22px 24px 8px;color:#34d399;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em">Datos del cliente</td></tr>
              <tr><td style="padding:6px 24px;color:#e2e8f0"><strong>Cliente:</strong> ${safe.customerName}</td></tr>
              <tr><td style="padding:6px 24px;color:#e2e8f0"><strong>Teléfono:</strong> ${safe.phone}</td></tr>
              <tr><td style="padding:6px 24px;color:#e2e8f0"><strong>Correo:</strong> <a href="mailto:${safe.email}" style="color:#34d399">${safe.email}</a></td></tr>
              <tr><td style="padding:6px 24px;color:#e2e8f0"><strong>Ciudad:</strong> ${safe.city}</td></tr>
              <tr><td style="padding:6px 24px;color:#e2e8f0"><strong>Dirección:</strong> ${safe.address}</td></tr>
              <tr><td style="padding:6px 24px;color:#e2e8f0"><strong>Fecha:</strong> ${safe.date}</td></tr>
              <tr><td style="padding:6px 24px;color:#e2e8f0"><strong>Horario:</strong> ${safe.start}–${safe.end} (hora de Bogotá)</td></tr>
              <tr><td style="padding:6px 24px;color:#e2e8f0"><strong>Técnico asignado:</strong> ${safe.technician}</td></tr>
              ${booking.partner ? `<tr><td style="padding:6px 24px;color:#e2e8f0"><strong>Empresa asociada:</strong> ${safe.partner}</td></tr>` : ""}
              <tr><td style="padding:6px 24px 22px;color:#e2e8f0"><strong>Número de reserva:</strong> ${safe.code}</td></tr>
            </table>
            <p style="margin:28px 0 0;color:#cbd5e1;font-size:14px;line-height:1.65">La invitación de calendario se ha enviado al técnico asignado. Para cambios o consultas, responde a este correo o escribe a <a href="mailto:${escapeHtml(config.replyTo)}" style="color:#34d399">${escapeHtml(config.replyTo)}</a>.</p>
          </td></tr>
          <tr><td style="padding:22px 32px;border-top:1px solid #1e293b;color:#64748b;font-size:12px;line-height:1.6">Este correo fue generado automáticamente por el sistema de reservas de EsLatin.</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`
  return {
    from: { name: "EsLatin Reservas", address: config.from },
    replyTo: config.replyTo,
    to: salesperson.email,
    subject,
    text,
    html,
    attachments: [{ filename: "eslatin.png", path: join(process.cwd(), "public", "brand", "eslatin-logo-horizontal.png"), cid: "eslatin-logo" }],
  }
}

export async function sendSalesNotificationEmail(booking, technicalEmployee, salesperson) {
  const transport = getTransport()
  if (!transport || !salesperson?.email) return { sent: false, skipped: true }
  const result = await transport.sendMail(buildSalesNotificationEmail(booking, technicalEmployee, salesperson))
  return { sent: true, messageId: result.messageId }
}

export async function verifyConfirmationEmail() {
  const transport = getTransport()
  if (!transport) throw new Error("Confirmation email is disabled.")
  await transport.verify()
  return confirmationEmailStatus()
}
