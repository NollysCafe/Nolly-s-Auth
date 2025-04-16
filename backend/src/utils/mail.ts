import { sendgrid } from '@backend/config/sendgrid'
import { log } from '@backend/logger'
import { config } from '@shared/config'
import path from 'path'
import fs from 'fs'


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


/**
 * Wraps the HTML content in a base layout
 * @param html - HTML content to be wrapped
 * @param subject - Subject of the email
 * @returns The wrapped HTML content
 */
export const wrapInLayout = (html: string, subject: string) => renderTemplate('base', { subject, content: html })


const templateDir = path.resolve(__dirname, 'templates')

/**
 * Renders an HTML template with the given replacements
 * @param filename - Template filename (without extension)
 * @param replacements - Object containing key-value pairs for replacements
 * @returns The rendered HTML content as a string
 */
export const renderTemplate = (filename: string, replacements: Record<string, string>): string => {
	const fullPath = path.resolve(templateDir, `${filename}.html`)
	let content = fs.readFileSync(fullPath, 'utf-8')
	for (const [key, value] of Object.entries(replacements)) content = content.replaceAll(`{{${key}}}`, value)
	return content
}
