import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
    FaWallet, FaShopify, FaPhoneAlt, FaShoppingCart, 
    FaStar, FaCalendarAlt, FaCreditCard, FaArrowRight 
} from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const UserHome = () => {
    const { user: authUser } = useAuth();
    const axiosSecure = useAxiosSecure();

    // 1. Fetch Dashboard Stats (Parallel counts from your Backend)
    const { data: stats = {} } = useQuery({
        queryKey: ['user-stats', authUser?.email],
        enabled: !!authUser?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/user-stats?email=${authUser?.email}`);
            return res.data;
        }
    });

    // 2. Fetch User Profile (To get the 'image' field from MongoDB)
    const { data: dbUser = {} } = useQuery({
        queryKey: ['user-profile', authUser?.email],
        enabled: !!authUser?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/profile/${authUser?.email}`);
            return res.data;
        }
    });

    // Priority logic: Database Image > Auth PhotoURL > Initials
    const userDisplayImage = dbUser?.image || authUser?.photoURL;
    const userDisplayName = dbUser?.name || authUser?.displayName || 'Authentic User';

    return (
        <div className="w-full min-h-screen p-4 md:p-10 text-slate-800">
            {/* Header Section */}
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <span className="text-[#B58130] font-bold tracking-widest uppercase text-xs">Dashboard Overview</span>
                    <h2 className="text-5xl font-black font-cinzel text-slate-900 mt-2">
                        Welcome, <span className="text-[#B58130] italic">
                            {userDisplayName.split(' ')[0]}
                        </span>
                    </h2>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-slate-400 font-medium">{new Date().toDateString()}</p>
                </div>
            </header>

            {/* Bento Grid Stats (Global/Top Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                    { label: 'Menu Items', val: stats.menuItems || 0, icon: <FaWallet />, grad: 'from-[#BB34F5] to-[#8a2be2]', shadow: 'shadow-purple-200' },
                    { label: 'Shop', val: stats.shopCount || 103, icon: <FaShopify />, grad: 'from-[#D3A256] to-[#b58130]', shadow: 'shadow-orange-200' },
                    { label: 'Contact', val: stats.contactCount || 3, icon: <FaPhoneAlt />, grad: 'from-[#FE4880] to-[#e91e63]', shadow: 'shadow-pink-200' }
                ].map((card, i) => (
                    <div key={i} className={`group relative p-8 rounded-[2rem] bg-gradient-to-br ${card.grad} text-white ${card.shadow} hover:shadow-2xl transition-all duration-500 overflow-hidden`}>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-md">
                                {card.icon}
                            </div>
                            <div className="mt-8">
                                <h3 className="text-5xl font-black mb-1 tracking-tighter">{card.val}</h3>
                                <p className="text-lg font-bold opacity-80 uppercase tracking-widest">{card.label}</p>
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 text-white/10 text-9xl transform rotate-12 group-hover:scale-110 transition-transform duration-700">
                            {card.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Profile & User Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                {/* Profile Card */}
                <div className="lg:col-span-5 bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-32 bg-[#FFEDD5]"></div>

                    <div className="relative mt-4">
                        <div className="w-44 h-44 rounded-[2.5rem] border-8 border-white shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-all duration-500 bg-slate-100 flex items-center justify-center">
                            {userDisplayImage ? (
                                <img
                                    src={userDisplayImage}
                                    alt="User Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { 
                                        e.target.onerror = null; 
                                        e.target.src = "https://i.ibb.co/5GzXkwq/user.png"; 
                                    }}
                                />
                            ) : (
                                <span className="text-6xl font-black text-slate-300 font-cinzel">
                                    {userDisplayName.charAt(0)}
                                </span>
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-md"></div>
                    </div>

                    <h3 className="text-3xl font-black font-cinzel text-slate-900 mt-8 mb-2">
                        {userDisplayName}
                    </h3>
                    <p className="text-slate-400 font-medium mb-6">{authUser?.email}</p>

                    <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-[#B58130] transition-colors flex items-center gap-2 group shadow-lg">
                        Edit Profile <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Activities Card (Pulse) */}
                <div className="lg:col-span-7 bg-[#1a1a1a] rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#B58130] blur-[120px] opacity-20"></div>

                    <h3 className="text-3xl font-black font-cinzel uppercase mb-10 tracking-tight flex items-center gap-4">
                        Your Pulse <div className="h-1 flex-1 bg-white/10 rounded-full"></div>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                            { label: 'Orders', val: stats.orders || 0, color: 'text-blue-400', bg: 'bg-blue-400/10', icon: <FaShoppingCart /> },
                            { label: 'Reviews', val: stats.reviews || 0, color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: <FaStar /> },
                            { label: 'Bookings', val: stats.bookings || 0, color: 'text-amber-400', bg: 'bg-amber-400/10', icon: <FaCalendarAlt /> },
                            { label: 'Payments', val: stats.payments || 0, color: 'text-rose-400', bg: 'bg-rose-400/10', icon: <FaCreditCard /> }
                        ].map((act, i) => (
                            <div key={i} className="flex items-center gap-5 p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 transition-all group">
                                <div className={`${act.bg} ${act.color} w-14 h-14 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                                    {act.icon}
                                </div>
                                <div>
                                    <p className="text-2xl font-black leading-none">{act.val}</p>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter mt-1">{act.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserHome;