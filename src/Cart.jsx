import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export default function Cart() {
  const [cartProducts, setCartProducts] = useState([]);

  const allProducts = [
    { id: 1, title: "Regular Fit Slogan", price: 1190, img: "/img1.jpg" },
    { id: 2, title: "Regular Fit Polo", price: 1100, img: "/img2.jpg" },
    { id: 3, title: "Regular Fit Black", price: 1290, img: "/img3.jpg" }
  ];

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = savedCart.map(item => {
      const product = allProducts.find(p => p.id === item.productId);
      return product
        ? { ...product, selectedSize: item.size, quantity: item.quantity }
        : null;
    }).filter(Boolean);
    setCartProducts(updatedCart);
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

  const reloadCartProducts = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = savedCart.map(item => {
      const product = allProducts.find(p => p.id === item.productId);
      return product
        ? { ...product, selectedSize: item.size, quantity: item.quantity }
        : null;
    }).filter(Boolean);
    setCartProducts(updatedCart);
  };

  const subtotal = cartProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 80;
  const total = subtotal + shipping;

  return (
    <div className="flex flex-col h-screen bg-white w-[390px] mx-auto">
      <div className="px-4 py-4 border-b text-center text-lg font-semibold">My Cart</div>

      <div className="flex-1 overflow-auto px-4 py-2">
        {cartProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Your cart is empty</div>
        ) : (
          cartProducts.map(product => (
            <div key={product.id} className="bg-white border rounded-xl p-4 mb-4 shadow-sm flex">
              <div className="w-20 h-20 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                <img src={product.img} alt={product.title} className="w-full h-full object-cover" />
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

      <div className="p-4 bg-white border-t">
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
        <button className="bg-black text-white w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center">
          <span className="mr-2">Go To Checkout</span>
          <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
