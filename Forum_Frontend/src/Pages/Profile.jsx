// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { userService } from "../services/userService";

const ProfilePage = () => {
  const { unityId } = useParams();
  const {
    profileUser,
    fetchUserByUnityId,
    currentUser,
    loading,
    error,
  } = useUser();

  const [friendStatus, setFriendStatus] = useState("none"); // 'none', 'pending', 'friends'

  useEffect(() => {
    if (unityId) {
      fetchUserByUnityId(unityId);
    }
  }, [unityId]);

  useEffect(() => {
  const checkFriendStatus = async () => {
    if (
      loading || !currentUser || !profileUser || 
      currentUser.unityId === profileUser.unityId
    ) return;

    try {
      const status = await userService.getFriendStatus(currentUser.id, profileUser.id);
      setFriendStatus(status);
    } catch (err) {
      console.error("Failed to check friend status", err);
    }
  };

  checkFriendStatus();
}, [loading, currentUser, profileUser]);

  const handleAddFriend = async () => {
    try {
      await userService.addFriend(currentUser.id, profileUser.id);
      setFriendStatus("PENDING");
    } catch (err) {
      console.error("Failed to send friend request", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">{error || "No user data available."}</p>
      </div>
    );
  }

  const {
    profilePictureUrl,
    displayName,
    email,
    bio,
    department,
    departments,
    isStudent,
    unityId: profileUnityId,
    year,
    badges = [],
  } = profileUser;

  const roleLabel = isStudent ? "Student" : "Faculty";
  const isOwnProfile = currentUser?.unityId === profileUnityId;

  const renderFriendButton = () => {
    if (friendStatus === "FRIENDS") {
      return <button className="bg-green-500 text-white px-4 py-2 rounded-lg" disabled>Friends</button>;
    }
    if (friendStatus === "PENDING") {
      return <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg" disabled>Pending</button>;
    }
    return (
      <button
        onClick={handleAddFriend}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Add Friend
      </button>
    );
  };

  return (
    <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-lg">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">{displayName}'s Profile</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-center justify-center">
          <img
            src={profilePictureUrl || "/default-avatar.png"}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-indigo-500"
          />
        </div>

        <div className="md:col-span-2 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-700">{displayName}</h2>
            <p className="text-gray-500">{email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium text-gray-700">{roleLabel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Unity ID</p>
              <p className="font-medium text-gray-700">{profileUnityId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium text-gray-700">{department}</p>
            </div>
            {isStudent && (
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium text-gray-700">{year || "N/A"}</p>
              </div>
            )}
          </div>

          {bio && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700">About Me</h3>
              <p className="text-gray-600 mt-2">{bio}</p>
            </div>
          )}

          {departments && departments.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700">Other Departments</h3>
              <ul className="list-disc list-inside mt-2 text-gray-600">
                {departments.map((d) => (
                  <li key={d.id}>{d.name}</li>
                ))}
              </ul>
            </div>
          )}

          {badges.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700">Badges</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            {isOwnProfile ? (
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                Edit
              </button>
            ) : (
              renderFriendButton()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
