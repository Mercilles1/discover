import React, { useState } from 'react';

const IconBell = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
  </svg>
);

const IconChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"></path>
  </svg>
);

const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

const IconHeart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
  </svg>
);

const IconShoppingCart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1"></circle>
    <circle cx="19" cy="21" r="1"></circle>
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
  </svg>
);

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const IconTag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
    <path d="M7 7h.01"></path>
  </svg>
);

const IconWallet = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
  </svg>
);

const IconGift = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12v10H4V12"></path>
    <path d="M2 7h20v5H2z"></path>
    <path d="M12 22V7"></path>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
  </svg>
);

const IconCreditCard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2"></rect>
    <line x1="2" x2="22" y1="10" y2="10"></line>
  </svg>
);


export default function NotificationScreen() {
    const [activeTab, setActiveTab] = useState('home');
    const [currentScreen, setCurrentScreen] = useState('notifications');
    const [readNotifications, setReadNotifications] = useState([]);
    
    const markAsRead = (id) => {
      if (!readNotifications.includes(id)) {
        setReadNotifications([...readNotifications, id]);
      }
    };
    
    const handleBackClick = () => {
      setCurrentScreen('home');
      setActiveTab('home');
    };
    
    const notifications = [
      {
        id: 1,
        group: 'Today',
        icon: <IconTag />,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        title: '30% Special Discount!',
        description: 'Special promotion only valid today'
      },
      {
        id: 2,
        group: 'Yesterday',
        icon: <IconWallet />,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        title: 'Top Up E-wallet Successfully!',
        description: 'You have top up your e-wallet'
      },
      {
        id: 3,
        group: 'Yesterday',
        icon: <IconGift />,
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        title: 'New Service Available!',
        description: 'New feature that you can try in next times'
      },
      {
        id: 4,
        group: 'June 7, 2023',
        icon: <IconCreditCard />,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        title: 'Credit Card Connected!',
        description: 'Credit card has been linked'
      },
      {
        id: 5,
        group: 'June 7, 2023',
        icon: <IconUser />,
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-600',
        title: 'Account Setup Successful!',
        description: 'Your account has been created'
      }
    ];
    
    const groupedNotifications = notifications.reduce((groups, notification) => {
      if (!groups[notification.group]) {
        groups[notification.group] = [];
      }
      groups[notification.group].push(notification);
      return groups;
    }, {});
    
    const HomeScreen = () => (
      <div className="flex-1 flex flex-col items-center justify-center bg-white">
        <div className="text-blue-500 mb-4">
          <IconHome className="w-16 h-16" />
        </div>
        <h2 className="text-xl font-bold mb-4">Home Screen</h2>
        <p className="text-gray-500 text-center px-4">
          This is the home screen. You navigated here from the notifications screen.
        </p>
        <button 
          className="mt-8 bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={() => {
            setCurrentScreen('notifications');
          }}
        >
          Back to Notifications
        </button>
      </div>
    );
    
    const NotificationsScreen = () => (
      <>
        <div className="flex justify-between items-center p-3 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button 
              className="hover:bg-gray-100 p-1 rounded-full"
              onClick={handleBackClick}
            >
              <IconChevronLeft />
            </button>
            <h1 className="text-lg font-semibold">Notifications</h1>
          </div>
          <button className="hover:bg-gray-100 p-1 rounded-full">
            <IconBell />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto">
          {Object.entries(groupedNotifications).map(([group, items]) => (
            <div key={group} className="px-3 pt-3">
              <p className="text-sm font-medium text-gray-500">{group}</p>
              
              {items.map(notification => (
                <div 
                  key={notification.id}
                  className={`mt-2 bg-white rounded-lg p-3 shadow-sm flex items-start gap-3 ${
                    readNotifications.includes(notification.id) ? 'opacity-60' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={`p-2 ${notification.iconBg} rounded-full flex-shrink-0`}>
                    <div className={notification.iconColor}>{notification.icon}</div>
                  </div>
                  <div>

                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-gray-500">{notification.description}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div className="h-20"></div> 
      </div>
    </>
  );
  
  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-gray-50 overflow-hidden">
      <div className="flex justify-between items-center p-2 text-xs bg-white">
        <div>9:41</div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 18" />
              <path d="M10 14L18 14" />
              <path d="M14 10L18 10" />
              <path d="M17 6L18 6" />
            </svg>
          </div>
          <div className="w-4 h-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 22L22 22" />
              <path d="M17 2C18.6569 2 20 3.34315 20 5V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V5C4 3.34315 5.34315 2 7 2H17Z" />
            </svg>
          </div>
        </div>
      </div>
      
      {currentScreen === 'notifications' ? <NotificationsScreen /> : <HomeScreen />}
      
      <div className="flex justify-between items-center px-4 py-2 bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0">
        <button 
          className="flex flex-col items-center" 
          onClick={() => {
            setActiveTab('home');
            setCurrentScreen('home');
          }}
        >
          <div className={activeTab === 'home' ? "text-blue-500" : "text-gray-400"}>
            <IconHome />
          </div>
          <span className={`text-xs mt-1 ${activeTab === 'home' ? "text-blue-500" : "text-gray-400"}`}>
            Home
          </span>
        </button>
        
        <button 
          className="flex flex-col items-center"
          onClick={() => setActiveTab('search')}
        >
          <div className={activeTab === 'search' ? "text-blue-500" : "text-gray-400"}>
            <IconSearch />
          </div>
          <span className={`text-xs mt-1 ${activeTab === 'search' ? "text-blue-500" : "text-gray-400"}`}>
            Search
          </span>
        </button>
        
        <button 
          className="flex flex-col items-center"
          onClick={() => setActiveTab('saved')}
        >
          <div className={activeTab === 'saved' ? "text-blue-500" : "text-gray-400"}>
            <IconHeart />
          </div>
          <span className={`text-xs mt-1 ${activeTab === 'saved' ? "text-blue-500" : "text-gray-400"}`}>
            Saved
          </span>
        </button>
        
        <button 
          className="flex flex-col items-center"
          onClick={() => setActiveTab('cart')}
        >
          <div className={activeTab === 'cart' ? "text-blue-500" : "text-gray-400"}>
            <IconShoppingCart />
          </div>
          <span className={`text-xs mt-1 ${activeTab === 'cart' ? "text-blue-500" : "text-gray-400"}`}>
            Cart
          </span>
        </button>
        
        <button 
          className="flex flex-col items-center"
          onClick={() => setActiveTab('profile')}
        >
          <div className={activeTab === 'profile' ? "text-blue-500" : "text-gray-400"}>
            <IconUser />
          </div>
          <span className={`text-xs mt-1 ${activeTab === 'profile' ? "text-blue-500" : "text-gray-400"}`}>
            Profile
          </span>
        </button>
      </div>
    </div>
  );
}
  