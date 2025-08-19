import React, { useEffect, useRef } from "react";
import dp from "../assets/dp.webp";
import { useSelector } from "react-redux";

function ReceiverMessage({ image, message }) {
  const scroll = useRef();
  const { selectedUser } = useSelector((state) => state.user);

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
    <div className="flex items-start gap-2 justify-start">
      {/* Avatar */}
      <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex justify-center items-center shadow-lg shadow-gray-500 bg-white cursor-pointer">
        <img
          src={selectedUser?.image || dp}
          className="h-[100%]"
          alt={selectedUser?.name || "User"}
        />
      </div>

      {/* Message Bubble */}
      <div
        ref={scroll}
        className="w-fit max-w-[500px] px-5 py-2 bg-gray-200 text-black text-[19px] rounded-2xl rounded-tl-none flex flex-col gap-2"
      >
        {image && (
          <img
            className="w-36 rounded-lg"
            src={image}
            alt="attachment"
            onLoad={handleImageScroll}
          />
        )}
        {message && <span>{message}</span>}
      </div>
    </div>
  );
}

export default ReceiverMessage;
