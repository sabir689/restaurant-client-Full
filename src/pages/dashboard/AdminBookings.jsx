import React from 'react';
import { FaCheck, FaCheckDouble } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const AdminBookings = () => {
    const axiosSecure = useAxiosSecure();

    // Fetching all bookings for the admin
    const { data: allBookings = [], refetch } = useQuery({
        queryKey: ['all-bookings'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/bookings');
            return res.data;
        }
    });

    const handleUpdateStatus = async (id) => {
        const res = await axiosSecure.patch(`/bookings/status/${id}`);
        if (res.data.modifiedCount > 0) {
            refetch();
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Booking marked as Done!",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    return (
        <div className="w-full bg-[#F6F6F6] min-h-screen py-10 px-4 md:px-10">
            {/* Page Title Section */}
            <div className="text-center mb-12">
                <p className="text-[#B58130] italic">---At a Glance!---</p>
                <h2 className="text-4xl font-bold border-y-2 border-gray-200 py-4 inline-block px-10 uppercase text-black">
                    Manage All Bookings
                </h2>
            </div>

            {/* White Table Container */}
            <div className="bg-white p-8 md:p-14 shadow-sm text-black rounded-sm">
                <div className="mb-8">
                    <h3 className="text-2xl font-bold font-cinzel uppercase">
                        Total Items: {allBookings.length}
                    </h3>
                </div>

                <div className="overflow-x-auto rounded-t-2xl">
                    <table className="table w-full text-left">
                        {/* Table Head with Gold Background */}
                        <thead className="bg-[#B58130] text-white uppercase h-16">
                            <tr>
                                <th className="pl-6">#</th>
                                <th>User Email</th>
                                <th>Phone Number</th>
                                <th>Booking Date</th>
                                <th>Booking Time</th>
                                <th>Activity</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allBookings.map((booking, index) => (
                                <tr key={booking._id} className="border-b border-gray-100 h-20">
                                    <td className="pl-6 font-bold">{index + 1}</td>
                                    <td className="text-gray-500">{booking.email}</td>
                                    <td className="text-gray-500">{booking.phone}</td>
                                    <td className="text-gray-500">{booking.date}</td>
                                    <td className="text-gray-500">{booking.time}</td>
                                    <td>
                                        {booking.status === 'done' ? (
                                            <span className="text-green-600 font-bold">Done</span>
                                        ) : (
                                            <span className="text-orange-400 font-bold">Pending</span>
                                        )}
                                    </td>
                                    <td>
                                        {booking.status === 'done' ? (
                                            <button className="btn btn-circle bg-green-800 text-white border-none cursor-default">
                                                <FaCheckDouble />
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleUpdateStatus(booking._id)}
                                                className="btn btn-circle bg-[#28C76F] hover:bg-[#20a35b] text-white border-none"
                                            >
                                                <FaCheck />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {allBookings.length === 0 && (
                    <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest">
                        No Bookings Found
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBookings;