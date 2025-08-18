import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice.js";
import axios from "axios";
import { serverUrl } from "../main.jsx";
import { setMessages } from "../redux/messageslice.js";

const getMessage = () => {
  const dispatch = useDispatch();
  let { userData,selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/message/get/${selectedUser._id}`, {
          withCredentials: true,
        });
        dispatch(setMessages(result.data));
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchMessage();
  }, [selectedUser,userData]);
};
export default getMessage;
