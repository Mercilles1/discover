import React from "react";

const FilterModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-end">
      <div className="bg-white w-full rounded-t-2xl p-4 max-h-[90%]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={onClose} className="text-2xl font-light">×</button>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Sort By</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded-full text-sm bg-black text-white">
              Relevance
            </button>
            <button className="px-3 py-1 border rounded-full text-sm">
              Price: Low - High
            </button>
            <button className="px-3 py-1 border rounded-full text-sm">
              Price: High - Low
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Price</p>
          <input type="range" min="0" max="19" className="w-full" />
          <div className="flex justify-between text-xs mt-1 text-gray-500">
            <span>$0</span>
            <span>$1000</span>
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

        <button className="bg-black text-white w-full py-3 rounded-xl mt-4">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterModal;
