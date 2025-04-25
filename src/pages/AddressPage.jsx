import React, { useState, useEffect } from 'react';
import arrow from '../assets/Arrow.png';
import bell from '../assets/Bell.png';
import plus from '../assets/Plus.png';
import location from '../assets/Location.png';
import { NavLink, useNavigate } from 'react-router-dom';

function AddressPage() {
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addresses, setAddresses] = useState([
        { id: 1, nickname: 'Home', fullAddress: '925 S Chugach St #APT 10, Alaska' },
        { id: 2, nickname: 'Work', fullAddress: '1100 E Street, Downtown, Alaska' }
    ]);
    
    const navigate = useNavigate();

    useEffect(() => {
        // Загружаем адреса из localStorage
        const savedAddresses = localStorage.getItem('savedAddresses');
        if (savedAddresses) {
            try {
                const parsedAddresses = JSON.parse(savedAddresses);
                if (Array.isArray(parsedAddresses)) {
                    setAddresses(prevAddresses => {
                        // Объединяем сохраненные адреса с существующими, избегая дублирования
                        const existingIds = new Set(prevAddresses.map(addr => addr.id));
                        const uniqueNewAddresses = parsedAddresses.filter(addr => !existingIds.has(addr.id));
                        return [...prevAddresses, ...uniqueNewAddresses];
                    });
                }
            } catch (error) {
                console.error('Error parsing saved addresses:', error);
            }
        }
        
        // Проверяем текущий выбранный адрес
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
            // Сохраняем выбранный адрес как текущий
            const selectedAddressData = addresses.find(addr => addr.id === selectedAddress);
            if (selectedAddressData) {
                localStorage.setItem('currentAddress', JSON.stringify(selectedAddressData));
                navigate('/dashboard'); // Или любая другая страница после выбора адреса
            }
        }
    };

    return (
        <div className='w-[390px] pt-[20px] px-[24px]'>
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
            <h2 className='text-[16px] font-[600] mt-[20px]'>Saved Address</h2>
            <div className='flex flex-col justify-center items-center gap-y-[12px] mt-[14px]'>
                {addresses.map((address) => (
                    <div
                        key={address.id}
                        className={`flex py-[16px] px-[20px] border rounded-[10px] justify-start items-center cursor-pointer w-full ${selectedAddress === address.id ? 'border-[#1A1A1A] bg-[#F8F8F8]' : 'border-[#E6E6E6]'}`}
                        onClick={() => handleAddressClick(address.id)}
                    >
                        <img src={location} alt="Location" />
                        <div className='flex flex-col ml-[14px] justify-start flex-1'>
                            <p className='text-[14px] font-[600]'>{address.nickname}</p>
                            <p className='text-[12px] text-[#808080] truncate'>{address.fullAddress}</p>
                        </div>
                        <input
                            name='selectedAddress'
                            type="radio"
                            className='w-[20px] h-[20px] ml-[8px]'
                            checked={selectedAddress === address.id}
                            onChange={() => handleAddressClick(address.id)}
                            style={selectedAddress === address.id ? { accentColor: 'black' } : {}}
                        />
                    </div>
                ))}
            </div>
            <NavLink to="/dashboard/addaddress" className="no-underline text-inherit">
                <button className='flex justify-center items-center w-full h-[54px] rounded-[10px] border border-[#CCCCCC] mt-[24px] gap-[10px]'>
                    <img src={plus} alt="Add" />
                    <p>Add New Address</p>
                </button>
            </NavLink>

            <button 
                onClick={handleApply}
                className={`flex justify-center items-center w-full h-[54px] rounded-[10px] mt-[16px] ${selectedAddress ? 'bg-[#1A1A1A]' : 'bg-[#CCCCCC]'}`}
                disabled={!selectedAddress}
            >
                <p className='text-white'>Apply</p>
            </button>
        </div>
    );
}

export default AddressPage; 