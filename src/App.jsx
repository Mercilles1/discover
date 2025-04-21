import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';  // ← убрали BrowserRouter/Router
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

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
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route
        path="/"
        element={isAuth ? <Dashboard logout={logout} /> : <Home />}
      />
      <Route path="/login" element={<Login login={login} />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute isAuth={isAuth}>
            <Dashboard logout={logout} />
          </PrivateRoute>
        }
      />
      <Route
        path={`/dashboard/products/:id`}
        element={
          <PrivateRoute isAuth={isAuth}>
            <ProductDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/search"
        element={
          <PrivateRoute isAuth={isAuth}>
            <div className="w-[390px] px-[24px] pt-[12px] md:w-full">
              <h1 className="text-2xl font-bold">Search Page</h1>
            </div>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/saved"
        element={
          <PrivateRoute isAuth={isAuth}>
            <div className="w-[390px] px-[24px] pt-[12px] md:w-full">
              <h1 className="text-2xl font-bold">Saved Items</h1>
            </div>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/cart"
        element={
          <PrivateRoute isAuth={isAuth}>
            <div className="w-[390px] px-[24px] pt-[12px] md:w-full">
              <h1 className="text-2xl font-bold">Shopping Cart</h1>
            </div>
          </PrivateRoute>
        }
      />
	  
      <Route
        path="/dashboard/account"
        element={
          <PrivateRoute isAuth={isAuth}>
            <div className="w-[390px] px-[24px] pt-[12px] md:w-full">
              <h1 className="text-2xl font-bold">Account Page</h1>
            </div>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
