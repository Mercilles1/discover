import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import bell from '../assets/Bell.png';
import lupa from '../assets/lupa.png';
import micro from '../assets/Mic.png';
import filter from '../assets/Filter.png';
import favourite from '../assets/favourite.png';
import home from '../assets/homeNav.png';
import lupaNav from '../assets/lupaNav.png';
import favouriteNav from '../assets/favouriteNav.png';
import cart from '../assets/Cart.png';
import user from '../assets/user.png';

function Dashboard({ logout }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showFilter, setShowFilter] = useState(false);

  const categories = ['All', 'Men', 'Women', 'Kids'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://marsgoup-1.onrender.com/api/products');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch products');
        setLoading(false);
        console.error('Fetch error:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(product => product.categories === activeCategory);

  if (loading) return <div className="w-[390px] px-[24px] pt-[12px]">Loading products...</div>;
  if (error) return <div className="w-[390px] px-[24px] pt-[12px] text-red-500">{error}</div>;

  return (
    <div className="w-[390px] relative px-[24px] pt-[12px] md:w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-[32px] font-[600] text-[#1A1A1A]">Discover</h1>
        <button className="mt-[6px]">
          <img className="w-[24px] h-[27px]" src={bell} alt="Notifications" />
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center mt-[16px]">
        <div className="flex items-center px-[20px] py-[14px] border rounded-[10px] border-[#E6E6E6]">
          <img className="mr-[12px]" src={lupa} alt="Search" />
          <input className="outline-none placeholder:text-[#999]" placeholder="Search for clothes..." type="text" />
          <img src={micro} alt="Mic" />
        </div>
        <button
          onClick={() => setShowFilter(true)}
          className="w-[52px] h-[52px] bg-black rounded-[10px] flex items-center justify-center"
        >
          <img src={filter} alt="Filter" />
        </button>
      </div>

      {/* Categories */}
      <div className='sort mt-[16px] flex justify-center items-center gap-[8px] overflow-auto'>
        {categories.map((category) => (
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
        <div className="mt-[40px] text-center text-gray-500">
          No products found.
        </div>
      ) : (
        <div className='cards mb-[100px] mt-[24px] flex justify-center items-center flex-wrap gap-[19px]'>
          {filteredProducts.map(product => (
            <NavLink to={`/dashboard/products/${product.id}`} key={product.id}>
              <div className='card relative flex flex-col justify-start'>
                <img
                  src={product.img || 'https://via.placeholder.com/150'}
                  alt={product.title}
                  className='w-[150px] h-[150px] object-cover'
                />
                <h2 className='mt-[8px] mb-[3px] text-[16px] font-[600]'>{product.title}</h2>
                <p className='text-[12px] font-[500] text-[#808080]'>$ {product.price}</p>
                <p className='text-[10px] font-[400] text-gray-400'>{product.categories}</p>
                <button>
                  <img
                    className='absolute rounded-[8px] right-[12px] top-[12px] bg-white p-[8px]'
                    src={favourite}
                    alt='Add to favorites'
                  />
                </button>
                <button className='p-[4px] absolute right-[8px] bottom-0 h-[24px] bg-gray-300 rounded-full flex justify-center items-center'>
                  <img className='w-[18px] h-[18px]' src={cart} alt='Add to cart' />
                </button>
              </div>
            </NavLink>
          ))}
        </div>
      )}


      <FilterModal isOpen={showFilter} onClose={() => setShowFilter(false)} />


    </div>
  );
}

export default Dashboard;
