import { sendgrid } from '@backend/config/sendgrid'
import { log } from '@backend/logger'
import { config } from '@shared/config'


const FROM_EMAIL = config.sendgrid.fromEmail
const FROM_NAME = config.sendgrid.fromName
const DAILY_LIMIT = 100

let sentToday = 0
let lastReset = new Date().toDateString()

/**
 * Sends a transactional email
 * @param to - Destination email
 * @param subject - Email subject
 * @param html - HTML body
 * @param plain - Fallback plain text (optional)
 */
export const sendEmail = async ({ to, subject, html, plain }: { to: string; subject: string; html: string; plain?: string }): Promise<boolean> => {
	if (new Date().toDateString() !== lastReset) {
		sentToday = 0
		lastReset = new Date().toDateString()
	}

	if (sentToday >= DAILY_LIMIT) {
		log.warn(`📬 Daily email limit reached`)
		return false
	}

	try {
		await sendgrid.send({ to, from: { email: FROM_EMAIL, name: FROM_NAME }, subject, text: plain || html.replace(/<[^>]+>/g, ''), html })
		sentToday++
		log.success(`📩 Email sent to ${to} (${sentToday}/${DAILY_LIMIT})`)
		return true
	} catch (error: any) {
		const code = error?.code ?? 'unknown'
		log.error('❌ Failed to send email:', error?.response?.body || error)
		if (code === 403 || code === 429) log.warn('⛔ Quota exceeded or rate limited')
		return false
	}
}
