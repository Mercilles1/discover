import { useParams, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import back from '../assets/back.png';
import notification from '../assets/notification.png';
import shop from '../assets/shop.png';
import star from '../assets/star.png';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError]       = useState(null);

  useEffect(() => {
    (async()=> {
      try {
        const res = await fetch(`https://marsgoup-1.onrender.com/api/products/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProduct(Array.isArray(data)?data[0]:data);
      } catch {
        setError('Failed to fetch product');
      }
    })();
  },[id]);

  if (error) return <div className="px-[24px] pt-[12px] text-red-500">{error}</div>;
  if (!product) return <div className="px-[24px] pt-[12px]">Loading...</div>;

  return (
    <div className="mx-auto w-full max-w-[390px] mt-[12px] pb-[100px]">
      <div className="px-[24px]">
        <div className="flex justify-between items-center">
          <NavLink to="/"><img src={back} alt="Back" className="w-[24px] h-[24px]"/></NavLink>
          <p className="text-[24px] font-semibold">Details</p>
          <img src={notification} alt="Notif" className="w-[24px] h-[24px]"/>
        </div>
        <img src={product.img||'https://via.placeholder.com/341x368'} alt={product.title}
             className="w-full max-w-[341px] h-[368px] rounded-[10px] mt-[20px] mx-auto"/>
        <h2 className="text-[24px] font-semibold mt-[12px]">{product.title}</h2>
        <p className="flex items-center gap-1 mt-[15px]">
          <img src={star} alt="Star" className="w-[19px]"/>{product.rating||'No rating'}
        </p>
        <p className="text-[#808080] mt-[13px]">{product.about}</p>
        <h3 className="text-[20px] font-semibold mt-[12px]" style={{WebkitTextStroke:'0.2px #E6E6E6'}}>Choose size</h3>
        <ul className="flex gap-[10px] mt-[12px]">
          {product.sizes.map(s=>(
            <li key={s.id} className="w-[50px] h-[47px] border flex justify-center items-center rounded-[10px]">
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
        <button className="flex items-center justify-center gap-[10px] bg-black text-white w-[240px] h-[54px] rounded-[10px]">
          <img src={shop} alt="Cart" className="w-[24px] h-[24px]"/>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
