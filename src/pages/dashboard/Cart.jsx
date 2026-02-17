import { FaTrashAlt, FaShoppingBag, FaArrowRight } from "react-icons/fa";
import Swal from "sweetalert2";
import useCart from "../../hooks/useCart";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";

const Cart = () => {
    const [cart, refetch] = useCart();
    const totalPrice = cart.reduce((total, item) => total + item.price, 0);
    const axiosSecure = useAxiosSecure();

    const handleDelete = id => {
        Swal.fire({
            title: "Remove Item?",
            text: "This delicious dish will leave your cart!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#D1A054",
            cancelButtonColor: "#1e293b",
            confirmButtonText: "Yes, remove it!",
            customClass: {
                popup: 'rounded-3xl',
                confirmButton: 'rounded-xl px-6 py-3',
                cancelButton: 'rounded-xl px-6 py-3'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/carts/${id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            refetch();
                            Swal.fire({
                                title: "Removed!",
                                icon: "success",
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                    })
            }
        });
    }

    return (
        <div className="max-w-6xl mx-auto p-4 lg:p-10 min-h-screen">
            {/* Page Title Section */}
            <div className="text-center mb-12">
                <p className="text-[#D1A054] italic text-lg mb-2">--- My Cart ---</p>
                <h2 className="text-4xl lg:text-5xl font-black font-cinzel text-slate-900 tracking-tighter uppercase">
                    Wanna add <span className="text-[#D1A054]">More?</span>
                </h2>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                
                {/* Dynamic Summary Bar */}
                <div className="bg-slate-900 p-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#D1A054]/20 p-4 rounded-2xl">
                            <FaShoppingBag className="text-[#D1A054] text-2xl" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Selected Items</p>
                            <h3 className="text-white text-2xl font-black font-cinzel leading-none">{cart.length}</h3>
                        </div>
                    </div>

                    <div className="h-px w-full md:w-px md:h-12 bg-slate-800"></div>

                    <div>
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest text-center md:text-left">Total Balance</p>
                        <h3 className="text-[#D1A054] text-3xl font-black font-cinzel leading-none">${totalPrice.toFixed(2)}</h3>
                    </div>

                    {cart.length ? (
                        <Link 
                            to="/dashboard/payment" 
                            state={{ price: totalPrice, cartIds: cart.map(item => item._id) }}
                            className="w-full md:w-auto"
                        >
                            <button className="w-full bg-[#D1A054] hover:bg-[#b88d4a] text-white px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#D1A054]/20 uppercase text-sm tracking-widest">
                                Checkout Now <FaArrowRight className="text-xs" />
                            </button>
                        </Link>
                    ) : (
                        <button disabled className="btn-disabled bg-slate-800 text-slate-500 px-10 py-4 rounded-2xl font-bold uppercase text-xs tracking-widest">Empty Cart</button>
                    )}
                </div>

                {/* Table Section */}
                <div className="p-4 lg:p-8">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="table w-full border-separate border-spacing-y-3">
                            <thead>
                                <tr className="text-slate-400 border-none uppercase text-[10px] tracking-[0.2em] font-black">
                                    <th className="bg-transparent pl-6">#</th>
                                    <th className="bg-transparent">Dish</th>
                                    <th className="bg-transparent">Name</th>
                                    <th className="bg-transparent">Price</th>
                                    <th className="bg-transparent pr-6">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, index) => (
                                    <tr key={item._id} className="group shadow-sm hover:shadow-md transition-all duration-300">
                                        <td className="bg-slate-50 group-hover:bg-slate-100 rounded-l-2xl pl-6 py-6 font-black text-slate-400">
                                            {index + 1}
                                        </td>
                                        <td className="bg-slate-50 group-hover:bg-slate-100">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-16 h-16 ring-4 ring-white shadow-lg">
                                                    <img src={item.image} alt={item.name} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="bg-slate-50 group-hover:bg-slate-100 font-bold text-slate-700 font-cinzel">
                                            {item.name}
                                        </td>
                                        <td className="bg-slate-50 group-hover:bg-slate-100 font-black text-slate-900">
                                            ${item.price.toFixed(2)}
                                        </td>
                                        <td className="bg-slate-50 group-hover:bg-slate-100 rounded-r-2xl pr-6">
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 transform group-hover:rotate-6"
                                            >
                                                <FaTrashAlt size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {cart.length === 0 && (
                            <div className="text-center py-24">
                                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaShoppingBag className="text-slate-200 text-4xl" />
                                </div>
                                <h4 className="text-2xl font-cinzel font-black text-slate-300 uppercase tracking-widest">Your cart is empty</h4>
                                <Link to="/order/salad" className="text-[#D1A054] font-bold mt-4 inline-block hover:underline underline-offset-8">
                                    Explore Our Menu
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;