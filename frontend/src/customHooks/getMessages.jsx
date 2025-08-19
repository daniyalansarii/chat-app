import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageslice.js";
import axios from "axios";
import { serverUrl } from "../main.jsx";

const getMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser, userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!selectedUser) return; // Prevent error if no user is selected

    const fetchMessages = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/message/get/${selectedUser._id}`,
          { withCredentials: true }
        );
        dispatch(setMessages(result.data));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUser, userData, dispatch]);
};

export default getMessage;
