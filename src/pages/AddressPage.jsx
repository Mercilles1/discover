import React, { useState, useEffect } from 'react';
import arrow from '../assets/Arrow.png';
import bell from '../assets/Bell.png';
import plus from '../assets/Plus.png';
import location from '../assets/Location.png';
import mapIcon from '../assets/Map.png';
import { NavLink, useNavigate } from 'react-router-dom';

function AddressPage() {
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState("");
    
    const navigate = useNavigate();
    
    // Constants
    const API_BASE_URL = 'https://marsgoup-1.onrender.com/api';

    // Improved function to get current user ID from various storage locations
    const getCurrentUserId = () => {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                if (parsedUser && parsedUser.id) {
                    return parsedUser.id;
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
        
        const possibleUserKeys = ['userData', 'user', 'currentUser', 'auth', 'authUser'];
        
        for (const key of possibleUserKeys) {
            const storedData = localStorage.getItem(key);
            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);
                    if (parsedData) {
                        if (parsedData.id) return parsedData.id;
                        if (parsedData._id) return parsedData._id;
                        if (parsedData.userId) return parsedData.userId;
                        if (parsedData.user && parsedData.user.id) return parsedData.user.id;
                    }
                } catch (error) {
                    console.error(`Error parsing ${key}:`, error);
                }
            }
        }
        
        console.log("User ID not found in localStorage, using default ID '2'");
        return "2";
    };

    // Fetch user addresses from API
    const fetchUserAddresses = async () => {
        setIsLoading(true);
        setError(null);
        
        const currentUserId = getCurrentUserId();
        setUserId(currentUserId);
        
        console.log("Current user ID:", currentUserId);
        
        try {
            const response = await fetch(`${API_BASE_URL}/users/${currentUserId}`);
            
            if (!response.ok) {
                throw new Error(`Error fetching user data: ${response.status}`);
            }
            
            const userData = await response.json();
            console.log("User data retrieved:", userData);
            
            if (userData && userData.locations && Array.isArray(userData.locations)) {
                const userLocations = userData.locations.filter(loc => 
                    !loc.userId || loc.userId === currentUserId
                );
                
                setAddresses(userLocations);
                console.log("Addresses loaded:", userLocations.length);
                
                if (userLocations.length > 0 && !selectedAddress) {
                    setSelectedAddress(userLocations[0].id);
                }
            } else {
                console.log("No locations found in user data, checking localStorage");
                const savedAddresses = localStorage.getItem('savedAddresses');
                if (savedAddresses) {
                    try {
                        const parsedAddresses = JSON.parse(savedAddresses);
                        const userAddresses = parsedAddresses.filter(addr => 
                            !addr.userId || addr.userId === currentUserId
                        );
                        
                        if (Array.isArray(userAddresses) && userAddresses.length > 0) {
                            console.log("Addresses loaded from localStorage:", userAddresses.length);
                            setAddresses(userAddresses);
                            
                            if (!selectedAddress) {
                                setSelectedAddress(userAddresses[0].id);
                            }
                        }
                    } catch (error) {
                        console.error('Error parsing saved addresses:', error);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch user addresses:', error);
            setError('Could not load your addresses. Please try again later.');
            
            const savedAddresses = localStorage.getItem('savedAddresses');
            if (savedAddresses) {
                try {
                    const parsedAddresses = JSON.parse(savedAddresses);
                    const userAddresses = parsedAddresses.filter(addr => 
                        !addr.userId || addr.userId === currentUserId
                    );
                    
                    if (Array.isArray(userAddresses)) {
                        console.log("Fallback: Addresses loaded from localStorage:", userAddresses.length);
                        setAddresses(userAddresses);
                    }
                } catch (error) {
                    console.error('Error parsing saved addresses:', error);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserAddresses();
        
        const currentAddress = localStorage.getItem('currentAddress');
        if (currentAddress) {
            try {
                const parsedCurrentAddress = JSON.parse(currentAddress);
                if (parsedCurrentAddress && parsedCurrentAddress.id) {
                    setSelectedAddress(parsedCurrentAddress.id);
                }
            } catch (error) {
                console.error('Error parsing current address:', error);
            }
        }
    }, []);

    const goBack = () => {
        navigate('/dashboard');
    };

    const handleAddressClick = (id) => {
        setSelectedAddress(id);
    };

    const handleApply = () => {
        if (selectedAddress) {
            const selectedAddressData = addresses.find(addr => addr.id === selectedAddress);
            if (selectedAddressData) {
                localStorage.setItem('currentAddress', JSON.stringify(selectedAddressData));
                navigate('/dashboard');
            }
        }
    };

    const handleEditAddress = (address) => {
        const addressWithUserId = {
            ...address,
            userId: userId
        };
        localStorage.setItem('editingAddress', JSON.stringify(addressWithUserId));
        navigate('/dashboard/addaddress');
    };

    const handleRefresh = () => {
        fetchUserAddresses();
    };

    return (
        <div className='w-full max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 relative'>
            <div className='flex items-center justify-between'>
                <button onClick={goBack}>
                    <img src={arrow} alt="Back" />
                </button>
                <h1 className='text-[24px] font-[600]'>Address</h1>
                <button className='mt-[6px]'>
                    <img className='w-[24px] h-[27px]' src={bell} alt="Notifications" />
                </button>
            </div>
            
            <hr className='mt-[24px] text-[#E6E6E6]' />
            
            <div className='flex justify-between items-center mt-[20px]'>
                <h2 className='text-[16px] font-[600]'>Saved Address</h2>
                {error && (
                    <button 
                        onClick={handleRefresh}
                        className='text-[14px] text-blue-500'
                    >
                        Refresh
                    </button>
                )}
            </div>
            
            {userId && (
                <div className="text-xs text-gray-500 mt-1 mb-2 text-center">
                    Account ID: {userId}
                </div>
            )}
            
            {isLoading ? (
                <div className='flex justify-center items-center h-[200px]'>
                    <p>Loading addresses...</p>
                </div>
            ) : error ? (
                <div className='text-red-500 mt-[12px]'>
                    <p>{error}</p>
                </div>
            ) : addresses.length === 0 ? (
                <div className='flex justify-center items-center h-[200px]'>
                    <p className='text-gray-500'>No addresses saved yet. Add your first address below.</p>
                </div>
            ) : (
                <div className='flex flex-col justify-center items-center gap-y-[12px] mt-[14px]'>
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className='w-full'
                        >
                            <div 
                                className={`flex py-[16px] px-[20px] border rounded-[10px] justify-start items-center cursor-pointer w-full ${selectedAddress === address.id ? 'border-[#1A1A1A] bg-[#F8F8F8]' : 'border-[#E6E6E6]'}`}
                                onClick={() => handleAddressClick(address.id)}
                            >
                                <img src={location} alt="Location" />
                                <div className='flex flex-col ml-[14px] justify-start flex-1'>
                                    <p className='text-[14px] font-[600]'>{address.nickname}</p>
                                    <p className='text-[12px] text-[#808080] truncate'>{address.fullAddress}</p>
                                    {address.neighborhood && address.neighborhood !== 'Выберите махаллю' && (
                                        <p className='text-[11px] text-[#A0A0A0]'>{address.neighborhood}</p>
                                    )}
                                </div>
                                <div className='flex items-center'>
                                    <button 
                                        className='mr-[10px] bg-[#F8F8F8] p-[5px] rounded-full'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditAddress(address);
                                        }}
                                    >
                                        <img src={mapIcon} alt="Edit" width="20" height="20" />
                                    </button>
                                    <input
                                        name='selectedAddress'
                                        type="radio"
                                        className='w-[20px] h-[20px]'
                                        checked={selectedAddress === address.id}
                                        onChange={() => handleAddressClick(address.id)}
                                        style={selectedAddress === address.id ? { accentColor: 'black' } : {}}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <NavLink to="/dashboard/addaddress" className="no-underline text-inherit">
                <button className='flex justify-center items-center w-full h-[54px] rounded-[10px] border border-[#CCCCCC] mt-[12px]'>
                    <img className='w-[18px] h-[18px]' src={plus} alt="Add Address" />
                    <span className='text-[#808080] text-[16px] font-[600] ml-[10px]'>Add new address</span>
                </button>
            </NavLink>
            
            {selectedAddress && (
                <div className="mt-4">
                    <button 
                        onClick={handleApply}
                        className="w-full py-3 bg-[#1A1A1A] text-white rounded-[10px]"
                    >
                        Apply Address
                    </button>
                </div>
            )}
        </div>
    );
}

export default AddressPage;
