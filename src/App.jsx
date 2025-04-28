import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './HomePage'
import Cart from './Cart.jsx'

function App() {
  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate()

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

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Router>
      <div className='flex justify-center'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<div className='w-[390px] px-[24px] pt-[12px]'><h1 className='text-2xl font-bold'>Search Page</h1></div>} />
          <Route path="/saved" element={<div className='w-[390px] px-[24px] pt-[12px]'><h1 className='text-2xl font-bold'>Saved Items</h1></div>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<div className='w-[390px] px-[24px] pt-[12px]'><h1 className='text-2xl font-bold'>Account Page</h1></div>} />
          <Route path="/notes" element={<div className='w-[390px] px-[24px] pt-[12px]'><h1 className='text-2xl font-bold'>Notifications</h1></div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App