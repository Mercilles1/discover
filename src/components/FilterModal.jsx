import React from "react";

const FilterModal = ({ isOpen, onClose }) => {
  // Проверяем пропсы
  if (!isOpen) return null;
  
  // Функция для предотвращения баблинга
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-center items-end"
      onClick={onClose} // Закрываем модальное окно при клике на фон
    >
      <div 
        className="bg-white w-full rounded-t-2xl p-4 max-h-[90%]"
        onClick={handleModalClick} // Предотвращаем закрытие при клике на контент
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button 
            onClick={onClose} 
            className="text-2xl font-light px-2"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Sort By</p>
          <div className="flex flex-wrap gap-2">
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

        <button 
          className="bg-black text-white w-full py-3 rounded-xl mt-4"
          onClick={() => {
            // Здесь можно добавить логику применения фильтров
            onClose(); // Закрываем модальное окно после применения фильтров
          }}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterModal;
