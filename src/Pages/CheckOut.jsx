import React from "react";
import { Link } from "react-router-dom";

const CheckOut = () => {
  const arrowLeftIconUrl =
    "https://static-00.iconduck.com/assets.00/arrow-left-icon-2048x2048-s5o4hxo0.png";
  const notificationBellIconUrl =
    "https://media.lordicon.com/icons/system/solid/46-notification-bell.svg";
  const homeIconUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPOix3iVe9_NY2ZWByuVUoROYQ8EL3cLk0RdQKzjymdK1dma7iXw-0Aekz-shemT63l9U&usqp=CAU";
  const creditCardIconUrl =
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fimages%2Fplastic-credit-card-icon-white-icon-on-black-background-inversion%2F198916092&psig=AOvVaw2tE-4WYwdFBXvof8Xk1qKd&ust=1744991936220000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCPi8n9a334wDFQAAAAAdAAAAABAE";
  const cashIconUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTXaOITWqnf8fuuebyU26oku_Z1YGZh8fF_Q&s";

  return (
    <div className=" flex flex-col items-center w-[390px] px-6">
      <div className=" flex justify-between items-center w-[100%] mt-3">
        <img className=" flex w-6" src={arrowLeftIconUrl} alt="Orqaga" />
        <p className=" text-2xl font-semibold">Checkout</p>
        <img
          className=" flex w-7"
          src={notificationBellIconUrl}
          alt="Bildirishnoma"
        />
      </div>
      <hr className=" mt-6 w-[340px]" />
      <div className=" flex justify-between w-[100%] mt-5">
        <p className=" font-semibold text-base">Delivery Address</p>
        <Link to="/checkout" className=" font-medium underline">
          Change
        </Link>
      </div>
      <div className=" w-[100%] flex justify-start gap-2 mt-4 items-start">
        <img className=" w-6" src={homeIconUrl} alt="Uy ikonkasi" />
        <div className=" flex flex-col gap-1">
          <p className=" font-semibold">Home</p>
          <p className=" text-[#808080]">
            925 S Chugach St #APT 10, Alaska 99645
          </p>
        </div>
      </div>
      <hr className=" mt-5 w-[340px]" />
      <div className=" flex justify-start mt-5 w-[100%]">
        <p className=" flex font-semibold text-base">Payment Method</p>
      </div>
      <div className=" flex justify-between w-[100%] mt-4">
        <button className=" bg-black text-white w-[110px] h-[35px] rounded-[10px] font-medium flex items-center justify-center gap-1.5">
          <img className=" w-6" src={creditCardIconUrl} alt="Karta" />
          Card
        </button>
        <button className=" w-[110px] h-[35px] border border-[#E6E6E6] font-medium rounded-[10px] items-center justify-center flex gap-1.5">
          <img className=" flex w-6" src={cashIconUrl} alt="" />
          Cash
        </button>
        <button className=" w-[110px] h-[35px] border border-[#E6E6E6] font-medium rounded-[10px] gap-1.5 flex justify-center items-center text-lg">
          <img
            className=" flex w-6"
            src="https://img.icons8.com/ios_filled/512/mac-os.png"
            alt=""
          />
          Pay
        </button>
      </div>
      <div className=" flex w-full rounded-[10px] h-[52px] items-center pl-5 border border-[#E6E6E6] mt-4">
        <div className=" flex justify-between w-full items-center">
          <label htmlFor="" className=" font-semibold flex items-center">
            <p className=" text-xl mr-2">VISA</p> **** **** ****
          </label>
          <input
            type="number"
            placeholder="2512"
            className=" w-auto h-full placeholder:text-black pr-5 outline-none text-right"
          />
        </div>
      </div>
      <hr className=" mt-5 w-[340px]" />
      <div className=" flex justify-start mt-5 w-[100%]">
        <p className=" font-semibold text-base">Order Summary</p>
      </div>
      <div className=" flex justify-between items-center gap-4 mt-4 w-[100%]">
        <div className=" justify-start">
          <p className=" flex text-[#808080] text-lg">Sub-total</p>
          <p className=" flex text-[#808080] text-lg">VAT (%)</p>
          <p className=" flex text-[#808080] text-lg">Shipping fee</p>
        </div>
        <div className=" justify-end">
          <p className=" font-medium text-base">$ 5,870</p>
          <p className=" font-medium text-base">$ 0.00</p>
          <p className=" font-medium text-base">$ 80</p>
        </div>
      </div>
      <hr className=" mt-4 w-[340px]" />
      <div className=" mt-4 flex justify-between w-[100%]">
        <p className=" text-base">Total</p>
        <p className=" font-semibold text-base">$ 5,950</p>
      </div>
      <div className=" flex gap-2 mt-4">
        <input
          type="text"
          placeholder="Enter promo code"
          className=" flex w-[250px] h-[52px] rounded-[10px] border border-[#E6E6E6] items-center pl-5 text-base placeholder:text-base"
        />
        <button className=" h-[52px] w-[85px] text-white bg-black justify-center items-center flex text-base font-medium rounded-[10px]">
          Add
        </button>
      </div>
      <button className=" w-[100%] h-[54px] bg-black text-white text-base font-medium rounded-[10px] mt-[65px] mb-[31px]">
        Place Order
      </button>
    </div>
  );
};

export default CheckOut;
