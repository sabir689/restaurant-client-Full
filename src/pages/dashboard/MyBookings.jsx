import { FaTrashAlt, FaCalendarAlt, FaClock, FaChair, FaCreditCard } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const MyBookings = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: bookings = [], refetch } = useQuery({
        queryKey: ['bookings', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/bookings?email=${user?.email}`);
            return res.data;
        }
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: "Cancel Reservation?",
            text: "This will release your table back to other guests.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B58130",
            cancelButtonColor: "#1a1a1a",
            confirmButtonText: "Yes, Cancel It",
            background: '#ffffff',
            color: '#000000'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosSecure.delete(`/bookings/${id}`);
                if (res.data.deletedCount > 0) {
                    refetch();
                    Swal.fire("Released!", "Your table is now available for others.", "success");
                }
            }
        });
    };

    return (
        <div className="w-full bg-[#fcfcfc] min-h-screen py-12 px-6 lg:px-20 text-black">
            {/* Header Section */}
            <header className="mb-16 text-center">
                <span className="text-[#B58130] font-bold tracking-[0.4em] uppercase text-xs">Guest Portal</span>
                <h1 className="text-5xl font-extrabold mt-2 font-cinzel tracking-tight">
                    MY <span className="text-[#B58130]">RESERVATIONS</span>
                </h1>
                <div className="h-1 w-24 bg-[#B58130] mx-auto mt-4 rounded-full"></div>
            </header>

            {/* Grid for Bookings */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {bookings.map((item) => (
                    <div key={item._id} className="group relative bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        
                        {/* Top Accent Bar */}
                        <div className="h-2 w-full bg-[#B58130]"></div>

                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-3xl font-black text-gray-800">Table {item.tableNumber}</h3>
                                    <p className="text-[#B58130] font-bold text-sm uppercase tracking-widest">Confirmed Booking</p>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-2xl text-[#B58130]">
                                    <FaChair size={24} />
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-4 text-gray-600">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#B58130]">
                                        <FaCalendarAlt />
                                    </div>
                                    <span className="font-medium">{item.date}</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#B58130]">
                                        <FaClock />
                                    </div>
                                    <span className="font-medium">{item.time}</span>
                                </div>
                            </div>

                            {/* Status and Advance Info */}
                            <div className="bg-gray-50 rounded-2xl p-4 mb-8 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-tighter">Advance Required</p>
                                    <p className="text-xl font-black text-gray-800">$50.00</p>
                                </div>
                                <span className="badge badge-warning badge-outline p-3 font-bold text-[10px]">UNPAID</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Link to={`/dashboard/payment/${item._id}`} className="flex-1">
                                    <button className="w-full py-4 bg-[#B58130] hover:bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors duration-300 shadow-lg shadow-orange-100">
                                        <FaCreditCard /> PAY NOW
                                    </button>
                                </Link>
                                <button 
                                    onClick={() => handleDelete(item._id)}
                                    className="p-4 border border-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-400 rounded-2xl transition-all duration-300"
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </div>

                        {/* Decorative Circle Cutouts (Ticket Look) */}
                        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#fcfcfc] rounded-full border-r border-gray-100"></div>
                        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#fcfcfc] rounded-full border-l border-gray-100"></div>
                    </div>
                ))}

                {/* Empty State */}
                {bookings.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl">
                        <p className="text-gray-400 text-lg">Your itinerary is empty. Ready for dinner?</p>
                        <Link to="/dashboard/reservation">
                            <button className="mt-4 text-[#B58130] font-bold hover:underline">Book a new table →</button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;