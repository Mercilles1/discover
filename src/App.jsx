import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import HomePage from './HomePage'
import SearchPage from './SearchPage'
import AccountPgae from './AccountPgae'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className='flex justify-center'>
        <div className="relative">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage/>} />
            <Route path="/saved" element={<div className='w-[390px] px-[24px] pt-[12px]'><h1 className='text-2xl font-bold'>Saved Items</h1></div>} />
            <Route path="/cart" element={<div className='w-[390px] px-[24px] pt-[12px]'><h1 className='text-2xl font-bold'>Shopping Cart</h1></div>} />
            <Route path="/account" element={<AccountPgae/>} />
       
          </Routes>

          {/* Shared Navigation Bar */}
          <div className="nav w-[390px] fixed left-1/2 transform -translate-x-1/2 bg-white border-t-[1px] border-[#E6E6E6] bottom-0 h-[86px] px-[24px]">
            <ul className='flex mt-[16px] justify-between items-center'>
              <li>
                <NavLink to="/" className="flex flex-col justify-center items-center">
                  {({ isActive }) => (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="28px" viewBox="0 0 24 24">
                        <path fill={isActive ? "#000000" : "#999999"} d="M 12.039062 2.5 A 1.250125 1.250125 0 0 0 11.367188 2.671875 L 2.3671875 7.9667969 A 1.250125 1.250125 0 0 0 3 10.316406 L 3 19.75 A 1.250125 1.250125 0 0 0 4.25 21 L 19.75 21 A 1.250125 1.250125 0 0 0 21 19.75 L 21 10.314453 A 1.250125 1.250125 0 0 0 21.632812 7.9667969 L 12.632812 2.671875 A 1.250125 1.250125 0 0 0 12.039062 2.5 z M 12 5.2011719 L 18.5 9.0234375 L 18.5 18.5 L 16 18.5 L 16 12.25 A 1.250125 1.250125 0 0 0 14.75 11 L 9.25 11 A 1.250125 1.250125 0 0 0 8 12.25 L 8 18.5 L 5.5 18.5 L 5.5 9.0234375 L 12 5.2011719 z M 10.5 13.5 L 13.5 13.5 L 13.5 18.5 L 10.5 18.5 L 10.5 13.5 z"></path>
                      </svg>
                      <p className={isActive ? 'text-[12px] font-[500] text-black' : 'text-[12px] font-[500] text-[#999999]'}>Home</p>
                    </>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/search" className="flex flex-col justify-center items-center">
                  {({ isActive }) => (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="28px" viewBox="0 0 50 50">
                        <path fill={isActive ? "#000000" : "#999999"} d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z"></path>
                      </svg>
                      <p className={isActive ? 'text-[12px] font-[500] text-black' : 'text-[12px] font-[500] text-[#999999]'}>Search</p>
                    </>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/saved" className="flex flex-col justify-center items-center">
                  {({ isActive }) => (
                    <>
                      <svg width="28" height="28px" viewBox="0 0 32 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16 22
       C16 22, 4 15, 4 8
       C4 4.5, 7 2, 10.5 2
       C13 2, 15 3.5, 16 5
       C17 3.5, 19 2, 21.5 2
       C25 2, 28 4.5, 28 8
       C28 15, 16 22, 16 22Z"
                          fill={isActive ? "#000000" : "none"}
                          stroke={isActive ? "#000000" : "#999999"}
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <p className={isActive ? 'text-[12px] font-[500] text-black' : 'text-[12px] font-[500] text-[#999999]'}>Saved</p>
                    </>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/cart" className="flex flex-col justify-center items-center">
                  {({ isActive }) => (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28px" viewBox="0 0 32 32">
                        <g id="cart">
                          <path fill={isActive ? "#000000" : "#999999"} d="M29.46 10.14A2.94 2.94 0 0 0 27.1 9H10.22L8.76 6.35A2.67 2.67 0 0 0 6.41 5H3a1 1 0 0 0 0 2h3.41a.68.68 0 0 1 .6.31l1.65 3 .86 9.32a3.84 3.84 0 0 0 4 3.38h10.37a3.92 3.92 0 0 0 3.85-2.78l2.17-7.82a2.58 2.58 0 0 0-.45-2.27zM28 11.86l-2.17 7.83A1.93 1.93 0 0 1 23.89 21H13.48a1.89 1.89 0 0 1-2-1.56L10.73 11H27.1a1 1 0 0 1 .77.35.59.59 0 0 1 .13.51z" />
                          <circle fill={isActive ? "#000000" : "#999999"} cx="14" cy="26" r="2" />
                          <circle fill={isActive ? "#000000" : "#999999"} cx="24" cy="26" r="2" />
                        </g>
                      </svg>
                      <p className={isActive ? 'text-[12px] font-[500] text-black' : 'text-[12px] font-[500] text-[#999999]'}>Cart</p>
                    </>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/account" className="flex flex-col justify-center items-center">
                  {({ isActive }) => (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28px" viewBox="0 0 32 32">
                        <path fill={isActive ? "#000000" : "#999999"} d="M16 31C7.729 31 1 24.271 1 16S7.729 1 16 1s15 6.729 15 15-6.729 15-15 15zm0-28C8.832 3 3 8.832 3 16s5.832 13 13 13 13-5.832 13-13S23.168 3 16 3z" />
                        <circle fill={isActive ? "#000000" : "#999999"} cx="16" cy="15.133" r="4.267" />
                        <path fill={isActive ? "#000000" : "#999999"} d="M16 30c2.401 0 4.66-.606 6.635-1.671-.425-3.229-3.18-5.82-6.635-5.82s-6.21 2.591-6.635 5.82A13.935 13.935 0 0 0 16 30z" />
                      </svg>
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