// src/components/Navbar.jsx

import React, { useState, useContext } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const history = useHistory(); // if you want to redirect after logout
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    history.push("/login");
  };

  const linkClasses = (path) =>
    `block px-4 py-2 rounded-md text-sm font-medium ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">PicX</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <Link to="/" className={linkClasses("/")}>Home</Link>
          <Link to="/datashow" className={linkClasses("/datashow")}>Real API</Link>
          <Link to="/datashow2" className={linkClasses("/datashow2")}>Mock API</Link>
          <Link to="/image" className={linkClasses("/image")}>Image</Link>

          {user ? (
            <button onClick={handleLogout} className={linkClasses("/login")}>Logout</button>
          ) : (
            <Link to="/login" className={linkClasses("/login")}>Login</Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 space-y-1 px-2">
          <Link to="/" className={linkClasses("/")} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/datashow" className={linkClasses("/datashow")} onClick={() => setMenuOpen(false)}>Real API</Link>
          <Link to="/datashow2" className={linkClasses("/datashow2")} onClick={() => setMenuOpen(false)}>Mock API</Link>
          <Link to="/image" className={linkClasses("/image")} onClick={() => setMenuOpen(false)}>Image</Link>
          {user ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className={linkClasses("/login")}>
              Logout
            </button>
          ) : (
            <Link to="/login" className={linkClasses("/login")} onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
