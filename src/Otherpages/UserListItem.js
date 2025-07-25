import React from "react";

const UserListItem = ({ chatData,AcceessChat }) => {
  return (
    <div className="chatListContainer">
      {chatData?.map((e) => (
        <div className="chatItem" key={e.id} onClick={()=>AcceessChat(e)}>
          <img className="chatAvatar" src={e.pic} alt={`${e?.name}'s avatar`} />
          <span className="chatName">{e?.name}</span>
        </div>
      ))}
    </div>
  );
};

export default UserListItem;

