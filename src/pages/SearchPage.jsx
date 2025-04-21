import React, { useState, useEffect } from 'react';
import arrow from '../assets/Arrow.png';
import bell from '../assets/Bell.png';
import lupa from '../assets/lupa.png';
import micro from '../assets/Mic.png';
import cancel from '../assets/cancel.png';
import secArrow from '../assets/secArrow.png';
import { NavLink } from 'react-router-dom';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const goBack = () => {
    window.location.href = "/";
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      setIsSearching(true);
      try {
        const response = await fetch('https://marsgoup-1.onrender.com/api/products');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const filteredProducts = data.filter(product =>
          product.title.toLowerCase().includes(value.toLowerCase()) ||
          product.categories.toLowerCase().includes(value.toLowerCase())
        );

        setSearchResults(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setSearchResults([]);
      }
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim().length > 0) {
      if (!recentSearches.includes(searchTerm)) {
        const newRecentSearches = [searchTerm, ...recentSearches].slice(0, 5);
        setRecentSearches(newRecentSearches);
      }
    }
  };

  const removeRecentSearch = (searchToRemove) => {
    const updatedSearches = recentSearches.filter(search => search !== searchToRemove);
    setRecentSearches(updatedSearches);
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <div className='w-[390px] pt-[20px] px-[24px]'>
      <div className='flex items-center justify-between'>
        <button onClick={goBack}>
          <img src={arrow} alt="Back" />
        </button>
        <h1 className='text-[24px] font-[600]'>Search</h1>
        <button className='mt-[6px]'>
          <img className='w-[24px] h-[27px]' src={bell} alt="Notifications" />
        </button>
      </div>
      <form onSubmit={handleSearchSubmit}>
        <div className='flex justify-start mt-[18px] items-center px-[20px] py-[14px] rounded-[10px] border-[1px] border-[#E6E6E6]'>
          <img className='mr-[12px]' src={lupa} alt="Search" />
          <input
            className='w-[240px] h-[22px] outline-none text-[16px] font-[400] placeholder:text-[#999999]'
            placeholder='Search for clothes...'
            type="text"
            value={searchTerm}
            onChange={handleSearch}
          />
          <img className='' src={micro} alt="Voice search" />
        </div>
      </form>

      {isSearching && searchResults.length > 0 && (
        <div className='mt-4'>
          <h2 className='text-[20px] font-[600] mb-2'>Results</h2>
          <div className='max-h-[300px] overflow-y-auto'>
            {searchResults.map(product => (
              <div key={product._id} className='flex items-center py-3 border-b border-[#E6E6E6]'>
                <NavLink to={`/dashboard/products/${product.id}`} className='flex-grow flex items-center'>
                <div className='w-12 h-12 bg-gray-200 rounded-md flex-shrink-0 mr-3'>
                  {product.img && <img src={product.img} alt={product.title} className='w-full h-full object-cover rounded-md' />}
                </div>
                <div className='flex-grow'>
                  <p className='text-[16px] font-[500]'>{product.title}</p>
                  <p className='text-[14px] text-gray-500'>${product.price}</p>
                </div>
                <img src={secArrow} alt="" />
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      )}

      {isSearching && searchTerm.trim() && searchResults.length === 0 && (
        <div className='mt-4 text-center py-4'>
          <p className='text-gray-500'>No products "{searchTerm}"</p>
        </div>
      )}

      {!isSearching && (
        <>
          <div className='flex justify-between items-center mt-[16px]'>
            <h2 className='text-[20px] font-[600]'>Recent Searches</h2>
            <button onClick={clearAllRecentSearches} className=''><u>Clear all</u></button>
          </div>
          <div className="recentSearches">
            {recentSearches.length > 0 ? (
              recentSearches.map((search, index) => (
                <div key={index} className='flex justify-between mt-[14px] border-[#E6E6E6] items-center border-b pb-[12px]'>
                  <p className='text-[16px] font-[400]'>{search}</p>
                  <img
                    src={cancel}
                    alt="Remove"
                    onClick={() => removeRecentSearch(search)}
                    className='cursor-pointer'
                  />
                </div>
              ))
            ) : (
              <p className='text-[16px] text-gray-400 mt-4'>No recent searches</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SearchPage;
