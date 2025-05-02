import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import bell from '../assets/Bell.png';
import favourite from '../assets/favourite.png';
import home from '../assets/homeNav.png';
import lupaNav from '../assets/lupaNav.png';
import favouriteNav from '../assets/favouriteNav.png';
import cart from '../assets/Cart.png';
import user from '../assets/user.png';

function SavedPage() {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStorage = localStorage.getItem('user');
    const isAuth = localStorage.getItem('isAuth');
    
    if (isAuth !== 'true' || !userStorage) {
      localStorage.removeItem('user');
      localStorage.setItem('isAuth', 'false');
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userStorage);
      if (!parsedUser || !parsedUser.id) {
        localStorage.removeItem('user');
        localStorage.setItem('isAuth', 'false');
        navigate('/login');
        return;
      }
      
      setCurrentUser(parsedUser);
      fetchFavoriteItems(parsedUser.id);
    } catch (e) {
      console.error("Error parsing user data:", e);
      localStorage.removeItem('user');
      localStorage.setItem('isAuth', 'false');
      navigate('/login');
    }
  }, [navigate]);

  const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  const getProductId = (product) => {
    if (!product._id && !product.id) {
      throw new Error('Product is missing a valid ID');
    }
    return product._id || product.id;
  };

  const fetchFavoriteItems = async (userId) => {
    if (!userId) {
      setError('Invalid user ID');
      setLoading(false);
      return;
    }
    
    try {
      const products = await fetchWithRetry('https://marsgoup-1.onrender.com/api/products');
      const userData = await fetchWithRetry(`https://marsgoup-1.onrender.com/api/users/${userId}`);
      
      if (userData.favoriteItems && userData.favoriteItems.length > 0) {
        const favorites = products.filter(product => {
          const productId = getProductId(product);
          return userData.favoriteItems.includes(productId);
        });
        
        setFavoriteProducts(favorites);
      } else {
        setFavoriteProducts([]);
      }
      
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch favorite items');
      setLoading(false);
      console.error('Fetch error:', error);
    }
  };

  const removeFromFavorites = async (productId) => {
    if (!currentUser || !currentUser.id) {
      alert('Please login to manage favorites');
      navigate('/login');
      return;
    }
    
    try {
      const userData = await fetchWithRetry(`https://marsgoup-1.onrender.com/api/users/${currentUser.id}`);
      const currentFavorites = userData.favoriteItems || [];
      const updatedFavoriteItems = currentFavorites.filter(id => id !== productId);
      
      const updateResponse = await fetch(`https://marsgoup-1.onrender.com/api/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          favoriteItems: updatedFavoriteItems
        })
      });
      
      if (!updateResponse.ok) {
        throw new Error('Failed to update favorites');
      }
      
      setFavoriteProducts(prevProducts => 
        prevProducts.filter(product => getProductId(product) !== productId)
      );
      
      alert('Removed from favorites!');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      alert('Failed to remove from favorites. Please try again later.');
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    if (currentUser?.id) {
      fetchFavoriteItems(currentUser.id);
    } else {
      setLoading(false);
      setError('User not logged in');
    }
  };

  if (loading) {
    return (
      <div className='max-w-[390px] w-full px-[24px] pt-[12px] text-center'>Loading saved items...</div>
    );
  }

  if (error) {
    return (
      <div className='max-w-[390px] w-full px-[24px] pt-[12px] text-center'>
        <p className='text-red-500'>{error}</p>
        <button
          onClick={handleRetry}
          className='mt-[10px] bg-[#1A1A1A] text-white px-[16px] py-[8px] rounded-[10px]'
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='max-w-[390px] w-full relative px-[24px] pt-[12px]'>
      <div className='flex justify-between items-center'>
        <h1 className='text-[32px] font-[600] text-[#1A1A1A]'>Saved Items</h1>
        <NavLink to="/dashboard/notifications" className='mt-[6px]'>
          <img className='w-[24px] h-[27px]' src={bell} alt='Notifications' />
        </NavLink>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className='mt-[48px] text-center'>
          <p className='text-[18px] text-[#808080]'>You don't have any saved items yet</p>
        </div>
      ) : (
        <div className='cards mb-[100px] mt-[24px] flex justify-center items-center flex-wrap gap-[19px]'>
          {favoriteProducts.map(product => (
            <div
              key={getProductId(product)}
              className='card relative flex flex-col justify-start'
            >
              <img
                src={product.img || 'https://via.placeholder.com/150'}
                alt={product.title}
                className='w-[150px] h-[150px] object-cover'
              />
              <h2 className='mt-[8px] mb-[3px] text-[16px] font-[600]'>
                {product.title}
              </h2>
              <p className='text-[12px] font-[500] text-[#808080]'>
                $ {product.price}
              </p>
              <button 
                onClick={() => removeFromFavorites(getProductId(product))}
                className='absolute rounded-[8px] right-[12px] top-[12px] bg-red-500 p-[8px]'
              >
                <img 
                  src={favourite} 
                  alt='Remove from favorites'
                  className='filter brightness-0 invert' 
                />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className='nav w-[390px] fixed left-1/2 transform -translate-x-1/2 bg-white border-t-[1px] border-[#E6E6E6] bottom-0 h-[86px] px-[24px]'>
        <ul className='flex mt-[16px] justify-between items-center'>
          <li>
            <NavLink
              to='/dashboard'
              end
              className={({ isActive }) =>
                `flex flex-col justify-center items-center ${
                  isActive ? 'text-black' : ''
                }`
              }
            >
              <img src={home} alt='Home' />
              <p className='text-[12px] font-[500] text-[#999999]'>Home</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/dashboard/search'
              className={({ isActive }) =>
                `flex flex-col justify-center items-center ${
                  isActive ? 'text-black' : ''
                }`
              }
            >
              <img src={lupaNav} alt='Search' />
              <p className='text-[12px] font-[500] text-[#999999]'>Search</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/dashboard/saved'
              className={({ isActive }) =>
                `flex flex-col justify-center items-center ${
                  isActive ? 'text-black' : ''
                }`
              }
            >
              <img src={favouriteNav} alt='Saved' />
              <p className='text-[12px] font-[500] text-[#999999]'>Saved</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/dashboard/cart'
              className={({ isActive }) =>
                `flex flex-col justify-center items-center ${
                  isActive ? 'text-black' : ''
                }`
              }
            >
              <img src={cart} alt='Cart' />
              <p className='text-[12px] font-[500] text-[#999999]'>Cart</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/dashboard/account'
              className={({ isActive }) =>
                `flex flex-col justify-center items-center ${
                  isActive ? 'text-black' : ''
                }`
              }
            >
              <img src={user} alt='Account' />
              <p className='text-[12px] font-[500] text-[#999999]'>Account</p>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SavedPage;