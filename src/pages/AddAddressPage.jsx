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
    const mapRef = useRef(null);
    const formRef = useRef(null);
    const containerRef = useRef(null);
    const navigate = useNavigate();

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

    useEffect(() => {
        // Загружаем Яндекс Карты API только один раз
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

        // Добавляем слушатель для закрытия формы при клике вне неё
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target) && 
                mapRef.current && !mapRef.current.contains(event.target)) {
                expandForm(true);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Обновляем размер карты при изменении состояния формы
    useEffect(() => {
        updateMapSize();
    }, [isFormExpanded]);

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
                    // Центр Ташкента
                    const tashkentCoords = [41.2995, 69.2401];
                    
                    const map = new window.ymaps.Map('map', {
                        center: tashkentCoords,
                        zoom: 12,
                        controls: ['zoomControl', 'searchControl']
                    });

                    // Создаем маркер
                    const newMarker = new window.ymaps.Placemark(tashkentCoords, {
                        hintContent: 'Выберите адрес'
                    }, {
                        draggable: true
                    });

                    // Обработчик перетаскивания маркера
                    newMarker.events.add('dragend', function () {
                        const coords = newMarker.geometry.getCoordinates();
                        updateAddressByCoords(coords);
                    });

                    // Обработчик клика по карте
                    map.events.add('click', function (e) {
                        const coords = e.get('coords');
                        newMarker.geometry.setCoordinates(coords);
                        updateAddressByCoords(coords);
                        expandForm(true);
                    });

                    map.geoObjects.add(newMarker);
                    setMapInstance(map);
                    setMarker(newMarker);

                    // Создаем поисковый контрол
                    const searchControl = map.controls.get('searchControl');
                    searchControl.events.add('resultselect', function (e) {
                        const results = searchControl.getResultsArray();
                        const selected = searchControl.getSelectedIndex();
                        const coords = results[selected].geometry.getCoordinates();
                        
                        newMarker.geometry.setCoordinates(coords);
                        
                        // Получаем адрес и устанавливаем в поле
                        results[selected].getAddress().then((address) => {
                            setAddress(address);
                            expandForm(true);
                        });
                    });
                }
            });
        }
    };

    // Получаем адрес по координатам
    const updateAddressByCoords = (coords) => {
        if (window.ymaps) {
            window.ymaps.geocode(coords).then(res => {
                const firstResult = res.geoObjects.get(0);
                if (firstResult) {
                    const fullAddress = firstResult.getAddressLine();
                    setAddress(fullAddress);
                }
            });
        }
    };

    // Поиск координат по адресу
    const searchByAddress = () => {
        if (mapInstance && address) {
            window.ymaps.geocode(address).then(res => {
                const firstResult = res.geoObjects.get(0);
                if (firstResult) {
                    const coords = firstResult.geometry.getCoordinates();
                    marker.geometry.setCoordinates(coords);
                    mapInstance.setCenter(coords, 16);
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

    // Добавление адреса
    const handleAddAddress = () => {
        // Получаем текущие адреса из localStorage
        let savedAddresses = [];
        const savedAddressesStr = localStorage.getItem('savedAddresses');
        
        if (savedAddressesStr) {
            try {
                savedAddresses = JSON.parse(savedAddressesStr);
            } catch (error) {
                console.error('Error parsing saved addresses:', error);
            }
        }
        
        // Создаем новый адрес
        const newAddress = {
            id: Date.now(), // Используем timestamp как идентификатор
            nickname: nickname,
            fullAddress: address,
            neighborhood: selectedNeighborhood,
            // Добавляем координаты, если они нужны
            coords: marker ? marker.geometry.getCoordinates() : null
        };
        
        // Добавляем новый адрес в массив
        savedAddresses.push(newAddress);
        
        // Сохраняем обновленный массив в localStorage
        localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));
        
        console.log('Adding address:', newAddress);
        
        // После сохранения возвращаемся на страницу адресов
        navigate('/dashboard/address');
    };

    return (
        <div className='w-[390px] relative h-screen overflow-hidden' ref={containerRef}>
            <div className='flex items-center justify-between px-[24px] pt-[20px]'>
                <button onClick={goBack}>
                    <img src={arrow} alt="Back" />
                </button>
                <h1 className='text-[24px] font-[600]'>New Address</h1>
                <button className='mt-[6px]'>
                    <img className='w-[24px] h-[27px]' src={bell} alt="Notifications" />
                </button>
            </div>
            
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
                    className='w-full h-[54px] bg-black text-white rounded-[10px] mt-[20px] mb-[20px]'
                    onClick={handleAddAddress}
                >
                    Add
                </button>
            </div>
        </div>
    );
}

export default AddAddressPage;