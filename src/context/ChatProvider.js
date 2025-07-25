import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Setchats } from "../Redusers/ChatSlice";
import { useDispatch, useSelector } from "react-redux";

const ChatContext = createContext();

function ChatProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Correct hook for navigation in React Router v6+
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);
const dispatch=useDispatch();

const LoggedUser=useSelector((state)=>state.ChatReduser.loggedUser)

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
      // Only redirect to "/" if the current path is not "/signup" or "/login"
      const allowedRoutes = ["/signup", "/"];
      if (!allowedRoutes.includes(window.location.pathname)) {
        navigate("/"); // Redirect only for protected routes
      }
    } else {
      setUser(userInfo); // Set user if found in localStorage
    }
  }, [navigate]);
  const fetchChats = async () => {
    // Ensure user is available before making the API call
    if (!user && !LoggedUser) {
      console.error("User data not available");
      return;
    }

    try {
      const token = user ? user.token : LoggedUser.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      console.log(data, "data");
      console.log("new",data)
      dispatch(setChats(data))
      // setChats(data);

      // setSelectedChat([data]);
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        fetchChats,
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        loggedUser,
        setLoggedUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

// Custom hook to access ChatContext
export const useChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
