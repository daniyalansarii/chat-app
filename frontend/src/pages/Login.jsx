import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../main";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      navigate("/");

      setEmail("");
      setPassword("");
      setErr("");
      setLoading(false);
    } catch (error) {
      setErr(error?.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-slate-200 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4">
        <div className="w-full text-center mb-4">
          <h1 className="text-gray-600 font-bold text-2xl">
            Welcome Back to <span className="text-blue-500">BuzzMates</span>
          </h1>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg outline-none"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg outline-none"
              required
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-2 cursor-pointer text-blue-500 font-semibold"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          {err && <p className="text-red-500">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <p className="text-center">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-500 font-bold cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
