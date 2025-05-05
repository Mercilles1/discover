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
    window.location.href = "/dashboard";
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      setIsSearching(true);
      try {
        const response = await fetch('https://marsgoup-1.onrender.com/api/products');
        if (!response.ok) throw new Error('Network response was not ok');
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
    <div className='w-full max-w-4xl mx-auto pt-5 px-4 md:px-8'>
      <div className='flex items-center justify-between'>
        <button onClick={goBack}>
          <img src={arrow} alt="Back" className='w-6 h-6 md:w-8 md:h-8' />
        </button>
        <h1 className='text-lg md:text-2xl font-semibold'>Search</h1>
        <button className='mt-1'>
          <img className='w-6 h-6 md:w-7 md:h-7' src={bell} alt="Notifications" />
        </button>
      </div>

      <form onSubmit={handleSearchSubmit}>
        <div className='flex items-center mt-5 px-4 py-3 rounded-lg border border-[#E6E6E6]'>
          <img className='w-5 h-5 mr-3' src={lupa} alt="Search" />
          <input
            className='flex-1 h-6 md:h-8 outline-none text-base placeholder:text-gray-400'
            placeholder='Search for clothes...'
            type="text"
            value={searchTerm}
            onChange={handleSearch}
          />
          <img className='w-5 h-5' src={micro} alt="Voice search" />
        </div>
      </form>

      {isSearching && searchResults.length > 0 && (
        <div className='mt-6'>
          <h2 className='text-lg font-semibold mb-3'>Results</h2>
          <div className='max-h-[400px] overflow-y-auto space-y-3'>
            {searchResults.map(product => (
              <NavLink key={product._id} to={`/dashboard/products/${product.id}`} className='flex items-center p-3 border-b border-[#E6E6E6]'>
                <div className='w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 mr-4'>
                  {product.img && <img src={product.img} alt={product.title} className='w-full h-full object-cover rounded-md' />}
                </div>
                <div className='flex-1'>
                  <p className='text-sm font-medium'>{product.title}</p>
                  <p className='text-xs text-gray-500'>${product.price}</p>
                </div>
                <img src={secArrow} alt="Go" className='w-4 h-4 ml-2' />
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {isSearching && searchTerm.trim() && searchResults.length === 0 && (
        <div className='mt-6 text-center py-6'>
          <p className='text-gray-400'>No products "{searchTerm}"</p>
        </div>
      )}

      {!isSearching && (
        <>
          <div className='flex justify-between items-center mt-6'>
            <h2 className='text-lg font-semibold'>Recent Searches</h2>
            {recentSearches.length > 0 && (
              <button onClick={clearAllRecentSearches} className='text-sm text-blue-500 underline'>Clear all</button>
            )}
          </div>
          <div className="mt-4 space-y-4">
            {recentSearches.length > 0 ? (
              recentSearches.map((search, index) => (
                <div key={index} className='flex justify-between items-center border-b pb-3'>
                  <p className='text-base'>{search}</p>
                  <img
                    src={cancel}
                    alt="Remove"
                    onClick={() => removeRecentSearch(search)}
                    className='w-5 h-5 cursor-pointer'
                  />
                </div>
              ))
            ) : (
              <p className='text-gray-400 text-center mt-6'>No recent searches</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SearchPage;
