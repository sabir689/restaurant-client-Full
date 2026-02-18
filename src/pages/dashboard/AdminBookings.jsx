import React from 'react';
import { FaCheck, FaCheckDouble, FaCalendarAlt, FaClock, FaEnvelope, FaPhone } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const AdminBookings = () => {
    const axiosSecure = useAxiosSecure();

    const { data: allBookings = [], refetch } = useQuery({
        queryKey: ['all-bookings'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/bookings');
            return res.data;
        }
    });

    const handleUpdateStatus = async (id) => {
        try {
            const res = await axiosSecure.patch(`/bookings/status/${id}`);
            if (res.data.modifiedCount > 0) {
                refetch();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Booking marked as Done!",
                    showConfirmButton: false,
                    timer: 1500,
                    toast: true // Cleaner for admin dashboards
                });
            }
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    return (
        <div className="w-full bg-[#F6F6F6] min-h-screen py-6 md:py-10 px-2 md:px-10">
            {/* Page Title Section */}
            <div className="text-center mb-8 md:mb-12">
                <p className="text-[#B58130] italic text-sm md:text-base mb-2">---At a Glance!---</p>
                <h2 className="text-2xl md:text-4xl font-black border-y-2 border-gray-200 py-3 inline-block px-6 md:px-10 uppercase text-black font-cinzel tracking-tight">
                    Manage All Bookings
                </h2>
            </div>

            {/* Main Container */}
            <div className="bg-white p-4 md:p-10 lg:p-14 shadow-md rounded-xl max-w-7xl mx-auto">
                <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="text-xl md:text-2xl font-bold font-cinzel uppercase text-gray-800">
                        Total Bookings: <span className="text-[#B58130]">{allBookings.length}</span>
                    </h3>
                    <div className="h-1 w-20 bg-[#B58130] rounded-full hidden md:block"></div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                    <table className="table w-full text-left border-collapse">
                        {/* Table Head */}
                        <thead className="bg-[#B58130] text-white uppercase text-xs md:text-sm">
                            <tr>
                                <th className="py-5 pl-6">#</th>
                                <th><span className="flex items-center gap-2"><FaEnvelope className="hidden sm:inline" /> User</span></th>
                                <th className="hidden lg:table-cell"><span className="flex items-center gap-2"><FaPhone /> Contact</span></th>
                                <th className="hidden md:table-cell"><span className="flex items-center gap-2"><FaCalendarAlt /> Date</span></th>
                                <th className="hidden md:table-cell"><span className="flex items-center gap-2"><FaClock /> Time</span></th>
                                <th>Status</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        
                        <tbody className="text-gray-700">
                            {allBookings.map((booking, index) => (
                                <tr key={booking._id} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors h-16 md:h-20">
                                    <td className="pl-6 font-bold text-gray-400">{index + 1}</td>
                                    
                                    <td className="max-w-[150px] md:max-w-none">
                                        <div className="font-semibold text-gray-800 truncate">{booking.email}</div>
                                        {/* Mobile-only info */}
                                        <div className="md:hidden text-[10px] text-gray-400 mt-1 flex gap-2">
                                            <span>{booking.date}</span> • <span>{booking.time}</span>
                                        </div>
                                    </td>

                                    <td className="hidden lg:table-cell text-gray-500 font-medium">{booking.phone}</td>
                                    <td className="hidden md:table-cell text-gray-500">{booking.date}</td>
                                    <td className="hidden md:table-cell text-gray-500">{booking.time}</td>
                                    
                                    <td>
                                        {booking.status === 'done' ? (
                                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
                                                Done
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider animate-pulse">
                                                Pending
                                            </span>
                                        )}
                                    </td>

                                    <td className="text-center">
                                        {booking.status === 'done' ? (
                                            <div className="flex justify-center">
                                                <div className="p-3 bg-green-50 text-green-600 rounded-full border border-green-200">
                                                    <FaCheckDouble className="text-lg" />
                                                </div>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => handleUpdateStatus(booking._id)}
                                                className="group relative flex items-center justify-center mx-auto p-3 bg-[#28C76F] hover:bg-[#1f9d57] text-white rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg shadow-green-100"
                                                title="Mark as Done"
                                            >
                                                <FaCheck className="text-lg" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {allBookings.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                        <div className="bg-gray-100 p-6 rounded-full mb-4">
                            <FaCalendarAlt className="text-5xl text-gray-300" />
                        </div>
                        <p className="font-bold uppercase tracking-[0.3em] text-sm">No Bookings Found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBookings;