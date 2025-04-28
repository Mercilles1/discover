import React, { useState } from "react";

const FilterModal = ({ isOpen, onClose }) => {
  const [selectedSort, setSelectedSort] = useState("Relevance");
  const [priceValue, setPriceValue] = useState(0);

  if (!isOpen) return null;

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const sortOptions = ["Relevance", "Price: Low - High", "Price: High - Low"];

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-center items-end pointer-events-none"
      onClick={onClose}
    >
      <div
        className="bg-white w-full rounded-t-2xl p-5 max-h-[90%] shadow-md transform transition-all duration-300 translate-y-0 pointer-events-auto"
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={onClose} className="text-2xl font-light px-2">
            ×
          </button>
        </div>

        {/* Sort By */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Sort By</p>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map(option => (
              <button
                key={option}
                onClick={() => setSelectedSort(option)}
                className={`px-3 py-1 border rounded-full text-sm ${
                  selectedSort === option ? "bg-black text-white" : "bg-gray-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Price</p>
          <input 
            type="range" 
            min="0" 
            max="1000" 
            value={priceValue} 
            onChange={(e) => setPriceValue(e.target.value)} 
            className="w-full"
          />
          <div className="flex justify-between text-xs mt-1 text-gray-500">
            <span>$0</span>
            <span>${priceValue}</span>
          </div>
        </div>

        {/* Size */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Size</p>
          <select className="w-full border rounded-xl px-3 py-2">
            <option value="L">L</option>
            <option value="M">M</option>
            <option value="S">S</option>
          </select>
        </div>

        {/* Apply Button */}
        <button
          className="bg-black text-white w-full py-3 rounded-xl mt-4"
          onClick={onClose}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterModal;
