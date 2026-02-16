import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import { FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
    const { user, logOut } = useAuth();
    const [cart] = useCart();

    const handleLogOut = () => {
        logOut()
            .then(() => { })
            .catch(error => console.log(error));
    }

    const navOptions = (
        <>
            <li><NavLink to="/" className={({ isActive }) => isActive ? "text-yellow-400 font-bold" : "text-white font-bold"}>HOME</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => isActive ? "text-yellow-400 font-bold" : "text-white font-bold"}>CONTACT US</NavLink></li>
            <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-yellow-400 font-bold" : "text-white font-bold"}>DASHBOARD</NavLink></li>
            <li><NavLink to="/menu" className={({ isActive }) => isActive ? "text-yellow-400 font-bold" : "text-white font-bold"}>OUR MENU</NavLink></li>
            <li><NavLink to="/order/salad" className={({ isActive }) => isActive ? "text-yellow-400 font-bold" : "text-white font-bold"}>OUR SHOP</NavLink></li>
        </>
    );

    return (
        <div className="navbar fixed z-10 shadow-2xl shadow-amber-300 py-4 bg-opacity-30 text-white mx-auto">
            <div className="navbar-start">
                {/* Mobile Menu */}
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-black bg-opacity-90 rounded-box w-52">
                        {navOptions}
                    </ul>
                </div>

                {/* Logo Section */}
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

            <div className="navbar-end gap-3 px-2">
                {/* Shopping Cart Button */}
                <Link to="/dashboard/cart">
                    <button className="btn btn-ghost bg-green-900 hover:bg-green-800 border-none relative mr-4">
                        <FaShoppingCart className="text-xl" />
                        <div className="badge badge-secondary border-none bg-orange-600 absolute -top-2 -right-2">
                            +{cart?.length || 0}
                        </div>
                    </button>
                </Link>

                {/* User Section (Login/Logout Toggle) */}
                {
                    user ? (
                        <div className="flex items-center gap-4">
                            <button onClick={handleLogOut} className="btn btn-ghost font-bold uppercase hover:text-yellow-400">
                                LogOut
                            </button>
                            <div className="avatar tooltip tooltip-left" data-tip={user?.displayName}>
                                <div className="w-10 rounded-full border-2 border-white ring ring-yellow-400 ring-offset-base-100 ring-offset-2">
                                    <img 
                                        src={user?.photoURL || "https://img.icons8.com/ios-filled/50/ffffff/user-male-circle.png"} 
                                        alt="User Avatar" 
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link to="/signIn" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
                            <span className="font-bold hidden sm:inline uppercase">Sign In</span>
                            <div className="avatar">
                                <div className="w-10 rounded-full border-2 border-white">
                                    <img src="https://img.icons8.com/ios-filled/50/ffffff/user-male-circle.png" alt="User placeholder" />
                                </div>
                            </div>
                        </Link>
                    )
                }
            </div>
        </div>
    );
};

export default Navbar;