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
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    (async()=> {
      try {
        const res = await fetch('https://marsgoup-1.onrender.com/api/products');
        if (!res.ok) throw new Error();
        setProducts(await res.json());
      } catch {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="w-[390px] px-[24px] pt-[12px]">Loading products...</div>;
  if (error)   return <div className="w-[390px] px-[24px] pt-[12px] text-red-500">{error}</div>;

  return (
    <div className="w-[390px] relative px-[24px] pt-[12px] md:w-full">
      {/* шапка */}
      <div className="flex justify-between items-center">
        <h1 className="text-[32px] font-[600]">Discover</h1>
        <button><img className="w-[24px] h-[27px]" src={bell} alt="Notifications"/></button>
      </div>

      {/* поиск */}
      <div className="flex justify-between items-center mt-[16px]">
        <div className="flex items-center px-[20px] py-[14px] border rounded-[10px] border-[#E6E6E6]">
          <img className="mr-[12px]" src={lupa} alt="Search"/>
          <input className="outline-none placeholder:text-[#999]" placeholder="Search for clothes..." type="text"/>
          <img src={micro} alt="Mic"/>
        </div>
        <button className="w-[52px] h-[52px] bg-black rounded-[10px] flex items-center justify-center">
          <img src={filter} alt="Filter"/>
        </button>
      </div>

      {/* фильтры */}
      <div className="flex gap-[8px] mt-[16px]">
        {['All','Tshirts','Jeans','Shoes'].map(label=>(
          <p key={label} className="px-[20px] py-[7px] border rounded-[10px] hover:bg-black hover:text-white">{label}</p>
        ))}
      </div>

      {/* карточки */}
      <div className="flex flex-wrap justify-center gap-[19px] mt-[24px] mb-[100px]">
        {products.map(p=>(
          <NavLink key={p.id} to={`/dashboard/products/${p.id}`} className="card relative flex flex-col">
            <img src={p.img||'https://via.placeholder.com/150'} alt={p.title} className="w-[150px] h-[150px] object-cover"/>
            <h2 className="mt-[8px] text-[16px] font-[600]">{p.title}</h2>
            <p className="text-[12px] text-[#808080]">$ {p.price}</p>
            <img className="absolute top-[12px] right-[12px] bg-white p-[8px] rounded-[8px]" src={favourite} alt="fav"/>
          </NavLink>
        ))}
      </div>

      {/* навигация */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] bg-white border-t h-[86px] px-[24px]">
        <ul className="flex justify-between items-center mt-[16px]">
          {[
            {to:'/dashboard', icon:home, label:'Home'},
            {to:'/dashboard/search', icon:lupaNav, label:'Search'},
            {to:'/dashboard/saved', icon:favouriteNav, label:'Saved'},
            {to:'/dashboard/cart', icon:cart, label:'Cart'},
            {to:'/dashboard/account', icon:user, label:'Account'},
          ].map(nav=>(
            <li key={nav.label}>
              <NavLink to={nav.to} className={({isActive})=>`flex flex-col items-center ${isActive?'text-black':'text-[#999]'}`}>
                <img src={nav.icon} alt={nav.label}/>
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
