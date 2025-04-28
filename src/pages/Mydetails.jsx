import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import back from '../assets/back.png'
import notification from '../assets/notification.png'

const Mydetails = () => {
  const [userDetails, setUserDetails] = useState({
    fullname: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: ''
  });
  
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (userData) {
      const userObj = JSON.parse(userData);
      
      const userDetails = {
        fullname: userObj.fullname || '',
        email: userObj.gmail || '',
        dateOfBirth: userObj.dateOfBirth || '',
        gender: userObj.gender || '',
        phoneNumber: userObj.phoneNumber || ''
      };
      
      setUserDetails(userDetails);
    } else {
      setUserDetails({
        fullname: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: ''
      });
    }
  }, []);

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    
    let formattedNumber = '';
    if (digits.length > 0) {
      formattedNumber = '+' + digits.substring(0, 3);
      
      if (digits.length > 3) {
        formattedNumber += ' ' + digits.substring(3, 5);
      }
      
      if (digits.length > 5) {
        formattedNumber += ' ' + digits.substring(5, 8);
      }
      
      if (digits.length > 8) {
        formattedNumber += ' ' + digits.substring(8, 10);
      }
      
      if (digits.length > 10) {
        formattedNumber += ' ' + digits.substring(10);
      }
    }
    
    return formattedNumber;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let newValue = value;
    if (name === 'phoneNumber') {
      newValue = formatPhoneNumber(value);
    }
    
    const updatedDetails = { ...userDetails, [name]: newValue };
    setUserDetails(updatedDetails);
    setHasChanges(true);
  };
  
  const handleSubmit = () => {
    const userData = localStorage.getItem('user');
    
    if (userData) {
      const userObj = JSON.parse(userData);
      
      userObj.fullname = userDetails.fullname;
      userObj.gmail = userDetails.email;
      userObj.dateOfBirth = userDetails.dateOfBirth;
      userObj.gender = userDetails.gender;
      userObj.phoneNumber = userDetails.phoneNumber;
      
      localStorage.setItem('user', JSON.stringify(userObj));
      
      setHasChanges(false);
    } else {
      const newUser = {
        fullname: userDetails.fullname,
        gmail: userDetails.email,
        dateOfBirth: userDetails.dateOfBirth,
        gender: userDetails.gender,
        phoneNumber: userDetails.phoneNumber
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      setHasChanges(false);
    }
  };

  return (
    <div className='px-[24px] mt-[12px] w-[390px] pb-[100px]'>
      <div className='flex justify-between items-center w-full'>
        <NavLink to={'/dashboard/account'}><img className='w-[24px] h-[24px]' src={back} alt='' /></NavLink>
        <h3 className='font-[general sans] font-semibold text-[24px] text-[#1A1A1A]'>My Details</h3>
        <NavLink to={'/dashboard/notifications'}><img className='w-[24px] h-[24px]' src={notification} alt='' /></NavLink>
      </div>
      <hr className='bg-[#E6E6E6] text-[#E6E6E6] mt-[24px] h-[1.5px]' />

      <div className='flex flex-col gap-[16px] mt-[24px]'>
        <div className='flex flex-col gap-[4px]'>
          <p className='font-[general sans] font-medium text-[16px] text-[#1A1A1A]'>Full Name</p>
          <input 
            className='w-[341px] h-[52px] border-[1px] border-[#E6E6E6] rounded-[10px] px-3' 
            type="text" 
            name="fullname"
            value={userDetails.fullname}
            onChange={handleChange}
            placeholder="Full Name"
          />
        </div>
        <div className='flex flex-col gap-[4px]'>
          <p className='font-[general sans] font-medium text-[16px] text-[#1A1A1A]'>Email Address</p>
          <input 
            className='w-[341px] h-[52px] border-[1px] border-[#E6E6E6] rounded-[10px] px-3' 
            type="email" 
            name="email"
            value={userDetails.email}
            onChange={handleChange}
            placeholder="Email Address"
          />
        </div>
        <div className='flex flex-col gap-[4px]'>
          <p className='font-[general sans] font-medium text-[16px] text-[#1A1A1A]'>Date of Birth</p>
          <input 
            className='w-[341px] h-[52px] border-[1px] border-[#E6E6E6] rounded-[10px] px-3' 
            type="date" 
            name="dateOfBirth"
            value={userDetails.dateOfBirth}
            onChange={handleChange}
            placeholder="Date of Birth"
          />
        </div>
        <div className='flex flex-col gap-[4px]'>
          <p className='font-[general sans] font-medium text-[16px] text-[#1A1A1A]'>Gender</p>
          <select
            className='w-[341px] h-[52px] border-[1px] border-[#E6E6E6] rounded-[10px] px-3'
            name="gender"
            value={userDetails.gender}
            onChange={handleChange}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className='flex flex-col gap-[4px]'>
          <p className='font-[general sans] font-medium text-[16px] text-[#1A1A1A]'>Phone Number</p>
          <input 
            className='w-[341px] h-[52px] border-[1px] border-[#E6E6E6] rounded-[10px] px-3' 
            type="tel" 
            name="phoneNumber"
            value={userDetails.phoneNumber}
            onChange={handleChange}
            placeholder="+998 99 123 34 56"
            maxLength={17}
            minLength={17}
          />
        </div>
      </div>

      <button 
        className='w-[341px] h-[54px] bg-[#1A1A1A] text-white font-[general sans] font-medium text-[16px] rounded-[10px] mt-[40px]'
        onClick={handleSubmit}
        disabled={!hasChanges}
      >
        Submit
      </button>
    </div>
  )
}

export default Mydetails