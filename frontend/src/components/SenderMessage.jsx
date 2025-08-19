import React, { useEffect, useRef } from "react";
import dp from "../assets/dp.webp";
import { useSelector } from "react-redux";

function SenderMessage({ image, message, id }) {
  const scrollRef = useRef();
  const { userData } = useSelector((state) => state.user);

  // Scroll on new message or image
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message, image]);

  // Scroll after image loads (with slight delay)
  const handleImageScroll = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div key={id} ref={scrollRef} className="flex items-start gap-2">
      <div className="w-fit max-w-[500px] px-5 py-2 bg-[rgb(23,151,194)] text-white text-[19px] rounded-2xl rounded-tr-none relative right-0 ml-auto gap-5 flex flex-col">
        {image && (
          <img
            className="w-36 rounded-lg"
            src={image}
            alt="sent"
            onLoad={handleImageScroll}
          />
        )}
        {message && <span>{message}</span>}
      </div>
      <div className="w-[40px] shadow-lg shadow-gray-500 h-[40px] rounded-full overflow-hidden flex justify-center items-center cursor-pointer bg-white">
        <img
          src={userData.image || dp}
          className="h-[100%]"
          alt="profile"
        />
      </div>
    </div>
  );
}

export default SenderMessage;
