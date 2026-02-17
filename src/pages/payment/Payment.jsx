import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useLocation } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";

// Replace with your actual Stripe Publishable Key from .env
const stripePromise = loadStripe(import.meta.env.VITE_payment_Key);

const Payment = () => {
    const location = useLocation();
    
    // Support both Cart (cartIds) and Reservations (bookingId)
    const price = location.state?.price || 0;
    const cartIds = location.state?.cartIds || [];
    const bookingId = location.state?.bookingId || null;

    return (
        <div className="p-4 lg:p-10 bg-slate-50 min-h-screen">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-black text-center mb-10 text-slate-900 tracking-tight font-cinzel">
                    SECURE <span className="text-lime-500">PAYMENT</span>
                </h2>
                
                <div className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-100">
                    {/* Dark Header/Invoice Section */}
                    <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em] mb-1">
                                {bookingId ? "Reservation Deposit" : "Order Summary"}
                            </p>
                            <p className="text-lg font-mono text-lime-400 underline decoration-lime-400/30 underline-offset-4">
                                {bookingId ? `Booking ID: ...${bookingId.slice(-6)}` : "Stripe Credit Card"}
                            </p>
                        </div>
                        <div className="md:text-right">
                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em] mb-1">Total Amount</p>
                            <p className="text-4xl font-black text-lime-400">{price.toFixed(2)} <span className="text-sm">USD</span></p>
                        </div>
                    </div>

                    <div className="p-10">
                        {price > 0 ? (
                            <Elements stripe={stripePromise}>
                                <CheckoutForm 
                                    price={price} 
                                    cartIds={cartIds} 
                                    bookingId={bookingId} 
                                />
                            </Elements>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-red-500 font-bold text-xl">Amount is missing.</p>
                                <p className="text-slate-400">Please return and try again.</p>
                            </div>
                        )}
                    </div>
                </div>
                
                <p className="text-center mt-8 text-slate-400 text-sm font-medium">
                    Protected by Stripe. 256-bit SSL Encrypted Transaction.
                </p>
            </div>
        </div>
    );
};

export default Payment;