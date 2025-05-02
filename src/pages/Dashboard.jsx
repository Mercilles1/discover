import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import bell from '../assets/Bell.png';
import lupa from '../assets/lupa.png';
import micro from '../assets/Mic.png';
import filter from '../assets/Filter.png';
import favourite from '../assets/favourite.png';
import plusCart from '../assets/plusCart.png';
import FilterModal from '../components/FilterModal';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [userFavorites, setUserFavorites] = useState([]);

  useEffect(() => {
    // Check authentication status first
    const authStatus = localStorage.getItem('isAuth');
    if (authStatus !== 'true') {
      setLoading(false);
      return;
    }

    // Then get user data
    try {
      const userStorage = localStorage.getItem('user');
      if (userStorage) {
        const parsedUser = JSON.parse(userStorage);
        
        if (parsedUser && parsedUser.id) {
          setCurrentUser(parsedUser);
          fetchUserData(parsedUser._id);
        }
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }

    fetchProducts();
    
  }, []);

  const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await fetchWithRetry('https://marsgoup-1.onrender.com/api/products');
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch products. Please try again later.');
      setLoading(false);
      console.error('Fetch error:', error);
    }
  };

  const fetchUserData = async (userId) => {
    // Skip API call if userId is not valid
    if (!userId) {
      console.warn("Attempted to fetch user data without a valid userId");
      return;
    }
    
    try {
      const userData = await fetchWithRetry(`https://marsgoup-1.onrender.com/api/users/${userId}`);
      if (userData && userData.favoriteItems) {
        setUserFavorites(userData.favoriteItems);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Don't set an error state here, as we still want to show products
    }
  };

  useEffect(() => {
    filterProducts();
  }, [searchText, products]);

  const filterProducts = () => {
    if (!products || products.length === 0) return;
    
    let results = [...products];
    if (searchText.trim() !== '') {
      results = results.filter(product =>
        product.title && product.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredProducts(results);
  };

  const handleSearchChange = (e) => setSearchText(e.target.value);

  const getProductId = (product) => {
    if (!product) return null;
    return product._id || product.id;
  };

  const handleAddToFavorites = async (product) => {
    if (!currentUser || !currentUser.id) {
      setError('Please login to add favorites');
      return;
    }

    const productId = getProductId(product);
    if (!productId) {
      console.error("Invalid product ID");
      return;
    }
    console.log(currentUser);
    

    try {
      const userData = await fetchWithRetry(`https://marsgoup-1.onrender.com/api/users/${currentUser.id}`);
      let updatedFavorites = userData.favoriteItems || [];

      if (!updatedFavorites.includes(productId)) {
        updatedFavorites = [...updatedFavorites, productId];
        const updateResponse = await fetch(`https://marsgoup-1.onrender.com/api/users/${currentUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ favoriteItems: updatedFavorites })
        });

        if (!updateResponse.ok) throw new Error('Failed to update favorites');
        
        // Update local state to reflect the change
        setUserFavorites(updatedFavorites);
        alert('Added to favorites!');
      } else {
        alert('Already in favorites!');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      setError('Failed to add to favorites');
    }
  };

  if (loading) return <div className="max-w-[390px] w-full px-[24px] pt-[12px] text-center">Loading products...</div>;
  if (error) return (
    <div className="max-w-[390px] w-full px-[24px] pt-[12px] text-center text-red-500">
      {error}
      <button
        onClick={() => {
          setLoading(true);
          setError(null);
          fetchProducts();
        }}
        className="mt-[10px] bg-[#1A1A1A] text-white px-[16px] py-[8px] rounded-[10px]"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="max-w-[390px] w-full relative px-[24px] pt-[12px]">
      <div className="flex justify-between items-center">
        <h1 className="text-[32px] font-[600] text-[#1A1A1A]">Discover</h1>
        <NavLink to="/dashboard/notifications" className="mt-[6px]">
          <img className="w-[24px] h-[27px]" src={bell} alt="Notifications" />
        </NavLink>
      </div>

      <form className="flex justify-between mt-[16px] items-center" onSubmit={(e) => e.preventDefault()}>
        <div className="flex justify-center items-center px-[20px] py-[14px] rounded-[10px] border-[1px] border-[#E6E6E6]">
          <img className="mr-[12px]" src={lupa} alt="Search" />
          <input
            className="w-[181px] h-[22px] outline-none text-[16px] font-[400] placeholder:text-[#999999]"
            placeholder="Search for clothes..."
            type="text"
            value={searchText}
            onChange={handleSearchChange}
          />
          <img src={micro} alt="Microphone" />
        </div>
        <button
          type="button"
          onClick={() => setShowFilter(true)}
          className="w-[52px] h-[52px] bg-[#1A1A1A] flex justify-center items-center rounded-[10px]"
        >
          <img src={filter} alt="Filter" />
        </button>
      </form>

      {filteredProducts.length === 0 ? (
        <div className='mt-10 text-center text-gray-500'>No products found.</div>
      ) : (
        <div className="cards mb-[100px] mt-[24px] flex justify-center items-center flex-wrap gap-[19px]">
          {filteredProducts.map((product) => {
            const productId = getProductId(product);
            if (!productId) return null;
            
            return (
              <div key={productId} className="card relative flex flex-col justify-start">
                <img
                  src={product.img || '/placeholder-product.png'}
                  alt={product.title}
                  className="w-[150px] h-[150px] object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-product.png';
                  }}
                />
                <h2 className="mt-[8px] mb-[3px] text-[16px] font-[600]">{product.title}</h2>
                <p className="text-[12px] font-[500] text-[#808080]">$ {product.price}</p>

                <button 
                  onClick={() => handleAddToFavorites(product)}
                  aria-label="Add to favorites"
                >
                  <img
                    className={`absolute rounded-[8px] right-[12px] top-[12px] ${
                      userFavorites.includes(productId)
                        ? 'bg-red-500 filter brightness-0 invert'
                        : 'bg-white'
                    } p-[8px]`}
                    src={favourite}
                    alt="Favorite"
                  />
                </button>

                <button 
                  className="p-[4px] absolute right-[8px] bottom-0 h-[24px] bg-gray-300 rounded-full flex justify-center items-center"
                  aria-label="Add to cart"
                >
                  <img className="w-[18px] h-[18px]" src={plusCart} alt="Add to cart" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <FilterModal isOpen={showFilter} onClose={() => setShowFilter(false)} />
    </div>
  );
}

export default Dashboard;