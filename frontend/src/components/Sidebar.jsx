import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.webp";
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { CiLogout } from "react-icons/ci";
import axios from "axios";
import { serverUrl } from "../main";
import {
  setOtherUsers,
  setSearchData,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice.js";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const { userData, otherUsers, selectedUser, onlineUsers, searchData } =
    useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [search, setSearch] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim()) handleSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [input]);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/search?query=${input}`,
        { withCredentials: true }
      );
      dispatch(setSearchData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`lg:w-[30%] ${!selectedUser ? "block" : "hidden"} lg:block overflow-hidden w-full h-full bg-slate-200 relative`}
    >
      {/* Logout Button */}
      <div
        onClick={handleLogout}
        className="w-[60px] cursor-pointer bg-[#20c7ff] shadow-lg shadow-gray-500 h-[60px] rounded-full overflow-hidden flex justify-center items-center fixed bottom-5 left-2"
      >
        <CiLogout className="w-[25px] h-[25px]" />
      </div>

      {/* Search Results */}
      {input.length > 0 && (
        <div className="flex absolute top-[250px] bg-white w-full h-[500px] overflow-y-auto items-center flex-col gap-2 z-[150]">
          {searchData?.map((user) => (
            <div
              key={user._id}
              className="w-[80%] h-[70px] flex items-center gap-5  bg-white cursor-pointer px-3 border-b-2 border-gray-400 "
              onClick={() => {
                dispatch(setSelectedUser(user));
                setInput("");
                setSearch(false);
                dispatch(setSearchData([]));
              }}
            >
              <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center">
                <img src={user.image || dp} className="h-[100%]" alt="" />
              </div>
              <p className="text-gray-800 font-semibold text-lg">
                {user.name || user.userName}
              </p>
              <span className="w-3 h-3 rounded-full absolute shadow-lg shadow-gray-500"></span>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="w-full h-[300px] bg-[#20c7ff] rounded-b-[20%] shadow-gray-400 shadow-lg flex flex-col mb-6 justify-center px-5">
        <h1 className="text-white font-bold text-[25px]">Buzzmates</h1>
        <div className="w-full flex justify-between items-center">
          <h1 className="text-gray-700 font-bold text-[25px]">
            Hi, {userData.name || "user"}
          </h1>
          <div
            className="w-[60px] shadow-lg shadow-gray-500 h-[60px] rounded-full overflow-hidden flex justify-center items-center cursor-pointer bg-white"
            onClick={() => navigate("/profile")}
          >
            <img src={userData.image || dp} className="h-[100%]" alt="" />
          </div>
        </div>

        {/* Search Area */}
        <div className="w-full flex items-center gap-3 overflow-y-auto py-3">
          {!search && (
            <div
              onClick={() => setSearch(true)}
              className="w-[60px] cursor-pointer bg-white shadow-lg shadow-gray-500 h-[60px] rounded-full overflow-hidden flex justify-center items-center"
            >
              <IoSearch className="w-[25px] h-[25px]" />
            </div>
          )}
          {search && (
            <form className="w-full relative h-[60px] px-5 mt-2 overflow-hidden rounded-full flex items-center gap-2 shadow-gray-500 bg-white shadow-lg">
              <IoSearch className="w-[25px] h-[25px]" />
              <input
                className="w-full h-full border-0 outline-none text-xl"
                type="text"
                placeholder="Search users"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <RxCross2
                className="w-[25px] h-[25px] cursor-pointer"
                onClick={() => {
                  setInput("");
                  setSearch(false);
                  dispatch(setSearchData([]));
                }}
              />
            </form>
          )}

          {/* Online Users */}
          {!search &&
            otherUsers?.map(
              (user) =>
                onlineUsers?.includes(user._id) && (
                  <div
                    key={user._id}
                    className="relative cursor-pointer rounded-full shadow-gray-500 shadow-lg bg-white flex mt-2"
                    onClick={() => {
                      dispatch(setSelectedUser(user));
                    }}
                  >
                    <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center">
                      <img src={user.image || dp} className="h-[100%]" alt="" />
                    </div>
                    <span className="w-3 h-3 rounded-full absolute bg-[#29fd0d] shadow-lg shadow-gray-500"></span>
                  </div>
                )
            )}
        </div>
      </div>

      {/* All Other Users */}
      <div className="w-full h-[50%] overflow-auto flex flex-col gap-5 items-center mt-4">
        {otherUsers?.map((user) => (
          <div
            key={user._id}
            className="w-[95%] h-[60px] flex items-center gap-5 shadow-lg shadow-gray-500 rounded-full bg-white hover:bg-[#78cae5] cursor-pointer"
            onClick={() => dispatch(setSelectedUser(user))}
          >
            <div className="relative rounded-full shadow-gray-500 shadow-lg bg-white flex mt-2">
              <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center">
                <img src={user.image || dp} className="h-[100%]" alt="" />
              </div>
              {onlineUsers?.includes(user._id) && (
                <span className="w-3 h-3 rounded-full absolute bg-[#29fd0d] shadow-lg shadow-gray-500"></span>
              )}
            </div>
            <h1 className="text-gray-700 font-semibold text-[20px]">
              {user.name || user.userName}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
