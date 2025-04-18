import React, { useState } from "react";
import FilterModal from "./components/FilterModal";
import icon from "./assets/Vector.png"

const App = () => {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-xl font-bold mb-6">Only Filter Page</h1>

      <button
        className="bg-black text-white px-4 py-2 rounded-xl"
        onClick={() => setShowFilter(true)}
      >
        <img src={icon} alt="" />
      </button>

      <FilterModal isOpen={showFilter} onClose={() => setShowFilter(false)} />
    </div>
  );
};

export default App;
