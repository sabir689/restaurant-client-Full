import { useState } from "react"; // Added for mobile toggle
import { FaAd, FaBook, FaCalendar, FaEnvelope, FaHome, FaList, FaSearch, FaShoppingCart, FaUsers, FaUtensils, FaCalendarAlt, FaChevronRight, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import useAdmin from "../hooks/useAdmin";
import useAuth from "../hooks/useAuth";

const NavItem = ({ to, icon: Icon, label, badge, onClick }) => (
    <li className="mb-1">
        <NavLink
            to={to}
            onClick={onClick} // Close sidebar on click for mobile
            className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive 
                    ? "bg-white text-orange-600 shadow-md font-bold translate-x-2" 
                    : "text-white hover:bg-white/10 hover:translate-x-1"
                }`
            }
        >
            <div className="flex items-center gap-3">
                <Icon className="text-lg" />
                <span className="capitalize tracking-wide">{label}</span>
            </div>
            {badge > 0 && (
                <span className="bg-white text-orange-600 text-[10px] px-2 py-0.5 rounded-full font-black shadow-sm">
                    {badge}
                </span>
            )}
            <FaChevronRight className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" />
        </NavLink>
    </li>
);

const Dashboard = () => {
    const [cart] = useCart();
    const [isAdmin, isAdminLoading] = useAdmin();
    const { user, logOut } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false); // Mobile state

    const handleLogout = async () => {
        await logOut();
        navigate('/');
    };

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            {/* --- Mobile Overlay --- */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-[60] lg:hidden" 
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* --- Sidebar --- */}
            <aside className={`
                fixed lg:sticky top-0 h-screen z-[70] transition-all duration-300 overflow-y-auto
                w-72 bg-gradient-to-b from-orange-500 to-orange-600 shadow-2xl
                ${isSidebarOpen ? "left-0" : "-left-72 lg:left-0"}
            `}>
                
                {/* Brand Identity */}
                <div className="p-8 mb-4 flex justify-between items-center">
                    <Link to='/' className="border-l-4 border-white pl-4">
                        <h1 className="text-2xl font-black text-white leading-none tracking-tighter uppercase font-cinzel">
                            Bistro Boss
                        </h1>
                        <p className="text-orange-100 text-xs tracking-[0.3em] font-light mt-1 uppercase">
                            Restaurant
                        </p>
                    </Link>
                    {/* Close button for mobile */}
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white text-2xl">
                        <FaTimes />
                    </button>
                </div>

                <nav className="px-4 pb-10">
                    {isAdmin ? (
                        <div className="mb-8">
                            <p className="px-4 text-[10px] font-black text-orange-100 uppercase tracking-[0.2em] mb-4 opacity-70">Admin Dashboard</p>
                            <ul className="space-y-1">
                                <NavItem to="/dashboard/adminHome" icon={FaHome} label="Admin Home" onClick={() => setSidebarOpen(false)} />
                                <NavItem to="/dashboard/addItems" icon={FaUtensils} label="Add Items" onClick={() => setSidebarOpen(false)} />
                                <NavItem to="/dashboard/manageItems" icon={FaList} label="Manage Items" onClick={() => setSidebarOpen(false)} />
                                <NavItem to="/dashboard/bookings" icon={FaBook} label="Manage Bookings" onClick={() => setSidebarOpen(false)} />
                                <NavItem to="/dashboard/users" icon={FaUsers} label="All Users" onClick={() => setSidebarOpen(false)} />
                            </ul>
                        </div>
                    ) : (
                        <div className="mb-8">
                            <p className="px-4 text-[10px] font-black text-orange-100 uppercase tracking-[0.2em] mb-4 opacity-70">Guest Menu</p>
                            <ul className="space-y-1">
                                <NavItem to="/dashboard/userHome" icon={FaHome} label="User Home" onClick={() => setSidebarOpen(false)} />
                                <NavItem to="/dashboard/reservation" icon={FaCalendar} label="Reservation" onClick={() => setSidebarOpen(false)} />
                                <NavItem to="/dashboard/cart" icon={FaShoppingCart} label="My Cart" badge={cart?.length} onClick={() => setSidebarOpen(false)} />
                                <NavItem to="/dashboard/addReviews" icon={FaAd} label="Add Review" onClick={() => setSidebarOpen(false)} />
                                <NavItem to="/dashboard/paymentHistory" icon={FaList} label="Payment History" onClick={() => setSidebarOpen(false)} />
                                <NavItem to="/dashboard/myBookings" icon={FaCalendarAlt} label="My Bookings" onClick={() => setSidebarOpen(false)} />
                            </ul>
                        </div>
                    )}

                    <div className="relative my-8 px-4">
                        <div className="w-full border-t border-orange-300/30"></div>
                    </div>

                    <ul className="space-y-1">
                        <NavItem to="/" icon={FaHome} label="Home" />
                        <NavItem to="/menu" icon={FaSearch} label="Our Menu" />
                        <NavItem to="/order/contact" icon={FaEnvelope} label="Contact" />
                    </ul>

                    <button 
                        onClick={handleLogout}
                        className="mt-10 w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-red-500/20 rounded-lg transition-colors group"
                    >
                        <FaSignOutAlt className="group-hover:text-red-200" />
                        <span className="font-bold">Logout</span>
                    </button>
                </nav>
            </aside>

            {/* --- Main Content Area --- */}
            <div className="flex-1 flex flex-col min-w-0"> {/* min-w-0 prevents content from breaking flexbox */}
                
                {/* Enhanced Header Bar */}
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-10 sticky top-0 z-40 shadow-sm">
                    <div className="flex items-center gap-4">
                        {/* Hamburger Button for Mobile */}
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-orange-600 text-2xl"
                        >
                            <FaBars />
                        </button>
                        
                        <div>
                            <h2 className="text-gray-400 font-medium uppercase text-[10px] tracking-[0.3em]">
                                {isAdmin ? "Management Mode" : "User Portal"}
                            </h2>
                            <p className="text-gray-800 font-bold text-sm md:text-lg leading-none mt-1">
                                Welcome, {user?.displayName || "Guest"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-gray-800 leading-none">{user?.displayName}</p>
                            <p className="text-[10px] text-orange-500 font-bold uppercase mt-1 tracking-tighter">
                                {isAdmin ? "Administrator" : "Guest User"}
                            </p>
                        </div>
                        
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl ring-2 ring-orange-100 ring-offset-2 overflow-hidden shadow-md bg-orange-50 flex items-center justify-center">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-orange-600 font-black text-xl">{user?.displayName?.charAt(0)}</span>
                            )}
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-10">
                    <div className="max-w-6xl mx-auto">
                        {isAdminLoading ? (
                             <div className="flex flex-col justify-center items-center h-64 gap-4">
                                <span className="loading loading-infinity loading-lg text-orange-500"></span>
                                <p className="text-orange-600 font-bold animate-pulse uppercase tracking-widest text-xs">Verifying...</p>
                            </div>
                        ) : (
                            <Outlet />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;