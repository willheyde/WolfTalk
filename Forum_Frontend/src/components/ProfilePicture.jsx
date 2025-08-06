// src/components/ProfileButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
  const ProfileButton = ({ profileImage, userName }) => {
  const navigate = useNavigate();
  const currentUser = userService;
  const handleClick = () => {
    console.log(currentUser);
    if (currentUser?.unityId) {
        console.log(currentUser);
      navigate(`/profile/${currentUser.unityId}`); // Route to profile page
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-9 h-9 rounded-full overflow-hidden border border-gray-300 shadow hover:shadow-md transition"
      title={userName}
    >
      <img
        src={profileImage}
        alt={`${userName}'s profile`}
        className="w-full h-full object-cover"
      />
    </button>
  );
};

export default ProfileButton;