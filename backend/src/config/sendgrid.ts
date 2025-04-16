import sendgridMail from '@sendgrid/mail'
import { log } from '@backend/logger'
import { config } from '@shared/config'

const apiKey = config.sendgrid.apiKey

if (!apiKey) {
	log.error('❌ Missing SendGrid API key in environment variables')
	throw new Error('Missing SendGrid API key in environment variables')
}

sendgridMail.setApiKey(apiKey)

log.success('📬 SendGrid configured successfully')

export const sendgrid = sendgridMail
