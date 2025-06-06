import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import element from '../assets/Element.svg';
import element1 from '../assets/Element(1).svg';
import logo from '../assets/Logo.svg';
import man from '../assets/Man.svg';
import arrow from '../assets/Arrow.svg';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [first, setFirst] = useState(true);
  const [second, setSecond] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setLoading(false);
    }, 1000);

    const timer2 = setTimeout(() => {
      setFirst(false);
      setSecond(true);
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="max-w-[390px] w-full relative">
      <div
        className={`bg-[#1A1A1A] w-full relative flex items-center justify-center h-screen transition-opacity duration-[1s] ${
          first ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute top-[10px] left-[0]">
          <img className="w-full" src={element} alt="Background element" />
        </div>
        <div>
          <img src={logo} alt="Logo" />
        </div>
        <div
          className={`absolute left-[50%] top-[85vh] transform -translate-x-[50%] rounded-[50%] w-[60px] h-[60px] bg-gradient-to-r from-white to-transparent flex items-center justify-center animate-spin ${
            loading ? 'block' : 'hidden'
          }`}
        >
          <div className="w-[90%] h-[90%] bg-[#1a1a1a] rounded-[50%]" />
        </div>
      </div>
      <div
        className={`absolute top-0 left-0 w-full h-[100vh] transition-opacity duration-[1s] z-[20] overflow-y-hidden ${
          second ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="relative py-[12px] h-full">
          <div className="pl-[24px] relative">
            <div className="absolute top-[50px] left-[0] z-[10]">
              <img className="w-full" src={element1} alt="Background element" />
            </div>
            <div className="relative z-[30]">
              <h1 className="font-[Montserrat] font-[600] text-[64px] leading-[80%] tracking-[-5%] text-[black]">
                Define yourself in your unique way.
              </h1>
            </div>
            <div className="absolute z-[40] top-[25px] right-0">
              <img src={man} alt="Person illustration" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full py-[22px] bg-[white] z-[50] flex items-center justify-center">
            <NavLink
              to="/login"
              className="px-[109px] bg-[#1A1A1A] rounded-[10px] py-[16px] flex items-center gap-[15px]"
            >
              <p className="font-[Montserrat] font-[500] text-[16px] text-[#FFFFFF]">
                Get Started
              </p>
              <img src={arrow} alt="Arrow" />
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;