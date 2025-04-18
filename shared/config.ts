export const config = {
	// Environment
	env: process.env.NODE_ENV || 'development',
	backendPort: Number(process.env.BACKEND_PORT!),
	frontendUrl: process.env.FRONTEND_URL!,

	// PostgreSQL Database
	database: {
		type: process.env.DATABASE_TYPE!,
		host: process.env.DATABASE_HOST!,
		port: Number(process.env.DATABASE_PORT!),
		name: process.env.DATABASE_NAME!,
		user: process.env.DATABASE_USER!,
		password: process.env.DATABASE_PASSWORD!,
	},

	// SendGrid
	sendgrid: {
		apiKey: process.env.SENDGRID_API_KEY!,
		fromEmail: process.env.SENDGRID_FROM_EMAIL!,
		fromName: process.env.SENDGRID_FROM_NAME!,
	},
}
