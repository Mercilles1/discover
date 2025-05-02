import { useParams, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import back from '../assets/back.png';
import notification from '../assets/notification.png';
import shop from '../assets/shop.png';
import star from '../assets/star.png';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    (async()=> {
      try {
        const res = await fetch(`https://marsgoup-1.onrender.com/api/products/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const productData = Array.isArray(data) ? data[0] : data;
        setProduct(productData);
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0].size);
        }
      } catch {
        setError('Failed to fetch product');
      }
    })();
  },[id]);

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  const addToCart = () => {
    if (!product || !selectedSize) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingItemIndex = cart.findIndex(
      item => item.productId === product._id && item.size === selectedSize
    );

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        productId: product._id,
        name: product.title,
        price: product.price,
        image: product.img,
        size: selectedSize,
        quantity: 1
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setAddedToCart(true);
    
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  if (error) return <div className="px-[24px] pt-[12px] text-red-500">{error}</div>;
  if (!product) return <div className="px-[24px] pt-[12px]">Loading...</div>;

  return (
    <div className="mx-auto w-full max-w-[390px] mt-[12px] pb-[100px]">
      <div className="px-[24px]">
        <div className="flex justify-between items-center">
          <NavLink to="/"><img src={back} alt="Back" className="w-[24px] h-[24px]"/></NavLink>
          <p className="text-[24px] font-semibold">Details</p>
          <NavLink to="/cart">
            <img src={notification} alt="Notif" className="w-[24px] h-[24px]"/>
          </NavLink>
        </div>
        <img src={product.img || 'https://via.placeholder.com/341x368'} alt={product.title}
             className="w-full max-w-[341px] h-[368px] rounded-[10px] mt-[20px] mx-auto"/>
        <h2 className="text-[24px] font-semibold mt-[12px]">{product.title}</h2>
        <p className="flex items-center gap-1 mt-[15px]">
          <img src={star} alt="Star" className="w-[19px]"/>{product.rating || 'No rating'}
        </p>
        <p className="text-[#808080] mt-[13px]">{product.about}</p>
        <h3 className="text-[20px] font-semibold mt-[12px]" style={{WebkitTextStroke:'0.2px #E6E6E6'}}>Choose size</h3>
        <ul className="flex gap-[10px] mt-[12px]">
          {product.sizes && product.sizes.map(s => (
            <li 
              key={s.id || s.size} 
              className={`w-[50px] h-[47px] border flex justify-center items-center rounded-[10px] cursor-pointer ${
                selectedSize === s.size ? 'bg-black text-white' : ''
              }`}
              onClick={() => handleSizeSelection(s.size)}
            >
              {s.size}
            </li>
          ))}
        </ul>
      </div>
      <hr className="bg-[#E6E6E6] w-full h-[1px] mt-[12px]"/>
      <div className="px-[24px] flex justify-between items-center mt-[12px]">
        <div>
          <p className="text-[#808080]">Price</p>
          <p className="text-[24px] font-semibold">$ {product.price}</p>
        </div>
        <button 
          className={`flex items-center justify-center gap-[10px] ${
            addedToCart ? 'bg-green-600' : 'bg-black'
          } text-white w-[240px] h-[54px] rounded-[10px] transition-colors`}
          onClick={addToCart}
          disabled={!selectedSize}
        >
          <img src={shop} alt="Cart" className="w-[24px] h-[24px]"/>
          {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
        </button>
      </div>
      {!selectedSize && (
        <p className="text-red-500 text-center mt-2">Please select a size first</p>
      )}
    </div>
  );
}

export default ProductDetail;