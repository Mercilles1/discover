import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import bell from '../assets/Bell.png';
import arrow from '../assets/Arrow.png';
import box from '../assets/Box.png';
import go from '../assets/Chevron.png';
import logout from '../assets/Logout.png';
import details from '../assets/Details.png';
import adress from '../assets/Address.png';
import card from '../assets/Card.png';
import quastion from '../assets/Question.png';
import headphones from '../assets/Headphones.png';
import warning from '../assets/Warning.png';

function AccountPage() {
  const [showLogoutForm, setShowLogoutForm] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowLogoutForm(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutForm(false);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('isAuth');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="px-4 py-6">
      {/* Top Section */}
      <div className="space-y-1">
        <NavLink to="/dashboard/my-orders" className="block no-underline text-inherit">
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <img src={box} alt="My Orders" />
              <p className="text-[16px] md:text-[18px]">My Orders</p>
            </div>
            <img src={go} alt="Go" />
          </div>
        </NavLink>

        <NavLink to="/dashboard/my-details" className="block no-underline text-inherit">
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <img src={details} alt="My Details" />
              <p className="text-[16px] md:text-[18px]">My Details</p>
            </div>
            <img src={go} alt="Go" />
          </div>
        </NavLink>

        <NavLink to="/dashboard/address" className="block no-underline text-inherit">
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <img src={adress} alt="Address Book" />
              <p className="text-[16px] md:text-[18px]">Address Book</p>
            </div>
            <img src={go} alt="Go" />
          </div>
        </NavLink>

        <NavLink to="/dashboard/payment" className="block no-underline text-inherit">
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <img src={card} alt="Payment Methods" />
              <p className="text-[16px] md:text-[18px]">Payment Methods</p>
            </div>
            <img src={go} alt="Go" />
          </div>
        </NavLink>

        <NavLink to="/dashboard/notifications" className="block no-underline text-inherit">
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <img src={bell} alt="Notifications" />
              <p className="text-[16px] md:text-[18px]">Notifications</p>
            </div>
            <img src={go} alt="Go" />
          </div>
        </NavLink>
      </div>

      {/* Divider */}
      <div className="h-2 bg-gray-100 my-4"></div>

      {/* FAQs and Help Center */}
      <div className="space-y-1">
        <NavLink to="/dashboard/faqs" className="block no-underline text-inherit">
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <img src={quastion} alt="FAQs" />
              <p className="text-[16px] md:text-[18px]">FAQs</p>
            </div>
            <img src={go} alt="Go" />
          </div>
        </NavLink>

        <NavLink to="/dashboard/help-center" className="block no-underline text-inherit">
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <img src={headphones} alt="Help Center" />
              <p className="text-[16px] md:text-[18px]">Help Center</p>
            </div>
            <img src={go} alt="Go" />
          </div>
        </NavLink>
      </div>

      {/* Divider */}
      <div className="h-2 bg-gray-100 my-4"></div>

      {/* Logout Button */}
      <div className="flex items-center gap-4 px-2 py-4">
        <img src={logout} alt="Logout" />
        <button
          className="text-[16px] md:text-[18px] text-red-500"
          onClick={handleLogoutClick}
        >
          Logout
        </button>
      </div>

      {/* Logout Modal */}
      {showLogoutForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center">
            <img src={warning} alt="Warning" className="mx-auto" />
            <h2 className="text-[20px] font-semibold mt-4">Logout?</h2>
            <p className="text-gray-500 mt-2">Are you sure you want to logout?</p>
            <button
              className="w-full bg-red-500 text-white py-3 rounded-lg mt-6"
              onClick={handleConfirmLogout}
            >
              Yes, Logout
            </button>
            <button
              className="w-full border border-gray-300 py-3 rounded-lg mt-3"
              onClick={handleCancelLogout}
            >
              No, Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountPage;
