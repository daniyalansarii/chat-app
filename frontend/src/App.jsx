import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import useCurrentUser from "../customHooks/useCurrentUser";
import getOtherUsers from "./customHooks/getOtherUsers";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { serverUrl } from "./main";
import { setOnlineUsers, setSocket } from "./redux/userSlice";

function App() {
  const dispatch = useDispatch();
  const { userData, socket } = useSelector((state) => state.user);

  // Load current user & other users
  useEffect(() => {
    useCurrentUser();
    getOtherUsers();
  }, []);

  // Socket initialization
  useEffect(() => {
    if (!userData) {
      // Cleanup if no user
      if (socket) {
        socket.disconnect();
        dispatch(setSocket(null));
      }
      return;
    }

    // Initialize socket
    const socketio = io(serverUrl, {
      auth: { userId: userData._id }, // pass userId for backend identification
      transports: ["websocket"],
    });

    dispatch(setSocket(socketio));

    // Listen for online users
    socketio.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    // Cleanup on unmount or user change
    return () => {
      socketio.disconnect();
      dispatch(setSocket(null));
    };
  }, [userData, dispatch]);

  return (
    <div>
      <Routes>
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to="/profile" />}
        />
        <Route
          path="/login"
          element={!userData ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to="/signup" />}
        />
      </Routes>
    </div>
  );
}

export default App;
