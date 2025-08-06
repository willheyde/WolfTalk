// DirectMessages.jsx
import React, { useEffect, useState } from "react";
import { useDirectMessage } from "../context/DirectMessageContext";
import { useUser } from "../context/UserContext";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { userService } from "../services/userService";
import { directMessageService } from "../services/DirectMessageService";

const DirectMessages = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const {
    conversations = [],
    loading,
    error,
    fetchRecentConversations,
  } = useDirectMessage() || {};

  const [showPopup, setShowPopup] = useState(false);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [groupTitle, setGroupTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");

  useEffect(() => {
    if (!currentUser?.id) return;
    (async () => {
      await fetchRecentConversations(currentUser.id);
    })();
  }, [currentUser?.id, fetchRecentConversations]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!currentUser?.id) return;
      try {
        const data = await userService.getFriends(currentUser.id);
        const parsed = JSON.parse(data);
        const friendOptions = parsed.map((friend) => ({
          value: friend.id,
          label: friend.displayName || friend.unityId,
        }));
        setFriends(friendOptions);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    if (showPopup) fetchFriends();
  }, [showPopup, currentUser]);
  const handleSubmit = async () => {
    if (!groupTitle) {
      console.warn("Group title is empty. Redirect will still occur.");
    }

    const participantIds = selectedFriends.map((f) => f.value);
    const groupChat = await directMessageService.createGroupChat(
      currentUser.id,
      participantIds,
      groupTitle,
      messageContent
    )
    navigate(`/groupChat/${groupChat.id}`);
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <div className="flex justify-between items-center px-6 py-3 bg-white shadow-sm">
        <Logo />
        <button
          onClick={() => setShowPopup(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + New Message
        </button>
      </div>

      <main className="px-6 py-6">
        <h2 className="text-3xl font-bold mb-6">Direct Messages</h2>

        {loading ? (
          <p>Loading conversations...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : conversations.length === 0 ? (
          <p className="text-gray-500">You have no conversations yet.</p>
        ) : (
          <div className="bg-white shadow rounded-lg p-4 space-y-4">
            {conversations
              .sort(
                (a, b) =>
                  new Date(b.lastMessage?.timestamp) -
                  new Date(a.lastMessage?.timestamp)
              )
              .map((conv, idx) => {
                const lastMessage = conv.lastMessage || {};
                const lastMessageContent = lastMessage.content;
                const lastMessageTime = lastMessage.timestamp;
                const otherUser = conv.participants?.find(
                  (p) => p.id !== currentUser.id
                );
                const isGroup = !!conv.groupTitle;
                const title = isGroup
                  ? conv.groupTitle
                  : otherUser
                  ? otherUser.displayName || otherUser.unityId || "Unknown User"
                  : "Unknown User";
                const avatarSrc = isGroup
                  ? "/group-avatar.png"
                  : otherUser?.profilePictureUrl || "/default-avatar.png";

                return (
                  console.log(conv),
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 border-b last:border-b-0 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/groupChat/${conv.id}`
                      )
                    }
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={avatarSrc}
                        alt={title}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold">{title}</p>
                        <p className="text-gray-600 text-sm truncate w-64">
                          {lastMessageContent || "No messages yet..."}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {lastMessageTime
                        ? new Date(lastMessageTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--:--"}
                    </span>
                  </div>
                );
              })}
          </div>
        )}
      </main>

      {showPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              onClick={() => setShowPopup(false)}
            >
              ✕
            </button>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group Title (optional)
              </label>
              <input
                type="text"
                value={groupTitle}
                onChange={(e) => setGroupTitle(e.target.value)}
                placeholder="Enter group title"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Friends
              </label>
              <Select
                options={friends}
                isMulti
                onChange={(selected) => setSelectedFriends(selected)}
                placeholder="Search and select friends..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message here..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
                rows={3}
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectMessages;
