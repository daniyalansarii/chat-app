import React, { useEffect, useRef, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedUser } from "../redux/userSlice";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { FaImage } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { serverUrl } from "../main";
import { setMessages } from "../redux/messageslice";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";

function MessageArea() {
  const { selectedUser, userData, socket } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPicker, setShowPicker] = useState(false);
  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);

  const image = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.length === 0 && backendImage == null) return;
    try {
      const formData = new FormData();
      formData.append("message", input);
      if (backendImage) formData.append("image", backendImage);

      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );

      // ✅ update with functional update
      dispatch(setMessages((prev) => [...prev, result.data]));
      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  // ✅ Correct socket listener
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (mess) => {
      // only add if message is for this chat
      if (
        mess.sender === selectedUser?._id ||
        mess.receiver === selectedUser?._id
      ) {
        dispatch(setMessages((prev) => [...prev, mess]));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser, dispatch]);

  return (
    <div
      className={`lg:w-[70%] relative ${
        selectedUser ? "flex" : "hidden"
      } lg:flex w-full h-full bg-slate-200 border-l-2 border-gray-300`}
    >
      {selectedUser ? (
        <div className="w-full h-[100vh] flex flex-col">
          {/* Header */}
          <div className="w-full h-[100px] gap-5 bg-[#2fbdec] rounded-b-[20px] shadow-gray-400 shadow-lg flex items-center px-5">
            <div
              className="cursor-pointer"
              onClick={() => dispatch(setSelectedUser(null))}
            >
              <IoMdArrowBack className="w-6 text-white h-6" />
            </div>
            <div
              className="w-[50px] shadow-lg shadow-gray-500 h-[50px] rounded-full overflow-hidden flex justify-center items-center cursor-pointer bg-white"
              onClick={() => setShowUserProfile(true)}
            >
              <img src={selectedUser?.image || dp} className="h-[100%]" alt="" />
            </div>
            <h1 className="text-white font-semibold text-[20px]">
              {selectedUser?.name || "user"}
            </h1>
          </div>

          {/* Chat Area */}
          <div className="w-full h-[80vh] overflow-auto flex flex-col py-[30px] px-5 shadow-lg shadow-gray-400 gap-5">
            {showPicker && (
              <div className="absolute bottom-[120px] left-5 z-50">
                <EmojiPicker
                  className="shadow-lg"
                  onEmojiClick={onEmojiClick}
                  width={250}
                  height={350}
                />
              </div>
            )}
            {messages &&
              messages.map((mess) =>
                mess.sender === userData._id ? (
                  <SenderMessage
                    key={mess._id}
                    image={mess.image}
                    message={mess.message}
                  />
                ) : (
                  <ReceiverMessage
                    key={mess._id}
                    image={mess.image}
                    message={mess.message}
                  />
                )
              )}
          </div>

          {/* Message Input */}
          <div className="w-full lg:w-[70%] h-[100px] fixed bottom-[20px] flex items-center justify-center">
            {frontendImage && (
              <img
                src={frontendImage}
                className="absolute rounded-lg shadow-gray-400 bottom-[150px] right-[20%] w-[80px]"
                alt="preview"
              />
            )}
            <form
              className="w-[95%] lg:w-[70%] h-[60px] bg-[#2fbdec] rounded-full shadow-gray-400 shadow-lg flex items-center gap-5 px-5"
              onSubmit={handleSendMessage}
            >
              <input
                type="file"
                hidden
                accept="images/*"
                ref={image}
                onChange={handleImage}
              />
              <div onClick={() => setShowPicker((prev) => !prev)}>
                <MdOutlineEmojiEmotions className="w-6 h-6 text-white cursor-pointer" />
              </div>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="text"
                className="w-full bg-transparent h-full px-[10px] outline-none border-0 text-[19px] text-white placeholder:text-white"
                placeholder="Message"
              />
              <div onClick={() => image.current.click()}>
                <FaImage className="w-6 h-6 text-white cursor-pointer" />
              </div>
              {(input.length > 0 || backendImage != null) && (
                <button type="submit">
                  <IoMdSend className="w-6 h-6 text-white cursor-pointer" />
                </button>
              )}
            </form>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <h1 className="text-gray-700 font-bold text-[50px]">
            Welcome to BuzzMates
          </h1>
          <span className="font-semibold text-gray-700 text-[30px]">
            Stay in Touch with Your Mates!
          </span>
        </div>
      )}

      {/* User Profile Modal */}
      {showUserProfile && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] text-center relative">
            <button
              className="absolute top-2 right-3 text-gray-600 text-xl font-bold"
              onClick={() => setShowUserProfile(false)}
            >
              ×
            </button>
            <img
              src={selectedUser?.image || dp}
              alt="User"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold">
              {selectedUser?.name || "User"}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageArea;
