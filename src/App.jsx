import { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import FilterModal from './components/FilterModal';

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuth');
    setIsAuth(authStatus === 'true');
    setLoading(false);
  }, []);

  const login = user => {
    localStorage.setItem('isAuth', 'true');
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuth(true);
  };

  const logout = () => {
    localStorage.setItem('isAuth', 'false');
    localStorage.removeItem('user');
    setIsAuth(false);
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Routes>
        <Route path='/' element={isAuth ? <Dashboard /> : <Home />} />
        <Route path='/login' element={<Login login={login} />} />
        <Route
          path='/dashboard'
          element={
            <PrivateRoute isAuth={isAuth}>
              <Dashboard logout={logout} />
            </PrivateRoute>
          }
        />
        <Route
          path='/search'
          element={
            <PrivateRoute isAuth={isAuth}>
              <div className='w-full px-6 pt-3'>
                <h1 className='text-2xl font-bold'>Search Page</h1>
                <button
                  className="bg-black text-white px-4 py-2 rounded-xl"
                  onClick={() => setShowFilter(true)}
                >
                  <img src="/api/placeholder/20/20" alt="filter icon" />
                </button>
                {showFilter && <FilterModal isOpen={showFilter} onClose={() => setShowFilter(false)} />}
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path='/saved'
          element={
            <PrivateRoute isAuth={isAuth}>
              <div className='w-full px-6 pt-3'>
                <h1 className='text-2xl font-bold'>Saved Items</h1>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path='/cart'
          element={
            <PrivateRoute isAuth={isAuth}>
              <div className='w-full px-6 pt-3'>
                <h1 className='text-2xl font-bold'>Shopping Cart</h1>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path='/account'
          element={
            <PrivateRoute isAuth={isAuth}>
              <div className='w-full px-6 pt-3'>
                <h1 className='text-2xl font-bold'>Account Page</h1>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;