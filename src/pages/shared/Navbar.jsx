import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  
  // Navigation Links to avoid repetition
  const navOptions = (
    <>
      <li><NavLink to="/" className={({ isActive }) => isActive ? "text-yellow-400" : "text-white"}>HOME</NavLink></li>
      <li><NavLink to="/contact">CONTACT US</NavLink></li>
      <li><NavLink to="/dashboard">DASHBOARD</NavLink></li>
      <li><NavLink to="/menu">OUR MENU</NavLink></li>
      <li><NavLink to="/shop">OUR SHOP</NavLink></li>
    </>
  );

  return (
    <div className="navbar fixed z-10  shadow-2xl bg-opacity-30 text-white">
      <div className="navbar-start">
        {/* Mobile Dropdown */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-black font-bold">
            {navOptions}
          </ul>
        </div>
        
        {/* Brand Logo */}
        <Link to="/" className="flex flex-col items-start gap-0 normal-case ml-2">
          <span className="text-xl font-black tracking-widest leading-none">BISTRO BOSS</span>
          <span className="text-sm font-bold tracking-[0.3em] leading-none">RESTAURANT</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-bold">
          {navOptions}
        </ul>
      </div>

      <div className="navbar-end gap-3 px-4">
        {/* Cart Icon with Badge */}
        <div className="indicator">
          <span className="indicator-item badge badge-error text-white h-5 w-5 p-0">1</span>
          <button className="btn btn-ghost btn-circle bg-green-800 hover:bg-green-700">
            <img src="https://img.icons8.com/material-outlined/24/ffffff/shopping-cart--v1.png" alt="cart" className="w-6" />
          </button>
        </div>

        {/* Sign Out / User Profile */}
        <div className="flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition-colors">
          <span className="font-bold hidden sm:inline">SIGN OUT</span>
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