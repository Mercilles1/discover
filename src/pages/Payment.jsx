import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import back from '../assets/back.png';
import notification from '../assets/notification.png';

const Payment = () => {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        fetch('https://marsgoup-1.onrender.com/api/users')
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setCards(data);
            });
    }, []);

    const validCards = cards
        .map(user => user.creditCard)
        .filter(card => card && typeof card === 'object' && card.number && card.name && card.img);

    return (
        <div className='px-[24px] mt-[12px]'>
            <div className="flex justify-between items-center">
                <NavLink to="/"><img src={back} alt="Back" className="w-[24px] h-[24px]" /></NavLink>
                <p className="text-[24px] font-semibold">Payment Method</p>
                <img src={notification} alt="Notif" className="w-[24px] h-[24px]" />
            </div>
            <hr className='bg-[#E6E6E6] text-[#E6E6E6] mt-[24px]' />

            <p className='font-[general sans] font-semibold text-[16px] text-[#1A1A1A] mt-[20px]'>Saved Cards</p>
            {validCards.length > 0 ? (
                validCards.map((card, index) => (
                    <div key={card.id || index} className='flex items-center justify-between mt-[12px]'>
                        <div className="flex items-center justify-between w-[341px] h-[52px] bg-white border border-[#E6E6E6] rounded-[10px] px-[20px]">
                            <div className="flex items-center gap-[10px]">
                                <img src={card.img} alt="Card" className="w-[24px] h-[24px]" />
                                <p className="tracking-wider font-medium">**** **** **** {card.number.slice(-4)}</p>
                            </div>
                            <input type="radio" name="cards" className="w-[20px] h-[20px] accent-black" />
                        </div>

                        <NavLink to='/dashboard/newcard'>
                            <button className='w-[341px] h-[54px] bg-transparent border-[1px] border-[#CCCCCC] font-[general sans] font-medium text-[16px] text-[#1A1A1A] rounded-[10px]'>+ Add New Card</button>
                        </NavLink>
                    </div>
                ))
            ) : (
                <div>
                    <p className='text-gray-500 text-[24px] mt-[12px]'>You don’t have any cards</p>
                    <NavLink to='/dashboard/newcard'><button className='w-[341px] h-[54px] bg-transparent border-[1px] border-[#CCCCCC] font-[general sans] font-medium text-[16px] text-[#1A1A1A] rounded-[10px]'>+ Add New Card</button></NavLink>
                </div>
            )}
        </div>
    );
};

export default Payment;
