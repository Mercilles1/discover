import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import CheckOut from "./Pages/CheckOut";

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className=" flex w-full justify-center items-center h-[100vh] bg-green-500">
      <div className=" flex flex-col w-[390px] bg-white rounded-[30px]">
        <header className=" flex justify-between items-center h-[44px] w-[100%] px-[27px] bg-white rounded-[30px]">
          <p className=" text-sm font-medium">{formatTime(currentTime)}</p>
          <div className=" flex items-center gap-[5px]">
            <img
              className=" w-[17px]"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk-uQdzwJUrrds7yHWyEVn6YdIP8BM9yNjAQ&s"
              alt=""
            />
            <img
              className=" w-[17px]"
              src="https://e7.pngegg.com/pngimages/957/839/png-clipart-wi-fi-symbol-wireless-computer-icons-wifi-computer-network-electronics.png"
              alt=""
            />
            <img
              className=" w-[20px]"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5sZ5ZyG4pRaEZQJliHpQo6XLywbhHq_cXzX3JoH1gCk1NXl1PE0wH2YvHhPyLo5oAJXI&usqp=CAU"
              alt=""
            />
          </div>
        </header>
        <Routes>
          <Route path="/checkout" element={<CheckOut />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
