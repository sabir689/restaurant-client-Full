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
        <div className="max-w-6xl mx-auto px-4 py-8 lg:p-10 min-h-screen">
            {/* Header Section */}
            <div className="text-center mb-8 lg:mb-12">
                <p className="text-[#D1A054] italic text-sm lg:text-lg mb-2">--- At a Glance! ---</p>
                <h2 className="text-3xl lg:text-5xl font-black font-cinzel text-slate-900 tracking-tighter uppercase">
                    Payment <span className="text-[#D1A054]">History</span>
                </h2>
            </div>

            <div className="bg-white rounded-3xl lg:rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                
                {/* Summary Stat Bar - Stacked on Mobile */}
                <div className="bg-slate-900 p-6 lg:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="bg-[#D1A054]/20 p-3 lg:p-4 rounded-2xl">
                            <FaHistory className="text-[#D1A054] text-xl lg:text-2xl" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Total Transactions</p>
                            <h3 className="text-white text-xl lg:text-2xl font-black font-cinzel leading-none">{payments.length}</h3>
                        </div>
                    </div>

                    <div className="hidden md:block h-12 w-px bg-slate-800"></div>

                    <div className="flex items-center gap-4 w-full md:w-auto border-t border-slate-800 pt-6 md:border-none md:pt-0">
                        <div className="bg-emerald-500/20 p-3 lg:p-4 rounded-2xl">
                            <FaReceipt className="text-emerald-500 text-xl lg:text-2xl" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Account Status</p>
                            <h3 className="text-emerald-500 text-lg lg:text-xl font-black font-cinzel leading-none uppercase">Verified</h3>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4 lg:p-8">
                    
                    {/* Desktop View: Table (Hidden on Mobile) */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="table w-full border-separate border-spacing-y-3">
                            <thead>
                                <tr className="text-slate-400 border-none uppercase text-[10px] tracking-[0.2em] font-black text-center">
                                    <th className="bg-transparent pl-6 text-left">Recipient</th>
                                    <th className="bg-transparent">Category</th>
                                    <th className="bg-transparent">Amount</th>
                                    <th className="bg-transparent pr-6 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment._id} className="group shadow-sm hover:shadow-md transition-all duration-300">
                                        <td className="bg-slate-50 group-hover:bg-slate-100 rounded-l-2xl pl-6 py-6 border-l-4 border-transparent group-hover:border-[#D1A054]">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Billed to</span>
                                                <span className="font-bold text-slate-700 text-sm lg:text-base">{payment.email}</span>
                                            </div>
                                        </td>
                                        <td className="bg-slate-50 group-hover:bg-slate-100 text-center">
                                            <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                Food Order
                                            </span>
                                        </td>
                                        <td className="bg-slate-50 group-hover:bg-slate-100 text-center">
                                            <div className="flex items-center justify-center gap-1 text-[#D1A054] font-black text-lg">
                                                <FaDollarSign className="text-xs" />
                                                <span>{payment.price.toFixed(2)}</span>
                                            </div>
                                        </td>
                                        <td className="bg-slate-50 group-hover:bg-slate-100 rounded-r-2xl pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2 text-slate-500">
                                                <FaCalendarAlt className="text-[#D1A054] text-xs" />
                                                <span className="text-sm font-medium">
                                                    {new Date(payment.date).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View: Cards (Hidden on Desktop) */}
                    <div className="md:hidden space-y-4">
                        {payments.map((payment) => (
                            <div key={payment._id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                                {/* Side accent for "Verified/Paid" status */}
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#D1A054]"></div>
                                
                                <div className="flex justify-between items-start mb-4">
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Billing Account</p>
                                        <p className="font-bold text-slate-700 text-xs truncate">{payment.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</p>
                                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase">Paid</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-slate-200/60">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-[#D1A054] text-xs" />
                                        <span className="text-xs font-semibold text-slate-500">
                                            {new Date(payment.date).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[#D1A054] font-black text-xl">
                                        <FaDollarSign className="text-sm" />
                                        <span>{payment.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {payments.length === 0 && (
                        <div className="text-center py-16 lg:py-24">
                            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <FaHistory className="text-slate-200 text-3xl" />
                            </div>
                            <h4 className="text-xl font-cinzel font-black text-slate-300 uppercase">No transactions found</h4>
                            <p className="text-slate-400 text-sm mt-1 px-6">Your payment records will appear here once you place an order.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;