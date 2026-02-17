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
                    bookingId: bookingId, // This is key for reservations
                    status: 'paid'
                };

                const res = await axiosSecure.post('/payments', payment);
                
                if (res.data?.paymentResult?.insertedId) {
                    refetch(); // Clear cart items if any
                    Swal.fire({
                        title: "Payment Successful!",
                        text: `Transaction: ${paymentIntent.id}`,
                        icon: "success",
                        confirmButtonColor: '#D1A054',
                    });
                    
                    // Redirect based on what was paid
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
                fontSize: '16px',
                color: '#1e293b',
                fontFamily: '"Inter", sans-serif',
                '::placeholder': { color: '#94a3b8' },
            },
            invalid: { color: '#ef4444' },
        },
    };

    return (
        <div className="max-w-lg mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">
            <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black font-cinzel tracking-tight uppercase">Checkout</h2>
                    <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-[0.2em] font-bold">Secure Stripe Gateway</p>
                </div>
                <div className="bg-[#D1A054] p-4 rounded-2xl shadow-lg shadow-[#D1A054]/20 transform rotate-3">
                    <FaShieldAlt className="text-white text-2xl" />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#D1A054] shadow-sm">
                        <FaCreditCard />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Paying as</p>
                        <p className="text-sm font-bold text-slate-700">{user?.email}</p>
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1 mb-2 block tracking-widest font-cinzel">Card Number</label>
                        <div className="p-4 border-2 border-slate-100 rounded-2xl bg-slate-50 focus-within:border-[#D1A054] focus-within:bg-white transition-all">
                            <CardNumberElement options={elementOptions} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1 mb-2 block tracking-widest font-cinzel">Expiry</label>
                            <div className="p-4 border-2 border-slate-100 rounded-2xl bg-slate-50 focus-within:border-[#D1A054] focus-within:bg-white transition-all">
                                <CardExpiryElement options={elementOptions} />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1 mb-2 block tracking-widest font-cinzel">CVC</label>
                            <div className="p-4 border-2 border-slate-100 rounded-2xl bg-slate-50 focus-within:border-[#D1A054] focus-within:bg-white transition-all">
                                <CardCvcElement options={elementOptions} />
                            </div>
                        </div>
                    </div>
                </div>

                {cardError && (
                    <div className="bg-red-50 text-red-500 text-xs font-bold p-4 rounded-2xl border border-red-100 flex items-center gap-2">
                        {cardError}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!stripe || !clientSecret || processing}
                    className="w-full bg-[#D1A054] hover:bg-[#b88d4a] disabled:bg-slate-200 disabled:text-slate-400 text-white py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-[#D1A054]/30 uppercase tracking-widest"
                >
                    {processing ? <span className="loading loading-spinner"></span> : <><FaLock /> Complete Payment</>}
                </button>

                <div className="flex flex-col items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-emerald-500 text-sm" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PCI-DSS Compliant</span>
                    </div>
                    <p className="text-[9px] text-slate-300 text-center px-6">
                        By clicking "Complete Payment", you authorize the charge of ${price?.toFixed(2)}.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default CheckoutForm;