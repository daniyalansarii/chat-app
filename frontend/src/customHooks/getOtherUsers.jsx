import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers, setUserData } from "../redux/userSlice.js";
import axios from "axios";
import { serverUrl } from "../main.jsx";

const getOtherUsers = () => {
  const dispatch = useDispatch();
  let { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/others`, {
          withCredentials: true,
        });
        dispatch(setOtherUsers(result.data));
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userData]);
};
export default getOtherUsers;
