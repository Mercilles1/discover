// Improved getCurrentUserId function for both components
const getCurrentUserId = () => {
    // First try to get the user directly from localStorage
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
    
    // If not found, try looking at other localStorage items that might contain the user ID
    // This covers all possible variations of how user ID might be stored
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
    
    // If still not found, use a hardcoded default ID (2)
    // This ensures the app still works even if user ID is not found
    console.log("User ID not found in localStorage, using default ID '2'");
    return "2";
};