import React, { createContext, useState, useEffect } from 'react';

export const ImageContext = createContext();

const API_URL = 'https://picsum.photos/v2/list?page=1&limit=10'; // JSON list

export const ImageProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      const formatted = json.map(img => ({
        id: img.id,
        title: img.author,
        image: img.download_url,
      }));
      setImages(formatted);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = (newImage) => {
    setImages(prev => [...prev, newImage]); // Mocking upload
  };

  const deleteImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <ImageContext.Provider value={{ images, loading, uploadImage, deleteImage }}>
      {children}
    </ImageContext.Provider>
  );
};
