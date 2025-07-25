import React, { useState } from "react";
import UserListItem from "./UserListItem";
import axios from "axios";
import { Setchats } from "../Redusers/ChatSlice";
import { useDispatch, useSelector } from "react-redux";
import { CreateGroupChat } from "../thunk/MiddlewareFunctions";
import { toast } from "react-toastify";

const GroupChatModal = ({setShowmodal,showmodal,HandlModal}) => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [picuture, setProfilePicture] = useState(null);
  const [picLoading, setPicLoading] = useState(false);
  const handleGroupNameChange = (e) => {
    setGroupChatName(e.target.value);
  };
  const dispatch=useDispatch()
  const Chats=useSelector((state)=>state.ChatReduser.chats)
  const LoggedUser=useSelector((state)=>state.ChatReduser.loggedUser)



  const uploadImageToCloudinary = async (pics) => {
    
    console.log(pics)
    setPicLoading(true);

    if (pics === undefined) {
      toast.warning("Please Select an Image!");
      setPicLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const formData = new FormData();
      formData.append("file", pics);
      // formData.append("upload_preset", "chat-app"); // Your upload preset
      // formData.append("cloud_name", "piyushproj"); // Your Cloudinary cloud name
      formData.append("upload_preset", "chatApp"); // Your upload preset
      formData.append("cloud_name", "ddpunpqre"); // Your Cloudinary cloud name

      // Make the upload request
      try {
        const res = await fetch(
          // "https://api.cloudinary.com/v1_1/ddpunpqre/image/upload",
            "https://api.cloudinary.com/v1_1/ddpunpqre/image/upload",
          {
            method: "post",
            body: formData,
          }
        );
        const data = await res.json();
        console.log("not getting data","img")
        console.log(data,"img")
        const imageUrl = data.secure_url; // Image URL from Cloudinary
        setProfilePicture(imageUrl); // Set the image URL in state
        console.log(imageUrl);
        setPicLoading(false);
      } catch (err) {
        console.error(err,"img");
        toast.error(
          "Error Uploading Image! There was an error uploading your image."
        );
        setPicLoading(false);
      }
    } else {
      toast.error("Invalid File Type. Please select a JPEG or PNG image.");
      setPicLoading(false);
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
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
    } catch (error) {}
  };

  const handleGroup = (userToAdd) =>{
    if (selectedUsers.includes(userToAdd)) {
      alert("User already exixts");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((e) => e._id !== delUser._id));
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      alert("fill all the feilds");
      setShowmodal(!showmodal)
      return;
    }
    console.log(picuture,"p")
    if(!picLoading){
    dispatch(CreateGroupChat(groupChatName,selectedUsers,picuture,setShowmodal))

    }

  };
  return (
<div className={showmodal ? "groupModalContainer" : "groupModalContainerClose"}>
<div className="modalContent">
        <h2>Create a New Group Chat</h2>
<span className="closeSpan" onClick={HandlModal}>x</span>
        {/* Group Name Input */}
        <div className="inputGroup">
          <label htmlFor="groupName">Group Name</label>
          <input
            id="groupName"
            type="text"
            placeholder="Enter Group Name"
            // value={groupName}
            onChange={handleGroupNameChange}
            className="inputField"
          />
        </div>

        {/* Select Members */}
        <div className="inputGroup">
          <label htmlFor="selectMembers">Select Members</label>
          <input
            id="selectMembers"
            type="text"
            placeholder="Search members"
            className="inputField"
            onChange={(e) => handalSearch(e.target.value)}
          />
          <div className="selectedMembers">
            {selectedUsers.map((user) => (
              <div key={user._id} className="memberChip">
                <span>{user.name}</span>
                <button
                  className="removeButton"
                  onClick={() => handleDelete(user)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          {search&&searchResult.length>0&&(
            
          <div className="memberList">
            <>
          {console.log(search,searchResult)}
            <UserListItem chatData={searchResult} AcceessChat={handleGroup} />
            </></div>)}
          <div className="form-group">
            <label htmlFor="profile-picture">Upload a Picture</label>
            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              onChange={(e) => uploadImageToCloudinary(e.target.files[0])}
            />
          </div>
        </div>

        {/* Create Group Button */}
        <div className="buttonContainer">
          <button className="createGroupBtn" onClick={handleSubmit} disabled={picLoading}>
            {picLoading?"Uploading...":"Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatModal;
