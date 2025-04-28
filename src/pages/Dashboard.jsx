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
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
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
        return cats?.some(cat => cat.toLowerCase() === activeCategory.toLowerCase() || (activeCategory === 'Tshirts' && cat === 'T-shirt'));
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
    <div className='max-w-md mx-auto px-6 pt-4 relative'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-semibold text-gray-900'>Discover</h1>
        <NavLink to='/dashboard/notifications' className='mt-1'>
          <img className='w-6 h-6' src={bell} alt='Notifications' />
        </NavLink>
      </div>

      {/* Search */}
      <form onSubmit={handleSearchSubmit} className='flex items-center gap-3 mt-4'>
        <div className='flex items-center flex-1 px-4 py-3 border rounded-lg border-gray-200'>
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
          className='w-12 h-12 flex justify-center items-center bg-gray-900 rounded-lg'
        >
          <img className='w-5 h-5' src={filter} alt='Filter' />
        </button>
      </form>

      {/* Categories */}
      <div className='flex flex-wrap gap-2 mt-4'>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-[20px] py-[7px] border-[1px] border-[#E6E6E6] flex justify-center items-center rounded-[10px] whitespace-nowrap transition-all duration-200 ${activeCategory === category
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
        <div className='grid grid-cols-2 gap-5 mt-6 mb-24'>
          {filteredProducts.map(product => (
            <NavLink to={`/dashboard/products/${product.id}`}><div
              key={product.id}
              className='relative flex flex-col items-start bg-white rounded-lg overflow-hidden shadow-sm p-2'
            >
              <img
                src={product.img || 'https://via.placeholder.com/150'}
                alt={product.title}
                className='w-full h-36 object-cover rounded-md'
              />
              <h2 className='mt-[8px] mb-[3px] text-[16px] font-[600]'>
                {product.title}
              </h2>
              <p className='text-[12px] font-[500] text-[#808080]'>
                $ {product.price}
              </p>
              <p className='text-[10px] font-[400] text-gray-400'>{product.categories}</p>
              <button>
                <img
                  className='absolute rounded-[8px] right-[12px] top-[12px] bg-white p-[8px]'
                  src={favourite}
                  alt='Add to favorites'
                />
              </button>

              {/* Add to Cart Button */}
              <button className='absolute bottom-2 right-2 bg-gray-300 p-1 rounded-full'>
                <img className='w-4 h-4' src={plusCart} alt='Add to cart' />
              </button>
            </div></NavLink>

          ))}
        </div>
      )}

      {/* Filter Modal */}
      <FilterModal isOpen={showFilter} onClose={() => setShowFilter(false)} />


    </div>
  );
}

export default Dashboard;
