import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import bell from '../assets/Bell.png'
import lupa from '../assets/lupa.png'
import micro from '../assets/Mic.png'
import filter from '../assets/Filter.png'
import favourite from '../assets/favourite.png'
import home from '../assets/homeNav.png'
import lupaNav from '../assets/lupaNav.png'
import favouriteNav from '../assets/favouriteNav.png'
import cart from '../assets/Cart.png'
import user from '../assets/user.png'
import FilterModal from '../components/FilterModal'

function Dashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    // Fetch products first
    fetchProducts()

    // Get current user from localStorage
    const userStorage = localStorage.getItem('user')
    if (userStorage) {
      try {
        const parsedUser = JSON.parse(userStorage)
        setCurrentUser(parsedUser)

        // Fetch user's favorite items only if we have a valid user
        // Use _id from MongoDB instead of id
        if (parsedUser && (parsedUser._id || parsedUser.id)) {
          const userId = parsedUser._id || parsedUser.id
          fetchUserFavorites(userId)
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error)
        // Clear invalid user data from localStorage
        localStorage.removeItem('user')
      }
    }
  }, [])

  const fetchUserFavorites = async (userId) => {
    if (!userId) return

    try {
      const response = await fetch(`https://marsgoup-1.onrender.com/api/users/${userId}`)

      // Check if response was successful
      if (!response.ok) {
        // If user not found (404), just set empty favorites and don't show error
        if (response.status === 404) {
          console.warn(`User with ID ${userId} not found. Using empty favorites.`)
          setFavorites([])
          return
        }
        throw new Error(`Failed to fetch user data: ${response.status}`)
      }

      const userData = await response.json()
      if (userData && userData.favoriteItems) {
        setFavorites(userData.favoriteItems)
      } else {
        // Initialize with empty array if favoriteItems is not present
        setFavorites([])
      }
    } catch (error) {
      console.error('Error fetching user favorites:', error)
      // Don't stop the app from working if favorites can't be fetched
      setFavorites([])
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://marsgoup-1.onrender.com/api/products')
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`)
      }
      const data = await response.json()
      setProducts(data)
      setLoading(false)
    } catch (error) {
      setError('Failed to fetch products')
      setLoading(false)
      console.error('Fetch error:', error)
    }
  }

  const toggleFavorite = async (productId) => {
    if (!currentUser || !currentUser.id) {
      // If no user is logged in, prompt to log in instead of failing silently
      alert('Please log in to save favorites')
      return
    }

    try {
      // Get the latest user data
      const userResponse = await fetch(`https://marsgoup-1.onrender.com/api/users/${currentUser.id}`)

      // If user not found on server, handle gracefully
      if (userResponse.status === 404) {
        console.warn('User not found on server. Unable to save favorites.')
        return
      }

      if (!userResponse.ok) {
        throw new Error(`Failed to fetch user data: ${userResponse.status}`)
      }

      const userData = await userResponse.json()
      let updatedFavoriteItems = [...(userData.favoriteItems || [])]

      // Check if product is already a favorite
      const isFavorite = updatedFavoriteItems.includes(productId)

      if (isFavorite) {
        // Remove from favorites
        updatedFavoriteItems = updatedFavoriteItems.filter(id => id !== productId)
      } else {
        // Add to favorites
        updatedFavoriteItems.push(productId)
      }

      // Update user on the server
      const updateResponse = await fetch(`https://marsgoup-1.onrender.com/api/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          favoriteItems: updatedFavoriteItems
        })
      })

      if (!updateResponse.ok) {
        throw new Error(`Failed to update favorites: ${updateResponse.status}`)
      }

      // Update local state
      setFavorites(updatedFavoriteItems)
    } catch (error) {
      console.error('Error toggling favorite:', error)
      // Update UI optimistically even if server update fails
      const newFavorites = favorites.includes(productId)
        ? favorites.filter(id => id !== productId)
        : [...favorites, productId]
      setFavorites(newFavorites)
    }
  }

  const filterProductsByCategory = (category) => {
    setActiveCategory(category)
  }

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(product => product.categories === activeCategory)

  if (loading) {
    return (
      <div className='w-[390px] px-[24px] pt-[12px]'>Loading products...</div>
    )
  }

  if (error) {
    return (
      <div className='w-[390px] px-[24px] pt-[12px] text-red-500'>{error}</div>
    )
  }

  return (
    <div className='w-[390px] relative px-[24px] pt-[12px]'>
      <div className='flex justify-between items-center'>
        <h1 className='text-[32px] font-[600] text-[#1A1A1A]'>Discover</h1>
        <button className='mt-[6px]'>
          <img className='w-[24px] h-[27px]' src={bell} alt='Notifications' />
        </button>
      </div>

      <div className='flex justify-between mt-[16px] items-center'>
        <div className='flex justify-center items-center px-[20px] py-[14px] rounded-[10px] border-[1px] border-[#E6E6E6]'>
          <img className='mr-[12px]' src={lupa} alt='Search' />
          <input
            className='w-[181px] h-[22px] outline-none text-[16px] font-[400] placeholder:text-[#999999]'
            placeholder='Search for clothes...'
            type='text'
          />
          <img src={micro} alt='Microphone' />
        </div>
        <button className='w-[52px] h-[52px] bg-[#1A1A1A] flex justify-center items-center rounded-[10px]'>
          <img src={filter} alt='Filter' />
        </button>
      </div>

      <div className='sort mt-[16px] flex justify-center items-center gap-[8px]'>
        <button
          className={`px-[20px] py-[7px] border-[1px] ${activeCategory === 'All' ? 'bg-black text-white' : 'border-[#E6E6E6] hover:bg-black hover:text-white'} flex justify-center items-center rounded-[10px]`}
          onClick={() => filterProductsByCategory('All')}
        >
          All
        </button>
        <button
          className={`px-[20px] py-[7px] border-[1px] ${activeCategory === 'T-shirt' ? 'bg-black text-white' : 'border-[#E6E6E6] hover:bg-black hover:text-white'} flex justify-center items-center rounded-[10px]`}
          onClick={() => filterProductsByCategory('T-shirt')}
        >
          Tshirts
        </button>
        <button
          className={`px-[20px] py-[7px] border-[1px] ${activeCategory === 'Jeans' ? 'bg-black text-white' : 'border-[#E6E6E6] hover:bg-black hover:text-white'} flex justify-center items-center rounded-[10px]`}
          onClick={() => filterProductsByCategory('Jeans')}
        >
          Jeans
        </button>
        <button
          className={`px-[20px] py-[7px] border-[1px] ${activeCategory === 'Shoes' ? 'bg-black text-white' : 'border-[#E6E6E6] hover:bg-black hover:text-white'} flex justify-center items-center rounded-[10px]`}
          onClick={() => filterProductsByCategory('Shoes')}
        >
          Shoes
        </button>
      </div>

      <div className='cards mb-[100px] mt-[24px] flex justify-center items-center flex-wrap gap-[19px]'>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div
              key={product.id}
              className='card relative flex flex-col justify-start'
            >
              <img
                src={product.img || 'https://via.placeholder.com/150'}
                alt={product.title}
                className='w-[150px] h-[150px] object-cover'
              />
              <h2 className='mt-[8px] mb-[3px] text-[16px] font-[600]'>
                {product.title}
              </h2>
              <p className='text-[12px] font-[500] text-[#808080]'>
                $ {product.price}
              </p>
              <button
                onClick={() => toggleFavorite(product.id)}
                className={`absolute rounded-[8px] right-[12px] top-[12px] ${favorites.includes(product.id) ? 'bg-red-500' : 'bg-white'
                  } p-[8px]`}
              >
                <img
                  src={favourite}
                  alt='Favorite'
                  className={favorites.includes(product.id) ? 'filter brightness-0 invert' : ''}
                />
              </button>
            </div>
          ))
        ) : (
          <div className="w-full text-center py-8 text-gray-500">
            No products found in this category.
          </div>
        )}
      </div>

      <div className='nav w-[390px] fixed left-1/2 transform -translate-x-1/2 bg-white border-t-[1px] border-[#E6E6E6] bottom-0 h-[86px] px-[24px]'>
        <ul className='flex mt-[16px] justify-between items-center'>
          <li>
            <NavLink
              to='/'
              className={({ isActive }) =>
                `flex flex-col justify-center items-center ${isActive ? 'text-black' : ''
                }`
              }
            >
              <img src={home} alt='Home' />
              <p className='text-[12px] font-[500] text-[#999999]'>Home</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/search'
              className={({ isActive }) =>
                `flex flex-col justify-center items-center ${isActive ? 'text-black' : ''
                }`
              }
            >
              <img src={lupaNav} alt='Search' />
              <p className='text-[12px] font-[500] text-[#999999]'>Search</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/saved'
              className={({ isActive }) =>
                `flex flex-col justify-center items-center ${isActive ? 'text-black' : ''
                }`
              }
            >
              <img src={favouriteNav} alt='Saved' />
              <p className='text-[12px] font-[500] text-[#999999]'>Saved</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/cart'
              className={({ isActive }) =>
                `flex flex-col justify-center items-center ${isActive ? 'text-black' : ''
                }`
              }
            >
              <img src={cart} alt='Cart' />
              <p className='text-[12px] font-[500] text-[#999999]'>Cart</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/account'
              className={({ isActive }) =>
                `flex flex-col justify-center items-center ${isActive ? 'text-black' : ''
                }`
              }
            >
              <img src={user} alt='Account' />
              <p className='text-[12px] font-[500] text-[#999999]'>Account</p>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Dashboard