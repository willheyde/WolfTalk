// src/context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departmentId, setDepartmentId] = useState(null); // Useful for department page linking

  const fetchUser = async () => {
    setLoading(true);
    try {
      const user = await userService.fetchCurrentUser();
      setCurrentUser(user);
      if (user?.departmentId) {
        setDepartmentId(user.departmentId);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch current user', err);
      setError('Unable to load user');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserByUnityId = async (unityId) => {
    setLoading(true);
    try {
      const user = await userService.fetchCurrentUserByUnityId(unityId);
      setProfileUser(user);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user by Unity ID', err);
      setError('Unable to load profile');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    userService.logout();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        profileUser,
        fetchUser,
        fetchUserByUnityId,
        loading,
        error,
        logout,
        departmentId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
