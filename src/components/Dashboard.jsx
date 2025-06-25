// src/components/Dashboard.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHistory } from 'react-router-dom';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const history = useHistory();

  const handleChangePassword = () => {
    history.push('/change-password'); // or open modal if you prefer
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user?.username || 'User'} 👋</h2>
        <p className="text-gray-600 mb-6">You have successfully logged in to your dashboard.</p>

        <button
          onClick={handleChangePassword}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
