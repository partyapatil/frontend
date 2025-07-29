import React, { useState, useEffect, useRef } from "react";
import { useChatState } from "../context/ChatProvider";
import { getSender, getSenderdata } from "../config/Chatlogics";
import ProfileModal from "./ProfileModal";
import UpdateGroupModal from "./UpdateGroupModal";
import axios from "axios";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { SetNotificationre } from "../Redusers/ChatSlice";
import axiosInstacce from "../../src/axiosInstance"

const SingalPage = () => {
  const [get, setget] = useState();
  const ENDPOINT ="https://chatapp-backend-eefm.onrender.com";
  const socket = useRef(null);
  const [showUpdatemodal, setShowupdatemodal] = useState(false);
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const selectedChatCompare = useRef(null);
  const chatEndRef = useRef(null);
  const dispatch = useDispatch();
  const selectedChatRedux = useSelector(
    (state) => state.ChatReduser.selectedchat
  );

  const LoggedUser = useSelector((state) => state.ChatReduser.loggedUser);
  const Notification = useSelector((state) => state.ChatReduser.Notification);
  const userRedux = useSelector((state) => state.ChatReduser.user);

  // Scroll to the bottom when messages change
  useEffect(() => {

    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

useEffect(()=>{
    socket.current = io(ENDPOINT);
     
    socket.current.on("connect", () => {
      console.log("Connected to socket srer",socket.id);
    });
  
    socket.current.on("connection done", (g) => {
      console.log("Connection done:", g);
    });

    socket.current.emit("setup", userRedux);
    socket.current.on("connected", () => setSocketConnected(true));
  
    return () => {
          if (socket.current) {
            socket.current.disconnect();
            socket.current = null;
          }
        };
},[userRedux])
  
  useEffect(() => {

    socket.current.on("typing", () => setIsTyping(true));
    socket.current.on("stop typing", () => setIsTyping(false));
    return () => socket.current?.disconnect();

  }, [userRedux]);

  useEffect(() => {
    if (selectedChatRedux) {
      if (selectedChatRedux?.isGroupChat) {
        setName(selectedChatRedux?.chatName);
      } else {
        setName(getSender(userRedux, selectedChatRedux?.users));
      }
    }
  }, [userRedux,selectedChatRedux]);

  useEffect(() => {
    console.log("Joining room with ID", selectedChatRedux?._id); // Log room ID
    console.log("Logged user ID:", userRedux?._id); // Log user ID
    if (selectedChatRedux) {
      fetchMessages();
      selectedChatCompare.current = selectedChatRedux;
    }
  }, [selectedChatRedux]);

  useEffect(() => {
    socket.current.on("message recieved", (newMessageRecieved) => {
      console.log("geted")
      setget(!get);
      socket.current.on("test");
      if (
        !selectedChatCompare.current || // if chat is not selected or doesn't match current chat
        selectedChatCompare.current._id !== newMessageRecieved.chat._id
      ) {
        if (!Notification.includes(newMessageRecieved)) {
          dispatch(SetNotificationre([newMessageRecieved, ...Notification]));
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
      }
    });
  }, [userRedux]);


  const fetchMessages = async () => {
    if (!selectedChatRedux) return;
    socket.current.emit("join chat", selectedChatRedux?._id);
    try {
      const config = {
        headers: { Authorization: `Bearer ${userRedux.token}` },
      };
      setLoading(true);
      const { data } = await axiosInstacce.get(
        `/api/message/${selectedChatRedux._id}`,
        config
      );
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (event) => {
    console.log("print")
    if (!newMessage.trim()) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${userRedux.token}` },
      };
      const { data } = await axiosInstacce.post(
        "/api/message",
        { content: newMessage, chatId: selectedChatRedux._id },
        config
      );
      setNewMessage("");
      socket.current.emit("new message", data);
      console.log("New message event emitted:", data);

      console.log("sent")

      setMessages((prevMessages) => [...prevMessages, data]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.current.emit("typing", selectedChatRedux._id);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.current.emit("stop typing", selectedChatRedux._id);
        setTyping(false);
      }
    }, timerLength);
  };console.log(messages)

  const handleModal = () => setShowModal(!showModal);

  const handalsetShowupdatemodal = () => setShowupdatemodal(false);

  const Getuser = selectedChatRedux
    ? getSenderdata(LoggedUser, selectedChatRedux?.users)
    : null;
  return !selectedChatRedux ? (
    <div className="SingalMainNouserSelected">
      Click on a user to start chatting
    </div>
  ) : (
    <div className="SingalMain">
      {/* {selectedChat&&} */}
      <div className="sinHeader">
        {name ? <h1>{name}</h1> : "Loading..."}
        {!selectedChatRedux?.isGroupChat ? (
          <div className="profileIcon" onClick={handleModal}>
            <img
              
                src={Getuser?.pic || "default-image-url.jpg"}
              
              alt="Profile"
              className="profileImage"
            />
            {showModal && (
              <ProfileModal
                h1={"hello"}
                user={Getuser}
                Single={true}
                onClose={handleModal}
              />
            )}
          </div>
        ) : (
          <div className="profileIcon" onClick={() => setShowupdatemodal(true)}>
            <img
              src={Getuser?.pic || "default-image-url.jpg"}
              alt="Profile"
              className="profileImage"
            />
          </div>
        )}
      </div>
      {showUpdatemodal && (
        <UpdateGroupModal
          handalsetShowupdatemodal={handalsetShowupdatemodal}
          selectedChat={selectedChatRedux}
        />
      )}
      <div className="chatContainer">
  {messages.map((e) =>
    e.sender && LoggedUser ? (
      <div
        key={e._id}
        className={`messageWrapper ${
          e.sender._id === LoggedUser._id ? "sent" : "received"
        }`}
      >
        <div
          className={`messageBubble ${
            e.sender._id === LoggedUser._id ? "user" : "sender"
          }`}
        >
          {e.content}
        </div>
        <span
          className={`messageTime ${
            e.sender._id === LoggedUser._id ? "timeRight" : "timeLeft"
          }`}
        >
          {new Date(e.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    ) : null
  )}
  <span ref={chatEndRef}></span>
</div>

      {istyping && <div>....typing</div>}
      <div className="inputSection">
        <input
          type="text"
          className="inputField"
          placeholder="Type a message..."
          value={newMessage}
          onChange={typingHandler}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="sendButton" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default SingalPage;
