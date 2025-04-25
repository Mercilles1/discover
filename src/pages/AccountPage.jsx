import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import bell from '../assets/Bell.png';
import arrow from '../assets/Arrow.png';
import box from '../assets/Box.png';
import go from '../assets/Chevron.png';
import logout from '../assets/Logout.png';
import details from '../assets/Details.png'
import adress from '../assets/Address.png'
import card from '../assets/Card.png'
import quastion from '../assets/Question.png'
import headphones from '../assets/Headphones.png'
import warning from '../assets/Warning.png'

function AccountPage() {
    const [showLogoutForm, setShowLogoutForm] = useState(false);
    const navigate = useNavigate();

    const goBack = () => {
        window.location.href = "/";
    };
    
    const handleLogoutClick = () => {
        setShowLogoutForm(true);
    };
    
    const handleCancelLogout = () => {
        setShowLogoutForm(false);
    };
    
    const handleConfirmLogout = () => {
        // Очищаем localStorage (где хранится флаг авторизации)
        localStorage.removeItem('isAuth');
        
        // Если в локальном хранилище есть другие данные пользователя, их тоже нужно удалить
        localStorage.removeItem('user');
        
        // Перенаправляем на страницу логина
        navigate('/login');
    };

    return (
        <div className={`w-[390px] pt-[20px] relative ${showLogoutForm ? 'overflow-hidden' : ''}`}>
            <div className={`${showLogoutForm ? 'filter blur-sm' : ''}`}>
                <div className='flex items-center justify-between px-[24px]'>
                    <button onClick={goBack}>
                        <img src={arrow} alt="Back" />
                    </button>
                    <h1 className='text-[24px] font-[600]'>Account</h1>
                    <button className='mt-[6px]'>
                        <img className='w-[24px] h-[27px]' src={bell} alt="Notifications" />
                    </button>
                </div>

                <NavLink to="/my-orders" className="no-underline text-inherit">
                    <div className='flex px-[24px] justify-between border-t-[1px] mt-[14px] border-[#E6E6E6] items-center py-[22px]'>
                        <div className='flex gap-[16px] justify-center items-center'>
                            <img src={box} alt="" />
                            <p>My orders</p>
                        </div>
                        <img src={go} alt="" />
                    </div>
                </NavLink>

                <div className='w-[390px] h-[8px] bg-[#E6E6E6]'></div>

                <NavLink to="/my-details" className="no-underline text-inherit">
                    <div className='flex px-[24px] justify-between border-t-[1px] border-[#E6E6E6] items-center py-[22px]'>
                        <div className='flex gap-[16px] justify-center items-center'>
                            <img src={details} alt="" />
                            <p>My Details</p>
                        </div>
                        <img src={go} alt="" />
                    </div>
                </NavLink>

                <NavLink to="/address-book" className="no-underline text-inherit">
                    <div className='flex px-[24px] justify-between border-t-[1px] border-[#E6E6E6] items-center py-[22px]'>
                        <div className='flex gap-[16px] justify-center items-center'>
                            <img src={adress} alt="" />
                            <p>Address Book</p>
                        </div>
                        <img src={go} alt="" />
                    </div>
                </NavLink>

                <NavLink to="/payment-methods" className="no-underline text-inherit">
                    <div className='flex px-[24px] justify-between border-t-[1px] border-[#E6E6E6] items-center py-[22px]'>
                        <div className='flex gap-[16px] justify-center items-center'>
                            <img src={card} alt="" />
                            <p>Payment Methods</p>
                        </div>
                        <img src={go} alt="" />
                    </div>
                </NavLink>

                <NavLink to="/notifications" className="no-underline text-inherit">
                    <div className='flex px-[24px] justify-between border-t-[1px] border-[#E6E6E6] items-center py-[22px]'>
                        <div className='flex gap-[16px] justify-center items-center'>
                            <img src={bell} alt="" />
                            <p>Notifications</p>
                        </div>
                        <img src={go} alt="" />
                    </div>
                </NavLink>

                <div className='w-[390px] h-[8px] bg-[#E6E6E6]'></div>

                <NavLink to="/faqs" className="no-underline text-inherit">
                    <div className='flex px-[24px] justify-between border-t-[1px] border-[#E6E6E6] items-center py-[22px]'>
                        <div className='flex gap-[16px] justify-center items-center'>
                            <img src={quastion} alt="" />
                            <p>FAQs</p>
                        </div>
                        <img src={go} alt="" />
                    </div>
                </NavLink>

                <NavLink to="/help-center" className="no-underline text-inherit">
                    <div className='flex px-[24px] justify-between border-t-[1px] border-[#E6E6E6] items-center py-[22px]'>
                        <div className='flex gap-[16px] justify-center items-center'>
                            <img src={headphones} alt="" />
                            <p>Help Center</p>
                        </div>
                        <img src={go} alt="" />
                    </div>
                </NavLink>

                <div className='w-[390px] h-[8px] bg-[#E6E6E6]'></div>

                <div className='flex justify-start gap-[16px] items-center px-[24px] py-[24px]'>
                    <img src={logout} alt="" />
                    <button className='text-[16px] text-[#ED1010]' onClick={handleLogoutClick}>Logout</button>
                </div>
            </div>
            
            {showLogoutForm && (
                <div className='fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-30'>
                    <div className='logout_form flex flex-col justify-center items-center p-[24px] rounded-[20px] bg-white shadow-lg'>
                        <img src={warning} alt="" />
                        <p className='text-[20px] mt-[12px] font-[600]'>Logout?</p>
                        <p className='text-[16px] mt-[8px]'>Are you sure you want to logout?</p>
                        <button 
                            className='text-white w-[293px] mt-[24px] h-[54px] bg-[#ED1010] rounded-[10px] flex justify-center items-center'
                            onClick={handleConfirmLogout}
                        >
                            Yes, Logout
                        </button>
                        <button 
                            className='w-[293px] mt-[12px] h-[54px] border border-[#CCCCCC] rounded-[10px] flex justify-center items-center'
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