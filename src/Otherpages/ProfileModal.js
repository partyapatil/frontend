import React from "react";

const ProfileModal = ({ onClose, user,Single,h1 }) => {
console.log(user)
  return (
    <div className="modalOverlay">
    <div className="modalContent">
      {Single ? <h2 style={{ marginBottom: "20px" }}></h2> : <h2>My Profile</h2>}
  
      {/* Display User Profile Picture */}
      <img
        src={user?.pic}
        alt="Profile"
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          marginBottom: "20px",
          border: "3px solid #007bff", // Add a border around the image
        }}
      />
  
      {/* Display User Name */}
      <p style={{ fontSize: "18px", fontWeight: "600", margin: "10px 0", color: "#333" }}>
        Name: {user?.name || "N/A"}
      </p>
  
      {/* Display User Email */}
      <p style={{ fontSize: "16px", color: "#555", margin: "10px 0" }}>
        Email: {user?.email || "N/A"}
      </p>
  
      {/* Additional Heading */}
      <h1 style={{ fontSize: "20px", fontWeight: "600", color: "#333", margin: "20px 0" }}>
        {h1}
      </h1>
  
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          padding: "12px 24px",
          fontSize: "16px",
          cursor: "pointer",
          marginTop: "20px",
          transition: "background-color 0.3s ease",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Add shadow for depth
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
      >
        Close
      </button>
    </div>
  </div>
  );
};

export default ProfileModal;
