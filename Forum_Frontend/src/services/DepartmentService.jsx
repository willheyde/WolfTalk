// services/departmentService.js
const API_BASE_URL = 'http://localhost:8080/api';

export const departmentService = {
  // Get all departments
  async getAllDepartments() {
    const res = await fetch(`${API_BASE_URL}/departments`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
  // Get a department with its relations (classes, professors, messages)
  async getDepartmentById(deptId) {
    const res = await fetch(`${API_BASE_URL}/departments/${deptId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      if (res.status === 404) throw new Error('Department not found');
      throw new Error(`HTTP ${res.status}`);
    }
    
    return res.json();
  },

  // Get department posts (messages), and link related class/professor objects using message.clazz
  async getDepartmentPosts(deptId) {
    const dept = await this.getDepartmentById(deptId);
    console.log(dept);
    const msgs = Array.isArray(dept.messages) ? dept.messages : [];
    return msgs.map(msg => {
      // 1) keep the class exactly as the backend gave it
      const course = msg.clazz || null;

      // 2) first look for an explicit msg.professor, then fall back to the 
      //    first professor listed on the class (if any)
      let prof = null;
      if (msg.professor) {
        prof = msg.professor;
      } else if (course?.professors?.length) {
        prof = course.professors[0];
      }

      return {
        ...msg,
        // Note: using "class" here to match your PostList, but you could rename to "course"
        class:     course,
        professor: prof,
        likedBy:    Array.isArray(msg.likedBy)    ? msg.likedBy    : [],
        dislikedBy: Array.isArray(msg.dislikedBy) ? msg.dislikedBy : []
      };
    });
   },

  // Create new department
  async createDepartment(dept) {
    const res = await fetch(`${API_BASE_URL}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dept)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  // Update department
  async updateDepartment(deptId, updatedDept) {
    const res = await fetch(`${API_BASE_URL}/departments/${deptId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedDept)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  // Delete department
  async deleteDepartment(deptId) {
    const res = await fetch(`${API_BASE_URL}/departments/${deptId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },
  async getDepartmentByName(name) {
    // make sure to URI‑encode in case of spaces/special chars
    const url = `${API_BASE_URL}/departments/specificId/${encodeURIComponent(name)}`;
    return fetch(url, {
    });
  }
};
