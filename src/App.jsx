import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import HomePage from './HomePage'
import home from './assets/homeNav.png'
import lupaNav from './assets/lupaNav.png'
import favouriteNav from './assets/favouriteNav.png'
import cart from './assets/Cart.png'
import user from './assets/user.png'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className='flex justify-center'>
        <div className="relative">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<div className='w-[390px] px-[24px] pt-[12px]'><h1 className='text-2xl font-bold'>Search Page</h1></div>} />
            <Route path="/saved" element={<div className='w-[390px] px-[24px] pt-[12px]'><h1 className='text-2xl font-bold'>Saved Items</h1></div>} />
            <Route path="/cart" element={<div className='w-[390px] px-[24px] pt-[12px]'><h1 className='text-2xl font-bold'>Shopping Cart</h1></div>} />
            <Route path="/account" element={<div className='w-[390px] px-[24px] pt-[12px]'><h1 className='text-2xl font-bold'>Account Page</h1></div>} />
          </Routes>
          
          {/* Shared Navigation Bar */}
          <div className="nav w-[390px] fixed left-1/2 transform -translate-x-1/2 bg-white border-t-[1px] border-[#E6E6E6] bottom-0 h-[86px] px-[24px]">
            <ul className='flex mt-[16px] justify-between items-center'>
              <li>
                <NavLink to="/" className="flex flex-col justify-center items-center">
                  {({ isActive }) => (
                    <>
                      <img src={home} alt="Home" />
                      <p className={isActive ? 'text-[12px] font-[500] text-black' : 'text-[12px] font-[500] text-[#999999]'}>Home</p>
                    </>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/search" className="flex flex-col justify-center items-center">
                  {({ isActive }) => (
                    <>
                      <img src={lupaNav} alt="Search" />
                      <p className={isActive ? 'text-[12px] font-[500] text-black' : 'text-[12px] font-[500] text-[#999999]'}>Search</p>
                    </>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/saved" className="flex flex-col justify-center items-center">
                  {({ isActive }) => (
                    <>
                      <img src={favouriteNav} alt="Saved" />
                      <p className={isActive ? 'text-[12px] font-[500] text-black' : 'text-[12px] font-[500] text-[#999999]'}>Saved</p>
                    </>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/cart" className="flex flex-col justify-center items-center">
                  {({ isActive }) => (
                    <>
                      <img src={cart} alt="Cart" />
                      <p className={isActive ? 'text-[12px] font-[500] text-black' : 'text-[12px] font-[500] text-[#999999]'}>Cart</p>
                    </>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/account" className="flex flex-col justify-center items-center">
                  {({ isActive }) => (
                    <>
                      <img src={user} alt="Account" />
                      <p className={isActive ? 'text-[12px] font-[500] text-black' : 'text-[12px] font-[500] text-[#999999]'}>Account</p>
                    </>
                  )}
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App