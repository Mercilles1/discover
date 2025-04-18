import { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'

function App() {
	const [loading, setLoading] = useState(true)
	const [isAuth, setIsAuth] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		const authStatus = localStorage.getItem('isAuth')
		setIsAuth(authStatus === 'true')
		setLoading(false)
	}, [])

	const login = (user) => {
		localStorage.setItem('isAuth', 'true')
		localStorage.setItem('user', JSON.stringify(user))
		setIsAuth(true)
	}

	const logout = () => {
		localStorage.setItem('isAuth', 'false')
		localStorage.removeItem('user')
		setIsAuth(false)
		navigate('/login') // Navigate to login page after logout
	}

	if (loading) {
		return <div>Loading...</div>
	}

	return (
		<>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Login login={login} />} />
				<Route
					path='/dashboard'
					element={
						<PrivateRoute isAuth={isAuth}>
							<Dashboard logout={logout} />
						</PrivateRoute>
					}
				/>
			</Routes>
		</>
	)
}

export default App
