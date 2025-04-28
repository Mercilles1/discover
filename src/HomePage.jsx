import React, { useState, useEffect } from 'react';
import bell from './assets/Bell.png';
import lupa from './assets/lupa.png';
import micro from './assets/Mic.png';
import filter from './assets/Filter.png';
import favourite from './assets/favourite.png';
import plusCart from './assets/plusCart.png';

function HomePage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const categories = ['All', 'Tshirts', 'Jeans', 'Shoes'];

    const toggleFavourite = (productId) => {
        const stored = JSON.parse(localStorage.getItem("favourites")) || [];
        let updated;
        if (stored.includes(productId)) {
          updated = stored.filter(id => id !== productId);
        } else {
          updated = [...stored, productId];
        }
        localStorage.setItem("favourites", JSON.stringify(updated));
      };      

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
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch products');
                setLoading(false);
                console.error('Fetch error:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchText, activeCategory, products]);

    const filterProducts = () => {
        let results = [...products];
        if (searchText.trim() !== '') {
            results = results.filter(product =>
                product.title.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        if (activeCategory !== 'All') {
            results = results.filter(product => {
                if (!product.categories) return false;
                if (typeof product.categories === 'string') {
                    return product.categories.toLowerCase() === activeCategory.toLowerCase() ||
                        (activeCategory === 'Tshirts' && product.categories === 'T-shirt');
                }
                if (Array.isArray(product.categories)) {
                    return product.categories.some(cat =>
                        cat.toLowerCase() === activeCategory.toLowerCase() ||
                        (activeCategory === 'Tshirts' && cat === 'T-shirt')
                    );
                }
                return false;
            });
        }
        setFilteredProducts(results);
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        filterProducts();
    };

    if (loading) return <div className="w-[390px] px-[24px] pt-[12px] text-center">Loading products...</div>;
    if (error) return <div className="w-[390px] px-[24px] pt-[12px] text-center text-red-500">{error}</div>;

    return (
        <div className='w-[390px] relative px-[24px] pt-[12px]'>
            <div className='flex justify-between items-center'>
                <h1 className='text-[32px] font-[600] text-[#1A1A1A]'>Discover</h1>
                <button className='mt-[6px]'><img className='w-[24px] h-[27px]' src={bell} alt="Notifications" /></button>
            </div>

            <form onSubmit={handleSearchSubmit} className='flex justify-between mt-[16px] items-center'>
                <div className='flex justify-center items-center px-[20px] py-[14px] rounded-[10px] border-[1px] border-[#E6E6E6]'>
                    <img className='mr-[12px]' src={lupa} alt="Search" />
                    <input 
                        className='w-[181px] h-[22px] outline-none text-[16px] font-[400] placeholder:text-[#999999]' 
                        placeholder='Search for clothes...' 
                        type="text"
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                    <img src={micro} alt="Voice search" />
                </div>
                <button 
                    type="submit" 
                    className='w-[52px] h-[52px] bg-[#1A1A1A] flex justify-center items-center rounded-[10px]'
                >
                    <img src={filter} alt="Filter" />
                </button>
            </form>

            <div className='sort mt-[16px] flex justify-center items-center gap-[8px]'>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`px-[20px] py-[7px] border-[1px] border-[#E6E6E6] flex justify-center items-center rounded-[10px] whitespace-nowrap transition-all duration-200 ${
                            activeCategory === category 
                            ? 'bg-black text-white' 
                            : 'bg-white text-black hover:bg-black hover:text-white'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {filteredProducts.length === 0 ? (
                <div className="mt-[40px] text-center text-gray-500">
                    No products found.
                </div>
            ) : (
                <div className="cards mb-[100px] mt-[24px] flex justify-center items-center flex-wrap gap-[19px]">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="card relative flex flex-col justify-start">
                            
                            <img src={product.img} alt={product.title} />
                            <h2 className='mt-[8px] mb-[3px] text-[16px] font-[600]'>{product.title}</h2>
                            <p className='text-[12px] font-[500] text-[#808080]'>$ {product.price}</p>
                            <button
                                onClick={() => toggleFavourite(product.id)}
                            >
                                <img className='absolute rounded-[8px] right-[12px] top-[12px] bg-white p-[8px]' src={favourite} alt="" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HomePage;
