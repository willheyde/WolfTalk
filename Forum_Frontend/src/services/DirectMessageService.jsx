import axios from 'axios';

axios.defaults.withCredentials = true; // Ensures cookies are sent with requests
const API_BASE_URL = 'http://localhost:8080/api';

export const directMessageService = {
  async sendMessage(userId, groupId, content) {
    const res = await fetch(`${API_BASE_URL}/groupchat/send/${groupId}/${userId}`, {
      method: 'POST',
      body: content
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  },

  async getRecentConversations(userId) {
    const res = await fetch(`${API_BASE_URL}/messages/direct-message/${userId}`);
    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  },

  async getConversationWithUser(user1Id, user2Id) {
    const res = await fetch(`${API_BASE_URL}/direct/direct-message/${user1Id}/${user2Id}`);

    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  },
  async createGroupChat(userId, participantIds, groupTitle, content) {
    const res = await fetch(`${API_BASE_URL}/messages/create/${userId}`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'   // ← tell Spring it’s JSON
    },
      body: JSON.stringify({ participantIds, groupTitle, content })
    })
    if (!res.ok) {  
      if (res.status === 404) return [];
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  },
  async getGroupChatMessages(groupId) {
    console.log("GroupId here:", groupId);
    const res = await fetch(`${API_BASE_URL}/groupchat/${groupId}`, {
      method: "GET"
    });
    if (!res.ok) {  
      if (res.status === 404) return [];
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
    
  }
};
