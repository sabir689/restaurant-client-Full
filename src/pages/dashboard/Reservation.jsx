import { useForm } from "react-hook-form";
import { FaUtensils, FaPhoneAlt, FaMapMarkerAlt, FaClock, FaChevronRight } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import SectionTitle from "../../components/SectionTitle";

const Reservation = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await axiosSecure.post('/bookings', data);
            if (res.data.success) {
                Swal.fire({
                    title: "Reservation Confirmed!",
                    html: `
                    <div className="text-left p-2">
                        <p className="mb-2">Assigned: <span className="text-[#B58130] font-bold">Table #${res.data.tableNumber}</span></p>
                        <p className="text-sm text-gray-500">To finalize, please provide the <b>$50</b> security deposit in your dashboard.</p>
                    </div>`,
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#B58130",
                    confirmButtonText: "Proceed to Payment",
                    cancelButtonText: "Later"
                }).then((result) => {
                    if (result.isConfirmed) window.location.href = "/dashboard/myBookings";
                });
                reset();
            }
        } catch (error) {
            Swal.fire({ title: "Unavailable", text: error.response?.data?.message || "Booking failed", icon: "error" });
        }
    };

    return (
        <section className="bg-[#fcfcfc] min-h-screen">
            {/* Header Section with Parallax-like feel */}
            <div className="bg-slate-900 py-20 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#B58130] opacity-10 blur-3xl rounded-full -mr-20 -mt-20"></div>
                <SectionTitle subHeading="Fine Dining" heading="Secure Your Table" />
            </div>

            <div className="max-w-7xl mx-auto -mt-16 px-4 pb-20">
                <div className="bg-white shadow-2xl rounded-[2rem] overflow-hidden flex flex-col lg:flex-row border border-gray-100">

                    {/* Left Side: Brand Imagery/Inspiration */}
                    <div className="lg:w-1/3 bg-[#B58130] p-12 text-white flex flex-col justify-between relative">
                        <div>
                            <h3 className="text-4xl font-cinzel font-black leading-tight mb-6 uppercase tracking-tighter">
                                Experience <br /> The Art of <br /> Gastronomy
                            </h3>
                            <div className="h-1 w-20 bg-white mb-8"></div>
                            <p className="text-orange-100 italic font-medium leading-relaxed">
                                "A table at Bistro Boss is more than a meal; it's a curated journey through flavor and elegance."
                            </p>
                        </div>
                        <div className="mt-12 opacity-50 text-8xl absolute -bottom-10 -left-5 rotate-12">
                            <FaUtensils />
                        </div>
                    </div>

                    {/* Right Side: The Unique Form */}
                    <div className="lg:w-2/3 p-8 md:p-16 text-black">
                        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">

                            {[
                                { label: "Date", type: "date", name: "date", icon: "📅" },
                                { label: "Name", type: "text", name: "name", placeholder: "Full Name" },
                                { label: "Phone", type: "tel", name: "phone", placeholder: "Contact Number" },
                                { label: "Email", type: "email", name: "email", val: user?.email, readOnly: true }
                            ].map((field, i) => (
                                <div key={i} className="relative group">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#B58130] mb-2 block">
                                        {field.label}*
                                    </label>
                                    <input
                                        type={field.type}
                                        defaultValue={field.val}
                                        readOnly={field.readOnly}
                                        placeholder={field.placeholder}
                                        {...register(field.name, { required: !field.readOnly })}
                                        className={`w-full bg-gray-50 border-0 border-b-2 border-gray-200 py-3 
        focus:border-[#B58130] focus:ring-0 transition-all duration-300 text-gray-800 
        placeholder-gray-300 [color-scheme:light] 
        ${field.type === 'date' ? 'cursor-pointer' : ''} 
        ${field.readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    />

                                    {/* This style block ensures the calendar icon matches your gold theme */}
                                    <style dangerouslySetInnerHTML={{
                                        __html: `
        input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(53%) sepia(57%) saturate(452%) hue-rotate(357deg) brightness(91%) contrast(89%);
            cursor: pointer;
        }
    `}} />
                                </div>
                            ))}

                            {/* Dropdowns */}
                            <div className="relative">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#B58130] mb-2 block">Time Segment*</label>
                                <select {...register("time", { required: true })} className="w-full bg-gray-50 border-0 border-b-2 border-gray-200 py-3 focus:border-[#B58130] focus:ring-0">
                                    <option value="18:00">Dinner (06:00 PM)</option>
                                    <option value="19:00">Dinner (07:00 PM)</option>
                                    <option value="20:00">Late Night (08:00 PM)</option>

                                    <option value="12:00">Lunch (12:00 PM)</option>
                                </select>
                            </div>

                            <div className="relative">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#B58130] mb-2 block">Party Size*</label>
                                <select {...register("guest", { required: true })} className="w-full bg-gray-50 border-0 border-b-2 border-gray-200 py-3 focus:border-[#B58130] focus:ring-0">
                                    <option value="2">Table for Two</option>
                                    <option value="4">Family Table (4)</option>
                                    <option value="1">Solo Dining</option>
                                </select>
                            </div>

                            <div className="md:col-span-2 mt-8">
                                <button type="submit" className="group w-full py-5 bg-black text-white font-black uppercase tracking-widest text-sm hover:bg-[#B58130] transition-all duration-500 rounded-xl flex items-center justify-center gap-3">
                                    Confirm Reservation <FaChevronRight className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Modernized Location Bar */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Reach Us", info: "+38 (012) 34 56 789", icon: <FaPhoneAlt />, bg: "bg-blue-50 text-blue-600" },
                        { title: "Location", info: "123 Gourmet Ave, NY", icon: <FaMapMarkerAlt />, bg: "bg-orange-50 text-[#B58130]" },
                        { title: "Hours", info: "08:00 AM - 11:00 PM", icon: <FaClock />, bg: "bg-green-50 text-green-600" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-6 p-8 bg-white rounded-3xl border border-gray-100 hover:shadow-xl transition-shadow group">
                            <div className={`${item.bg} w-16 h-16 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="font-black font-cinzel text-gray-400 uppercase text-xs tracking-tighter mb-1">{item.title}</h4>
                                <p className="font-bold text-gray-800">{item.info}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Reservation;