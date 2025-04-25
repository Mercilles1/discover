import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import bell from '../src/assets/Bell.png'
import favourite from '../src/assets/favourite.png'
import home from '../src/assets/homeNav.png'
import lupaNav from '../src/assets/lupaNav.png'
import favouriteNav from '../src/assets/favouriteNav.png'
import cart from '../src/assets/Cart.png'
import user from '../src/assets/user.png'

function Live() {
  const [favoriteProducts, setFavoriteProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const userStorage = localStorage.getItem('user')
    if (userStorage) {
      const parsedUser = JSON.parse(userStorage)
      setCurrentUser(parsedUser)
      
      fetchFavoriteItems(parsedUser.id)
    } else {
      setLoading(false)
      setError('User not logged in')
    }
  }, [])

  const fetchFavoriteItems = async (userId) => {
    try {
      const userResponse = await fetch(`https://marsgoup-1.onrender.com/api/users/${userId}`)
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data')
      }
      
      const userData = await userResponse.json()
      
      if (userData.favoriteItems && userData.favoriteItems.length > 0) {
        const productsResponse = await fetch('https://marsgoup-1.onrender.com/api/products')
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const products = await productsResponse.json()
        
        const favorites = products.filter(product => 
          userData.favoriteItems.includes(product.id)
        )
        
        setFavoriteProducts(favorites)
      } else {
        setFavoriteProducts([])
      }
      
      setLoading(false)
    } catch (error) {
      setError('Failed to fetch favorite items')
      setLoading(false)
      console.error('Fetch error:', error)
    }
  }

  const removeFromFavorites = async (productId) => {
    if (!currentUser) return
    
    try {
      const userResponse = await fetch(`https://marsgoup-1.onrender.com/api/users/${currentUser.id}`)
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data')
      }
      
      const userData = await userResponse.json()
      
      const updatedFavoriteItems = userData.favoriteItems.filter(id => id !== productId)
      
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
        throw new Error('Failed to update favorites')
      }
      
      setFavoriteProducts(prevProducts => 
        prevProducts.filter(product => product.id !== productId)
      )
    } catch (error) {
      console.error('Error removing from favorites:', error)
      setError('Failed to remove from favorites')
    }
  }

  if (loading) {
    return (
      <div className='w-[390px] px-[24px] pt-[12px]'>Loading saved items...</div>
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
        <h1 className='text-[32px] font-[600] text-[#1A1A1A]'>Saved Items</h1>
        <button className='mt-[6px]'>
          <img className='w-[24px] h-[27px]' src={bell} alt='Notifications' />
        </button>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className='mt-[48px] text-center'>
          <p className='text-[18px] text-[#808080]'>You don't have any saved items yet</p>
        </div>
      ) : (
        <div className='cards mb-[100px] mt-[24px] flex justify-center items-center flex-wrap gap-[19px]'>
          {favoriteProducts.map(product => (
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
                onClick={() => removeFromFavorites(product.id)}
                className='absolute rounded-[8px] right-[12px] top-[12px] bg-red-500 p-[8px]'
              >
                <img 
                  src={favourite} 
                  alt='Remove from favorites'
                  className='filter brightness-0 invert' 
                />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className='nav w-[390px] fixed left-1/2 transform -translate-x-1/2 bg-white border-t-[1px] border-[#E6E6E6] bottom-0 h-[86px] px-[24px]'>
        <ul className='flex mt-[16px] justify-between items-center'>
          <li>
            <NavLink
              to='/'
              className={({ isActive }) =>
                `flex flex-col justify-center items-center ${
                  isActive ? 'text-black' : ''
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
                `flex flex-col justify-center items-center ${
                  isActive ? 'text-black' : ''
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
                `flex flex-col justify-center items-center ${
                  isActive ? 'text-black' : ''
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
                `flex flex-col justify-center items-center ${
                  isActive ? 'text-black' : ''
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
                `flex flex-col justify-center items-center ${
                  isActive ? 'text-black' : ''
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

export default Live