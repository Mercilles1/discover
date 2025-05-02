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

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem('isAuth');
    
    // Validate user data is present and valid if authenticated
    if (authStatus === 'true') {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          // Missing user data - clear auth state
          localStorage.setItem('isAuth', 'false');
          setIsAuth(false);
        } else {
          // Validate user data has required fields
          const parsedUser = JSON.parse(userData);
          if (!parsedUser || !parsedUser.id) {
            // Invalid user data - clear auth state
            localStorage.setItem('isAuth', 'false');
            localStorage.removeItem('user');
            setIsAuth(false);
          } else {
            // Valid user data - set auth state
            setIsAuth(true);
          }
        }
      } catch (error) {
        // Error parsing user data - clear auth state
        console.error("Error validating user data:", error);
        localStorage.setItem('isAuth', 'false');
        localStorage.removeItem('user');
        setIsAuth(false);
      }
    } else {
      setIsAuth(false);
    }
    
    setLoading(false);
  }, []);

  const login = (user) => {
    // Validate user object has required fields
    if (!user || !user.id) {
      console.error("Invalid user object for login:", user);
      return;
    }
    
    localStorage.setItem('isAuth', 'true');
    localStorage.setItem('user', JSON.stringify(user));    
    setIsAuth(true);
    console.log(user);
  };

  const logout = () => {
    localStorage.setItem('isAuth', 'false');
    localStorage.removeItem('user');
    setIsAuth(false);
    navigate('/login');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex justify-center">
      <Routes>
        <Route path="/" element={isAuth ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/login" element={isAuth ? <Navigate to="/dashboard" /> : <Login login={login} />} />
        <Route path="/register" element={isAuth ? <Navigate to="/dashboard" /> : <Register login={login} />} />
        <Route element={<PrivateRoute isAuth={isAuth} />}>
          <Route path="/dashboard" element={<HomePage />}>
            <Route index element={<Dashboard />} />
            <Route path='search' element={<SearchPage />} />
            <Route path='saved' element={<SavedPage />} />
            <Route path='cart' element={<CartPage />} />
            <Route path='account' element={<AccountPage logout={logout} />} />
            <Route path='products/:id' element={<ProductDetail />} />
            <Route path='notifications' element={<NotificationScreen />} />
            <Route path='address' element={<AddressPage/>} />
            <Route path='addaddress' element={<AddAddressPage/>} />
          </Route>
        </Route>
        {/* Add a catch-all route to handle invalid URLs */}
        <Route path="*" element={<Navigate to={isAuth ? "/dashboard" : "/"} />} />
      </Routes>
    </div>
  );
}

export default App;