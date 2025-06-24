import React, { createContext, useState, useEffect, useCallback } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://192.168.10.210:8000/api";

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
      const formData = new FormData();
      formData.append('name', newPost.name);
      formData.append('description', newPost.description);
      formData.append('price', newPost.price);

      if (newPost.image instanceof File) {
        formData.append('image', newPost.image);
      } else {
        alert('Please upload a valid image.');
        return;
      }

      const res = await fetch(`${API_URL}/`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to add post');

      const savedPost = await res.json();
      setData((prev) => [...prev, savedPost]);
    } catch (error) {
      console.error("Add post failed:", error);
      alert("Add post failed. Please check your inputs or server.");
    }
  };

  const updatePost = async (id, updatedPost) => {
    try {
      const formData = new FormData();
      formData.append('name', updatedPost.name);
      formData.append('description', updatedPost.description);
      formData.append('price', updatedPost.price);

      if (updatedPost.image instanceof File) {
        formData.append('image', updatedPost.image);
      }

      const res = await fetch(`${API_URL}/${id}/`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) throw new Error('Update failed');

      const updated = await res.json();
      setData((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
    } catch (error) {
      console.error("Update post failed:", error);
    }
  };

  const deletePost = useCallback(async (id) => {
    try {
      if (!window.confirm('Are you sure you want to delete this post?')) return;

      await fetch(`${API_URL}/${id}/`, {
        method: 'DELETE',
      });

      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, addPost, updatePost, deletePost }}>
      {children}
    </DataContext.Provider>
  );
};
