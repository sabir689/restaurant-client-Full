import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaHistory, FaReceipt, FaCalendarAlt, FaDollarSign } from "react-icons/fa";

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: payments = [] } = useQuery({
        queryKey: ['payments', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments/${user.email}`);
            return res.data;
        }
    });

    return (
        <div className="max-w-6xl mx-auto p-4 lg:p-10 min-h-screen">
            {/* Header Section */}
            <div className="text-center mb-12">
                <p className="text-[#D1A054] italic text-lg mb-2">--- At a Glance! ---</p>
                <h2 className="text-4xl lg:text-5xl font-black font-cinzel text-slate-900 tracking-tighter uppercase">
                    Payment <span className="text-[#D1A054]">History</span>
                </h2>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                
                {/* Summary Stat Bar */}
                <div className="bg-slate-900 p-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#D1A054]/20 p-4 rounded-2xl">
                            <FaHistory className="text-[#D1A054] text-2xl" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Total Transactions</p>
                            <h3 className="text-white text-2xl font-black font-cinzel leading-none">{payments.length}</h3>
                        </div>
                    </div>

                    <div className="h-px w-full md:w-px md:h-12 bg-slate-800"></div>

                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-500/20 p-4 rounded-2xl">
                            <FaReceipt className="text-emerald-500 text-2xl" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Account Status</p>
                            <h3 className="text-emerald-500 text-xl font-black font-cinzel leading-none uppercase">Verified</h3>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="p-4 lg:p-8">
                    <div className="overflow-x-auto">
                        <table className="table w-full border-separate border-spacing-y-3">
                            <thead>
                                <tr className="text-slate-400 border-none uppercase text-[10px] tracking-[0.2em] font-black text-center">
                                    <th className="bg-transparent pl-6 text-left">Recipient</th>
                                    <th className="bg-transparent">Category</th>
                                    <th className="bg-transparent">Amount</th>
                                    <th className="bg-transparent pr-6">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment._id} className="group shadow-sm hover:shadow-md transition-all duration-300">
                                        {/* Email Column */}
                                        <td className="bg-slate-50 group-hover:bg-slate-100 rounded-l-2xl pl-6 py-6 border-l-4 border-transparent group-hover:border-[#D1A054]">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Billed to</span>
                                                <span className="font-bold text-slate-700">{payment.email}</span>
                                            </div>
                                        </td>

                                        {/* Category Column */}
                                        <td className="bg-slate-50 group-hover:bg-slate-100 text-center">
                                            <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                Food Order
                                            </span>
                                        </td>

                                        {/* Price Column */}
                                        <td className="bg-slate-50 group-hover:bg-slate-100 text-center">
                                            <div className="flex items-center justify-center gap-1 text-[#D1A054] font-black text-lg">
                                                <FaDollarSign className="text-xs" />
                                                <span>{payment.price.toFixed(2)}</span>
                                            </div>
                                        </td>

                                        {/* Date Column */}
                                        <td className="bg-slate-50 group-hover:bg-slate-100 rounded-r-2xl pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2 text-slate-500">
                                                <FaCalendarAlt className="text-[#D1A054] text-xs" />
                                                <span className="text-sm font-medium">
                                                    {new Date(payment.date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {payments.length === 0 && (
                            <div className="text-center py-24">
                                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                    <FaHistory className="text-slate-200 text-3xl" />
                                </div>
                                <h4 className="text-xl font-cinzel font-black text-slate-300 uppercase">No transactions found</h4>
                                <p className="text-slate-400 text-sm mt-1">Your payment records will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;