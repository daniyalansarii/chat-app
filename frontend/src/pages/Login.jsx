import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser, setUserData } from "../redux/userSlice";

function Login() {
  let navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [err, setErr] = useState("");
  let dispatch = useDispatch()

  

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data))
      dispatch(setSelectedUser(null))
      navigate("/")
      setEmail("");
      setPassword("");
      setLoading(false);
      setErr("");
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErr(error.response.data.message);
    }
  };
  return (
    <div className="w-full h-[100vh] bg-slate-200 flex items-center justify-center ">
      <div className="w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[10px]">
        <div className="w-full h-[200px] bg-[#20c7ff] rounded-b-[20%] shadow-gray-400 shadow-lg flex items-center justify-center mb-12">
          <h1 className="text-gray-600 font-bold text-[24px] ">
            Login to <span className="text-white">Buzzmates</span>{" "}
          </h1>
        </div>
        <form
          onSubmit={handleLogin}
          className="w-full flex flex-col gap-[20px] items-center mt-5"
        >
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="email"
            className="w-[90%] h-12 outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] rounded-lg bg-white shadow-gray-200 shadow-lg "
          />
          <div className="w-[90%] h-12 relative  border-2 shadow-gray-200 border-[#20c7ff] overflow-hidden rounded-lg bg-white shadow-lg">
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={show ? "text" : "password"}
              placeholder="password"
              className="w-full h-full outline-none px-[20px] py-[10px]"
            />
            <span
              onClick={() => setShow((prev) => !prev)}
              className="absolute cursor-pointer top-[10px] right-[20px] text-blue-500 font-semibold "
            >
              {show ? "hidden" : "show"}
            </span>
          </div>
          {err && <p className="text-red-500">{err}</p>}
          <button
            className="px-[20px] mt-4 py-[10px] text-[20px] w-[200px] font-semibold hover:shadow-inner bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          <p>
            Don't Have An Account ?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-500 font-bold cursor-pointer"
            >
              Sign Up
            </span>{" "}
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
