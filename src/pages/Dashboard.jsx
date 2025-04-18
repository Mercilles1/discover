import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import bell from './assets/Bell.png';
import lupa from './assets/lupa.png';
import micro from './assets/Mic.png';
import filter from './assets/Filter.png';
import favourite from './assets/favourite.png';
import home from './assets/homeNav.png';
import lupaNav from './assets/lupaNav.png';
import favouriteNav from './assets/favouriteNav.png';
import cart from './assets/Cart.png';
import user from './assets/user.png';

function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/products');
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

    return (
        <div className='w-[390px] relative px-[24px] pt-[12px]'>
            <div className='flex justify-between items-center'>
                <h1 className='text-[32px] font-[600] text-[#1A1A1A]'>Discover</h1>
                <button className='mt-[6px]'><img className='w-[24px] h-[27px]' src={bell} alt="" /></button>
            </div>

            <div className='flex justify-between mt-[16px] items-center'>
                <div className='flex justify-center items-center px-[20px] py-[14px] rounded-[10px] border-[1px] border-[#E6E6E6]'>
                    <img className='mr-[12px]' src={lupa} alt="" />
                    <input className='w-[181px] h-[22px] outline-none text-[16px] font-[400] placeholder:text-[#999999]' placeholder='Search for clothes...' type="text" />
                    <img src={micro} alt="" />
                </div>
                <button className='w-[52px] h-[52px] bg-[#1A1A1A] flex justify-center items-center rounded-[10px]'><img src={filter} alt="" /></button>
            </div>

            <div className='sort mt-[16px] flex justify-center items-center gap-[8px]'>
                <p className='px-[20px] py-[7px] border-[1px] border-[#E6E6E6] flex justify-center items-center rounded-[10px] hover:bg-black hover:text-white'>All</p>
                <p className='px-[20px] py-[7px] border-[1px] border-[#E6E6E6] flex justify-center items-center rounded-[10px] hover:bg-black hover:text-white'>Tshirts</p>
                <p className='px-[20px] py-[7px] border-[1px] border-[#E6E6E6] flex justify-center items-center rounded-[10px] hover:bg-black hover:text-white'>Jeans</p>
                <p className='px-[20px] py-[7px] border-[1px] border-[#E6E6E6] flex justify-center items-center rounded-[10px] hover:bg-black hover:text-white'>Shoes</p>
            </div>

            <div className="cards mb-[100px] mt-[24px] flex justify-center items-center flex-wrap gap-[19px]">
                {
                    products.map((product) => (
                        <div key={product.id} className="card relative flex flex-col justify-start">
                            <img src={product.img} alt={product.title} />
                            <h2 className='mt-[8px] mb-[3px] text-[16px] font-[600]'>{product.title}</h2>
                            <p className='text-[12px] font-[500] text-[#808080]'>$ {product.price}</p>
                            <img className='absolute rounded-[8px] right-[12px] top-[12px] bg-white p-[8px]' src={favourite} alt="" />
                        </div>
                    ))
                }
            </div>

            <div className="nav w-[390px] fixed left-1/2 transform -translate-x-1/2 bg-white border-t-[1px] border-[#E6E6E6] bottom-0 h-[86px] px-[24px]">
                <ul className='flex mt-[16px] justify-between items-center'>
                    <li>
                        <NavLink to="/" className={({ isActive }) =>
                            `flex flex-col justify-center items-center ${isActive ? 'text-black' : ''}`
                        }>
                            <img src={home} alt="Home" />
                            <p className='text-[12px] font-[500] text-[#999999]'>Home</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/search" className={({ isActive }) =>
                            `flex flex-col justify-center items-center ${isActive ? 'text-black' : ''}`
                        }>
                            <img src={lupaNav} alt="Search" />
                            <p className='text-[12px] font-[500] text-[#999999]'>Search</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/saved" className={({ isActive }) =>
                            `flex flex-col justify-center items-center ${isActive ? 'text-black' : ''}`
                        }>
                            <img src={favouriteNav} alt="Saved" />
                            <p className='text-[12px] font-[500] text-[#999999]'>Saved</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/cart" className={({ isActive }) =>
                            `flex flex-col justify-center items-center ${isActive ? 'text-black' : ''}`
                        }>
                            <img src={cart} alt="Cart" />
                            <p className='text-[12px] font-[500] text-[#999999]'>Cart</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/account" className={({ isActive }) =>
                            `flex flex-col justify-center items-center ${isActive ? 'text-black' : ''}`
                        }>
                            <img src={user} alt="Account" />
                            <p className='text-[12px] font-[500] text-[#999999]'>Account</p>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default HomePage;