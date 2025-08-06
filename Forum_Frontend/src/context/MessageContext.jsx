// context/MessageContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { messageService } from '../services/messageService';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await messageService.getAllMessages();
      setMessages(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessageById = async (id) => {
    setLoading(true);
    try {
      const all = await messageService.getMessageById(id);
      if (all) {
        setSelectedMessage(all);
        setError(null);
      } else {
        throw new Error('Message not found');
      }
    } catch (err) {
      console.error('Error fetching message by ID:', err);
      setError('Failed to fetch selected message');
      setSelectedMessage(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const value = {
    messages,
    selectedMessage,
    loading,
    error,
    setSelectedMessage,
    fetchMessages,
    fetchMessageById,
    getMessageById: (id) => messages.find(m => m.id === id),
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};

export { MessageContext };