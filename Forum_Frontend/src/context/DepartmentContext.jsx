import React, { createContext, useContext, useState, useEffect } from 'react';
import { departmentService } from '../services/DepartmentService';

const DepartmentContext = createContext();

export const useDepartment = () => {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error('useDepartment must be used within a DepartmentProvider');
  }
  return context;
};

export const DepartmentProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [departmentPosts, setDepartmentPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [professors, setProfessors] = useState([]);


  // Fetch all departments
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const data = await departmentService.getAllDepartments();
      setDepartments(data); 
      setError(null);
    } catch (err) {
      setError('Failed to fetch departments');
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific department by ID (with eager-loaded relations)
  const fetchDepartmentById = async (deptId) => {
    setLoading(true);
    try {
      const dept = await departmentService.getDepartmentById(deptId);
      setCurrentDepartment(dept);
      setClasses(dept.classes);
    setProfessors(dept.professors);

      return dept;
    } catch(err) {
      console.error('Error fetching department:', err);
      setError('Failed to load department');
      return null;
    } finally {
      setLoading(false);
    }
  };
  // Fetch posts and enrich them with linked class/professor info
  const fetchDepartmentPosts = async (deptId) => {
    setLoading(true);
    setDepartmentPosts([]);
    try {
      const posts = await departmentService.getDepartmentPosts(deptId);
      console.log(posts)
      setDepartmentPosts(posts);
      setError(null);
    } catch (err) {
      setError('Failed to fetch department posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load all departments on mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const value = {
    // State
    departments,
    currentDepartment,
    departmentPosts,
    loading,
    error,
    classes,
    professors,

    // Actions
    fetchDepartments,
    fetchDepartmentById,
    fetchDepartmentPosts,
    setCurrentDepartment,

    // Helpers
    getDepartmentById: (id) => departments.find(d => d.id === id),
    getDepartmentByCode: (code) => departments.find(d => d.code === code),
  };

  return (
    <DepartmentContext.Provider value={value}>
      {children}
    </DepartmentContext.Provider>
  );
};
