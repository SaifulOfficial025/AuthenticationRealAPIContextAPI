// src/context/AuthContext.jsx

import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    try {
      const res = await fetch('http://192.168.10.210:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email, // backend expects 'username'
          password,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Login failed');
      }

      const data = await res.json();

      // Store tokens
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);

      // Set user
      const loggedInUser = { username: email }; // Or decode token to get username
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };



  const register = async (email, password, username) => {
    try {
      const res = await fetch('http://192.168.10.210:8000/user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,  // 🔁 properly labeled
          email: email,
          password: password,
        }),
      });
  
      if (!res.ok) {
        const err = await res.json();
        console.log("🚨 Register error response:", err);
        throw new Error(err.detail || 'Registration failed');
      }
  
      // auto-login after register
      return await login(username, password);
  
    } catch (err) {
      return { success: false, message: err.message };
    }
  };
  



  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
