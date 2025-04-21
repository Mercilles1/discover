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
        <button className="w-[52px] h-[52px] bg-black rounded-[10px] flex items-center justify-center">
          <img src={filter} alt="Filter" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-[8px] mt-[16px]">
        {['All', 'Tshirts', 'Jeans', 'Shoes'].map(label => (
          <p key={label} className="px-[20px] py-[7px] border-[1px] border-[#E6E6E6] flex justify-center items-center rounded-[10px] hover:bg-black hover:text-white">
            {label}
          </p>
        ))}
      </div>

      {/* Product Cards */}
      <div className="cards mb-[100px] mt-[24px] flex justify-center items-center flex-wrap gap-[19px]">
        {products.map(product => (
          <NavLink key={product.id} to={`/dashboard/products/${product.id}`} className="card relative flex flex-col justify-start">
            <img 
              src={product.img || 'https://via.placeholder.com/150'} 
              alt={product.title} 
              className="w-[150px] h-[150px] object-cover" 
            />
            <h2 className="mt-[8px] mb-[3px] text-[16px] font-[600]">
              {product.title}
            </h2>
            <p className="text-[12px] font-[500] text-[#808080]">
              $ {product.price}
            </p>
            <img 
              className="absolute rounded-[8px] right-[12px] top-[12px] bg-white p-[8px]" 
              src={favourite} 
              alt="Favourite" 
            />
          </NavLink>
        ))}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] bg-white border-t h-[86px] px-[24px]">
        <ul className="flex justify-between items-center mt-[16px]">
          {[
            { to: '/dashboard', icon: home, label: 'Home' },
            { to: '/dashboard/search', icon: lupaNav, label: 'Search' },
            { to: '/dashboard/saved', icon: favouriteNav, label: 'Saved' },
            { to: '/dashboard/cart', icon: cart, label: 'Cart' },
            { to: '/dashboard/account', icon: user, label: 'Account' },
          ].map(nav => (
            <li key={nav.label}>
              <NavLink to={nav.to} className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-black' : 'text-[#999]'}`}>
                <img src={nav.icon} alt={nav.label} />
                <p className="text-[12px]">{nav.label}</p>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;