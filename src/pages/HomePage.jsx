import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
// Import the assets
import home from '../assets/homeNav.png'
import lupaNav from '../assets/lupaNav.png'
import favouriteNav from '../assets/favouriteNav.png'
import cart from '../assets/Cart.png'
import user from '../assets/user.png'

const HomePage = () => {
	return (
		<div>
			<div>
				<Outlet />
			</div>
			<div className='nav w-[390px] fixed left-1/2 transform -translate-x-1/2 bg-white border-t-[1px] border-[#E6E6E6] bottom-0 h-[86px] px-[24px]'>
				<ul className='flex mt-[16px] justify-between items-center'>
					<li>
						<NavLink
							to='/dashboard'
							end
							className={({ isActive }) =>
								`flex flex-col justify-center items-center ${
									isActive ? 'text-black' : ''
								}`
							}
						>
							<img src={home} alt='Home' />
							<p className='text-[12px] font-[500] text-[#999999]'>Home</p>
						</NavLink>
					</li>
					<li>
						<NavLink
							to='/dashboard/search'
							className={({ isActive }) =>
								`flex flex-col justify-center items-center ${
									isActive ? 'text-black' : ''
								}`
							}
						>
							<img src={lupaNav} alt='Search' />
							<p className='text-[12px] font-[500] text-[#999999]'>Search</p>
						</NavLink>
					</li>
					<li>
						<NavLink
							to='/dashboard/saved'
							className={({ isActive }) =>
								`flex flex-col justify-center items-center ${
									isActive ? 'text-black' : ''
								}`
							}
						>
							<img src={favouriteNav} alt='Saved' />
							<p className='text-[12px] font-[500] text-[#999999]'>Saved</p>
						</NavLink>
					</li>
					<li>
						<NavLink
							to='/dashboard/cart'
							className={({ isActive }) =>
								`flex flex-col justify-center items-center ${
									isActive ? 'text-black' : ''
								}`
							}
						>
							<img src={cart} alt='Cart' />
							<p className='text-[12px] font-[500] text-[#999999]'>Cart</p>
						</NavLink>
					</li>
					<li>
						<NavLink
							to='/dashboard/account'
							className={({ isActive }) =>
								`flex flex-col justify-center items-center ${
									isActive ? 'text-black' : ''
								}`
							}
						>
							<img src={user} alt='Account' />
							<p className='text-[12px] font-[500] text-[#999999]'>Account</p>
						</NavLink>
					</li>
				</ul>
			</div>
		</div>
	)
}

export default HomePage
