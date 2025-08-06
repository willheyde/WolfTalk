import axios from 'axios';

axios.defaults.withCredentials = true; // Ensures cookies are sent with requests
const API_BASE_URL = '';

export const userService = {
  async fetchCurrentUser() {
    const res = await fetch(`/api/profile`, {
      credentials: 'include'
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  },

  logout() {
    window.location.href = '/Shibboleth.sso/Logout';
  },

  async fetchCurrentUserByUnityId(unityId) {
    const res = await fetch(`/api/profile/${unityId}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  },

  async addFriend(currentUser, friend) {
    console.log(currentUser, friend);
    const res = await fetch(`/api/profile/${currentUser}/add-friend/${friend}`, {
      method: 'POST',
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.text(); // Because your backend returns a plain text response
  },

  async getFriendStatus(currentUser, friend) {
    const res = await fetch(`/api/profile/${currentUser}/add-friend/${friend}`, {
      method: 'GET',
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.text(); // Backend returns plain status string: PENDING, FRIENDS, NONE
  },
  async getFriends(currentUserId) {
    console.log("seen");
    const res = await fetch(`/api/profile/${currentUserId}/friends`, {
      methopd: 'GET',
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.text();  
  }
};