import React from 'react'

import 'react-toastify/dist/ReactToastify.css'

// Pages

// Components
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

export default function App(): React.ReactElement {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<h1>Home</h1>} />
			</Routes>

			<ToastContainer theme='dark' position='bottom-right' autoClose={3000} limit={3} newestOnTop />
		</BrowserRouter>
	)
}
