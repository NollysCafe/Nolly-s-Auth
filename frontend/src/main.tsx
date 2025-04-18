import React from 'react'
import ReactDOM from 'react-dom/client'

import './styles/main.scss'

// Components
import App from './App'

const container = document.getElementById('root')
if (!container) throw new Error('Root element not found')

const root = ReactDOM.createRoot(container)
root.render(
	<App />
)

void React
