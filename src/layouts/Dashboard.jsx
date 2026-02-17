import { FaAd, FaBook, FaCalendar, FaEnvelope, FaHome, FaList, FaSearch, FaShoppingCart, FaUsers, FaUtensils, FaCalendarAlt, FaChevronRight } from "react-icons/fa";
import { Link, NavLink, Outlet } from "react-router-dom";
import useCart from "../hooks/useCart";
import useAdmin from "../hooks/useAdmin";



const NavItem = ({ to, icon: Icon, label, badge }) => (
    <li className="mb-1">
        <NavLink
            to={to}
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
    
    // 2. Get the admin status from our custom hook
    const [isAdmin, isAdminLoading] = useAdmin();

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            {/* --- Sidebar --- */}
            <div className="w-72 bg-gradient-to-b from-orange-500 to-orange-600 shadow-2xl z-50 sticky top-0 h-screen overflow-y-auto">
                
                {/* Brand Identity */}
                <Link to='/'>
                    <div className="p-8 mb-4">
                        <div className="border-l-4 border-white pl-4">
                            <h1 className="text-2xl font-black text-white leading-none tracking-tighter uppercase font-cinzel">
                                Bistro Boss
                            </h1>
                            <p className="text-orange-100 text-xs tracking-[0.3em] font-light mt-1 uppercase">
                                Restaurant
                            </p>
                        </div>
                    </div>
                </Link>

                <nav className="px-4 pb-10">
                    {/* 3. CONDITIONAL RENDERING BASED ON ROLE */}
                    {
                        isAdmin ? (
                            /* ADMIN SECTION */
                            <div className="mb-8">
                                <p className="px-4 text-[10px] font-black text-orange-100 uppercase tracking-[0.2em] mb-4 opacity-70">
                                    Admin Dashboard
                                </p>
                                <ul className="space-y-1">
                                    <NavItem to="/dashboard/adminHome" icon={FaHome} label="Admin Home" />
                                    <NavItem to="/dashboard/addItems" icon={FaUtensils} label="Add Items" />
                                    <NavItem to="/dashboard/manageItems" icon={FaList} label="Manage Items" />
                                    <NavItem to="/dashboard/bookings" icon={FaBook} label="Manage Bookings" />
                                    <NavItem to="/dashboard/users" icon={FaUsers} label="All Users" />
                                </ul>
                            </div>
                        ) : (
                            /* USER SECTION */
                            <div className="mb-8">
                                <p className="px-4 text-[10px] font-black text-orange-100 uppercase tracking-[0.2em] mb-4 opacity-70">
                                    Guest Menu
                                </p>
                                <ul className="space-y-1">
                                    <NavItem to="/dashboard/userHome" icon={FaHome} label="User Home" />
                                    <NavItem to="/dashboard/reservation" icon={FaCalendar} label="Reservation" />
                                    <NavItem to="/dashboard/cart" icon={FaShoppingCart} label="My Cart" badge={cart?.length} />
                                    <NavItem to="/dashboard/addReviews" icon={FaAd} label="Add Review" />
                                    <NavItem to="/dashboard/paymentHistory" icon={FaList} label="Payment History" />
                                    <NavItem to="/dashboard/myBookings" icon={FaCalendarAlt} label="My Bookings" />
                                </ul>
                            </div>
                        )
                    }

                    {/* Styled Divider */}
                    <div className="relative my-8 px-4">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-orange-300/30"></div>
                        </div>
                    </div>

                    {/* PUBLIC LINKS (Shown to both) */}
                    <div className="pt-4 border-t border-orange-400/50 mt-10">
                        <ul className="space-y-1">
                            <NavItem to="/" icon={FaHome} label="Home" />
                            <NavItem to="/menu" icon={FaSearch} label="Our Menu" />
                            <NavItem to="/order/contact" icon={FaEnvelope} label="Contact" />
                        </ul>
                    </div>
                </nav>
            </div>

            {/* --- Main Content Area --- */}
            <div className="flex-1 flex flex-col">
                {/* Header Bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-10 sticky top-0 z-40">
                    <h2 className="text-gray-400 font-medium uppercase text-sm tracking-widest">
                        {isAdmin ? "Admin Overview" : "Dashboard Overview"}
                    </h2>
                    <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border transition-colors ${
                             isAdmin ? "bg-purple-100 text-purple-600 border-purple-200" : "bg-orange-100 text-orange-600 border-orange-200"
                         }`}>
                             {isAdmin ? "ADM" : "GUEST"}
                         </div>
                    </div>
                </header>

                <main className="p-10">
                    <div className="max-w-6xl mx-auto">
                        {/* 4. Show a loading spinner while checking admin status */}
                        {isAdminLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <span className="loading loading-spinner loading-lg text-orange-500"></span>
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