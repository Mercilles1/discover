import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import arrow from '../assets/Arrow.png';
import bell from '../assets/Bell.png';
import korzin from '../assets/Vector (4).png';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load cart data from localStorage and fetch product details if needed
  useEffect(() => {
    const loadCartData = async () => {
      try {
        setLoading(true);
        // Get cart items from localStorage
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        
        if (savedCart.length === 0) {
          setCartProducts([]);
          setLoading(false);
          return;
        }
        
        // If cart items contain all necessary product details, use them directly
        if (savedCart[0]?.name && savedCart[0]?.price && savedCart[0]?.image) {
          const formattedCart = savedCart.map(item => ({
            id: item.productId,
            title: item.name,
            price: item.price,
            img: item.image,
            selectedSize: item.size,
            quantity: item.quantity
          }));
          setCartProducts(formattedCart);
        } else {
          // Otherwise fetch products from API to get full details
          try {
            const response = await fetch('https://marsgoup-1.onrender.com/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            
            const allProducts = await response.json();
            
            // Map cart items to full product details
            const updatedCart = savedCart.map(item => {
              const product = allProducts.find(p => 
                (p.id === item.productId) || (p._id === item.productId)
              );
              
              return product
                ? { 
                    ...product, 
                    id: product.id || product._id,
                    selectedSize: item.size, 
                    quantity: item.quantity 
                  }
                : null;
            }).filter(Boolean);
            
            setCartProducts(updatedCart);
          } catch (error) {
            console.error("Error loading products:", error);
            // Fallback to just displaying what we have in cart
            const formattedCart = savedCart.map(item => ({
              id: item.productId,
              title: item.name || `Product ${item.productId}`,
              price: item.price || 0,
              img: item.image || '',
              selectedSize: item.size,
              quantity: item.quantity
            }));
            setCartProducts(formattedCart);
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        setCartProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadCartData();
  }, []);

  const updateQuantity = (productId, delta) => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updated = savedCart.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    localStorage.setItem("cart", JSON.stringify(updated));
    reloadCartProducts();
  };

  const removeItem = (productId) => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updated = savedCart.filter(item => item.productId !== productId);
    localStorage.setItem("cart", JSON.stringify(updated));
    reloadCartProducts();
  };

  const reloadCartProducts = async () => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (savedCart.length === 0) {
      setCartProducts([]);
      return;
    }
    
    // If cart items contain full product details
    if (savedCart[0]?.name && savedCart[0]?.price && savedCart[0]?.image) {
      const formattedCart = savedCart.map(item => ({
        id: item.productId,
        title: item.name,
        price: item.price,
        img: item.image,
        selectedSize: item.size,
        quantity: item.quantity
      }));
      setCartProducts(formattedCart);
      return;
    }
    
    // Otherwise fetch from API
    try {
      const response = await fetch('https://marsgoup-1.onrender.com/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const allProducts = await response.json();
      
      const updatedCart = savedCart.map(item => {
        const product = allProducts.find(p => 
          (p.id === item.productId) || (p._id === item.productId)
        );
        
        return product
          ? { 
              ...product, 
              id: product.id || product._id,
              selectedSize: item.size, 
              quantity: item.quantity 
            }
          : null;
      }).filter(Boolean);
      
      setCartProducts(updatedCart);
    } catch (error) {
      console.error("Error reloading products:", error);
      // Fallback
      const formattedCart = savedCart.map(item => ({
        id: item.productId,
        title: item.name || `Product ${item.productId}`,
        price: item.price || 0,
        img: item.image || '',
        selectedSize: item.size,
        quantity: item.quantity
      }));
      setCartProducts(formattedCart);
    }
  };

  const subtotal = cartProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = cartProducts.length > 0 ? 80 : 0;
  const total = subtotal + shipping;

  return (
    <div className="flex flex-col h-screen bg-white w-[390px] mx-auto mb-[20px]">
      <div className="px-4 py-4 border-b text-center text-lg font-semibold flex items-center justify-between gap-[16px]">
        <img onClick={() => navigate("/")} src={arrow} alt="" className="cursor-pointer" />
        <p>My cart</p>
        <img onClick={() => navigate("/dashboard/notifications")} src={bell} alt="" className="cursor-pointer" />
      </div>

      <div className="flex-1 overflow-auto px-4 py-2">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <p>Loading cart...</p>
          </div>
        ) : cartProducts.length === 0 ? (
          <div className="flex flex-col items-center mt-[228px] ml-[61px]">
            <img src={korzin} alt="" />
            <p className='text-[#1A1A1A] text-[20px] font-[600]'>Your Cart Is Empty!</p>
            <p className='text-center text-[16px] font-[400] text-[#808080] w-[248px]'>When you add products, they'll appear here.</p>
          </div>
        ) : (
          cartProducts.map(product => (
            <div key={product.id} className="bg-white border rounded-xl p-4 mb-4 shadow-sm flex">
              <div className="w-20 h-20 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                <img 
                  src={product.img} 
                  alt={product.title} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/80';
                  }}
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-base font-medium">{product.title}</h2>
                    <button onClick={() => removeItem(product.id)} className="text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Size {product.selectedSize}</p>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <p className="font-semibold text-sm">${product.price.toLocaleString()}</p>
                  <div className="flex items-center border rounded-md">
                    <button onClick={() => updateQuantity(product.id, -1)} className="px-3 py-1 text-xl">−</button>
                    <span className="px-3">{product.quantity}</span>
                    <button onClick={() => updateQuantity(product.id, 1)} className="px-3 py-1 text-xl">+</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-white border-t mb-[80px]">
        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <span>Sub-total</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <span>VAT (%)</span>
          <span>$ 0.00</span>
        </div>
        <div className="flex justify-between mb-4 text-sm text-gray-600">
          <span>Shipping fee</span>
          <span>$ {shipping}</span>
        </div>
        <div className="flex justify-between mb-6 text-base font-semibold">
          <span>Total</span>
          <span>$ {total.toLocaleString()}</span>
        </div>
        <button 
          className="bg-black text-white w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center"
          disabled={cartProducts.length === 0}
        >
          <span className="mr-2">Go To Checkout</span>
          <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}