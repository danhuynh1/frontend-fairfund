// src/components/Navbar.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-green-800 text-white p-3 flex justify-between items-center shadow-md">
      {/* Logo and App Name */}
      <Link
        to="/"
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <span className="text-xl font-bold tracking-wider">
          {" "}
          <img
            src="/logo.png"
            alt="FairFund Logo"
            className="h-24 max-w-full tracking"
          />
        </span>
        <p>Budgeting Friendly</p>
      </Link>

      {user && (
        <div className="flex items-center">
          <span className="mr-4 hidden sm:inline">Welcome, {user.name}</span>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
