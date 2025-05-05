import { useState, useEffect } from 'react';
import { Trash2, ArrowLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCartData = async () => {
      try {
        setLoading(true);
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

        if (savedCart.length === 0) {
          setCartProducts([]);
          setLoading(false);
          return;
        }

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
            console.error("Error loading products:", error);
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-5xl mx-auto w-full px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">My Cart</h1>
          <button 
            onClick={() => navigate("/notes")} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : cartProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 20L3 20L3 4L21 4L21 15" />
                <path d="M9 8H17" />
                <path d="M9 12H17" />
                <circle cx="17" cy="19" r="2" />
                <circle cx="7" cy="19" r="2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Your Cart Is Empty!</h2>
            <p className="text-gray-500 max-w-sm">
              When you add products, they'll appear here. Continue shopping to find something you'll love.
            </p>
            <button 
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {cartProducts.map(product => (
              <div key={product.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex p-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden mr-4 flex-shrink-0 bg-gray-100">
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
                        <h2 className="text-base font-medium line-clamp-2">{product.title}</h2>
                        <button 
                          onClick={() => removeItem(product.id)} 
                          className="text-red-500 p-1 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Size: {product.selectedSize}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <p className="font-semibold">${product.price.toLocaleString()}</p>
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(product.id, -1)} 
                          className="px-3 py-1 hover:bg-gray-100 transition-colors"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 border-x">{product.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(product.id, 1)} 
                          className="px-3 py-1 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order summary */}
      {cartProducts.length > 0 && (
        <div className="sticky bottom-0 bg-white border-t shadow-lg">
          <div className="max-w-5xl mx-auto w-full px-4 py-4">
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>VAT (%)</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping fee</span>
                <span>${shipping}</span>
              </div>
              <div className="pt-2 border-t flex justify-between font-medium">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
            <button
              className="bg-black text-white w-full py-3 rounded-xl font-medium flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <span className="mr-2">Go To Checkout</span>
              <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}