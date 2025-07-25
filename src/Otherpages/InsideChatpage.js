import React, { useEffect, useState } from "react";
import { useChatState } from "../context/ChatProvider";
import { getSender, getSenderdata } from "../config/Chatlogics";
import GroupChatModal from "./GroupChatModal";
import SingalPage from "./SingalPage";
import { useDispatch, useSelector } from "react-redux";
import { SetselectedChat } from "../Redusers/ChatSlice";

const InsideChatpage = ({ handleModal, showModal }) => {
  const Notification=useSelector((state)=>state.ChatReduser.Notification)
console.log(Notification)
  const dispatch = useDispatch();
  const selectedChatRedux = useSelector(
    (state) => state.ChatReduser.selectedchat
  );
  const ChatsRedux = useSelector((state) => state.ChatReduser.chats);
  const LoggedUser = useSelector((state) => state.ChatReduser.loggedUser);
console.log(ChatsRedux)
  const [showmodal, setShowmodal] = useState(false);
  const HandlModal = () => [setShowmodal(!showmodal)];

  const handalselectedChat = (chat) => {
    dispatch(SetselectedChat(chat));
  };
console.log(ChatsRedux)
  // const fetchChats

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div className="ChatExits">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>My Chats</h3>
          <button className="NewGroup" onClick={HandlModal}>
            New Group Chat+
          </button>
          {
            <GroupChatModal
              showmodal={showmodal}
              setShowmodal={setShowmodal}
              HandlModal={HandlModal}
            />
          }
        </div>
        <div className="serChat">
     {ChatsRedux?.map((chat, chatIndex) => {
  if (!chat.isGroupChat) {
  }

  const isActive = selectedChatRedux?._id === chat?._id;

  // ✅ Add this line here
  const unreadCount = Notification.filter(
    (notif) => notif.chat._id === chat._id
  ).length;

  return (
    <div
      key={chat._id || chatIndex}
      className={`selectedChat ${isActive ? "active" : ""}`}
      onClick={() => handalselectedChat(chat)}
    >
      <img
        src={
          !chat.isGroupChat
            ? getSenderdata(LoggedUser, chat.users)?.pic ||
              "default-avatar.jpg"
            : chat.groupPic
        }
        alt="Chat avatar"
      />

      <div>
        <span>
          {!chat.isGroupChat
            ? getSender(LoggedUser, chat.users)
            : chat.chatName}
        </span>
        <div className="lastMessage">
          {chat?.latestMessage?.content || "No messages yet"}
        </div>
      </div>

      {!isActive && unreadCount > 0 && (
        <div className="unreadBadge">{unreadCount}</div>
      )}
    </div>
  );
})}
        </div>
      </div>
      <div className="ActualChats" style={{ flexGrow: "1" }}>
        <SingalPage handleModal={handleModal} showModal={showModal} />
      </div>
    </div>
  );
};

export default InsideChatpage;
