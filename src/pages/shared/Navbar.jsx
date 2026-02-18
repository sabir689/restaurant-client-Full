import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import { FaShoppingCart } from "react-icons/fa";
import { FiLogOut, FiUser } from "react-icons/fi";

const Navbar = () => {
    const { user, logOut } = useAuth();
    const [cart] = useCart();
    const [scrolled, setScrolled] = useState(false);

    // Scroll shadow effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogOut = () => {
        logOut()
            .then(() => { })
            .catch((error) => console.log(error));
    };

    // Nav Options with Conditional Dashboard
    const navOptions = (
        <>
            {[
                { name: "HOME", path: "/" },
                { name: "OUR SHOP", path: "/order/salad" },
                { name: "OUR MENU", path: "/menu" },
                // Only includes DASHBOARD if user is logged in
                ...(user ? [{ name: "DASHBOARD", path: "/dashboard" }] : []),
                { name: "CONTACT", path: "/contact" },
            ].map((item) => (
                <li key={item.path}>
                    <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                            `relative font-bold tracking-wide px-3 py-2 rounded-lg transition-all duration-300
              ${isActive
                                ? "text-yellow-400"
                                : "text-white hover:text-yellow-300"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {item.name}
                                <span
                                    className={`absolute left-0 -bottom-1 h-[2px] w-full bg-yellow-400 rounded-full transition-all duration-300 
                  ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                                ></span>
                            </>
                        )}
                    </NavLink>
                </li>
            ))}
        </>
    );

    return (
        <div
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
      ${scrolled
                    ? "bg-black/70 backdrop-blur-xl shadow-lg shadow-yellow-500/20"
                    : "bg-black/30 backdrop-blur-md"
                }`}
        >
            <div className="navbar max-w-7xl mx-auto px-3 py-3">
                {/* LEFT */}
                <div className="navbar-start">
                    {/* Mobile Menu */}
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden text-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h10m-10 6h16"
                                />
                            </svg>
                        </label>

                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 z-[99] p-3 shadow-xl 
              bg-black/90 backdrop-blur-xl rounded-2xl w-56 border border-white/10"
                        >
                            {navOptions}
                        </ul>
                    </div>

                    {/* Logo */}
                    <Link to="/" className="flex flex-col leading-none ml-2 font-cinzel">
                        <span className="text-2xl font-black tracking-widest text-white">
                            BISTRO<span className="text-yellow-400">BOSS</span>
                        </span>
                        <span className="text-xs font-semibold tracking-[0.4em] uppercase text-gray-200">
                            Restaurant
                        </span>
                    </Link>
                </div>

                {/* CENTER */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 gap-1">{navOptions}</ul>
                </div>

                {/* RIGHT */}
                <div className="navbar-end gap-3">
                    {/* Cart */}
                    <Link to="/dashboard/cart">
                        <button className="btn btn-ghost bg-green-900/80 hover:bg-green-800 border border-green-500/20 rounded-xl relative transition-all duration-300">
                            <FaShoppingCart className="text-xl text-white" />

                            <div
                                className="badge badge-secondary border-none bg-orange-600 absolute -top-2 -right-2 
                animate-pulse font-bold"
                            >
                                {cart?.length || 0}
                            </div>
                        </button>
                    </Link>

                    {/* Auth Section */}
                    {user ? (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="cursor-pointer flex items-center gap-2">
                                <div className="avatar">
                                    <div className="w-11 rounded-full border-2 border-yellow-400 ring ring-yellow-400/30 ring-offset-base-100 ring-offset-2">
                                        <img
                                            src={
                                                user?.photoURL ||
                                                "https://img.icons8.com/ios-filled/50/ffffff/user-male-circle.png"
                                            }
                                            alt="User Avatar"
                                        />
                                    </div>
                                </div>

                                <span className="hidden md:inline text-white font-bold tracking-wide">
                                    {user?.displayName?.split(" ")[0] || "User"}
                                </span>
                            </label>

                            {/* Dropdown Menu */}
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu p-3 shadow-xl bg-black/90 backdrop-blur-xl rounded-2xl 
                w-52 border border-white/10 mt-4"
                            >
                                <li>
                                    <Link to="/dashboard" className="flex items-center gap-2 text-white">
                                        <FiUser /> Dashboard
                                    </Link>
                                </li>

                                <li>
                                    <button
                                        onClick={handleLogOut}
                                        className="flex items-center gap-2 text-red-400 hover:text-red-300"
                                    >
                                        <FiLogOut /> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <Link
                            to="/signIn"
                            className="btn btn-sm bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl px-6 border-none"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;