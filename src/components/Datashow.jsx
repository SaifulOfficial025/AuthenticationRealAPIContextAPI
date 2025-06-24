
import React, { useContext, useState, useRef } from 'react';
import { DataContext, DataProvider } from '../context/DataContext'; // ✅ Make sure this line exists


function Data1() {
  const { data, loading, addPost, updatePost, deletePost } = useContext(DataContext);

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const formRef = useRef(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const imageInputRef = useRef(null);


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !description || !price || (!image && !isEdit)) {
      return alert('Please fill in all fields and upload an image.');
    }

    const post = { name, description, price, image };

    if (isEdit) {
      updatePost(editId, post);
      alert('Post updated successfully!');
      resetForm(); // ✅ Call after either action
    } else {
      addPost(post);
      alert('Post added successfully!');
    }

    resetForm();
  };

  const handleEdit = (post) => {
    setName(post.name);
    setDescription(post.description);
    setPrice(post.price);
    setImage(post.image); // could be a string URL (backend-sent)
    setIsEdit(true);
    setEditId(post.id);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    
  };

  const resetForm = () => {
    setIsEdit(false);
    setEditId(null);
    setName('');
    setDescription('');
    setPrice('');
    setImage(null);

    if (imageInputRef.current) {
      imageInputRef.current.value = ''; // ✅ this actually resets the input field
    }

  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-8 font-serif">📝 Blog Posts</h1>

      <div className="w-full bg-gray-100 px-4 py-8" ref={formRef}>
        <div className="bg-white p-8 rounded-xl shadow-md w-full mb-5">
          <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center font-serif">
            {isEdit ? '✏️ Edit Post' : '➕ Add New Post'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="description" className="mt-5 block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                rows="4"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
              />
            </div>

            <div>
              <label htmlFor="price" className="mt-5 block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="text"
                id="price"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
  <label htmlFor="image" className="mt-5 block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
  <div className="relative">
    <input
      type="file"
      id="image"
      accept="image/*"
      ref={imageInputRef}
      onChange={(e) => setImage(e.target.files[0])}
      className="sr-only"
    />
    <label
      htmlFor="image"
      className="flex items-center justify-center w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-100"
    >
      {image instanceof File ? image.name : "📁 Choose an image"}
    </label>
  </div>
  {isEdit && typeof image === 'string' && (
    <p className="text-sm text-gray-500 mt-1">Current image will be kept unless replaced.</p>
  )}
</div>


            <div className="md:col-span-2">
              <button
                type="submit"
                className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold text-lg"
              >
                {isEdit ? '✅ Update Post' : '➕ Add Post'}
              </button>
              {isEdit && (
                <button
                  type="button"
                  className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-semibold text-lg"
                  onClick={resetForm}
                >
                  ❌ Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-6">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200"
          >
            <img src={item.image} alt="" className="w-full h-60 object-cover rounded-t-2xl" />
            <div className="p-4">
              <p className="text-sm text-gray-400 mb-1">Product ID: {item.id}</p>
              <h2 className="text-lg font-semibold text-blue-700">{item.name}</h2>
              <p className="text-sm text-gray-700">{item.description}</p>
              <p className="text-3xl font-bold text-orange-700 mt-2">${item.price}</p>
              <div className="flex justify-center gap-4 mt-4">
                <button onClick={() => handleEdit(item)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  Edit
                </button>
                <button onClick={() => deletePost(item.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Export wrapped with context
export default function Datashow() {
  return (
    <DataProvider>
      <Data1 />
    </DataProvider>
  );
}
