import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"; // Import specific icon
import ProfileModal from "../Otherpages/ProfileModal";
import { useNavigate } from "react-router-dom";
import UserListItem from "../Otherpages/UserListItem";
import InsideChatpage from "../Otherpages/InsideChatpage";
import { getSender } from "../config/Chatlogics";
import Badge from '@mui/material/Badge';

import { useSelector,useDispatch } from "react-redux";
import { fetchName } from "../thunk/MiddlewareFunctions";
import {Setchats, SetNotificationre, SetselectedChat} from "../Redusers/ChatSlice"
import axiosInstance from "../../src/axiosInstance";

const Sidedrawer = ({ loggedUser }) => {

  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [draweropen, setdraweropen] = useState(false);
  const [chatInput, setchatInput] = useState();
  const [chatData, serChatadata] = useState(["my"]);
  const [notificationModal, setnotificationModal] = useState(false);
  const userRedux=useSelector((state)=>state.ChatReduser.user)
  const dispatch = useDispatch();
  const ChatsRedux=useSelector((state)=>state.ChatReduser.chats)

  const Notification=useSelector((state)=>state.ChatReduser.Notification)

  const navigate = useNavigate();

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/Home");
  };

  const handalInput = (e) => {
    setchatInput(e);
  };
  const handalsubmitGo = async (e) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userRedux.token}`,
        },
      };

      const { data } = await axiosInstance.get(`/api/user?search=${chatInput}`, config);
      serChatadata(data);
    } catch (err) {
    }
  };
  const AcceessChat = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userRedux.token}`,
        },
      };
      const { data } = await axiosInstance.post(`/api/chat`, { userId }, config);
      if (!ChatsRedux?.find((c) => c._id === data._id)) dispatch(Setchats([data, ...ChatsRedux]));
     dispatch(SetselectedChat(data))

    } catch (error) {
      console.log(error);
    }
  };
  const Hnadaldrawer = () => {
    setdraweropen(true); // Open the drawer
  };
  useEffect(() => {
    dispatch(fetchName()); 
    setTimeout(() => {
      dispatch(fetchName("chatappppppppp")); 
    }, 2000);
    
  }, [dispatch]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        draweropen &&
        !event.target.closest(".drawwer") &&
        !event.target.closest(".searchDiv")
      ) {
        setdraweropen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [draweropen]);

  return (
    <div className="mainChatcon">
      <div className="header">
        <div className="searchDiv" onClick={Hnadaldrawer}>
          <FontAwesomeIcon icon={faMagnifyingGlass} /> Search Bar
        </div>
        <h3>Chat App</h3>

        <div className="notificationProfile">
          <div onClick={() => setnotificationModal(!notificationModal)}>
      <Badge badgeContent={Notification.length} color="error">
  <i className="fa fa-bell" aria-hidden="true"></i>
</Badge>

        </div>

          {notificationModal && (
            <div className="notificationmodal">
              <>
      <Badge badgeContent={Notification.length} color="primary" />

                {!Notification.length && <p>No New Messages</p>}

                {Notification.length > 0 && (
                  <div>
                    {Notification.map((e) => (
                      <div
                        key={e._id}
                        className="notification-item"
                        onClick={() => {
                          dispatch(SetselectedChat(e.chat))

                          dispatch(SetNotificationre(Notification.filter((n) => n !== e)));
                          setnotificationModal(!notificationModal);
                        }}
                      >
                        {e.chat.isGroupChat ? (
                          <strong>New Message in {e.chat.chatName}</strong>
                        ) : (
                          <strong>
                            New Message from {getSender(userRedux, e.chat.users)}
                          </strong>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            </div>
          )}

          <div className="profileContainer">
            <div className="profileIcon">
              <img
                src={userRedux?.pic || "default-image-url.jpg"}
                alt="Profile"
                className="profileImage"
              />
            </div>
            <i
              className={`fa dropdownIcon ${
                showOptions ? "fa-angle-up" : "fa-angle-down"
              }`}
              aria-hidden="true"
              onClick={toggleOptions}
            ></i>

            {showOptions && (
              <div className="optionsMenu">
                <div className="optionItem" onClick={handleModal}>
                  My Profile
                </div>
                <div className="optionItem" onClick={logout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Profile Modal */}
      {showModal && <ProfileModal onClose={handleModal} user={userRedux} />}

      {/* Drawer */}
      <div className={`drawwer ${draweropen ? "open" : ""}`}>
        <h3>Search user</h3>
        <div className="drawerSearch">
          <input
            type="text"
            placeholder="Search User"
            className="drawerSearchInput"
            onChange={(e) => setchatInput(e.target.value)}
          ></input>
          <button className="drawerSearchBTN" onClick={() => handalsubmitGo()}>
            Go
          </button>
        </div>
        {userRedux && <UserListItem chatData={chatData} AcceessChat={AcceessChat} />}
      </div>
      <InsideChatpage
        LoggedUser={loggedUser}
        handleModal={handleModal}
        showModal={showModal}
      />
    </div>
  );
};

export default Sidedrawer;
