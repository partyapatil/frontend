import React, { useEffect, useState } from "react";
import axios from "axios";
import { useChatState } from "../context/ChatProvider";
import Sidedrawer from "../pages/Sidedrawer";
import { fetchChatRedux } from "../thunk/MiddlewareFunctions";
import { useDispatch, useSelector } from "react-redux";
import { SetloggedUser, setUser } from "../Redusers/ChatSlice";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ChatPage = () => {
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const ChatsRedux=useSelector((state)=>state.ChatReduser.chats)
  const userRedux=useSelector((state)=>state.ChatReduser.user)
  const selectedChatRedux=useSelector((state)=>state.ChatReduser.selectedchat)
let a=1
const LoggedUser=useSelector((state)=>state.ChatReduser.loggedUser)

  useEffect(()=>{

dispatch(fetchChatRedux())
const userInfo=JSON.parse(localStorage.getItem("userInfo"))
dispatch(SetloggedUser(userInfo))
dispatch(setUser(userInfo))
 },[])
 
//  useEffect(()=>{

//  },[ChatsRedux])
 const fetchChats = async () => {

  if (!userRedux && !LoggedUser) {
    console.error("User data not available");
    return;
  }

  try {
    const token = userRedux ? userRedux.token : LoggedUser.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const result = await dispatch(fetchChatRedux(config));

    if (result.status) {
      // Handle successful response
      console.log("Chats fetched successfully");
    } else {
      // Handle errors based on the error type
      if (result.error?.status === 401) {
        localStorage.removeItem("userInfo")

        navigate("/"); // Redirect if unauthorized
      } else {
        console.error("Error fetching chats:", result.error);
      }
    }
  } catch (error) {
    toast.warning("Token exprired")
    // Handle errors properly
    if (error.response && error.response.status === 401) {

      localStorage.removeItem("userInfo")
      navigate("/");
    } else {
      console.error("API call failed:", error.message || error);
    }
  }
};


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    dispatch(SetloggedUser(storedUser))

    // Only fetch chats once user info is available
    if (storedUser || userRedux) {
      fetchChats();
    }
    // eslint-disable-next-line
  }, [userRedux]);

  // Check if user info is available before rendering
  if (!userRedux && !LoggedUser) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: "100%" }}>
      {userRedux ? <Sidedrawer loggedUser={LoggedUser} /> : `Loading...`} 
    </div>
  );
};

export default ChatPage;
