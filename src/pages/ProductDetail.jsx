import { NavLink, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import back from './assets/back.png';
import notification from './assets/notification.png';
import shop from './assets/shop.png';
import star from './assets/star.png';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`https://marsgoup-1.onrender.com/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) return <p>Загрузка...</p>;

  return (
    <div className='mt-[12px] relative'>
      <div className='px-[24px]'>
        <div className='flex justify-between items-center'>
          <NavLink to='/'>
            <img className='w-[24px] h-[24px]' src={back} alt="" />
          </NavLink>
          <p className='text-[24px] text-[#1A1A1A] font-semibold font-[general sans]'>Details</p>
          <img className='w-[24px] h-[24px]' src={notification} alt="" />
        </div>
        <div className='flex justify-center items-center mt-[20px]'>
          <img className='w-[341px] h-[368px] rounded-[10px]' src={product.img} alt='' />
        </div>
        <h2 className='text-[24px] font-semibold mt-[12px] font-[general sans]'>{product.title}</h2>
        <p className='font-[general sans] mt-[15px]'><img className='w-[19px]' src={star} alt="" />{product.rating}</p>
        <p className='text-[#808080] font-[general sans] mt-[13px]'>{product.about}</p>
        <h3 className='text-[20px] font-semibold text-black font-[general sans]' style={{
          WebkitTextStroke: '0.2px #E6E6E6',
          color: '#1A1A1A'
        }}>Choose size</h3>
        <ul className='flex gap-[10px] mt-[12px] font-[general sans]'>
          {product.sizes.map(size => (
            <li className='w-[50px] h-[47px] border-[1.35px] border-[#E6E6E6] flex justify-center items-center rounded-[10px]' key={size.id}>{size.size}</li>
          ))}
        </ul>
      </div>


      <hr className='text-[#E6E6E6] bg-[#E6E6E6] w-full h-[1px] mt-[12px]' />

      <div className='px-[24px] flex items-center justify-between mt-[12px]'>
        <div>
          <p className='text-[#808080] text-[16px] font-[general sans]'>Price</p>
          <p className='text-[#1A1A1A] text-[24px] font-semibold font-[general sans]'>$ {product.price}</p>
        </div>
        <div>
          <button className='text-white font-medium bg-[#1A1A1A] rounded-[10px] flex items-center w-[240px] h-[54px] justify-center gap-[10px]'><img className='w-[24px] h-[24px]' src={shop} alt="" />Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
