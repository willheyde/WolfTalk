// services/messageService.js
const API_BASE_URL = 'http://localhost:8080/api';

export const messageService = {
  // Get all messages/posts
  async getAllMessages() {
    const res = await fetch(`${API_BASE_URL}/posts`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  // Get a message by ID (if endpoint exists)
  async getMessageById(id) {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`);
    if (!res.ok) {
      if (res.status === 404) throw new Error('Message not found');
      throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
  }
};
