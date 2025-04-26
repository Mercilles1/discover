import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import AccountPage from './pages/AccountPage'
import CartPage from './pages/CartPage'
import SavedPage from './pages/SavedPage'
import SearchPage from './pages/SearchPage'
import HomePage from './pages/HomePage'
import ProductDetail from './pages/ProductDetail'
import NotificationScreen from './pages/Notification'
import AddressPage from './pages/AddressPage'
import AddAddressPage from './pages/AddAddressPage'
import Newcard from './pages/Newcard'
import Payment from './pages/Payment'

function App() {
  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuth')
    setIsAuth(authStatus === 'true')
    setLoading(false)
  }, [])

  const login = user => {
    localStorage.setItem('isAuth', 'true')
    localStorage.setItem('user', JSON.stringify(user))
    setIsAuth(true)
  }

  const logout = () => {
    localStorage.setItem('isAuth', 'false')
    localStorage.removeItem('user')
    setIsAuth(false)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <Routes>
        <Route path="/" element={isAuth ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/login" element={<Login login={login} />} />
        <Route path="/register" element={<Register login={login} />} />
        <Route element={<PrivateRoute isAuth={isAuth} />}>
          <Route path="/dashboard" element={<HomePage />}>
            <Route index element={<Dashboard logout={logout} />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="saved" element={<SavedPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="account" element={<AccountPage logout={logout} />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="notifications" element={<NotificationScreen />} />
            <Route path="address" element={<AddressPage />} />
            <Route path="addaddress" element={<AddAddressPage />} />
            <Route path="newcard" element={<Newcard />} />
            <Route path="payment" element={<Payment />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App