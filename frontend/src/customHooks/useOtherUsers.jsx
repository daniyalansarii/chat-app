// customHooks/useOtherUsers.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setOtherUsers } from "../redux/userSlice.js";
import axios from "axios";
import { serverUrl } from "../main.jsx";

const useOtherUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/others`, {
          withCredentials: true,
        });
        dispatch(setOtherUsers(result.data));
      } catch (error) {
        console.error("Error fetching other users:", error);
      }
    };

    fetchUsers();
  }, [dispatch]); // only on mount

};

export default useOtherUsers;
