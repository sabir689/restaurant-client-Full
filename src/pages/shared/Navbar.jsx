import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { FiLogOut, FiUser, FiHome, FiMenu, FiShoppingBag, FiMessageSquare } from "react-icons/fi";

const Navbar = () => {
    const { user, logOut } = useAuth();
    const [cart] = useCart();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogOut = () => {
        logOut().catch((error) => console.log(error));
    };

    const navLinks = [
        { name: "HOME", path: "/", icon: <FiHome /> },
        { name: "OUR SHOP", path: "/order/salad", icon: <FiShoppingBag /> },
        { name: "OUR MENU", path: "/menu", icon: <FiMenu /> },
        { name: "CONTACT", path: "/contact", icon: <FiMessageSquare /> },
    ];

    return (
        <>
            {/* Desktop & Tablet Top Navbar */}
            <nav className={`fixed top-0 left-0 w-full z-[60] transition-all duration-500 px-4 py-2 lg:px-8 
                ${scrolled ? "mt-0" : "mt-0 lg:mt-0"}`}>
                
                <div className={`max-w-7xl mx-auto rounded-2xl lg:rounded-[2rem] transition-all duration-500 
                    ${scrolled 
                        ? "bg-black/80 backdrop-blur-xl shadow-2xl shadow-yellow-500/10 border border-white/10" 
                        : "bg-transparent"}`}>
                    
                    <div className="navbar px-4 py-2 lg:py-3">
                        {/* LEFT: Logo & Mobile Toggle */}
                        <div className="navbar-start">
                            <button 
                                onClick={() => setIsMenuOpen(true)}
                                className="btn btn-ghost lg:hidden text-white mr-2 p-0"
                            >
                                <FaBars className="text-xl" />
                            </button>

                            <Link to="/" className="flex flex-col leading-none font-cinzel group">
                                <span className="text-xl lg:text-2xl font-black tracking-widest text-white group-hover:text-yellow-400 transition-colors">
                                    BISTRO<span className="text-yellow-400 group-hover:text-white">BOSS</span>
                                </span>
                                <span className="text-[10px] font-semibold tracking-[0.4em] uppercase text-gray-300 hidden sm:block">
                                    Restaurant
                                </span>
                            </Link>
                        </div>

                        {/* CENTER: Desktop Menu */}
                        <div className="navbar-center hidden lg:flex">
                            <ul className="flex items-center gap-2">
                                {navLinks.map((item) => (
                                    <li key={item.path}>
                                        <NavLink
                                            to={item.path}
                                            className={({ isActive }) => `
                                                relative px-4 py-2 text-xs font-black tracking-widest transition-all duration-300
                                                ${isActive ? "text-yellow-400" : "text-white hover:text-yellow-300"}
                                            `}
                                        >
                                            {item.name}
                                        </NavLink>
                                    </li>
                                ))}
                                {user && (
                                    <li>
                                        <NavLink to="/dashboard" className={({ isActive }) => `px-4 py-2 text-xs font-black tracking-widest ${isActive ? "text-yellow-400" : "text-white"}`}>
                                            DASHBOARD
                                        </NavLink>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* RIGHT: Actions */}
                        <div className="navbar-end gap-1 lg:gap-4">
                            {/* Cart Icon */}
                            <Link to="/dashboard/cart" className="relative group">
                                <div className="p-3 bg-white/10 hover:bg-yellow-400 rounded-xl lg:rounded-2xl transition-all duration-300 group-hover:scale-110">
                                    <FaShoppingCart className="text-lg lg:text-xl text-white group-hover:text-black transition-colors" />
                                    {cart?.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-black animate-bounce">
                                            {cart.length}
                                        </span>
                                    )}
                                </div>
                            </Link>

                            {/* User Profile */}
                            {user ? (
                                <div className="dropdown dropdown-end">
                                    <label tabIndex={0} className="cursor-pointer">
                                        <div className="avatar transition-transform hover:scale-105 active:scale-95">
                                            <div className="w-10 lg:w-12 rounded-xl lg:rounded-2xl ring-2 ring-yellow-400 ring-offset-2 ring-offset-black">
                                                <img src={user?.photoURL || "https://img.icons8.com/ios-filled/50/ffffff/user-male-circle.png"} alt="User" />
                                            </div>
                                        </div>
                                    </label>
                                    <ul tabIndex={0} className="dropdown-content menu p-3 shadow-2xl bg-black/95 backdrop-blur-2xl rounded-2xl w-56 border border-white/10 mt-4 space-y-2">
                                        <li className="menu-title text-gray-500 text-[10px] uppercase tracking-widest px-4 py-2">Account</li>
                                        <li><Link to="/dashboard" className="text-white hover:bg-yellow-400 hover:text-black rounded-xl py-3"><FiUser /> Profile</Link></li>
                                        <li><button onClick={handleLogOut} className="text-red-400 hover:bg-red-500 hover:text-white rounded-xl py-3"><FiLogOut /> Sign Out</button></li>
                                    </ul>
                                </div>
                            ) : (
                                <Link to="/signIn" className="btn btn-sm lg:btn-md bg-yellow-400 hover:bg-white text-black font-black border-none rounded-xl lg:rounded-2xl px-6 transition-all hover:shadow-[0_0_20px_rgba(250,204,21,0.4)]">
                                    LOGIN
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* FULLSCREEN MOBILE MENU OVERLAY */}
            <div className={`fixed inset-0 z-[100] transition-all duration-500 lg:hidden ${isMenuOpen ? "visible" : "invisible"}`}>
                {/* Backdrop */}
                <div className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${isMenuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsMenuOpen(false)} />
                
                {/* Drawer */}
                <div className={`absolute top-0 left-0 w-[80%] max-w-sm h-full bg-slate-950 p-8 shadow-2xl transition-transform duration-500 ease-out border-r border-white/10 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="flex justify-between items-center mb-12">
                        <div className="font-cinzel">
                            <h2 className="text-xl font-black text-white tracking-widest">BISTRO<span className="text-yellow-400">BOSS</span></h2>
                        </div>
                        <button onClick={() => setIsMenuOpen(false)} className="text-white p-2 bg-white/5 rounded-lg">
                            <FaTimes />
                        </button>
                    </div>

                    <ul className="space-y-4">
                        {navLinks.map((item) => (
                            <li key={item.path} onClick={() => setIsMenuOpen(false)}>
                                <NavLink to={item.path} className={({ isActive }) => `
                                    flex items-center gap-4 p-4 rounded-2xl font-bold transition-all
                                    ${isActive ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20" : "text-white hover:bg-white/5"}
                                `}>
                                    <span className="text-xl">{item.icon}</span>
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                        {user && (
                            <li onClick={() => setIsMenuOpen(false)}>
                                <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl font-bold ${isActive ? "bg-yellow-400 text-black" : "text-white"}`}>
                                    <FiUser className="text-xl" /> DASHBOARD
                                </NavLink>
                            </li>
                        )}
                    </ul>

                    <div className="absolute bottom-8 left-8 right-8 text-center border-t border-white/10 pt-8">
                        <p className="text-gray-500 text-[10px] tracking-widest uppercase mb-4">Fine Dining Since 1992</p>
                        {!user && (
                            <Link to="/signIn" onClick={() => setIsMenuOpen(false)} className="btn btn-block bg-white text-black border-none rounded-xl">Sign In</Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;