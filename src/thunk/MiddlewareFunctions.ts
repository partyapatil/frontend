import axios from "axios";
import {
  setName,
  setUser,
  Setchats,
  SetloggedUser,
} from "../Redusers/ChatSlice";
import axiosInstance from "../../src/axiosInstance";

import { Ilogin } from "../Types/Types";
import { AppDispatch } from "../Store/store";
import { toast } from "react-toastify";
export const getAuthConfig = () => {
  const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
  return {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
};

export const fetchName = (namee: string) => async (dispatch: any) => {
  // Simulating async operation (API call)
  const name = await new Promise<string>((resolve) => {
    setTimeout(() => resolve(namee ? namee : "ooo"), 1000);
  });

  dispatch(setName(name));
};

export const loginUser = (data: Ilogin) => async (dispatch: AppDispatch) => {
  try {
const response = await axiosInstance.post("/api/login", data);
    dispatch(setUser(response.data));
    localStorage.setItem("authToken", response.data.token);
    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        pic: response.data.pic,
        token: response.data.token,
      })
    );
    dispatch(SetloggedUser(response.data));
    console.log(response.data, "login");
    return { success: true };
  } catch (error) {
    alert(error);
  }
};

export const fetchChatRedux = () => async (dispatch: AppDispatch) => {
  const config = getAuthConfig();

  try {
    const { data } = await axiosInstance.get("/api/chat", config);
    dispatch(Setchats(data));
    return { status: true };
  } catch (error: any) {
    if (error.response) {
      // Handle server errors
      console.error("Error fetching chats:", error.response.data);
      return { status: false, error: error.response }; // Return error response
    } else if (error.request) {
      // Handle network errors
      console.error("No response received:", error.request);
      return { status: false, error: "No response from server" };
    } else {
      // Handle other errors
      console.error("Unexpected error:", error.message);
      return { status: false, error: error.message };
    }
  }
};
export const CreateGroupChat =  (name: string, Userdata: any, pic: any, setShowmodal: any) =>
  async (dispatch: AppDispatch) => {

    try {
      console.log(pic);
      const config = getAuthConfig();
      console.log("w", Userdata);
      const { data } = await axiosInstance.post(
        `/api/chat/group`,
        {
          name: name,
          users: JSON.stringify(Userdata.map((u: any) => u._id)),
          groupPic: pic,
        },
        config
      );
      console.log("new", data);
      dispatch(Setchats(data));
      setShowmodal(false);
      return { status: true };
    } catch (e) {
      console.log("eorrryyyyyyyy", e);
      toast.warning("failed");
      setShowmodal(false);
    }
  };
