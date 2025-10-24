import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-purple-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">EventReminder</Link>

      <div className="space-x-4">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-200">Login</Link>
            <Link to="/signup" className="hover:text-gray-200">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
