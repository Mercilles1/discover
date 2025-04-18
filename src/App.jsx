import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './HomePage'
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

  return (
    <Router>
      <div className='flex justify-center'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<div className='w-[390px] px-[24px] pt-[12px]'><h1 className='text-2xl font-bold'>Search Page</h1></div>} />
          <Route path="/saved" element={<div className='w-[390px] px-[24px] pt-[12px]'><h1 className='text-2xl font-bold'>Saved Items</h1></div>} />
          <Route path="/cart" element={<div className='w-[390px] px-[24px] pt-[12px]'><h1 className='text-2xl font-bold'>Shopping Cart</h1></div>} />
          <Route path="/account" element={<div className='w-[390px] px-[24px] pt-[12px]'><h1 className='text-2xl font-bold'>Account Page</h1></div>} />
        </Routes>
      </div>
    </Router>
  )
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