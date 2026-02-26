export function normalizeTelegram(input: string): string {
  if (!input) return ''
  
  const cleaned = input.trim().replace(/^@/, '').replace(/^https?:\/\/(t\.me|telegram\.me)\//, '')
  return cleaned
}

export function normalizeWhatsApp(input: string): string {
  if (!input) return ''
  
  const digitsOnly = input.replace(/\D/g, '')
  return digitsOnly
}

export function getTelegramLink(username: string): string {
  if (!username) return ''
  return `https://t.me/${normalizeTelegram(username)}`
}

export function getWhatsAppLink(phone: string): string {
  if (!phone) return ''
  return `https://wa.me/${normalizeWhatsApp(phone)}`
}

export function getEmailLink(email: string): string {
  if (!email) return ''
  return `mailto:${email}`
}
