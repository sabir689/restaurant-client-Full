import { FaTrashAlt, FaCalendarAlt, FaClock, FaChair, FaCreditCard, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const MyBookings = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // Fetch bookings with TanStack Query
    const { data: bookings = [], refetch } = useQuery({
        queryKey: ['bookings', user?.email],
        enabled: !!user?.email, // Only fetch if email exists
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
                        
                        {/* Status Accent Bar: Green if paid, Gold if unpaid */}
                        <div className={`h-2 w-full transition-colors duration-500 ${item.status === 'paid' ? 'bg-emerald-500' : 'bg-[#B58130]'}`}></div>

                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-3xl font-black text-gray-800">Table {item.tableNumber}</h3>
                                    <p className={`font-bold text-sm uppercase tracking-widest ${item.status === 'paid' ? 'text-emerald-500' : 'text-[#B58130]'}`}>
                                        {item.status === 'paid' ? 'Confirmed & Secured' : 'Action Required'}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-2xl transition-colors duration-300 ${item.status === 'paid' ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-[#B58130]'}`}>
                                    {item.status === 'paid' ? <FaCheckCircle size={24} /> : <FaChair size={24} />}
                                </div>
                            </div>

                            {/* Booking Info */}
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

                            {/* Payment Summary Box */}
                            <div className="bg-gray-50 rounded-2xl p-4 mb-8 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-tighter">Advance Required</p>
                                    <p className="text-xl font-black text-gray-800">$50.00</p>
                                </div>
                                {item.status === 'paid' ? (
                                    <span className="px-4 py-1 bg-emerald-500 text-white rounded-full font-bold text-[10px] uppercase shadow-sm">Paid</span>
                                ) : (
                                    <span className="px-4 py-1 border border-orange-300 text-orange-400 rounded-full font-bold text-[10px] uppercase">Unpaid</span>
                                )}
                            </div>

                            {/* Conditional Action Buttons */}
                            <div className="flex gap-3">
                                {item.status === 'paid' ? (
                                    <button disabled className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                                        <FaCheckCircle className="text-emerald-500" /> SECURED
                                    </button>
                                ) : (
                                    <Link 
                                        to="/dashboard/payment" 
                                        state={{ price: 50, bookingId: item._id }} 
                                        className="flex-1"
                                    >
                                        <button className="w-full py-4 bg-[#B58130] hover:bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-100">
                                            <FaCreditCard /> PAY NOW
                                        </button>
                                    </Link>
                                )}
                                
                                <button 
                                    onClick={() => handleDelete(item._id)}
                                    className="p-4 border border-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-400 rounded-2xl transition-all duration-300"
                                    title="Cancel Reservation"
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </div>

                        {/* Ticket Decorative Cutouts */}
                        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#fcfcfc] rounded-full border-r border-gray-100"></div>
                        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#fcfcfc] rounded-full border-l border-gray-100"></div>
                    </div>
                ))}

                {/* Empty State */}
                {bookings.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl">
                        <div className="mb-4 flex justify-center text-gray-200">
                            <FaChair size={60} />
                        </div>
                        <p className="text-gray-400 text-lg">Your itinerary is empty. Ready for dinner?</p>
                        <Link to="/dashboard/reservation">
                            <button className="mt-4 text-[#B58130] font-bold hover:underline transition-all hover:tracking-widest">
                                Book a new table →
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;