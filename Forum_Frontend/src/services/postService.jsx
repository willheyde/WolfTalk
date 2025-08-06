// services/postService.js
const API_BASE_URL = 'http://localhost:8080/api';

export const postService = {
  // Get posts with filters
  getPosts: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (filters.departmentId) queryParams.append('department', filters.departmentId);
      if (filters.courseCode) queryParams.append('course', filters.courseCode);
      if (filters.professorId) queryParams.append('professor', filters.professorId);
      if (filters.tag) queryParams.append('tag', filters.tag);
      if (filters.userId) queryParams.append('user', filters.userId);
      if (filters.sortBy) queryParams.append('sort', filters.sortBy);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      const url = `${API_BASE_URL}/posts${queryParams.toString() ? `?${queryParams}` : ''}`;
      const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Get post by ID
  getPostById: async (postId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(res.status === 404 ? 'Post not found' : `HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  // Like a post
  addLiked: async (id, unityId) => {
    try{
    const res = await fetch(`${API_BASE_URL}/posts/${id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unityId }),
    });
    if (!res.ok) throw new Error('Like failed');
    return res.json();
  }catch(error){
    console.error(error);
    throw error;
  }
  },
  removeDisliked: async (id, unityId) => {
    try{
    const res = await fetch(`${API_BASE_URL}/posts/${id}/remove/dislike`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unityId }),
    });
    if (!res.ok) throw new Error('Like failed');
    return res.json();
  }catch(error){
    console.error(error);
    throw error;
  }
  },
  removeLiked: async (id, unityId) => {
    try{
    const res = await fetch(`${API_BASE_URL}/posts/${id}/remove/like`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unityId }),
    });
    if (!res.ok) throw new Error('Like failed');
    return res.json();
  }catch(error){
    console.error(error);
    throw error;
  }
  },

  // Dislike a post
  addDisliked: async (id, unityId) => {
    try{
    const res = await fetch(`${API_BASE_URL}/posts/${id}/dislike`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unityId }),
    });
    if (!res.ok) throw new Error('Like failed');
    return res.json();
  }catch(error){
    console.error(error);
    throw error;
  }
  },

  // Create a new post
  createPost: async (data) => {
    console.log(data);
    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        senderId: data.senderId,
        departmentId: +data.departmentId ? +data.departmentId : null,
        classId: data.classId ? +data.classId : null,
        professorId: data.professorId ? +data.professorId : null,
        parentId: data.parentId || null
      }),
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  },
  // Update post
  updatePost: async (postId, updates) => {
    try {
      console.log(updates);
      const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // Delete post
  deletePost: async (postId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // Vote on post (generic)
  voteOnPost: async (postId, voteType) => {
    try {
      const res = await fetch(`${API_BASE_URL}/posts/${postId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ voteType }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error voting on post:', error);
      throw error;
    }
  },

  // Report post
  reportPost: async (postId, reason) => {
    try {
      const res = await fetch(`${API_BASE_URL}/posts/${postId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error reporting post:', error);
      throw error;
    }
  },

  // Convenience methods
  getPostsByProfessor: async (professorId, options = {}) => postService.getPosts({ ...options, professorId }),
  getPostsByCourse: async (courseCode, options = {}) => postService.getPosts({ ...options, courseCode }),
  getPostsByTag: async (tag, options = {}) => postService.getPosts({ ...options, tag }),

  // Search posts
  searchPosts: async (searchTerm, filters = {}) => {
    try {
      const queryParams = new URLSearchParams({ q: searchTerm });
      for (const [key, value] of Object.entries(filters)) {
        if (value) queryParams.append(key, value);
      }
      const res = await fetch(`${API_BASE_URL}/posts/search?${queryParams}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  },

  // Get trending posts
  getTrendingPosts: async (limit = 10) => {
    try {
      const res = await fetch(`${API_BASE_URL}/posts/trending?limit=${limit}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      throw error;
    }
  },
  
};
