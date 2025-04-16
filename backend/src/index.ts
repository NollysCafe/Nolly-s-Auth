/// <reference path='../../types/global.d.ts' />

import 'tsconfig-paths/register'
import '@shared/initEnv'
import App from '@backend/config/app'
import { config } from '@shared/config'
import { log } from '@backend/logger'
import { testConnection } from './config/database'

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'


// Create App instance
const app = new App()

// MIDDLEWARES
app.addMiddleware(bodyParser.json())
app.addMiddleware(bodyParser.urlencoded({ extended: true }))
app.addMiddleware(cookieParser())
app.addMiddleware(cors({ origin: config.frontendUrl, credentials: true }))
app.addMiddleware(helmet())
app.addMiddleware(morgan('dev'))

// ROUTES


// Start server
app.start(config.backendPort, () => {
	testConnection()
	log.success(`server running at http://localhost:${config.backendPort}`)
})
