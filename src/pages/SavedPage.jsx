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
      <div className='w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 text-center'>Loading saved items...</div>
    );
  }

  if (error) {
    return (
      <div className='w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 text-center'>
        <p className='text-red-500'>{error}</p>
        <button
          onClick={handleRetry}
          className='mt-2 bg-[#1A1A1A] text-white px-4 py-2 rounded-lg'
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='w-full max-w-[1200px] mx-auto relative px-4 sm:px-6 lg:px-8 pt-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl sm:text-3xl font-semibold text-[#1A1A1A]'>Saved Items</h1>
        <NavLink to="/dashboard/notifications" className='mt-1'>
          <img className='w-6 h-6' src={bell} alt='Notifications' />
        </NavLink>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className='mt-12 text-center'>
          <p className='text-lg text-[#808080]'>You don't have any saved items yet</p>
        </div>
      ) : (
        <div className='cards mb-[100px] mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
          {favoriteProducts.map(product => (
            <div
              key={getProductId(product)}
              className='card relative w-full sm:w-[200px] lg:w-[250px] bg-white rounded-lg shadow-md p-3 flex flex-col justify-start'
            >
              <img
                src={product.img || 'https://via.placeholder.com/150'}
                alt={product.title}
                className='w-full h-[150px] object-cover rounded-md'
              />
              <h2 className='mt-2 mb-1 text-base font-semibold'>
                {product.title}
              </h2>
              <p className='text-sm font-medium text-[#808080]'>
                $ {product.price}
              </p>
              <button 
                onClick={() => removeFromFavorites(getProductId(product))}
                className='absolute rounded-md right-3 top-3 bg-red-500 p-2 shadow-md'
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

    </div>
  );
}

export default SavedPage;