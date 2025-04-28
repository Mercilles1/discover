import React, { useState } from 'react';
import back from '../assets/back.png';
import notification from '../assets/notification.png';
import { NavLink, useNavigate } from 'react-router-dom';
import Congratulations from '../assets/Congratulations.png';

const Newcard = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [showCongrats, setShowCongrats] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isDisabled = !cardNumber || !expiryDate || !securityCode || isSubmitting;

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length < 3) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const validateCard = () => {
    // Basic validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Card number must be 16 digits');
      return false;
    }

    const [month, year] = expiryDate.split('/');
    if (!month || !year || parseInt(month) > 12 || parseInt(month) < 1) {
      setError('Invalid expiry date');
      return false;
    }

    if (securityCode.length !== 3 || !/^\d+$/.test(securityCode)) {
      setError('Security code must be 3 digits');
      return false;
    }

    setError('');
    return true;
  };

  const handleAddCard = async () => {
    if (!validateCard()) return;

    setIsSubmitting(true);

    const card = {
      number: cardNumber.replace(/\s/g, ''),
      expiry: expiryDate,
      cvc: securityCode,
      img: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg'
    };

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        throw new Error('User not found in local storage');
      }

      const userId = user._id;

      const response = await fetch(`https://marsgoup-1.onrender.com/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creditCard: JSON.stringify(card) }) // 👈 stringify the card object
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update card');
      }

      setShowCongrats(true);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to add card. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className='mt-[12px] px-[24px] relative'>
      <div className="flex justify-between items-center">
        <NavLink to="/dashboard/payment"><img src={back} alt="Back" className="w-[24px] h-[24px]" /></NavLink>
        <p className="text-[24px] font-semibold">New Card</p>
        <img src={notification} alt="Notif" className="w-[24px] h-[24px]" />
      </div>
      <hr className='bg-[#E6E6E6] text-[#E6E6E6] mt-[24px]' />
      <p className='font-[general sans] font-semibold text-[16px] text-[#1A1A1A] mt-[20px]'>Add Debit or Credit Card</p>

      {error && (
        <div className="mt-2 text-red-500 text-sm font-medium">
          {error}
        </div>
      )}

      <div className='flex flex-wrap flex-col mt-[16px]'>
        <div className='flex flex-col gap-[4px]'>
          <label htmlFor="number" className='text-[16px] font-medium font-[general sans] text-[#1A1A1A]'>Card number</label>
          <input
            name='number'
            id='number'
            placeholder='Enter your card number'
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            className='w-full max-w-[341px] h-[52px] border-[1px] border-[#E6E6E6] pl-[20px] rounded-[10px] text-[16px] font-[general sans] text-[#999999] outline-none'
            type="text"
            inputMode="numeric"
          />
        </div>

        <div className='flex gap-[11px] mt-[16px] flex-wrap'>
          <div className='flex flex-col gap-[4px]'>
            <label htmlFor="date" className='text-[16px] font-medium font-[general sans] text-[#1A1A1A]'>Expiry Date</label>
            <input
              name='date'
              id='date'
              placeholder='MM/YY'
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              className='w-[165px] h-[52px] border-[1px] border-[#E6E6E6] pl-[20px] rounded-[10px] text-[16px] font-[general sans] text-[#999999] outline-none'
              type="text"
              inputMode="numeric"
            />
          </div>

          <div className='flex flex-col gap-[4px]'>
            <label htmlFor="code" className='text-[16px] font-medium font-[general sans] text-[#1A1A1A]'>Security Code</label>
            <input
              name='code'
              id='code'
              placeholder='CVC'
              maxLength={3}
              value={securityCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setSecurityCode(value);
              }}
              className='w-[165px] h-[52px] border-[1px] border-[#E6E6E6] pl-[20px] rounded-[10px] text-[16px] font-[general sans] text-[#999999] outline-none'
              type="text"
              inputMode="numeric"
            />
          </div>
        </div>

        <button
          onClick={handleAddCard}
          disabled={isDisabled}
          className={`w-full max-w-[341px] h-[54px] rounded-[10px] mt-[220px] ${isDisabled ? 'bg-[#CCCCCC]' : 'bg-[#1A1A1A] text-white'}`}
        >
          {isSubmitting ? 'Adding...' : 'Add Card'}
        </button>
      </div>

      {showCongrats && (
        <div className='w-[341px] h-[270px] bg-white rounded-[20px] p-[24px] items-center flex flex-col fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-lg'>
          <img className='w-[78px] h-[78px]' src={Congratulations} alt="Congrats" />
          <p className='text-[#1A1A1A] font-[general sans] font-semibold text-[20px] mt-[12px]'>Congratulations!</p>
          <p className='text-[16px] text-[#808080] font-[general sans] mt-[8px] text-center'>Your new card has been added.</p>
          <button
            onClick={() => navigate('/dashboard/payment')}
            className='w-full max-w-[293px] h-[54px] bg-[#1A1A1A] text-white rounded-[10px] mt-[24px]'>
            Thanks
          </button>
        </div>
      )}

      {showCongrats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-0"></div>
      )}
    </div>
  );
};

export default Newcard;