import { CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaLock, FaShieldAlt, FaCheckCircle, FaCreditCard } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useCart from "../../hooks/useCart";

const CheckoutForm = ({ price, cartIds, bookingId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [, refetch] = useCart();
    const axiosSecure = useAxiosSecure();

    const [clientSecret, setClientSecret] = useState("");
    const [processing, setProcessing] = useState(false);
    const [cardError, setCardError] = useState("");

    useEffect(() => {
        if (price > 0) {
            axiosSecure.post("/create-payment-intent", { price })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => {
                    console.error("Stripe Secret Error:", err);
                    setCardError("Could not connect to Stripe. Please refresh.");
                });
        }
    }, [price, axiosSecure]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        const card = elements.getElement(CardNumberElement);
        if (card == null) return;

        setProcessing(true);
        setCardError("");

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    email: user?.email || 'anonymous',
                    name: user?.displayName || 'anonymous',
                },
            },
        });

        if (error) {
            setCardError(error.message);
            setProcessing(false);
        } else {
            if (paymentIntent.status === "succeeded") {
                const payment = {
                    email: user?.email,
                    transactionId: paymentIntent.id,
                    price,
                    date: new Date(),
                    cartIds: cartIds,
                    bookingId: bookingId,
                    status: 'paid'
                };

                const res = await axiosSecure.post('/payments', payment);
                
                if (res.data?.paymentResult?.insertedId) {
                    refetch();
                    Swal.fire({
                        title: "Payment Successful!",
                        text: `Transaction: ${paymentIntent.id}`,
                        icon: "success",
                        confirmButtonColor: '#D1A054',
                    });
                    
                    if (bookingId) {
                        navigate("/dashboard/mybookings");
                    } else {
                        navigate("/dashboard/paymentHistory");
                    }
                }
            }
            setProcessing(false);
        }
    };

    const elementOptions = {
        style: {
            base: {
                fontSize: '16px', // Prevents iOS auto-zoom on focus
                color: '#1e293b',
                fontFamily: '"Inter", sans-serif',
                '::placeholder': { color: '#94a3b8' },
            },
            invalid: { color: '#ef4444' },
        },
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-white rounded-3xl lg:rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100 transition-all duration-300">
            
            {/* Header Section - Adjusted padding for mobile */}
            <div className="bg-slate-900 p-6 lg:p-10 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-black font-cinzel tracking-tight uppercase">Checkout</h2>
                    <p className="text-slate-400 text-[9px] lg:text-[10px] mt-1 uppercase tracking-[0.2em] font-bold">Secure Stripe Gateway</p>
                </div>
                <div className="bg-[#D1A054] p-3 lg:p-4 rounded-xl lg:rounded-2xl shadow-lg shadow-[#D1A054]/20 transform rotate-3">
                    <FaShieldAlt className="text-white text-xl lg:text-2xl" />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 lg:p-10 space-y-6 lg:space-y-8">
                {/* User Info Card */}
                <div className="bg-slate-50 p-3 lg:p-4 rounded-2xl border border-dashed border-slate-200 flex items-center gap-3 lg:gap-4">
                    <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-full flex items-center justify-center text-[#D1A054] shadow-sm">
                        <FaCreditCard className="text-sm lg:text-base" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[9px] lg:text-[10px] uppercase font-bold text-slate-400 tracking-wider">Paying as</p>
                        <p className="text-xs lg:text-sm font-bold text-slate-700 truncate">{user?.email}</p>
                    </div>
                </div>

                <div className="space-y-4 lg:space-y-5">
                    {/* Card Number Input */}
                    <div>
                        <label className="text-[9px] lg:text-[10px] font-black text-slate-500 uppercase ml-1 mb-1.5 block tracking-widest font-cinzel">Card Number</label>
                        <div className="p-3.5 lg:p-4 border-2 border-slate-100 rounded-xl lg:rounded-2xl bg-slate-50 focus-within:border-[#D1A054] focus-within:bg-white transition-all shadow-inner shadow-slate-100/50">
                            <CardNumberElement options={elementOptions} />
                        </div>
                    </div>

                    {/* Expiry and CVC Row - Stacks on extra small screens if needed, though grid-cols-2 is usually fine */}
                    <div className="grid grid-cols-2 gap-3 lg:gap-5">
                        <div>
                            <label className="text-[9px] lg:text-[10px] font-black text-slate-500 uppercase ml-1 mb-1.5 block tracking-widest font-cinzel">Expiry</label>
                            <div className="p-3.5 lg:p-4 border-2 border-slate-100 rounded-xl lg:rounded-2xl bg-slate-50 focus-within:border-[#D1A054] focus-within:bg-white transition-all shadow-inner shadow-slate-100/50">
                                <CardExpiryElement options={elementOptions} />
                            </div>
                        </div>
                        <div>
                            <label className="text-[9px] lg:text-[10px] font-black text-slate-500 uppercase ml-1 mb-1.5 block tracking-widest font-cinzel">CVC</label>
                            <div className="p-3.5 lg:p-4 border-2 border-slate-100 rounded-xl lg:rounded-2xl bg-slate-50 focus-within:border-[#D1A054] focus-within:bg-white transition-all shadow-inner shadow-slate-100/50">
                                <CardCvcElement options={elementOptions} />
                            </div>
                        </div>
                    </div>
                </div>

                {cardError && (
                    <div className="bg-red-50 text-red-500 text-[10px] lg:text-xs font-bold p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-red-100 flex items-center gap-2 animate-pulse">
                        <span className="flex-shrink-0">⚠️</span> {cardError}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!stripe || !clientSecret || processing}
                    className="w-full bg-[#D1A054] hover:bg-[#b88d4a] disabled:bg-slate-200 disabled:text-slate-400 text-white py-4 lg:py-5 rounded-xl lg:rounded-2xl font-black text-base lg:text-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg lg:shadow-xl shadow-[#D1A054]/30 uppercase tracking-widest"
                >
                    {processing ? <span className="loading loading-spinner loading-md"></span> : <><FaLock className="text-sm" /> Complete Payment</>}
                </button>

                {/* Secure Footer */}
                <div className="flex flex-col items-center gap-2 lg:gap-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-emerald-500 text-[10px] lg:text-xs" />
                        <span className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">PCI-DSS Compliant</span>
                    </div>
                    <p className="text-[8px] lg:text-[9px] text-slate-300 text-center px-4">
                        By clicking "Complete Payment", you authorize the charge of <span className="font-bold text-slate-400">${price?.toFixed(2)}</span>.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default CheckoutForm;