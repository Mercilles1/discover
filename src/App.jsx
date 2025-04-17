import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './HomePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className='flex justify-center'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<div className='w-[390px] px-[24px] pt-[12px]'><h1 className='text-2xl font-bold'>Search Page</h1></div>} />
          <Route path="/saved" element={<div className='w-[390px] px-[24px] pt-[12px]'><h1 className='text-2xl font-bold'>Saved Items</h1></div>} />
          <Route path="/cart" element={<div className='w-[390px] px-[24px] pt-[12px]'><h1 className='text-2xl font-bold'>Shopping Cart</h1></div>} />
          <Route path="/account" element={<div className='w-[390px] px-[24px] pt-[12px]'><h1 className='text-2xl font-bold'>Account Page</h1></div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App