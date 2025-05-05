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
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Tshirts', 'Jeans', 'Shoes'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://marsgoup-1.onrender.com/api/products');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        setError('Failed to fetch products');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchText, activeCategory, products]);

  const filterProducts = () => {
    let results = [...products];
    if (searchText.trim()) {
      results = results.filter(product =>
        product.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (activeCategory !== 'All') {
      results = results.filter(product => {
        const cats = typeof product.categories === 'string' ? [product.categories] : product.categories;
        return cats?.some(cat =>
          cat.toLowerCase() === activeCategory.toLowerCase() ||
          (activeCategory === 'Tshirts' && cat === 'T-shirt')
        );
      });
    }
    setFilteredProducts(results);
  };

  const handleSearchChange = (e) => setSearchText(e.target.value);
  const handleCategoryClick = (category) => setActiveCategory(category);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    filterProducts();
  };

  if (loading) return <div className='w-full px-6 pt-6 text-center'>Loading products...</div>;
  if (error) return <div className='w-full px-6 pt-6 text-center text-red-500'>{error}</div>;

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-4 pb-36 relative'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl md:text-3xl font-semibold text-gray-900'>Discover</h1>
        <NavLink to='/dashboard/notifications' className='mt-1'>
          <img className='w-6 h-6 md:w-7 md:h-7' src={bell} alt='Notifications' />
        </NavLink>
      </div>

      {/* Search */}
      <form onSubmit={handleSearchSubmit} className='flex items-center gap-3 mt-4'>
        <div className='flex items-center flex-1 px-4 py-3 border rounded-lg border-gray-200 shadow-sm bg-white'>
          <img className='mr-2 w-5' src={lupa} alt='Search' />
          <input
            className='flex-1 outline-none text-base placeholder-gray-400'
            placeholder='Search for clothes...'
            type='text'
            value={searchText}
            onChange={handleSearchChange}
          />
          <img className='ml-2 w-5' src={micro} alt='Microphone' />
        </div>
        <button
          type="button"
          onClick={() => setShowFilter(true)}
          className='w-12 h-12 flex justify-center items-center bg-gray-900 rounded-lg hover:bg-gray-800 transition'
        >
          <img className='w-5 h-5' src={filter} alt='Filter' />
        </button>
      </form>

      {/* Categories */}
      <div className='flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide'>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-5 py-2 whitespace-nowrap rounded-lg border transition-all ${
              activeCategory === category
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <div className='mt-10 text-center text-gray-500'>No products found.</div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mt-6'>
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className='relative flex flex-col items-start bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow p-3'
            >
              <img
                src={product.img || 'https://via.placeholder.com/150'}
                alt={product.title}
                className='w-full h-40 object-cover rounded-lg'
              />
              <h2 className='mt-2 text-sm font-semibold truncate w-full'>{product.title}</h2>
              <p className='text-sm text-gray-600'>$ {product.price}</p>
              <p className='text-xs text-gray-400'>{product.categories}</p>

              {/* Favorite Button */}
              <button className='absolute top-2 right-2 bg-white p-2 rounded-md shadow-md'>
                <img className='w-5 h-5' src={favourite} alt='Add to favorites' />
              </button>

              {/* Add to Cart Button */}
              <button className='absolute bottom-2 right-2 bg-gray-300 hover:bg-gray-400 p-1 rounded-full'>
                <img className='w-4 h-4' src={plusCart} alt='Add to cart' />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Filter Modal */}
      <FilterModal isOpen={showFilter} onClose={() => setShowFilter(false)} />

      {/* Bottom Navbar */}
      {/* Можно добавить fixed bottom-0 здесь при необходимости */}
    </div>
  );
}

export default Dashboard;
