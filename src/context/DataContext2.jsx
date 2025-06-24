import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const DataContext2 = createContext();

// Create the provider component
export const DataProvider2 = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

//   const API_URL = "https://6851d70b8612b47a2c0b6424.mockapi.io/blog";
  const API_URL = "https://68549c9c6a6ef0ed662f90d7.mockapi.io/User";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addPost = async (newPost) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      const savedPost = await res.json();
      setData((prev) => [...prev, savedPost]);
    } catch (error) {
      console.error("Add post failed:", error);
    }
  };

  const updatePost = async (id, updatedPost) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost),
      });
      const updated = await res.json();
      setData((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
    } catch (error) {
      console.error("Update post failed:", error);
    }
  };


  const deletePost = async (id) => {
    try {
      alert('Are you sure to delete this post?') 
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <DataContext2.Provider value={{ data, loading, addPost, updatePost, deletePost }}>
      {children}
    </DataContext2.Provider>
  );
};
