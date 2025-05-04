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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    
    // Clear any previous messages
    setError('');
    setSuccess('');
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const userData = localStorage.getItem('user');
      
      if (userData) {
        const userObj = JSON.parse(userData);
        
        // Track if we have changes to send to API
        const hasApiChanges = userObj.fullname !== userDetails.fullname || 
                             userObj.gmail !== userDetails.email;
        
        // Update localStorage with all changes
        const updatedUser = {
          ...userObj,
          fullname: userDetails.fullname,
          gmail: userDetails.email,
          dateOfBirth: userDetails.dateOfBirth,
          gender: userDetails.gender,
          phoneNumber: userDetails.phoneNumber
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // If fullname or email has changed, update the API
        if (hasApiChanges) {
          await updateUserInAPI(updatedUser);
        } else {
          console.log("No API changes needed, only updated localStorage");
          setSuccess("Details updated successfully");
        }
        
        setHasChanges(false);
      } else {
        // Create new user in localStorage
        const newUser = {
          fullname: userDetails.fullname,
          gmail: userDetails.email,
          dateOfBirth: userDetails.dateOfBirth,
          gender: userDetails.gender,
          phoneNumber: userDetails.phoneNumber
        };
        
        localStorage.setItem('user', JSON.stringify(newUser));
        setSuccess("Details saved successfully");
        setHasChanges(false);
      }
    } catch (err) {
      console.error("Error updating user details:", err);
      setError("Failed to update details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to update user data in API
  const updateUserInAPI = async (userData) => {
    // Get user ID for API call - use regular id, not _id
    const userId = userData.id;
    
    if (!userId) {
      console.error("No user ID found for API update");
      throw new Error("User ID not found");
    }
    
    console.log("Updating user in API with ID:", userId);
    
    // First, try to fetch all users to get complete user data
    try {
      const response = await fetch('https://marsgoup-1.onrender.com/api/users');
      
      if (response.ok) {
        const allUsers = await response.json();
        
        // Find the user by regular id only
        const apiUser = allUsers.find(user => user.id === userId);
        
        if (apiUser) {
          console.log("Found user in API:", apiUser);
          
          // Prepare data for API update - only updating fullname and gmail
          const apiUpdateData = {
            ...apiUser, // Start with complete API data
            fullname: userData.fullname,
            gmail: userData.email
          };
          
          // Make PUT request to update API using regular id
          const updateResponse = await fetch(`https://marsgoup-1.onrender.com/api/users/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(apiUpdateData)
          });
          
          if (updateResponse.ok) {
            console.log("API update successful");
            setSuccess("Details updated successfully");
          } else {
            console.log("API update failed, trying POST");
            
            // Try POST as fallback
            const postResponse = await fetch(`https://marsgoup-1.onrender.com/api/users/${userId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(apiUpdateData)
            });
            
            if (postResponse.ok) {
              console.log("API update successful (POST)");
              setSuccess("Details updated successfully");
            } else {
              throw new Error("Failed to update API");
            }
          }
        } else {
          console.log("User not found in API data using id:", userId);
          throw new Error("User not found in API");
        }
      } else {
        console.error("Failed to fetch users from API");
        throw new Error("Failed to fetch users from API");
      }
    } catch (error) {
      console.error("Error updating API:", error);
      // We'll still consider it a partial success since localStorage was updated
      setSuccess("Details saved locally, but couldn't update online profile");
      // Don't rethrow - we want to consider the local update a partial success
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

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className='flex flex-col gap-[16px] mt-[24px]'>
        <div className='flex flex-col gap-[4px]'>
          <p className='font-[general sans] font-medium text-[16px] text-[#1A1A1A]'>
            Full Name <span className="text-xs text-gray-500">(syncs with account)</span>
          </p>
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
          <p className='font-[general sans] font-medium text-[16px] text-[#1A1A1A]'>
            Email Address <span className="text-xs text-gray-500">(syncs with account)</span>
          </p>
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
          <p className='font-[general sans] font-medium text-[16px] text-[#1A1A1A]'>
            Date of Birth <span className="text-xs text-gray-500">(stored locally)</span>
          </p>
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
          <p className='font-[general sans] font-medium text-[16px] text-[#1A1A1A]'>
            Gender <span className="text-xs text-gray-500">(stored locally)</span>
          </p>
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
          <p className='font-[general sans] font-medium text-[16px] text-[#1A1A1A]'>
            Phone Number <span className="text-xs text-gray-500">(stored locally)</span>
          </p>
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
        className={`w-[341px] h-[54px] ${isLoading || !hasChanges ? 'bg-gray-400' : 'bg-[#1A1A1A]'} text-white font-[general sans] font-medium text-[16px] rounded-[10px] mt-[40px]`}
        onClick={handleSubmit}
        disabled={isLoading || !hasChanges}
      >
        {isLoading ? 'Saving...' : 'Submit'}
      </button>
    </div>
  )
}

export default Mydetails