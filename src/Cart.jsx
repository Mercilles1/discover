import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export default function Cart() {
  const [cartProducts, setCartProducts] = useState([]);
  
  const allProducts = [
    { id: 1, title: "Product 1", price: 25.99, img: "/path/to/img1.jpg" },
    { id: 2, title: "Product 2", price: 45.50, img: "/path/to/img2.jpg" },
    { id: 3, title: "Product 3", price: 30.00, img: "/path/to/img3.jpg" }
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
    <div className="flex flex-col h-screen bg-gray-50 w-[390px]">
      <div className="flex-1 overflow-auto p-4">
        {cartProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          cartProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg p-4 mb-4 flex">
              <div className="w-16 h-16 bg-gray-200 rounded mr-4 flex-shrink-0">
                {product.img && (
                  <img src={product.img} alt={product.title} className="w-full h-full object-cover rounded" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h2 className="font-medium text-base">{product.title}</h2>
                  <button onClick={() => removeItem(product.id)} className="text-red-500">
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-gray-500 text-sm">Size {product.selectedSize}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="font-semibold">${product.price.toFixed(2)}</p>
                  <div className="flex items-center border rounded">
                    <button className="px-3 py-1" onClick={() => updateQuantity(product.id, -1)}>−</button>
                    <span className="px-3">{product.quantity}</span>
                    <button className="px-3 py-1" onClick={() => updateQuantity(product.id, 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-white">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Sub-total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">VAT (%)</span>
          <span>$ 0.00</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600">Shipping fee</span>
          <span>$ {shipping}</span>
        </div>
        <div className="flex justify-between mb-6 font-bold">
          <span>Total</span>
          <span>$ {total.toFixed(2)}</span>
        </div>
        <button className="bg-black text-white w-full py-3 rounded-lg flex items-center justify-center">
          <span className="mr-2">Go To Checkout</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
