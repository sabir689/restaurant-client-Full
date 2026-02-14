import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  
  // Navigation Links
  const navOptions = (
    <>
      <li><NavLink to="/" className={({ isActive }) => isActive ? "text-yellow-400 font-bold" : "text-black font-bold"}>HOME</NavLink></li>
      <li><NavLink to="/contact" className={({ isActive }) => isActive ? "text-yellow-400 font-bold" : "text-black font-bold"}>CONTACT US</NavLink></li>
      <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-yellow-400 font-bold" : "text-black font-bold"}>DASHBOARD</NavLink></li>
      <li><NavLink to="/menu" className={({ isActive }) => isActive ? "text-yellow-400 font-bold" : "text-black font-bold"}>OUR MENU</NavLink></li>
      <li><NavLink to="/shop" className={({ isActive }) => isActive ? "text-yellow-400 font-bold" : "text-black font-bold"}>OUR SHOP</NavLink></li>
    </>
  );

  return (
    // Fixed container with max-width and centering for big screens
    <div className="navbar fixed z-10 shadow-amber-300 shadow-2xl bg-opacity-30 text-black mx-auto left-0 right-0">
      <div className="navbar-start">
        {/* Mobile Dropdown */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {/* FIXED SVG PATH BELOW */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-black bg-opacity-90 rounded-box w-52 text-white">
            {navOptions}
          </ul>
        </div>
        
        {/* Brand Logo */}
        <Link to="/" className="flex flex-col items-start gap-0 normal-case ml-2 font-cinzel">
          <span className="text-xl font-black tracking-widest leading-none">BISTRO BOSS</span>
          <span className="text-sm font-bold tracking-[0.3em] leading-none uppercase">Restaurant</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navOptions}
        </ul>
      </div>

      <div className="navbar-end gap-3 px-4">
        {/* Cart Icon */}
        <div className="indicator">
          <span className="indicator-item badge badge-secondary border-none bg-orange-600 text-white h-5 w-5 p-0">0</span>
          <button className="btn btn-ghost btn-circle bg-green-800 hover:bg-green-700">
            <img src="https://img.icons8.com/material-outlined/24/ffffff/shopping-cart--v1.png" alt="cart" className="w-6" />
          </button>
        </div>

        {/* User */}
        <div className="flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition-colors">
          <Link to='/signIn'>
          <span  className="font-bold hidden sm:inline uppercase">Sign In</span></Link>
          <div className="avatar">
            <div className="w-10 rounded-full border-2 border-white">
              <img src="https://img.icons8.com/ios-filled/50/ffffff/user-male-circle.png" alt="user" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;