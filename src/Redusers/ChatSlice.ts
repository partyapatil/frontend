import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { string } from "yup";
import { Chat } from "../Types/Types";
interface NameState {
  name: string;
}

interface UserState {
  _id: string;
  name: string;
  email: string;
  pic: string;
  token: string;
}

const initialState = {
  name: "prathamesh",
  user: [],
  count: 1,
  selectedchat: null,
  Notification: [],
  chats: [] as Chat[],
  loggedUser: [],
  loading: [],
  singleChatmsg:[],
  reset:null,

};
const ChatSlice = createSlice({
  name: "chatSlice",
  initialState,
  reducers: {
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload; // Update the state with the new name
    },

    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
    },
    SetselectedChat(state, action: PayloadAction<any>) {
      console.log("print");
      state.selectedchat = action.payload;
    },
    Setchats(state, action: PayloadAction<any>) {
      state.count++;

      const newChats = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      // state.chats = [...newChats,...state.chats];
      state.chats = newChats
console.log(newChats,"new")
      // state.chats = [
      //   ...state.chats.filter((chat) => chat._id !== action.payload._id), // Remove any existing chat with the same _id
      //   ...(Array.isArray(action.payload) ? action.payload : [action.payload]), // Add the new chat(s) if it's not already present
      // ];
    },
    SetloggedUser(state, action: PayloadAction<any>) {
      state.loggedUser = action.payload;
    },
    SetNotificationre(state, action: PayloadAction<any>) {
      state.Notification = action.payload;
    },
  },
});
export const {
  setName,
  setUser,
  SetselectedChat,
  SetNotificationre,
  Setchats,
  SetloggedUser,
} = ChatSlice.actions; // Export the action creators
export default ChatSlice.reducer;











