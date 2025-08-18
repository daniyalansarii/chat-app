import React, { useEffect, useRef } from "react";
import dp from "../assets/dp.webp";
import { useSelector } from "react-redux";

function ReceiverMessage({ image, message }) {
  const scroll = useRef();
  let {selectedUser} = useSelector(state=>state.user)

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message, image]);

  const handleImageScroll = () => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
     <div className="flex items-start gap-2">
      <div className="w-[40px] shadow-lg shadow-gray-500 h-[40px] rounded-full overflow-hidden flex justify-center items-center cursor-pointer bg-white ">
            <img
              src={selectedUser.image || dp}
              className="h-[100%]"
              alt=""
            />
          </div>
          <div
            ref={scroll}
            className="w-fit max-w-[500px] px-5 py-2 bg-[rgb(23,151,194)] text-white text-[19px] rounded-2xl rounded-tl-none relative left-0  gap-5 flex flex-col"
          >
            {image && (
              <img
                className="w-36 rounded-lg"
                src={image}
                alt=""
                onLoad={handleImageScroll}
              />
            )}
            {message && <span>{message}</span>}
          </div>
          
        </div>
  );
}

export default ReceiverMessage;
