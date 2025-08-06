import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { directMessageService } from "../services/DirectMessageService";

const DirectMessageContext = createContext();

export const DirectMessageProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [groupChatData, setGroupChatData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  

  const fetchConversationByGroupId = useCallback(async (groupId) => {
    setLoading(true);
    try {
      const data = await directMessageService.getGroupChatMessages(groupId);
      setGroupChatData(data);
      setError(null);
      return data;
    } catch (err) {
      console.error("Failed to load group chat", err);
      setError("Could not load group chat");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecentConversations = useCallback(async (userId) => {
  setLoading(true);
  try {
    const convos = await directMessageService.getRecentConversations(userId);
    setConversations(convos);
    setError(null);
    return convos;                   // <-- return it
  } catch (err) {
    console.error("Failed to load recent conversations", err);
    setError("Could not load recent conversations");
    return [];                       // <-- on error return empty
  } finally {
    setLoading(false);
  }
}, []);

  const fetchConversationWithUser = useCallback(async (currentUserId, otherUserId) => {
    setLoading(true);
    try {
      const msgs = await directMessageService.getConversationWithUser(currentUserId, otherUserId);
      setMessages(msgs);
      setSelectedUserId(otherUserId);
      setError(null);
    } catch (err) {
      console.error("Failed to load conversation with user", err);
      setError("Could not load conversation");
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (senderId, receiverId, content) => {
    try {
      const newMessage = await directMessageService.sendMessage(senderId, receiverId, content);
      setMessages(prev => [...prev, newMessage]);
      setError(null);
    } catch (err) {
      console.error("Failed to send message", err);
      setError("Failed to send message");
    }
  }, []);

  const contextValue = {
    conversations,
    messages,
    selectedUserId,
    loading,
    error,
    groupChatData,
    fetchRecentConversations,
    fetchConversationWithUser,
    sendMessage,
    fetchConversationByGroupId,
  };

  return (
    <DirectMessageContext.Provider value={contextValue}>
      {children}
    </DirectMessageContext.Provider>
  );
};

export const useDirectMessage = () => useContext(DirectMessageContext);

export default DirectMessageProvider;
