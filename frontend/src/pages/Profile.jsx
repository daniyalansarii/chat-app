import React from "react";
import dp from "../assets/dp.webp";
import { IoMdCamera } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRef } from "react";
import axios from 'axios'
import { serverUrl } from "../main";
import { setUserData } from "../redux/userSlice.js";

function Profile() {
  let { userData } = useSelector((state) => state.user);
  let navigate = useNavigate()
  const [name, setName] = useState(userData.name || "")
  const [frontendImage, setfrontendImage] = useState(userData.image || dp)
  const [backendImage, setbackendImage] = useState(null)
  let image = useRef()
  let dispatch = useDispatch()
  const [saving, setSaving] = useState(false)

  const handleImage = (e)=>{
    let file = e.target.files[0]
    setbackendImage(file)
    setfrontendImage(URL.createObjectURL(file))
  }

  const handleProfile =async (e)=>{
        e.preventDefault()
        setSaving(true)
        try {
          let formData = new FormData()
          formData.append("name",name)
          if (backendImage) {
            formData.append("image",backendImage)
          }

          let result = await axios.put(`${serverUrl}/api/user/profile`,formData,{withCredentials:true})
          dispatch(setUserData(result.data))
          setSaving(false)
          navigate("/")
        } catch (error) {
          console.log(error);
          setSaving(false)
        }
  }
  return (
    <div className="w-full gap-5 h-[100vh] bg-slate-200 flex flex-col justify-center items-center ">
      <div onClick={()=>navigate("/")} className="fixed top-5 cursor-pointer left-5">
        <IoMdArrowBack  className="w-8 text-gray-600 h-8"/>
      </div>
      <div className=" relative  border-2 rounded-full border-[#20c7ff] bg-white shadow-lg shadow-gray-400 ">
        <div onClick={()=>image.current.click()} className="w-[100%] h-[100%] cursor-pointer flex justify-center items-center ">
          <img
            src={frontendImage}
            className="w-[150px] rounded-full h-[150px] overflow-hidden"
            alt=""
          />
        </div>
        <IoMdCamera className="absolute bottom-4 right-1 w-6 h-6 text-gray-700 " />
      </div>
      <form onSubmit={handleProfile} className="w-[95%]  max-w-[500px] flex flex-col gap-[18px] items-center justify-center ">
        <input type="file" hidden accept="image/*" ref={image} onChange={handleImage} />
        <input
          value={name}
          onChange={(e)=>setName(e.target.value)}
          type="text"
          className="w-[90%] h-12 outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] rounded-lg bg-white shadow-gray-200 shadow-lg "
          placeholder="Enter your name"
        />
        <input
          value={userData?.userName}
          type="text"
          className="w-[90%] h-12 outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] rounded-lg bg-white shadow-gray-200 shadow-lg text-gray-400"
          readOnly
        />
        <input
          value={userData?.email}
          type="email"
          className="w-[90%] h-12 outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] rounded-lg bg-white shadow-gray-200 shadow-lg text-gray-400 "
          readOnly
        />
        <button className="px-[20px] mt-4 py-[10px] text-[20px] w-[200px] font-semibold hover:shadow-inner bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg" disabled={saving}>{saving? "Saving...":"Save Profile"}</button>
      </form>
    </div>
  );
}

export default Profile;
