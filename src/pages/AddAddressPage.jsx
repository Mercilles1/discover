import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import arrow from '../assets/Arrow.png';
import bell from '../assets/Bell.png';
import cancel from '../assets/canceladdress.png';

function AddAddressPage() {
    const [isFormExpanded, setIsFormExpanded] = useState(false);
    const [address, setAddress] = useState('');
    const [nickname, setNickname] = useState('home');
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('Выберите махаллю');
    const [mapInstance, setMapInstance] = useState(null);
    const [marker, setMarker] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [currentCoords, setCurrentCoords] = useState(null);
    const mapRef = useRef(null);
    const formRef = useRef(null);
    const containerRef = useRef(null);
    const navigate = useNavigate();
    
    // Constants
    const API_BASE_URL = 'https://marsgoup-1.onrender.com/api';
    // Default Tashkent coordinates
    const DEFAULT_COORDS = [41.2995, 69.2401];

    // Список махаллей (районов)
    const neighborhoods = [
        'Выберите махаллю',
        'Чиланзар',
        'Юнусабад',
        'Мирзо-Улугбекский',
        'Яккасарайский',
        'Шайхантаурский',
        'Алмазарский',
        'Мирабадский',
        'Учтепинский',
        'Сергелийский',
        'Бектемирский',
        'Яшнабадский'
    ];

    // Coordinates validation functions embedded directly
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

    // Function to get user ID from localStorage with any format
    const getUserIdFromStorage = () => {
        try {
            const userString = localStorage.getItem('user');
            if (!userString) {
                console.warn('No user found in localStorage');
                return null;
            }

            const user = JSON.parse(userString);
            console.log('User data from localStorage:', user);

            // Only use scientific notation id field
            if (user.id) {
                console.log('Using scientific notation id:', user.id);
                return user.id;
            } else {
                console.warn('No id field found in user object');
                return null;
            }
        } catch (error) {
            console.error('Error getting user ID from localStorage:', error);
            return null;
        }
    };

    useEffect(() => {
        // Get the user ID - only use scientific notation ID
        const storedUserId = getUserIdFromStorage();
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            console.error('Scientific notation ID not found. Please log in again.');
            alert('User information not found. Please log in again.');
            navigate('/login');
            return;
        }

        // Check if we're editing an existing address
        const editingAddress = localStorage.getItem('editingAddress');
        if (editingAddress) {
            try {
                const parsedAddress = JSON.parse(editingAddress);
                if (parsedAddress) {
                    console.log('Editing existing address:', parsedAddress);
                    setIsEditing(true);
                    setEditingAddressId(parsedAddress.id);
                    setAddress(parsedAddress.fullAddress || '');
                    setNickname(parsedAddress.nickname || 'home');
                    setSelectedNeighborhood(parsedAddress.neighborhood || 'Выберите махаллю');
                    
                    // Parse and set coordinates if available
                    if (parsedAddress.coords) {
                        const parsedCoords = parseCoordinates(parsedAddress.coords);
                        console.log('Parsed coordinates for editing:', parsedCoords);
                        setCurrentCoords(parsedCoords);
                    }
                    
                    // Debug the address
                    debugAddressData(parsedAddress);
                    
                    localStorage.removeItem('editingAddress'); // Clear after loading
                }
            } catch (error) {
                console.error('Error parsing editing address:', error);
            }
        }

        // Load Yandex Maps API if not already loaded
        if (!window.ymaps) {
            const loadYandexMaps = () => {
                const script = document.createElement('script');
                script.src = 'https://api-maps.yandex.ru/2.1/?apikey=ваш_api_ключ&lang=ru_RU';
                script.async = true;
                script.onload = initMap;
                document.body.appendChild(script);
            };
            loadYandexMaps();
        } else {
            initMap();
        }

        // Add click outside listener
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target) && 
                mapRef.current && !mapRef.current.contains(event.target)) {
                expandForm(true);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [navigate]);

    // Update map size when form expands/collapses
    useEffect(() => {
        updateMapSize();
    }, [isFormExpanded]);

    // Update map when currentCoords changes
    useEffect(() => {
        if (mapInstance && marker && currentCoords && validateCoordinates(currentCoords)) {
            console.log('Setting marker to coordinates:', currentCoords);
            marker.geometry.setCoordinates(currentCoords);
            mapInstance.setCenter(currentCoords, 16);
        }
    }, [mapInstance, marker, currentCoords]);

    // Функция обновления размера карты
    const updateMapSize = () => {
        if (mapInstance) {
            const mapHeight = isFormExpanded ? 300 : 500;
            if (mapRef.current) {
                mapRef.current.style.height = `${mapHeight}px`;
            }
            setTimeout(() => {
                mapInstance.container.fitToViewport();
            }, 300); // После анимации
        }
    };

    // Инициализация карты
    const initMap = () => {
        if (window.ymaps) {
            window.ymaps.ready(() => {
                // Проверяем, инициализирована ли уже карта
                if (mapRef.current && !mapRef.current.querySelector('.ymaps-2-1-79-map')) {
                    console.log('Initializing Yandex Map');
                    
                    // Determine initial coordinates
                    let initialCoords;
                    
                    // If we have current coordinates (from editing), use those
                    if (currentCoords && validateCoordinates(currentCoords)) {
                        initialCoords = currentCoords;
                        console.log('Using existing coordinates for map initialization:', initialCoords);
                    } else {
                        // Otherwise use default Tashkent coordinates
                        initialCoords = DEFAULT_COORDS;
                        console.log('Using default coordinates for map initialization:', initialCoords);
                    }
                    
                    const map = new window.ymaps.Map('map', {
                        center: initialCoords,
                        zoom: 15,
                        controls: ['zoomControl', 'searchControl']
                    });

                    // Create marker
                    const newMarker = new window.ymaps.Placemark(initialCoords, {
                        hintContent: 'Выберите адрес'
                    }, {
                        draggable: true
                    });

                    // Marker drag handler
                    newMarker.events.add('dragend', function () {
                        const coords = newMarker.geometry.getCoordinates();
                        console.log('Marker dragged to coordinates:', coords);
                        if (validateCoordinates(coords)) {
                            setCurrentCoords(coords);
                            updateAddressByCoords(coords);
                        } else {
                            console.error('Invalid coordinates from marker drag:', coords);
                        }
                    });

                    // Map click handler
                    map.events.add('click', function (e) {
                        const coords = e.get('coords');
                        console.log('Map clicked at coordinates:', coords);
                        if (validateCoordinates(coords)) {
                            newMarker.geometry.setCoordinates(coords);
                            setCurrentCoords(coords);
                            updateAddressByCoords(coords);
                            expandForm(true);
                        } else {
                            console.error('Invalid coordinates from map click:', coords);
                        }
                    });

                    map.geoObjects.add(newMarker);
                    setMapInstance(map);
                    setMarker(newMarker);

                    // Set up search control
                    const searchControl = map.controls.get('searchControl');
                    searchControl.events.add('resultselect', function (e) {
                        const results = searchControl.getResultsArray();
                        const selected = searchControl.getSelectedIndex();
                        const coords = results[selected].geometry.getCoordinates();
                        console.log('Search result selected with coordinates:', coords);
                        
                        if (validateCoordinates(coords)) {
                            newMarker.geometry.setCoordinates(coords);
                            setCurrentCoords(coords);
                            
                            // Get address from search result
                            results[selected].getAddress().then((address) => {
                                setAddress(address);
                                expandForm(true);
                            });
                        } else {
                            console.error('Invalid coordinates from search result:', coords);
                        }
                    });

                    // Expand form if editing
                    if (isEditing) {
                        expandForm(true);
                    }
                }
            });
        }
    };

    // Get address from coordinates
    const updateAddressByCoords = (coords) => {
        if (window.ymaps && validateCoordinates(coords)) {
            window.ymaps.geocode(coords).then(res => {
                const firstResult = res.geoObjects.get(0);
                if (firstResult) {
                    const fullAddress = firstResult.getAddressLine();
                    setAddress(fullAddress);
                }
            });
        }
    };

    // Search for coordinates by address
    const searchByAddress = () => {
        if (mapInstance && address) {
            window.ymaps.geocode(address).then(res => {
                const firstResult = res.geoObjects.get(0);
                if (firstResult) {
                    const coords = firstResult.geometry.getCoordinates();
                    console.log('Found coordinates for address:', coords);
                    
                    if (validateCoordinates(coords)) {
                        marker.geometry.setCoordinates(coords);
                        mapInstance.setCenter(coords, 16);
                        setCurrentCoords(coords);
                    } else {
                        console.error('Invalid coordinates from geocode result:', coords);
                    }
                }
            });
        }
    };

    // Переключение состояния формы (свернута/развернута)
    const expandForm = (expand) => {
        setIsFormExpanded(expand);
    };

    const toggleForm = () => {
        setIsFormExpanded(!isFormExpanded);
    };

    // Обработчик изменения адреса
    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    // При потере фокуса в поле адреса, ищем его на карте
    const handleAddressBlur = () => {
        searchByAddress();
    };

    const goBack = () => {
        navigate('/dashboard/address');
    };

    // Save or update address
    const handleSaveAddress = async () => {
        if (!userId) {
            alert('User ID not found. Please log in again.');
            navigate('/login');
            return;
        }

        // Reset error
        setError(null);
        
        // Validate form
        if (!address || address.trim() === '') {
            setError('Please enter a valid address');
            return;
        }
        
        if (selectedNeighborhood === 'Выберите махаллю') {
            setError('Please select a neighborhood');
            return;
        }

        // Validate coordinates
        if (!currentCoords || !validateCoordinates(currentCoords)) {
            setError('Please select a location on the map');
            return;
        }

        // Start loading
        setIsLoading(true);

        // Get user from localStorage to ensure we have full user data
        let userData;
        try {
            // Try to get the user data directly from localStorage first
            const userString = localStorage.getItem('user');
            if (userString) {
                userData = JSON.parse(userString);
                console.log('Using user data from localStorage:', userData);
            }
        } catch (error) {
            console.error('Error getting user data from localStorage:', error);
        }

        // If we couldn't get from localStorage, try to fetch from API
        if (!userData) {
            try {
                // Use the raw ID string directly in the URL without any processing
                // This preserves the exact scientific notation format including the decimal point
                console.log(`Attempting to fetch user with exact ID: "${userId}"`);
                
                // Encode the ID properly for URL
                const encodedId = encodeURIComponent(userId);
                const apiUrl = `${API_BASE_URL}/users/${encodedId}`;
                console.log('API URL:', apiUrl);
                
                const response = await fetch(apiUrl);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Error response: ${response.status} - ${errorText}`);
                    throw new Error(`User not found. Status: ${response.status}`);
                }
                
                userData = await response.json();
                console.log('Successfully retrieved user data from API:', userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError(`Failed to fetch user data: ${error.message}`);
                setIsLoading(false);
                return;
            }
        }
        
        // Create a copy of the locations array or initialize it if empty
        const updatedLocations = Array.isArray(userData.locations) 
            ? [...userData.locations] 
            : [];
        
        // Create the address object with properly formatted coordinates
        const addressData = {
            id: isEditing ? editingAddressId : Date.now(),
            nickname: nickname,
            fullAddress: address,
            neighborhood: selectedNeighborhood,
            coords: currentCoords,  // Store the coordinates as a direct array
            userId: userId // Use the original scientific notation ID here
        };
        
        // Log the coordinates to verify they're being captured correctly
        console.log('Map coordinates being saved:', addressData.coords);
        console.log('Coordinates valid:', validateCoordinates(addressData.coords));
        
        // Debug the complete address data
        debugAddressData(addressData);
        
        // Update or add the address
        if (isEditing) {
            const locationIndex = updatedLocations.findIndex(loc => 
                loc.id === editingAddressId
            );
            
            if (locationIndex !== -1) {
                updatedLocations[locationIndex] = addressData;
            } else {
                updatedLocations.push(addressData);
            }
        } else {
            updatedLocations.push(addressData);
        }
        
        // Create updated user object
        const updatedUserData = {
            ...userData,
            locations: updatedLocations
        };
        
        console.log('Sending updated user data:', updatedUserData);
        
        try {
            // Use the raw ID string directly in the URL without any processing
            // This preserves the exact scientific notation format including the decimal point
            const encodedId = encodeURIComponent(userId);
            const updateUrl = `${API_BASE_URL}/users/${encodedId}`;
            console.log('Update URL:', updateUrl);
            
            // Update user data in API
            const updateResponse = await fetch(updateUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUserData)
            });
            
            if (!updateResponse.ok) {
                const errorText = await updateResponse.text();
                console.error(`Error updating response: ${updateResponse.status} - ${errorText}`);
                throw new Error(`Error updating user data: ${updateResponse.status}`);
            }
            
            const updatedUser = await updateResponse.json();
            console.log('Address saved successfully!', updatedUser);
            
            // Check if the coordinates were saved correctly
            if (updatedUser.locations && updatedUser.locations.length > 0) {
                const savedLocation = isEditing 
                    ? updatedUser.locations.find(loc => loc.id === editingAddressId)
                    : updatedUser.locations[updatedUser.locations.length - 1];
                
                if (savedLocation) {
                    console.log('Saved location coords in API response:', savedLocation.coords);
                    console.log('Coordinates valid in response:', validateCoordinates(savedLocation.coords));
                }
            }
            
            // Save the updated addresses to localStorage as well
            localStorage.setItem('savedAddresses', JSON.stringify(updatedLocations));
            
            // Update the user object in localStorage with the new locations
            try {
                const localUserString = localStorage.getItem('user');
                if (localUserString) {
                    const localUser = JSON.parse(localUserString);
                    
                    // Update locations with properly formatted coordinates
                    localUser.locations = updatedLocations;
                    
                    // Make sure we keep using the scientific notation ID
                    if (!localUser.id && userId) {
                        localUser.id = userId;
                    }
                    
                    localStorage.setItem('user', JSON.stringify(localUser));
                    console.log('Updated user in localStorage with new locations');
                }
            } catch (error) {
                console.error('Error updating user in localStorage:', error);
            }
            
            // Navigate back to address page
            navigate('/dashboard/address');
            
        } catch (error) {
            console.error('Error saving address:', error);
            setError(`Failed to save address: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-[390px] relative h-screen overflow-hidden' ref={containerRef}>
            <div className='flex items-center justify-between px-[24px] pt-[20px]'>
                <button onClick={goBack}>
                    <img src={arrow} alt="Back" />
                </button>
                <h1 className='text-[24px] font-[600]'>{isEditing ? 'Edit Address' : 'New Address'}</h1>
                <button className='mt-[6px]'>
                    <img className='w-[24px] h-[27px]' src={bell} alt="Notifications" />
                </button>
            </div>
            
            {/* Debug Coordinates Display */}
            {currentCoords && validateCoordinates(currentCoords) && (
                <div className="text-xs text-green-600 mt-1 mb-1 text-center">
                    Current coords: [{currentCoords[0].toFixed(4)}, {currentCoords[1].toFixed(4)}]
                </div>
            )}
            
            {/* Яндекс Карта */}
            <div 
                id="map" 
                ref={mapRef}
                className='w-[390px] transition-all duration-300'
                style={{ 
                    height: isFormExpanded ? '300px' : '500px',
                    backgroundColor: '#f0f0f0' 
                }}
            ></div>
            
            {/* Форма адреса с анимацией */}
            <div 
                ref={formRef}
                className={`absolute left-0 right-0 bg-white rounded-t-[24px] shadow-lg transition-all duration-300 ease-in-out transform px-[24.5px] py-[20px] ${
                    isFormExpanded ? 'bottom-0 translate-y-0' : 'translate-y-[290px]'
                }`}
                style={{ 
                    zIndex: 100,
                    height: 'auto',
                    maxHeight: '90vh'
                }}
            >
                <div 
                    className='flex justify-between items-center cursor-pointer'
                    onClick={toggleForm}
                >
                    {/* Полоска для перетаскивания */}
                    <div className='w-[60px] h-[5px] bg-gray-300 rounded-full mx-auto absolute top-[10px] left-0 right-0'></div>
                    
                    <p className='text-[20px] font-[600] mt-[12px]'>Address</p>
                    <img src={cancel} alt="Cancel" onClick={(e) => {
                        e.stopPropagation();
                        goBack();
                    }} />
                </div>
                
                <hr className='w-full text-[#E6E6E6] my-[20px]' />
                
                {error && (
                    <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}
                
                <p className='text-[16px] font-[500]'>Address Nickname</p>
                <select 
                    className='w-full h-[52px] px-[20px] outline-none rounded-[10px] border border-[#E6E6E6] mt-[4px]'
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                </select>
                
                <p className='text-[16px] font-[500] mt-[16px]'>Neighborhood (Махалля)</p>
                <select 
                    className='w-full h-[52px] px-[20px] outline-none rounded-[10px] border border-[#E6E6E6] mt-[4px]'
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                >
                    {neighborhoods.map((neighborhood, index) => (
                        <option key={index} value={neighborhood}>
                            {neighborhood}
                        </option>
                    ))}
                </select>
                
                <p className='text-[16px] font-[500] mt-[16px]'>Full Address</p>
                <input 
                    className='w-full h-[52px] px-[20px] outline-none rounded-[10px] border border-[#E6E6E6] mt-[4px]'
                    placeholder="Enter your full address..."
                    value={address}
                    onChange={handleAddressChange}
                    onBlur={handleAddressBlur}
                />
                
                <button 
                    className='w-full h-[54px] bg-black text-white rounded-[10px] mt-[20px] mb-[20px] flex justify-center items-center'
                    onClick={handleSaveAddress}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="mr-2">Saving...</span>
                    ) : (
                        isEditing ? 'Update' : 'Add'
                    )}
                </button>
            </div>
        </div>
    );
}

export default AddAddressPage;