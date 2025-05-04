import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import back from '../assets/back.png';
import notification from '../assets/notification.png';

const Payment = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCard, setSelectedCard] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // This will run when the component mounts or when returning from the NewCard page
        fetchUserCards();
    }, [location]); // Re-run when location changes (when returning from NewCard)

    // Function to fetch user cards directly from API
    const fetchUserCards = async () => {
        try {
            // Get user identification from localStorage
            const currentUser = JSON.parse(localStorage.getItem('user'));
            
            if (!currentUser) {
                throw new Error('User not found in local storage');
            }
            
            console.log("Current user from localStorage:", currentUser);
            
            // Get regular id (not _id) because the API seems to only work with the regular id
            const userId = currentUser.id;
            if (!userId) {
                throw new Error('User ID not found');
            }
            
            console.log("Using user ID for API request:", userId);
            
            // First try getting all users and find our user
            const allUsersResponse = await fetch('https://marsgoup-1.onrender.com/api/users');
            
            if (!allUsersResponse.ok) {
                throw new Error(`Failed to fetch users: ${allUsersResponse.status}`);
            }
            
            const allUsers = await allUsersResponse.json();
            console.log("Found total users:", allUsers.length);
            
            // Find our user by id
            const apiUser = allUsers.find(user => user.id === userId);
            
            if (!apiUser) {
                throw new Error('User not found in API');
            }
            
            console.log("Found user in API:", apiUser);
            
            // Update user in localStorage WITHOUT credit card information
            const userForLocalStorage = {
                ...apiUser,
                creditCard: [] // Empty the credit card array for localStorage
            };
            
            localStorage.setItem('user', JSON.stringify(userForLocalStorage));
            
            // Process cards from API data
            processCards(apiUser);
            
        } catch (err) {
            console.error('Error loading cards:', err);
            setError('Failed to load your cards. Please try again.');
            setLoading(false);
        }
    };
    
    // Process the cards from user data
    const processCards = (userData) => {
        try {
            let processedCards = [];
            
            // Check what exactly is in the creditCard field
            console.log("creditCard field type:", typeof userData.creditCard);
            console.log("creditCard field value:", userData.creditCard);
            
            if (userData.creditCard && Array.isArray(userData.creditCard)) {
                // Process object cards
                const objectCards = userData.creditCard.filter(card => 
                    card && typeof card === 'object' && card !== null
                );
                
                console.log("Filtered object cards:", objectCards);
                processedCards = [...objectCards];
                
                // Process any string cards that might be JSON
                const stringCards = userData.creditCard.filter(card => 
                    typeof card === 'string' && 
                    card.trim() !== '' && 
                    card.trim().startsWith('{')
                );
                
                console.log("String cards that might be JSON:", stringCards);
                
                stringCards.forEach(cardString => {
                    try {
                        const parsedCard = JSON.parse(cardString);
                        if (parsedCard && typeof parsedCard === 'object') {
                            processedCards.push(parsedCard);
                        }
                    } catch (e) {
                        console.error('Error parsing card string:', e);
                    }
                });
            }
            
            console.log("Final processed cards:", processedCards);
            setCards(processedCards);
            
            // Select the first card by default if available
            if (processedCards.length > 0) {
                setSelectedCard(0);
            }
            
            setLoading(false);
        } catch (error) {
            console.error("Error processing cards:", error);
            setError('Error processing card data');
            setLoading(false);
        }
    };

    // Get the last 4 digits of a card number
    const getLast4Digits = (cardNumber) => {
        if (!cardNumber) return '0000';
        
        // Handle different formats safely
        let cleaned = '0000';
        
        if (typeof cardNumber === 'string') {
            cleaned = cardNumber.replace(/\s/g, '');
            return cleaned.slice(-4);
        } else if (typeof cardNumber === 'number') {
            return cardNumber.toString().slice(-4);
        }
        
        return cleaned.slice(-4);
    };

    return (
        <div className='px-[24px] mt-[12px]'>
            <div className="flex justify-between items-center gap-[50px]">
                <NavLink to="/dashboard"><img src={back} alt="Back" className="w-[24px] h-[24px]" /></NavLink>
                <p className="text-[24px] font-semibold">Payment Method</p>
                <img src={notification} alt="Notif" className="w-[24px] h-[24px]" />
            </div>
            <hr className='bg-[#E6E6E6] text-[#E6E6E6] mt-[24px]' />

            <p className='font-[general sans] font-semibold text-[16px] text-[#1A1A1A] mt-[20px]'>Saved Cards</p>
            
            {loading ? (
                <p className='mt-[12px] text-gray-500'>Loading your cards...</p>
            ) : error ? (
                <p className='mt-[12px] text-red-500'>{error}</p>
            ) : cards.length > 0 ? (
                <div className='mt-[12px] space-y-4'>
                    {cards.map((card, index) => (
                        <div key={index} className='flex items-center justify-between'>
                            <div 
                                className="flex items-center justify-between w-full max-w-[341px] h-[52px] bg-white border border-[#E6E6E6] rounded-[10px] px-[20px]"
                                onClick={() => setSelectedCard(index)}
                            >
                                <div className="flex items-center gap-[10px]">
                                    <img 
                                        src={card.img || 'https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg'} 
                                        alt="Card" 
                                        className="w-[24px] h-[24px]" 
                                    />
                                    <p className="tracking-wider font-medium">
                                        **** **** **** {card.number ? getLast4Digits(card.number) : '****'}
                                    </p>
                                </div>
                                <input 
                                    type="radio" 
                                    name="cards" 
                                    checked={selectedCard === index}
                                    onChange={() => setSelectedCard(index)}
                                    className="w-[20px] h-[20px] accent-black" 
                                />
                            </div>
                        </div>
                    ))}
                    
                    <div className='mt-[24px]'>
                        <NavLink to='/dashboard/newcard'>
                            <button className='w-full max-w-[341px] h-[54px] bg-transparent border-[1px] border-[#CCCCCC] font-[general sans] font-medium text-[16px] text-[#1A1A1A] rounded-[10px]'>
                                + Add New Card
                            </button>
                        </NavLink>
                    </div>
                </div>
            ) : (
                <div className='mt-[12px] flex flex-col items-start'>
                    <p className='text-gray-500 text-[16px] mb-[24px]'>You don't have any cards yet</p>
                    <NavLink to='/dashboard/newcard'>
                        <button className='w-full max-w-[341px] h-[54px] bg-transparent border-[1px] border-[#CCCCCC] font-[general sans] font-medium text-[16px] text-[#1A1A1A] rounded-[10px]'>
                            + Add New Card
                        </button>
                    </NavLink>
                </div>
            )}
        </div>
    );
};

export default Payment;