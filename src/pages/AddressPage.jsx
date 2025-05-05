import React, { useState, useEffect, useRef } from 'react';
import arrow from '../assets/Arrow.png';
import bell from '../assets/Bell.png';
import plus from '../assets/Plus.png';
import location from '../assets/Location.png';
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
    const DEFAULT_COORDS = [41.2995, 69.2401]; // Default Tashkent coordinates

    // Coordinates validation functions
    const validateCoordinates = (coords) => {
        // Coordinates must be an array
        if (!Array.isArray(coords)) {
            console.error('Coordinates are not an array:', coords);
            return false;
        }
        // Coordinates must have exactly 2 elements
        if (coords.length !== 2) {
            console.error('Coordinates don\'t have exactly 2 elements:', coords);
            return false;
        }
        // Both elements must be numbers
        if (typeof coords[0] !== 'number' || typeof coords[1] !== 'number') {
            console.error('Coordinates contain non-numeric values:', coords);
            return false;
        }
        // Latitude must be between -90 and 90
        if (coords[0] < -90 || coords[0] > 90) {
            console.error('Latitude out of range:', coords[0]);
            return false;
        }
        // Longitude must be between -180 and 180
        if (coords[1] < -180 || coords[1] > 180) {
            console.error('Longitude out of range:', coords[1]);
            return false;
        }
        return true;
    };

    // Parse coordinates safely
    const parseCoordinates = (coordsData) => {
        try {
            // If it's already an array, just validate it
            if (Array.isArray(coordsData)) {
                if (validateCoordinates(coordsData)) {
                    return coordsData;
                } else {
                    return DEFAULT_COORDS; // Default coordinates
                }
            }
            // If it's a string, try to parse it
            if (typeof coordsData === 'string') {
                try {
                    const parsed = JSON.parse(coordsData);
                    if (validateCoordinates(parsed)) {
                        return parsed;
                    }
                } catch (e) {
                    console.error('Error parsing coordinates string:', e);
                }
            }
            // Default fallback
            return DEFAULT_COORDS;
        } catch (error) {
            console.error('Error processing coordinates:', error);
            return DEFAULT_COORDS;
        }
    };

    // Function to log address data for debugging
    const debugAddressData = (addr) => {
        console.group('Address Data:');
        console.log('ID:', addr.id);
        console.log('Nickname:', addr.nickname);
        console.log('Full Address:', addr.fullAddress);
        console.log('Neighborhood:', addr.neighborhood);
        console.log('Coordinates:', addr.coords);
        console.log('Coordinates Valid:', validateCoordinates(addr.coords));
        console.groupEnd();
    };

    // Improved function to get current user ID from various storage locations
    const getCurrentUserId = () => {
        // First try to get the user directly from localStorage
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                console.log('User from localStorage:', parsedUser);
                
                // For scientific notation ID format
                if (parsedUser && parsedUser.id) {
                    return parsedUser.id;
                }
                // As a fallback, try _id format
                if (parsedUser && parsedUser._id) {
                    return parsedUser._id;
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
        
        // Check all possible localStorage keys that might contain user information
        const possibleUserKeys = ['userData', 'user', 'currentUser', 'auth', 'authUser'];
        
        for (const key of possibleUserKeys) {
            const storedData = localStorage.getItem(key);
            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);
                    if (parsedData) {
                        // Check different possible properties that might contain the ID
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
        
        // If still not found, use a hardcoded default ID for the specific scientific notation ID
        console.log("User ID not found in localStorage, using the scientific notation ID");
        return "1.711036938972329e+23";
    };

    // Fetch user addresses from API
    const fetchUserAddresses = async () => {
        setIsLoading(true);
        setError(null);
        
        // Get current user ID
        const currentUserId = getCurrentUserId();
        setUserId(currentUserId);
        
        console.log("Current user ID:", currentUserId);
        
        try {
            // Encode the ID properly for URL
            const encodedId = encodeURIComponent(currentUserId);
            const url = `${API_BASE_URL}/users/${encodedId}`;
            console.log("API URL:", url);
            
            // Fetch user data from API using the encoded ID
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error fetching user data: ${response.status}`);
            }
            
            const userData = await response.json();
            console.log("User data retrieved:", userData);
            
            // Check if locations array exists and has items
            if (userData && userData.locations && Array.isArray(userData.locations)) {
                // Make sure locations are properly formatted
                const formattedLocations = userData.locations.map(loc => {
                    // Log each location's coordinates for debugging
                    console.log(`Location ${loc.id} coords:`, loc.coords);
                    
                    // Create a clone to avoid mutating the original object
                    const formattedLoc = { ...loc };
                    
                    // Make sure the coordinates are properly defined
                    if (!formattedLoc.coords) {
                        console.warn(`Location ${formattedLoc.id} is missing coordinates`);
                        formattedLoc.coords = DEFAULT_COORDS;
                    } else if (Array.isArray(formattedLoc.coords) && formattedLoc.coords.length === 2) {
                        // Coordinates are already in the correct format
                        console.log(`Location ${formattedLoc.id} has valid coordinates format`);
                        
                        // Ensure coordinates are numbers, not strings
                        if (typeof formattedLoc.coords[0] === 'string' || typeof formattedLoc.coords[1] === 'string') {
                            formattedLoc.coords = [
                                parseFloat(formattedLoc.coords[0]),
                                parseFloat(formattedLoc.coords[1])
                            ];
                        }
                    } else if (typeof formattedLoc.coords === 'string') {
                        try {
                            // Try to parse if it's a string
                            console.log(`Location ${formattedLoc.id} has string coordinates, attempting to parse`);
                            formattedLoc.coords = parseCoordinates(formattedLoc.coords);
                        } catch (error) {
                            console.error(`Failed to parse coordinates for location ${formattedLoc.id}:`, error);
                            formattedLoc.coords = DEFAULT_COORDS;
                        }
                    }
                    
                    // Final validation check
                    if (!validateCoordinates(formattedLoc.coords)) {
                        console.warn(`Location ${formattedLoc.id} has invalid coordinates, using default`);
                        formattedLoc.coords = DEFAULT_COORDS;
                    }
                    
                    return formattedLoc;
                });
                
                // Filter locations to only include those belonging to the current user
                const userLocations = formattedLocations.filter(loc => 
                    !loc.userId || loc.userId === currentUserId
                );
                
                setAddresses(userLocations);
                console.log("Addresses loaded:", userLocations.length);
                
                // If there are addresses but none selected, select the first one
                if (userLocations.length > 0 && !selectedAddress) {
                    setSelectedAddress(userLocations[0].id);
                }
                
                // Update the user object in localStorage with the formatted locations
                try {
                    const localUserString = localStorage.getItem('user');
                    if (localUserString) {
                        const localUser = JSON.parse(localUserString);
                        localUser.locations = userLocations;
                        localStorage.setItem('user', JSON.stringify(localUser));
                        console.log('Updated user in localStorage with formatted locations');
                    }
                    
                    // Also update savedAddresses in localStorage
                    localStorage.setItem('savedAddresses', JSON.stringify(userLocations));
                } catch (error) {
                    console.error('Error updating user in localStorage:', error);
                }
            } else {
                console.log("No locations found in user data, checking localStorage");
                // If no locations in API response, try to get from localStorage as fallback
                const savedAddresses = localStorage.getItem('savedAddresses');
                if (savedAddresses) {
                    try {
                        const parsedAddresses = JSON.parse(savedAddresses);
                        // Format and validate all addresses
                        const formattedAddresses = parsedAddresses.map(addr => {
                            const formattedAddr = { ...addr };
                            if (formattedAddr.coords) {
                                formattedAddr.coords = parseCoordinates(formattedAddr.coords);
                            } else {
                                formattedAddr.coords = DEFAULT_COORDS;
                            }
                            return formattedAddr;
                        });
                        
                        // Filter addresses to only include those belonging to the current user
                        const userAddresses = formattedAddresses.filter(addr => 
                            !addr.userId || addr.userId === currentUserId
                        );
                        
                        if (Array.isArray(userAddresses) && userAddresses.length > 0) {
                            console.log("Addresses loaded from localStorage:", userAddresses.length);
                            setAddresses(userAddresses);
                            
                            // If there are addresses but none selected, select the first one
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
            
            // Try to load from localStorage as fallback
            const savedAddresses = localStorage.getItem('savedAddresses');
            if (savedAddresses) {
                try {
                    const parsedAddresses = JSON.parse(savedAddresses);
                    // Format and validate all addresses
                    const formattedAddresses = parsedAddresses.map(addr => {
                        const formattedAddr = { ...addr };
                        if (formattedAddr.coords) {
                            formattedAddr.coords = parseCoordinates(formattedAddr.coords);
                        } else {
                            formattedAddr.coords = DEFAULT_COORDS;
                        }
                        return formattedAddr;
                    });
                    
                    // Filter addresses to only include those belonging to the current user
                    const userAddresses = formattedAddresses.filter(addr => 
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
        // Load addresses from API when component mounts
        fetchUserAddresses();
        
        // Check for current selected address in localStorage
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
            // Save selected address as current
            const selectedAddressData = addresses.find(addr => addr.id === selectedAddress);
            if (selectedAddressData) {
                // Ensure coordinates are properly formatted
                const formattedAddress = { ...selectedAddressData };
                if (formattedAddress.coords) {
                    formattedAddress.coords = parseCoordinates(formattedAddress.coords);
                }
                
                console.log('Saving selected address to localStorage:', formattedAddress);
                localStorage.setItem('currentAddress', JSON.stringify(formattedAddress));
                navigate('/dashboard');
            }
        }
    };

    const handleEditAddress = (address) => {
        // Create a deep copy of the address object
        const addressCopy = JSON.parse(JSON.stringify(address));
        
        // Ensure coordinates are properly formatted
        if (addressCopy.coords) {
            addressCopy.coords = parseCoordinates(addressCopy.coords);
        }
        
        // Save the address to edit in localStorage along with the current user ID
        const addressWithUserId = {
            ...addressCopy,
            userId: userId
        };
        
        // Debug the address data before saving to localStorage
        debugAddressData(addressWithUserId);
        
        localStorage.setItem('editingAddress', JSON.stringify(addressWithUserId));
        
        // Navigate to the add address page
        navigate('/dashboard/addaddress');
    };

    const handleRefresh = () => {
        fetchUserAddresses();
    };
    
    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm('Are you sure you want to delete this address?')) {
            return;
        }
        
        try {
            // First, update local state to remove the address
            const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
            setAddresses(updatedAddresses);
            
            // If the deleted address was selected, reset selection
            if (selectedAddress === addressId) {
                setSelectedAddress(updatedAddresses.length > 0 ? updatedAddresses[0].id : null);
            }
            
            // Update addresses in localStorage
            localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
            
            // Update user object in localStorage
            const localUserString = localStorage.getItem('user');
            if (localUserString) {
                const localUser = JSON.parse(localUserString);
                if (localUser && Array.isArray(localUser.locations)) {
                    localUser.locations = localUser.locations.filter(loc => loc.id !== addressId);
                    localStorage.setItem('user', JSON.stringify(localUser));
                }
            }
            
            // Try to delete from API
            const currentUserId = userId || getCurrentUserId();
            if (currentUserId) {
                const encodedId = encodeURIComponent(currentUserId);
                const url = `${API_BASE_URL}/users/${encodedId}/locations/${addressId}`;
                
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    console.warn(`API delete failed with status ${response.status}, but address was removed locally`);
                }
            }
            
            console.log(`Address ${addressId} deleted successfully`);
        } catch (error) {
            console.error('Error deleting address:', error);
            // Even if API delete fails, we still want UI to update
            // so we don't roll back the local changes
        }
    };

    return (
        <div className='w-[390px] pt-[20px] px-[24px] relative'>
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
                                        className='mr-[5px] bg-[#F8F8F8] p-[5px] rounded-full'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditAddress(address);
                                        }}
                                        title="Edit address"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56261 21.8978 5.10218 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                    <button 
                                        className='mr-[10px] bg-[#fff0f0] p-[5px] rounded-full'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteAddress(address.id);
                                        }}
                                        title="Delete address"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 6H5H21" stroke="#FF3333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#FF3333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
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
                <button className='flex justify-center items-center w-full h-[54px] rounded-[10px] border border-[#CCCCCC] mt-[24px] gap-[10px]'>
                    <img src={plus} alt="Add" />
                    <p>Add New Address</p>
                </button>
            </NavLink>

            <button 
                onClick={handleApply}
                className={`flex justify-center items-center mb-[100px] w-full h-[54px] rounded-[10px] mt-[16px] ${selectedAddress ? 'bg-[#1A1A1A]' : 'bg-[#CCCCCC]'}`}
                disabled={!selectedAddress}
            >
                <p className='text-white'>Apply</p>
            </button>
        </div>
    );
}

export default AddressPage;