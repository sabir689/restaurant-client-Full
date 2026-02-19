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
        <div className="max-w-6xl mx-auto px-4 py-8 lg:p-10 min-h-screen">
            {/* Page Title Section */}
            <div className="text-center mb-8 lg:mb-12">
                <p className="text-[#D1A054] italic text-sm lg:text-lg mb-2">--- My Cart ---</p>
                <h2 className="text-3xl lg:text-5xl font-black font-cinzel text-slate-900 tracking-tighter uppercase">
                    Wanna add <span className="text-[#D1A054]">More?</span>
                </h2>
            </div>

            <div className="bg-white rounded-3xl lg:rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                
                {/* Responsive Summary Bar */}
                <div className="bg-slate-900 p-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="bg-[#D1A054]/20 p-3 lg:p-4 rounded-2xl">
                            <FaShoppingBag className="text-[#D1A054] text-xl lg:text-2xl" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Selected Items</p>
                            <h3 className="text-white text-xl lg:text-2xl font-black font-cinzel leading-none">{cart.length}</h3>
                        </div>
                    </div>

                    <div className="hidden md:block h-12 w-px bg-slate-800"></div>

                    <div className="w-full md:w-auto border-y border-slate-800 py-4 md:border-none md:py-0">
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest text-center md:text-left">Total Balance</p>
                        <h3 className="text-[#D1A054] text-2xl lg:text-3xl font-black font-cinzel leading-none text-center md:text-left">${totalPrice.toFixed(2)}</h3>
                    </div>

                    {cart.length ? (
                        <Link 
                            to="/dashboard/payment" 
                            state={{ price: totalPrice, cartIds: cart.map(item => item._id) }}
                            className="w-full md:w-auto"
                        >
                            <button className="w-full bg-[#D1A054] hover:bg-[#b88d4a] text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#D1A054]/20 uppercase text-xs lg:text-sm tracking-widest">
                                Checkout Now <FaArrowRight className="text-xs" />
                            </button>
                        </Link>
                    ) : (
                        <button disabled className="w-full md:w-auto bg-slate-800 text-slate-500 px-10 py-4 rounded-2xl font-bold uppercase text-xs tracking-widest">Empty Cart</button>
                    )}
                </div>

                <div className="p-4 lg:p-8">
                    {/* Desktop View: Table (Hidden on small screens) */}
                    <div className="hidden md:block overflow-x-auto">
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
                    </div>

                    {/* Mobile View: Stacked Cards (Hidden on medium/large screens) */}
                    <div className="md:hidden space-y-4">
                        {cart.map((item) => (
                            <div key={item._id} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="avatar">
                                    <div className="mask mask-squircle w-20 h-20 shadow-md ring-2 ring-white">
                                        <img src={item.image} alt={item.name} className="object-cover" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-black text-slate-800 font-cinzel text-sm truncate uppercase">{item.name}</h4>
                                    <p className="text-[#D1A054] font-black mt-1">${item.price.toFixed(2)}</p>
                                </div>
                                <button 
                                    onClick={() => handleDelete(item._id)}
                                    className="p-4 bg-white text-red-500 shadow-sm border border-red-50 rounded-xl active:bg-red-500 active:text-white transition-colors"
                                    aria-label="Delete item"
                                >
                                    <FaTrashAlt size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    {/* Empty State UI */}
                    {cart.length === 0 && (
                        <div className="text-center py-16 lg:py-24">
                            <div className="bg-slate-50 w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaShoppingBag className="text-slate-200 text-3xl lg:text-4xl" />
                            </div>
                            <h4 className="text-xl lg:text-2xl font-cinzel font-black text-slate-300 uppercase tracking-widest">Your cart is empty</h4>
                            <Link to="/order/salad" className="text-[#D1A054] font-bold mt-4 inline-block hover:underline underline-offset-8">
                                Explore Our Menu
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;