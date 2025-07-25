import axios from "axios";
import React, { useEffect, useState } from "react";
import { useChatState } from "../context/ChatProvider";
import UserListItem from "./UserListItem";
import { useDispatch, useSelector } from "react-redux";
import { SetselectedChat } from "../Redusers/ChatSlice";
import { fetchChatRedux } from "../thunk/MiddlewareFunctions";
import axiosInstance from "../../src/axiosInstance";

const UpdateGroupModal = ({ handalsetShowupdatemodal, selectedChat }) => {
  const [Searchresult, setSearchResult] = useState();
  const [search, setSearch] = useState();
  const [Selectedsearch, setSelectedSearch] = useState([]);
  const [isEditname, setisEditname] = useState(false);
  const [updatedName, setupdatedName] = useState();
  const dispatch=useDispatch()
  const selectedChatRedux=useSelector((state)=>state.ChatReduser.selectedchat)
  const LoggedUser=useSelector((state)=>state.ChatReduser.user)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleDeleteGroup = () => {
    setShowDeleteConfirmation(true); // Show confirmation modal
  };
  
  const confirmDeleteGroup = () => {
    // Logic to delete the group
    console.log("Group deleted");
    setShowDeleteConfirmation(false); // Hide confirmation modal
  };
  
  const cancelDeleteGroup = () => {
    setShowDeleteConfirmation(false); // Hide confirmation modal
  };

  const removeFromGroup = async (u) => {
let userId = u._id;
    let chatId = selectedChatRedux._id;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${LoggedUser.token}`,
        },
      };
      const { data } = await axiosInstance.put(
        `/api/chat/groupremove`,
        {
          chatId,
          userId,
        },
        config
      )
      dispatch(SetselectedChat(data))

    } catch (e) {
      console.log(e, "chats");
    }
  };

  const handalSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${LoggedUser.token}`,
        },
      };
      const { data } = await axiosInstance.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
    } catch (error) {}
  };
  const AcceessChat = (id) => {
    setSelectedSearch([id]);
    // setSelectedSearch([...Selectedsearch,id])
  };

  const addToGroup = async (id) => {
    if (!Selectedsearch[0]?._id) {
      alert("Pls select the user to add ");
      return;
    }

    let userId = Selectedsearch[0]?._id;

    let chatId = selectedChatRedux._id;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${LoggedUser.token}`,
        },
      };
      const { data } = await axiosInstance.put(
        `/api/chat/AddTogroup`, // Removed the extra `}` at the end
        {
          chatId,
          userId,
        },
        config
      );
      dispatch(SetselectedChat(data))

      setSearchResult([])
      setSearch("")
      setSelectedSearch([""]);
    } catch (e) {
      console.log(e);
    }
  };
  const updateName = async () => {
    let chatId = selectedChatRedux._id;
    let chatName = updatedName;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${LoggedUser.token}`,
        },
      };
      const { data } = await axiosInstance.put(
        `/api/chat/rename`,
        {
          chatId,
          chatName,
        },
        config
      );
      dispatch(SetselectedChat(data))


// fetchChats()
fetchChatRedux()
handalsetShowupdatemodal()
    } catch (e) {
      console.log(e);
    }
  };
  return (
<div className="updateGroupModalOuter">
  <div className="updateGroupModalInner">
    {/* Close Modal Icon */}
    <span
      className="closeModalIcon"
      title="Close"
      onClick={handalsetShowupdatemodal}
    >
      X
    </span>

    {/* Group Name Section */}
    <div className="groupNameSection">
      {isEditname && (
        <input
          className="updateInput"
          type="text"
          defaultValue={selectedChatRedux?.chatName}
          onChange={(e) => setupdatedName(e.target.value)}
        />
      )}

      {!isEditname ? (
        <>
          <h2 className="groupName">{selectedChatRedux?.chatName}</h2>
          <span
            className="editIcon"
            title="Edit Group Name"
            onClick={() => setisEditname(true)}
          >
            ✎
          </span>
          <span
            className="deleteIcon"
            title="Delete Group"
            // onClick={handleDeleteGroup}
          >
            🗑️
          </span>
        </>
      ) : (
        <button className="Updatebtn" onClick={updateName}>
          Submit
        </button>
      )}
    </div>

    {/* Current Members Section */}
    <div className="membersSection">
      <ul className="membersList">
        {selectedChatRedux?.users?.map((e) => (
          <li className="memberItem">
            <span
              className="removeIcon"
              title="Remove Member"
              onClick={() => removeFromGroup(e)}
            >
              X
            </span>
            {e.name}
          </li>
        ))}
      </ul>
    </div>

    {/* Add New Member Section */}
    <div className="addMemberSection">
      <input
        type="text"
        className="addMemberInput"
        placeholder="Enter name to add a new member"
        value={search}
        onChange={(e) => handalSearch(e.target.value)}
      />
      <button className="addMemberButton" onClick={addToGroup}>
        Add Member
      </button>
    </div>

    {/* Display Search Results */}
    {Selectedsearch?.map((e) => (
      <div className="displayG">
        <span>{e.name}</span>
      </div>
    ))}

    {Searchresult?.length > 0 && search && (
      <div className="searchResultsContainer">
        <UserListItem chatData={Searchresult} AcceessChat={AcceessChat} />
      </div>
    )}
  </div>

  {/* Delete Confirmation Modal */}
  {showDeleteConfirmation && (
    <div className="confirmationModal">
      <p>Are you sure you want to delete this group?</p>
      <button onClick={confirmDeleteGroup}>Yes, Delete</button>
      <button onClick={cancelDeleteGroup}>Cancel</button>
    </div>
  )}
</div>
  );
};

export default UpdateGroupModal;
